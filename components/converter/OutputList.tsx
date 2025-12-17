'use client';

import { useConverterStore } from '@/lib/store/useConverterStore';

export function OutputList() {
  const { completedFiles, downloadFile, downloadAll, clearCompleted } = useConverterStore();

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (completedFiles.length === 0) {
    return null;
  }

  return (
    <div data-testid="completed-container" className="border border-gray-200 rounded-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 bg-green-50 gap-2 sm:gap-0">
        <h3 className="font-semibold text-gray-700 text-sm sm:text-base">
          COMPLETED ({completedFiles.length} file{completedFiles.length !== 1 ? 's' : ''})
        </h3>
        <div className="flex gap-2">
          <button
            data-testid="download-all"
            onClick={downloadAll}
            className="px-3 sm:px-4 py-1 bg-blue-500 text-white text-xs sm:text-sm rounded hover:bg-blue-600 whitespace-nowrap"
          >
            Download All
          </button>
          <button
            data-testid="clear-completed"
            onClick={clearCompleted}
            className="px-3 sm:px-4 py-1 bg-gray-200 text-gray-700 text-xs sm:text-sm rounded hover:bg-gray-300"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-3 max-h-64 overflow-y-auto">
        {completedFiles.map((file) => (
          <div
            key={file.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-3"
          >
            <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 flex-1">
              <span className="text-xl sm:text-2xl flex-shrink-0">✅</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-700 text-sm sm:text-base truncate pr-2">
                  {file.outputName}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {formatFileSize(file.originalSize)} → {formatFileSize(file.outputSize)}
                  {file.compressionRatio > 0 && (
                    <span className="ml-2 text-green-600">
                      ↓{file.compressionRatio.toFixed(0)}%
                    </span>
                  )}
                  {file.compressionRatio < 0 && (
                    <span className="ml-2 text-orange-600">
                      ↑{Math.abs(file.compressionRatio).toFixed(0)}%
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-400">
                  Converted in {formatTime(file.processingTime)}
                </p>
              </div>
            </div>

            <button
              data-testid={`download-${file.id}`}
              onClick={() => downloadFile(file.id)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white text-xs sm:text-sm rounded hover:bg-blue-600 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
            >
              <span>💾</span>
              <span>Download</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}