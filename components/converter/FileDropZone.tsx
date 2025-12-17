'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { useConverterStore } from '@/lib/store/useConverterStore';
import { clsx } from 'clsx';
import { Upload, Video, Plus, AlertCircle } from 'lucide-react';

const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska', 'video/x-msvideo'];
const ALLOWED_EXTENSIONS = ['.mp4', '.mov', '.webm', '.mkv', '.avi'];
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
const MAX_FILES = 10;

export function FileDropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addFiles, queue } = useConverterStore();

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
    validateAndAddFiles(files);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    validateAndAddFiles(files);

    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateAndAddFiles = (files: File[]) => {
    setError(null);

    // Check queue limit
    const remainingSlots = MAX_FILES - queue.length;
    if (remainingSlots <= 0) {
      setError('Queue is full. Maximum 10 files allowed.');
      return;
    }

    if (files.length > remainingSlots) {
      setError(`Can only add ${remainingSlots} more file(s) to the queue.`);
      files = files.slice(0, remainingSlots);
    }

    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      // Check file type
      const isValidType = ALLOWED_TYPES.some(type => file.type === type) ||
                         ALLOWED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));

      if (!isValidType) {
        errors.push(`${file.name}: Unsupported format`);
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: Exceeds 2GB limit`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setError(errors.join(', '));
      setTimeout(() => setError(null), 5000);
    }

    if (validFiles.length > 0) {
      addFiles(validFiles);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const hasFiles = queue.length > 0;

  return (
    <div className="w-full">
      <div
        data-testid="drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={clsx(
          'relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer backdrop-blur-sm',
          isDragging
            ? 'border-blue-400 bg-blue-50/50 shadow-lg shadow-blue-100/50 scale-[1.02]'
            : 'border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-gray-100/50 bg-white/50',
          hasFiles ? 'p-4 sm:p-5' : 'p-10 sm:p-14'
        )}
      >
        <input
          ref={fileInputRef}
          data-testid="file-input"
          type="file"
          multiple
          accept={ALLOWED_EXTENSIONS.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        {hasFiles ? (
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-600" />
                <span className="text-sm sm:text-base font-medium text-gray-700">{queue.length} file(s) selected</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add More Files
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center px-4">
            <div className="flex justify-center mb-4">
              {isDragging ? (
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <p className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              {isDragging ? 'Drop files to add to queue' : 'Drop videos here to convert'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or
              <span className="text-blue-600 font-medium mx-1">browse</span>
              from your computer
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span>MP4 • MOV • WebM • MKV • AVI</span>
              <span>•</span>
              <span>Max 2GB per file</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}
    </div>
  );
}