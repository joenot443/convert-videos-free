'use client';

import { useConverterStore } from '@/lib/store/useConverterStore';
import { useDictionary } from '@/components/providers/DictionaryProvider';
import { Download, CheckCircle, Trash2, DownloadCloud } from 'lucide-react';

export function OutputList() {
  const { completedFiles, downloadFile, downloadAll, clearCompleted } = useConverterStore();
  const { dictionary } = useDictionary();
  const d = dictionary.output;

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
    <div data-testid="completed-container" className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-green-50 to-emerald-50 gap-3">
        <h3 className="font-bold text-gray-800 text-base sm:text-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          {d.title}
          <span className="px-2 py-0.5 bg-white rounded-full text-sm font-medium text-gray-600 shadow-sm">
            {completedFiles.length}
          </span>
        </h3>
        <div className="flex gap-2">
          <button
            data-testid="download-all"
            onClick={downloadAll}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
          >
            <DownloadCloud className="w-4 h-4" />
            {d.downloadAll}
          </button>
          <button
            data-testid="clear-completed"
            onClick={clearCompleted}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-gray-700 bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium rounded-lg transition-colors border border-gray-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {d.clear}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
        {completedFiles.map((file) => (
          <div
            key={file.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 gap-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start sm:items-center gap-3 flex-1">
              <div className="flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm sm:text-base truncate pr-2">
                  {file.outputName}
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-0.5">
                  <span>{formatFileSize(file.originalSize)}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-medium">{formatFileSize(file.outputSize)}</span>
                  {file.compressionRatio > 0 && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      -{file.compressionRatio.toFixed(0)}%
                    </span>
                  )}
                  {file.compressionRatio < 0 && (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      +{Math.abs(file.compressionRatio).toFixed(0)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {d.convertedIn} {formatTime(file.processingTime)}
                </p>
              </div>
            </div>

            <button
              data-testid={`download-${file.id}`}
              onClick={() => downloadFile(file.id)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Download className="w-4 h-4" />
              {d.download}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
