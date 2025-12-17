import { ConversionService } from './ConversionService';
import { useConverterStore } from '../store/useConverterStore';
import { QueueItem, ConversionSettings, QualityPreset } from '../store/types';
import { trackConversion } from '../analytics';

export interface QueueManagerOptions {
  onQueueComplete?: () => void;
  onItemComplete?: (item: QueueItem) => void;
  onItemError?: (item: QueueItem, error: Error) => void;
}

export class ConversionQueueManager {
  private static instance: ConversionQueueManager | null = null;
  private conversionService: ConversionService;
  private isProcessing = false;
  private isPaused = false;
  private currentJobId: string | null = null;
  private currentJob: string | null = null; // jobId from ConversionService
  private options: QueueManagerOptions;
  private store = useConverterStore.getState();

  private constructor(options: QueueManagerOptions = {}) {
    this.conversionService = new ConversionService();
    this.options = options;

    // Subscribe to store changes
    useConverterStore.subscribe((state) => {
      this.store = state;
      this.isPaused = state.isPaused;
    });
  }

  static getInstance(options?: QueueManagerOptions): ConversionQueueManager {
    if (!ConversionQueueManager.instance) {
      ConversionQueueManager.instance = new ConversionQueueManager(options);
    }
    return ConversionQueueManager.instance;
  }

  async startProcessing(): Promise<void> {
    if (this.isProcessing) {
      console.log('Queue processing already in progress');
      return;
    }

    this.isProcessing = true;
    this.isPaused = false;
    this.store.startProcessing();

    await this.processQueue();
  }

  pauseProcessing(): void {
    this.isPaused = true;
    this.store.pauseProcessing();
  }

  resumeProcessing(): void {
    this.isPaused = false;
    this.store.resumeProcessing();
    if (this.isProcessing) {
      this.processQueue();
    }
  }

  async cancelCurrent(): Promise<void> {
    if (this.currentJob) {
      this.conversionService.cancelConversion(this.currentJob);
      this.currentJob = null;
    }
    if (this.currentJobId) {
      this.store.updateFileStatus(this.currentJobId, 'cancelled');
      this.currentJobId = null;
      this.store.setCurrentJob(null);
    }

    // Check if there are more items to process
    const hasMorePending = this.store.queue.some(item => item.status === 'pending');
    if (!hasMorePending) {
      // No more items, stop processing
      this.isProcessing = false;
      this.store.isProcessing = false;
    }
  }

  private async processQueue(): Promise<void> {
    while (true) {
      // Check if paused
      if (this.isPaused) {
        await this.waitForResume();
        if (!this.isProcessing) break;
      }

      // Get next pending item
      const nextItem = this.getNextPendingItem();

      if (!nextItem) {
        // Queue is empty or all items processed
        this.isProcessing = false;
        this.store.isProcessing = false; // Ensure store state is synced
        this.store.setCurrentJob(null);
        if (this.options.onQueueComplete) {
          this.options.onQueueComplete();
        }
        break;
      }

      // Process the item
      await this.processItem(nextItem);

      // After processing, check if we should continue
      if (!this.isProcessing) {
        // Processing was stopped (cancelled or error)
        this.store.isProcessing = false;
        break;
      }
    }
  }

  private async waitForResume(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!this.isPaused || !this.isProcessing) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  private getNextPendingItem(): QueueItem | null {
    return this.store.queue.find(item => item.status === 'pending') || null;
  }

  private async processItem(item: QueueItem): Promise<void> {
    this.currentJobId = item.id;
    this.store.setCurrentJob(item.id);
    this.store.updateFileStatus(item.id, 'processing');

    // Track conversion started
    trackConversion.started(item.file.name, item.file.size);

    try {
      // Get settings (merge global with file-specific overrides)
      const fileSettings = this.store.fileOverrides.get(item.id);
      const settings = {
        ...this.store.globalSettings,
        ...fileSettings,
      };

      // Convert settings to ConversionService options format
      const conversionOptions = this.mapSettingsToOptions(settings);

      // Start conversion using existing service
      this.currentJob = await this.conversionService.convertFile(
        item.file,
        conversionOptions,
        {
          onProgress: (progress, bytesWritten) => {
            const percent = progress * 100; // Convert 0-1 to 0-100
            const startTime = item.startedAt?.getTime() || Date.now();
            const timeElapsed = (Date.now() - startTime) / 1000;
            const estimatedTotal = timeElapsed / (progress || 0.01);
            const estimatedTimeRemaining = Math.max(0, estimatedTotal - timeElapsed);

            console.log(`Progress update for ${item.id}: ${percent}% (raw: ${progress})`);

            this.store.updateProgress(item.id, {
              percent: percent,
              bytesProcessed: bytesWritten || 0,
              timeElapsed,
              estimatedTimeRemaining,
            });
          },
          onError: (error) => {
            console.error('Conversion error:', error);
            const errorMessage = error || 'Unknown error';
            this.store.updateFileStatus(item.id, 'failed', errorMessage);

            // Track conversion failure
            trackConversion.failed(item.file.name, errorMessage);

            // Clear current job state
            this.currentJobId = null;
            this.currentJob = null;
            this.store.setCurrentJob(null);

            // Check if there are more items to process
            const hasMorePending = this.store.queue.some(queueItem =>
              queueItem.status === 'pending' && queueItem.id !== item.id
            );

            if (!hasMorePending) {
              // No more items, stop processing
              this.isProcessing = false;
              this.store.isProcessing = false;
            }

            if (this.options.onItemError) {
              this.options.onItemError(item, typeof error === 'string' ? new Error(error) : error);
            }
          },
          onComplete: (result) => {
            // Handle completion based on mode
            if (result.mode === 'buffer' && result.buffer) {
              const blob = new Blob([result.buffer], { type: result.mime });
              this.store.completeFile(item.id, blob, result.buffer.byteLength);

              // Track conversion completion
              const processingTime = item.startedAt ? (Date.now() - item.startedAt.getTime()) / 1000 : 0;
              trackConversion.completed(item.file.name, processingTime);

              if (this.options.onItemComplete) {
                this.options.onItemComplete(item);
              }
            } else if (result.mode === 'stream') {
              // For streaming mode, the file is already saved to disk
              // Create a dummy blob for consistency
              const dummyBlob = new Blob([], { type: result.mime });
              this.store.completeFile(item.id, dummyBlob, 0);
              if (this.options.onItemComplete) {
                this.options.onItemComplete(item);
              }
            }
          },
        }
      );

      // Wait for completion (the service handles everything internally)
      // The callbacks above will be triggered by the service
    } catch (error) {
      console.error('Error processing item:', error);
      this.store.updateFileStatus(item.id, 'failed', (error as Error).message);
      if (this.options.onItemError) {
        this.options.onItemError(item, error as Error);
      }
    } finally {
      this.currentJobId = null;
      this.currentJob = null;
      this.store.setCurrentJob(null);

      // Check if there are more items to process
      const hasMorePending = this.store.queue.some(item => item.status === 'pending');
      if (!hasMorePending) {
        // No more items, stop processing
        this.isProcessing = false;
        this.store.isProcessing = false;
      }
    }
  }

  private mapSettingsToOptions(settings: ConversionSettings): any {
    // Map quality preset to bitrates
    const bitrateMap: Record<QualityPreset, { video: number; audio: number }> = {
      low: { video: 2_000_000, audio: 96_000 },
      medium: { video: 5_000_000, audio: 128_000 },
      high: { video: 10_000_000, audio: 192_000 },
    };

    const bitrates = bitrateMap[settings.quality];

    // Map resolution to max dimension
    const resolutionMap: Record<string, number | undefined> = {
      original: undefined,
      '1080p': 1920,
      '720p': 1280,
      '480p': 854,
    };

    const maxDimension = resolutionMap[settings.resolution];

    return {
      preset: settings.quality,
      maxDimension,
      // Note: streamMode will be determined by the ConversionService based on browser capabilities
    };
  }

  // Test mode methods
  getQueueStatus() {
    return {
      queue: this.store.queue,
      isProcessing: this.isProcessing,
      isPaused: this.isPaused,
      currentJobId: this.currentJobId,
      completedCount: this.store.completedFiles.length,
    };
  }

  async injectTestFiles(mockFiles: Array<{ name: string; size: number; type: string }>) {
    const files = mockFiles.map(
      (mockFile) =>
        new File([new ArrayBuffer(mockFile.size)], mockFile.name, {
          type: mockFile.type,
        })
    );
    this.store.addFiles(files);
  }
}