// Crop region (normalized 0-1)
export interface CropRegion {
  x: number;      // Left edge (0-1)
  y: number;      // Top edge (0-1)
  width: number;  // Width (0-1)
  height: number; // Height (0-1)
}

// Trim state
export interface TrimState {
  start: number;  // Start time in seconds
  end: number;    // End time in seconds
}

// Aspect ratios
export type AspectRatioPreset = 'free' | '16:9' | '9:16' | '4:3' | '3:4' | '1:1';

export interface CustomAspectRatio {
  width: number;
  height: number;
}

export type AspectRatio = AspectRatioPreset | CustomAspectRatio;

// Video metadata
export interface VideoMetadata {
  width: number;
  height: number;
  duration: number;
  filename: string;
}

// Drag handle positions
export type CornerHandle = 'nw' | 'ne' | 'sw' | 'se';
export type EdgeHandle = 'n' | 's' | 'e' | 'w';
export type DragHandle = CornerHandle | EdgeHandle | 'move';

// Quality presets
export type QualityPreset = 'low' | 'medium' | 'high';

// Export options (what gets sent to mediabunny)
export interface ExportOptions {
  quality: QualityPreset;
  crop: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  trim: {
    start: number;
    end: number;
  };
}

// Export status
export type ExportStatus = 'idle' | 'exporting' | 'completed' | 'error';

// Full editor state
export interface CropEditorState {
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

  // Export state
  exportStatus: ExportStatus;
  exportProgress: number;
  exportError: string | null;
  outputBlob: Blob | null;
}

// Default crop region (full frame)
export const DEFAULT_CROP: CropRegion = {
  x: 0,
  y: 0,
  width: 1,
  height: 1,
};

// Aspect ratio numeric values
export const ASPECT_RATIO_VALUES: Record<AspectRatioPreset, number | null> = {
  'free': null,
  '16:9': 16 / 9,
  '9:16': 9 / 16,
  '4:3': 4 / 3,
  '3:4': 3 / 4,
  '1:1': 1,
};

// Get aspect ratio value from AspectRatio type
export function getAspectRatioValue(ratio: AspectRatio): number | null {
  if (typeof ratio === 'string') {
    return ASPECT_RATIO_VALUES[ratio];
  }
  return ratio.width / ratio.height;
}
