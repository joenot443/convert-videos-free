'use client';

import { create } from 'zustand';
import {
  CropRegion,
  TrimState,
  AspectRatio,
  VideoMetadata,
  ExportStatus,
  QualityPreset,
  DEFAULT_CROP,
  getAspectRatioValue,
} from './types';

interface CropStore {
  // File state
  file: File | null;
  videoUrl: string | null;
  videoMeta: VideoMetadata | null;

  // Crop state
  crop: CropRegion;
  aspectRatio: AspectRatio;

  // Trim state
  trim: TrimState;

  // Playback state
  isPlaying: boolean;
  currentTime: number;

  // Quality state
  quality: QualityPreset;

  // Export state
  exportStatus: ExportStatus;
  exportProgress: number;
  exportError: string | null;
  outputBlob: Blob | null;

  // Actions - File
  setFile: (file: File | null) => void;
  setVideoMeta: (meta: VideoMetadata) => void;
  clearFile: () => void;

  // Actions - Crop
  setCrop: (crop: CropRegion) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  resetCrop: () => void;

  // Actions - Trim
  setTrimStart: (start: number) => void;
  setTrimEnd: (end: number) => void;
  setTrim: (trim: TrimState) => void;
  resetTrim: () => void;

  // Actions - Playback
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;

  // Actions - Quality
  setQuality: (quality: QualityPreset) => void;

  // Actions - Export
  startExport: () => void;
  setExportProgress: (progress: number) => void;
  completeExport: (blob: Blob) => void;
  failExport: (error: string) => void;
  resetExport: () => void;
  downloadOutput: () => void;
}

export const useCropStore = create<CropStore>((set, get) => ({
  // Initial state
  file: null,
  videoUrl: null,
  videoMeta: null,
  crop: DEFAULT_CROP,
  aspectRatio: 'free',
  trim: { start: 0, end: 0 },
  isPlaying: false,
  currentTime: 0,
  quality: 'medium',
  exportStatus: 'idle',
  exportProgress: 0,
  exportError: null,
  outputBlob: null,

  // File actions
  setFile: (file: File | null) => {
    const { videoUrl: oldUrl } = get();

    // Revoke old URL if exists
    if (oldUrl) {
      URL.revokeObjectURL(oldUrl);
    }

    if (file) {
      const videoUrl = URL.createObjectURL(file);
      set({
        file,
        videoUrl,
        videoMeta: null,
        crop: DEFAULT_CROP,
        trim: { start: 0, end: 0 },
        aspectRatio: 'free',
        currentTime: 0,
        isPlaying: false,
        exportStatus: 'idle',
        exportProgress: 0,
        exportError: null,
        outputBlob: null,
      });
    } else {
      set({
        file: null,
        videoUrl: null,
        videoMeta: null,
      });
    }
  },

  setVideoMeta: (meta: VideoMetadata) => {
    // Set initial crop to 90% of frame, centered (same aspect ratio as original)
    const initialCrop: CropRegion = {
      x: 0.05,      // 5% margin on left
      y: 0.05,      // 5% margin on top
      width: 0.9,   // 90% of width
      height: 0.9,  // 90% of height
    };

    set({
      videoMeta: meta,
      trim: { start: 0, end: meta.duration },
      crop: initialCrop,
    });
  },

  clearFile: () => {
    const { videoUrl } = get();
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    set({
      file: null,
      videoUrl: null,
      videoMeta: null,
      crop: DEFAULT_CROP,
      trim: { start: 0, end: 0 },
      aspectRatio: 'free',
      currentTime: 0,
      isPlaying: false,
      exportStatus: 'idle',
      exportProgress: 0,
      exportError: null,
      outputBlob: null,
    });
  },

  // Crop actions
  setCrop: (crop: CropRegion) => {
    // Clamp values to 0-1
    const clampedCrop: CropRegion = {
      x: Math.max(0, Math.min(1 - crop.width, crop.x)),
      y: Math.max(0, Math.min(1 - crop.height, crop.y)),
      width: Math.max(0.05, Math.min(1, crop.width)),
      height: Math.max(0.05, Math.min(1, crop.height)),
    };
    set({ crop: clampedCrop });
  },

  setAspectRatio: (ratio: AspectRatio) => {
    const { crop, videoMeta } = get();

    set({ aspectRatio: ratio });

    // Adjust crop to match new aspect ratio
    const ratioValue = getAspectRatioValue(ratio);
    if (ratioValue === null || !videoMeta) return;

    // Calculate video's pixel dimensions
    const videoAspect = videoMeta.width / videoMeta.height;

    // Current crop in normalized space
    let newWidth = crop.width;
    let newHeight = crop.height;

    // Calculate what the crop dimensions would be in pixels
    const cropPixelWidth = crop.width * videoMeta.width;
    const cropPixelHeight = crop.height * videoMeta.height;
    const currentCropAspect = cropPixelWidth / cropPixelHeight;

    if (currentCropAspect > ratioValue) {
      // Current crop is wider than target, reduce width
      const targetPixelWidth = cropPixelHeight * ratioValue;
      newWidth = targetPixelWidth / videoMeta.width;
    } else {
      // Current crop is taller than target, reduce height
      const targetPixelHeight = cropPixelWidth / ratioValue;
      newHeight = targetPixelHeight / videoMeta.height;
    }

    // Center the new crop within the old crop area
    const newX = crop.x + (crop.width - newWidth) / 2;
    const newY = crop.y + (crop.height - newHeight) / 2;

    set({
      crop: {
        x: Math.max(0, Math.min(1 - newWidth, newX)),
        y: Math.max(0, Math.min(1 - newHeight, newY)),
        width: newWidth,
        height: newHeight,
      },
    });
  },

  resetCrop: () => {
    set({
      crop: DEFAULT_CROP,
      aspectRatio: 'free',
    });
  },

  // Trim actions
  setTrimStart: (start: number) => {
    const { trim, videoMeta } = get();
    const maxStart = Math.min(start, trim.end - 0.1); // Minimum 0.1s duration
    set({
      trim: {
        start: Math.max(0, maxStart),
        end: trim.end,
      },
    });
  },

  setTrimEnd: (end: number) => {
    const { trim, videoMeta } = get();
    const minEnd = Math.max(end, trim.start + 0.1); // Minimum 0.1s duration
    set({
      trim: {
        start: trim.start,
        end: videoMeta ? Math.min(videoMeta.duration, minEnd) : minEnd,
      },
    });
  },

  setTrim: (trim: TrimState) => {
    set({ trim });
  },

  resetTrim: () => {
    const { videoMeta } = get();
    set({
      trim: {
        start: 0,
        end: videoMeta?.duration || 0,
      },
    });
  },

  // Playback actions
  setIsPlaying: (playing: boolean) => {
    set({ isPlaying: playing });
  },

  setCurrentTime: (time: number) => {
    set({ currentTime: time });
  },

  // Quality actions
  setQuality: (quality: QualityPreset) => {
    set({ quality });
  },

  // Export actions
  startExport: () => {
    set({
      exportStatus: 'exporting',
      exportProgress: 0,
      exportError: null,
      outputBlob: null,
    });
  },

  setExportProgress: (progress: number) => {
    set({ exportProgress: progress });
  },

  completeExport: (blob: Blob) => {
    set({
      exportStatus: 'completed',
      exportProgress: 100,
      outputBlob: blob,
    });
  },

  failExport: (error: string) => {
    set({
      exportStatus: 'error',
      exportError: error,
    });
  },

  resetExport: () => {
    set({
      exportStatus: 'idle',
      exportProgress: 0,
      exportError: null,
      outputBlob: null,
    });
  },

  downloadOutput: () => {
    const { outputBlob, file } = get();
    if (!outputBlob || !file) return;

    const outputName = file.name.replace(/\.[^/.]+$/, '') + '_cropped.mp4';
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = outputName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
}));
