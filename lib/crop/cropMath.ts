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
    const result = constrainToAspectRatio(
      { x, y, width, height },
      ratioValue,
      videoMeta,
      corner
    );
    return result;
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
    const anchorCorner = edge === 'n' || edge === 'w' ? 'se' : 'nw';
    const result = constrainToAspectRatio(
      { x, y, width, height },
      ratioValue,
      videoMeta,
      anchorCorner
    );
    return result;
  }

  return { x, y, width, height };
}

/**
 * Constrain crop region to an aspect ratio
 */
function constrainToAspectRatio(
  crop: CropRegion,
  targetRatio: number,
  videoMeta: VideoMetadata,
  anchorCorner: 'nw' | 'ne' | 'sw' | 'se'
): CropRegion {
  const videoAspect = videoMeta.width / videoMeta.height;

  // Convert crop dimensions to pixel space to calculate actual aspect ratio
  const cropPixelWidth = crop.width * videoMeta.width;
  const cropPixelHeight = crop.height * videoMeta.height;
  const currentRatio = cropPixelWidth / cropPixelHeight;

  let newWidth = crop.width;
  let newHeight = crop.height;

  if (currentRatio > targetRatio) {
    // Too wide, reduce width
    const targetPixelWidth = cropPixelHeight * targetRatio;
    newWidth = targetPixelWidth / videoMeta.width;
  } else {
    // Too tall, reduce height
    const targetPixelHeight = cropPixelWidth / targetRatio;
    newHeight = targetPixelHeight / videoMeta.height;
  }

  // Adjust position based on anchor corner
  let newX = crop.x;
  let newY = crop.y;

  switch (anchorCorner) {
    case 'nw':
      // Anchor top-left, expand/contract to bottom-right
      break;
    case 'ne':
      // Anchor top-right
      newX = crop.x + crop.width - newWidth;
      break;
    case 'sw':
      // Anchor bottom-left
      newY = crop.y + crop.height - newHeight;
      break;
    case 'se':
      // Anchor bottom-right
      newX = crop.x + crop.width - newWidth;
      newY = crop.y + crop.height - newHeight;
      break;
  }

  // Clamp to bounds
  newX = clamp(newX, 0, 1 - newWidth);
  newY = clamp(newY, 0, 1 - newHeight);
  newWidth = clamp(newWidth, MIN_CROP_SIZE, 1 - newX);
  newHeight = clamp(newHeight, MIN_CROP_SIZE, 1 - newY);

  return { x: newX, y: newY, width: newWidth, height: newHeight };
}

/**
 * Round to nearest even number (required for H.264 encoding)
 */
function roundToEven(n: number): number {
  return Math.round(n / 2) * 2;
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
  // Calculate raw values
  const rawLeft = crop.x * videoWidth;
  const rawTop = crop.y * videoHeight;
  const rawWidth = crop.width * videoWidth;
  const rawHeight = crop.height * videoHeight;

  // Round position to even (for some codecs) or just round normally
  const left = roundToEven(rawLeft);
  const top = roundToEven(rawTop);

  // Ensure width and height are even (required for H.264)
  let width = roundToEven(rawWidth);
  let height = roundToEven(rawHeight);

  // Ensure minimum dimensions (at least 2x2)
  width = Math.max(2, width);
  height = Math.max(2, height);

  // Ensure crop doesn't exceed video bounds
  const maxWidth = roundToEven(videoWidth - left);
  const maxHeight = roundToEven(videoHeight - top);
  width = Math.min(width, maxWidth);
  height = Math.min(height, maxHeight);

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
