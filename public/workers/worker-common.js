// Helpers shared by conversion.worker.js and crop-conversion.worker.js.

self.BITRATE_PRESETS = {
  low: { video: 2_000_000, audio: 96_000 },
  medium: { video: 5_000_000, audio: 128_000 },
  high: { video: 10_000_000, audio: 192_000 },
};

// H.264 needs even dimensions.
function toEven(n) {
  return Math.max(2, Math.round(n / 2) * 2);
}

// Scales width × height down to fit inside a long edge × short edge box, in
// either orientation, and never upscales. Returns null if it already fits.
self.fitWithin = function fitWithin(width, height, maxLongEdge, maxShortEdge) {
  if (!maxLongEdge || !maxShortEdge) return null;
  const long = Math.max(width, height);
  const short = Math.min(width, height);
  const scale = Math.min(1, maxLongEdge / long, maxShortEdge / short);
  if (scale >= 1) return null;
  return { width: toEven(width * scale), height: toEven(height * scale) };
};

// AAC encoding is unavailable on some platforms (older Safari, some Linux).
self.getAacCodec = async function getAacCodec(mediabunny) {
  if (!('AudioEncoder' in self)) return null;
  try {
    return await mediabunny.getFirstEncodableAudioCodec(['aac']);
  } catch (error) {
    console.warn('Could not check AAC support:', error);
    return null;
  }
};

self.AUDIO_DROPPED_WARNING = 'audioDropped';

self.friendlyError = function friendlyError(error) {
  const message = (error && error.message) || String(error) || 'Conversion failed';
  if (/unsupported or unrecognizable format/i.test(message)) {
    return 'This file could not be read. It may be damaged or use an unsupported format.';
  }
  return message;
};

// Throws a useful message if Mediabunny cannot convert this input.
self.assertConvertible = function assertConvertible(conversion) {
  if (conversion.isValid) return;
  const video = conversion.discardedTracks.find(({ track }) => track.isVideoTrack());
  if (video && video.reason === 'undecodable_source_codec') {
    throw new Error("This video's codec cannot be decoded by your browser.");
  }
  throw new Error('This file has no video track that can be converted.');
};
