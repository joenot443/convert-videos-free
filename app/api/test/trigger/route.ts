import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Only allow in development/test modes
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ENABLE_TEST_MODE !== 'true') {
    return NextResponse.json({ error: 'Test mode not enabled' }, { status: 403 });
  }

  try {
    const { action, params } = await request.json();

    // Return a script that will trigger the action client-side
    return new NextResponse(`
      <script>
        if (window.__testMode) {
          window.__testMode.triggerAction('${action}', ${JSON.stringify(params || {})});
          window.postMessage({ type: 'TEST_ACTION_TRIGGERED', action: '${action}' }, '*');
        }
      </script>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}