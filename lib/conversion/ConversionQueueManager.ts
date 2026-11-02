import { ConversionService, ConversionOptions } from './ConversionService';
import { useConverterStore } from '../store/useConverterStore';
import { ConversionSettings, QueueItem, ResolutionCap } from '../store/types';
import { trackConversion } from '../analytics';

const RESOLUTION_BOX: Record<ResolutionCap, { long: number; short: number } | null> = {
  original: null,
  '1080p': { long: 1920, short: 1080 },
  '720p': { long: 1280, short: 720 },
  '480p': { long: 854, short: 480 },
};

function toOptions(settings: ConversionSettings): ConversionOptions {
  const box = RESOLUTION_BOX[settings.resolution];
  return {
    preset: settings.quality,
    maxLongEdge: box?.long,
    maxShortEdge: box?.short,
  };
}

/**
 * Converts queued files one at a time. All state lives in the store so that
 * the UI and this class can never disagree.
 */
export class ConversionQueueManager {
  private static instance: ConversionQueueManager | null = null;
  private service = new ConversionService();
  private running = false;
  private workerJobId: string | null = null;
  private resumeWaiter: (() => void) | null = null;

  static getInstance(): ConversionQueueManager {
    if (!ConversionQueueManager.instance) {
      ConversionQueueManager.instance = new ConversionQueueManager();
    }
    return ConversionQueueManager.instance;
  }

  private get store() {
    return useConverterStore.getState();
  }

  async startProcessing(): Promise<void> {
    if (this.running) return;
    this.running = true;
    this.store.startProcessing();

    try {
      for (;;) {
        const next = this.store.queue.find((item) => item.status === 'pending');
        if (!next) break;
        if (this.store.isPaused) {
          await new Promise<void>((resolve) => (this.resumeWaiter = resolve));
          continue;
        }
        await this.processItem(next);
      }
    } finally {
      this.running = false;
      this.store.stopProcessing();
    }
  }

  // Pausing lets the running file finish, and holds the ones after it.
  pauseProcessing(): void {
    this.store.pauseProcessing();
  }

  resumeProcessing(): void {
    this.store.resumeProcessing();
    this.resumeWaiter?.();
    this.resumeWaiter = null;
  }

  cancelCurrent(): void {
    if (this.workerJobId) this.service.cancelConversion(this.workerJobId);
  }

  /** Resolves when the file has reached a final state, whatever that state is. */
  private processItem(item: QueueItem): Promise<void> {
    const { store } = this;
    const startedAt = Date.now();
    store.setCurrentJob(item.id);
    store.updateFileStatus(item.id, 'processing');
    trackConversion.started(item.file.size);

    const settings = { ...store.globalSettings, ...store.fileOverrides.get(item.id) };

    return new Promise<void>((resolve) => {
      const finish = () => {
        this.workerJobId = null;
        this.store.setCurrentJob(null);
        resolve();
      };

      try {
        this.workerJobId = this.service.convertFile(item.file, toOptions(settings), {
          onProgress: (progress) => {
            const timeElapsed = (Date.now() - startedAt) / 1000;
            this.store.updateProgress(item.id, {
              percent: progress * 100,
              timeElapsed,
              estimatedTimeRemaining: progress > 0 ? timeElapsed / progress - timeElapsed : undefined,
            });
          },
          onWarning: (code) => this.store.setFileWarning(item.id, code),
          onError: (message) => {
            this.store.updateFileStatus(item.id, 'failed', message);
            trackConversion.failed(message);
            finish();
          },
          onCanceled: () => {
            this.store.updateFileStatus(item.id, 'cancelled');
            finish();
          },
          onComplete: (result) => {
            const blob = new Blob([result.buffer], { type: result.mime });
            this.store.completeFile(item.id, blob, result.buffer.byteLength);
            trackConversion.completed((Date.now() - startedAt) / 1000);
            finish();
          },
        });
      } catch (error) {
        this.store.updateFileStatus(item.id, 'failed', (error as Error).message);
        finish();
      }
    });
  }
}
