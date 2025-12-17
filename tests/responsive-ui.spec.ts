import { test, expect } from '@playwright/test';

test.describe('Responsive UI Tests', () => {
  // Test different viewport sizes
  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 14', width: 390, height: 844 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`UI should be responsive on ${name} (${width}x${height})`, async ({ page }) => {
      // Set viewport size
      await page.setViewportSize({ width, height });
      await page.goto('/', { waitUntil: 'networkidle' });

      // Check that essential elements are visible
      await expect(page.locator('h1:has-text("Media Converter")')).toBeVisible();
      await expect(page.locator('[data-testid="drop-zone"]')).toBeVisible();
      await expect(page.locator('[data-testid="settings-panel"]')).toBeVisible();
      await expect(page.locator('[data-testid="queue-container"]')).toBeVisible();

      // On mobile, check that text sizes are appropriate
      if (width < 640) {
        // Check for mobile-specific classes
        const dropZone = page.locator('[data-testid="drop-zone"]');
        const dropZoneClasses = await dropZone.getAttribute('class');
        expect(dropZoneClasses).toContain('p-8');

        // Check heading uses responsive text sizing
        const heading = page.locator('h1');
        const headingClasses = await heading.getAttribute('class');
        expect(headingClasses).toContain('text-2xl');
      } else {
        // Check for desktop-specific classes
        const heading = page.locator('h1');
        const headingClasses = await heading.getAttribute('class');
        expect(headingClasses).toContain('sm:text-3xl');
      }

      // Test settings panel collapse/expand on all sizes
      const settingsPanel = page.locator('[data-testid="settings-panel"]');
      await expect(settingsPanel).toBeVisible();

      // Click to collapse
      await page.click('[aria-label*="Hide settings"]');

      // Settings should show summary when collapsed
      await expect(page.locator('text=SETTINGS:')).toBeVisible();

      // Click to expand
      await page.click('[aria-label*="Show settings"]');

      // Settings options should be visible again
      await expect(page.locator('[data-testid="quality-low"]')).toBeVisible();
    });

    test(`File queue should display correctly on ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/', { waitUntil: 'networkidle' });

      // Wait for test mode
      await page.waitForSelector('[data-testid="drop-zone"]', { timeout: 10000 });
      const testModeReady = await page.evaluate(() => {
        return typeof window.__testMode !== 'undefined';
      });
      expect(testModeReady).toBe(true);

      // Add test files
      await page.evaluate(() => {
        window.__testMode.injectFiles([
          { name: 'test-video.mp4', size: 1048576, type: 'video/mp4' }
        ]);
      });

      // Check queue item is visible and responsive
      await expect(page.locator('[data-testid^="queue-item-"]')).toBeVisible();

      // On mobile, check for stacked layout
      if (width < 640) {
        // Check the inner flex container for responsive classes
        const queueItem = page.locator('[data-testid^="queue-item-"]').first();
        const innerContainer = queueItem.locator('.flex').first();
        const itemClasses = await innerContainer.getAttribute('class');
        expect(itemClasses).toContain('flex-col');
      }

      // Check action buttons are visible and responsive
      const startButton = page.locator('[data-testid="start-processing"]');
      await expect(startButton).toBeVisible();

      // On mobile, buttons should be smaller
      const buttonClasses = await startButton.getAttribute('class');
      if (width < 640) {
        expect(buttonClasses).toContain('text-sm');
        expect(buttonClasses).toContain('px-4');
      } else {
        expect(buttonClasses).toContain('sm:text-base');
        expect(buttonClasses).toContain('sm:px-6');
      }

      // Check that status element exists and is visible
      const firstItemId = await page.locator('[data-testid^="queue-item-"]').first().getAttribute('data-testid');
      const itemId = firstItemId?.replace('queue-item-', '');
      const statusElement = page.locator(`[data-testid="status-${itemId}"]`);
      await expect(statusElement).toBeVisible();

      // Status should show pending initially
      const statusText = await statusElement.textContent();
      expect(statusText).toContain('Pending');
    });
  });

  test('Touch interactions should work on mobile', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();

    await page.goto('/', { waitUntil: 'networkidle' });

    // Test tap on drop zone
    await page.tap('[data-testid="drop-zone"]');

    // File input should still work (though hidden)
    const fileInput = page.locator('[data-testid="file-input"]');
    await expect(fileInput).toHaveAttribute('type', 'file');

    // Test settings panel toggle with tap
    await page.tap('[data-testid="settings-panel"]');

    // Test quality button tap
    await page.tap('[data-testid="quality-medium"]');
    const selectedButton = page.locator('[data-testid="quality-medium"]');
    const buttonClasses = await selectedButton.getAttribute('class');
    expect(buttonClasses).toContain('bg-blue-500');

    await context.close();
  });

  test('Scrolling should work correctly on mobile', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();

    await page.goto('/', { waitUntil: 'networkidle' });

    // Add multiple files to create scrollable queue
    await page.evaluate(() => {
      window.__testMode.injectFiles([
        { name: 'video1.mp4', size: 1048576, type: 'video/mp4' },
        { name: 'video2.mp4', size: 1048576, type: 'video/mp4' },
        { name: 'video3.mp4', size: 1048576, type: 'video/mp4' },
        { name: 'video4.mp4', size: 1048576, type: 'video/mp4' },
        { name: 'video5.mp4', size: 1048576, type: 'video/mp4' },
      ]);
    });

    // Queue should be scrollable
    const queueContainer = page.locator('[data-testid="queue-container"] .overflow-y-auto');
    await expect(queueContainer).toBeVisible();

    // Scroll to last item
    const lastItem = page.locator('[data-testid^="queue-item-"]').last();
    await lastItem.scrollIntoViewIfNeeded();
    await expect(lastItem).toBeVisible();

    await context.close();
  });
});