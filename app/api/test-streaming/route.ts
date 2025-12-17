import { NextResponse } from 'next/server';

// Test endpoint to verify streaming mode works
export async function GET() {
  return NextResponse.json({
    message: 'Use the /test-streaming page to test streaming mode',
    streamingSupported: typeof global !== 'undefined' && 'showSaveFilePicker' in global
  });
}