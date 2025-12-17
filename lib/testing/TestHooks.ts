import { ConversionQueueManager } from '../conversion/ConversionQueueManager';
import { useConverterStore } from '../store/useConverterStore';

export interface MockFile {
  name: string;
  size: number;
  type: string;
  content?: ArrayBuffer;
}

export interface QueueStatus {
  queue: any[];
  isProcessing: boolean;
  isPaused: boolean;
  currentJobId: string | null;
  completedCount: number;
}

export interface TestHooks {
  injectFiles: (files: MockFile[]) => void;
  getQueueStatus: () => QueueStatus;
  triggerConversion: () => void;
  triggerAction: (action: string, params?: any) => void;
  getProgress: () => Record<string, any>;
  simulateError: (type: 'conversion' | 'memory' | 'format') => void;
  clearAll: () => void;
}

export class TestHooksImpl implements TestHooks {
  private queueManager: ConversionQueueManager;
  private store = useConverterStore.getState();

  constructor() {
    this.queueManager = ConversionQueueManager.getInstance();

    // Subscribe to store changes
    useConverterStore.subscribe((state) => {
      this.store = state;
    });
  }

  injectFiles(mockFiles: MockFile[]): void {
    const files = mockFiles.map((mockFile) => {
      const content = mockFile.content || new ArrayBuffer(mockFile.size);
      return new File([content], mockFile.name, {
        type: mockFile.type,
        lastModified: Date.now(),
      });
    });

    this.store.addFiles(files);
  }

  getQueueStatus(): QueueStatus {
    return {
      queue: this.store.queue.map(item => ({
        id: item.id,
        name: item.file.name,
        size: item.file.size,
        status: item.status,
        error: item.error,
        progress: this.store.progress.get(item.id),
      })),
      isProcessing: this.store.isProcessing,
      isPaused: this.store.isPaused,
      currentJobId: this.store.currentJobId,
      completedCount: this.store.completedFiles.length,
    };
  }

  triggerConversion(): void {
    this.queueManager.startProcessing();
  }

  triggerAction(action: string, params?: any): void {
    switch (action) {
      case 'start':
        this.queueManager.startProcessing();
        break;
      case 'pause':
        this.queueManager.pauseProcessing();
        break;
      case 'resume':
        this.queueManager.resumeProcessing();
        break;
      case 'cancel':
        this.queueManager.cancelCurrent();
        break;
      case 'retry':
        if (params?.id) {
          this.store.retryFile(params.id);
        }
        break;
      case 'remove':
        if (params?.id) {
          this.store.removeFromQueue(params.id);
        }
        break;
      case 'downloadAll':
        this.store.downloadAll();
        break;
      case 'clearCompleted':
        this.store.clearCompleted();
        break;
      case 'updateSettings':
        if (params) {
          this.store.updateGlobalSettings(params);
        }
        break;
      case 'updateStatus':
        if (params?.id && params?.status) {
          this.store.updateFileStatus(params.id, params.status, params.error);
        }
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  }

  getProgress(): Record<string, any> {
    const progress: Record<string, any> = {};
    this.store.progress.forEach((value, key) => {
      progress[key] = value;
    });
    return progress;
  }

  simulateError(type: 'conversion' | 'memory' | 'format'): void {
    const currentJob = this.store.currentJobId;
    if (!currentJob) {
      console.warn('No current job to simulate error for');
      return;
    }

    let errorMessage = '';
    switch (type) {
      case 'conversion':
        errorMessage = 'Conversion failed: Unknown codec error';
        break;
      case 'memory':
        errorMessage = 'Out of memory: File too large to process';
        break;
      case 'format':
        errorMessage = 'Unsupported format: Cannot decode this file type';
        break;
    }

    this.store.updateFileStatus(currentJob, 'failed', errorMessage);
    this.queueManager.cancelCurrent();
  }

  clearAll(): void {
    this.store.clearQueue();
    this.store.clearCompleted();
  }
}

// Initialize test hooks if in development or test mode
export function initializeTestHooks(): void {
  if (typeof window !== 'undefined') {
    const isDev = process.env.NODE_ENV === 'development';
    const isTest = process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_ENABLE_TEST_MODE === 'true';

    if (isDev || isTest) {
      const testHooks = new TestHooksImpl();
      (window as any).__testMode = testHooks;
      // Also expose the store for testing
      (window as any).useConverterStore = useConverterStore;
      console.log('Test mode initialized');
    }
  }
}