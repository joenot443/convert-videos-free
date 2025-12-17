'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ConversionService } from '@/lib/conversion/ConversionService';
import { VideoGenerator } from '@/lib/test/VideoGenerator';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  duration?: number;
  outputSize?: number;
}

export default function TestPage() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [autoRun, setAutoRun] = useState(false);
  const conversionServiceRef = useRef<ConversionService | null>(null);

  useEffect(() => {
    conversionServiceRef.current = new ConversionService();

    // Check if we should auto-run tests (from query params)
    const params = new URLSearchParams(window.location.search);
    if (params.get('autorun') === 'true') {
      setAutoRun(true);
      setTimeout(() => runAllTests(), 1000);
    }

    return () => {
      conversionServiceRef.current?.dispose();
    };
  }, []);

  const runTest = async (testName: string, testFn: () => Promise<void>): Promise<TestResult> => {
    const startTime = Date.now();
    const result: TestResult = {
      name: testName,
      status: 'running',
    };

    try {
      await testFn();
      result.status = 'passed';
      result.duration = Date.now() - startTime;
    } catch (error) {
      result.status = 'failed';
      result.message = error instanceof Error ? error.message : 'Unknown error';
      result.duration = Date.now() - startTime;
    }

    return result;
  };

  const testBasicConversion = async (): Promise<void> => {
    if (!conversionServiceRef.current) throw new Error('Service not initialized');

    // Generate a test video
    const videoBlob = await VideoGenerator.generateTestVideo(2000, {
      width: 320,
      height: 240,
      text: 'TEST',
      includeAudio: true,
    });
    const file = VideoGenerator.blobToFile(videoBlob, 'test.webm');

    return new Promise((resolve, reject) => {
      conversionServiceRef.current!.convertFile(
        file,
        { preset: 'low' },
        {
          onComplete: (result) => {
            if (result.mode === 'buffer' && result.buffer) {
              console.log('Conversion completed, output size:', result.buffer.byteLength);
              resolve();
            } else {
              reject(new Error('Invalid conversion result'));
            }
          },
          onError: (error) => {
            reject(new Error(error));
          },
        }
      );
    });
  };

  const testNoAudioConversion = async (): Promise<void> => {
    if (!conversionServiceRef.current) throw new Error('Service not initialized');

    const videoBlob = await VideoGenerator.generateTestVideo(2000, {
      width: 320,
      height: 240,
      text: 'NO AUDIO',
      includeAudio: false,
    });
    const file = VideoGenerator.blobToFile(videoBlob, 'test_no_audio.webm');

    return new Promise((resolve, reject) => {
      conversionServiceRef.current!.convertFile(
        file,
        { preset: 'medium' },
        {
          onComplete: (result) => {
            if (result.mode === 'buffer' && result.buffer) {
              resolve();
            } else {
              reject(new Error('Invalid conversion result'));
            }
          },
          onError: (error) => {
            reject(new Error(error));
          },
        }
      );
    });
  };

  const testProgressTracking = async (): Promise<void> => {
    if (!conversionServiceRef.current) throw new Error('Service not initialized');

    const videoBlob = await VideoGenerator.generateTestVideo(3000, {
      width: 640,
      height: 480,
      text: 'PROGRESS',
      includeAudio: true,
    });
    const file = VideoGenerator.blobToFile(videoBlob, 'test_progress.webm');

    let progressUpdates = 0;
    let lastProgress = -1;

    return new Promise((resolve, reject) => {
      conversionServiceRef.current!.convertFile(
        file,
        { preset: 'high' },
        {
          onProgress: (progress) => {
            progressUpdates++;
            if (progress <= lastProgress) {
              reject(new Error(`Progress went backwards: ${lastProgress} -> ${progress}`));
              return;
            }
            lastProgress = progress;
          },
          onComplete: (result) => {
            if (progressUpdates === 0) {
              reject(new Error('No progress updates received'));
            } else if (result.mode === 'buffer' && result.buffer) {
              console.log(`Received ${progressUpdates} progress updates`);
              resolve();
            } else {
              reject(new Error('Invalid conversion result'));
            }
          },
          onError: (error) => {
            reject(new Error(error));
          },
        }
      );
    });
  };

  const testCancellation = async (): Promise<void> => {
    if (!conversionServiceRef.current) throw new Error('Service not initialized');

    const videoBlob = await VideoGenerator.generateTestVideo(5000, {
      width: 1280,
      height: 720,
      text: 'CANCEL TEST',
      includeAudio: true,
    });
    const file = VideoGenerator.blobToFile(videoBlob, 'test_cancel.webm');

    return new Promise(async (resolve, reject) => {
      let canceled = false;

      const jobId = await conversionServiceRef.current!.convertFile(
        file,
        { preset: 'high' },
        {
          onProgress: (progress) => {
            // Cancel at 50% progress
            if (progress > 0.5 && !canceled) {
              canceled = true;
              conversionServiceRef.current!.cancelConversion(jobId);
            }
          },
          onComplete: () => {
            reject(new Error('Conversion should have been canceled'));
          },
          onError: (error) => {
            if (error.includes('canceled')) {
              resolve();
            } else {
              reject(new Error(`Unexpected error: ${error}`));
            }
          },
        }
      );
    });
  };

  const runAllTests = async () => {
    setIsRunning(true);

    const testSuite = [
      { name: 'Basic Conversion with Audio', fn: testBasicConversion },
      { name: 'Conversion without Audio', fn: testNoAudioConversion },
      { name: 'Progress Tracking', fn: testProgressTracking },
      { name: 'Cancellation', fn: testCancellation },
    ];

    const results: TestResult[] = [];

    for (const test of testSuite) {
      // Update UI to show test is running
      setTests([...results, { name: test.name, status: 'running' }]);

      // Run test
      const result = await runTest(test.name, test.fn);
      results.push(result);

      // Update UI with result
      setTests([...results]);

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);

    // Log summary
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = results.filter(r => r.status === 'failed').length;
    console.log(`Test Summary: ${passed} passed, ${failed} failed`);

    // If running in CI/automated mode, output results to console
    if (autoRun) {
      window.testResults = {
        passed,
        failed,
        tests: results,
      };
      console.log('TEST_RESULTS:', JSON.stringify(window.testResults));
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'running': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return '✓';
      case 'failed': return '✗';
      case 'running': return '⟳';
      default: return '○';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Media Converter Tests</h1>

          {!isRunning && tests.length === 0 && (
            <div className="text-center py-8">
              <button
                onClick={runAllTests}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Run All Tests
              </button>
              {autoRun && (
                <p className="mt-4 text-sm text-gray-600">Auto-run enabled - tests will start automatically</p>
              )}
            </div>
          )}

          {tests.length > 0 && (
            <div className="space-y-4">
              {tests.map((test, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`text-2xl ${getStatusColor(test.status)}`}>
                      {getStatusIcon(test.status)}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{test.name}</h3>
                      {test.message && (
                        <p className="text-sm text-red-600 mt-1">{test.message}</p>
                      )}
                    </div>
                  </div>
                  {test.duration && (
                    <span className="text-sm text-gray-500">
                      {(test.duration / 1000).toFixed(2)}s
                    </span>
                  )}
                </div>
              ))}

              {!isRunning && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-green-600 font-semibold">
                        {tests.filter(t => t.status === 'passed').length} passed
                      </span>
                      {tests.filter(t => t.status === 'failed').length > 0 && (
                        <span className="text-red-600 font-semibold ml-4">
                          {tests.filter(t => t.status === 'failed').length} failed
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setTests([]);
                        runAllTests();
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Run Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {isRunning && (
            <div className="mt-4 text-center text-sm text-gray-600">
              <span className="inline-block animate-spin mr-2">⟳</span>
              Running tests...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Extend window type for test results
declare global {
  interface Window {
    testResults?: {
      passed: number;
      failed: number;
      tests: Array<{
        name: string;
        status: 'pending' | 'running' | 'passed' | 'failed';
        message?: string;
        duration?: number;
        outputSize?: number;
      }>;
    };
  }
}