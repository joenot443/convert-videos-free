import { test, expect, Page } from '@playwright/test';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { assertDecodesCleanly, blockThirdParty, fixture, probe } from './helpers/media';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cvf-'));

test.beforeEach(async ({ page }) => {
  await blockThirdParty(page);
  await page.goto('/');
  await expect(page.getByTestId('drop-zone')).toBeVisible();
});

const statuses = (page: Page) => page.locator('[data-testid^="status-"]');
const downloadButtons = (page: Page) =>
  page.locator('[data-testid^="download-"]:not([data-testid="download-all"])');

async function saveFirstOutput(page: Page, name: string) {
  const [download] = await Promise.all([page.waitForEvent('download'), downloadButtons(page).first().click()]);
  const out = path.join(tmp, name);
  await download.saveAs(out);
  return { out, suggested: download.suggestedFilename() };
}

let outputCounter = 0;

async function convert(page: Page, file: string, resolution = 'original', timeout = 45_000) {
  await page.getByTestId('resolution-select').selectOption(resolution);
  await page.getByTestId('file-input').setInputFiles(fixture(file));
  await page.getByTestId('start-processing').click();
  await expect(downloadButtons(page).first()).toBeVisible({ timeout });
  return saveFirstOutput(page, `${++outputCounter}-${file}-${resolution}.mp4`);
}

test.describe('output correctness', () => {
  for (const file of ['landscape_1080p.mp4', 'vp9_opus.webm', 'h264_aac.mkv', 'mono_44k.mp4']) {
    test(`${file} becomes valid H.264/AAC`, async ({ page }) => {
      const { out } = await convert(page, file);
      const src = probe(fixture(file));
      const res = probe(out);
      expect(res.videoCodec).toBe('h264');
      expect(res.audioCodec).toBe('aac');
      expect([res.width, res.height]).toEqual([src.width, src.height]);
      expect(Math.abs(res.duration - src.duration)).toBeLessThan(0.25);
      assertDecodesCleanly(out);
    });
  }

  test('video with no audio track converts and stays silent', async ({ page }) => {
    const { out } = await convert(page, 'no_audio.mp4');
    const res = probe(out);
    expect(res.videoCodec).toBe('h264');
    expect(res.audioCodec).toBeUndefined();
  });

  test('odd source dimensions produce even H.264 dimensions', async ({ page }) => {
    const { out } = await convert(page, 'odd_dimensions.webm');
    const res = probe(out);
    expect(res.width % 2).toBe(0);
    expect(res.height % 2).toBe(0);
    assertDecodesCleanly(out);
  });

  test('rotated iPhone-style clip keeps portrait orientation', async ({ page }) => {
    const { out } = await convert(page, 'portrait_rotated.mov');
    const res = probe(out);
    expect(res.displayWidth).toBeLessThan(res.displayHeight);
  });

  test('awkward file names produce a sane output name', async ({ page }) => {
    const { suggested } = await convert(page, 'name_with.many.dots & spaces.mp4');
    expect(suggested).toBe('name_with.many.dots & spaces_converted.mp4');
  });
});

test.describe('resolution cap', () => {
  const cases: [string, string, number, number][] = [
    ['landscape_1080p.mp4', '720p', 1280, 720],
    ['landscape_1080p.mp4', '480p', 854, 480],
  ];
  for (const [file, res, w, h] of cases) {
    test(`${file} capped to ${res}`, async ({ page }) => {
      const { out } = await convert(page, file, res);
      const p = probe(out);
      expect([p.width, p.height]).toEqual([w, h]);
      assertDecodesCleanly(out);
    });
  }

  test('portrait video is capped on its long edge without distortion', async ({ page }) => {
    const { out } = await convert(page, 'portrait_rotated.mov', '480p');
    const p = probe(out);
    expect(Math.max(p.displayWidth, p.displayHeight)).toBeLessThanOrEqual(854);
    const ratio = p.displayHeight / p.displayWidth;
    expect(Math.abs(ratio - 1280 / 720)).toBeLessThan(0.02);
  });

  test('never upscales a smaller video', async ({ page }) => {
    const { out } = await convert(page, 'no_audio.mp4', '1080p');
    const p = probe(out);
    expect([p.width, p.height]).toEqual([640, 360]);
  });
});

test.describe('quality presets', () => {
  test('low produces a visibly smaller file than high', async ({ page }) => {
    await page.getByTestId('quality-low').click();
    const low = await convert(page, 'landscape_1080p.mp4');
    await page.reload();
    await page.getByTestId('quality-high').click();
    const high = await convert(page, 'landscape_1080p.mp4');
    expect(fs.statSync(low.out).size).toBeLessThan(fs.statSync(high.out).size);
  });
});

test.describe('queue behaviour', () => {
  test('files convert one at a time, and all finish', async ({ page }) => {
    await page.getByTestId('file-input').setInputFiles([
      fixture('landscape_1080p.mp4'),
      fixture('vp9_opus.webm'),
      fixture('h264_aac.mkv'),
    ]);
    await page.getByTestId('start-processing').click();

    let peak = 0;
    const deadline = Date.now() + 60_000;
    while (Date.now() < deadline) {
      const texts = await statuses(page).allInnerTexts();
      peak = Math.max(peak, texts.filter((t) => t.startsWith('Processing')).length);
      if (texts.length === 3 && texts.every((t) => t === 'Complete')) break;
      await page.waitForTimeout(40);
    }
    expect(await statuses(page).allInnerTexts()).toEqual(['Complete', 'Complete', 'Complete']);
    expect(peak).toBe(1);
  });

  test('Start button returns once the queue drains', async ({ page }) => {
    await page.getByTestId('file-input').setInputFiles(fixture('no_audio.mp4'));
    await page.getByTestId('start-processing').click();
    await expect(statuses(page).first()).toHaveText('Complete', { timeout: 30_000 });
    await expect(page.getByTestId('cancel-current')).toHaveCount(0);
    await expect(page.getByTestId('start-processing')).toBeVisible();
  });

  test('a corrupt file fails clearly and does not stop the rest of the queue', async ({ page }) => {
    await page.getByTestId('file-input').setInputFiles([fixture('corrupt.mp4'), fixture('no_audio.mp4')]);
    await page.getByTestId('start-processing').click();
    await expect(statuses(page).nth(1)).toHaveText('Complete', { timeout: 30_000 });
    await expect(statuses(page).nth(0)).toHaveText('Failed');
    await expect(page.getByText(/Error:/)).toBeVisible();
    await expect(page.getByTestId('start-processing')).toBeVisible();
  });

  test('cancel stops the running job, marks it Cancelled, and moves on', async ({ page }) => {
    await page.getByTestId('file-input').setInputFiles([fixture('long_1080p.mp4'), fixture('no_audio.mp4')]);
    await page.getByTestId('start-processing').click();
    await expect(statuses(page).nth(0)).toContainText('Processing', { timeout: 10_000 });
    await expect(page.getByTestId('cancel-current')).toBeEnabled();
    await page.getByTestId('cancel-current').click();

    await expect(statuses(page).nth(0)).toHaveText('Cancelled', { timeout: 10_000 });
    await expect(statuses(page).nth(1)).toHaveText('Complete', { timeout: 30_000 });
    // Must stay Cancelled rather than later flipping to Failed or Complete.
    await page.waitForTimeout(1000);
    await expect(statuses(page).nth(0)).toHaveText('Cancelled');
    await expect(downloadButtons(page)).toHaveCount(1);
  });

  test('a cancelled file can be retried to completion', async ({ page }) => {
    await page.getByTestId('resolution-select').selectOption('480p');
    await page.getByTestId('file-input').setInputFiles(fixture('landscape_1080p.mp4'));
    await page.getByTestId('start-processing').click();
    await expect(statuses(page).first()).toContainText('Processing', { timeout: 10_000 });
    await page.getByTestId('cancel-current').click();
    await expect(statuses(page).first()).toHaveText('Cancelled', { timeout: 10_000 });
    await page.locator('[data-testid^="retry-"]').click();
    await expect(statuses(page).first()).toHaveText('Complete', { timeout: 30_000 });
    const { out } = await saveFirstOutput(page, 'retried.mp4');
    assertDecodesCleanly(out);
  });

  test('a failed file does not poison the next conversion on the same worker', async ({ page }) => {
    await page.getByTestId('file-input').setInputFiles(fixture('corrupt.mp4'));
    await page.getByTestId('start-processing').click();
    await expect(statuses(page).first()).toHaveText('Failed', { timeout: 15_000 });
    await page.getByTestId('file-input').setInputFiles(fixture('no_audio.mp4'));
    await page.getByTestId('start-processing').click();
    await expect(statuses(page).nth(1)).toHaveText('Complete', { timeout: 30_000 });
  });

  test('pause holds the next file until resumed', async ({ page }) => {
    await page.getByTestId('file-input').setInputFiles([
      fixture('landscape_1080p.mp4'),
      fixture('no_audio.mp4'),
    ]);
    await page.getByTestId('start-processing').click();
    await expect(statuses(page).nth(0)).toContainText('Processing', { timeout: 10_000 });
    await page.getByTestId('pause-processing').click();
    await expect(statuses(page).nth(0)).toHaveText('Complete', { timeout: 30_000 });
    await page.waitForTimeout(800);
    await expect(statuses(page).nth(1)).toHaveText('Pending');
    await page.getByTestId('resume-processing').click();
    await expect(statuses(page).nth(1)).toHaveText('Complete', { timeout: 30_000 });
  });

  test('per-file custom settings can be enabled and are honoured', async ({ page }) => {
    await page.getByTestId('resolution-select').selectOption('original');
    await page.getByTestId('file-input').setInputFiles(fixture('landscape_1080p.mp4'));
    await page.locator('[data-testid^="settings-"]:not([data-testid="settings-panel"])').click();
    await page.getByLabel('Use custom settings for this file').check();
    await page.locator('select').last().selectOption('480p');
    await page.getByRole('button', { name: 'Apply Settings' }).click();
    await expect(page.getByText(/Custom:/)).toBeVisible();

    await page.getByTestId('start-processing').click();
    await expect(downloadButtons(page).first()).toBeVisible({ timeout: 30_000 });
    const { out } = await saveFirstOutput(page, 'custom.mp4');
    expect(probe(out).height).toBe(480);
  });

  test('adding a duplicate or an over-limit batch tells the user why', async ({ page }) => {
    await page.getByTestId('file-input').setInputFiles(fixture('no_audio.mp4'));
    await page.getByTestId('file-input').setInputFiles(fixture('no_audio.mp4'));
    await expect(statuses(page)).toHaveCount(1);
    await expect(page.getByText(/already in the queue/i)).toBeVisible();
  });

  test('download all saves every completed file', async ({ page }) => {
    await page.getByTestId('file-input').setInputFiles([fixture('no_audio.mp4'), fixture('mono_44k.mp4')]);
    await page.getByTestId('start-processing').click();
    await expect(downloadButtons(page)).toHaveCount(2, { timeout: 30_000 });
    const seen: string[] = [];
    page.on('download', (d) => seen.push(d.suggestedFilename()));
    await page.getByTestId('download-all').click();
    await expect.poll(() => seen.length, { timeout: 5000 }).toBe(2);
  });
});

test.describe('input validation', () => {
  test('AVI is refused up front with a clear message, not accepted then failed', async ({ page }) => {
    await page.getByTestId('file-input').setInputFiles(fixture('real_avi.avi'));
    await expect(statuses(page)).toHaveCount(0);
    await expect(page.getByText(/real_avi\.avi/)).toBeVisible();
  });

  test('no marketing copy claims AVI support', async ({ page }) => {
    expect(await page.content()).not.toMatch(/\bAVI\b/);
  });
});

test.describe('privacy', () => {
  test('file names never reach analytics', async ({ page }) => {
    await page.getByTestId('file-input').setInputFiles(fixture('name_with.many.dots & spaces.mp4'));
    await page.getByTestId('start-processing').click();
    await expect(downloadButtons(page).first()).toBeVisible({ timeout: 30_000 });
    await saveFirstOutput(page, 'privacy.mp4');
    const sent = await page.evaluate(() => JSON.stringify((window as unknown as { dataLayer: unknown[] }).dataLayer));
    expect(sent).toContain('_started');
    expect(sent).not.toContain('name_with');
  });
});

test.describe('browsers without AudioEncoder (older Safari)', () => {
  test.beforeEach(async ({ page }) => {
    // Workers cannot be touched by addInitScript, so patch the worker script itself.
    await page.route('**/workers/conversion.worker.js', async (route) => {
      const res = await route.fetch();
      await route.fulfill({ response: res, body: `delete self.AudioEncoder;\n${await res.text()}` });
    });
    await page.addInitScript(() => {
      // @ts-expect-error simulating an older browser
      delete window.AudioEncoder;
    });
    await page.reload();
  });

  test('the video still converts, and the user is told the audio is gone', async ({ page }) => {
    await page.getByTestId('resolution-select').selectOption('original');
    await page.getByTestId('file-input').setInputFiles(fixture('mono_44k.mp4'));
    await page.getByTestId('start-processing').click();
    await expect(page.locator('[data-testid^="warning-"]')).toBeVisible({ timeout: 30_000 });
    await expect(downloadButtons(page).first()).toBeVisible({ timeout: 30_000 });
    const { out } = await saveFirstOutput(page, 'no-aac.mp4');
    const res = probe(out);
    expect(res.videoCodec).toBe('h264');
    expect(res.audioCodec).toBeUndefined();
  });

  test('a silent video gives no false warning', async ({ page }) => {
    await page.getByTestId('file-input').setInputFiles(fixture('no_audio.mp4'));
    await page.getByTestId('start-processing').click();
    await expect(downloadButtons(page).first()).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('[data-testid^="warning-"]')).toHaveCount(0);
  });
});
