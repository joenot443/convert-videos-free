export type FileStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type QualityPreset = 'low' | 'medium' | 'high';
export type ResolutionCap = 'original' | '1080p' | '720p' | '480p';

export interface ConversionSettings {
  quality: QualityPreset;
  resolution: ResolutionCap;
  autoDownload: boolean;
  removeAfterDownload: boolean;
}

export interface QueueItem {
  id: string;
  file: File;
  status: FileStatus;
  error?: string;
  warning?: string; // Warning code from the worker, for example 'audioDropped'
  outputBlob?: Blob;
  outputSize?: number;
  compressionRatio?: number;
  addedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface ProgressInfo {
  percent: number;
  timeElapsed: number;
  estimatedTimeRemaining?: number;
}

export interface CompletedFile {
  id: string;
  originalName: string;
  outputName: string;
  outputSize: number;
  originalSize: number;
  compressionRatio: number;
  blob: Blob;
  completedAt: Date;
  processingTime: number;
}