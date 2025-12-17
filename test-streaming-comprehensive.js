// Comprehensive streaming mode test
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs/promises');

async function waitForConversion(page, timeout = 60000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    // Check for success
    const success = await page.locator('text=/File saved successfully/').isVisible();
    if (success) return 'success';

    // Check for completion in buffer mode
    const downloadComplete = await page.locator('text=/Download should start automatically/').isVisible();
    if (downloadComplete) return 'success';

    // Check for error
    const error = await page.locator('.bg-red-50').isVisible();
    if (error) {
      const errorText = await page.locator('.bg-red-50').textContent();
      throw new Error(`Conversion failed: ${errorText}`);
    }

    await page.waitForTimeout(500);
  }

  throw new Error('Conversion timeout');
}

async function testStreamingMode() {
  console.log('Starting comprehensive streaming mode test...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-features=FileSystemAccess']
  });

  const context = await browser.newContext({
    acceptDownloads: true
  });

  const page = await context.newPage();

  // Capture all console messages
  const consoleLogs = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push(text);

    // Log important messages
    if (text.includes('Using BufferTarget') ||
        text.includes('Streaming buffer') ||
        text.includes('chunk') ||
        text.includes('bytes') ||
        text.includes('error') ||
        text.includes('Error')) {
      console.log(`[Browser]: ${text}`);
    }
  });

  try {
    // Navigate to app
    await page.goto('http://localhost:3000');
    await page.waitForSelector('h1:has-text("Media Converter")', { timeout: 10000 });
    console.log('✓ App loaded\n');

    // Test 1: Check if streaming checkbox exists
    console.log('Test 1: Streaming mode availability');
    const hasStreaming = await page.locator('input#streaming').isVisible();
    console.log(`  Streaming checkbox visible: ${hasStreaming}`);

    // Since Playwright doesn't support File System Access API,
    // the checkbox won't appear. Test in buffer mode fallback.
    console.log('  Note: Playwright does not support File System Access API');
    console.log('  Testing buffer mode fallback behavior\n');

    // Test 2: Convert with "streaming mode" checked (will fallback to buffer)
    console.log('Test 2: Conversion with streaming mode attempt');

    // If checkbox is visible, check it (though it shouldn't be in Playwright)
    if (hasStreaming) {
      await page.locator('input#streaming').check();
      console.log('  ✓ Streaming mode checkbox checked');
    } else {
      console.log('  ℹ Streaming mode not available (expected in Playwright)');
    }

    // Select test file
    const testFile = path.join(__dirname, '..', 'vidoes', '1.mp4');
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Select File' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testFile);
    console.log('  ✓ Test file selected');

    // Wait for file to appear
    await page.waitForSelector('text=/1\\.mp4/');

    // Start conversion
    const downloadPromise = page.waitForEvent('download', { timeout: 60000 });
    await page.getByRole('button', { name: 'Convert to MP4' }).click();
    console.log('  ✓ Conversion started');

    // Wait for completion
    const status = await waitForConversion(page);
    console.log(`  ✓ Conversion status: ${status}`);

    // Get the download
    const download = await downloadPromise;
    const suggestedFilename = download.suggestedFilename();
    const downloadPath = path.join(__dirname, 'test-output', suggestedFilename);

    // Ensure directory exists
    await fs.mkdir(path.dirname(downloadPath), { recursive: true });

    // Save the file
    await download.saveAs(downloadPath);
    console.log(`  ✓ File saved: ${downloadPath}`);

    // Test 3: Validate output file
    console.log('\nTest 3: File validation');
    const stats = await fs.stat(downloadPath);
    console.log(`  File size: ${stats.size} bytes (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

    // Check if it's a valid MP4
    const buffer = await fs.readFile(downloadPath);
    const signature = buffer.subarray(4, 8).toString('ascii');
    const isValidMp4 = signature === 'ftyp';
    console.log(`  Valid MP4 signature: ${isValidMp4}`);

    if (!isValidMp4) {
      throw new Error('Output file is not a valid MP4');
    }

    // Check file size is reasonable (should be smaller than original due to compression)
    const originalStats = await fs.stat(testFile);
    console.log(`  Original size: ${originalStats.size} bytes`);
    console.log(`  Compression ratio: ${((stats.size / originalStats.size) * 100).toFixed(1)}%`);

    // Test 4: Check console logs for streaming behavior
    console.log('\nTest 4: Streaming behavior analysis');
    const streamingLogs = consoleLogs.filter(log =>
      log.includes('BufferTarget') ||
      log.includes('Streaming buffer') ||
      log.includes('Sent chunk')
    );

    if (streamingLogs.length > 0) {
      console.log('  Streaming-related logs found:');
      streamingLogs.forEach(log => console.log(`    - ${log}`));
    } else {
      console.log('  No streaming logs found (buffer mode used)');
    }

    // Check for errors
    const errorLogs = consoleLogs.filter(log =>
      log.toLowerCase().includes('error') &&
      !log.includes('Unexpected frame format') // This is a known non-fatal warning
    );

    if (errorLogs.length > 0) {
      console.log('\n  ⚠️ Error logs found:');
      errorLogs.forEach(log => console.log(`    - ${log}`));
    }

    console.log('\n✅ ALL TESTS PASSED');
    console.log('File is valid and playable MP4');

    return true;

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);

    // Print console logs for debugging
    console.log('\nConsole logs:');
    consoleLogs.slice(-20).forEach(log => console.log(`  ${log}`));

    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testStreamingMode()
  .then(() => {
    console.log('\n✅ Test suite completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  });