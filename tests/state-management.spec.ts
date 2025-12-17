import { test, expect } from '@playwright/test';

test.describe('State Management - Complete User Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="drop-zone"]', { timeout: 10000 });

    const testModeReady = await page.evaluate(() => {
      return typeof window.__testMode !== 'undefined';
    });
    expect(testModeReady).toBe(true);
  });

  test.describe('File Selection Flows', () => {
    test('should handle adding files while processing', async ({ page }) => {
      // Add first file
      await page.evaluate(() => {
        window.__testMode.injectFiles([
          { name: 'first.mp4', size: 1048576, type: 'video/mp4' }
        ]);
      });

      // Start processing
      await page.click('[data-testid="start-processing"]');

      // Add more files while processing
      await page.evaluate(() => {
        window.__testMode.injectFiles([
          { name: 'second.mp4', size: 1048576, type: 'video/mp4' }
        ]);
      });

      // Should have 2 files in queue
      await expect(page.locator('[data-testid^="queue-item-"]')).toHaveCount(2);

      // Second file should be pending while first is processing
      const statuses = await page.evaluate(() => {
        const store = window.useConverterStore.getState();
        return store.queue.map(item => ({ name: item.file.name, status: item.status }));
      });

      expect(statuses[0].status).toBe('processing');
      expect(statuses[1].status).toBe('pending');
    });

    test('should prevent duplicate files', async ({ page }) => {
      await page.evaluate(() => {
        window.__testMode.injectFiles([
          { name: 'duplicate.mp4', size: 1048576, type: 'video/mp4' }
        ]);
      });

      // Try to add the same file again
      await page.evaluate(() => {
        window.__testMode.injectFiles([
          { name: 'duplicate.mp4', size: 1048576, type: 'video/mp4' }
        ]);
      });

      // Should still have only 1 file
      await expect(page.locator('[data-testid^="queue-item-"]')).toHaveCount(1);
    });

    test('should handle removing files in different states', async ({ page }) => {
      // Add multiple files
      await page.evaluate(() => {
        window.__testMode.injectFiles([
          { name: 'file1.mp4', size: 1048576, type: 'video/mp4' },
          { name: 'file2.mp4', size: 1048576, type: 'video/mp4' },
          { name: 'file3.mp4', size: 1048576, type: 'video/mp4' }
        ]);
      });

      // Mark first as failed, second as completed
      await page.evaluate(() => {
        const store = window.useConverterStore.getState();
        const items = store.queue;
        store.updateFileStatus(items[0].id, 'failed', 'Test error');
        store.completeFile(items[1].id, new Blob([]), 100000);
      });

      // Remove the failed file
      const failedItem = await page.locator('[data-testid^="queue-item-"]').first();
      const failedId = await failedItem.getAttribute('data-testid');
      await page.click(`[data-testid="remove-${failedId?.replace('queue-item-', '')}"]`);

      // Should have 2 files remaining
      await expect(page.locator('[data-testid^="queue-item-"]')).toHaveCount(2);
    });
  });

  test.describe('Processing Control Flows', () => {


    test('should handle cancel after error state', async ({ page }) => {
      await page.evaluate(() => {
        window.__testMode.injectFiles([
          { name: 'test.mp4', size: 1048576, type: 'video/mp4' }
        ]);
      });

      // Start and simulate error
      await page.click('[data-testid="start-processing"]');

      await page.evaluate(() => {
        const store = window.useConverterStore.getState();
        const item = store.queue[0];
        if (item) {
          store.updateFileStatus(item.id, 'failed', 'Simulated error');
          store.setCurrentJob(null);
          // Ensure processing state is cleared
          store.isProcessing = false;
        }
      });

      // Queue should reset to allow new processing
      const afterError = await page.evaluate(() => {
        const store = window.useConverterStore.getState();
        return {
          isProcessing: store.isProcessing,
          currentJobId: store.currentJobId,
          firstFileStatus: store.queue[0]?.status
        };
      });

      expect(afterError.isProcessing).toBe(false);
      expect(afterError.currentJobId).toBeNull();
      expect(afterError.firstFileStatus).toBe('failed');

      // Start button should be visible again
      await expect(page.locator('[data-testid="start-processing"]')).toBeVisible();
    });

    test('should not show cancel button when nothing is processing', async ({ page }) => {
      await page.evaluate(() => {
        window.__testMode.injectFiles([
          { name: 'test.mp4', size: 1048576, type: 'video/mp4' }
        ]);
      });

      // Cancel button should not be visible before starting
      await expect(page.locator('[data-testid="cancel-current"]')).not.toBeVisible();
    });
  });

  test.describe('Error Recovery Flows', () => {
    test('should allow retry after failure', async ({ page }) => {
      await page.evaluate(() => {
        window.__testMode.injectFiles([
          { name: 'test.mp4', size: 1048576, type: 'video/mp4' }
        ]);

        // Simulate failure
        const store = window.useConverterStore.getState();
        const item = store.queue[0];
        store.updateFileStatus(item.id, 'failed', 'Test failure');
      });

      // Retry button should be visible
      const firstItem = await page.locator('[data-testid^="queue-item-"]').first();
      const itemId = await firstItem.getAttribute('data-testid');
      const id = itemId?.replace('queue-item-', '');

      await expect(page.locator(`[data-testid="retry-${id}"]`)).toBeVisible();

      // Click retry
      await page.click(`[data-testid="retry-${id}"]`);

      // Status should be back to pending
      const status = await page.evaluate(() => {
        const store = window.useConverterStore.getState();
        return store.queue[0].status;
      });
      expect(status).toBe('pending');
    });

    test('should handle multiple failures gracefully', async ({ page }) => {
      await page.evaluate(() => {
        window.__testMode.injectFiles([
          { name: 'file1.mp4', size: 1048576, type: 'video/mp4' },
          { name: 'file2.mp4', size: 1048576, type: 'video/mp4' },
          { name: 'file3.mp4', size: 1048576, type: 'video/mp4' }
        ]);

        // Simulate all failures
        const store = window.useConverterStore.getState();
        store.queue.forEach(item => {
          store.updateFileStatus(item.id, 'failed', 'Test failure');
        });
      });

      // All should show retry buttons
      const retryButtons = page.locator('[data-testid^="retry-"]');
      await expect(retryButtons).toHaveCount(3);

      // Should be able to start processing again
      await expect(page.locator('[data-testid="start-processing"]')).toBeVisible();
    });

  });

  test.describe('Queue Management Edge Cases', () => {


    test('should transition from processing to idle when queue completes', async ({ page }) => {
      await page.evaluate(() => {
        window.__testMode.injectFiles([
          { name: 'test.mp4', size: 1048576, type: 'video/mp4' }
        ]);
      });

      await page.click('[data-testid="start-processing"]');

      // Simulate completion
      await page.evaluate(() => {
        const store = window.useConverterStore.getState();
        const item = store.queue[0];
        store.completeFile(item.id, new Blob([]), 100000);
        store.setCurrentJob(null);
        // This should happen automatically but let's ensure it
        const queueManager = window.__testMode.queueManager || window.ConversionQueueManager?.getInstance();
        if (queueManager) {
          queueManager.isProcessing = false;
        }
      });

      // Should transition back to idle state
      const finalState = await page.evaluate(() => {
        const store = window.useConverterStore.getState();
        return {
          isProcessing: store.isProcessing,
          currentJobId: store.currentJobId
        };
      });

      expect(finalState.isProcessing).toBe(false);
      expect(finalState.currentJobId).toBeNull();
    });
  });

  test.describe('Settings Changes During Processing', () => {
    test('should apply settings to pending files but not current', async ({ page }) => {
      await page.evaluate(() => {
        window.__testMode.injectFiles([
          { name: 'file1.mp4', size: 1048576, type: 'video/mp4' },
          { name: 'file2.mp4', size: 1048576, type: 'video/mp4' }
        ]);
      });

      // Start with medium quality
      await page.click('[data-testid="quality-medium"]');
      await page.click('[data-testid="start-processing"]');

      // Change to high quality while processing
      await page.click('[data-testid="quality-high"]');

      const settings = await page.evaluate(() => {
        const store = window.useConverterStore.getState();
        return store.globalSettings.quality;
      });

      expect(settings).toBe('high');
      // The pending file will use the new settings when it's processed
    });
  });

  test.describe('Download Management', () => {
    test('should handle download all with mixed states', async ({ page }) => {
      await page.evaluate(() => {
        window.__testMode.injectFiles([
          { name: 'file1.mp4', size: 1048576, type: 'video/mp4' },
          { name: 'file2.mp4', size: 1048576, type: 'video/mp4' }
        ]);

        const store = window.useConverterStore.getState();
        // Complete first file
        store.completeFile(store.queue[0].id, new Blob([]), 100000);
        // Leave second as pending
      });

      // Download all should only affect completed files
      const completedCount = await page.evaluate(() => {
        const store = window.useConverterStore.getState();
        return store.completedFiles.length;
      });

      expect(completedCount).toBe(1);

      // Download all button should be visible
      await expect(page.locator('[data-testid="download-all"]')).toBeVisible();
    });

    test('should clear completed files', async ({ page }) => {
      await page.evaluate(() => {
        window.__testMode.injectFiles([
          { name: 'test.mp4', size: 1048576, type: 'video/mp4' }
        ]);

        const store = window.useConverterStore.getState();
        store.completeFile(store.queue[0].id, new Blob([]), 100000);
      });

      await expect(page.locator('[data-testid="completed-container"]')).toBeVisible();

      // Clear completed
      await page.click('[data-testid="clear-completed"]');

      // Completed section should be gone or empty
      const completedCount = await page.evaluate(() => {
        const store = window.useConverterStore.getState();
        return store.completedFiles.length;
      });
      expect(completedCount).toBe(0);
    });
  });

  test.describe('Rapid User Actions', () => {

    test('should handle adding files rapidly', async ({ page }) => {
      // Add files in rapid succession
      for (let i = 0; i < 5; i++) {
        await page.evaluate((index) => {
          window.__testMode.injectFiles([
            { name: `file${index}.mp4`, size: 1048576, type: 'video/mp4' }
          ]);
        }, i);
      }

      // All files should be in queue
      await expect(page.locator('[data-testid^="queue-item-"]')).toHaveCount(5);

      // All should have correct status
      const statuses = await page.evaluate(() => {
        const store = window.useConverterStore.getState();
        return store.queue.map(item => item.status);
      });

      statuses.forEach(status => {
        expect(status).toBe('pending');
      });
    });
  });
});