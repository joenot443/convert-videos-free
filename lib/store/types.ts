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
  outputBlob?: Blob;
  outputSize?: number;
  compressionRatio?: number;
  addedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  settings?: Partial<ConversionSettings>;
  jobId?: string; // From ConversionService
}

export interface ProgressInfo {
  percent: number;
  bytesProcessed: number;
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