// Crop Conversion Worker - handles video conversion with crop and trim support
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
  Input,
  Output,
  Mp4OutputFormat,
  Conversion,
  canEncode,
  getFirstEncodableVideoCodec,
  getFirstEncodableAudioCodec,
} = mediabunny;

// Bitrate presets (in bits per second)
const BITRATE_PRESETS = {
  low: { video: 2_000_000, audio: 96_000 },
  medium: { video: 5_000_000, audio: 128_000 },
  high: { video: 10_000_000, audio: 192_000 },
};

// Active conversions for cancellation support
const activeConversions = new Map();

// Main conversion function with crop and trim support
async function convertWithCrop(req) {
  const jobId = req.jobId;

  try {
    // Check WebCodecs availability
    if (!('VideoEncoder' in globalThis)) {
      throw new Error('WebCodecs not supported. Please use Chrome, Edge, or Safari.');
    }

    self.postMessage({ type: 'ready', jobId });

    // Create Input from the file
    const input = new Input({
      source: new BlobSource(req.file),
      formats: ALL_FORMATS,
    });
    await input.ready;

    // Create Output
    const mp4Format = new Mp4OutputFormat({ fastStart: 'in-memory' });
    const target = new BufferTarget();
    const output = new Output({ format: mp4Format, target });

    // Get codecs
    const videoCodec = await getFirstEncodableVideoCodec(['avc']);
    if (!videoCodec) {
      throw new Error('No video codec available for encoding.');
    }

    const canAac = await canEncode('aac');
    const audioCodec = canAac ? await getFirstEncodableAudioCodec(['aac']) : null;

    // Get bitrates from preset
    const { video: videoBitrate, audio: audioBitrate } = BITRATE_PRESETS[req.output.preset] || BITRATE_PRESETS.medium;

    // Build video options with crop if provided
    const videoOptions = {
      codec: 'avc',
      bitrate: videoBitrate,
      keyFrameInterval: 2,
      allowRotationMetadata: true,
    };

    // Add crop if provided
    if (req.crop) {
      videoOptions.crop = {
        left: req.crop.left,
        top: req.crop.top,
        width: req.crop.width,
        height: req.crop.height,
      };
    }

    // Build audio options
    const audioOptions = audioCodec
      ? { codec: 'aac', bitrate: audioBitrate, sampleRate: 48000, numberOfChannels: 2 }
      : { discard: true };

    // Build conversion options
    const conversionOptions = {
      input,
      output,
      video: videoOptions,
      audio: audioOptions,
    };

    // Add trim if provided
    if (req.trim) {
      conversionOptions.trim = {
        start: req.trim.start,
        end: req.trim.end,
      };
    }

    const conversion = await Conversion.init(conversionOptions);
    activeConversions.set(jobId, conversion);

    // Progress tracking
    conversion.onProgress = (progress) => {
      self.postMessage({ type: 'progress', jobId, progress01: progress });
    };

    // Execute conversion
    await conversion.execute();
    activeConversions.delete(jobId);

    // Get result
    const buffer = target.buffer;
    const inputName = req.file.name || 'video';
    const outputName = inputName.replace(/\.[^/.]+$/, '') + '_cropped.mp4';

    self.postMessage({
      type: 'done',
      jobId,
      result: { buffer, mime: 'video/mp4', filename: outputName }
    }, [buffer]);

  } catch (error) {
    activeConversions.delete(jobId);
    console.error('Crop conversion error:', error);

    self.postMessage({
      type: 'error',
      jobId,
      message: error.message || 'Conversion failed'
    });
  }
}

// Handle cancellation
async function cancelConversion(jobId) {
  const conversion = activeConversions.get(jobId);
  if (conversion && conversion.cancel) {
    await conversion.cancel();
    activeConversions.delete(jobId);
    self.postMessage({ type: 'canceled', jobId });
  }
}

// Message handler
self.addEventListener('message', async (event) => {
  const req = event.data;
  if (req.type === 'convert-crop') {
    convertWithCrop(req);
  } else if (req.type === 'cancel') {
    cancelConversion(req.jobId);
  }
});
