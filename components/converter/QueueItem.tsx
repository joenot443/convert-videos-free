'use client';

import { useState } from 'react';
import { QueueItem as QueueItemType, ConversionSettings } from '@/lib/store/types';
import { useConverterStore } from '@/lib/store/useConverterStore';
import { clsx } from 'clsx';

interface QueueItemProps {
  item: QueueItemType;
}

export function QueueItem({ item }: QueueItemProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [customSettings, setCustomSettings] = useState<Partial<ConversionSettings>>(
    item.settings || {}
  );

  const {
    removeFromQueue,
    retryFile,
    updateFileSettings,
    removeFileSettings,
    globalSettings,
  } = useConverterStore();

  // Use selector for better reactivity with Map
  const progressInfo = useConverterStore(state => state.progress.get(item.id));

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (item.status) {
      case 'pending':
        return '⏸️';
      case 'processing':
        return '▶️';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      case 'cancelled':
        return '⏹️';
      default:
        return '⏸️';
    }
  };

  const getStatusText = () => {
    switch (item.status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return progressInfo ? `Processing ${progressInfo.percent.toFixed(0)}%` : 'Processing';
      case 'completed':
        return '✓ Complete';
      case 'failed':
        return 'Failed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const handleApplySettings = () => {
    if (Object.keys(customSettings).length > 0) {
      updateFileSettings(item.id, customSettings);
    } else {
      removeFileSettings(item.id);
    }
    setShowSettings(false);
  };

  return (
    <>
      <div
        data-testid={`queue-item-${item.id}`}
        className={clsx(
          'border rounded-lg p-3 sm:p-4 space-y-2',
          item.status === 'processing' && 'border-blue-400 bg-blue-50',
          item.status === 'completed' && 'border-green-400 bg-green-50',
          item.status === 'failed' && 'border-red-400 bg-red-50',
          item.status === 'cancelled' && 'border-gray-400 bg-gray-50',
          item.status === 'pending' && 'border-gray-200'
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <span className="text-xl sm:text-2xl flex-shrink-0">{getStatusIcon()}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-700 text-sm sm:text-base truncate pr-2">
                {item.file.name}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {formatFileSize(item.file.size)}
                {item.outputSize && (
                  <span>
                    {' → '}
                    {formatFileSize(item.outputSize)}
                    {item.compressionRatio && (
                      <span className="ml-2 text-green-600">
                        ↓{item.compressionRatio.toFixed(0)}%
                      </span>
                    )}
                  </span>
                )}
              </p>
              {item.settings && (
                <p className="text-xs text-gray-400">
                  Custom: {item.settings.quality || globalSettings.quality} | {item.settings.resolution || globalSettings.resolution}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <span
              data-testid={`status-${item.id}`}
              className={clsx(
                'px-2 py-1 text-xs sm:text-sm rounded whitespace-nowrap',
                item.status === 'processing' && 'bg-blue-100 text-blue-700',
                item.status === 'completed' && 'bg-green-100 text-green-700',
                item.status === 'failed' && 'bg-red-100 text-red-700',
                item.status === 'cancelled' && 'bg-gray-100 text-gray-700',
                item.status === 'pending' && 'bg-gray-100 text-gray-600'
              )}
            >
              {getStatusText()}
            </span>

            {item.status === 'failed' && (
              <button
                data-testid={`retry-${item.id}`}
                onClick={() => retryFile(item.id)}
                className="px-2 py-1 text-xs sm:text-sm bg-orange-500 text-white rounded hover:bg-orange-600 whitespace-nowrap"
              >
                🔄 Retry
              </button>
            )}

            {(item.status === 'pending' || item.status === 'failed' || item.status === 'cancelled') && (
              <div className="flex gap-1">
                <button
                  data-testid={`settings-${item.id}`}
                  onClick={() => setShowSettings(!showSettings)}
                  className="px-2 py-1 text-xs sm:text-sm bg-gray-200 rounded hover:bg-gray-300"
                  title="Settings"
                >
                  ⚙️
                </button>
                <button
                  data-testid={`remove-${item.id}`}
                  onClick={() => removeFromQueue(item.id)}
                  className="px-2 py-1 text-xs sm:text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  title="Remove"
                >
                  ❌
                </button>
              </div>
            )}
          </div>
        </div>

        {item.status === 'processing' && progressInfo && (
          <div className="space-y-1">
            {/* Simple SVG progress bar that WILL work */}
            <svg width="100%" height="8" className="w-full">
              <rect width="100%" height="8" fill="#e5e7eb" rx="4" />
              <rect
                data-testid={`progress-${item.id}`}
                width={`${progressInfo.percent || 0}%`}
                height="8"
                fill="#3b82f6"
                rx="4"
              />
            </svg>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Time: {formatTime(progressInfo.timeElapsed)}</span>
              {progressInfo.estimatedTimeRemaining !== undefined && (
                <span>Est: {formatTime(progressInfo.estimatedTimeRemaining)} remaining</span>
              )}
            </div>
            {progressInfo.bytesProcessed > 0 && (
              <p className="text-xs text-gray-500">
                Processing: {formatFileSize(progressInfo.bytesProcessed)} / {formatFileSize(item.file.size)}
              </p>
            )}
          </div>
        )}

        {item.error && (
          <p className="text-sm text-red-600">
            Error: {item.error}
          </p>
        )}

        {item.status === 'completed' && item.completedAt && item.startedAt && (
          <p className="text-xs text-gray-500">
            Converted in {formatTime((item.completedAt.getTime() - item.startedAt.getTime()) / 1000)}
          </p>
        )}
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Settings for: {item.file.name}</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={Object.keys(customSettings).length > 0}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      setCustomSettings({});
                    }
                  }}
                />
                <span>Use custom settings for this file</span>
              </label>

              {Object.keys(customSettings).length > 0 && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Quality:</label>
                    <div className="space-x-2">
                      {['low', 'medium', 'high'].map(quality => (
                        <button
                          key={quality}
                          onClick={() => setCustomSettings({ ...customSettings, quality: quality as any })}
                          className={clsx(
                            'px-3 py-1 rounded text-sm',
                            customSettings.quality === quality
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700'
                          )}
                        >
                          {quality.charAt(0).toUpperCase() + quality.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Resolution:</label>
                    <select
                      value={customSettings.resolution || globalSettings.resolution}
                      onChange={(e) => setCustomSettings({ ...customSettings, resolution: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="original">Original</option>
                      <option value="1080p">1080p</option>
                      <option value="720p">720p</option>
                      <option value="480p">480p</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplySettings}
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}