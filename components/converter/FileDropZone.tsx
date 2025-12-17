'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { useConverterStore } from '@/lib/store/useConverterStore';
import { clsx } from 'clsx';

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
          'relative border-2 border-dashed rounded-lg transition-all cursor-pointer',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400',
          hasFiles ? 'p-3 sm:p-4' : 'p-8 sm:p-12'
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">📹</span>
                <span className="text-sm sm:text-base text-gray-700">{queue.length} file(s) selected</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                className="px-3 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
              >
                + Add More Files
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center px-4">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📹</div>
            <p className="text-base sm:text-lg font-medium text-gray-700 mb-2">
              {isDragging ? 'Drop files to add to queue' : 'Drag videos here'}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
              or click to browse files
            </p>
            <p className="text-xs text-gray-400">
              Supports: MP4, MOV, WebM, MKV, AVI
            </p>
            <p className="text-xs text-gray-400">
              Max: 10 files, 2GB each
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}