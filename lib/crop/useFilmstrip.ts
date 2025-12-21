'use client';

import { useState, useEffect, useCallback } from 'react';

interface FilmstripOptions {
  thumbnailCount?: number;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
}

interface FilmstripResult {
  thumbnails: string[];
  isGenerating: boolean;
  error: string | null;
  regenerate: () => void;
}

const DEFAULT_OPTIONS: Required<FilmstripOptions> = {
  thumbnailCount: 20,
  thumbnailWidth: 80,
  thumbnailHeight: 45, // 16:9 aspect
};

/**
 * Hook to generate filmstrip thumbnails from a video
 */
export function useFilmstrip(
  videoUrl: string | null,
  duration: number,
  options: FilmstripOptions = {}
): FilmstripResult {
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regenerateKey, setRegenerateKey] = useState(0);

  const { thumbnailCount, thumbnailWidth, thumbnailHeight } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const generateThumbnails = useCallback(async () => {
    if (!videoUrl || duration <= 0) {
      setThumbnails([]);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Create a temporary video element for seeking
      const video = document.createElement('video');
      video.src = videoUrl;
      video.muted = true;
      video.preload = 'metadata';

      // Wait for metadata to load
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error('Failed to load video'));
        // Timeout after 10 seconds
        setTimeout(() => reject(new Error('Video load timeout')), 10000);
      });

      const canvas = document.createElement('canvas');
      canvas.width = thumbnailWidth;
      canvas.height = thumbnailHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      const newThumbnails: string[] = [];
      const interval = duration / thumbnailCount;

      for (let i = 0; i < thumbnailCount; i++) {
        const targetTime = i * interval;

        // Seek to target time
        video.currentTime = targetTime;

        // Wait for seek to complete
        await new Promise<void>((resolve) => {
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            resolve();
          };
          video.addEventListener('seeked', onSeeked);
        });

        // Draw frame to canvas
        ctx.drawImage(video, 0, 0, thumbnailWidth, thumbnailHeight);

        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        newThumbnails.push(dataUrl);
      }

      setThumbnails(newThumbnails);

      // Clean up
      video.src = '';
      video.load();
    } catch (err) {
      console.error('Error generating filmstrip:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate thumbnails');
      setThumbnails([]);
    } finally {
      setIsGenerating(false);
    }
  }, [videoUrl, duration, thumbnailCount, thumbnailWidth, thumbnailHeight]);

  // Generate thumbnails when video URL or duration changes
  useEffect(() => {
    generateThumbnails();
  }, [generateThumbnails, regenerateKey]);

  const regenerate = useCallback(() => {
    setRegenerateKey((prev) => prev + 1);
  }, []);

  return {
    thumbnails,
    isGenerating,
    error,
    regenerate,
  };
}

/**
 * Format time in seconds to MM:SS.s format
 */
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '00:00.0';

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toFixed(1).padStart(4, '0')}`;
}

/**
 * Format time in seconds to MM:SS format (no decimals)
 */
export function formatTimeShort(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '00:00';

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
