import { test, expect } from '@playwright/test';

test.describe('Media Converter', () => {
  test.beforeEach(async ({ page }) => {
    // Set test mode environment variable
    await page.goto('/', {
      waitUntil: 'networkidle',
    });

    // Wait for the app to load
    await page.waitForSelector('[data-testid="drop-zone"]', { timeout: 10000 });

    // Verify test mode is initialized
    const testModeReady = await page.evaluate(() => {
      return typeof window.__testMode !== 'undefined';
    });
    expect(testModeReady).toBe(true);
  });

  test('should display the main interface', async ({ page }) => {
    // Check header
    await expect(page.locator('h1')).toContainText('Media Converter');

    // Check main components are visible
    await expect(page.locator('[data-testid="drop-zone"]')).toBeVisible();
    await expect(page.locator('[data-testid="settings-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="queue-container"]')).toBeVisible();
  });

  test('should inject files and display them in queue', async ({ page }) => {
    // Inject test files
    await page.evaluate(() => {
      window.__testMode.injectFiles([
        { name: 'test1.mp4', size: 1048576, type: 'video/mp4' },
        { name: 'test2.mov', size: 2097152, type: 'video/quicktime' },
      ]);
    });

    // Check that files appear in the queue
    await expect(page.locator('[data-testid^="queue-item-"]')).toHaveCount(2);
    await expect(page.locator('text=test1.mp4')).toBeVisible();
    await expect(page.locator('text=test2.mov')).toBeVisible();
  });

  test('should update settings', async ({ page }) => {
    // Click on quality settings
    await page.click('[data-testid="quality-high"]');

    // Change resolution
    await page.selectOption('[data-testid="resolution-select"]', '720p');

    // Toggle auto-download
    await page.click('[data-testid="auto-download"]');

    // Verify settings were updated
    const settings = await page.evaluate(() => {
      const store = window.__testMode.getQueueStatus();
      return store;
    });

    // Settings should be reflected in the UI
    await expect(page.locator('[data-testid="quality-high"]')).toHaveClass(/bg-blue-500/);
  });

  test('should handle file removal from queue', async ({ page }) => {
    // Inject files
    await page.evaluate(() => {
      window.__testMode.injectFiles([
        { name: 'test1.mp4', size: 1048576, type: 'video/mp4' },
        { name: 'test2.mov', size: 2097152, type: 'video/quicktime' },
      ]);
    });

    // Wait for files to appear
    await expect(page.locator('[data-testid^="queue-item-"]')).toHaveCount(2);

    // Get the ID of the first item
    const firstItemId = await page.locator('[data-testid^="queue-item-"]').first().getAttribute('data-testid');
    const itemId = firstItemId?.replace('queue-item-', '');

    // Remove first file
    if (itemId) {
      await page.click(`[data-testid="remove-${itemId}"]`);
    }

    // Check that only one file remains
    await expect(page.locator('[data-testid^="queue-item-"]')).toHaveCount(1);
    await expect(page.locator('text=test1.mp4')).not.toBeVisible();
    await expect(page.locator('text=test2.mov')).toBeVisible();
  });

  test('should start and simulate conversion progress', async ({ page }) => {
    // Inject a test file
    await page.evaluate(() => {
      window.__testMode.injectFiles([
        { name: 'test.mp4', size: 1048576, type: 'video/mp4' },
      ]);
    });

    // Start processing
    await page.click('[data-testid="start-processing"]');

    // Verify processing state
    const processingState = await page.evaluate(() => {
      return window.__testMode.getQueueStatus();
    });

    expect(processingState.isProcessing).toBe(true);

    // Check for processing status indicator
    await expect(page.locator('text=/Processing/')).toBeVisible();
  });

  test('should handle pause and resume', async ({ page }) => {
    // Inject files
    await page.evaluate(() => {
      window.__testMode.injectFiles([
        { name: 'test1.mp4', size: 1048576, type: 'video/mp4' },
        { name: 'test2.mp4', size: 1048576, type: 'video/mp4' },
      ]);
    });

    // Start processing
    await page.click('[data-testid="start-processing"]');

    // Wait for pause button to appear
    await page.waitForSelector('[data-testid="pause-processing"]');

    // Pause
    await page.click('[data-testid="pause-processing"]');

    // Verify paused state
    const pausedState = await page.evaluate(() => {
      return window.__testMode.getQueueStatus();
    });
    expect(pausedState.isPaused).toBe(true);

    // Resume button should be visible
    await expect(page.locator('[data-testid="resume-processing"]')).toBeVisible();

    // Resume
    await page.click('[data-testid="resume-processing"]');

    // Verify resumed state
    const resumedState = await page.evaluate(() => {
      return window.__testMode.getQueueStatus();
    });
    expect(resumedState.isPaused).toBe(false);
  });

  test('should simulate error and allow retry', async ({ page }) => {
    // Inject a file
    await page.evaluate(() => {
      window.__testMode.injectFiles([
        { name: 'test.mp4', size: 1048576, type: 'video/mp4' },
      ]);
    });

    // Simulate conversion error
    await page.evaluate(() => {
      const firstItem = window.__testMode.getQueueStatus().queue[0];
      if (firstItem) {
        window.__testMode.triggerAction('updateStatus', {
          id: firstItem.id,
          status: 'failed',
          error: 'Test error'
        });
      }
    });

    // Check for error display
    await expect(page.locator('text=Test error')).toBeVisible();

    // Retry button should be visible
    const firstItemId = await page.locator('[data-testid^="queue-item-"]').first().getAttribute('data-testid');
    const itemId = firstItemId?.replace('queue-item-', '');

    if (itemId) {
      await expect(page.locator(`[data-testid="retry-${itemId}"]`)).toBeVisible();
    }
  });

  test('should handle batch operations', async ({ page }) => {
    // Inject multiple files
    await page.evaluate(() => {
      window.__testMode.injectFiles([
        { name: 'video1.mp4', size: 1048576, type: 'video/mp4' },
        { name: 'video2.mov', size: 2097152, type: 'video/quicktime' },
        { name: 'video3.webm', size: 1572864, type: 'video/webm' },
      ]);
    });

    // Verify all files in queue
    await expect(page.locator('[data-testid^="queue-item-"]')).toHaveCount(3);

    // Clear queue
    await page.click('text=Clear All');

    // Verify queue is empty
    await expect(page.locator('[data-testid^="queue-item-"]')).toHaveCount(0);
    await expect(page.locator('text=No files yet')).toBeVisible();
  });

  test('should respect file size limits', async ({ page }) => {
    // Try to inject a file that exceeds size limit (using a smaller buffer but large size property)
    await page.evaluate(() => {
      // Create a mock file with small content but large size property
      const mockFile = new File([new ArrayBuffer(1024)], 'huge-file.mp4', {
        type: 'video/mp4',
      });
      // Override the size property
      Object.defineProperty(mockFile, 'size', { value: 3 * 1024 * 1024 * 1024 });

      const store = window.useConverterStore.getState();
      store.addFiles([mockFile]);
    });

    // File should not be added to queue (size limit exceeded)
    await expect(page.locator('[data-testid^="queue-item-"]')).toHaveCount(0);
  });

  test('should respect queue size limit', async ({ page }) => {
    // Try to inject more than 10 files
    const files = Array.from({ length: 12 }, (_, i) => ({
      name: `video${i + 1}.mp4`,
      size: 1048576,
      type: 'video/mp4',
    }));

    await page.evaluate((files) => {
      window.__testMode.injectFiles(files);
    }, files);

    // Only 10 files should be in queue
    await expect(page.locator('[data-testid^="queue-item-"]')).toHaveCount(10);
  });

  test('should handle completed files', async ({ page }) => {
    // Inject and mark a file as completed
    await page.evaluate(() => {
      window.__testMode.injectFiles([
        { name: 'test.mp4', size: 1048576, type: 'video/mp4' },
      ]);

      // Simulate completion
      const firstItem = window.__testMode.getQueueStatus().queue[0];
      if (firstItem) {
        // Create a mock blob
        const mockBlob = new Blob([new ArrayBuffer(900000)], { type: 'video/mp4' });

        // Get the store and complete the file
        const store = (window as any).useConverterStore?.getState();
        if (store) {
          store.completeFile(firstItem.id, mockBlob, 900000);
        }
      }
    });

    // Check completed section
    await expect(page.locator('[data-testid="completed-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="download-all"]')).toBeVisible();
    await expect(page.locator('[data-testid^="download-"]')).toHaveCount(2); // download-all + individual download
  });

  test('should toggle settings panel collapse', async ({ page }) => {
    // Click to collapse settings
    await page.click('text=Hide ∧');

    // Check collapsed state
    await expect(page.locator('text=Show ∨')).toBeVisible();

    // Settings content should not be visible
    await expect(page.locator('text=Quality:')).not.toBeVisible();

    // Expand again
    await page.click('text=Show ∨');

    // Settings content should be visible
    await expect(page.locator('text=Quality:')).toBeVisible();
  });

  test('should show per-file settings dialog', async ({ page }) => {
    // Inject a file
    await page.evaluate(() => {
      window.__testMode.injectFiles([
        { name: 'test.mp4', size: 1048576, type: 'video/mp4' },
      ]);
    });

    // Get the item ID
    const firstItemId = await page.locator('[data-testid^="queue-item-"]').first().getAttribute('data-testid');
    const itemId = firstItemId?.replace('queue-item-', '');

    // Click settings button
    if (itemId) {
      await page.click(`[data-testid="settings-${itemId}"]`);
    }

    // Settings dialog should appear
    await expect(page.locator('text=Settings for: test.mp4')).toBeVisible();
    await expect(page.locator('text=Use custom settings for this file')).toBeVisible();

    // Close dialog
    await page.click('text=Cancel');

    // Dialog should be closed
    await expect(page.locator('text=Settings for: test.mp4')).not.toBeVisible();
  });
});

test.describe('Browser Compatibility', () => {
  test('should check for WebCodecs support', async ({ page }) => {
    await page.goto('/');

    // Check if compatibility was tested
    const supportChecked = await page.evaluate(() => {
      return typeof (window as any).VideoEncoder !== 'undefined' ||
             typeof (window as any).AudioEncoder !== 'undefined';
    });

    // If not supported, should show compatibility message
    if (!supportChecked) {
      await expect(page.locator('text=/Browser Compatibility/')).toBeVisible();
    } else {
      // Otherwise, main interface should be visible
      await expect(page.locator('[data-testid="drop-zone"]')).toBeVisible();
    }
  });
});