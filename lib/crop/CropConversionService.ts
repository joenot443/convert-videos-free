/**
 * CropConversionService - Handles video conversion with crop and trim support
 * Extends the messaging pattern from the main ConversionService
 */

export interface CropOptions {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface TrimOptions {
  start: number;
  end: number;
}

export interface CropConvertRequest {
  type: 'convert-crop';
  jobId: string;
  file: File;
  output: {
    container: 'mp4';
    preset: 'low' | 'medium' | 'high';
  };
  crop?: CropOptions;
  trim?: TrimOptions;
}

export type CropConvertEvent =
  | { type: 'ready'; jobId: string }
  | { type: 'progress'; jobId: string; progress01: number; bytesWritten?: number }
  | { type: 'error'; jobId: string; message: string }
  | { type: 'done'; jobId: string; result: { buffer: ArrayBuffer; mime: string; filename: string } }
  | { type: 'canceled'; jobId: string };

export type CropProgressCallback = (progress: number) => void;
export type CropErrorCallback = (error: string) => void;
export type CropCompleteCallback = (result: { buffer: ArrayBuffer; filename: string }) => void;

export class CropConversionService {
  private worker: Worker | null = null;
  private jobCallbacks: Map<string, {
    onProgress?: CropProgressCallback;
    onError?: CropErrorCallback;
    onComplete?: CropCompleteCallback;
  }> = new Map();
  private jobIdCounter = 0;

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    if (typeof window === 'undefined') return;

    try {
      this.worker = new Worker('/workers/crop-conversion.worker.js');
      this.worker.addEventListener('message', this.handleWorkerMessage.bind(this));
      this.worker.addEventListener('error', this.handleWorkerError.bind(this));
    } catch (error) {
      console.error('Failed to initialize crop conversion worker:', error);
    }
  }

  private handleWorkerMessage(event: MessageEvent<CropConvertEvent>) {
    const message = event.data;
    const callbacks = this.jobCallbacks.get(message.jobId);
    if (!callbacks) return;

    switch (message.type) {
      case 'progress':
        callbacks.onProgress?.(message.progress01);
        break;

      case 'error':
        callbacks.onError?.(message.message);
        this.jobCallbacks.delete(message.jobId);
        break;

      case 'done':
        callbacks.onComplete?.({
          buffer: message.result.buffer,
          filename: message.result.filename,
        });
        this.jobCallbacks.delete(message.jobId);
        break;

      case 'canceled':
        callbacks.onError?.('Conversion was canceled');
        this.jobCallbacks.delete(message.jobId);
        break;
    }
  }

  private handleWorkerError(error: ErrorEvent) {
    console.error('Worker error:', error);
    this.jobCallbacks.forEach((callbacks) => {
      callbacks.onError?.('Worker crashed: ' + error.message);
    });
    this.jobCallbacks.clear();
  }

  private generateJobId(): string {
    return `crop-job-${++this.jobIdCounter}-${Date.now()}`;
  }

  public async convertWithCrop(
    file: File,
    options: {
      preset?: 'low' | 'medium' | 'high';
      crop?: CropOptions;
      trim?: TrimOptions;
    } = {},
    callbacks: {
      onProgress?: CropProgressCallback;
      onError?: CropErrorCallback;
      onComplete?: CropCompleteCallback;
    } = {}
  ): Promise<string> {
    if (!this.worker) {
      throw new Error('Worker not initialized');
    }

    const jobId = this.generateJobId();
    this.jobCallbacks.set(jobId, callbacks);

    const request: CropConvertRequest = {
      type: 'convert-crop',
      jobId,
      file,
      output: {
        container: 'mp4',
        preset: options.preset || 'medium',
      },
      crop: options.crop,
      trim: options.trim,
    };

    this.worker.postMessage(request);
    return jobId;
  }

  public cancelConversion(jobId: string) {
    if (!this.worker) return;
    this.worker.postMessage({ type: 'cancel', jobId });
  }

  public dispose() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.jobCallbacks.clear();
  }
}

// Singleton instance
let instance: CropConversionService | null = null;

export function getCropConversionService(): CropConversionService {
  if (!instance) {
    instance = new CropConversionService();
  }
  return instance;
}
