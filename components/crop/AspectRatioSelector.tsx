'use client';

import { useCropStore } from '@/lib/crop/useCropStore';
import { AspectRatioPreset } from '@/lib/crop/types';
import { clsx } from 'clsx';

const ASPECT_RATIOS: { value: AspectRatioPreset; label: string; description?: string }[] = [
  { value: 'free', label: 'Free', description: 'No constraint' },
  { value: '16:9', label: '16:9', description: 'Widescreen' },
  { value: '9:16', label: '9:16', description: 'Vertical' },
  { value: '4:3', label: '4:3', description: 'Classic' },
  { value: '1:1', label: '1:1', description: 'Square' },
];

export function AspectRatioSelector() {
  const { aspectRatio, setAspectRatio } = useCropStore();

  // Check if current aspect ratio matches a preset
  const currentPreset = typeof aspectRatio === 'string' ? aspectRatio : null;

  return (
    <div className="flex flex-wrap gap-2">
      {ASPECT_RATIOS.map((ratio) => (
        <button
          key={ratio.value}
          data-testid={`aspect-${ratio.value.replace(':', '-')}`}
          onClick={() => setAspectRatio(ratio.value)}
          className={clsx(
            'px-3 py-1.5 text-sm rounded-lg transition-all duration-200',
            currentPreset === ratio.value
              ? 'bg-blue-500 text-white font-medium'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          )}
          title={ratio.description}
        >
          {ratio.label}
        </button>
      ))}
    </div>
  );
}
