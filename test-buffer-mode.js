// Test buffer mode (which works in Playwright)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testBufferMode() {
  console.log('Testing buffer mode conversion...');

  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    acceptDownloads: true
  });

  const page = await context.newPage();

  // Enable console logging
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('stream') || text.includes('chunk') || text.includes('buffer') || text.includes('bytes')) {
      console.log(`[Browser]: ${text}`);
    }
  });

  // Navigate to app
  await page.goto('http://localhost:3000');
  await page.waitForSelector('h1:has-text("Media Converter")');

  // Make sure streaming is NOT checked (use buffer mode)
  const streamingCheckbox = await page.locator('input#streaming');
  if (await streamingCheckbox.isVisible() && await streamingCheckbox.isChecked()) {
    await streamingCheckbox.uncheck();
  }
  console.log('Using buffer mode');

  // Select test file
  const testFile = path.join(__dirname, '..', 'vidoes', '1.mp4');
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Select File' }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(testFile);
  console.log('Selected test file');

  // Wait for file to appear
  await page.waitForSelector('text=/1\\.mp4/');

  // Start conversion and wait for download
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Convert to MP4' }).click();

  console.log('Waiting for conversion...');

  // Wait for download
  const download = await downloadPromise;
  const suggestedFilename = download.suggestedFilename();
  const downloadPath = path.join(__dirname, 'test-output', suggestedFilename);

  // Save the file
  await download.saveAs(downloadPath);
  console.log(`Downloaded: ${downloadPath}`);

  // Check file size
  const stats = await fs.promises.stat(downloadPath);
  console.log(`File size: ${stats.size} bytes`);

  // Check if it's a valid MP4
  const buffer = await fs.promises.readFile(downloadPath);
  const signature = buffer.subarray(4, 8).toString('ascii');
  const isValidMp4 = signature === 'ftyp';
  console.log(`Valid MP4: ${isValidMp4}`);

  await browser.close();

  return {
    success: isValidMp4 && stats.size > 0,
    size: stats.size,
    path: downloadPath
  };
}

// Run the test
testBufferMode()
  .then(result => {
    console.log('Test complete:', result);
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });