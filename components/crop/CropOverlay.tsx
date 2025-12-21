'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { useCropStore } from '@/lib/crop/useCropStore';
import { CropHandles } from './CropHandles';
import { DragHandle } from '@/lib/crop/types';
import { getVideoDisplayBounds, calculateCropAfterDrag } from '@/lib/crop/cropMath';

interface CropOverlayProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function CropOverlay({ containerRef }: CropOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [videoBounds, setVideoBounds] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const {
    crop,
    setCrop,
    aspectRatio,
    videoMeta,
  } = useCropStore();

  // Track drag state
  const dragState = useRef<{
    handle: DragHandle;
    startX: number;
    startY: number;
    startCrop: typeof crop;
  } | null>(null);

  // Calculate video display bounds on mount and resize
  useEffect(() => {
    const updateBounds = () => {
      if (!containerRef.current || !videoMeta) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const bounds = getVideoDisplayBounds(containerRect, videoMeta);
      setVideoBounds(bounds);
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, [containerRef, videoMeta]);

  // Handle drag move (defined first - no dependencies on other handlers)
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragState.current || !videoBounds || !videoMeta) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    // Calculate delta in pixels
    const pixelDeltaX = clientX - dragState.current.startX;
    const pixelDeltaY = clientY - dragState.current.startY;

    // Convert to normalized coordinates
    const deltaX = pixelDeltaX / videoBounds.width;
    const deltaY = pixelDeltaY / videoBounds.height;

    // Calculate new crop
    const newCrop = calculateCropAfterDrag(
      dragState.current.startCrop,
      dragState.current.handle,
      deltaX,
      deltaY,
      aspectRatio,
      videoMeta
    );

    setCrop(newCrop);
  }, [videoBounds, videoMeta, aspectRatio, setCrop]);

  // Handle drag end (depends on handleDragMove)
  const handleDragEnd = useCallback(() => {
    dragState.current = null;
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('touchend', handleDragEnd);
  }, [handleDragMove]);

  // Handle drag start (depends on handleDragMove and handleDragEnd)
  const handleDragStart = useCallback((handle: DragHandle, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragState.current = {
      handle,
      startX: clientX,
      startY: clientY,
      startCrop: { ...crop },
    };

    // Add document-level event listeners
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragMove);
    document.addEventListener('touchend', handleDragEnd);
  }, [crop, handleDragMove, handleDragEnd]);

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  if (!videoBounds || !videoMeta) return null;

  // Calculate crop box position in pixels
  const cropLeft = videoBounds.x + crop.x * videoBounds.width;
  const cropTop = videoBounds.y + crop.y * videoBounds.height;
  const cropWidth = crop.width * videoBounds.width;
  const cropHeight = crop.height * videoBounds.height;

  // Calculate dim regions (top, right, bottom, left)
  const dimRegions = {
    top: {
      left: videoBounds.x,
      top: videoBounds.y,
      width: videoBounds.width,
      height: crop.y * videoBounds.height,
    },
    bottom: {
      left: videoBounds.x,
      top: cropTop + cropHeight,
      width: videoBounds.width,
      height: (1 - crop.y - crop.height) * videoBounds.height,
    },
    left: {
      left: videoBounds.x,
      top: cropTop,
      width: crop.x * videoBounds.width,
      height: cropHeight,
    },
    right: {
      left: cropLeft + cropWidth,
      top: cropTop,
      width: (1 - crop.x - crop.width) * videoBounds.width,
      height: cropHeight,
    },
  };

  return (
    <div
      ref={overlayRef}
      data-testid="crop-overlay"
      className="absolute inset-0 pointer-events-none"
    >
      {/* Dim overlays */}
      {Object.entries(dimRegions).map(([key, region]) => (
        <div
          key={key}
          className="absolute bg-black/50"
          style={{
            left: region.left,
            top: region.top,
            width: region.width,
            height: region.height,
          }}
        />
      ))}

      {/* Crop box border */}
      <div
        className="absolute border-2 border-white pointer-events-auto"
        style={{
          left: cropLeft,
          top: cropTop,
          width: cropWidth,
          height: cropHeight,
        }}
        onMouseDown={(e) => handleDragStart('move', e)}
        onTouchStart={(e) => handleDragStart('move', e)}
      >
        {/* Grid lines (rule of thirds) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Vertical lines */}
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
          {/* Horizontal lines */}
          <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
        </div>

        {/* Handles */}
        <CropHandles onDragStart={handleDragStart} />
      </div>
    </div>
  );
}
