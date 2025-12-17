// Test specifically for audio
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs/promises');

async function testAudio() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Capture all console logs
  const audioLogs = [];
  page.on('console', msg => {
    const text = msg.text();
    console.log(`[Browser]: ${text}`);
    if (text.includes('audio') || text.includes('Audio') ||
        text.includes('aac') || text.includes('AAC') ||
        text.includes('tracks')) {
      audioLogs.push(text);
    }
  });

  await page.goto('http://localhost:3000');
  await page.waitForSelector('h1:has-text("Media Converter")');

  // Select file with audio
  const testFile = path.join(__dirname, '..', 'vidoes', '1.mp4');
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Select File' }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(testFile);
  await page.waitForSelector('text=/1\\.mp4/');

  // Start conversion
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Convert to MP4' }).click();

  // Wait for download
  const download = await downloadPromise;
  const outputPath = path.join(__dirname, 'test-output', 'audio-test.mp4');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await download.saveAs(outputPath);

  console.log('\n=== AUDIO-RELATED LOGS ===');
  audioLogs.forEach(log => console.log(log));

  // Check output for audio
  const { execSync } = require('child_process');
  const streams = execSync(`ffprobe -v error -show_streams ${outputPath} | grep codec_type`, { encoding: 'utf8' });
  console.log('\n=== OUTPUT STREAMS ===');
  console.log(streams);

  await page.waitForTimeout(5000);
  await browser.close();
}

testAudio().catch(console.error);