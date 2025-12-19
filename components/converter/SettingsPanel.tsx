'use client';

import { useState } from 'react';
import { useConverterStore } from '@/lib/store/useConverterStore';
import { useDictionary } from '@/components/providers/DictionaryProvider';
import { QualityPreset, ResolutionCap } from '@/lib/store/types';
import { clsx } from 'clsx';
import { Settings, ChevronUp, ChevronDown } from 'lucide-react';

export function SettingsPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { globalSettings, updateGlobalSettings } = useConverterStore();
  const { dictionary } = useDictionary();
  const d = dictionary.settings;

  const qualityOptions: { value: QualityPreset; label: string; description: string }[] = [
    { value: 'low', label: d.low, description: '2 Mbps' },
    { value: 'medium', label: d.medium, description: '5 Mbps' },
    { value: 'high', label: d.high, description: '10 Mbps' },
  ];

  const resolutionOptions: { value: ResolutionCap; label: string }[] = [
    { value: 'original', label: d.original },
    { value: '1080p', label: '1080p (1920×1080)' },
    { value: '720p', label: '720p (1280×720)' },
    { value: '480p', label: '480p (854×480)' },
  ];

  const getQualityLabel = (quality: QualityPreset) => {
    switch (quality) {
      case 'low': return d.low;
      case 'medium': return d.medium;
      case 'high': return d.high;
      default: return d.medium;
    }
  };

  return (
    <div data-testid="settings-panel" className="bg-white/60 backdrop-blur-sm border border-gray-300/60 rounded-2xl shadow-lg shadow-gray-200/20 overflow-hidden">
      <div
        className="flex items-center justify-between p-4 bg-white/90 cursor-pointer hover:bg-gray-50/90 transition-all duration-200"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200/70 rounded-xl">
            <Settings className="w-4 h-4 text-gray-700" />
          </div>
          <div className="flex-1">
            {isCollapsed ? (
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
                <span className="font-semibold text-gray-900 text-sm">{d.title}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-medium">
                    {getQualityLabel(globalSettings.quality)}
                  </span>
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md font-medium">
                    {globalSettings.resolution === 'original' ? d.original : globalSettings.resolution}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md font-medium ${
                    globalSettings.autoDownload
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {d.autoDownload} {globalSettings.autoDownload ? d.on : d.off}
                  </span>
                </div>
              </div>
            ) : (
              <h3 className="font-semibold text-gray-900 text-sm">{d.title}</h3>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            aria-label={isCollapsed ? 'Show settings' : 'Hide settings'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 sm:p-5 space-y-4 bg-gray-50/30">
          {/* Quality Settings */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              {d.videoQuality}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {qualityOptions.map(option => (
                <button
                  key={option.value}
                  data-testid={`quality-${option.value}`}
                  onClick={() => updateGlobalSettings({ quality: option.value })}
                  type="button"
                  className={clsx(
                    'relative px-4 py-2.5 rounded-lg text-sm font-medium text-center transition-all duration-200 border',
                    globalSettings.quality === option.value
                      ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  )}
                >
                  {globalSettings.quality === option.value && (
                    <div className="absolute inset-x-0 -top-px h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-lg" />
                  )}
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-xs opacity-75 mt-0.5">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Settings */}
          <div>
            <label
              htmlFor="resolution-select"
              className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2"
            >
              {d.maxResolution}
            </label>
            <select
              id="resolution-select"
              data-testid="resolution-select"
              value={globalSettings.resolution}
              onChange={(e) => updateGlobalSettings({ resolution: e.target.value as ResolutionCap })}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium text-gray-700 hover:border-gray-300"
            >
              {resolutionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Checkbox Settings */}
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-white/50 transition-colors">
              <input
                data-testid="auto-download"
                type="checkbox"
                checked={globalSettings.autoDownload}
                onChange={(e) => updateGlobalSettings({ autoDownload: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">{d.autoDownload}</span>
                <span className="block text-xs text-gray-500">{d.autoDownloadDesc}</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-white/50 transition-colors">
              <input
                data-testid="remove-after-download"
                type="checkbox"
                checked={globalSettings.removeAfterDownload}
                onChange={(e) => updateGlobalSettings({ removeAfterDownload: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">{d.autoCleanup}</span>
                <span className="block text-xs text-gray-500">{d.autoCleanupDesc}</span>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
