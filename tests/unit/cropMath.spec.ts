import { test, expect } from '@playwright/test';
import { calculateCropAfterDrag, cropToPixels, getVideoDisplayBounds } from '../../lib/crop/cropMath';
import { CropRegion } from '../../lib/crop/types';

const meta = { width: 1920, height: 1080, duration: 10, filename: 'x.mp4' };
const pixelRatio = (c: CropRegion) => (c.width * meta.width) / (c.height * meta.height);
const inFrame = (c: CropRegion) =>
  c.x >= -1e-9 && c.y >= -1e-9 && c.x + c.width <= 1 + 1e-9 && c.y + c.height <= 1 + 1e-9;

test.describe('cropToPixels', () => {
  test('always returns even sizes inside an odd-sized frame', () => {
    for (const [w, h] of [[853, 481], [1921, 1081], [3, 3], [2, 2]]) {
      for (const crop of [
        { x: 0, y: 0, width: 1, height: 1 },
        { x: 0.5, y: 0.5, width: 0.5, height: 0.5 },
        { x: 0.999, y: 0.999, width: 0.05, height: 0.05 },
      ]) {
        const p = cropToPixels(crop, w, h);
        expect(p.width % 2).toBe(0);
        expect(p.height % 2).toBe(0);
        expect(p.left % 2).toBe(0);
        expect(p.top % 2).toBe(0);
        expect(p.left + p.width).toBeLessThanOrEqual(w);
        expect(p.top + p.height).toBeLessThanOrEqual(h);
      }
    }
  });
});

test.describe('aspect-locked dragging', () => {
  const square = { x: 0.3, y: 0.2, width: 0.3, height: 0.3 * (1920 / 1080) };

  for (const handle of ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'] as const) {
    for (const [dx, dy] of [[0.1, 0.1], [-0.1, -0.1], [0.9, 0.9], [-0.9, -0.9], [0.9, -0.9]]) {
      test(`${handle} by (${dx}, ${dy}) keeps 1:1 and stays in frame`, () => {
        const result = calculateCropAfterDrag(square, handle, dx, dy, '1:1', meta);
        expect(Math.abs(pixelRatio(result) - 1)).toBeLessThan(0.001);
        expect(inFrame(result)).toBe(true);
      });
    }
  }

  test('the corner opposite the handle does not move', () => {
    const se = calculateCropAfterDrag(square, 'se', -0.05, -0.05, '1:1', meta);
    expect(se.x).toBeCloseTo(square.x);
    expect(se.y).toBeCloseTo(square.y);

    const nw = calculateCropAfterDrag(square, 'nw', 0.05, 0.05, '1:1', meta);
    expect(nw.x + nw.width).toBeCloseTo(square.x + square.width);
    expect(nw.y + nw.height).toBeCloseTo(square.y + square.height);
  });

  test('edges can grow the box', () => {
    const grown = calculateCropAfterDrag(square, 'e', 0.05, 0, '1:1', meta);
    expect(grown.width).toBeGreaterThan(square.width);
  });

  test('free mode leaves the shape unconstrained', () => {
    const result = calculateCropAfterDrag(square, 'e', 0.1, 0, 'free', meta);
    expect(result.height).toBeCloseTo(square.height);
    expect(result.width).toBeCloseTo(square.width + 0.1);
  });

  test('moving never leaves the frame', () => {
    const moved = calculateCropAfterDrag(square, 'move', 5, 5, 'free', meta);
    expect(inFrame(moved)).toBe(true);
  });
});

test.describe('getVideoDisplayBounds', () => {
  const rect = (width: number, height: number) => ({ width, height }) as DOMRect;

  test('letterboxes a portrait video in a 16:9 box', () => {
    const b = getVideoDisplayBounds(rect(1600, 900), { ...meta, width: 720, height: 1280 });
    expect(b.height).toBe(900);
    expect(b.width).toBeCloseTo(506.25);
    expect(b.x).toBeCloseTo((1600 - 506.25) / 2);
  });
});
