'use client';

import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useCropStore } from '@/lib/crop/useCropStore';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface VideoCanvasProps {
  children?: React.ReactNode;
}

export interface VideoCanvasHandle {
  containerRef: React.RefObject<HTMLDivElement | null>;
  seek: (time: number) => void;
}

export const VideoCanvas = forwardRef<VideoCanvasHandle, VideoCanvasProps>(
  function VideoCanvas({ children }, ref) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const {
      videoUrl,
      setVideoMeta,
      isPlaying,
      setIsPlaying,
      currentTime,
      setCurrentTime,
      trim,
      file,
    } = useCropStore();

    // Seek to a specific time
    const seek = useCallback((time: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = time;
      setCurrentTime(time);
    }, [setCurrentTime]);

    // Expose container ref and seek to parent
    useImperativeHandle(ref, () => ({
      containerRef,
      seek,
    }), [seek]);

    // Handle video metadata loaded
    const handleLoadedMetadata = useCallback(() => {
      const video = videoRef.current;
      if (!video || !file) return;

      setVideoMeta({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
        filename: file.name,
      });
    }, [file, setVideoMeta]);

    // Handle time update
    const handleTimeUpdate = useCallback(() => {
      const video = videoRef.current;
      if (!video) return;

      setCurrentTime(video.currentTime);

      // Loop within trim bounds
      if (video.currentTime >= trim.end) {
        video.currentTime = trim.start;
      }
    }, [trim.end, trim.start, setCurrentTime]);

    // Play/pause control
    const togglePlay = useCallback(() => {
      const video = videoRef.current;
      if (!video) return;

      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        // Start from trim start if before it
        if (video.currentTime < trim.start || video.currentTime >= trim.end) {
          video.currentTime = trim.start;
        }
        video.play();
        setIsPlaying(true);
      }
    }, [isPlaying, setIsPlaying, trim.start, trim.end]);

    // Sync video playing state
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);

      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }, [setIsPlaying]);

    // Reset to trim start
    const resetPlayback = useCallback(() => {
      const video = videoRef.current;
      if (!video) return;

      video.currentTime = trim.start;
      setCurrentTime(trim.start);
    }, [trim.start, setCurrentTime]);

    // Format time as MM:SS.s
    const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toFixed(1).padStart(4, '0')}`;
    };

    if (!videoUrl) {
      return null;
    }

    return (
      <div className="w-full flex flex-col items-center">
        {/* Video container with overlay */}
        <div
          ref={containerRef}
          data-testid="video-container"
          className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden"
          style={{ aspectRatio: '16/9' }}
        >
          <video
            ref={videoRef}
            data-testid="video-player"
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-contain"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            playsInline
            muted={false}
          />

          {/* Crop overlay will be rendered here */}
          {children}
        </div>

        {/* Playback controls */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={togglePlay}
            data-testid="play-button"
            className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </button>

          <button
            onClick={resetPlayback}
            data-testid="reset-button"
            className="flex items-center justify-center w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </button>

          <div className="text-gray-300 font-mono text-sm">
            <span data-testid="current-time">{formatTime(currentTime)}</span>
            <span className="text-gray-500 mx-2">/</span>
            <span data-testid="trim-duration">{formatTime(trim.end - trim.start)}</span>
          </div>
        </div>
      </div>
    );
  }
);
