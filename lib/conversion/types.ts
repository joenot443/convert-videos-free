// Messages exchanged with public/workers/conversion.worker.js

export type ConvertRequest = {
  type: 'convert';
  jobId: string;
  file: File;
  output: {
    preset: 'low' | 'medium' | 'high';
    /** Output is scaled down to fit this box, in either orientation. */
    maxLongEdge?: number;
    maxShortEdge?: number;
  };
};

export type CancelRequest = {
  type: 'cancel';
  jobId: string;
};

export type WorkerRequest = ConvertRequest | CancelRequest;

export type ConvertEvent =
  | { type: 'progress'; jobId: string; progress01: number }
  | { type: 'warning'; jobId: string; code: string }
  | { type: 'error'; jobId: string; message: string }
  | { type: 'done'; jobId: string; result: { buffer: ArrayBuffer; mime: string } }
  | { type: 'canceled'; jobId: string };
