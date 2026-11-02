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
  const [videoBounds, setVideoBounds] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const {
    crop,
    setCrop,
    aspectRatio,
    videoMeta,
  } = useCropStore();

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

  // Listeners stay attached to the document for the length of one drag, so that
  // the pointer can leave the crop box without ending it.
  const stopDragging = useRef<(() => void) | null>(null);
  useEffect(() => () => stopDragging.current?.(), []);

  const handleDragStart = useCallback((handle: DragHandle, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!videoBounds || !videoMeta) return;

    const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const startCrop = { ...crop };

    const onMove = (event: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
      setCrop(
        calculateCropAfterDrag(
          startCrop,
          handle,
          (clientX - startX) / videoBounds.width,
          (clientY - startY) / videoBounds.height,
          aspectRatio,
          videoMeta
        )
      );
    };

    const stop = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', stop);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', stop);
      stopDragging.current = null;
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', stop);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', stop);
    stopDragging.current = stop;
  }, [crop, videoBounds, videoMeta, aspectRatio, setCrop]);

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
        className="absolute border-2 border-white pointer-events-auto touch-none"
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
