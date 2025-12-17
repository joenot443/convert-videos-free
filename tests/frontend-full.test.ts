import { test, expect, Page, Download } from '@playwright/test';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Ensure test output directory exists
const TEST_OUTPUT_DIR = join(process.cwd(), 'test-outputs');
if (!existsSync(TEST_OUTPUT_DIR)) {
  mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
}

test.describe('Frontend Media Converter - Full Test Suite', () => {
  test.setTimeout(180000); // 3 minutes for all tests

  let testResults: {
    test: string;
    input: string;
    inputSize: number;
    outputSize: number;
    status: 'success' | 'error';
    error?: string;
    duration?: number;
  }[] = [];

  async function captureConsoleLogs(page: Page) {
    const logs: string[] = [];

    page.on('console', msg => {
      const text = msg.text();
      logs.push(`[${msg.type()}] ${text}`);

      // Print important messages
      if (msg.type() === 'error' || text.includes('error') || text.includes('Error')) {
        console.error('PAGE ERROR:', text);
      } else if (text.includes('Worker ready') || text.includes('Encoder capabilities')) {
        console.log('INFO:', text);
      }
    });

    page.on('pageerror', error => {
      logs.push(`[pageerror] ${error.message}`);
      console.error('PAGE CRASH:', error);
    });

    return logs;
  }

  async function testVideoConversion(
    page: Page,
    videoFile: string,
    testName: string,
    options: {
      preset?: 'low' | 'medium' | 'high';
      expectError?: boolean;
      errorMessage?: string;
    } = {}
  ): Promise<void> {
    const startTime = Date.now();
    const logs = await captureConsoleLogs(page);

    try {
      console.log(`\n=== Testing: ${testName} ===`);
      console.log(`Input file: ${videoFile}`);

      // Read the video file
      const videoPath = join(process.cwd(), 'public', videoFile);
      if (!existsSync(videoPath)) {
        throw new Error(`Test video not found: ${videoPath}`);
      }

      const videoBuffer = await readFile(videoPath);
      console.log(`Input size: ${(videoBuffer.length / 1024).toFixed(1)} KB`);

      // Navigate to the converter
      await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });

      // Verify page loaded
      const title = await page.locator('h1:has-text("Media Converter")').count();
      expect(title, 'Media Converter title should be visible').toBe(1);

      // Inject the file
      await page.evaluate((data) => {
        const { buffer, name, type } = data;
        const blob = new Blob([new Uint8Array(buffer)], { type });
        const file = new File([blob], name, { type });
        (window as any).testFile = file;
        console.log(`File injected: ${name} (${file.size} bytes)`);
      }, {
        buffer: Array.from(videoBuffer),
        name: videoFile,
        type: videoFile.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'
      });

      // Trigger file selection
      await page.evaluate(() => {
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (!fileInput) throw new Error('File input not found');

        const file = (window as any).testFile;
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      });

      // Wait for file name to appear
      await page.waitForSelector(`text=${videoFile}`, { timeout: 5000 });
      console.log('File selected successfully');

      // Set quality preset if specified
      if (options.preset) {
        const select = await page.locator('select').first();
        await select.selectOption(options.preset);
        console.log(`Quality preset: ${options.preset}`);
      }

      // Disable streaming mode for consistent testing
      const streamCheckbox = await page.locator('input[type="checkbox"][id="streaming"]');
      if (await streamCheckbox.count() > 0 && await streamCheckbox.isChecked()) {
        await streamCheckbox.click();
        console.log('Streaming mode disabled');
      }

      // Set up download handler BEFORE clicking convert
      let downloadedBuffer: Buffer | null = null;
      let downloadError: string | null = null;

      const downloadPromise = new Promise<Download | null>((resolve) => {
        page.once('download', download => resolve(download));
        // Timeout after 60 seconds
        setTimeout(() => resolve(null), 60000);
      });

      // Click convert button
      const convertButton = await page.locator('button:has-text("Convert to MP4")');
      await convertButton.click();
      console.log('Conversion started...');

      // Monitor for errors or completion
      let conversionComplete = false;
      let errorDetected = false;
      let progressUpdates = 0;
      let lastProgress = -1;

      // Poll for status
      while (!conversionComplete && (Date.now() - startTime) < 120000) {
        await page.waitForTimeout(500);

        // Check for error messages
        const errorElements = await page.locator('.text-red-600, .bg-red-50').all();
        for (const element of errorElements) {
          const text = await element.textContent().catch(() => '');
          if (text && text.length > 0) {
            console.error(`Error detected: ${text}`);
            errorDetected = true;
            downloadError = text;
            conversionComplete = true;
            break;
          }
        }

        // Check for success
        const successCount = await page.locator('text=/Conversion complete|File saved successfully/').count();
        if (successCount > 0) {
          console.log('Conversion completed successfully');
          conversionComplete = true;
        }

        // Check progress
        const progressBar = await page.locator('.bg-blue-600').first();
        if (await progressBar.count() > 0) {
          const style = await progressBar.getAttribute('style');
          if (style && style.includes('width')) {
            const match = style.match(/width:\s*(\d+)%/);
            if (match) {
              const progress = parseInt(match[1]);
              if (progress !== lastProgress) {
                lastProgress = progress;
                progressUpdates++;
                if (progress % 25 === 0 || progress === 100) {
                  console.log(`Progress: ${progress}%`);
                }
              }
            }
          }
        }

        // Also check the download promise
        if (!downloadedBuffer) {
          const download = await Promise.race([
            downloadPromise,
            new Promise<null>(resolve => setTimeout(() => resolve(null), 0))
          ]);

          if (download) {
            console.log('Download started:', download.suggestedFilename());
            const path = await download.path();
            if (path) {
              downloadedBuffer = await readFile(path);
              console.log(`Downloaded: ${(downloadedBuffer.length / 1024).toFixed(1)} KB`);
            }
          }
        }
      }

      // Wait a bit more for download if needed
      if (!downloadedBuffer && !errorDetected) {
        const download = await downloadPromise;
        if (download) {
          const path = await download.path();
          if (path) {
            downloadedBuffer = await readFile(path);
            console.log(`Downloaded (delayed): ${(downloadedBuffer.length / 1024).toFixed(1)} KB`);
          }
        }
      }

      // Take screenshot for debugging
      const screenshotPath = join(TEST_OUTPUT_DIR, `${testName.replace(/\s+/g, '-')}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      // Save logs
      const logsPath = join(TEST_OUTPUT_DIR, `${testName.replace(/\s+/g, '-')}.log`);
      await writeFile(logsPath, logs.join('\n'));

      // Analyze results
      const duration = Date.now() - startTime;

      if (options.expectError) {
        // We expect an error
        expect(errorDetected, 'Error should be detected').toBe(true);
        if (options.errorMessage) {
          expect(downloadError).toContain(options.errorMessage);
        }
        console.log(`✓ Expected error detected: ${downloadError}`);

        testResults.push({
          test: testName,
          input: videoFile,
          inputSize: videoBuffer.length,
          outputSize: 0,
          status: 'error',
          error: downloadError || 'Unknown error',
          duration
        });
      } else {
        // We expect success
        if (errorDetected) {
          throw new Error(`Unexpected error: ${downloadError}`);
        }

        expect(downloadedBuffer, 'Should have downloaded file').not.toBeNull();
        expect(downloadedBuffer!.length, 'Downloaded file should not be empty').toBeGreaterThan(1000);

        // Validate MP4 structure
        if (downloadedBuffer) {
          const signature = downloadedBuffer.slice(4, 12).toString('ascii');
          expect(signature).toContain('ftyp');
          console.log(`✓ Valid MP4 signature: ${signature}`);

          // Save output for inspection
          const outputPath = join(TEST_OUTPUT_DIR, `${testName.replace(/\s+/g, '-')}-output.mp4`);
          await writeFile(outputPath, downloadedBuffer);
          console.log(`Output saved to: ${outputPath}`);

          testResults.push({
            test: testName,
            input: videoFile,
            inputSize: videoBuffer.length,
            outputSize: downloadedBuffer.length,
            status: 'success',
            duration
          });
        }

        console.log(`✓ Conversion successful in ${(duration / 1000).toFixed(1)}s`);
        console.log(`  Input: ${(videoBuffer.length / 1024).toFixed(1)} KB`);
        console.log(`  Output: ${downloadedBuffer ? (downloadedBuffer.length / 1024).toFixed(1) : 0} KB`);
        console.log(`  Progress updates: ${progressUpdates}`);
      }

    } catch (error) {
      console.error(`✗ Test failed: ${error}`);

      // Save error screenshot
      const errorScreenshotPath = join(TEST_OUTPUT_DIR, `${testName.replace(/\s+/g, '-')}-error.png`);
      await page.screenshot({ path: errorScreenshotPath, fullPage: true });

      testResults.push({
        test: testName,
        input: videoFile,
        inputSize: 0,
        outputSize: 0,
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime
      });

      throw error;
    }
  }

  test('Convert MP4 with Low Quality', async ({ page }) => {
    await testVideoConversion(page, '1.mp4', 'MP4 Low Quality', { preset: 'low' });
  });

  test('Convert MP4 with Medium Quality', async ({ page }) => {
    await testVideoConversion(page, '1.mp4', 'MP4 Medium Quality', { preset: 'medium' });
  });

  test('Convert MP4 with High Quality', async ({ page }) => {
    await testVideoConversion(page, '1.mp4', 'MP4 High Quality', { preset: 'high' });
  });

  test('Convert MOV with Low Quality', async ({ page }) => {
    await testVideoConversion(page, '2.mov', 'MOV Low Quality', { preset: 'low' });
  });

  test('Convert MOV with Medium Quality', async ({ page }) => {
    await testVideoConversion(page, '2.mov', 'MOV Medium Quality', { preset: 'medium' });
  });

  test('Convert MOV with High Quality', async ({ page }) => {
    await testVideoConversion(page, '2.mov', 'MOV High Quality', { preset: 'high' });
  });

  test('Cancel conversion mid-process', async ({ page }) => {
    console.log('\n=== Testing: Cancellation ===');

    const videoPath = join(process.cwd(), 'public', '2.mov'); // Use larger file
    const videoBuffer = await readFile(videoPath);

    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });

    // Inject file
    await page.evaluate((data) => {
      const blob = new Blob([new Uint8Array(data)], { type: 'video/quicktime' });
      const file = new File([blob], '2.mov', { type: 'video/quicktime' });
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

    await page.waitForSelector('text=2.mov', { timeout: 5000 });

    // Start conversion
    await page.locator('button:has-text("Convert to MP4")').click();

    // Wait for progress to start
    await page.waitForTimeout(1000);

    // Click cancel
    const cancelButton = await page.locator('button:has-text("Cancel")');
    if (await cancelButton.count() > 0) {
      await cancelButton.click();
      console.log('Clicked cancel button');

      // Verify cancellation
      await page.waitForTimeout(1000);
      const errorText = await page.locator('.text-red-600').first().textContent().catch(() => '');
      expect(errorText).toContain('canceled');
      console.log('✓ Cancellation confirmed');
    } else {
      console.log('⚠ No cancel button found (conversion may be too fast)');
    }
  });

  test.afterAll(async () => {
    console.log('\n=== TEST RESULTS SUMMARY ===');
    console.log(`Total tests: ${testResults.length}`);
    console.log(`Successful: ${testResults.filter(r => r.status === 'success').length}`);
    console.log(`Failed: ${testResults.filter(r => r.status === 'error').length}`);

    console.log('\nDetailed Results:');
    for (const result of testResults) {
      const status = result.status === 'success' ? '✓' : '✗';
      console.log(`${status} ${result.test}:`);
      console.log(`  Input: ${result.input} (${(result.inputSize / 1024).toFixed(1)} KB)`);
      if (result.status === 'success') {
        console.log(`  Output: ${(result.outputSize / 1024).toFixed(1)} KB`);
        console.log(`  Ratio: ${((result.outputSize / result.inputSize) * 100).toFixed(1)}%`);
      } else {
        console.log(`  Error: ${result.error}`);
      }
      console.log(`  Duration: ${(result.duration! / 1000).toFixed(1)}s`);
    }

    // Save summary
    const summaryPath = join(TEST_OUTPUT_DIR, 'test-summary.json');
    await writeFile(summaryPath, JSON.stringify(testResults, null, 2));
    console.log(`\nTest summary saved to: ${summaryPath}`);
  });
});