'use client';

import { useCallback, useRef } from 'react';

interface TrimHandleProps {
  position: 'start' | 'end';
  percent: number;
  onDrag: (deltaPercent: number) => void;
  timelineRef: React.RefObject<HTMLDivElement | null>;
}

export function TrimHandle({ position, percent, onDrag, timelineRef }: TrimHandleProps) {
  const dragStartX = useRef<number>(0);
  const dragStartPercent = useRef<number>(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      dragStartX.current = e.clientX;
      dragStartPercent.current = percent;

      const handleMouseMove = (e: MouseEvent) => {
        if (!timelineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const deltaX = e.clientX - dragStartX.current;
        const deltaPercent = (deltaX / rect.width) * 100;

        onDrag(deltaPercent);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [percent, onDrag, timelineRef]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const touch = e.touches[0];
      dragStartX.current = touch.clientX;
      dragStartPercent.current = percent;

      const handleTouchMove = (e: TouchEvent) => {
        if (!timelineRef.current) return;

        const touch = e.touches[0];
        const rect = timelineRef.current.getBoundingClientRect();
        const deltaX = touch.clientX - dragStartX.current;
        const deltaPercent = (deltaX / rect.width) * 100;

        onDrag(deltaPercent);
      };

      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    },
    [percent, onDrag, timelineRef]
  );

  const isStart = position === 'start';

  return (
    <div
      data-trim-handle
      data-testid={`trim-handle-${position}`}
      className="absolute top-0 bottom-0 w-4 z-10 cursor-ew-resize group"
      style={{
        left: isStart ? `${percent}%` : 'auto',
        right: isStart ? 'auto' : `${100 - percent}%`,
        transform: isStart ? 'translateX(-100%)' : 'translateX(100%)',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Handle visual */}
      <div
        className={`absolute top-0 bottom-0 w-2 bg-blue-500 flex items-center justify-center transition-colors group-hover:bg-blue-400 ${
          isStart ? 'right-0 rounded-l' : 'left-0 rounded-r'
        }`}
      >
        {/* Grip dots */}
        <div className="flex flex-col gap-1">
          <div className="w-0.5 h-0.5 bg-white/70 rounded-full" />
          <div className="w-0.5 h-0.5 bg-white/70 rounded-full" />
          <div className="w-0.5 h-0.5 bg-white/70 rounded-full" />
        </div>
      </div>

      {/* Extended hit area */}
      <div
        className={`absolute top-0 bottom-0 w-4 ${
          isStart ? 'right-0' : 'left-0'
        }`}
      />
    </div>
  );
}
