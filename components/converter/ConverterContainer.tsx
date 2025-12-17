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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Checking browser compatibility...</p>
            <p className="text-sm text-gray-500 mt-2">Loading video codecs</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-red-100">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
              Browser Compatibility Issue
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              {supportMessage || 'Your browser doesn\'t support WebCodecs API.'}
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Supported browsers:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Chrome 94 or later
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Microsoft Edge 94 or later
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Safari 16.4 or later
                </li>
              </ul>
            </div>
            <a
              href="https://caniuse.com/webcodecs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full mt-6 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium"
            >
              Learn More
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 sm:py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Media Converter
          </h1>
          <p className="text-base sm:text-lg text-gray-700 font-medium">
            Convert videos to MP4 format directly in your browser
          </p>
          <div className="flex items-center justify-center mt-3 space-x-6">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Complete privacy
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              WebCodecs powered
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              No uploads
            </div>
          </div>
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
        <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-200/50">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-gray-600">
              Powered by <span className="font-semibold text-gray-700">WebCodecs API</span>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}