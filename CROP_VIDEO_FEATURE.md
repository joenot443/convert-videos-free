# Crop Video Feature

## Overview

A dedicated video cropping tool accessible at `/crop` (intended for cropvideosfree.com). This feature allows users to visually crop and trim videos directly in the browser, with all processing happening client-side using WebCodecs API.

## Key Features

- **Visual Crop Editor**: Drag-to-resize crop region with L-shaped corner brackets and edge handles
- **Aspect Ratio Presets**: Free, 16:9, 9:16, 4:3, 1:1
- **Trim/Cut**: Filmstrip timeline with draggable start/end handles
- **Real-time Preview**: Video player with playback controls
- **100% Private**: All processing in browser, no server uploads
- **Export to MP4**: WebCodecs-powered conversion with progress tracking

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        /crop Route                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    CropEditor.tsx                        │   │
│  │              (Main orchestrator component)               │   │
│  └─────────────────────────────────────────────────────────┘   │
│           │              │              │            │          │
│           ▼              ▼              ▼            ▼          │
│  ┌──────────────┐ ┌────────────┐ ┌──────────┐ ┌────────────┐  │
│  │VideoDropZone │ │VideoCanvas │ │CropOverlay│ │  Timeline  │  │
│  │(file input)  │ │ (player)   │ │(drag box) │ │(filmstrip) │  │
│  └──────────────┘ └────────────┘ └──────────┘ └────────────┘  │
│                          │              │            │          │
│                          ▼              ▼            ▼          │
│                   ┌─────────────────────────────────────┐      │
│                   │         useCropStore (Zustand)       │      │
│                   │   file, crop, trim, playback state   │      │
│                   └─────────────────────────────────────┘      │
│                                    │                            │
│                                    ▼                            │
│                   ┌─────────────────────────────────────┐      │
│                   │      CropConversionService          │      │
│                   │  (Web Worker + mediabunny)          │      │
│                   └─────────────────────────────────────┘      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## File Structure

```
media-converter/
├── app/crop/
│   ├── layout.tsx              # Dark theme layout, SEO meta
│   └── page.tsx                # Main page component
├── components/crop/
│   ├── CropEditor.tsx          # Main container/orchestrator
│   ├── VideoDropZone.tsx       # Drag & drop file input
│   ├── VideoCanvas.tsx         # Video player with controls
│   ├── CropOverlay.tsx         # Crop region with dim overlay
│   ├── CropHandles.tsx         # L-brackets + edge handles
│   ├── AspectRatioSelector.tsx # Aspect ratio preset buttons
│   ├── Timeline.tsx            # Filmstrip + trim region
│   ├── TrimHandle.tsx          # Draggable trim handles
│   └── ExportButton.tsx        # Export with progress UI
├── lib/crop/
│   ├── types.ts                # TypeScript interfaces
│   ├── useCropStore.ts         # Zustand state management
│   ├── cropMath.ts             # Coordinate transformations
│   ├── useFilmstrip.ts         # Thumbnail generation hook
│   └── CropConversionService.ts # Worker management
└── public/workers/
    └── crop-conversion.worker.js # Conversion worker
```

## State Management

The crop tool uses Zustand for state management (`lib/crop/useCropStore.ts`):

```typescript
interface CropStore {
  // File state
  file: File | null;
  videoUrl: string | null;
  videoMeta: VideoMetadata | null;

  // Crop state (normalized 0-1 coordinates)
  crop: CropRegion;      // { x, y, width, height }
  aspectRatio: AspectRatio;

  // Trim state (seconds)
  trim: TrimState;       // { start, end }

  // Playback state
  isPlaying: boolean;
  currentTime: number;

  // Quality & Export
  quality: 'low' | 'medium' | 'high';
  exportStatus: ExportStatus;
  exportProgress: number;
}
```

## Coordinate System

All crop coordinates are stored in **normalized (0-1) space**:
- `x=0, y=0` = top-left of video
- `x=1, y=1` = bottom-right of video
- `width=1, height=1` = full frame

Conversion to pixels happens only at export time via `cropToPixels()`.

### Video Display Bounds

Since videos use `object-fit: contain`, they may be letterboxed. The `getVideoDisplayBounds()` function calculates the actual video position within its container for accurate overlay positioning.

## Crop Math

Located in `lib/crop/cropMath.ts`:

- `calculateCropAfterDrag()` - Handle all drag operations (corners, edges, move)
- `constrainToAspectRatio()` - Enforce aspect ratio during resize
- `cropToPixels()` - Convert normalized to pixel values for export
- `getVideoDisplayBounds()` - Calculate letterboxed video position
- `containerToNormalized()` / `normalizedToContainer()` - Coordinate transforms

## Conversion Service

The `CropConversionService` handles export:

```typescript
class CropConversionService {
  // Uses external worker at /workers/crop-conversion.worker.js

  async convertWithCrop(
    file: File,
    options: {
      preset?: 'low' | 'medium' | 'high';
      crop?: CropOptions;   // { left, top, width, height } in pixels
      trim?: TrimOptions;   // { start, end } in seconds
    },
    callbacks: {
      onProgress?: (progress: number) => void;
      onError?: (error: string) => void;
      onComplete?: (result: { buffer: ArrayBuffer; filename: string }) => void;
    }
  ): Promise<string>
}
```

The worker uses mediabunny's native crop support:
```javascript
const conversionOptions = {
  input,
  output,
  video: {
    codec: 'avc',
    bitrate: videoBitrate,
    crop: { left, top, width, height },  // Native mediabunny crop
  },
  trim: { start, end },  // Native mediabunny trim
};
```

## Component Details

### VideoDropZone
- Single file drop zone (videos only)
- Accepts: video/mp4, video/quicktime, video/webm, video/x-matroska
- Provides instant preview URL via `URL.createObjectURL()`

### VideoCanvas
- HTML5 video player with `object-fit: contain`
- Exposes `seek()` method via `useImperativeHandle`
- Play/pause controls with trim loop support
- Time display in MM:SS.s format

### CropOverlay
- Four dimmed regions outside crop area
- Central crop box with drag-to-move
- Renders CropHandles for resize operations

### CropHandles
- 4 corner L-brackets (white, 20px)
- 4 edge square handles (8x8px)
- All draggable with mouse/touch support

### Timeline
- Filmstrip thumbnails (20 frames extracted via canvas)
- Trim handles at start/end with 0.5s minimum gap
- Draggable playhead for seeking
- Time display for trim region

### ExportButton
- **Idle**: "Export Video" with description of changes
- **Converting**: Progress bar, percentage, cancel button
- **Done**: "Export complete!" with download button
- **Error**: Error message with retry option

## Middleware Configuration

The `/crop` route bypasses i18n locale rewriting (added to `middleware.ts`):

```typescript
// Skip crop route from locale rewriting
pathname.startsWith('/crop') ||
```

## Design

- **Theme**: Dark purple (#1a1a2e) matching the main converter
- **Accent**: Blue (#3b82f6) for interactive elements
- **Handles**: White L-brackets and edge squares
- **Dim Overlay**: Semi-transparent black outside crop region

## Browser Requirements

- **WebCodecs API**: Required (Chrome 94+, Edge 94+, Safari 16.4+)
- **Web Workers**: Required
- **File API**: Required

## Testing

Components include `data-testid` attributes for e2e testing:
- `video-container`, `video-player`
- `crop-overlay`, `crop-handle-{position}`
- `aspect-ratio-{value}`, `timeline`, `playhead`
- `trim-handle-start`, `trim-handle-end`
- `export-button`, `download-button`, `export-progress-bar`

## Future Enhancements

Potential additions:
- Rotation support
- Multiple aspect ratio presets (custom)
- Quality preview before export
- Batch cropping
- Undo/redo for crop adjustments
