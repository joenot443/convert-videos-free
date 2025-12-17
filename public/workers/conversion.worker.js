// Conversion Worker - handles media conversion in a separate thread
// Load mediabunny
importScripts('/mediabunny.js');

// The library is exposed as Mediabunny (capital M)
const mediabunny = typeof Mediabunny !== 'undefined' ? Mediabunny : self.Mediabunny;

if (!mediabunny) {
  throw new Error('Failed to load mediabunny library');
}

const {
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  StreamTarget,
  Input,
  Output,
  Mp4OutputFormat,
  Conversion,
  canEncode,
  getFirstEncodableVideoCodec,
  getFirstEncodableAudioCodec,
} = mediabunny;

// Active conversions map for cancellation support
const activeConversions = new Map();

// Bitrate presets (in bits per second)
const BITRATE_PRESETS = {
  low: { video: 2_000_000, audio: 96_000 },
  medium: { video: 5_000_000, audio: 128_000 },
  high: { video: 10_000_000, audio: 192_000 },
};

// Post message to main thread
function postToMain(message, transfer) {
  if (transfer) {
    self.postMessage(message, transfer);
  } else {
    self.postMessage(message);
  }
}

// Convert preset to bitrate values
function presetToBitrates(preset) {
  return BITRATE_PRESETS[preset] || BITRATE_PRESETS.medium;
}

// Calculate dimension cap options
function dimensionCapOptions(maxDimension) {
  // This will scale down the video if either dimension exceeds maxDimension
  return {
    resize: {
      mode: 'fit',
      maxWidth: maxDimension,
      maxHeight: maxDimension,
    },
  };
}

// Create a proxy WritableStream that sends chunks to main thread
class ProxyWritableStream {
  constructor(jobId) {
    this.jobId = jobId;
    this.bytesWritten = 0;
    this.chunks = []; // Store chunks with positions
    this.expectedPosition = 0;
    const self = this;

    // Create the underlying WritableStream
    this.stream = new WritableStream({
      async write(chunk) {
        let buffer;
        let chunkSize = 0;
        let position = null;

        // Mediabunny sends chunks as {type: 'write', data: Uint8Array, position: number}
        if (chunk && typeof chunk === 'object' && chunk.type === 'write' && chunk.data) {
          console.log(`ProxyWritableStream: Received mediabunny chunk at position ${chunk.position}, data size: ${chunk.data.byteLength}`);

          position = chunk.position;
          const data = chunk.data;
          if (data instanceof Uint8Array || ArrayBuffer.isView(data)) {
            // Copy the data from the typed array
            buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
            chunkSize = data.byteLength;
          } else if (data instanceof ArrayBuffer) {
            buffer = data.slice(0);
            chunkSize = data.byteLength;
          } else {
            console.error('Unexpected data type in chunk:', data);
            return;
          }

          // Check if this chunk should be written at a specific position
          if (position !== null && position !== self.expectedPosition) {
            console.warn(`Warning: Chunk position ${position} doesn't match expected position ${self.expectedPosition}. This may cause corruption.`);
          }
        } else if (chunk instanceof ArrayBuffer) {
          buffer = chunk.slice(0);
          chunkSize = buffer.byteLength;
        } else if (ArrayBuffer.isView(chunk)) {
          // It's a typed array view (Uint8Array, etc)
          const view = chunk;
          buffer = view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);
          chunkSize = view.byteLength;
        } else if (chunk instanceof Blob) {
          // Handle Blob
          console.log('Converting Blob to ArrayBuffer...');
          buffer = await chunk.arrayBuffer();
          chunkSize = buffer.byteLength;
        } else {
          console.error('Unknown chunk format:', chunk);
          return; // Skip this chunk
        }

        console.log(`ProxyWritableStream: Sending chunk of ${chunkSize} bytes at position ${position !== null ? position : self.expectedPosition}`);

        if (chunkSize > 0) {
          postToMain({
            type: 'streamChunk',
            jobId: self.jobId,
            chunk: buffer,
            position: position !== null ? position : self.expectedPosition
          }, [buffer]); // Transfer the copied buffer

          self.expectedPosition = (position !== null ? position : self.expectedPosition) + chunkSize;
          self.bytesWritten += chunkSize;
          console.log(`ProxyWritableStream: Total bytes written: ${self.bytesWritten}, next expected position: ${self.expectedPosition}`);
        } else {
          console.warn('Skipping empty chunk');
        }
      },
      close() {
        // Stream closed successfully
        console.log(`ProxyWritableStream: Stream closed for job ${self.jobId}, final bytes: ${self.bytesWritten}`);

        // Send a final "stream complete" signal to ensure main thread knows to close
        postToMain({
          type: 'streamComplete',
          jobId: self.jobId,
          totalBytes: self.bytesWritten
        });
      },
      abort(reason) {
        console.error('Stream aborted:', reason);
      }
    });
  }

  getStream() {
    return this.stream;
  }

  getBytesWritten() {
    return this.bytesWritten;
  }

  async close() {
    console.log(`ProxyWritableStream closing for job ${this.jobId}, total bytes: ${this.bytesWritten}`);
    // The stream's close handler already sends streamComplete, so we just need to ensure
    // the writer is closed
    const writer = this.stream.getWriter();
    await writer.close();
  }
}

// Main conversion function
async function convertToMp4Compat(req) {
  const jobId = req.jobId;

  try {
    // 1) Feature gate - check WebCodecs availability
    if (!('VideoEncoder' in globalThis) || !('AudioEncoder' in globalThis)) {
      throw new Error('WebCodecs is required for video conversion. Please use a supported browser (Chrome, Edge, or Safari).');
    }

    postToMain({ type: 'ready', jobId });

    // 2) Capability checks
    const canAvc = await canEncode('avc');
    const canAac = await canEncode('aac');

    postToMain({
      type: 'capabilities',
      jobId,
      canEncode: { avc: canAvc, aac: canAac }
    });

    if (!canAvc) {
      throw new Error('H.264 encoding is not available in this browser.');
    }

    // 3) Create Input from the file
    const input = new Input({
      source: new BlobSource(req.file),
      formats: ALL_FORMATS,
    });

    // Wait for input to be ready before proceeding
    await input.ready;

    // 4) Create Output format and target
    const mp4Format = new Mp4OutputFormat({
      // Always use in-memory fastStart since we're using BufferTarget
      fastStart: 'in-memory',
    });

    // Choose target based on mode
    let target;
    let proxyStream = null;
    let bytesWritten = 0;

    // Always use BufferTarget for now - streaming has issues with mediabunny's position-based writes
    // We'll manually stream the buffer after conversion
    target = new BufferTarget();
    const isStreamingMode = req.sink?.mode === 'stream';
    console.log(`Using BufferTarget with streaming mode: ${isStreamingMode}`);

    const output = new Output({ format: mp4Format, target });

    // Track bytes written for progress reporting
    if (target.onwrite) {
      target.onwrite = (start, end) => {
        bytesWritten = Math.max(bytesWritten, end);
      };
    }

    // 5) Determine codecs based on MP4 support and browser capabilities
    const videoCodec = await getFirstEncodableVideoCodec(['avc']);
    if (!videoCodec) {
      throw new Error('No encodable MP4-compatible video codec found.');
    }

    // Check if we can encode AAC audio
    let hasAudio = true; // Assume audio exists and try to encode it
    let audioCodec = null;

    try {
      // Check if we can encode AAC
      if (canAac) {
        audioCodec = await getFirstEncodableAudioCodec(['aac']);
        console.log('Audio codec check:', { canAac, audioCodec });
        hasAudio = true; // Always try to include audio if AAC is available
      } else {
        console.warn('AAC encoding not available, audio will be discarded');
        hasAudio = false;
      }
    } catch (e) {
      console.warn('Error checking audio codec support:', e);
      // Still try to include audio
      hasAudio = canAac;
      audioCodec = canAac ? 'aac' : null;
    }

    // 6) Get bitrate values from preset
    const { video: videoBitrate, audio: audioBitrate } = presetToBitrates(req.output.preset);

    // 7) Create conversion with appropriate options
    const audioOptions = hasAudio && audioCodec
      ? {
          codec: 'aac',
          bitrate: audioBitrate,
          sampleRate: 48000,
          numberOfChannels: 2,
        }
      : { discard: true };

    console.log('Audio configuration:', {
      hasAudio,
      audioCodec,
      canAac,
      audioOptions
    });

    const conversionOptions = {
      input,
      output,
      video: {
        codec: 'avc',
        bitrate: videoBitrate,
        keyFrameInterval: 2,
        allowRotationMetadata: true,
        ...(req.output.maxDimension ? dimensionCapOptions(req.output.maxDimension) : {}),
      },
      audio: audioOptions,
    };

    const conversion = await Conversion.init(conversionOptions);

    // Store conversion for potential cancellation
    activeConversions.set(jobId, conversion);

    // Validate conversion - be more lenient with MOV files
    if (!conversion.isValid) {
      // Check if we at least have a video track that can be converted
      const hasVideoTrack = conversion.videoTrack || (input.tracks && input.tracks.some(t => t.type === 'video'));

      if (hasVideoTrack) {
        // If we have a video track, just warn about discarded tracks and continue
        console.warn('Some tracks were discarded but continuing with video conversion');
        if (conversion.discardedTracks) {
          try {
            const trackInfo = conversion.discardedTracks.map(track => ({
              type: track.type || 'unknown',
              codec: track.codec || 'unknown',
              id: track.id || 'unknown'
            }));
            console.warn('Discarded tracks:', trackInfo);
          } catch (e) {
            console.warn('Could not log discarded tracks:', e);
          }
        }
        // Don't throw error - continue with conversion
      } else {
        // No video track at all - this is a real problem
        let discardedInfo = '';
        try {
          if (conversion.discardedTracks) {
            const trackInfo = conversion.discardedTracks.map(track => ({
              type: track.type || 'unknown',
              codec: track.codec || 'unknown',
              id: track.id || 'unknown'
            }));
            discardedInfo = ` Discarded tracks: ${JSON.stringify(trackInfo)}`;
          }
        } catch (e) {
          console.warn('Could not serialize discarded tracks:', e);
          discardedInfo = ' Some tracks were discarded.';
        }
        throw new Error(`No valid video track found for conversion.${discardedInfo}`);
      }
    }

    // 8) Set up progress tracking
    conversion.onProgress = (progress) => {
      const totalBytes = proxyStream ? proxyStream.getBytesWritten() : bytesWritten;
      postToMain({
        type: 'progress',
        jobId,
        progress01: progress,
        bytesWritten: totalBytes
      });
    };

    // 9) Execute conversion
    await conversion.execute();

    // 10) Clean up and return result
    activeConversions.delete(jobId);

    // Generate filename based on input
    const inputName = req.file.name || 'video';
    const outputName = inputName.replace(/\.[^/.]+$/, '') + '_converted.mp4';

    if (isStreamingMode) {
      // Stream the buffer in chunks for streaming mode
      const buffer = target.buffer;
      const chunkSize = 4 * 1024 * 1024; // 4MB chunks
      let position = 0;

      console.log(`Streaming buffer of size ${buffer.byteLength} in ${Math.ceil(buffer.byteLength / chunkSize)} chunks`);

      while (position < buffer.byteLength) {
        const end = Math.min(position + chunkSize, buffer.byteLength);
        const chunk = buffer.slice(position, end);

        postToMain({
          type: 'streamChunk',
          jobId,
          chunk,
          position
        }, [chunk]);

        position = end;
        console.log(`Sent chunk: ${position}/${buffer.byteLength} bytes (${Math.round(position * 100 / buffer.byteLength)}%)`);
      }

      // Send stream complete signal
      postToMain({
        type: 'streamComplete',
        jobId,
        totalBytes: buffer.byteLength
      });

      // Send done message
      postToMain({
        type: 'done',
        jobId,
        result: {
          mode: 'stream',
          mime: 'video/mp4',
          filename: outputName
        }
      });
    } else {
      // Buffer mode - transfer the entire buffer
      const buffer = target.buffer;
      postToMain(
        {
          type: 'done',
          jobId,
          result: {
            mode: 'buffer',
            buffer,
            mime: 'video/mp4',
            filename: outputName
          }
        },
        [buffer] // Transfer the buffer
      );
    }

  } catch (error) {
    activeConversions.delete(jobId);
    console.error('Conversion error:', error);

    let errorMessage = error.message || error.toString() || 'An unexpected error occurred';

    // Provide user-friendly messages for common errors
    if (errorMessage.includes('unsupported or unrecognizable format')) {
      errorMessage = 'This file format is not supported. Some MOV files with specific codecs cannot be converted. Please try a different file or convert it to a standard format first.';
    } else if (errorMessage.includes('No valid video track')) {
      errorMessage = 'No video track found in this file. The file may be corrupted or use an unsupported codec.';
    }

    postToMain({
      type: 'error',
      jobId,
      message: errorMessage,
      details: error.stack || error.toString()
    });
  }
}

// Handle cancellation
async function cancelConversion(jobId) {
  const conversion = activeConversions.get(jobId);
  if (conversion && conversion.cancel) {
    try {
      await conversion.cancel();
      activeConversions.delete(jobId);
      postToMain({ type: 'canceled', jobId });
    } catch (error) {
      postToMain({
        type: 'error',
        jobId,
        message: 'Failed to cancel conversion',
        details: error.message || error.toString()
      });
    }
  } else {
    postToMain({ type: 'warning', jobId, message: 'No active conversion to cancel' });
  }
}

// Message handler
self.addEventListener('message', async (event) => {
  const request = event.data;

  switch (request.type) {
    case 'convert':
      convertToMp4Compat(request);
      break;

    case 'cancel':
      cancelConversion(request.jobId);
      break;

    default:
      console.warn('Unknown request type:', request.type);
  }
});