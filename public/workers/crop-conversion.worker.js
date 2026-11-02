// Crop and trim worker. Output is always MP4 (H.264 + AAC).
importScripts('/mediabunny.js', '/workers/worker-common.js');

const {
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  Conversion,
  ConversionCanceledError,
  Input,
  Mp4OutputFormat,
  Output,
  getFirstEncodableVideoCodec,
} = Mediabunny;

// jobId -> { conversion, canceled }
const jobs = new Map();

async function convertWithCrop(req) {
  const { jobId } = req;
  const job = { conversion: null, canceled: false };
  jobs.set(jobId, job);

  try {
    if (!('VideoEncoder' in self)) {
      throw new Error('WebCodecs is required. Please use Chrome, Edge, or Safari.');
    }
    if (!(await getFirstEncodableVideoCodec(['avc']))) {
      throw new Error('H.264 encoding is not available in this browser.');
    }

    const input = new Input({ source: new BlobSource(req.file), formats: ALL_FORMATS });
    if (!(await input.getPrimaryVideoTrack())) {
      throw new Error('This file has no video track that can be converted.');
    }
    const hasAudio = !!(await input.getPrimaryAudioTrack());
    const aacCodec = await getAacCodec(Mediabunny);
    const bitrates = BITRATE_PRESETS[req.output.preset] || BITRATE_PRESETS.medium;

    const target = new BufferTarget();
    const conversion = await Conversion.init({
      input,
      output: new Output({ format: new Mp4OutputFormat({ fastStart: 'in-memory' }), target }),
      video: {
        codec: 'avc',
        bitrate: bitrates.video,
        keyFrameInterval: 2,
        ...(req.crop ? { crop: req.crop } : {}),
      },
      audio: aacCodec
        ? { codec: 'aac', bitrate: bitrates.audio, sampleRate: 48000, numberOfChannels: 2 }
        : { discard: true },
      ...(req.trim ? { trim: req.trim } : {}),
      showWarnings: false,
    });

    job.conversion = conversion;
    if (job.canceled) throw new ConversionCanceledError();
    assertConvertible(conversion);

    if (hasAudio && !aacCodec) {
      self.postMessage({ type: 'warning', jobId, code: AUDIO_DROPPED_WARNING });
    }

    conversion.onProgress = (progress) => {
      self.postMessage({ type: 'progress', jobId, progress01: progress });
    };
    await conversion.execute();

    const buffer = target.buffer;
    const baseName = (req.file.name || 'video').replace(/\.[^/.]+$/, '');
    self.postMessage(
      { type: 'done', jobId, result: { buffer, mime: 'video/mp4', filename: `${baseName}_cropped.mp4` } },
      [buffer]
    );
  } catch (error) {
    if (job.canceled || error instanceof ConversionCanceledError) {
      self.postMessage({ type: 'canceled', jobId });
    } else {
      console.error('Crop conversion error:', error);
      self.postMessage({ type: 'error', jobId, message: friendlyError(error) });
    }
  } finally {
    jobs.delete(jobId);
  }
}

async function cancel(jobId) {
  const job = jobs.get(jobId);
  if (!job) return;
  job.canceled = true;
  if (job.conversion) await job.conversion.cancel();
}

self.addEventListener('message', ({ data }) => {
  if (data.type === 'convert-crop') convertWithCrop(data);
  else if (data.type === 'cancel') cancel(data.jobId);
});
