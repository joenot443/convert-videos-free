# Convert Videos Free

A free, privacy-focused browser-based video conversion tool that converts various video formats to MP4 (H.264 + AAC) using WebCodecs and the Mediabunny library. Works entirely in your browser with no uploads or backend required.

## Features

- **In-Browser Conversion**: All processing happens locally in your browser
- **Multiple Input Formats**: Supports MP4, MOV, WebM, MKV
- **Standardized Output**: Converts to universally compatible MP4 (H.264 + AAC)
- **Preserves Metadata**: Maintains orientation/rotation (especially for iPhone videos)
- **Progress Tracking**: Real-time conversion progress display
- **Quality Presets**: Choose between Low, Medium, and High quality
- **Smart Download Handling**:
  - Chrome/Edge: Stream directly to disk (for large files)
  - Safari: In-memory conversion with automatic download

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Modern browser (Chrome, Edge, or Safari recommended)
- WebCodecs support (automatically checked by the app)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:4444](http://localhost:4444) in your browser.

### Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Usage

1. **Select a Video**: Click the upload area or drag and drop a video file
2. **Choose Quality**: Select Low (2 Mbps), Medium (5 Mbps), or High (10 Mbps)
3. **Streaming Option** (Chrome only): Enable to save directly to disk for large files
4. **Convert**: Click "Convert to MP4" to start the conversion
5. **Download**: File will automatically download when complete (or save location chosen if streaming)

## Browser Compatibility

| Browser | WebCodecs | Streaming Save | Notes |
|---------|-----------|----------------|-------|
| Chrome | ✅ | ✅ | Full support, recommended for large files |
| Edge | ✅ | ✅ | Full support, recommended for large files |
| Safari | ✅ | ❌ | Uses in-memory conversion, best for smaller files |
| Firefox | ❌ | ❌ | Not supported (WebCodecs required) |

## Technical Details

### Architecture

- **Main Thread**: React UI for file selection and progress display
- **Web Worker**: Handles conversion processing to avoid blocking UI
- **Mediabunny**: Core conversion library with WebCodecs support

### Conversion Pipeline

1. File is loaded into a Web Worker
2. Mediabunny demuxes the input container
3. Video/audio streams are decoded using WebCodecs
4. Streams are re-encoded to H.264/AAC
5. Output is muxed into MP4 container
6. File is either:
   - Streamed to disk (Chrome/Edge with File System Access API)
   - Buffered and downloaded (Safari/fallback)

### Output Specifications

- **Container**: MP4 (ISOBMFF)
- **Video Codec**: H.264/AVC
- **Audio Codec**: AAC
- **Video Bitrates**:
  - Low: ~2 Mbps
  - Medium: ~5 Mbps
  - High: ~10 Mbps
- **Audio Bitrates**:
  - Low: 96 kbps
  - Medium: 128 kbps
  - High: 192 kbps
- **Audio Settings**: 48kHz, Stereo

## Limitations

- Requires WebCodecs support (modern browsers only)
- Safari limited to in-memory conversion (may struggle with very large files)
- No support for subtitles or multiple audio tracks (first track only)
- DRM-protected content cannot be converted
- **Some MOV files may not be supported**: The MediaBunny library has limited support for certain MOV codecs (particularly ProRes and some Apple-specific formats). If you encounter issues with MOV files, try converting them to a standard H.264 MP4 first using other tools

## Development

### Project Structure

```
media-converter/
├── app/                    # Next.js app directory
│   └── page.tsx           # Main page component
├── components/            # React components
│   └── MediaConverter.tsx # Main converter UI component
├── lib/                   # Core libraries
│   └── conversion/        # Conversion service and types
│       ├── ConversionService.ts
│       └── types.ts
├── public/                # Static assets
│   └── workers/          # Web Workers
│       └── conversion.worker.js
└── package.json          # Dependencies
```

### Key Dependencies

- **Next.js**: React framework
- **Mediabunny**: Media conversion library with WebCodecs support
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling

## License

This project is built as a demonstration of browser-based media conversion capabilities.