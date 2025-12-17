// Type definitions for the conversion pipeline

export type ConvertRequest = {
  type: 'convert';
  jobId: string;
  file: File;
  output: {
    container: 'mp4';
    profile: 'compat';
    preset: 'low' | 'medium' | 'high';
    maxDimension?: number;
  };
  sink?: {
    mode: 'buffer' | 'stream';
    writableStream?: WritableStream;
  };
};

export type CancelRequest = {
  type: 'cancel';
  jobId: string;
};

export type WorkerRequest = ConvertRequest | CancelRequest;

export type ConvertEvent =
  | { type: 'ready'; jobId: string }
  | { type: 'capabilities'; jobId: string; canEncode: { avc: boolean; aac: boolean } }
  | { type: 'progress'; jobId: string; progress01: number; bytesWritten?: number }
  | { type: 'warning'; jobId: string; message: string }
  | { type: 'error'; jobId: string; message: string; details?: unknown }
  | { type: 'done'; jobId: string; result: { mode: 'buffer'; buffer: ArrayBuffer; mime: string; filename: string } }
  | { type: 'done'; jobId: string; result: { mode: 'stream'; mime: string; filename: string } }
  | { type: 'canceled'; jobId: string };

export type ConversionState = 'idle' | 'probing' | 'converting' | 'finalizing' | 'done' | 'error' | 'canceled';

export interface ConversionOptions {
  videoBitrate?: number;
  audioBitrate?: number;
  maxDimension?: number;
  keyFrameInterval?: number;
  sampleRate?: number;
  numberOfChannels?: number;
}

export interface BitratePresets {
  low: { video: number; audio: number };
  medium: { video: number; audio: number };
  high: { video: number; audio: number };
}