// Google Analytics helper functions.
//
// The site promises that files stay on the user's device, so nothing here may
// ever receive a file name or anything derived from one.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track conversion events
export const trackConversion = {
  started: (fileSize: number) => {
    trackEvent('conversion_started', 'Conversion', undefined, Math.round(fileSize / 1024 / 1024)); // Size in MB
  },

  completed: (processingTime: number) => {
    trackEvent('conversion_completed', 'Conversion', undefined, Math.round(processingTime));
  },

  failed: (error: string) => {
    trackEvent('conversion_failed', 'Conversion', error);
  },

  downloaded: () => {
    trackEvent('file_downloaded', 'Download');
  },
};

// Track UI interactions
export const trackUI = {
  settingsChanged: (setting: string, value: string) => {
    trackEvent('settings_changed', 'UI', `${setting}: ${value}`);
  },

  qualitySelected: (quality: string) => {
    trackEvent('quality_selected', 'Settings', quality);
  },

  resolutionSelected: (resolution: string) => {
    trackEvent('resolution_selected', 'Settings', resolution);
  },

  filesAdded: (count: number, totalSizeMB: number) => {
    trackEvent('files_added', 'UI', `${count} files`, totalSizeMB);
  },

  fileRemoved: () => {
    trackEvent('file_removed', 'UI');
  },

  queueCleared: () => {
    trackEvent('queue_cleared', 'UI');
  },

  processingStarted: () => {
    trackEvent('processing_started', 'UI');
  },

  processingPaused: () => {
    trackEvent('processing_paused', 'UI');
  },

  processingResumed: () => {
    trackEvent('processing_resumed', 'UI');
  },
};

// Track crop feature events
export const trackCrop = {
  // Video loaded into crop editor
  videoLoaded: (fileSize: number) => {
    trackEvent('crop_video_loaded', 'Crop', undefined, Math.round(fileSize / 1024 / 1024));
  },

  // Aspect ratio changed
  aspectRatioChanged: (ratio: string) => {
    trackEvent('crop_aspect_ratio_changed', 'Crop', ratio);
  },

  // Crop region adjusted (debounced - only track significant changes)
  cropAdjusted: (cropPercent: number) => {
    trackEvent('crop_region_adjusted', 'Crop', `${cropPercent}% of original`, cropPercent);
  },

  // Trim adjusted
  trimAdjusted: (trimmedDuration: number, originalDuration: number) => {
    const trimPercent = Math.round((trimmedDuration / originalDuration) * 100);
    trackEvent('crop_trim_adjusted', 'Crop', `${trimPercent}% of original`, trimPercent);
  },

  // Export started
  exportStarted: (hasCrop: boolean, hasTrim: boolean) => {
    const operations = [hasCrop ? 'crop' : null, hasTrim ? 'trim' : null].filter(Boolean).join('+') || 'none';
    trackEvent('crop_export_started', 'Crop', operations);
  },

  // Export completed
  exportCompleted: (processingTime: number) => {
    trackEvent('crop_export_completed', 'Crop', undefined, Math.round(processingTime));
  },

  // Export failed
  exportFailed: (error: string) => {
    trackEvent('crop_export_failed', 'Crop', error);
  },

  // Video downloaded
  downloaded: () => {
    trackEvent('crop_file_downloaded', 'Crop');
  },

  // Editor cleared (new video)
  editorCleared: () => {
    trackEvent('crop_editor_cleared', 'Crop');
  },
};