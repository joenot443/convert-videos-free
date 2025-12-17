'use client';

import { useState } from 'react';
import { useConverterStore } from '@/lib/store/useConverterStore';
import { QualityPreset, ResolutionCap } from '@/lib/store/types';
import { clsx } from 'clsx';
import { Settings, ChevronUp, ChevronDown } from 'lucide-react';

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
    <div data-testid="settings-panel" className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div
        className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-gray-50 to-gray-100 cursor-pointer hover:from-gray-100 hover:to-gray-150 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="font-bold text-gray-800 text-sm sm:text-base">
            {isCollapsed ? (
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Settings: {globalSettings.quality} • {globalSettings.resolution} • Auto-download {globalSettings.autoDownload ? 'enabled' : 'disabled'}
              </span>
            ) : (
              'Settings'
            )}
          </h3>
        </div>
        <button
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label={isCollapsed ? 'Show settings' : 'Hide settings'}
        >
          {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-5 sm:p-6 space-y-5">
          {/* Quality Settings */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Video Quality
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {qualityOptions.map(option => (
                <button
                  key={option.value}
                  data-testid={`quality-${option.value}`}
                  onClick={() => updateGlobalSettings({ quality: option.value })}
                  type="button"
                  className={clsx(
                    'px-4 py-3 rounded-lg text-sm font-medium text-center transition-all duration-200',
                    globalSettings.quality === option.value
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transform scale-[1.02]'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  )}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-xs opacity-80">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Settings */}
          <div>
            <label
              htmlFor="resolution-select"
              className="block text-sm font-semibold text-gray-700 mb-3"
            >
              Maximum Resolution
            </label>
            <select
              id="resolution-select"
              data-testid="resolution-select"
              value={globalSettings.resolution}
              onChange={(e) => updateGlobalSettings({ resolution: e.target.value as ResolutionCap })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-gray-700"
            >
              {resolutionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Checkbox Settings */}
          <div className="space-y-3 bg-gray-50 rounded-lg p-4">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                data-testid="auto-download"
                type="checkbox"
                checked={globalSettings.autoDownload}
                onChange={(e) => updateGlobalSettings({ autoDownload: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-2"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                Auto-download files when complete
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                data-testid="remove-after-download"
                type="checkbox"
                checked={globalSettings.removeAfterDownload}
                onChange={(e) => updateGlobalSettings({ removeAfterDownload: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-2"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                Remove from queue after download
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}