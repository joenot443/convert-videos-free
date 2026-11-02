import { test, expect, Page } from '@playwright/test';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { assertDecodesCleanly, averageColor, blockThirdParty, fixture, probe } from './helpers/media';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'crop-'));

// Tall enough to keep the video and the controls on screen together.
test.use({ viewport: { width: 1280, height: 1300 } });

test.beforeEach(async ({ page }) => {
  await blockThirdParty(page);
  await page.goto('/crop');
});

async function load(page: Page, file: string) {
  await page.getByTestId('file-input').setInputFiles(fixture(file));
  await expect(page.getByTestId('crop-overlay')).toBeVisible({ timeout: 15_000 });
}

async function exportAndSave(page: Page, name: string) {
  await page.getByTestId('export-button').click();
  await expect(page.getByTestId('download-button')).toBeVisible({ timeout: 45_000 });
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('download-button').click(),
  ]);
  const out = path.join(tmp, name);
  await download.saveAs(out);
  return out;
}

/** Drags a crop handle by a fraction of the video's on-screen size. */
async function dragBox(page: Page, fromX: number, fromY: number, dx: number, dy: number) {
  await page.mouse.move(fromX, fromY);
  await page.mouse.down();
  await page.mouse.move(fromX + dx, fromY + dy, { steps: 8 });
  await page.mouse.up();
}

test('default export honours the displayed crop', async ({ page }) => {
  await load(page, 'landscape_1080p.mp4');
  const w = Number(await page.getByTestId('output-width').innerText());
  const h = Number(await page.getByTestId('output-height').innerText());
  const out = await exportAndSave(page, 'default.mp4');
  const p = probe(out);
  expect([p.width, p.height]).toEqual([w, h]);
  expect(p.videoCodec).toBe('h264');
  expect(p.audioCodec).toBe('aac');
  assertDecodesCleanly(out);
});

for (const [label, testId, ratio] of [
  ['1:1', 'aspect-1-1', 1],
  ['9:16', 'aspect-9-16', 9 / 16],
  ['16:9', 'aspect-16-9', 16 / 9],
] as const) {
  test(`${label} preset gives that exact shape`, async ({ page }) => {
    await load(page, 'landscape_1080p.mp4');
    await page.getByTestId(testId).click();
    const out = await exportAndSave(page, `ratio-${label.replace(':', '_')}.mp4`);
    const p = probe(out);
    expect(Math.abs(p.width / p.height - ratio)).toBeLessThan(0.01);
    expect(p.width % 2).toBe(0);
    expect(p.height % 2).toBe(0);
  });
}

test('crop keeps the pixels that were selected', async ({ page }) => {
  await load(page, 'split_colors.mp4');
  const box = (await page.locator('[data-testid="crop-overlay"] > .border-white').boundingBox())!;
  // Pull the east edge in to the centre line so that only the red half remains.
  const eastHandle = page.getByTestId('crop-handle-e');
  const handle = (await eastHandle.boundingBox())!;
  const midX = box.x - (box.width / 0.9) * 0.05 + box.width / 0.9 / 2 - 12;
  await dragBox(page, handle.x + handle.width / 2, handle.y + handle.height / 2, midX - (handle.x + handle.width / 2), 0);
  const out = await exportAndSave(page, 'left-half.mp4');
  const [r, g, b] = averageColor(out);
  expect(r).toBeGreaterThan(200);
  expect(b).toBeLessThan(60);
  expect(g).toBeLessThan(60);
});

test('trim shortens the output', async ({ page }) => {
  await load(page, 'landscape_1080p.mp4');
  const end = (await page.getByTestId('trim-handle-end').boundingBox())!;
  const timeline = (await page.getByTestId('timeline').boundingBox())!;
  await dragBox(page, end.x + end.width / 2, end.y + end.height / 2, -timeline.width / 2, 0);
  const expected = parseFloat(await page.getByTestId('output-duration').innerText());
  expect(expected).toBeLessThan(2);
  const out = await exportAndSave(page, 'trim.mp4');
  expect(Math.abs(probe(out).duration - expected)).toBeLessThan(0.25);
  assertDecodesCleanly(out);
});

test('odd-sized sources give even output that stays in frame', async ({ page }) => {
  await load(page, 'odd_dimensions.webm');
  await page.getByTestId('reset-crop').click();
  const out = await exportAndSave(page, 'odd.mp4');
  const p = probe(out);
  expect(p.width % 2).toBe(0);
  expect(p.height % 2).toBe(0);
  expect(p.width).toBeLessThanOrEqual(853);
  expect(p.height).toBeLessThanOrEqual(481);
});

test('rotated clip crops in display orientation', async ({ page }) => {
  await load(page, 'portrait_rotated.mov');
  const header = await page.getByRole('heading', { name: 'Crop Videos Free' }).locator('..').innerText();
  expect(header).toContain('720×1280');
  await page.getByTestId('aspect-1-1').click();
  const out = await exportAndSave(page, 'rot.mp4');
  const p = probe(out);
  expect(Math.abs(p.displayWidth - p.displayHeight)).toBeLessThanOrEqual(2);
  expect(p.displayWidth).toBeLessThanOrEqual(720);
});

test('cancel returns quietly to the editor rather than reporting failure', async ({ page }) => {
  await load(page, 'long_1080p.mp4');
  await page.getByTestId('export-button').click();
  await expect(page.getByTestId('cancel-export-button')).toBeVisible();
  await page.waitForTimeout(800);
  await page.getByTestId('cancel-export-button').click();
  await expect(page.getByTestId('export-button')).toBeVisible();
  await page.waitForTimeout(1500);
  await expect(page.getByText('Export failed')).toHaveCount(0);
  await expect(page.getByTestId('export-button')).toBeVisible();
});

test('a file the browser cannot open shows an error instead of a black screen', async ({ page }) => {
  await page.getByTestId('file-input').setInputFiles(fixture('not_a_video.mov'));
  await expect(page.getByTestId('video-load-error')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByTestId('video-drop-zone')).toBeVisible();
});

test('a WebM with no duration in its header still gets a usable timeline', async ({ page }) => {
  await load(page, 'no_duration.webm');
  await expect(page.getByTestId('output-duration')).toHaveText(/^[12]\.\ds$/, { timeout: 10_000 });
  const out = await exportAndSave(page, 'no-duration.mp4');
  expect(probe(out).videoCodec).toBe('h264');
});

test('starting a new video resets the editor', async ({ page }) => {
  await load(page, 'landscape_1080p.mp4');
  await page.getByTestId('clear-file').click();
  await expect(page.getByTestId('video-drop-zone')).toBeVisible();
  await load(page, 'no_audio.mp4');
  await expect(page.getByTestId('output-duration')).toHaveText('2.0s');
});

test('AVI is refused up front', async ({ page }) => {
  await page.getByTestId('file-input').setInputFiles(fixture('real_avi.avi'));
  await expect(page.getByText(/Unsupported format/)).toBeVisible();
  await expect(page.getByTestId('video-drop-zone')).toBeVisible();
});

test('file names never reach analytics', async ({ page }) => {
  await load(page, 'name_with.many.dots & spaces.mp4');
  await exportAndSave(page, 'privacy.mp4');
  const sent = await page.evaluate(() => JSON.stringify((window as unknown as { dataLayer: unknown[] }).dataLayer));
  expect(sent).toContain('_started');
  expect(sent).not.toContain('name_with');
});

test.describe('aspect-locked dragging', () => {
  test('dragging the SE corner keeps the NW corner fixed and the ratio locked', async ({ page }) => {
    await load(page, 'landscape_1080p.mp4');
    await page.getByTestId('aspect-1-1').click();
    const before = (await page.locator('[data-testid="crop-overlay"] > .border-white').boundingBox())!;
    const se = (await page.getByTestId('crop-handle-se').boundingBox())!;
    await dragBox(page, se.x + se.width / 2, se.y + se.height / 2, -60, -60);
    const after = (await page.locator('[data-testid="crop-overlay"] > .border-white').boundingBox())!;
    expect(Math.abs(after.x - before.x)).toBeLessThan(2);
    expect(Math.abs(after.y - before.y)).toBeLessThan(2);
    expect(Math.abs(after.width - after.height)).toBeLessThan(2);
  });

  test('dragging the NW corner keeps the SE corner fixed', async ({ page }) => {
    await load(page, 'landscape_1080p.mp4');
    await page.getByTestId('aspect-1-1').click();
    const before = (await page.locator('[data-testid="crop-overlay"] > .border-white').boundingBox())!;
    const nw = (await page.getByTestId('crop-handle-nw').boundingBox())!;
    await dragBox(page, nw.x + nw.width / 2, nw.y + nw.height / 2, 60, 60);
    const after = (await page.locator('[data-testid="crop-overlay"] > .border-white').boundingBox())!;
    expect(Math.abs(after.x + after.width - (before.x + before.width))).toBeLessThan(2);
    expect(Math.abs(after.y + after.height - (before.y + before.height))).toBeLessThan(2);
  });

  test('an edge can grow the box, not just shrink it', async ({ page }) => {
    await load(page, 'landscape_1080p.mp4');
    await page.getByTestId('aspect-1-1').click();
    // Shrink first so that there is room to grow.
    const se = (await page.getByTestId('crop-handle-se').boundingBox())!;
    await dragBox(page, se.x + se.width / 2, se.y + se.height / 2, -100, -100);
    const before = (await page.locator('[data-testid="crop-overlay"] > .border-white').boundingBox())!;
    const e = (await page.getByTestId('crop-handle-e').boundingBox())!;
    await dragBox(page, e.x + e.width / 2, e.y + e.height / 2, 50, 0);
    const after = (await page.locator('[data-testid="crop-overlay"] > .border-white').boundingBox())!;
    expect(after.width).toBeGreaterThan(before.width + 20);
    expect(Math.abs(after.width - after.height)).toBeLessThan(2);
  });
});
