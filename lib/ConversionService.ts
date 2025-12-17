import { ConvertRequest, ConvertEvent, WorkerRequest } from './types';

export type ConversionProgressCallback = (progress: number, bytesWritten?: number) => void;
export type ConversionErrorCallback = (error: string) => void;
export type ConversionCompleteCallback = (result: any) => void;

export class ConversionService {
  private worker: Worker | null = null;
  private jobCallbacks: Map<string, {
    onProgress?: ConversionProgressCallback;
    onError?: ConversionErrorCallback;
    onComplete?: ConversionCompleteCallback;
  }> = new Map();
  private jobIdCounter = 0;

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    if (typeof window === 'undefined') return; // Skip in SSR

    try {
      this.worker = new Worker('/workers/conversion.worker.js');
      this.worker.addEventListener('message', this.handleWorkerMessage.bind(this));
      this.worker.addEventListener('error', this.handleWorkerError.bind(this));
    } catch (error) {
      console.error('Failed to initialize conversion worker:', error);
    }
  }

  private handleWorkerMessage(event: MessageEvent<ConvertEvent>) {
    const message = event.data;
    const callbacks = this.jobCallbacks.get(message.jobId);

    if (!callbacks) return;

    switch (message.type) {
      case 'progress':
        callbacks.onProgress?.(message.progress01, message.bytesWritten);
        break;

      case 'error':
        callbacks.onError?.(message.message);
        this.jobCallbacks.delete(message.jobId);
        break;

      case 'done':
        callbacks.onComplete?.(message.result);
        this.jobCallbacks.delete(message.jobId);
        break;

      case 'canceled':
        callbacks.onError?.('Conversion was canceled');
        this.jobCallbacks.delete(message.jobId);
        break;

      case 'capabilities':
        console.log('Encoder capabilities:', message.canEncode);
        break;

      case 'ready':
        console.log('Worker ready for job:', message.jobId);
        break;

      case 'warning':
        console.warn('Conversion warning:', message.message);
        break;
    }
  }

  private handleWorkerError(error: ErrorEvent) {
    console.error('Worker error:', error);
    // Notify all active jobs about the error
    this.jobCallbacks.forEach((callbacks) => {
      callbacks.onError?.('Worker crashed: ' + error.message);
    });
    this.jobCallbacks.clear();

    // Attempt to restart the worker
    this.initWorker();
  }

  private generateJobId(): string {
    return `job-${++this.jobIdCounter}-${Date.now()}`;
  }

  public async convertFile(
    file: File,
    options: {
      preset?: 'low' | 'medium' | 'high';
      maxDimension?: number;
      streamMode?: boolean;
    } = {},
    callbacks: {
      onProgress?: ConversionProgressCallback;
      onError?: ConversionErrorCallback;
      onComplete?: ConversionCompleteCallback;
    } = {}
  ): Promise<string> {
    if (!this.worker) {
      throw new Error('Worker not initialized');
    }

    const jobId = this.generateJobId();
    this.jobCallbacks.set(jobId, callbacks);

    // Determine if we can use streaming mode
    const canStream = options.streamMode &&
      typeof window !== 'undefined' &&
      'showSaveFilePicker' in window;

    let writableStream: WritableStream | undefined;

    // If streaming mode is requested and available, get the file handle
    if (canStream) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: file.name.replace(/\.[^/.]+$/, '') + '_converted.mp4',
          types: [{
            description: 'MP4 Video',
            accept: { 'video/mp4': ['.mp4'] }
          }]
        });
        const writable = await handle.createWritable();
        writableStream = writable;
      } catch (error) {
        console.warn('Failed to get file handle for streaming, falling back to buffer mode:', error);
      }
    }

    const request: ConvertRequest = {
      type: 'convert',
      jobId,
      file,
      output: {
        container: 'mp4',
        profile: 'compat',
        preset: options.preset || 'medium',
        maxDimension: options.maxDimension
      },
      sink: writableStream ? {
        mode: 'stream',
        writableStream
      } : {
        mode: 'buffer'
      }
    };

    // Post message to worker
    this.worker.postMessage(request);

    return jobId;
  }

  public cancelConversion(jobId: string) {
    if (!this.worker) return;

    this.worker.postMessage({
      type: 'cancel',
      jobId
    } as WorkerRequest);
  }

  public dispose() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.jobCallbacks.clear();
  }

  // Check if browser supports necessary features
  public static checkSupport(): {
    supported: boolean;
    webCodecs: boolean;
    streaming: boolean;
    message?: string;
  } {
    const webCodecs = typeof window !== 'undefined' &&
      'VideoEncoder' in window &&
      'AudioEncoder' in window;

    const streaming = typeof window !== 'undefined' &&
      'showSaveFilePicker' in window;

    const supported = webCodecs;

    return {
      supported,
      webCodecs,
      streaming,
      message: !supported
        ? 'Your browser does not support WebCodecs. Please use Chrome, Edge, or Safari.'
        : undefined
    };
  }
}