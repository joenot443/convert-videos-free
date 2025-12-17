// Google Analytics helper functions

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
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
  started: (fileName: string, fileSize: number) => {
    trackEvent('conversion_started', 'Conversion', fileName, Math.round(fileSize / 1024 / 1024)); // Size in MB
  },

  completed: (fileName: string, processingTime: number) => {
    trackEvent('conversion_completed', 'Conversion', fileName, Math.round(processingTime));
  },

  failed: (fileName: string, error: string) => {
    trackEvent('conversion_failed', 'Conversion', `${fileName}: ${error}`);
  },

  downloaded: (fileName: string) => {
    trackEvent('file_downloaded', 'Download', fileName);
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
};