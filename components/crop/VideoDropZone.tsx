'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { useCropStore } from '@/lib/crop/useCropStore';
import { clsx } from 'clsx';
import { Upload, Video, AlertCircle } from 'lucide-react';

const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska', 'video/x-msvideo'];
const ALLOWED_EXTENSIONS = ['.mp4', '.mov', '.webm', '.mkv', '.avi'];
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

export function VideoDropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setFile } = useCropStore();

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }

    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);

    // Check file type
    const isValidType = ALLOWED_TYPES.some(type => file.type === type) ||
                       ALLOWED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!isValidType) {
      setError(`Unsupported format. Please use MP4, MOV, WebM, MKV, or AVI.`);
      return;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File exceeds 2GB limit.`);
      return;
    }

    setFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        data-testid="video-drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={clsx(
          'relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer p-12 sm:p-16',
          isDragging
            ? 'border-blue-400 bg-blue-500/10 scale-[1.01]'
            : 'border-gray-600 hover:border-blue-400/60 hover:bg-white/5 bg-[#16213e]/50'
        )}
      >
        <input
          ref={fileInputRef}
          data-testid="file-input"
          type="file"
          accept={ALLOWED_EXTENSIONS.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-center">
          <div className="flex justify-center mb-4">
            {isDragging ? (
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center animate-bounce shadow-lg shadow-blue-500/30">
                <Upload className="w-10 h-10 text-white" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center group-hover:from-blue-900 group-hover:to-indigo-900 transition-all duration-300">
                <Video className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-white mb-2">
            {isDragging ? 'Drop to load video' : 'Drop your video here'}
          </p>
          <p className="text-gray-400 mb-4">
            or{' '}
            <span className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer">
              browse
            </span>
            {' '}from your computer
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg font-medium">
              MP4, MOV, WebM, MKV, AVI
            </span>
            <span className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg font-medium">
              Max: 2GB
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-red-300">{error}</span>
        </div>
      )}
    </div>
  );
}
