# Media Converter Architecture Document

## System Overview

The Media Converter is a client-heavy web application built with Next.js 14+ (App Router) and React 18+. All video processing happens in the browser using WebCodecs API via Web Workers, with no server-side processing required.

## Architecture Principles

1. **Client-First Processing**: All conversion happens in the browser
2. **Progressive Enhancement**: Core functionality works everywhere, enhanced features when available
3. **Testability**: All features accessible via programmatic testing hooks
4. **Memory Safety**: Sequential processing with strict memory management
5. **Type Safety**: Full TypeScript coverage with strict mode

## What We're Building vs. What Exists

### Already Built & Working ✅
- `ConversionService.ts` - Worker management, streaming, message passing
- `conversion.worker.js` - WebCodecs conversion using Mediabunny
- `mediabunny.js` - Core conversion library
- Basic `MediaConverter.tsx` component (needs UI improvements)
- All conversion logic (H.264, AAC, quality presets)
- Streaming mode support for Chrome/Edge
- Buffer mode for all browsers

### What We're Adding 🔨
- **Queue Management**: Batch processing with ConversionQueueManager
- **Better UI/UX**: Professional interface with clear status indicators
- **State Management**: Zustand store for predictable updates
- **Testing Hooks**: Full automation support via window.__testMode
- **Error Recovery**: Retry logic and better error messages
- **Download Management**: Bulk downloads and auto-download options
- **Settings System**: Global and per-file conversion settings

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Client                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Next.js Application                  │  │
│  ├──────────────────────────────────────────────────┤  │
│  │                                                   │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────┐│  │
│  │  │   UI Layer  │  │State Manager│  │  Testing ││  │
│  │  │   (React)   │←→│   (Zustand) │←→│   Hooks  ││  │
│  │  └─────────────┘  └─────────────┘  └──────────┘│  │
│  │         ↕                ↕                       │  │
│  │  ┌─────────────────────────────────────────┐   │  │
│  │  │         Conversion Service Layer         │   │  │
│  │  │    (ConversionQueueManager)             │   │  │
│  │  └─────────────────────────────────────────┘   │  │
│  │                      ↕                          │  │
│  │  ┌─────────────────────────────────────────┐   │  │
│  │  │          Web Worker Pool                 │   │  │
│  │  │   (conversion.worker.js instances)       │   │  │
│  │  └─────────────────────────────────────────┘   │  │
│  │                      ↕                          │  │
│  │  ┌─────────────────────────────────────────┐   │  │
│  │  │         MediaBunny Library               │   │  │
│  │  │      (WebCodecs Implementation)          │   │  │
│  │  └─────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Component Architecture

### Directory Structure
```
media-converter/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Main converter page
│   ├── api/
│   │   └── test/              # Testing endpoints (dev only)
│   │       ├── inject-files/
│   │       ├── status/
│   │       └── trigger/
│   └── globals.css
├── components/
│   ├── converter/
│   │   ├── ConverterContainer.tsx    # Main container
│   │   ├── FileDropZone.tsx         # Drag & drop area
│   │   ├── FileQueue.tsx            # Queue display
│   │   ├── QueueItem.tsx           # Individual queue item
│   │   ├── SettingsPanel.tsx       # Conversion settings
│   │   ├── ProgressDisplay.tsx     # Progress indicators
│   │   └── OutputList.tsx          # Completed files
│   ├── ui/                         # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Progress.tsx
│   │   ├── Select.tsx
│   │   └── Toast.tsx
│   └── providers/
│       └── TestModeProvider.tsx    # Testing hooks provider
├── lib/
│   ├── conversion/
│   │   ├── ConversionQueueManager.ts  # Queue orchestration
│   │   ├── ConversionService.ts       # Worker management
│   │   ├── types.ts                   # TypeScript definitions
│   │   └── utils.ts                   # Helper functions
│   ├── store/
│   │   ├── useConverterStore.ts       # Zustand store
│   │   └── types.ts
│   └── testing/
│       ├── TestHooks.ts              # Testing interface
│       └── MockFileGenerator.ts      # Test file creation
├── public/
│   └── workers/
│       └── conversion.worker.js      # Web Worker
└── tests/
    ├── e2e/                          # Playwright tests
    ├── integration/                  # API integration tests
    └── fixtures/                     # Test data
```

## State Management

### Zustand Store Structure
```typescript
interface ConverterStore {
  // Queue State
  queue: QueueItem[];
  currentJobId: string | null;
  isProcessing: boolean;

  // Settings State
  globalSettings: ConversionSettings;
  fileOverrides: Map<string, Partial<ConversionSettings>>;

  // Progress State
  progress: Map<string, ProgressInfo>;

  // Output State
  completedFiles: CompletedFile[];

  // Actions
  addFiles: (files: File[]) => void;
  removeFromQueue: (id: string) => void;
  updateSettings: (settings: Partial<ConversionSettings>) => void;
  updateFileSettings: (fileId: string, settings: Partial<ConversionSettings>) => void;
  startProcessing: () => void;
  pauseProcessing: () => void;
  cancelCurrent: () => void;
  retryFile: (id: string) => void;
  clearCompleted: () => void;
  downloadFile: (id: string) => void;
  downloadAll: () => void;
}
```

### State Flow
```
User Action → UI Component → Store Action → Queue Manager → Worker → Store Update → UI Update
```

## Data Models

### Core Types
```typescript
interface QueueItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  error?: string;
  outputBlob?: Blob;
  outputSize?: number;
  compressionRatio?: number;
  addedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  settings?: Partial<ConversionSettings>;
}

interface ConversionSettings {
  quality: 'low' | 'medium' | 'high';
  resolution: 'original' | '1080p' | '720p' | '480p';
  autoDownload: boolean;
}

interface ProgressInfo {
  percent: number;
  bytesProcessed: number;
  timeElapsed: number;
  estimatedTimeRemaining?: number;
}

interface CompletedFile {
  id: string;
  originalName: string;
  outputName: string;
  outputSize: number;
  compressionRatio: number;
  blob: Blob;
  completedAt: Date;
}
```

## Service Layer Architecture

### Integration with Existing Conversion Code

**IMPORTANT**: We're leveraging the existing, fully tested conversion pipeline:
- `lib/conversion/ConversionService.ts` - Existing worker management & streaming (KEEP AS-IS)
- `public/workers/conversion.worker.js` - Existing conversion logic with Mediabunny (KEEP AS-IS)
- `public/mediabunny.js` - Existing WebCodecs library (KEEP AS-IS)

The new `ConversionQueueManager` is a thin orchestration layer on top:

### ConversionQueueManager
Central orchestrator for queue processing:

```typescript
class ConversionQueueManager {
  private queue: QueueItem[] = [];
  private currentJob: ConversionJob | null = null;
  private conversionService: ConversionService; // EXISTING SERVICE
  private isPaused: boolean = false;

  constructor() {
    // Use the existing ConversionService
    this.conversionService = new ConversionService();
  }

  async processQueue(): void {
    while (this.queue.length > 0 && !this.isPaused) {
      const item = this.queue.shift();
      await this.processItem(item);
    }
  }

  private async processItem(item: QueueItem): Promise<void> {
    // Update status in store
    // Apply settings (map to existing options format)
    // Call EXISTING conversionService.convertFile()
    // Handle progress updates from existing callbacks
    // Update store on completion/failure
  }
}
```

### Existing Worker Management
The existing `ConversionService` already handles all worker management:
```typescript
// This already exists and works perfectly - NO CHANGES NEEDED
class ConversionService {
  async convertFile(
    file: File,
    options: ConversionOptions,
    callbacks: ConversionCallbacks
  ): Promise<string> {
    // Already handles:
    // - Worker creation and lifecycle
    // - Message passing
    // - Streaming mode detection
    // - Progress callbacks
    // - Error handling
    // - Memory management
  }
}
```

We're just adding queue orchestration on top of this existing, tested service.

## Testing Architecture

### Testing Hooks System
```typescript
// Injected in development/test builds only
interface TestHooks {
  injectFiles: (files: MockFile[]) => void;
  getQueueStatus: () => QueueStatus;
  triggerConversion: () => void;
  triggerAction: (action: string, params?: any) => void;
  getProgress: () => ProgressInfo;
  simulateError: (type: ErrorType) => void;
  clearAll: () => void;
}

// Available at window.__testMode
declare global {
  interface Window {
    __testMode?: TestHooks;
  }
}
```

### Test API Routes (Development Only)
```typescript
// app/api/test/inject-files/route.ts
export async function POST(request: Request) {
  const files = await request.json();
  window.__testMode?.injectFiles(files);
  return Response.json({ success: true });
}

// app/api/test/status/route.ts
export async function GET() {
  const status = window.__testMode?.getQueueStatus();
  return Response.json(status);
}
```

### Playwright Test Structure
```typescript
test('batch conversion workflow', async ({ page }) => {
  // Inject test files
  await page.evaluate(() => {
    window.__testMode.injectFiles([
      { name: 'test1.mov', size: 1048576, type: 'video/quicktime' },
      { name: 'test2.mp4', size: 2097152, type: 'video/mp4' }
    ]);
  });

  // Trigger conversion
  await page.click('[data-testid="start-conversion"]');

  // Monitor progress
  await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible();

  // Verify completion
  await page.waitForSelector('[data-testid="download-all"]');
});
```

## Performance Optimizations

### Memory Management
1. **Sequential Processing**: One file at a time to prevent memory overflow
2. **Streaming Disposal**: Release blobs after download
3. **Worker Reuse**: Single worker instance, reused for all conversions
4. **Lazy Loading**: Load MediaBunny only when conversion starts

### UI Performance
1. **Virtual Scrolling**: For large file queues (>50 items)
2. **Debounced Updates**: Progress updates throttled to 500ms
3. **React.memo**: Prevent unnecessary re-renders
4. **Suspense Boundaries**: Lazy load heavy components

### Bundle Optimization
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  webpack: (config) => {
    // Don't bundle MediaBunny into main chunk
    config.externals = {
      ...config.externals,
      'mediabunny': 'mediabunny'
    };
    return config;
  }
};
```

## Security Architecture

### Content Security Policy
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval'; worker-src 'self' blob:;"
  );
  return response;
}
```

### Input Validation
```typescript
class FileValidator {
  static readonly MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
  static readonly ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska'];
  static readonly MAX_BATCH_SIZE = 10;

  static validate(file: File): ValidationResult {
    // Check file size
    // Verify MIME type
    // Check file extension
    // Return validation result
  }
}
```

## Error Handling Strategy

### Error Boundaries
```typescript
class ConversionErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to monitoring service
    // Show user-friendly error
    // Offer recovery options
  }
}
```

### Worker Error Handling
```typescript
worker.onerror = (error) => {
  // Categorize error type
  // Update store with error state
  // Trigger retry logic if appropriate
  // Show notification to user
};
```

## Monitoring & Analytics

### Performance Metrics (Privacy-Preserving)
```typescript
interface AnonymousMetrics {
  conversionSuccess: boolean;
  inputFormat: string;
  outputQuality: string;
  processingTime: number;
  browserType: string;
  errorType?: string;
}

// Only collect aggregate, anonymous data
// No file content or personal info
```

## Deployment Architecture

### Build Configuration
```yaml
# .github/workflows/deploy.yml
build:
  - npm run build
  - npm run test:e2e
  - Generate static assets
  - Optimize images
  - Create source maps
```

### Environment Configuration
```typescript
// config/environment.ts
export const config = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  enableTestMode: process.env.NEXT_PUBLIC_ENABLE_TEST_MODE === 'true',
  maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '2147483648'),
  maxBatchSize: parseInt(process.env.NEXT_PUBLIC_MAX_BATCH_SIZE || '10'),
};
```

## API Versioning Strategy

Since this is a client-side application with no backend API, versioning focuses on:

1. **Worker API Versioning**: Message protocol between main thread and worker
2. **Storage API Versioning**: For any future local storage needs
3. **Test Hook Versioning**: Maintaining backward compatibility for tests

## Browser Compatibility Strategy

### Feature Detection
```typescript
class BrowserCapabilities {
  static check(): CapabilityReport {
    return {
      webCodecs: 'VideoEncoder' in window,
      fileSystemAPI: 'showSaveFilePicker' in window,
      webWorkers: 'Worker' in window,
      dragDrop: 'ondrop' in document.body,
    };
  }
}
```

### Progressive Enhancement Levels
1. **Basic**: File conversion with manual download
2. **Enhanced**: Streaming mode for Chrome/Edge
3. **Optimal**: All features including advanced settings

## Future Scalability Considerations

### Potential Enhancements
1. **SharedArrayBuffer**: For better worker communication (requires COOP/COEP)
2. **WebAssembly**: For performance-critical paths
3. **IndexedDB**: For temporary storage of large files
4. **Service Worker**: For offline capability and caching

### Architecture Extension Points
1. **Plugin System**: For custom codecs or formats
2. **Theme System**: For white-label deployments
3. **Preset System**: For saved conversion profiles
4. **Analytics System**: For usage insights (privacy-preserving)

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test:unit
npm run test:e2e

# Build for production
npm run build
```

### Code Quality Tools
- **ESLint**: Code linting with Next.js rules
- **Prettier**: Code formatting
- **TypeScript**: Strict mode with no-any rule
- **Husky**: Pre-commit hooks for quality checks

## Conclusion

This architecture provides a robust, testable, and scalable foundation for the media converter web application. It prioritizes client-side processing, user privacy, and comprehensive testability while maintaining flexibility for future enhancements.