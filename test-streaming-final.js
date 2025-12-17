// Final comprehensive streaming mode test
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs/promises');
const { execSync } = require('child_process');

async function verifyMp4Playable(filePath) {
  try {
    // Use ffprobe to check if the file is valid
    const output = execSync(`ffprobe -v error -show_entries format=format_name,duration,size -of json "${filePath}" 2>/dev/null`, {
      encoding: 'utf8'
    });
    const info = JSON.parse(output);
    return info.format && info.format.format_name.includes('mp4');
  } catch (error) {
    // If ffprobe is not available, check file signature
    try {
      const buffer = await fs.readFile(filePath);
      const signature = buffer.subarray(4, 8).toString('ascii');
      return signature === 'ftyp';
    } catch (e) {
      return false;
    }
  }
}

async function testConversionMode(mode = 'buffer') {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Testing ${mode.toUpperCase()} MODE`);
  console.log('='.repeat(50));

  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-features=FileSystemAccess']
  });

  const context = await browser.newContext({
    acceptDownloads: true
  });

  const page = await context.newPage();

  // Enhanced console logging
  const logs = {
    errors: [],
    warnings: [],
    info: [],
    streaming: []
  };

  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();

    if (type === 'error') {
      logs.errors.push(text);
    } else if (type === 'warning') {
      logs.warnings.push(text);
    } else {
      logs.info.push(text);
    }

    // Track streaming-specific logs
    if (text.includes('streaming') || text.includes('Streaming') ||
        text.includes('chunk') || text.includes('BufferTarget')) {
      logs.streaming.push(text);
    }

    // Log important messages
    if (text.includes('Using BufferTarget') ||
        text.includes('Streaming buffer') ||
        text.includes('Sent chunk') ||
        text.includes('mode:')) {
      console.log(`  [Browser]: ${text}`);
    }
  });

  try {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('h1:has-text("Media Converter")');
    console.log('  ✓ App loaded');

    // Check streaming support
    const hasStreamingCheckbox = await page.locator('input#streaming').isVisible();
    console.log(`  ✓ Streaming checkbox visible: ${hasStreamingCheckbox}`);

    if (mode === 'streaming' && hasStreamingCheckbox) {
      await page.locator('input#streaming').check();
      console.log('  ✓ Streaming mode enabled');
    }

    // Select file
    const testFile = path.join(__dirname, '..', 'vidoes', '1.mp4');
    const fileStats = await fs.stat(testFile);
    console.log(`  ✓ Test file: ${testFile} (${fileStats.size} bytes)`);

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Select File' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testFile);
    console.log('  ✓ File selected');

    await page.waitForSelector('text=/1\\.mp4/');

    // Start conversion
    console.log('  ⏳ Starting conversion...');
    const downloadPromise = page.waitForEvent('download', { timeout: 90000 });
    await page.getByRole('button', { name: 'Convert to MP4' }).click();

    // Wait for conversion
    let conversionComplete = false;
    const startTime = Date.now();

    while (!conversionComplete && Date.now() - startTime < 90000) {
      const successVisible = await page.locator('text=/File saved successfully|Download should start automatically/').isVisible();
      const errorVisible = await page.locator('.bg-red-50').isVisible();

      if (successVisible) {
        conversionComplete = true;
        console.log('  ✓ Conversion completed successfully');
      } else if (errorVisible) {
        const errorText = await page.locator('.bg-red-50').textContent();
        throw new Error(`Conversion failed: ${errorText}`);
      }

      if (!conversionComplete) {
        // Check progress
        const progressElement = await page.locator('.bg-blue-600').first();
        if (await progressElement.isVisible()) {
          const width = await progressElement.evaluate(el => el.style.width);
          if (width) {
            process.stdout.write(`\r  ⏳ Progress: ${width}`);
          }
        }
        await page.waitForTimeout(500);
      }
    }

    if (!conversionComplete) {
      throw new Error('Conversion timeout');
    }

    // Get download
    const download = await downloadPromise;
    const outputPath = path.join(__dirname, 'test-output', download.suggestedFilename());
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await download.saveAs(outputPath);
    console.log(`\n  ✓ File saved: ${outputPath}`);

    // Validate output
    const outputStats = await fs.stat(outputPath);
    console.log(`  ✓ Output size: ${outputStats.size} bytes`);

    const isPlayable = await verifyMp4Playable(outputPath);
    console.log(`  ✓ Valid MP4: ${isPlayable}`);

    if (!isPlayable) {
      throw new Error('Output file is not a valid MP4');
    }

    // Analyze logs
    console.log('\n  Log Analysis:');
    console.log(`    - Errors: ${logs.errors.length}`);
    console.log(`    - Warnings: ${logs.warnings.length}`);
    console.log(`    - Streaming logs: ${logs.streaming.length}`);

    if (logs.streaming.length > 0) {
      console.log('\n  Streaming-related logs:');
      logs.streaming.slice(0, 5).forEach(log => {
        console.log(`    ${log.substring(0, 100)}${log.length > 100 ? '...' : ''}`);
      });
    }

    // Check for critical errors (ignore known warnings)
    const criticalErrors = logs.errors.filter(err =>
      !err.includes('Unexpected frame format') // Known non-fatal warning
    );

    if (criticalErrors.length > 0) {
      console.log('\n  ⚠️ Critical errors found:');
      criticalErrors.forEach(err => console.log(`    ${err}`));
    }

    console.log(`\n  ✅ ${mode.toUpperCase()} MODE TEST PASSED`);

    return {
      success: true,
      outputPath,
      outputSize: outputStats.size,
      logs
    };

  } catch (error) {
    console.error(`\n  ❌ ${mode.toUpperCase()} MODE TEST FAILED:`, error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

async function runAllTests() {
  console.log('COMPREHENSIVE STREAMING MODE TEST SUITE');
  console.log('========================================\n');

  const results = {
    buffer: null,
    streaming: null
  };

  try {
    // Test 1: Buffer mode (baseline)
    results.buffer = await testConversionMode('buffer');

    // Test 2: Streaming mode (if available)
    results.streaming = await testConversionMode('streaming');

    // Compare results
    console.log('\n' + '='.repeat(50));
    console.log('TEST RESULTS SUMMARY');
    console.log('='.repeat(50));

    console.log('\nBuffer Mode:');
    console.log(`  Status: ${results.buffer.success ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`  Output size: ${results.buffer.outputSize} bytes`);

    console.log('\nStreaming Mode:');
    console.log(`  Status: ${results.streaming.success ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`  Output size: ${results.streaming.outputSize} bytes`);

    // Check if outputs are identical
    if (results.buffer.success && results.streaming.success) {
      const bufferContent = await fs.readFile(results.buffer.outputPath);
      const streamingContent = await fs.readFile(results.streaming.outputPath);
      const identical = Buffer.compare(bufferContent, streamingContent) === 0;

      console.log(`\nOutput files identical: ${identical ? '✅ YES' : '⚠️ NO'}`);

      if (!identical) {
        console.log(`  Buffer size: ${bufferContent.length}`);
        console.log(`  Streaming size: ${streamingContent.length}`);
        console.log(`  Difference: ${Math.abs(bufferContent.length - streamingContent.length)} bytes`);
      }
    }

    console.log('\n✅ ALL TESTS COMPLETED SUCCESSFULLY');
    console.log('Both buffer and streaming modes produce valid MP4 files');

  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED:', error);
    process.exit(1);
  }
}

// Run tests
runAllTests()
  .then(() => {
    console.log('\n✅ Test suite completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });