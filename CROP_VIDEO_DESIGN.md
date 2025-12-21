# Crop Videos Free - Design Document

## Product Vision

A free, browser-based video cropping and trimming tool at **cropvideosfree.com**. Users upload a video, visually select a crop region and trim points, then export - all processed locally in the browser with no server uploads.

## User Flow

```
1. Land on page → See drop zone
2. Drop/select video → Video loads in editor
3. Video displays with crop overlay + timeline → User adjusts crop region
4. User drags timeline handles to set trim points → Start/end adjusted
5. User selects aspect ratio lock (optional) → Crop box constrains
6. User clicks "Export" → Processing begins
7. Conversion completes → Download cropped/trimmed video
```

## Core Requirements

### 1. Video Input
- Drag and drop or click to browse
- Support formats: MP4, MOV, WebM, MKV, AVI
- File size limit: 2GB
- Single file at a time

### 2. Video Player
- HTML5 video element
- Play/pause toggle
- Current time display
- Displays at appropriate size for viewport

### 3. Crop Overlay Tool

#### Visual Design (Reference-Inspired)

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░       │
│       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░       │
│       ░░░░░┌──┐░░░░░░░░░░░░░░░░┌──┐░░░░░░░░░░░░░░░░┌──┐░░░░       │
│       ░░░░░│  └────────────────┤  ├────────────────┘  │░░░░       │
│       ░░░░░│                   └──┘                   │░░░░       │
│       ░░░░░│                                          │░░░░       │
│       ░░░░░├──┐     CROP REGION (100% bright)    ┌──┤░░░░       │
│       ░░░░░│  │                                   │  │░░░░       │
│       ░░░░░├──┘                                   └──┤░░░░       │
│       ░░░░░│                                          │░░░░       │
│       ░░░░░│                   ┌──┐                   │░░░░       │
│       ░░░░░│  ┌────────────────┤  ├────────────────┐  │░░░░       │
│       ░░░░░└──┘░░░░░░░░░░░░░░░░└──┘░░░░░░░░░░░░░░░░└──┘░░░░       │
│       ░░░░░░░░░░░░░░░ (dimmed ~50%) ░░░░░░░░░░░░░░░░░░░░░░░       │
│       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

Handle Design:
┌──┐
│  │  = L-shaped corner bracket (white, ~20px arms)
└

 ┌──┐
 │  │  = Small square at edge midpoints (~10px)
 └──┘
```

**Key visual elements:**
- **L-shaped corner brackets**: White, chunky handles at all 4 corners
- **Square edge handles**: Small squares at midpoint of each edge
- **Dimmed overlay**: Semi-transparent dark layer over excluded regions (~50% opacity)
- **Crop region**: Full brightness, video fully visible inside
- **Dark background**: Deep purple/slate (#1a1a2e or similar)

#### Interaction Model
- **Drag corners**: Resize from corner (L-bracket handles)
- **Drag edges**: Resize from edge midpoint squares
- **Drag inside crop area**: Move entire crop box
- **Minimum size**: 50x50 pixels (prevents unusable crops)

#### Aspect Ratio Locking
```
┌─────────────────────────────────────────────────────┐
│  [Free] [16:9] [9:16] [4:3] [1:1] [Custom]          │
└─────────────────────────────────────────────────────┘
```

- **Free**: No constraint
- **16:9**: Landscape widescreen
- **9:16**: Portrait/vertical (TikTok, Reels, Shorts)
- **4:3**: Classic ratio
- **1:1**: Square (Instagram)
- **Custom**: User enters W:H

### 4. Timeline with Trim Controls

#### Visual Design (Reference-Inspired)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ 00:02.5                                                                    │
│ ┌──┐                                                                  ┌──┐ │
│ │::│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│::│ │
│ │::│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│::│ │
│ │::│▓▓▓▓▓▓▓▓▓▓ FILMSTRIP THUMBNAILS ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│::│ │
│ │::│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│::│ │
│ └──┘                                                                  └──┘ │
│ 00:00.0                        00:09.1                           00:18.2   │
└────────────────────────────────────────────────────────────────────────────┘

 │::│ = Draggable trim handle (dotted pattern)
 ▓▓▓  = Filmstrip thumbnails (kept region)
 ░░░  = Dimmed region (trimmed out) - shown darker/grayed
```

**Key elements:**
- **Filmstrip thumbnails**: Extract frames at regular intervals, display as strip
- **Trim handles**: Draggable vertical bars at start/end with grip pattern (dots/lines)
- **Excluded regions**: Darker/grayed outside trim range
- **Current time indicator**: Shows playhead position
- **Time labels**: Start, middle, end timestamps

#### Trim Interaction
- Drag left handle → Set trim start point
- Drag right handle → Set trim end point
- Click on timeline → Seek to that position
- Playback loops within trim region (optional)

### 5. Info Panel

```
┌─────────────────────────────────────┐
│ Original: 1920 × 1080               │
│ Crop: 1280 × 720                    │
│ Duration: 00:15.3 → 00:08.7         │
│ Output: 1280 × 720 @ 8.7s           │
└─────────────────────────────────────┘
```

### 6. Export Options
- Quality preset: Low / Medium / High
- Output: MP4 (H.264 + AAC)
- Preserves audio

## UI Layout

### Desktop Layout (≥1024px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                           Crop Videos Free                                  │
│                     filename.mp4 (1920×1080, 00:18.2)                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│    ┌────────────────────────────────────────────────────────────────┐     │
│    │                                                                 │     │
│    │                                                                 │     │
│    │                      VIDEO + CROP OVERLAY                       │     │
│    │                                                                 │     │
│    │                                                                 │     │
│    │                         [▶ Play]                                │     │
│    └────────────────────────────────────────────────────────────────┘     │
│                                                                            │
│    ┌────────────────────────────────────────────────────────────────┐     │
│    │ │::│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ TIMELINE FILMSTRIP ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│::│  │     │
│    │ 00:00.0                                              00:18.2   │     │
│    └────────────────────────────────────────────────────────────────┘     │
│                                                                            │
│    ┌────────────────────────────┐  ┌────────────────────────────────┐     │
│    │ ASPECT RATIO               │  │ OUTPUT INFO                    │     │
│    │ [Free][16:9][9:16][4:3][1:1]│  │ 1280×720 @ 8.7s               │     │
│    │                            │  │ Quality: [Low][Med][High]      │     │
│    │ [Reset Crop] [Reset Trim]  │  │                                │     │
│    └────────────────────────────┘  └────────────────────────────────┘     │
│                                                                            │
│                          [🎬 Export Video]                                 │
│                                                                            │
│    ┌────────────────────────────────────────────────────────────────┐     │
│    │ ████████████████░░░░░░░░  65%  Cropping and encoding...        │     │
│    └────────────────────────────────────────────────────────────────┘     │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Initial State (No Video)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                           Crop Videos Free                                  │
│                    Crop & trim videos in your browser                       │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│    ┌────────────────────────────────────────────────────────────────┐     │
│    │                                                                 │     │
│    │                                                                 │     │
│    │                    📹 Drop your video here                      │     │
│    │                      or click to browse                         │     │
│    │                                                                 │     │
│    │                 Supports MP4, MOV, WebM, MKV, AVI               │     │
│    │                         Max size: 2GB                           │     │
│    │                                                                 │     │
│    └────────────────────────────────────────────────────────────────┘     │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

## Color Scheme (Dark Theme)

```
Background:        #1a1a2e (deep purple-slate)
Surface:           #16213e (slightly lighter)
Crop overlay dim:  rgba(0, 0, 0, 0.5)
Handles:           #ffffff (white)
Handle hover:      #60a5fa (blue highlight)
Primary button:    #3b82f6 (blue)
Text primary:      #ffffff
Text secondary:    #94a3b8 (gray)
Accent:            #8b5cf6 (purple)
Success:           #10b981 (green)
Error:             #ef4444 (red)
Timeline active:   Full brightness thumbnails
Timeline trimmed:  50% opacity thumbnails
```

## Technical Architecture

### Mediabunny API Integration

Mediabunny natively supports both crop and trim:

```typescript
const conversion = await Conversion.init({
  input,
  output,
  video: {
    crop: {
      left: 320,    // X offset in pixels
      top: 180,     // Y offset in pixels
      width: 1280,  // Crop width in pixels
      height: 720,  // Crop height in pixels
    },
  },
  trim: {
    start: 2.5,     // Start time in seconds
    end: 11.2,      // End time in seconds
  },
});
```

**Order of operations:** Crop is applied after rotation but before resizing. Values are clamped to video dimensions.

### File Structure

```
app/
├── page.tsx                        # Main converter (existing)
├── crop/
│   ├── page.tsx                    # Crop tool page
│   └── layout.tsx                  # Dark theme layout
components/
├── converter/                      # Existing
├── crop/
│   ├── CropEditor.tsx              # Main orchestrator
│   ├── VideoDropZone.tsx           # File input
│   ├── VideoCanvas.tsx             # Video + overlay container
│   ├── CropOverlay.tsx             # Dim regions + crop box
│   ├── CropHandles.tsx             # L-brackets + edge squares
│   ├── Timeline.tsx                # Filmstrip + trim handles
│   ├── TrimHandle.tsx              # Draggable trim control
│   ├── FilmstripThumbnails.tsx     # Generated thumbnails
│   ├── AspectRatioSelector.tsx     # Ratio buttons
│   ├── OutputInfo.tsx              # Dimensions/duration display
│   └── ExportButton.tsx            # Export + progress
├── ui/                             # Shared components
lib/
├── conversion/                     # Existing
│   ├── ConversionService.ts
│   └── types.ts                    # Extended with crop/trim
├── crop/
│   ├── useCropState.ts             # Crop region state
│   ├── useTrimState.ts             # Trim times state
│   ├── useFilmstrip.ts             # Thumbnail extraction
│   ├── useDragHandles.ts           # Drag interaction logic
│   ├── cropMath.ts                 # Crop calculations
│   └── types.ts                    # TypeScript types
```

### Data Models

```typescript
// Crop region (normalized 0-1)
interface CropRegion {
  x: number;      // Left edge (0-1)
  y: number;      // Top edge (0-1)
  width: number;  // Width (0-1)
  height: number; // Height (0-1)
}

// Trim state
interface TrimState {
  start: number;  // Start time in seconds
  end: number;    // End time in seconds
}

// Aspect ratios
type AspectRatio =
  | 'free'
  | '16:9' | '9:16'
  | '4:3' | '3:4'
  | '1:1'
  | { width: number; height: number };

// Video metadata
interface VideoMetadata {
  width: number;
  height: number;
  duration: number;
  filename: string;
}

// Full editor state
interface EditorState {
  file: File | null;
  videoMeta: VideoMetadata | null;
  crop: CropRegion;
  trim: TrimState;
  aspectRatio: AspectRatio;
  isPlaying: boolean;
  currentTime: number;
}

// Export options
interface ExportOptions {
  quality: 'low' | 'medium' | 'high';
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
```

### Filmstrip Thumbnail Generation

```typescript
async function generateFilmstrip(
  video: HTMLVideoElement,
  count: number = 20
): Promise<string[]> {
  const thumbnails: string[] = [];
  const interval = video.duration / count;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  // Small thumbnails for filmstrip
  canvas.width = 80;
  canvas.height = 45; // 16:9 aspect

  for (let i = 0; i < count; i++) {
    video.currentTime = i * interval;
    await new Promise(r => video.onseeked = r);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    thumbnails.push(canvas.toDataURL('image/jpeg', 0.6));
  }

  return thumbnails;
}
```

### Crop Handle Implementation

```typescript
// L-shaped corner handle component
interface HandleProps {
  position: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';
  onDragStart: () => void;
  onDrag: (delta: { x: number; y: number }) => void;
  onDragEnd: () => void;
}

// Corner handles render as L-brackets
const CornerHandle: FC<{ corner: 'nw' | 'ne' | 'sw' | 'se' }> = ({ corner }) => {
  const rotation = {
    nw: 0,
    ne: 90,
    se: 180,
    sw: 270,
  }[corner];

  return (
    <div
      className="absolute w-5 h-5 cursor-[appropriate-cursor]"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* L-shape using borders or SVG */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-white" />
      <div className="absolute top-0 left-0 w-0.5 h-full bg-white" />
    </div>
  );
};

// Edge handles are small squares
const EdgeHandle: FC<{ edge: 'n' | 's' | 'e' | 'w' }> = ({ edge }) => (
  <div className="absolute w-2.5 h-2.5 bg-white border border-gray-400" />
);
```

### Coordinate Transformations

```typescript
// Convert normalized crop to pixel values for export
function cropToPixels(
  crop: CropRegion,
  videoWidth: number,
  videoHeight: number
): { left: number; top: number; width: number; height: number } {
  return {
    left: Math.round(crop.x * videoWidth),
    top: Math.round(crop.y * videoHeight),
    width: Math.round(crop.width * videoWidth),
    height: Math.round(crop.height * videoHeight),
  };
}

// Convert display coordinates to normalized
function displayToNormalized(
  displayX: number,
  displayY: number,
  displayRect: DOMRect,
  videoMeta: VideoMetadata
): { x: number; y: number } {
  // Account for letterboxing if video doesn't fill container
  const videoAspect = videoMeta.width / videoMeta.height;
  const containerAspect = displayRect.width / displayRect.height;

  let videoDisplayWidth: number;
  let videoDisplayHeight: number;
  let offsetX = 0;
  let offsetY = 0;

  if (videoAspect > containerAspect) {
    // Video is wider - letterbox top/bottom
    videoDisplayWidth = displayRect.width;
    videoDisplayHeight = displayRect.width / videoAspect;
    offsetY = (displayRect.height - videoDisplayHeight) / 2;
  } else {
    // Video is taller - letterbox left/right
    videoDisplayHeight = displayRect.height;
    videoDisplayWidth = displayRect.height * videoAspect;
    offsetX = (displayRect.width - videoDisplayWidth) / 2;
  }

  return {
    x: (displayX - offsetX) / videoDisplayWidth,
    y: (displayY - offsetY) / videoDisplayHeight,
  };
}
```

## Implementation Phases

### Phase 1: Basic Video Editor Shell
1. Create `/crop` route with dark theme layout
2. Build VideoDropZone (can adapt from existing)
3. Build VideoCanvas with basic video player
4. Set up editor state management

### Phase 2: Crop Overlay
1. Implement CropOverlay with dim regions
2. Build L-bracket corner handles
3. Build edge midpoint handles
4. Implement drag-to-resize logic
5. Add aspect ratio selector and constraints

### Phase 3: Timeline & Trim
1. Implement filmstrip thumbnail generation
2. Build Timeline component with thumbnails
3. Build TrimHandle components
4. Implement trim drag logic
5. Add time display and seek-on-click

### Phase 4: Export Integration
1. Extend ConversionService for crop/trim params
2. Update worker message handling
3. Build ExportButton with progress
4. Implement download flow

### Phase 5: Polish
1. Responsive design (tablet/mobile)
2. Keyboard shortcuts
3. Reset buttons
4. Error handling
5. Loading states

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Play/pause |
| ← / → | Seek ±1 second |
| Shift + ← / → | Seek ±0.1 second (frame step) |
| [ | Set trim start to current time |
| ] | Set trim end to current time |
| R | Reset crop to full frame |
| T | Reset trim to full duration |
| Escape | Cancel current drag |

## Test IDs

```html
<!-- Video area -->
<div data-testid="video-drop-zone" />
<video data-testid="video-player" />
<div data-testid="crop-overlay" />

<!-- Crop handles -->
<div data-testid="crop-handle-nw" />
<div data-testid="crop-handle-ne" />
<div data-testid="crop-handle-se" />
<div data-testid="crop-handle-sw" />
<div data-testid="crop-handle-n" />
<div data-testid="crop-handle-s" />
<div data-testid="crop-handle-e" />
<div data-testid="crop-handle-w" />

<!-- Timeline -->
<div data-testid="timeline" />
<div data-testid="trim-handle-start" />
<div data-testid="trim-handle-end" />
<div data-testid="filmstrip" />

<!-- Controls -->
<button data-testid="aspect-free" />
<button data-testid="aspect-16-9" />
<button data-testid="aspect-9-16" />
<button data-testid="aspect-4-3" />
<button data-testid="aspect-1-1" />
<button data-testid="reset-crop" />
<button data-testid="reset-trim" />
<button data-testid="export-button" />

<!-- Info -->
<span data-testid="output-width" />
<span data-testid="output-height" />
<span data-testid="output-duration" />
```

## Performance Considerations

### Filmstrip Generation
- Generate thumbnails async after video loads
- Show placeholder/skeleton during generation
- Cache thumbnails in memory (don't regenerate on re-render)
- Use small dimensions (80×45) and JPEG compression

### Crop Dragging
- Use CSS transforms for handle positions
- Update overlay regions with CSS, not re-renders
- Throttle info panel updates to 60fps max
- Use `will-change: transform` on draggable elements

### Video Playback
- Native video element (no canvas redraw)
- Overlay is CSS-only, doesn't affect video performance
- Pause video during thumbnail generation

## Browser Compatibility

Same as main converter:
- Chrome/Chromium ✅
- Edge ✅
- Safari 16.4+ ✅ (buffer mode)
- Firefox (if WebCodecs available)

## Success Metrics

- Crop handles respond in <16ms (60fps drag)
- Filmstrip generates in <3s for typical videos
- Export time comparable to main converter
- Valid output with correct dimensions and duration
- Intuitive enough that users don't need instructions
