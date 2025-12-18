/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'standalone' output is needed for Docker, but doesn't affect local dev
  // Local 'npm run dev' will work normally
  output: 'standalone',
};

module.exports = nextConfig;
