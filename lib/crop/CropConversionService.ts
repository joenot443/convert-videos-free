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
  | { type: 'progress'; jobId: string; progress01: number }
  | { type: 'warning'; jobId: string; code: string }
  | { type: 'error'; jobId: string; message: string }
  | { type: 'done'; jobId: string; result: { buffer: ArrayBuffer; mime: string; filename: string } }
  | { type: 'canceled'; jobId: string };

export type CropProgressCallback = (progress: number) => void;
export type CropErrorCallback = (error: string) => void;
export type CropCompleteCallback = (result: { buffer: ArrayBuffer; filename: string }) => void;

interface CropCallbacks {
  onProgress?: CropProgressCallback;
  onWarning?: (code: string) => void;
  onError?: CropErrorCallback;
  onCanceled?: () => void;
  onComplete?: CropCompleteCallback;
}

export class CropConversionService {
  private worker: Worker | null = null;
  private jobCallbacks = new Map<string, CropCallbacks>();
  private jobIdCounter = 0;

  private getWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker('/workers/crop-conversion.worker.js');
      this.worker.addEventListener('message', this.handleWorkerMessage);
      this.worker.addEventListener('error', this.handleWorkerError);
    }
    return this.worker;
  }

  private handleWorkerMessage = (event: MessageEvent<CropConvertEvent>) => {
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
      case 'done':
        this.jobCallbacks.delete(message.jobId);
        callbacks.onComplete?.({ buffer: message.result.buffer, filename: message.result.filename });
        break;
      case 'canceled':
        this.jobCallbacks.delete(message.jobId);
        callbacks.onCanceled?.();
        break;
    }
  };

  // Fires if the worker script fails to load or crashes, for example out of memory.
  private handleWorkerError = (event: ErrorEvent) => {
    console.error('Worker error:', event.message);
    const orphaned = [...this.jobCallbacks.values()];
    this.jobCallbacks.clear();
    this.worker?.terminate();
    this.worker = null; // The next export starts a fresh worker.
    orphaned.forEach((callbacks) =>
      callbacks.onError?.('The exporter stopped unexpectedly. The file may be too large for this device.')
    );
  };

  public convertWithCrop(
    file: File,
    options: {
      preset?: 'low' | 'medium' | 'high';
      crop?: CropOptions;
      trim?: TrimOptions;
    },
    callbacks: CropCallbacks
  ): string {
    const jobId = `crop-job-${++this.jobIdCounter}-${Date.now()}`;
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

    this.getWorker().postMessage(request);
    return jobId;
  }

  public cancelConversion(jobId: string) {
    this.worker?.postMessage({ type: 'cancel', jobId });
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
