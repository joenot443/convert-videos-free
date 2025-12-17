'use client';

import { useState } from 'react';
import { useConverterStore } from '@/lib/store/useConverterStore';
import { QualityPreset, ResolutionCap } from '@/lib/store/types';
import { clsx } from 'clsx';

export function SettingsPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { globalSettings, updateGlobalSettings } = useConverterStore();

  const qualityOptions: { value: QualityPreset; label: string; description: string }[] = [
    { value: 'low', label: 'Low', description: '2 Mbps' },
    { value: 'medium', label: 'Medium', description: '5 Mbps' },
    { value: 'high', label: 'High', description: '10 Mbps' },
  ];

  const resolutionOptions: { value: ResolutionCap; label: string }[] = [
    { value: 'original', label: 'Original' },
    { value: '1080p', label: '1080p (1920×1080)' },
    { value: '720p', label: '720p (1280×720)' },
    { value: '480p', label: '480p (854×480)' },
  ];

  return (
    <div data-testid="settings-panel" className="border border-gray-200 rounded-lg">
      <div
        className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="font-semibold text-gray-700 text-sm sm:text-base">
          {isCollapsed ? (
            <span className="text-xs sm:text-sm">
              SETTINGS: {globalSettings.quality} | {globalSettings.resolution} | Auto-download {globalSettings.autoDownload ? 'ON' : 'OFF'}
            </span>
          ) : (
            'SETTINGS'
          )}
        </h3>
        <button
          className="text-gray-500 hover:text-gray-700 text-sm"
          aria-label={isCollapsed ? 'Show settings' : 'Hide settings'}
        >
          {isCollapsed ? 'Show ∨' : 'Hide ∧'}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
          {/* Quality Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {qualityOptions.map(option => (
                <button
                  key={option.value}
                  data-testid={`quality-${option.value}`}
                  onClick={() => updateGlobalSettings({ quality: option.value })}
                  type="button"
                  className={clsx(
                    'px-3 py-2 rounded text-sm text-center',
                    globalSettings.quality === option.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {option.label} ({option.description})
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Settings */}
          <div>
            <label
              htmlFor="resolution-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Max Resolution:
            </label>
            <select
              id="resolution-select"
              data-testid="resolution-select"
              value={globalSettings.resolution}
              onChange={(e) => updateGlobalSettings({ resolution: e.target.value as ResolutionCap })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {resolutionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Checkbox Settings */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                data-testid="auto-download"
                type="checkbox"
                checked={globalSettings.autoDownload}
                onChange={(e) => updateGlobalSettings({ autoDownload: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Auto-download files when complete
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                data-testid="remove-after-download"
                type="checkbox"
                checked={globalSettings.removeAfterDownload}
                onChange={(e) => updateGlobalSettings({ removeAfterDownload: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Remove from queue after download
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}