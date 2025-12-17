'use client';

import { useState } from 'react';
import { QueueItem as QueueItemType, ConversionSettings } from '@/lib/store/types';
import { useConverterStore } from '@/lib/store/useConverterStore';
import { clsx } from 'clsx';
import {
  Play,
  CheckCircle,
  XCircle,
  StopCircle,
  Clock,
  RefreshCw,
  Settings,
  X,
  Loader2
} from 'lucide-react';

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
        return <Clock className="w-5 h-5 text-gray-400" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'cancelled':
        return <StopCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (item.status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return progressInfo ? `Processing ${progressInfo.percent.toFixed(0)}%` : 'Processing';
      case 'completed':
        return 'Complete';
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
          'rounded-xl p-4 sm:p-5 space-y-3 transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md',
          item.status === 'processing' && 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200',
          item.status === 'completed' && 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200',
          item.status === 'failed' && 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-200',
          item.status === 'cancelled' && 'bg-gray-50 border border-gray-200',
          item.status === 'pending' && 'bg-white border border-gray-200'
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <span className="flex-shrink-0">{getStatusIcon()}</span>
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
                'px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap shadow-sm',
                item.status === 'processing' && 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 animate-pulse',
                item.status === 'completed' && 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700',
                item.status === 'failed' && 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700',
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
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            )}

            {(item.status === 'pending' || item.status === 'failed' || item.status === 'cancelled') && (
              <div className="flex gap-2">
                <button
                  data-testid={`settings-${item.id}`}
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  data-testid={`remove-${item.id}`}
                  onClick={() => removeFromQueue(item.id)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {item.status === 'processing' && progressInfo && (
          <div className="space-y-2 mt-3">
            {/* Modern gradient progress bar */}
            <svg width="100%" height="8" className="w-full rounded-full overflow-hidden">
              <rect width="100%" height="8" fill="#e5e7eb" rx="4" />
              <defs>
                <linearGradient id={`progress-gradient-${item.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <rect
                data-testid={`progress-${item.id}`}
                width={`${progressInfo.percent || 0}%`}
                height="8"
                fill={`url(#progress-gradient-${item.id})`}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Custom Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4 truncate">
              {item.file.name}
            </p>

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

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplySettings}
                  className="px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-sm"
                >
                  Apply Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}