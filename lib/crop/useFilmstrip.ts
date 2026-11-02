'use client';

import { useState, useEffect } from 'react';

interface FilmstripOptions {
  thumbnailCount?: number;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
}

interface FilmstripResult {
  thumbnails: string[];
  isGenerating: boolean;
  error: string | null;
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

  const { thumbnailCount, thumbnailWidth, thumbnailHeight } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  useEffect(() => {
    if (!videoUrl || !(duration > 0) || !Number.isFinite(duration)) return;

    let cancelled = false;
    const video = document.createElement('video');

    // Resolves on the event, or after a timeout so that a stuck video can't
    // hang the whole filmstrip.
    const waitFor = (event: 'loadedmetadata' | 'seeked', timeoutMs: number) =>
      new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Timed out reading video')), timeoutMs);
        video.addEventListener(event, () => { clearTimeout(timer); resolve(); }, { once: true });
        video.addEventListener('error', () => { clearTimeout(timer); reject(new Error('Failed to load video')); }, { once: true });
      });

    const generate = async () => {
      setIsGenerating(true);
      setError(null);
      try {
        video.muted = true;
        video.preload = 'metadata';
        const loaded = waitFor('loadedmetadata', 10000);
        video.src = videoUrl;
        await loaded;

        const canvas = document.createElement('canvas');
        canvas.width = thumbnailWidth;
        canvas.height = thumbnailHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        // Letterbox rather than stretch, because videos come in every shape.
        const scale = Math.min(thumbnailWidth / video.videoWidth, thumbnailHeight / video.videoHeight);
        const drawWidth = video.videoWidth * scale;
        const drawHeight = video.videoHeight * scale;
        const offsetX = (thumbnailWidth - drawWidth) / 2;
        const offsetY = (thumbnailHeight - drawHeight) / 2;

        const frames: string[] = [];
        for (let i = 0; i < thumbnailCount && !cancelled; i++) {
          const seeked = waitFor('seeked', 5000);
          video.currentTime = (i * duration) / thumbnailCount;
          await seeked;
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, thumbnailWidth, thumbnailHeight);
          ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
          frames.push(canvas.toDataURL('image/jpeg', 0.6));
        }
        if (!cancelled) setThumbnails(frames);
      } catch (err) {
        if (cancelled) return;
        // The filmstrip is a nicety: trimming still works without one.
        console.warn('Could not generate filmstrip:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate thumbnails');
        setThumbnails([]);
      } finally {
        if (!cancelled) setIsGenerating(false);
      }
    };

    generate();

    return () => {
      cancelled = true;
      setIsGenerating(false);
      setThumbnails([]);
      video.removeAttribute('src');
      video.load();
    };
  }, [videoUrl, duration, thumbnailCount, thumbnailWidth, thumbnailHeight]);

  return { thumbnails, isGenerating, error };
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
