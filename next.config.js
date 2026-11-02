/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'standalone' output is needed for Docker, but doesn't affect local dev.
  output: 'standalone',
  poweredByHeader: false,

  async redirects() {
    // English lives at the root. /en used to serve a duplicate of it.
    return [{ source: '/en', destination: '/', permanent: true }];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
