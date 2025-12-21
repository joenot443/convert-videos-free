'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { useCropStore } from '@/lib/crop/useCropStore';
import { useFilmstrip, formatTime } from '@/lib/crop/useFilmstrip';
import { TrimHandle } from './TrimHandle';

interface TimelineProps {
  onSeek?: (time: number) => void;
}

export function Timeline({ onSeek }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);

  const {
    videoMeta,
    trim,
    setTrimStart,
    setTrimEnd,
    currentTime,
    setCurrentTime,
  } = useCropStore();

  const duration = videoMeta?.duration || 0;

  // Generate filmstrip thumbnails
  const { thumbnails, isGenerating } = useFilmstrip(
    useCropStore.getState().videoUrl,
    duration,
    { thumbnailCount: 20 }
  );

  // Convert time to percentage position
  const timeToPercent = useCallback(
    (time: number) => {
      if (duration <= 0) return 0;
      return (time / duration) * 100;
    },
    [duration]
  );

  // Convert percentage to time
  const percentToTime = useCallback(
    (percent: number) => {
      return (percent / 100) * duration;
    },
    [duration]
  );

  // Get time from mouse position
  const getTimeFromEvent = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!timelineRef.current) return 0;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      return percentToTime(percent);
    },
    [percentToTime]
  );

  // Handle click on timeline to seek
  const handleTimelineClick = useCallback(
    (e: React.MouseEvent) => {
      // Don't seek if clicking on handles
      if ((e.target as HTMLElement).closest('[data-trim-handle]')) {
        return;
      }

      const time = getTimeFromEvent(e);
      setCurrentTime(time);
      onSeek?.(time);
    },
    [getTimeFromEvent, setCurrentTime, onSeek]
  );

  // Handle trim start drag
  const handleTrimStartDrag = useCallback(
    (deltaPercent: number) => {
      const currentStartPercent = timeToPercent(trim.start);
      const newPercent = Math.max(0, currentStartPercent + deltaPercent);
      const newTime = percentToTime(newPercent);
      // Ensure at least 0.5s gap between start and end
      if (newTime < trim.end - 0.5) {
        setTrimStart(newTime);
      }
    },
    [trim.start, trim.end, timeToPercent, percentToTime, setTrimStart]
  );

  // Handle trim end drag
  const handleTrimEndDrag = useCallback(
    (deltaPercent: number) => {
      const currentEndPercent = timeToPercent(trim.end);
      const newPercent = Math.min(100, currentEndPercent + deltaPercent);
      const newTime = percentToTime(newPercent);
      // Ensure at least 0.5s gap between start and end
      if (newTime > trim.start + 0.5) {
        setTrimEnd(newTime);
      }
    },
    [trim.start, trim.end, timeToPercent, percentToTime, setTrimEnd]
  );

  // Handle playhead drag
  const handlePlayheadMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingPlayhead(true);

      const handleMouseMove = (e: MouseEvent) => {
        const time = getTimeFromEvent(e);
        setCurrentTime(time);
        onSeek?.(time);
      };

      const handleMouseUp = () => {
        setIsDraggingPlayhead(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [getTimeFromEvent, setCurrentTime, onSeek]
  );

  // Calculate positions
  const trimStartPercent = timeToPercent(trim.start);
  const trimEndPercent = timeToPercent(trim.end);
  const playheadPercent = timeToPercent(currentTime);

  return (
    <div className="w-full" data-testid="timeline">
      {/* Time display */}
      <div className="flex justify-between text-xs text-gray-400 mb-2 px-1">
        <span data-testid="trim-start-time">{formatTime(trim.start)}</span>
        <span className="text-gray-500">
          Duration: {formatTime(trim.end - trim.start)}
        </span>
        <span data-testid="trim-end-time">{formatTime(trim.end)}</span>
      </div>

      {/* Timeline track */}
      <div
        ref={timelineRef}
        className="relative h-16 bg-[#0d1321] rounded-lg overflow-hidden cursor-pointer"
        onClick={handleTimelineClick}
      >
        {/* Filmstrip thumbnails */}
        <div className="absolute inset-0 flex">
          {isGenerating ? (
            // Loading skeleton
            <div className="flex-1 flex items-center justify-center">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            thumbnails.map((thumb, index) => (
              <div
                key={index}
                className="flex-1 h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${thumb})` }}
              />
            ))
          )}
        </div>

        {/* Dimmed regions outside trim range */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-black/60 pointer-events-none"
          style={{ width: `${trimStartPercent}%` }}
        />
        <div
          className="absolute top-0 bottom-0 right-0 bg-black/60 pointer-events-none"
          style={{ width: `${100 - trimEndPercent}%` }}
        />

        {/* Trim region border */}
        <div
          className="absolute top-0 bottom-0 border-y-2 border-blue-500 pointer-events-none"
          style={{
            left: `${trimStartPercent}%`,
            width: `${trimEndPercent - trimStartPercent}%`,
          }}
        />

        {/* Trim handles */}
        <TrimHandle
          position="start"
          percent={trimStartPercent}
          onDrag={handleTrimStartDrag}
          timelineRef={timelineRef}
        />
        <TrimHandle
          position="end"
          percent={trimEndPercent}
          onDrag={handleTrimEndDrag}
          timelineRef={timelineRef}
        />

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-20 cursor-ew-resize"
          style={{ left: `${playheadPercent}%`, transform: 'translateX(-50%)' }}
          onMouseDown={handlePlayheadMouseDown}
          data-testid="playhead"
        >
          {/* Playhead handle */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-md" />
        </div>
      </div>

      {/* Time markers */}
      <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
        <span>00:00</span>
        <span>{formatTime(duration / 2)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
