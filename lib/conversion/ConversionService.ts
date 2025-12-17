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
  private activeStreams: Map<string, WritableStreamDefaultWriter> = new Map();
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

  private async handleWorkerMessage(event: MessageEvent<ConvertEvent>) {
    const message = event.data;
    const callbacks = this.jobCallbacks.get(message.jobId);

    if (!callbacks && message.type !== 'streamChunk' && message.type !== 'streamComplete') return;

    switch (message.type) {
      case 'progress':
        callbacks?.onProgress?.(message.progress01, message.bytesWritten);
        break;

      case 'streamChunk':
        // Handle stream chunk - write to the stream
        const writer = this.activeStreams.get(message.jobId);
        if (writer) {
          try {
            // The chunk comes as an ArrayBuffer, convert to Uint8Array
            const data = new Uint8Array(message.chunk);
            const position = (message as any).position;
            console.log(`Writing chunk: ${data.length} bytes at position ${position} for job ${message.jobId}`);

            // Note: WritableStream doesn't support seeking, so we write sequentially
            // If mediabunny sends chunks out of order, this could cause corruption
            // TODO: May need to buffer and reorder chunks if they arrive out of sequence
            await writer.write(data);
          } catch (error) {
            console.error('Failed to write stream chunk:', error);
            callbacks?.onError?.('Failed to write to output file');
            // Clean up on error
            await this.cleanupStream(message.jobId);
          }
        } else {
          console.warn(`No writer found for job ${message.jobId}`);
        }
        break;

      case 'streamComplete':
        // Stream has finished sending all chunks from worker
        console.log(`Stream complete for job ${message.jobId}, total bytes: ${message.totalBytes}`);
        // Now it's safe to close the stream
        await this.cleanupStream(message.jobId);
        console.log(`Stream closed after completion for job ${message.jobId}`);
        break;

      case 'error':
        callbacks?.onError?.(message.message);
        // Clean up stream if exists
        await this.cleanupStream(message.jobId);
        this.jobCallbacks.delete(message.jobId);
        break;

      case 'done':
        // For streaming mode, DON'T close the stream here - wait for streamComplete
        if (message.result.mode === 'stream') {
          console.log(`Conversion done for job ${message.jobId}, waiting for stream to complete...`);
          // Stream will be closed when we receive 'streamComplete'
        }
        callbacks?.onComplete?.(message.result);
        this.jobCallbacks.delete(message.jobId);
        break;

      case 'progress':
        callbacks?.onProgress?.(message.progress01, message.bytesWritten);
        break;

      case 'canceled':
        callbacks?.onError?.('Conversion was canceled');
        await this.cleanupStream(message.jobId);
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

  private async cleanupStream(jobId: string) {
    const writer = this.activeStreams.get(jobId);
    if (writer) {
      try {
        await writer.close();
      } catch (error) {
        console.error('Error closing stream:', error);
      }
      this.activeStreams.delete(jobId);
    }
  }

  private handleWorkerError(error: ErrorEvent) {
    console.error('Worker error:', error);
    // Notify all active jobs about the error
    this.jobCallbacks.forEach((callbacks) => {
      callbacks.onError?.('Worker crashed: ' + error.message);
    });
    this.jobCallbacks.clear();

    // Clean up all streams
    this.activeStreams.forEach(async (writer, jobId) => {
      await this.cleanupStream(jobId);
    });

    // Attempt to restart the worker (but with a delay to prevent rapid retries)
    setTimeout(() => {
      if (!this.worker) {
        this.initWorker();
      }
    }, 1000);
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

    let useStreaming = false;

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
        const writer = writable.getWriter();
        this.activeStreams.set(jobId, writer);
        useStreaming = true;
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
      sink: {
        mode: useStreaming ? 'stream' : 'buffer'
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

  public async dispose() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    // Clean up all streams
    for (const jobId of this.activeStreams.keys()) {
      await this.cleanupStream(jobId);
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