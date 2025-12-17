'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ConversionService } from '@/lib/conversion/ConversionService';

type ConversionStatus = 'idle' | 'converting' | 'completed' | 'error';

interface ConversionJob {
  id: string;
  fileName: string;
  status: ConversionStatus;
  progress: number;
  bytesWritten?: number;
  error?: string;
  result?: any;
}

export default function MediaConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);
  const [supportInfo, setSupportInfo] = useState<ReturnType<typeof ConversionService.checkSupport> | null>(null);
  const [preset, setPreset] = useState<'low' | 'medium' | 'high'>('medium');
  const [useStreaming, setUseStreaming] = useState(false);

  const conversionServiceRef = useRef<ConversionService | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize conversion service and check support
    conversionServiceRef.current = new ConversionService();
    const support = ConversionService.checkSupport();
    setSupportInfo(support);
    setUseStreaming(support.streaming);

    return () => {
      conversionServiceRef.current?.dispose();
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setConversionJob(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setConversionJob(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const startConversion = async () => {
    if (!selectedFile || !conversionServiceRef.current) return;

    const job: ConversionJob = {
      id: '',
      fileName: selectedFile.name,
      status: 'converting',
      progress: 0
    };

    setConversionJob(job);

    try {
      const jobId = await conversionServiceRef.current.convertFile(
        selectedFile,
        {
          preset,
          streamMode: useStreaming
        },
        {
          onProgress: (progress, bytesWritten) => {
            setConversionJob(prev => prev ? {
              ...prev,
              progress: Math.round(progress * 100),
              bytesWritten
            } : null);
          },
          onError: (error) => {
            setConversionJob(prev => prev ? {
              ...prev,
              status: 'error',
              error
            } : null);
          },
          onComplete: (result) => {
            setConversionJob(prev => prev ? {
              ...prev,
              status: 'completed',
              progress: 100,
              result
            } : null);

            // If buffer mode, trigger download
            if (result.mode === 'buffer') {
              const blob = new Blob([result.buffer], { type: result.mime });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = result.filename;
              a.click();
              URL.revokeObjectURL(url);
            }
          }
        }
      );

      setConversionJob(prev => prev ? { ...prev, id: jobId } : null);
    } catch (error) {
      setConversionJob(prev => prev ? {
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      } : null);
    }
  };

  const cancelConversion = () => {
    if (conversionJob?.id && conversionServiceRef.current) {
      conversionServiceRef.current.cancelConversion(conversionJob.id);
      setConversionJob(null);
    }
  };

  const formatBytes = (bytes?: number): string => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let value = bytes;
    while (value >= 1024 && i < units.length - 1) {
      value /= 1024;
      i++;
    }
    return `${value.toFixed(1)} ${units[i]}`;
  };

  // Check for browser support
  if (supportInfo && !supportInfo.supported) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Browser Not Supported</h2>
          <p className="text-gray-700">{supportInfo.message}</p>
          <p className="text-sm text-gray-500 mt-4">
            Please use Chrome, Edge, or Safari for the best experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Media Converter</h1>

          {/* File selection area */}
          {!conversionJob && (
            <>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*,.mp4,.mov,.webm,.mkv"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {selectedFile ? (
                  <div>
                    <svg
                      className="mx-auto h-12 w-12 text-green-500 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Size: {formatBytes(selectedFile.size)}
                    </p>
                  </div>
                ) : (
                  <div>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      Drag a video file here
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: MP4, MOV, WebM, MKV
                    </p>
                  </div>
                )}
              </div>

              {/* File selection and conversion controls */}
              <div className="mt-6 space-y-4">
                {/* File selection button */}
                {!selectedFile && (
                  <div className="text-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Select File
                    </button>
                  </div>
                )}

                {/* Conversion options - only show when file is selected */}
                {selectedFile && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quality Preset
                        </label>
                        <select
                          value={preset}
                          onChange={(e) => setPreset(e.target.value as 'low' | 'medium' | 'high')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low (2 Mbps)</option>
                          <option value="medium">Medium (5 Mbps)</option>
                          <option value="high">High (10 Mbps)</option>
                        </select>
                      </div>

                      {supportInfo?.streaming && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="streaming"
                            checked={useStreaming}
                            onChange={(e) => setUseStreaming(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="streaming" className="ml-2 text-sm text-gray-700">
                            Use streaming mode (saves directly to disk)
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={startConversion}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Convert to MP4
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setConversionJob(null);
                        }}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Conversion progress */}
          {conversionJob && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {conversionJob.status === 'converting' ? 'Converting' :
                   conversionJob.status === 'completed' ? 'Conversion Complete' :
                   'Conversion Failed'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{conversionJob.fileName}</p>

                {conversionJob.status === 'converting' && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${conversionJob.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{conversionJob.progress}%</span>
                      {conversionJob.bytesWritten && (
                        <span>Written: {formatBytes(conversionJob.bytesWritten)}</span>
                      )}
                    </div>
                  </>
                )}

                {conversionJob.status === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-4">
                    <p className="text-sm text-red-800">{conversionJob.error}</p>
                  </div>
                )}

                {conversionJob.status === 'completed' && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4">
                    <p className="text-sm text-green-800">
                      {conversionJob.result?.mode === 'stream'
                        ? 'File saved successfully!'
                        : 'Conversion complete! Download should start automatically.'}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  {conversionJob.status === 'converting' && (
                    <button
                      onClick={cancelConversion}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  {(conversionJob.status === 'completed' || conversionJob.status === 'error') && (
                    <button
                      onClick={() => {
                        setConversionJob(null);
                        setSelectedFile(null);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Convert Another
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Browser support info */}
          {supportInfo && (
            <div className="mt-8 text-xs text-gray-500">
              <p>WebCodecs: {supportInfo.webCodecs ? '✓' : '✗'}</p>
              <p>Streaming: {supportInfo.streaming ? '✓' : '✗'} {!supportInfo.streaming && '(Safari uses in-memory conversion)'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}