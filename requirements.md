# Media Converter Web App Requirements

## Product Vision
A simple, privacy-focused web application for converting video files to MP4 format entirely in the browser, with no server uploads or user accounts required.

## Core Principles
- **Privacy First**: All processing happens locally in the browser
- **No Login Required**: Zero user accounts or saved state
- **Testability**: All functionality (except file picker) testable via automation
- **Progressive Enhancement**: Works without streaming mode, enhanced when available

## User Requirements

### 1. File Input & Management

#### 1.1 Single File Mode
- Drag and drop video files onto designated area
- Click to browse and select files
- Support formats: MP4, MOV, WebM, MKV, AVI
- Display selected file name and size
- Show format compatibility indicator

#### 1.2 Batch Mode
- Accept multiple files via drag/drop or multi-select
- Display queue with file names, sizes, and statuses
- Maximum 10 files per batch (memory constraints)
- Total batch size warning at 2GB threshold
- Individual file size limit: 2GB

### 2. Conversion Settings

#### 2.1 Global Settings (Apply to All)
- **Quality Preset**: Low (2Mbps), Medium (5Mbps), High (10Mbps)
- **Resolution Cap**: Original, 1080p, 720p, 480p
- **Output Format**: MP4 only (H.264 + AAC)

#### 2.2 Per-File Settings
- Override global quality for specific files
- Skip option for individual files
- Remove from queue before processing

### 3. Processing & Progress

#### 3.1 Queue Management
- Start/pause queue processing
- Cancel current conversion
- Clear completed files
- Retry failed conversions
- Process files sequentially (not parallel, for memory safety)

#### 3.2 Progress Indicators
- Overall queue progress (X of Y files)
- Current file progress (percentage)
- Time elapsed for current file
- Estimated time remaining (current file only)
- Data processed indicator (MB)

#### 3.3 Status States
- **Pending**: Waiting in queue
- **Processing**: Currently converting
- **Completed**: Ready for download
- **Failed**: Error occurred (with retry option)
- **Cancelled**: User cancelled

### 4. Output & Download

#### 4.1 Download Options
- Individual download button per completed file
- "Download All" for completed files (as separate downloads)
- Auto-download option (checkbox preference)
- Generated filename: `[original_name]_converted.mp4`

#### 4.2 File Information
- Show output file size before download
- Compression ratio indicator (e.g., "Reduced by 23%")
- Format confirmation (MP4, H.264, AAC)

### 5. User Interface

#### 5.1 Layout Sections
- **Input Area**: File selection and queue display
- **Settings Panel**: Conversion options
- **Progress Area**: Current conversion status
- **Output Area**: Completed files list

#### 5.2 Visual Feedback
- Drag hover state for drop zone
- Processing animation for active conversion
- Success/error states with clear messaging
- File type icons for visual recognition

### 6. Error Handling

#### 6.1 User-Friendly Messages
- "Browser not supported" with browser recommendations
- "File too large" with size limit
- "Invalid format" with supported formats list
- "Conversion failed" with retry option
- "Insufficient memory" for large batches

#### 6.2 Recovery Options
- Retry individual failed files
- Skip and continue for batch processing
- Clear error and reset state

### 7. Browser Compatibility

#### 7.1 Required Features
- WebCodecs API support detection
- Graceful degradation message for unsupported browsers
- Browser recommendation: Chrome, Edge, or Safari 16.4+

#### 7.2 Streaming Mode (Not Required for Testing)
- Hide streaming option in automated tests
- Fallback to buffer mode automatically
- No testing requirement for streaming functionality

## Technical Constraints for Testability

### Testing Approach
All features except file selection must be testable via Puppeteer/Playwright by:

1. **Mock File Input**: Inject test files programmatically
2. **API Endpoints for Testing**:
   - `POST /api/test/inject-files` - Inject mock files into queue
   - `GET /api/test/conversion-status` - Query conversion state
   - `POST /api/test/trigger-action` - Trigger UI actions

3. **Data Attributes**: Add `data-testid` to all interactive elements

4. **Testing Hooks**:
   ```javascript
   window.__testMode = {
     injectFiles: (files) => { /* Add files to queue */ },
     getQueueStatus: () => { /* Return queue state */ },
     triggerConversion: () => { /* Start conversion */ },
     getProgress: () => { /* Return progress data */ }
   };
   ```

## Non-Functional Requirements

### Performance
- Conversion speed: Minimum 0.5x realtime
- Memory usage: Peak 3x largest file size
- UI responsiveness: < 100ms for user actions
- Progress updates: Every 500ms during conversion

### Accessibility
- Keyboard navigation for all controls
- Screen reader friendly labels
- WCAG 2.1 AA compliance
- High contrast mode support

### Security
- Content Security Policy headers
- No external resource loading during conversion
- Input validation for file types
- Memory limit enforcement

## Out of Scope
- User accounts or authentication
- Cloud storage integration
- Conversion history/saved settings
- Video editing features (trim, crop, etc.)
- Subtitle/audio track selection
- Custom codec parameters
- Server-side processing
- Mobile app versions

## Success Metrics (Testable)
- Successful conversion rate > 95% for supported formats
- Queue completion rate > 90% for batches
- Memory usage stays within limits for 10-file batches
- All UI actions respond within 100ms
- Error recovery success rate > 80%

## MVP Feature Set (Phase 1)
1. Single file conversion with quality presets
2. Batch queue with sequential processing
3. Progress tracking and status display
4. Download management
5. Error handling with retry
6. Browser compatibility detection

## Future Enhancements (Phase 2)
- Advanced codec settings
- Folder organization for batch downloads
- Conversion time estimates
- Thumbnail previews
- Format detection display