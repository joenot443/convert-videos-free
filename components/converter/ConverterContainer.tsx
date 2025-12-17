'use client';

import { useEffect, useState } from 'react';
import { FileDropZone } from './FileDropZone';
import { SettingsPanel } from './SettingsPanel';
import { FileQueue } from './FileQueue';
import { OutputList } from './OutputList';
import { ConversionService } from '@/lib/conversion/ConversionService';

export function ConverterContainer() {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [supportMessage, setSupportMessage] = useState<string>('');

  useEffect(() => {
    // Check browser support
    const support = ConversionService.checkSupport();
    setIsSupported(support.supported);
    if (!support.supported && support.message) {
      setSupportMessage(support.message);
    }
  }, []);

  if (isSupported === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <p className="text-lg text-gray-600">⏳ Checking browser compatibility...</p>
            <p className="text-sm text-gray-500 mt-2">Loading video codecs</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-red-200">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              ⚠️ Browser Compatibility Issue
            </h2>
            <p className="text-gray-700 mb-4">
              {supportMessage || 'Your browser doesn\'t support WebCodecs API.'}
            </p>
            <p className="text-sm text-gray-600">
              Please use one of the following browsers:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
              <li>Chrome 94 or later</li>
              <li>Microsoft Edge 94 or later</li>
              <li>Safari 16.4 or later</li>
            </ul>
            <a
              href="https://caniuse.com/webcodecs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-blue-500 hover:underline text-sm"
            >
              Learn More →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Media Converter
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Convert videos to MP4 format directly in your browser
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            All processing happens locally - your files never leave your device
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* File Drop Zone */}
          <FileDropZone />

          {/* Settings Panel */}
          <SettingsPanel />

          {/* File Queue */}
          <FileQueue />

          {/* Completed Files */}
          <OutputList />
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 text-center text-xs sm:text-sm text-gray-500">
          <p className="px-4">
            Powered by WebCodecs API • No server uploads • Complete privacy
          </p>
        </div>
      </div>
    </div>
  );
}