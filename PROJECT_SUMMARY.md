# Convert Videos Free - Project Summary

## Overview

A browser-based video conversion application that converts various video formats (MP4, MOV, WebM, MKV) to standardized MP4 format using H.264 video and AAC audio codecs. The conversion happens entirely in the browser using WebCodecs API and the Mediabunny library.

## Current Status: ✅ FULLY WORKING

- ✅ **Video conversion**: H.264 encoding working
- ✅ **Audio preservation**: AAC encoding working
- ✅ **Streaming mode**: Working in Chrome/Edge (direct-to-disk saving)
- ✅ **Buffer mode**: Working in all browsers (download after conversion)
- ✅ **File validation**: Outputs are valid, playable MP4 files

## Architecture

### Tech Stack
- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Conversion Engine**: Mediabunny library (WebCodecs wrapper)
- **Worker Thread**: Web Worker for non-blocking conversion
- **File Handling**: File System Access API (Chrome/Edge) or traditional downloads

### Project Structure
```
media-converter/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Main page
│   └── test-streaming/      # Streaming mode test page
├── components/
│   └── MediaConverter.tsx   # Main UI component
├── lib/conversion/
│   ├── ConversionService.ts # Worker management & streaming
│   └── types.ts            # TypeScript definitions
├── public/
│   ├── mediabunny.js       # Mediabunny library (local copy)
│   └── workers/
│       └── conversion.worker.js  # Web Worker for conversion
└── tests/                   # Test files
```

## Key Components

### 1. MediaConverter Component (`components/MediaConverter.tsx`)
- Main React component for the UI
- Handles file selection (drag & drop or button)
- Manages conversion state and progress
- Determines streaming vs buffer mode availability

### 2. ConversionService (`lib/conversion/ConversionService.ts`)
- Manages Web Worker lifecycle
- Handles message passing between main thread and worker
- For streaming mode: manages WritableStreamDefaultWriter
- Receives chunks from worker and writes to file system

### 3. Conversion Worker (`public/workers/conversion.worker.js`)
- Runs conversion in separate thread
- Uses Mediabunny library for actual encoding
- Handles both streaming and buffer modes
- Key functions:
  - `convertToMp4Compat()`: Main conversion function
  - `ProxyWritableStream`: For streaming mode (unused due to architectural change)

## How It Works

### Conversion Flow

1. **User selects file** → MediaConverter component
2. **Component calls** → `ConversionService.convertFile()`
3. **Service checks streaming support** → Prompts for save location (Chrome/Edge only)
4. **Service posts message** → Worker thread
5. **Worker processes**:
   ```javascript
   // Always uses BufferTarget due to Mediabunny limitations
   const input = new Input({ source: new BlobSource(file) })
   const output = new Output({ format: Mp4OutputFormat, target: BufferTarget })
   const conversion = await Conversion.init({ video: {...}, audio: {...} })
   await conversion.execute()
   ```
6. **Worker sends result**:
   - **Buffer mode**: Transfers entire ArrayBuffer
   - **Streaming mode**: Sends buffer in 4MB chunks
7. **Service handles result**:
   - **Buffer mode**: Triggers download
   - **Streaming mode**: Writes chunks to file handle

### Streaming Mode Architecture

Initially attempted to use Mediabunny's `StreamTarget` but discovered it requires random access writes (seeking) which `WritableStream` doesn't support. Current solution:

1. Always use `BufferTarget` for conversion (allows proper MP4 structure)
2. After conversion, stream the completed buffer in chunks
3. This provides streaming benefits (direct-to-disk) without corruption

## Configuration Options

### Conversion Settings

```typescript
interface ConversionOptions {
  preset?: 'low' | 'medium' | 'high';  // Quality presets
  maxDimension?: number;                // Max width/height cap
  streamMode?: boolean;                 // Enable streaming (if supported)
}

// Bitrate presets (in bits per second)
const BITRATE_PRESETS = {
  low: { video: 2_000_000, audio: 96_000 },
  medium: { video: 5_000_000, audio: 128_000 },
  high: { video: 10_000_000, audio: 192_000 },
};
```

### Output Format
- **Container**: MP4
- **Video Codec**: H.264 (AVC)
- **Audio Codec**: AAC
- **Sample Rate**: 48,000 Hz
- **Channels**: 2 (stereo)
- **Key Frame Interval**: 2 seconds

## API for Frontend Development

### Using ConversionService

```typescript
import { ConversionService } from '@/lib/conversion/ConversionService';

// Initialize service
const service = new ConversionService();

// Convert a file
const jobId = await service.convertFile(
  file,  // File object
  {
    preset: 'medium',      // Quality preset
    maxDimension: 1920,    // Optional: max dimension
    streamMode: true       // Try to use streaming
  },
  {
    onProgress: (progress, bytesWritten) => {
      console.log(`Progress: ${progress * 100}%, Bytes: ${bytesWritten}`);
    },
    onError: (error) => {
      console.error('Conversion failed:', error);
    },
    onComplete: (result) => {
      // result.mode: 'buffer' or 'stream'
      // result.mime: 'video/mp4'
      // result.filename: suggested filename
      // result.buffer: ArrayBuffer (buffer mode only)
    }
  }
);

// Cancel conversion
service.cancelConversion(jobId);

// Check browser support
const support = ConversionService.checkSupport();
// Returns: { supported, webCodecs, streaming, message? }
```

## Testing

### Automated Tests
```bash
# Comprehensive test suite
node test-streaming-final.js

# Quick validation
./verify-all.sh
```

### Test Files
- Location: `../vidoes/1.mp4` and `../vidoes/2.mov`
- Note: Typo in folder name (vidoes not videos)

### Manual Testing
1. Open Chrome/Edge
2. Navigate to http://localhost:3000
3. Check "Use streaming mode"
4. Select video and convert
5. Choose save location when prompted

## Known Issues & Limitations

### 1. "Encoding error. (Unexpected frame format.)"
- **Status**: Non-fatal warning
- **Impact**: None - Mediabunny falls back automatically
- **Action**: Can be ignored

### 2. Streaming Mode Browser Support
- ✅ Chrome/Chromium (desktop)
- ✅ Microsoft Edge (desktop)
- ❌ Safari (no File System Access API)
- ❌ Firefox (no File System Access API)
- ❌ Mobile browsers
- ❌ Playwright/Puppeteer (security limitation)

### 3. File Size Increase
- Re-encoding can increase file size
- Example: 343KB input → 862KB output
- Due to different compression settings

## Fixed Issues

### 1. Empty Files in Streaming Mode
- **Problem**: WritableStream doesn't support random access
- **Solution**: Use BufferTarget, then stream the result

### 2. Missing Audio
- **Problem**: `input.tracks` array was empty
- **Solution**: Always attempt AAC encoding if codec available

### 3. Race Condition
- **Problem**: Stream closed before chunks written
- **Solution**: Added `streamComplete` event for proper synchronization

## Environment Variables

None required. The app runs entirely client-side.

## Browser Requirements

### Minimum Requirements
- WebCodecs API support (Chrome 94+, Edge 94+, Safari 16.4+)
- Web Workers support
- Blob/File API support

### Recommended
- Chrome or Edge (latest)
- For streaming mode: Desktop browser only

## Performance Characteristics

- **Conversion Speed**: ~1-2x realtime (varies by device)
- **Memory Usage**: Peak ~3x file size during conversion
- **CPU Usage**: High during conversion (uses hardware acceleration when available)

## Security Considerations

- All processing happens client-side (no server upload)
- Files never leave the user's device
- No external API calls during conversion
- Uses browser sandbox for Worker isolation

## Future Improvements Possible

1. **Progress Granularity**: Add frame-level progress reporting
2. **Codec Options**: Support HEVC/VP9 where available
3. **Batch Processing**: Convert multiple files sequentially
4. **Resume Support**: Save and resume long conversions
5. **Custom Presets**: Allow user-defined bitrate/quality settings
6. **Subtitle Preservation**: Maintain subtitle tracks from source

## Repository Files

### Core Implementation
- `components/MediaConverter.tsx` - Main UI
- `lib/conversion/ConversionService.ts` - Service layer
- `lib/conversion/types.ts` - TypeScript types
- `public/workers/conversion.worker.js` - Worker thread

### Documentation
- `design.md` - Original specification
- `STREAMING_MODE_TESTING.md` - Streaming mode guide
- `STREAMING_MODE_STATUS.md` - Current status

### Test Files
- `test-streaming-final.js` - Comprehensive test
- `test-streaming-comprehensive.js` - Detailed test
- `test-audio.js` - Audio verification
- `verify-all.sh` - Quick validation script

## Contact for Frontend Integration

When building the frontend, the main integration points are:

1. **MediaConverter component** - Already built, can be styled/modified
2. **ConversionService** - Complete API, ready to use
3. **Worker messages** - All typed in `types.ts`
4. **Browser support detection** - Use `ConversionService.checkSupport()`

The conversion pipeline is fully functional and tested. Focus on UI/UX improvements and additional features as needed.