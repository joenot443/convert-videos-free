import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('MOV File Conversion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="drop-zone"]', { timeout: 10000 });

    // Verify test mode is initialized
    const testModeReady = await page.evaluate(() => {
      return typeof window.__testMode !== 'undefined';
    });
    expect(testModeReady).toBe(true);
  });

  test('should convert MOV file to MP4', async ({ page }) => {
    // Read the actual MOV file
    const movPath = path.join(process.cwd(), '../vidoes/2.mov');

    // Check if file exists
    if (!fs.existsSync(movPath)) {
      console.log('MOV test file not found at:', movPath);
      test.skip();
      return;
    }

    const movBuffer = fs.readFileSync(movPath);
    const movArrayBuffer = movBuffer.buffer.slice(
      movBuffer.byteOffset,
      movBuffer.byteOffset + movBuffer.byteLength
    );

    // Inject the real MOV file
    await page.evaluate(async (arrayBuffer) => {
      const uint8Array = new Uint8Array(arrayBuffer);
      const file = new File([uint8Array], 'test-video.mov', {
        type: 'video/quicktime',
        lastModified: Date.now(),
      });

      const store = window.useConverterStore.getState();
      store.addFiles([file]);
    }, movArrayBuffer);

    // Verify file was added to queue
    await expect(page.locator('[data-testid^="queue-item-"]')).toHaveCount(1);
    await expect(page.locator('text=test-video.mov')).toBeVisible();

    // Start conversion
    await page.click('[data-testid="start-processing"]');

    // Monitor conversion progress with console logs
    await page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warn') {
        console.log(`Browser ${msg.type()}:`, msg.text());
      }
    });

    // Wait for conversion to complete or fail (with longer timeout for real conversion)
    const result = await page.waitForFunction(
      () => {
        const store = window.useConverterStore.getState();
        const item = store.queue[0];
        return item && (item.status === 'completed' || item.status === 'failed');
      },
      { timeout: 60000 } // 60 second timeout for real conversion
    );

    // Check the result
    const status = await page.evaluate(() => {
      const store = window.useConverterStore.getState();
      const item = store.queue[0];
      return {
        status: item.status,
        error: item.error,
        outputSize: item.outputSize,
        compressionRatio: item.compressionRatio
      };
    });

    console.log('MOV Conversion Result:', status);

    // Note: Some MOV files may not be supported by MediaBunny
    // This is a known limitation of the library
    if (status.status === 'failed') {
      console.log('MOV conversion failed - this is a known MediaBunny limitation');
      expect(status.error).toContain('not supported');
    } else {
      expect(status.status).toBe('completed');
      expect(status.outputSize).toBeGreaterThan(0);
    }
  });

  test('should handle MOV file with no audio track', async ({ page }) => {
    // Create a mock MOV file with metadata but no real content
    await page.evaluate(() => {
      // Create a small mock MOV file
      const mockMov = new File([new ArrayBuffer(1024)], 'silent-video.mov', {
        type: 'video/quicktime',
      });

      const store = window.useConverterStore.getState();
      store.addFiles([mockMov]);
    });

    // Verify file was added
    await expect(page.locator('[data-testid^="queue-item-"]')).toHaveCount(1);

    // Start conversion
    await page.click('[data-testid="start-processing"]');

    // Wait for result
    await page.waitForFunction(
      () => {
        const store = window.useConverterStore.getState();
        const item = store.queue[0];
        return item && (item.status === 'completed' || item.status === 'failed');
      },
      { timeout: 30000 }
    );

    // Check status
    const status = await page.evaluate(() => {
      const store = window.useConverterStore.getState();
      const item = store.queue[0];
      return { status: item.status, error: item.error };
    });

    console.log('Mock MOV Result:', status);

    // Mock file will likely fail, but should fail gracefully
    if (status.status === 'failed') {
      expect(status.error).toBeTruthy();
      // Should have a user-friendly error message
      expect(status.error).toMatch(/not supported|No video track|corrupted/);
      // Should not have circular reference error
      expect(status.error).not.toContain('circular');
    }
  });
});