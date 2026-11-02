import { CropRegion, AspectRatio, DragHandle, VideoMetadata, getAspectRatioValue } from './types';

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Minimum crop size as fraction of video (5%)
 */
const MIN_CROP_SIZE = 0.05;

/**
 * Calculate new crop region after dragging a handle
 */
export function calculateCropAfterDrag(
  crop: CropRegion,
  handle: DragHandle,
  deltaX: number,
  deltaY: number,
  aspectRatio: AspectRatio,
  videoMeta: VideoMetadata | null
): CropRegion {
  const ratioValue = getAspectRatioValue(aspectRatio);

  // Calculate delta in normalized coordinates
  // deltaX and deltaY are in pixels relative to the video display size
  // We need to convert them to normalized 0-1 coordinates

  let newCrop = { ...crop };

  if (handle === 'move') {
    // Moving the entire crop box
    newCrop.x = clamp(crop.x + deltaX, 0, 1 - crop.width);
    newCrop.y = clamp(crop.y + deltaY, 0, 1 - crop.height);
    return newCrop;
  }

  // Handle resizing from corners and edges
  switch (handle) {
    case 'nw': // Top-left corner
      newCrop = resizeFromCorner(crop, deltaX, deltaY, 'nw', ratioValue, videoMeta);
      break;
    case 'ne': // Top-right corner
      newCrop = resizeFromCorner(crop, deltaX, deltaY, 'ne', ratioValue, videoMeta);
      break;
    case 'sw': // Bottom-left corner
      newCrop = resizeFromCorner(crop, deltaX, deltaY, 'sw', ratioValue, videoMeta);
      break;
    case 'se': // Bottom-right corner
      newCrop = resizeFromCorner(crop, deltaX, deltaY, 'se', ratioValue, videoMeta);
      break;
    case 'n': // Top edge
      newCrop = resizeFromEdge(crop, deltaY, 'n', ratioValue, videoMeta);
      break;
    case 's': // Bottom edge
      newCrop = resizeFromEdge(crop, deltaY, 's', ratioValue, videoMeta);
      break;
    case 'w': // Left edge
      newCrop = resizeFromEdge(crop, deltaX, 'w', ratioValue, videoMeta);
      break;
    case 'e': // Right edge
      newCrop = resizeFromEdge(crop, deltaX, 'e', ratioValue, videoMeta);
      break;
  }

  return newCrop;
}

/**
 * Resize crop from a corner handle
 */
function resizeFromCorner(
  crop: CropRegion,
  deltaX: number,
  deltaY: number,
  corner: 'nw' | 'ne' | 'sw' | 'se',
  ratioValue: number | null,
  videoMeta: VideoMetadata | null
): CropRegion {
  let { x, y, width, height } = crop;

  // Determine which edges to modify based on corner
  const modifyLeft = corner === 'nw' || corner === 'sw';
  const modifyTop = corner === 'nw' || corner === 'ne';

  if (modifyLeft) {
    const newX = clamp(x + deltaX, 0, x + width - MIN_CROP_SIZE);
    const newWidth = width - (newX - x);
    x = newX;
    width = newWidth;
  } else {
    width = clamp(width + deltaX, MIN_CROP_SIZE, 1 - x);
  }

  if (modifyTop) {
    const newY = clamp(y + deltaY, 0, y + height - MIN_CROP_SIZE);
    const newHeight = height - (newY - y);
    y = newY;
    height = newHeight;
  } else {
    height = clamp(height + deltaY, MIN_CROP_SIZE, 1 - y);
  }

  // Apply aspect ratio constraint if set
  if (ratioValue !== null && videoMeta) {
    return constrainToAspectRatio({ x, y, width, height }, ratioValue, videoMeta, OPPOSITE_CORNER[corner], 'larger');
  }

  return { x, y, width, height };
}

/**
 * Resize crop from an edge handle
 */
function resizeFromEdge(
  crop: CropRegion,
  delta: number,
  edge: 'n' | 's' | 'e' | 'w',
  ratioValue: number | null,
  videoMeta: VideoMetadata | null
): CropRegion {
  let { x, y, width, height } = crop;

  switch (edge) {
    case 'n':
      const newY = clamp(y + delta, 0, y + height - MIN_CROP_SIZE);
      height = height - (newY - y);
      y = newY;
      break;
    case 's':
      height = clamp(height + delta, MIN_CROP_SIZE, 1 - y);
      break;
    case 'w':
      const newX = clamp(x + delta, 0, x + width - MIN_CROP_SIZE);
      width = width - (newX - x);
      x = newX;
      break;
    case 'e':
      width = clamp(width + delta, MIN_CROP_SIZE, 1 - x);
      break;
  }

  // Apply aspect ratio constraint if set
  if (ratioValue !== null && videoMeta) {
    const anchor = edge === 'n' || edge === 'w' ? 'se' : 'nw';
    const driver = edge === 'e' || edge === 'w' ? 'width' : 'height';
    return constrainToAspectRatio({ x, y, width, height }, ratioValue, videoMeta, anchor, driver);
  }

  return { x, y, width, height };
}

type Anchor = 'nw' | 'ne' | 'sw' | 'se';

const OPPOSITE_CORNER: Record<Anchor, Anchor> = { nw: 'se', ne: 'sw', sw: 'ne', se: 'nw' };

/**
 * Reshape a crop to an aspect ratio, keeping one corner fixed.
 * `driver` says which dimension the user is controlling; the other one follows.
 */
function constrainToAspectRatio(
  crop: CropRegion,
  targetRatio: number,
  videoMeta: VideoMetadata,
  anchor: Anchor,
  driver: 'width' | 'height' | 'larger'
): CropRegion {
  // Width / height of the target shape, measured in normalized units.
  const ratio = targetRatio * (videoMeta.height / videoMeta.width);

  const anchorRight = anchor === 'ne' || anchor === 'se';
  const anchorBottom = anchor === 'sw' || anchor === 'se';
  const anchorX = anchorRight ? crop.x + crop.width : crop.x;
  const anchorY = anchorBottom ? crop.y + crop.height : crop.y;

  const fromWidth = crop.width;
  const fromHeight = crop.height * ratio;
  let width =
    driver === 'width' ? fromWidth : driver === 'height' ? fromHeight : Math.max(fromWidth, fromHeight);

  // Stay inside the frame on the sides that can move, and above the minimum size.
  const maxWidth = Math.min(anchorRight ? anchorX : 1 - anchorX, (anchorBottom ? anchorY : 1 - anchorY) * ratio);
  const minWidth = Math.max(MIN_CROP_SIZE, MIN_CROP_SIZE * ratio);
  width = clamp(width, Math.min(minWidth, maxWidth), maxWidth);
  const height = width / ratio;

  return {
    x: anchorRight ? anchorX - width : anchorX,
    y: anchorBottom ? anchorY - height : anchorY,
    width,
    height,
  };
}

/**
 * Round to nearest even number (required for H.264 encoding)
 */
function roundToEven(n: number): number {
  return Math.round(n / 2) * 2;
}

function floorToEven(n: number): number {
  return Math.floor(n / 2) * 2;
}

/**
 * Convert crop region from normalized to pixel values
 * Ensures width and height are even numbers (required for H.264)
 */
export function cropToPixels(
  crop: CropRegion,
  videoWidth: number,
  videoHeight: number
): { left: number; top: number; width: number; height: number } {
  // Sizes are rounded down near the far edges, so that an odd-sized video can
  // never produce a crop that sticks out of the frame.
  const left = Math.min(roundToEven(crop.x * videoWidth), floorToEven(videoWidth - 2));
  const top = Math.min(roundToEven(crop.y * videoHeight), floorToEven(videoHeight - 2));

  const width = clamp(roundToEven(crop.width * videoWidth), 2, floorToEven(videoWidth - left));
  const height = clamp(roundToEven(crop.height * videoHeight), 2, floorToEven(videoHeight - top));

  return { left, top, width, height };
}

/**
 * Calculate the display bounds of the video within its container
 * (accounting for object-fit: contain letterboxing)
 */
export function getVideoDisplayBounds(
  containerRect: DOMRect,
  videoMeta: VideoMetadata
): { x: number; y: number; width: number; height: number } {
  const containerAspect = containerRect.width / containerRect.height;
  const videoAspect = videoMeta.width / videoMeta.height;

  let displayWidth: number;
  let displayHeight: number;
  let offsetX: number;
  let offsetY: number;

  if (videoAspect > containerAspect) {
    // Video is wider than container - letterbox top/bottom
    displayWidth = containerRect.width;
    displayHeight = containerRect.width / videoAspect;
    offsetX = 0;
    offsetY = (containerRect.height - displayHeight) / 2;
  } else {
    // Video is taller than container - letterbox left/right
    displayHeight = containerRect.height;
    displayWidth = containerRect.height * videoAspect;
    offsetX = (containerRect.width - displayWidth) / 2;
    offsetY = 0;
  }

  return {
    x: offsetX,
    y: offsetY,
    width: displayWidth,
    height: displayHeight,
  };
}

/**
 * Convert a point from container coordinates to normalized video coordinates
 */
export function containerToNormalized(
  containerX: number,
  containerY: number,
  containerRect: DOMRect,
  videoMeta: VideoMetadata
): { x: number; y: number } | null {
  const videoBounds = getVideoDisplayBounds(containerRect, videoMeta);

  // Check if point is within video bounds
  if (
    containerX < videoBounds.x ||
    containerX > videoBounds.x + videoBounds.width ||
    containerY < videoBounds.y ||
    containerY > videoBounds.y + videoBounds.height
  ) {
    return null;
  }

  return {
    x: (containerX - videoBounds.x) / videoBounds.width,
    y: (containerY - videoBounds.y) / videoBounds.height,
  };
}

/**
 * Convert normalized coordinates to container pixel coordinates
 */
export function normalizedToContainer(
  normX: number,
  normY: number,
  containerRect: DOMRect,
  videoMeta: VideoMetadata
): { x: number; y: number } {
  const videoBounds = getVideoDisplayBounds(containerRect, videoMeta);

  return {
    x: videoBounds.x + normX * videoBounds.width,
    y: videoBounds.y + normY * videoBounds.height,
  };
}
