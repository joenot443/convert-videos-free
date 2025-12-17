import { test, expect, Page, Download } from '@playwright/test';
import path from 'path';
import fs from 'fs/promises';

// Test timeout for video conversion
test.setTimeout(120000);

// Helper function to handle file selection dialog
async function selectFile(page: Page, filePath: string) {
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Select File' }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(filePath);
}

// Helper to check if a file has valid MP4 structure
async function isValidMp4(filePath: string): Promise<{ valid: boolean; size: number }> {
  try {
    const buffer = await fs.readFile(filePath);

    // Check for MP4 signature (ftyp box)
    const signature = buffer.subarray(4, 8).toString('ascii');
    const valid = signature === 'ftyp';

    return { valid, size: buffer.length };
  } catch (error) {
    return { valid: false, size: 0 };
  }
}

test.describe('Streaming Mode Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Wait for the app to be ready
    await page.waitForSelector('h1:has-text("Media Converter")', { timeout: 10000 });
  });

  test('should convert video using streaming mode with real file', async ({ page }) => {
    // Path to test video
    const testVideoPath = path.join(__dirname, '..', 'videos', '1.mp4');

    // Check if streaming mode is available
    const streamingCheckbox = await page.locator('input#streaming');
    const hasStreamingSupport = await streamingCheckbox.isVisible();

    if (!hasStreamingSupport) {
      console.log('Streaming mode not supported in this browser, skipping test');
      test.skip();
      return;
    }

    // Enable streaming mode
    await streamingCheckbox.check();
    expect(await streamingCheckbox.isChecked()).toBe(true);

    // Select the test video file
    await selectFile(page, testVideoPath);

    // Wait for file to be selected
    await expect(page.locator('text=/1\\.mp4/')).toBeVisible();

    // Prepare to handle file download dialog (streaming mode uses save dialog)
    page.on('dialog', async dialog => {
      console.log(`Dialog type: ${dialog.type()}`);
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });

    // Add console logging to capture worker messages
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('ProxyWritableStream') || text.includes('stream') || text.includes('chunk')) {
        console.log(`[Browser Console]: ${text}`);
      }
    });

    // Start conversion
    await page.getByRole('button', { name: 'Convert to MP4' }).click();

    // Wait for conversion to complete
    // Note: In streaming mode, we won't get a download event, just a success message
    const successMessage = page.locator('text=/File saved successfully/');
    const errorMessage = page.locator('.bg-red-50');

    // Wait for either success or error
    const result = await Promise.race([
      successMessage.waitFor({ timeout: 60000 }).then(() => 'success'),
      errorMessage.waitFor({ timeout: 60000 }).then(() => 'error')
    ]);

    if (result === 'error') {
      const errorText = await errorMessage.textContent();
      throw new Error(`Conversion failed: ${errorText}`);
    }

    // Verify success
    expect(await successMessage.isVisible()).toBe(true);
    console.log('Streaming mode conversion completed successfully');

    // Check final status
    const progressText = await page.locator('text=/100%/').textContent();
    expect(progressText).toContain('100%');

    // Check if bytes were written
    const bytesWritten = await page.locator('text=/Written:.*MB/').textContent();
    console.log(`Bytes written: ${bytesWritten}`);
    expect(bytesWritten).toBeTruthy();
  });

  test('should handle streaming mode errors gracefully', async ({ page }) => {
    // Check if streaming mode is available
    const streamingCheckbox = await page.locator('input#streaming');
    const hasStreamingSupport = await streamingCheckbox.isVisible();

    if (!hasStreamingSupport) {
      console.log('Streaming mode not supported in this browser, skipping test');
      test.skip();
      return;
    }

    // Enable streaming mode
    await streamingCheckbox.check();

    // Create a corrupted test file
    const corruptedFile = new Uint8Array(100).fill(0);
    const blob = new Blob([corruptedFile], { type: 'video/mp4' });
    const file = new File([blob], 'corrupted.mp4', { type: 'video/mp4' });

    // Use page.evaluate to set the file directly
    await page.evaluate((fileData) => {
      const dataTransfer = new DataTransfer();
      const file = new File([new Uint8Array(fileData)], 'corrupted.mp4', { type: 'video/mp4' });
      dataTransfer.items.add(file);

      const dropZone = document.querySelector('[onDrop]') as HTMLElement;
      const dropEvent = new DragEvent('drop', {
        dataTransfer,
        bubbles: true,
        cancelable: true
      });
      dropZone?.dispatchEvent(dropEvent);
    }, Array.from(corruptedFile));

    // Wait for file to be selected
    await expect(page.locator('text=/corrupted\\.mp4/')).toBeVisible();

    // Handle save dialog
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // Start conversion
    await page.getByRole('button', { name: 'Convert to MP4' }).click();

    // Wait for error
    const errorMessage = await page.locator('.bg-red-50');
    await expect(errorMessage).toBeVisible({ timeout: 30000 });

    const errorText = await errorMessage.textContent();
    console.log(`Expected error received: ${errorText}`);
    expect(errorText).toBeTruthy();
  });

  test('should show progress updates during streaming conversion', async ({ page }) => {
    // Path to larger test video
    const testVideoPath = path.join(__dirname, '..', 'videos', '2.mov');

    // Check if streaming mode is available
    const streamingCheckbox = await page.locator('input#streaming');
    const hasStreamingSupport = await streamingCheckbox.isVisible();

    if (!hasStreamingSupport) {
      console.log('Streaming mode not supported in this browser, skipping test');
      test.skip();
      return;
    }

    // Enable streaming mode
    await streamingCheckbox.check();

    // Select the test video file
    await selectFile(page, testVideoPath);

    // Wait for file to be selected
    await expect(page.locator('text=/2\\.mov/')).toBeVisible();

    // Handle save dialog
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // Collect progress updates
    const progressUpdates: number[] = [];

    // Monitor progress updates
    await page.exposeFunction('captureProgress', (progress: number) => {
      progressUpdates.push(progress);
      console.log(`Progress: ${progress}%`);
    });

    await page.evaluate(() => {
      const observer = new MutationObserver(() => {
        const progressElement = document.querySelector('.bg-blue-600');
        if (progressElement) {
          const width = (progressElement as HTMLElement).style.width;
          const progress = parseInt(width) || 0;
          if (progress > 0) {
            (window as any).captureProgress(progress);
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
      });
    });

    // Start conversion
    await page.getByRole('button', { name: 'Convert to MP4' }).click();

    // Wait for conversion to complete
    const successMessage = page.locator('text=/File saved successfully/');
    await expect(successMessage).toBeVisible({ timeout: 60000 });

    // Verify we got progress updates
    console.log(`Progress updates received: ${progressUpdates.length}`);
    expect(progressUpdates.length).toBeGreaterThan(0);

    // Verify progress reached 100%
    const finalProgress = await page.locator('text=/100%/');
    await expect(finalProgress).toBeVisible();
  });
});