'use client';

import { create } from 'zustand';
import {
  FileStatus,
  QueueItem,
  ConversionSettings,
  ProgressInfo,
  CompletedFile,
  QualityPreset,
  ResolutionCap,
} from './types';

interface ConverterStore {
  // Queue State
  queue: QueueItem[];
  currentJobId: string | null;
  isProcessing: boolean;
  isPaused: boolean;

  // Settings State
  globalSettings: ConversionSettings;
  fileOverrides: Map<string, Partial<ConversionSettings>>;

  // Progress State
  progress: Map<string, ProgressInfo>;

  // Output State
  completedFiles: CompletedFile[];

  // Actions - Queue Management
  addFiles: (files: File[]) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  moveInQueue: (id: string, direction: 'up' | 'down') => void;

  // Actions - Settings
  updateGlobalSettings: (settings: Partial<ConversionSettings>) => void;
  updateFileSettings: (fileId: string, settings: Partial<ConversionSettings>) => void;
  removeFileSettings: (fileId: string) => void;

  // Actions - Processing Control
  startProcessing: () => void;
  pauseProcessing: () => void;
  resumeProcessing: () => void;
  cancelCurrent: () => void;
  retryFile: (id: string) => void;

  // Actions - Status Updates
  updateFileStatus: (id: string, status: FileStatus, error?: string) => void;
  updateProgress: (id: string, progress: ProgressInfo) => void;
  setCurrentJob: (jobId: string | null) => void;
  completeFile: (id: string, blob: Blob, outputSize: number) => void;

  // Actions - Output Management
  downloadFile: (id: string) => void;
  downloadAll: () => void;
  clearCompleted: () => void;
  removeCompleted: (id: string) => void;
}

const DEFAULT_SETTINGS: ConversionSettings = {
  quality: 'medium',
  resolution: '1080p',
  autoDownload: false,
  removeAfterDownload: false,
};

const MAX_QUEUE_SIZE = 10;
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

export const useConverterStore = create<ConverterStore>((set, get) => ({
  // Initial State
  queue: [],
  currentJobId: null,
  isProcessing: false,
  isPaused: false,
  globalSettings: DEFAULT_SETTINGS,
  fileOverrides: new Map(),
  progress: new Map(),
  completedFiles: [],

  // Queue Management Actions
  addFiles: (files: File[]) => {
    const currentQueue = get().queue;
    const remainingSlots = MAX_QUEUE_SIZE - currentQueue.length;

    if (remainingSlots <= 0) {
      console.warn('Queue is full. Maximum 10 files allowed.');
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots).filter(file => {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        console.warn(`File ${file.name} exceeds 2GB limit`);
        return false;
      }
      // Check for duplicates
      const isDuplicate = currentQueue.some(item =>
        item.file.name === file.name && item.file.size === file.size
      );
      if (isDuplicate) {
        console.warn(`File ${file.name} already in queue`);
        return false;
      }
      return true;
    });

    const newItems: QueueItem[] = filesToAdd.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      status: 'pending' as FileStatus,
      addedAt: new Date(),
    }));

    set(state => ({
      queue: [...state.queue, ...newItems],
    }));
  },

  removeFromQueue: (id: string) => {
    set(state => {
      const newQueue = state.queue.filter(item => item.id !== id);
      const newProgress = new Map(state.progress);
      newProgress.delete(id);

      const newOverrides = new Map(state.fileOverrides);
      newOverrides.delete(id);

      // Don't stop processing if there are still processing or pending items
      const hasProcessing = newQueue.some(item => item.status === 'processing');
      const hasPending = newQueue.some(item => item.status === 'pending');

      return {
        queue: newQueue,
        progress: newProgress,
        fileOverrides: newOverrides,
        // Maintain isProcessing if there are still items that can be processed
        isProcessing: state.isProcessing && (hasProcessing || hasPending),
      };
    });
  },

  clearQueue: () => {
    const { isProcessing, currentJobId } = get();
    if (isProcessing && currentJobId) {
      // Keep the currently processing item
      set(state => ({
        queue: state.queue.filter(item =>
          item.id === currentJobId || item.status === 'processing'
        ),
        progress: new Map(Array.from(state.progress.entries()).filter(
          ([id]) => id === currentJobId ||
          state.queue.find(q => q.id === id)?.status === 'processing'
        )),
        fileOverrides: new Map(Array.from(state.fileOverrides.entries()).filter(
          ([id]) => id === currentJobId ||
          state.queue.find(q => q.id === id)?.status === 'processing'
        )),
      }));
    } else {
      set({
        queue: [],
        progress: new Map(),
        fileOverrides: new Map(),
      });
    }
  },

  moveInQueue: (id: string, direction: 'up' | 'down') => {
    set(state => {
      const index = state.queue.findIndex(item => item.id === id);
      if (index === -1) return state;

      const newQueue = [...state.queue];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= newQueue.length) return state;

      // Don't move if target is currently processing
      if (newQueue[targetIndex].status === 'processing') return state;

      // Swap items
      [newQueue[index], newQueue[targetIndex]] = [newQueue[targetIndex], newQueue[index]];

      return { queue: newQueue };
    });
  },

  // Settings Actions
  updateGlobalSettings: (settings: Partial<ConversionSettings>) => {
    set(state => ({
      globalSettings: { ...state.globalSettings, ...settings },
    }));
  },

  updateFileSettings: (fileId: string, settings: Partial<ConversionSettings>) => {
    set(state => {
      const newOverrides = new Map(state.fileOverrides);
      const currentSettings = newOverrides.get(fileId) || {};
      newOverrides.set(fileId, { ...currentSettings, ...settings });
      return { fileOverrides: newOverrides };
    });
  },

  removeFileSettings: (fileId: string) => {
    set(state => {
      const newOverrides = new Map(state.fileOverrides);
      newOverrides.delete(fileId);
      return { fileOverrides: newOverrides };
    });
  },

  // Processing Control Actions
  startProcessing: () => {
    const { queue } = get();
    // Only start if we have pending items
    const hasPending = queue.some(item => item.status === 'pending');
    if (!hasPending) return;

    set({ isProcessing: true, isPaused: false });
  },

  pauseProcessing: () => {
    set({ isPaused: true });
  },

  resumeProcessing: () => {
    set({ isPaused: false });
  },

  cancelCurrent: () => {
    const { currentJobId } = get();
    if (!currentJobId) return;

    set(state => {
      const newQueue = state.queue.map(item =>
        item.id === currentJobId
          ? { ...item, status: 'cancelled' as FileStatus }
          : item
      );

      // Check if there are more pending items
      const hasPending = newQueue.some(item => item.status === 'pending');

      return {
        queue: newQueue,
        currentJobId: null,
        // Stop processing if no more pending items
        isProcessing: hasPending ? state.isProcessing : false,
      };
    });
  },

  retryFile: (id: string) => {
    set(state => {
      const newQueue = state.queue.map(item =>
        item.id === id
          ? {
              ...item,
              status: 'pending' as FileStatus,
              error: undefined,
              startedAt: undefined,
              completedAt: undefined,
            }
          : item
      );
      return { queue: newQueue };
    });
  },

  // Status Update Actions
  updateFileStatus: (id: string, status: FileStatus, error?: string) => {
    set(state => {
      const newQueue = state.queue.map(item => {
        if (item.id !== id) return item;

        const updates: Partial<QueueItem> = { status };

        if (status === 'processing') {
          updates.startedAt = new Date();
        } else if (status === 'completed' || status === 'failed' || status === 'cancelled') {
          updates.completedAt = new Date();
        }

        if (error) {
          updates.error = error;
        }

        return { ...item, ...updates };
      });

      // If a file failed or was cancelled and it was the current job, clear current job
      if ((status === 'failed' || status === 'cancelled') && state.currentJobId === id) {
        const hasPending = newQueue.some(item => item.status === 'pending');
        const hasProcessing = newQueue.some(item => item.status === 'processing');

        return {
          queue: newQueue,
          currentJobId: hasProcessing ? state.currentJobId : null,
          isProcessing: hasProcessing || (hasPending && state.isProcessing),
        };
      }

      return { queue: newQueue };
    });
  },

  updateProgress: (id: string, progressInfo: ProgressInfo) => {
    set(state => {
      const newProgress = new Map(state.progress);
      newProgress.set(id, progressInfo);
      return { progress: newProgress };
    });
  },

  setCurrentJob: (jobId: string | null) => {
    set({ currentJobId: jobId });
  },

  completeFile: (id: string, blob: Blob, outputSize: number) => {
    const { queue, globalSettings } = get();
    const queueItem = queue.find(item => item.id === id);

    if (!queueItem) return;

    const originalSize = queueItem.file.size;
    const compressionRatio = ((originalSize - outputSize) / originalSize) * 100;
    const processingTime = queueItem.startedAt
      ? (new Date().getTime() - queueItem.startedAt.getTime()) / 1000
      : 0;

    const completedFile: CompletedFile = {
      id,
      originalName: queueItem.file.name,
      outputName: queueItem.file.name.replace(/\.[^/.]+$/, '') + '_converted.mp4',
      outputSize,
      originalSize,
      compressionRatio,
      blob,
      completedAt: new Date(),
      processingTime,
    };

    set(state => {
      const newQueue = state.queue.map(item =>
        item.id === id
          ? {
              ...item,
              status: 'completed' as FileStatus,
              outputBlob: blob,
              outputSize,
              compressionRatio,
              completedAt: new Date(),
            }
          : item
      );

      return {
        queue: newQueue,
        completedFiles: [...state.completedFiles, completedFile],
      };
    });

    // Auto-download if enabled
    if (globalSettings.autoDownload) {
      get().downloadFile(id);
    }
  },

  // Output Management Actions
  downloadFile: (id: string) => {
    const { completedFiles, globalSettings } = get();
    const file = completedFiles.find(f => f.id === id);

    if (!file) return;

    // Create download link
    const url = URL.createObjectURL(file.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.outputName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Remove from queue if setting is enabled
    if (globalSettings.removeAfterDownload) {
      get().removeFromQueue(id);
      get().removeCompleted(id);
    }
  },

  downloadAll: () => {
    const { completedFiles } = get();
    completedFiles.forEach(file => {
      get().downloadFile(file.id);
    });
  },

  clearCompleted: () => {
    set(state => {
      // Remove completed items from queue and completed files list
      const newQueue = state.queue.filter(item => item.status !== 'completed');
      return {
        queue: newQueue,
        completedFiles: [],
      };
    });
  },

  removeCompleted: (id: string) => {
    set(state => ({
      completedFiles: state.completedFiles.filter(file => file.id !== id),
    }));
  },
}));