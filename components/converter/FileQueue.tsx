'use client';

import { useConverterStore } from '@/lib/store/useConverterStore';
import { QueueItem } from './QueueItem';
import { ConversionQueueManager } from '@/lib/conversion/ConversionQueueManager';
import { Play, Pause, StopCircle, Package, Trash2, Sparkles } from 'lucide-react';

export function FileQueue() {
  const {
    queue,
    isProcessing,
    isPaused,
    clearQueue,
    startProcessing,
    pauseProcessing,
    resumeProcessing,
  } = useConverterStore();

  const queueManager = ConversionQueueManager.getInstance();

  const handleStart = () => {
    queueManager.startProcessing();
  };

  const handlePause = () => {
    queueManager.pauseProcessing();
  };

  const handleResume = () => {
    queueManager.resumeProcessing();
  };

  const handleCancel = () => {
    queueManager.cancelCurrent();
  };

  const pendingCount = queue.filter(item => item.status === 'pending').length;
  const processingCount = queue.filter(item => item.status === 'processing').length;
  const completedCount = queue.filter(item => item.status === 'completed').length;

  if (queue.length === 0) {
    return (
      <div data-testid="queue-container" className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl p-8 sm:p-12 shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-700 mb-1">No files in queue</p>
          <p className="text-sm text-gray-500">Add videos above to start converting</p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="queue-container" className="space-y-4">
      {/* Queue Header */}
      <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-gray-50 to-gray-100 gap-3">
          <div>
            <h3 className="font-bold text-gray-800 text-base sm:text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-600" />
              Queue
              <span className="px-2 py-0.5 bg-white rounded-full text-sm font-medium text-gray-600 shadow-sm">
                {queue.length}
              </span>
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs sm:text-sm text-gray-600">
              {pendingCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  {pendingCount} pending
                </span>
              )}
              {processingCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  {processingCount} processing
                </span>
              )}
              {completedCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {completedCount} completed
                </span>
              )}
            </div>
          </div>
          <button
            onClick={clearQueue}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        </div>

        {/* Queue Items */}
        <div className="p-3 sm:p-4 space-y-3 max-h-96 overflow-y-auto">
          {queue.map((item, index) => (
            <div key={item.id}>
              <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
                <span>{index + 1}.</span>
              </div>
              <QueueItem item={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {!isProcessing ? (
            <button
              data-testid="start-processing"
              onClick={handleStart}
              disabled={pendingCount === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4" />
              Start Processing
            </button>
          ) : (
            <>
              {isPaused ? (
                <button
                  data-testid="resume-processing"
                  onClick={handleResume}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Play className="w-4 h-4" />
                  Resume
                </button>
              ) : (
                <button
                  data-testid="pause-processing"
                  onClick={handlePause}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-sm font-medium rounded-lg hover:from-yellow-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
              )}
              <button
                data-testid="cancel-current"
                onClick={handleCancel}
                disabled={processingCount === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-rose-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <StopCircle className="w-4 h-4" />
                Cancel Current
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}