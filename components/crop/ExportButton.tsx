'use client';

import { useState, useCallback } from 'react';
import { useCropStore } from '@/lib/crop/useCropStore';
import { cropToPixels } from '@/lib/crop/cropMath';
import { getCropConversionService, CropOptions, TrimOptions } from '@/lib/crop/CropConversionService';
import { Download, Loader2, X, CheckCircle } from 'lucide-react';

type ExportState = 'idle' | 'converting' | 'done' | 'error';

export function ExportButton() {
  const [exportState, setExportState] = useState<ExportState>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [downloadData, setDownloadData] = useState<{ buffer: ArrayBuffer; filename: string } | null>(null);

  const { file, videoMeta, crop, trim, quality } = useCropStore();

  // Check if crop region covers the entire video (no cropping needed)
  const isFullFrame = crop.x === 0 && crop.y === 0 && crop.width === 1 && crop.height === 1;

  // Check if trim covers the entire duration
  const isFullDuration = videoMeta
    ? trim.start === 0 && trim.end >= videoMeta.duration - 0.1
    : true;

  const handleExport = useCallback(async () => {
    if (!file || !videoMeta) return;

    setExportState('converting');
    setProgress(0);
    setErrorMessage(null);
    setDownloadData(null);

    try {
      const service = getCropConversionService();

      // Convert normalized crop to pixel values
      const cropPixels = cropToPixels(crop, videoMeta.width, videoMeta.height);

      // Build crop options (only if not full frame)
      const cropOptions: CropOptions | undefined = !isFullFrame
        ? {
            left: cropPixels.left,
            top: cropPixels.top,
            width: cropPixels.width,
            height: cropPixels.height,
          }
        : undefined;

      // Build trim options (only if not full duration)
      const trimOptions: TrimOptions | undefined = !isFullDuration
        ? {
            start: trim.start,
            end: trim.end,
          }
        : undefined;

      const jobId = await service.convertWithCrop(
        file,
        {
          preset: quality,
          crop: cropOptions,
          trim: trimOptions,
        },
        {
          onProgress: (p) => {
            setProgress(p);
          },
          onError: (error) => {
            setExportState('error');
            setErrorMessage(error);
          },
          onComplete: (result) => {
            setExportState('done');
            setProgress(1);
            setDownloadData(result);
          },
        }
      );

      setCurrentJobId(jobId);
    } catch (error) {
      setExportState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Export failed');
    }
  }, [file, videoMeta, crop, trim, quality, isFullFrame, isFullDuration]);

  const handleCancel = useCallback(() => {
    if (currentJobId) {
      const service = getCropConversionService();
      service.cancelConversion(currentJobId);
    }
    setExportState('idle');
    setProgress(0);
    setCurrentJobId(null);
  }, [currentJobId]);

  const handleDownload = useCallback(() => {
    if (!downloadData) return;

    const blob = new Blob([downloadData.buffer], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadData.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Reset state after download
    setExportState('idle');
    setProgress(0);
    setDownloadData(null);
  }, [downloadData]);

  const handleReset = useCallback(() => {
    setExportState('idle');
    setProgress(0);
    setErrorMessage(null);
    setDownloadData(null);
    setCurrentJobId(null);
  }, []);

  // Format progress percentage
  const progressPercent = Math.round(progress * 100);

  // Determine if we should show what changes will be made
  const changesDescription = [];
  if (!isFullFrame) changesDescription.push('crop');
  if (!isFullDuration) changesDescription.push('trim');
  const changesText = changesDescription.length > 0
    ? `Will ${changesDescription.join(' & ')} video`
    : 'Re-encode video';

  if (exportState === 'idle') {
    return (
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={handleExport}
          disabled={!file || !videoMeta}
          data-testid="export-button"
          className="flex items-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-lg"
        >
          <Download className="w-5 h-5" />
          Export Video
        </button>
        <p className="text-gray-500 text-xs">{changesText}</p>
      </div>
    );
  }

  if (exportState === 'converting') {
    return (
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        {/* Progress bar container */}
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
            data-testid="export-progress-bar"
          />
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            <span className="text-gray-300" data-testid="export-progress-text">
              Exporting... {progressPercent}%
            </span>
          </div>

          <button
            onClick={handleCancel}
            data-testid="cancel-export-button"
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>

        <p className="text-gray-500 text-xs">
          Processing in your browser - please keep this tab open
        </p>
      </div>
    );
  }

  if (exportState === 'done') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-6 h-6" />
          <span className="font-medium">Export complete!</span>
        </div>

        <button
          onClick={handleDownload}
          data-testid="download-button"
          className="flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors text-lg"
        >
          <Download className="w-5 h-5" />
          Download Video
        </button>

        <button
          onClick={handleReset}
          className="text-gray-400 hover:text-white text-sm underline"
        >
          Export again
        </button>
      </div>
    );
  }

  if (exportState === 'error') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-red-400">
          <X className="w-6 h-6" />
          <span className="font-medium">Export failed</span>
        </div>

        <p className="text-gray-400 text-sm text-center max-w-md" data-testid="export-error-message">
          {errorMessage || 'An unknown error occurred'}
        </p>

        <button
          onClick={handleReset}
          data-testid="retry-export-button"
          className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return null;
}
