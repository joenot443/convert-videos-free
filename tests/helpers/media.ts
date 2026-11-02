import { execFileSync } from 'child_process';
import path from 'path';
import { Page } from '@playwright/test';

export const FIXTURES = path.join(__dirname, '..', 'fixtures', 'gen');
export const fixture = (name: string) => path.join(FIXTURES, name);

export interface Probe {
  videoCodec?: string;
  audioCodec?: string;
  width: number;
  height: number;
  /** Size as displayed, after applying any rotation metadata. */
  displayWidth: number;
  displayHeight: number;
  duration: number;
  sampleRate?: number;
  channels?: number;
}

export function probe(file: string): Probe {
  const raw = execFileSync('ffprobe', [
    '-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', file,
  ]).toString();
  const info = JSON.parse(raw);
  const video = info.streams.find((s: { codec_type: string }) => s.codec_type === 'video');
  const audio = info.streams.find((s: { codec_type: string }) => s.codec_type === 'audio');
  const rotation = Math.abs(
    video?.side_data_list?.find((d: { rotation?: number }) => d.rotation !== undefined)?.rotation ?? 0
  );
  const swapped = rotation === 90 || rotation === 270;
  return {
    videoCodec: video?.codec_name,
    audioCodec: audio?.codec_name,
    width: video?.width,
    height: video?.height,
    displayWidth: swapped ? video?.height : video?.width,
    displayHeight: swapped ? video?.width : video?.height,
    duration: parseFloat(info.format.duration),
    sampleRate: audio ? parseInt(audio.sample_rate, 10) : undefined,
    channels: audio?.channels,
  };
}

/** Fully decodes the file; throws if ffmpeg reports any decode error. */
export function assertDecodesCleanly(file: string) {
  const out = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 'null', '-'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  }).toString();
  if (out.trim()) throw new Error(`Decode errors: ${out}`);
}

/** Average RGB of the middle frame. */
export function averageColor(file: string, atSeconds = 0.5): [number, number, number] {
  const buf = execFileSync('ffmpeg', [
    '-v', 'error', '-ss', String(atSeconds), '-i', file, '-frames:v', '1',
    '-vf', 'scale=1:1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-',
  ]);
  return [buf[0], buf[1], buf[2]];
}

/** Silence third-party network calls so tests are hermetic and fast. */
export async function blockThirdParty(page: Page) {
  await page.route(/googletagmanager|googlesyndication|google-analytics|doubleclick/, (r) => r.abort());
}
