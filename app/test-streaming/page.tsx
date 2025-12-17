'use client';

import React, { useState } from 'react';

export default function TestStreamingPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0, -1)}] ${message}`]);
    console.log(message);
  };

  const testStreamingMode = async () => {
    setLogs([]);
    setTestResult('testing');
    addLog('Starting streaming mode test...');

    try {
      // Check if streaming is supported
      if (!('showSaveFilePicker' in window) || !window.showSaveFilePicker) {
        throw new Error('File System Access API not supported in this browser');
      }
      addLog('✓ File System Access API is available');

      // Test 1: Create a simple file
      addLog('Test 1: Creating simple text file...');
      const textHandle = await window.showSaveFilePicker!({
        suggestedName: 'test-streaming.txt',
        types: [{
          description: 'Text file',
          accept: { 'text/plain': ['.txt'] }
        }]
      });

      const textWritable = await textHandle.createWritable();
      addLog('✓ Got writable stream for text file');

      await textWritable.write('Test content from streaming mode');
      await textWritable.close();
      addLog('✓ Successfully wrote and closed text file');

      // Test 2: Create a binary file with chunks
      addLog('Test 2: Creating binary file with multiple chunks...');
      const binaryHandle = await window.showSaveFilePicker!({
        suggestedName: 'test-binary.bin',
        types: [{
          description: 'Binary file',
          accept: { 'application/octet-stream': ['.bin'] }
        }]
      });

      const binaryWritable = await binaryHandle.createWritable();
      const writer = binaryWritable.getWriter();
      addLog('✓ Got writer for binary file');

      // Write multiple chunks
      for (let i = 0; i < 5; i++) {
        const chunk = new Uint8Array(1024).fill(i + 65); // Fill with A, B, C, D, E
        await writer.write(chunk);
        addLog(`✓ Wrote chunk ${i + 1}/5 (1KB)`);
      }

      await writer.close();
      addLog('✓ Successfully wrote and closed binary file');

      // Test 3: Test with video-like data
      addLog('Test 3: Testing with MP4-like header...');
      const mp4Handle = await window.showSaveFilePicker!({
        suggestedName: 'test-video.mp4',
        types: [{
          description: 'MP4 Video',
          accept: { 'video/mp4': ['.mp4'] }
        }]
      });

      const mp4Writable = await mp4Handle.createWritable();
      addLog('✓ Got writable stream for MP4 file');

      // Write a minimal MP4 header
      const ftypBox = new Uint8Array([
        0x00, 0x00, 0x00, 0x20, // box size (32 bytes)
        0x66, 0x74, 0x79, 0x70, // 'ftyp'
        0x69, 0x73, 0x6F, 0x6D, // 'isom'
        0x00, 0x00, 0x00, 0x00, // minor version
        0x69, 0x73, 0x6F, 0x6D, // compatible brands
        0x61, 0x76, 0x63, 0x31, // 'avc1'
        0x6D, 0x70, 0x34, 0x31  // 'mp41'
      ]);

      await mp4Writable.write(ftypBox);
      addLog('✓ Wrote MP4 ftyp box');

      await mp4Writable.close();
      addLog('✓ Successfully created MP4 file structure');

      setTestResult('success');
      addLog('🎉 All streaming tests passed!');

    } catch (error) {
      setTestResult('failed');
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          addLog('⚠️ User cancelled file selection');
        } else {
          addLog(`✗ Error: ${error.message}`);
        }
      } else {
        addLog(`✗ Unknown error: ${error}`);
      }
    }
  };

  const testWorkerStreaming = async () => {
    setLogs([]);
    setTestResult('testing');
    addLog('Testing Worker-based streaming...');

    try {
      // Create a test worker
      const workerCode = `
        self.addEventListener('message', async (event) => {
          const { command } = event.data;

          if (command === 'test') {
            // Send chunks back to main thread
            for (let i = 0; i < 3; i++) {
              const chunk = new Uint8Array(100).fill(65 + i);
              self.postMessage({
                type: 'chunk',
                data: chunk.buffer,
                index: i
              }, [chunk.buffer]);
            }

            self.postMessage({ type: 'done' });
          }
        });
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));
      addLog('✓ Created test worker');

      // Get file handle
      const handle = await window.showSaveFilePicker!({
        suggestedName: 'worker-stream-test.bin',
        types: [{
          description: 'Binary file',
          accept: { 'application/octet-stream': ['.bin'] }
        }]
      });

      const writable = await handle.createWritable();
      const writer = writable.getWriter();
      addLog('✓ Got file writer');

      // Handle worker messages
      await new Promise<void>((resolve, reject) => {
        worker.onmessage = async (event) => {
          const { type, data, index } = event.data;

          if (type === 'chunk') {
            try {
              await writer.write(new Uint8Array(data));
              addLog(`✓ Wrote chunk ${index + 1} from worker`);
            } catch (error) {
              reject(error);
            }
          } else if (type === 'done') {
            addLog('✓ Worker signaled completion');
            resolve();
          }
        };

        worker.onerror = (error) => {
          reject(error);
        };

        // Start the test
        worker.postMessage({ command: 'test' });
      });

      await writer.close();
      addLog('✓ Closed file writer');

      worker.terminate();
      addLog('✓ Terminated worker');

      setTestResult('success');
      addLog('🎉 Worker streaming test passed!');

    } catch (error) {
      setTestResult('failed');
      addLog(`✗ Error: ${error instanceof Error ? error.message : error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Streaming Mode Test</h1>

          <div className="space-y-4 mb-6">
            <button
              onClick={testStreamingMode}
              disabled={testResult === 'testing'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors mr-3"
            >
              Test Basic Streaming
            </button>

            <button
              onClick={testWorkerStreaming}
              disabled={testResult === 'testing'}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              Test Worker Streaming
            </button>
          </div>

          {testResult !== 'idle' && (
            <div className={`mb-6 p-4 rounded-lg ${
              testResult === 'success' ? 'bg-green-50 border border-green-200' :
              testResult === 'failed' ? 'bg-red-50 border border-red-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              <p className={`font-semibold ${
                testResult === 'success' ? 'text-green-800' :
                testResult === 'failed' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {testResult === 'testing' && 'Testing...'}
                {testResult === 'success' && '✓ Test Passed'}
                {testResult === 'failed' && '✗ Test Failed'}
              </p>
            </div>
          )}

          <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
            <pre className="text-green-400 text-sm font-mono">
              {logs.length > 0 ? logs.join('\n') : 'Click a test button to start...'}
            </pre>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p><strong>Browser Support:</strong></p>
            <ul className="mt-2 space-y-1">
              <li>• Chrome/Edge: {typeof window !== 'undefined' && 'showSaveFilePicker' in window ? '✅ Supported' : '❌ Not supported'}</li>
              <li>• Safari: ❌ Not supported (no File System Access API)</li>
              <li>• Firefox: ❌ Not supported (no File System Access API)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}