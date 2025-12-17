import { NextResponse } from 'next/server';

export async function GET() {
  // Only allow in development/test modes
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ENABLE_TEST_MODE !== 'true') {
    return NextResponse.json({ error: 'Test mode not enabled' }, { status: 403 });
  }

  // Return a script that retrieves status client-side
  return new NextResponse(`
    <script>
      if (window.__testMode) {
        const status = window.__testMode.getQueueStatus();
        window.postMessage({ type: 'TEST_STATUS', status }, '*');
      }
    </script>
  `, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}