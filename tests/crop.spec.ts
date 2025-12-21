import { test, expect, Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

// Helper to create a minimal valid MP4 file for testing
async function createTestVideoFile(): Promise<string> {
  const testDir = path.join(__dirname, 'fixtures');
  const testFile = path.join(testDir, 'test-video.mp4');

  // Create fixtures directory if it doesn't exist
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // Check if test video already exists
  if (fs.existsSync(testFile)) {
    return testFile;
  }

  // Check for existing video in parent directory
  const existingVideo = path.join(__dirname, '../../vidoes/1.mp4');
  if (fs.existsSync(existingVideo)) {
    fs.copyFileSync(existingVideo, testFile);
    return testFile;
  }

  // Create a minimal MP4 file (ftyp + moov boxes) that browsers can parse
  // This is a minimal valid MP4 header that will trigger loadedmetadata
  const mp4Header = Buffer.from([
    // ftyp box
    0x00, 0x00, 0x00, 0x18, // size: 24 bytes
    0x66, 0x74, 0x79, 0x70, // type: 'ftyp'
    0x69, 0x73, 0x6f, 0x6d, // brand: 'isom'
    0x00, 0x00, 0x00, 0x01, // version
    0x69, 0x73, 0x6f, 0x6d, // compatible: 'isom'
    0x61, 0x76, 0x63, 0x31, // compatible: 'avc1'
    // moov box (minimal)
    0x00, 0x00, 0x00, 0x6c, // size: 108 bytes
    0x6d, 0x6f, 0x6f, 0x76, // type: 'moov'
    // mvhd box
    0x00, 0x00, 0x00, 0x6c, // size
    0x6d, 0x76, 0x68, 0x64, // type: 'mvhd'
    0x00, 0x00, 0x00, 0x00, // version + flags
    0x00, 0x00, 0x00, 0x00, // creation time
    0x00, 0x00, 0x00, 0x00, // modification time
    0x00, 0x00, 0x03, 0xe8, // timescale: 1000
    0x00, 0x00, 0x00, 0x00, // duration
  ]);

  fs.writeFileSync(testFile, mp4Header);
  return testFile;
}

// Helper to upload a file via the drop zone
async function uploadVideoFile(page: Page, filePath: string) {
  // Find the file input inside the drop zone
  const fileInput = page.locator('input[type="file"]');

  // Set the file
  await fileInput.setInputFiles(filePath);
}

test.describe('Crop Video Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crop', {
      waitUntil: 'networkidle',
    });
  });

  test('should display the crop interface', async ({ page }) => {
    // Check header
    await expect(page.locator('h1')).toContainText('Crop Videos');
    await expect(page.locator('h1')).toContainText('Free');

    // Check drop zone is visible
    await expect(page.locator('text=Drop your video here')).toBeVisible();

    // Check key sections are visible
    await expect(page.locator('text=How It Works')).toBeVisible();
    await expect(page.locator('text=Why Use Crop Videos Free?')).toBeVisible();
    await expect(page.locator('text=Frequently Asked Questions')).toBeVisible();
  });

  test('should show crop overlay immediately after video upload', async ({ page }) => {
    // Create or get test video
    const testVideoPath = await createTestVideoFile();

    // Upload the video
    await uploadVideoFile(page, testVideoPath);

    // Wait for video to load and crop overlay to appear
    await expect(page.locator('[data-testid="crop-overlay"]')).toBeVisible({ timeout: 10000 });

    // Check that all corner handles are visible
    await expect(page.locator('[data-testid="crop-handle-nw"]')).toBeVisible();
    await expect(page.locator('[data-testid="crop-handle-ne"]')).toBeVisible();
    await expect(page.locator('[data-testid="crop-handle-sw"]')).toBeVisible();
    await expect(page.locator('[data-testid="crop-handle-se"]')).toBeVisible();

    // Check edge handles
    await expect(page.locator('[data-testid="crop-handle-n"]')).toBeVisible();
    await expect(page.locator('[data-testid="crop-handle-s"]')).toBeVisible();
    await expect(page.locator('[data-testid="crop-handle-e"]')).toBeVisible();
    await expect(page.locator('[data-testid="crop-handle-w"]')).toBeVisible();
  });

  test('should allow dragging crop handles immediately after video load', async ({ page }) => {
    // Create or get test video
    const testVideoPath = await createTestVideoFile();

    // Upload the video
    await uploadVideoFile(page, testVideoPath);

    // Wait for crop overlay to appear
    await expect(page.locator('[data-testid="crop-overlay"]')).toBeVisible({ timeout: 10000 });

    // Get the SE corner handle (bottom-right)
    const seHandle = page.locator('[data-testid="crop-handle-se"]');
    await expect(seHandle).toBeVisible();

    // Get the initial position of the handle
    const initialBox = await seHandle.boundingBox();
    expect(initialBox).not.toBeNull();

    // Get the output dimensions before drag
    const initialWidth = await page.locator('[data-testid="output-width"]').textContent();

    // Perform a drag operation on the SE handle (drag inward to shrink crop)
    await seHandle.hover();
    await page.mouse.down();
    await page.mouse.move(
      initialBox!.x - 50,  // Move left
      initialBox!.y - 50,  // Move up
      { steps: 10 }
    );
    await page.mouse.up();

    // Check that the output dimensions changed (crop was adjusted)
    const newWidth = await page.locator('[data-testid="output-width"]').textContent();

    // The width should have decreased since we dragged inward
    expect(parseInt(newWidth || '0')).toBeLessThan(parseInt(initialWidth || '0'));
  });

  test('should not require aspect ratio change for handles to work', async ({ page }) => {
    // This is the specific bug test - handles should work without changing aspect ratio first
    const testVideoPath = await createTestVideoFile();

    // Upload the video
    await uploadVideoFile(page, testVideoPath);

    // Wait for crop overlay
    await expect(page.locator('[data-testid="crop-overlay"]')).toBeVisible({ timeout: 10000 });

    // Get initial output dimensions
    const initialWidth = await page.locator('[data-testid="output-width"]').textContent();
    const initialHeight = await page.locator('[data-testid="output-height"]').textContent();

    // Try to drag the NW handle (top-left) WITHOUT changing aspect ratio first
    const nwHandle = page.locator('[data-testid="crop-handle-nw"]');
    await expect(nwHandle).toBeVisible();

    const handleBox = await nwHandle.boundingBox();
    expect(handleBox).not.toBeNull();

    // Drag the handle inward (to the right and down)
    await nwHandle.hover();
    await page.mouse.down();
    await page.mouse.move(
      handleBox!.x + 30,
      handleBox!.y + 30,
      { steps: 10 }
    );
    await page.mouse.up();

    // Dimensions should have changed
    const newWidth = await page.locator('[data-testid="output-width"]').textContent();
    const newHeight = await page.locator('[data-testid="output-height"]').textContent();

    // At least one dimension should be different
    const widthChanged = parseInt(newWidth || '0') !== parseInt(initialWidth || '0');
    const heightChanged = parseInt(newHeight || '0') !== parseInt(initialHeight || '0');

    expect(widthChanged || heightChanged).toBe(true);
  });

  test('should update crop when dragging edge handles', async ({ page }) => {
    const testVideoPath = await createTestVideoFile();

    await uploadVideoFile(page, testVideoPath);
    await expect(page.locator('[data-testid="crop-overlay"]')).toBeVisible({ timeout: 10000 });

    // Get initial width
    const initialWidth = await page.locator('[data-testid="output-width"]').textContent();

    // Drag the east (right) edge handle inward
    const eHandle = page.locator('[data-testid="crop-handle-e"]');
    await expect(eHandle).toBeVisible();

    const handleBox = await eHandle.boundingBox();
    expect(handleBox).not.toBeNull();

    await eHandle.hover();
    await page.mouse.down();
    await page.mouse.move(handleBox!.x - 40, handleBox!.y, { steps: 10 });
    await page.mouse.up();

    // Width should have decreased
    const newWidth = await page.locator('[data-testid="output-width"]').textContent();
    expect(parseInt(newWidth || '0')).toBeLessThan(parseInt(initialWidth || '0'));
  });

  test('should allow moving the crop box by dragging inside', async ({ page }) => {
    const testVideoPath = await createTestVideoFile();

    await uploadVideoFile(page, testVideoPath);
    await expect(page.locator('[data-testid="crop-overlay"]')).toBeVisible({ timeout: 10000 });

    // First, shrink the crop to make room for movement by dragging a corner inward
    const seHandle = page.locator('[data-testid="crop-handle-se"]');
    await expect(seHandle).toBeVisible();

    let handleBox = await seHandle.boundingBox();
    expect(handleBox).not.toBeNull();

    // Shrink the crop by dragging SE corner inward significantly
    await seHandle.hover();
    await page.mouse.down();
    await page.mouse.move(handleBox!.x - 100, handleBox!.y - 100, { steps: 10 });
    await page.mouse.up();

    await page.waitForTimeout(200);

    // Get the crop box (the border element inside the overlay)
    const cropBox = page.locator('[data-testid="crop-overlay"] .border-white').first();
    await expect(cropBox).toBeVisible();

    const initialBox = await cropBox.boundingBox();
    expect(initialBox).not.toBeNull();

    // Get initial position from the output info
    const getPosition = async () => {
      const posText = await page.locator('text=/Position:.*X:.*Y:/').textContent();
      const match = posText?.match(/X:(\d+),\s*Y:(\d+)/);
      return match ? { x: parseInt(match[1]), y: parseInt(match[2]) } : null;
    };

    const initialPos = await getPosition();
    expect(initialPos).not.toBeNull();

    // Now drag the crop box to move it - drag from center towards bottom-right
    const centerX = initialBox!.x + initialBox!.width / 2;
    const centerY = initialBox!.y + initialBox!.height / 2;

    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX + 60, centerY + 60, { steps: 15 });
    await page.mouse.up();

    await page.waitForTimeout(100);

    // Check position changed via the output info
    const newPos = await getPosition();
    expect(newPos).not.toBeNull();

    // Position should be different (X and Y should have increased)
    const positionChanged = newPos!.x > initialPos!.x || newPos!.y > initialPos!.y;
    expect(positionChanged).toBe(true);
  });

  test('should respect aspect ratio constraint when dragging', async ({ page }) => {
    const testVideoPath = await createTestVideoFile();

    await uploadVideoFile(page, testVideoPath);
    await expect(page.locator('[data-testid="crop-overlay"]')).toBeVisible({ timeout: 10000 });

    // Set 16:9 aspect ratio
    await page.locator('[data-testid="aspect-16-9"]').click();

    // Get dimensions
    const width = await page.locator('[data-testid="output-width"]').textContent();
    const height = await page.locator('[data-testid="output-height"]').textContent();

    const w = parseInt(width || '0');
    const h = parseInt(height || '0');

    // Check aspect ratio is approximately 16:9
    const ratio = w / h;
    expect(ratio).toBeCloseTo(16 / 9, 1);

    // Drag a corner and verify aspect ratio is maintained
    const seHandle = page.locator('[data-testid="crop-handle-se"]');
    const handleBox = await seHandle.boundingBox();

    await seHandle.hover();
    await page.mouse.down();
    await page.mouse.move(handleBox!.x - 50, handleBox!.y - 50, { steps: 10 });
    await page.mouse.up();

    // Check aspect ratio is still 16:9
    const newWidth = await page.locator('[data-testid="output-width"]').textContent();
    const newHeight = await page.locator('[data-testid="output-height"]').textContent();

    const newW = parseInt(newWidth || '0');
    const newH = parseInt(newHeight || '0');
    const newRatio = newW / newH;

    expect(newRatio).toBeCloseTo(16 / 9, 1);
  });
});
