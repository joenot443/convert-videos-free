import { ConvertEvent, ConvertRequest, WorkerRequest } from './types';

export interface ConversionResult {
  buffer: ArrayBuffer;
  mime: string;
}

export interface ConversionCallbacks {
  onProgress?: (progress: number) => void;
  onWarning?: (code: string) => void;
  onError?: (error: string) => void;
  onCanceled?: () => void;
  onComplete?: (result: ConversionResult) => void;
}

export interface ConversionOptions {
  preset?: 'low' | 'medium' | 'high';
  maxLongEdge?: number;
  maxShortEdge?: number;
}

export class ConversionService {
  private worker: Worker | null = null;
  private jobCallbacks = new Map<string, ConversionCallbacks>();
  private jobIdCounter = 0;

  private getWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker('/workers/conversion.worker.js');
      this.worker.addEventListener('message', this.handleWorkerMessage);
      this.worker.addEventListener('error', this.handleWorkerError);
    }
    return this.worker;
  }

  private handleWorkerMessage = (event: MessageEvent<ConvertEvent>) => {
    const message = event.data;
    const callbacks = this.jobCallbacks.get(message.jobId);
    if (!callbacks) return;

    switch (message.type) {
      case 'progress':
        callbacks.onProgress?.(message.progress01);
        break;
      case 'warning':
        callbacks.onWarning?.(message.code);
        break;
      case 'error':
        this.jobCallbacks.delete(message.jobId);
        callbacks.onError?.(message.message);
        break;
      case 'canceled':
        this.jobCallbacks.delete(message.jobId);
        callbacks.onCanceled?.();
        break;
      case 'done':
        this.jobCallbacks.delete(message.jobId);
        callbacks.onComplete?.(message.result);
        break;
    }
  };

  // Fires if the worker script fails to load or crashes, for example out of memory.
  private handleWorkerError = (event: ErrorEvent) => {
    console.error('Worker error:', event.message);
    const orphaned = [...this.jobCallbacks.values()];
    this.jobCallbacks.clear();
    this.worker?.terminate();
    this.worker = null; // The next job starts a fresh worker.
    orphaned.forEach((callbacks) =>
      callbacks.onError?.('The converter stopped unexpectedly. The file may be too large for this device.')
    );
  };

  public convertFile(file: File, options: ConversionOptions, callbacks: ConversionCallbacks): string {
    const jobId = `job-${++this.jobIdCounter}-${Date.now()}`;
    this.jobCallbacks.set(jobId, callbacks);

    const request: ConvertRequest = {
      type: 'convert',
      jobId,
      file,
      output: {
        preset: options.preset || 'medium',
        maxLongEdge: options.maxLongEdge,
        maxShortEdge: options.maxShortEdge,
      },
    };
    this.getWorker().postMessage(request);
    return jobId;
  }

  public cancelConversion(jobId: string) {
    this.worker?.postMessage({ type: 'cancel', jobId } as WorkerRequest);
  }

  // Only the video encoder is essential: without AudioEncoder (older Safari)
  // a file still converts, and the user is told the audio was dropped.
  public static checkSupport(): { supported: boolean; message?: string } {
    const supported = typeof window !== 'undefined' && 'VideoEncoder' in window;
    return {
      supported,
      message: supported
        ? undefined
        : 'Your browser does not support WebCodecs. Please use Chrome, Edge, or Safari.',
    };
  }
}
