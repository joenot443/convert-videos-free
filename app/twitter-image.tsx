import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Convert Videos Free - Online Video to MP4 Converter'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #c7d2fe 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Background decorations */}
        <div
          style={{
            position: 'absolute',
            top: '50px',
            left: '50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            opacity: 0.1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            right: '50px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            opacity: 0.1,
          }}
        />

        {/* Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '120px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.4)',
            marginBottom: '32px',
          }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M8 4h8a1 1 0 011 1v14a1 1 0 01-1 1H8a1 1 0 01-1-1V5a1 1 0 011-1z" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <span
            style={{
              fontSize: '72px',
              fontWeight: 800,
              color: '#1e293b',
              letterSpacing: '-2px',
            }}
          >
            Convert Videos
          </span>
          <span
            style={{
              fontSize: '72px',
              fontWeight: 800,
              color: '#3b82f6',
              letterSpacing: '-2px',
              marginLeft: '20px',
            }}
          >
            Free
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '32px',
            color: '#64748b',
            marginBottom: '48px',
            fontWeight: 500,
          }}
        >
          Online Video to MP4 Converter
        </div>

        {/* Feature badges */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 24px',
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '50px',
              border: '2px solid rgba(34, 197, 94, 0.2)',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              style={{ marginRight: '8px' }}
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={{ color: '#166534', fontSize: '20px', fontWeight: 600 }}>
              100% Private
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 24px',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '50px',
              border: '2px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              style={{ marginRight: '8px' }}
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span style={{ color: '#1d4ed8', fontSize: '20px', fontWeight: 600 }}>
              No Uploads
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 24px',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '50px',
              border: '2px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
              style={{ marginRight: '8px' }}
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span style={{ color: '#6d28d9', fontSize: '20px', fontWeight: 600 }}>
              Browser-Based
            </span>
          </div>
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '24px',
            color: '#94a3b8',
            fontWeight: 500,
          }}
        >
          convertvideosfree.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
