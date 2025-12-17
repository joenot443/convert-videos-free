// Manual test script for streaming mode debugging
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testStreamingMode() {
  console.log('Starting streaming mode test...');

  const browser = await chromium.launch({
    headless: false, // Run with visible browser
    devtools: true  // Open devtools for debugging
  });

  const context = await browser.newContext({
    permissions: ['camera', 'microphone'],
    acceptDownloads: true
  });

  const page = await context.newPage();

  // Enable console logging
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('stream') || text.includes('chunk') || text.includes('ProxyWritableStream')) {
      console.log(`[Browser]: ${text}`);
    }
  });

  // Navigate to app
  console.log('Navigating to app...');
  await page.goto('http://localhost:3000');

  // Wait for app to load
  await page.waitForSelector('h1:has-text("Media Converter")');
  console.log('App loaded successfully');

  // Check if streaming is available
  const hasStreaming = await page.locator('input#streaming').isVisible();
  console.log(`Streaming support: ${hasStreaming}`);

  if (!hasStreaming) {
    console.log('Streaming mode not supported in this browser');
    await browser.close();
    return;
  }

  // Enable streaming mode
  await page.locator('input#streaming').check();
  console.log('Enabled streaming mode');

  // Select test file
  const testFile = path.join(__dirname, 'videos', '1.mp4');
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Select File' }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(testFile);
  console.log('Selected test file');

  // Wait for file to appear
  await page.waitForSelector('text=/1\\.mp4/');

  // Start conversion (but don't handle file dialog - let user do it manually)
  console.log('Starting conversion - please select a save location when prompted...');
  await page.getByRole('button', { name: 'Convert to MP4' }).click();

  // Wait for completion or error
  const result = await Promise.race([
    page.locator('text=/File saved successfully/').waitFor({ timeout: 60000 }).then(() => 'success'),
    page.locator('.bg-red-50').waitFor({ timeout: 60000 }).then(() => 'error'),
  ]);

  if (result === 'success') {
    console.log('✅ Conversion completed successfully!');

    // Check bytes written
    const bytesText = await page.locator('text=/Written:.*B/').textContent();
    console.log(`Bytes written: ${bytesText}`);
  } else {
    console.log('❌ Conversion failed');
    const errorText = await page.locator('.bg-red-50').textContent();
    console.log(`Error: ${errorText}`);
  }

  // Wait a bit before closing
  console.log('Test complete. Browser will close in 10 seconds...');
  await page.waitForTimeout(10000);

  await browser.close();
}

// Run the test
testStreamingMode().catch(console.error);