import { test, expect } from '@playwright/test';
import { readFile } from 'fs/promises';
import { join } from 'path';

test.describe('Real Video Conversion', () => {
  test.setTimeout(120000); // 2 minutes for real conversions

  test('should convert real MP4 file and produce non-empty output', async ({ page }) => {
    console.log('Starting real MP4 conversion test...');

    // Read the real video file
    const videoPath = join(process.cwd(), 'public', '1.mp4');
    const videoBuffer = await readFile(videoPath);
    console.log(`Input video size: ${videoBuffer.length} bytes`);

    // Navigate to the converter
    await page.goto('http://localhost:3001');

    // Wait for page to load
    await page.waitForSelector('text=Media Converter', { timeout: 5000 });

    // Inject the file directly into the page context
    await page.evaluate((videoData) => {
      // Create a File object from the buffer
      const blob = new Blob([new Uint8Array(videoData)], { type: 'video/mp4' });
      const file = new File([blob], '1.mp4', { type: 'video/mp4' });

      // Store it globally for access
      (window as any).testFile = file;
      console.log('Test file created:', file.size, 'bytes');
    }, Array.from(videoBuffer));

    // Programmatically trigger file selection
    await page.evaluate(() => {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = (window as any).testFile;

      // Create a fake FileList
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;

      // Trigger change event
      const event = new Event('change', { bubbles: true });
      fileInput.dispatchEvent(event);
    });

    // Wait for file to be selected
    await page.waitForSelector('text=1.mp4', { timeout: 5000 });
    console.log('File selected successfully');

    // Disable streaming mode to use buffer mode (more reliable for testing)
    const streamCheckbox = await page.locator('input[type="checkbox"][id="streaming"]');
    if (await streamCheckbox.count() > 0 && await streamCheckbox.isChecked()) {
      await streamCheckbox.click();
      console.log('Disabled streaming mode');
    }

    // Set up download handler to capture the output
    let downloadedSize = 0;
    let downloadedBuffer: Buffer | null = null;

    const downloadPromise = page.waitForEvent('download');

    // Click convert button
    const convertButton = await page.locator('button:has-text("Convert to MP4")');
    await convertButton.click();
    console.log('Conversion started...');

    // Wait for conversion to complete (look for success message or download)
    const result = await Promise.race([
      page.waitForSelector('text=/Conversion complete|File saved successfully/', { timeout: 60000 }),
      page.waitForSelector('text=/error|failed/i', { timeout: 60000 }),
      downloadPromise
    ]);

    // Check if we got a download
    if ('suggestedFilename' in result) {
      // It's a download event
      const download = result;
      console.log('Download triggered:', download.suggestedFilename());

      // Save the download and get its size
      const path = await download.path();
      if (path) {
        downloadedBuffer = await readFile(path);
        downloadedSize = downloadedBuffer.length;
        console.log(`Downloaded file size: ${downloadedSize} bytes`);
      }
    } else {
      // Check for error
      const errorCount = await page.locator('text=/error|failed/i').count();
      if (errorCount > 0) {
        const errorText = await page.locator('text=/error|failed/i').first().textContent();
        throw new Error(`Conversion failed: ${errorText}`);
      }
    }

    // Validate the output
    expect(downloadedSize, 'Output file should not be empty').toBeGreaterThan(1000); // At least 1KB
    expect(downloadedSize, 'Output file should be smaller than 10x input').toBeLessThan(videoBuffer.length * 10);

    console.log(`✓ Conversion successful: ${videoBuffer.length} bytes → ${downloadedSize} bytes`);
  });

  test('should convert real MOV file and produce valid output', async ({ page }) => {
    console.log('Starting real MOV conversion test...');

    // Read the real video file
    const videoPath = join(process.cwd(), 'public', '2.mov');
    const videoBuffer = await readFile(videoPath);
    console.log(`Input video size: ${videoBuffer.length} bytes`);

    // Navigate to the converter
    await page.goto('http://localhost:3001');

    // Wait for page to load
    await page.waitForSelector('text=Media Converter', { timeout: 5000 });

    // Inject the file directly
    await page.evaluate((videoData) => {
      const blob = new Blob([new Uint8Array(videoData)], { type: 'video/quicktime' });
      const file = new File([blob], '2.mov', { type: 'video/quicktime' });
      (window as any).testFile = file;
      console.log('Test file created:', file.size, 'bytes');
    }, Array.from(videoBuffer));

    // Trigger file selection
    await page.evaluate(() => {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = (window as any).testFile;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
      const event = new Event('change', { bubbles: true });
      fileInput.dispatchEvent(event);
    });

    // Wait for file to be selected
    await page.waitForSelector('text=2.mov', { timeout: 5000 });
    console.log('File selected successfully');

    // Disable streaming mode
    const streamCheckbox = await page.locator('input[type="checkbox"][id="streaming"]');
    if (await streamCheckbox.count() > 0 && await streamCheckbox.isChecked()) {
      await streamCheckbox.click();
      console.log('Disabled streaming mode');
    }

    // Set up console logging to capture conversion details
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Page error:', msg.text());
      }
    });

    // Set up download handler
    const downloadPromise = page.waitForEvent('download');

    // Start conversion
    const convertButton = await page.locator('button:has-text("Convert to MP4")');
    await convertButton.click();
    console.log('Conversion started...');

    // Monitor progress
    let lastProgress = 0;
    const progressChecker = setInterval(async () => {
      const progressElements = await page.locator('[role="progressbar"], .text-blue-600').all();
      for (const el of progressElements) {
        const text = await el.textContent().catch(() => '');
        if (text && text.includes('%')) {
          const progress = parseInt(text);
          if (progress > lastProgress) {
            lastProgress = progress;
            console.log(`Progress: ${progress}%`);
          }
        }
      }
    }, 1000);

    // Wait for completion
    let downloadedSize = 0;

    try {
      const result = await Promise.race([
        downloadPromise,
        page.waitForSelector('text=/Conversion complete|File saved successfully/', { timeout: 90000 }),
        page.waitForSelector('text=/error|failed/i', { timeout: 90000 })
      ]);

      clearInterval(progressChecker);

      if ('suggestedFilename' in result) {
        const download = result;
        console.log('Download triggered:', download.suggestedFilename());

        const path = await download.path();
        if (path) {
          const downloadedBuffer = await readFile(path);
          downloadedSize = downloadedBuffer.length;
          console.log(`Downloaded file size: ${downloadedSize} bytes`);

          // Validate it's a valid MP4 (check for MP4 signature)
          const signature = downloadedBuffer.slice(4, 12).toString('ascii');
          expect(signature).toContain('ftyp'); // MP4 files have 'ftyp' box
          console.log('✓ Valid MP4 signature detected');
        }
      } else {
        // Check for error
        const errorCount = await page.locator('text=/error|failed/i').count();
        if (errorCount > 0) {
          const errorText = await page.locator('text=/error|failed/i').first().textContent();

          // Take a screenshot for debugging
          await page.screenshot({ path: 'conversion-error.png' });

          throw new Error(`Conversion failed: ${errorText}`);
        }
      }
    } finally {
      clearInterval(progressChecker);
    }

    // Validate the output
    expect(downloadedSize, 'Output file should not be empty').toBeGreaterThan(10000); // At least 10KB
    expect(downloadedSize, 'Output should be reasonable size').toBeLessThan(videoBuffer.length * 2);

    const compressionRatio = ((1 - downloadedSize / videoBuffer.length) * 100).toFixed(1);
    console.log(`✓ Conversion successful: ${videoBuffer.length} bytes → ${downloadedSize} bytes (${compressionRatio}% compression)`);
  });

  test('should handle progress updates correctly', async ({ page }) => {
    console.log('Testing progress updates...');

    // Use smaller MP4 for faster test
    const videoPath = join(process.cwd(), 'public', '1.mp4');
    const videoBuffer = await readFile(videoPath);

    await page.goto('http://localhost:3001');
    await page.waitForSelector('text=Media Converter', { timeout: 5000 });

    // Inject file
    await page.evaluate((videoData) => {
      const blob = new Blob([new Uint8Array(videoData)], { type: 'video/mp4' });
      const file = new File([blob], 'progress-test.mp4', { type: 'video/mp4' });
      (window as any).testFile = file;
    }, Array.from(videoBuffer));

    // Select file
    await page.evaluate(() => {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = (window as any).testFile;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await page.waitForSelector('text=progress-test.mp4', { timeout: 5000 });

    // Disable streaming
    const streamCheckbox = await page.locator('input[type="checkbox"][id="streaming"]');
    if (await streamCheckbox.count() > 0 && await streamCheckbox.isChecked()) {
      await streamCheckbox.click();
    }

    // Start conversion
    await page.locator('button:has-text("Convert to MP4")').click();

    // Collect progress updates
    const progressUpdates: number[] = [];
    let conversionComplete = false;

    while (!conversionComplete) {
      await page.waitForTimeout(500);

      // Check for completion
      const completeCount = await page.locator('text=/Conversion complete|File saved|error|failed/i').count();
      if (completeCount > 0) {
        conversionComplete = true;
        break;
      }

      // Get progress
      const progressBar = await page.locator('.bg-blue-600').first();
      if (await progressBar.count() > 0) {
        const style = await progressBar.getAttribute('style');
        if (style && style.includes('width')) {
          const match = style.match(/width:\s*(\d+)%/);
          if (match) {
            const progress = parseInt(match[1]);
            if (!progressUpdates.includes(progress)) {
              progressUpdates.push(progress);
              console.log(`Progress: ${progress}%`);
            }
          }
        }
      }
    }

    // Validate progress updates
    expect(progressUpdates.length, 'Should have multiple progress updates').toBeGreaterThan(0);
    expect(Math.max(...progressUpdates), 'Progress should reach high percentage').toBeGreaterThanOrEqual(90);

    console.log(`✓ Progress updates received: ${progressUpdates.join(', ')}%`);
  });
});