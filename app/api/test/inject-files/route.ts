import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Only allow in development/test modes
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ENABLE_TEST_MODE !== 'true') {
    return NextResponse.json({ error: 'Test mode not enabled' }, { status: 403 });
  }

  try {
    const files = await request.json();

    // Return a script that will be executed client-side
    return new NextResponse(`
      <script>
        if (window.__testMode) {
          window.__testMode.injectFiles(${JSON.stringify(files)});
          window.postMessage({ type: 'TEST_FILES_INJECTED', files: ${JSON.stringify(files)} }, '*');
        }
      </script>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// For testing purposes, we also support GET to check if the endpoint exists
export async function GET() {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ENABLE_TEST_MODE !== 'true') {
    return NextResponse.json({ error: 'Test mode not enabled' }, { status: 403 });
  }

  return NextResponse.json({
    status: 'ready',
    testModeEnabled: true,
  });
}