'use client';

import { useConverterStore } from '@/lib/store/useConverterStore';
import { QueueItem } from './QueueItem';
import { ConversionQueueManager } from '@/lib/conversion/ConversionQueueManager';

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
      <div data-testid="queue-container" className="border border-gray-200 rounded-lg p-6 sm:p-8">
        <div className="text-center text-gray-500">
          <p className="text-xl sm:text-2xl mb-2">✨ No files yet</p>
          <p className="text-xs sm:text-sm">Add videos above to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="queue-container" className="space-y-4">
      {/* Queue Header */}
      <div className="border border-gray-200 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 gap-2">
          <div>
            <h3 className="font-semibold text-gray-700 text-sm sm:text-base">
              QUEUE ({queue.length} file{queue.length !== 1 ? 's' : ''})
            </h3>
            <span className="text-xs sm:text-sm font-normal text-gray-500">
              {pendingCount > 0 && `${pendingCount} pending`}
              {processingCount > 0 && ` · ${processingCount} processing`}
              {completedCount > 0 && ` · ${completedCount} completed`}
            </span>
          </div>
          <button
            onClick={clearQueue}
            className="text-xs sm:text-sm text-red-600 hover:text-red-700 whitespace-nowrap"
          >
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
      <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {!isProcessing ? (
            <button
              data-testid="start-processing"
              onClick={handleStart}
              disabled={pendingCount === 0}
              className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-500 text-white text-sm sm:text-base rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2"
            >
              <span>▶️</span>
              <span>Start Processing</span>
            </button>
          ) : (
            <>
              {isPaused ? (
                <button
                  data-testid="resume-processing"
                  onClick={handleResume}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 bg-green-500 text-white text-sm sm:text-base rounded-lg hover:bg-green-600 flex items-center gap-1 sm:gap-2"
                >
                  <span>▶️</span>
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  data-testid="pause-processing"
                  onClick={handlePause}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 bg-yellow-500 text-white text-sm sm:text-base rounded-lg hover:bg-yellow-600 flex items-center gap-1 sm:gap-2"
                >
                  <span>⏸️</span>
                  <span>Pause</span>
                </button>
              )}
              <button
                data-testid="cancel-current"
                onClick={handleCancel}
                disabled={processingCount === 0}
                className="px-4 sm:px-6 py-1.5 sm:py-2 bg-red-500 text-white text-sm sm:text-base rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2"
              >
                <span>⏹️</span>
                <span>Cancel Current</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}