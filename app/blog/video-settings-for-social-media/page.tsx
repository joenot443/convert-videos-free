import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Video Settings for YouTube, TikTok, Instagram & More | Convert Videos Free',
  description: 'Optimize your videos for every platform. Resolution, bitrate, and format recommendations for YouTube, TikTok, Instagram, Twitter, and Facebook.',
  openGraph: {
    title: 'Best Video Settings for YouTube, TikTok, Instagram & More',
    description: 'Optimize your videos for every social media platform with the right settings.',
    type: 'article',
    publishedTime: '2024-12-12',
    authors: ['Joe Crozier'],
  },
};

export default function SocialMediaSettingsArticle() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-900">Social Media Video Settings</span>
        </nav>

        {/* Article */}
        <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                Guides
              </span>
              <span className="text-sm text-gray-500">7 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Best Video Settings for YouTube, TikTok, Instagram & More
            </h1>
            <div className="flex items-center text-gray-600">
              <span>By Joe Crozier</span>
              <span className="mx-2">•</span>
              <time dateTime="2024-12-12">December 12, 2024</time>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-gray-600 mb-8">
              Each social media platform has different video requirements. Using the wrong settings can result in
              blurry videos, rejected uploads, or wasted bandwidth. This guide covers the optimal settings for
              every major platform so your content always looks its best.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Quick Reference: Universal Settings</h2>
            <p className="text-gray-700 mb-4">
              Before diving into platform specifics, here are settings that work well across all platforms:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <ul className="list-none space-y-2 text-gray-700">
                <li><strong>Format:</strong> MP4 (H.264 video + AAC audio)</li>
                <li><strong>Frame Rate:</strong> 30fps (or 60fps for gaming/action content)</li>
                <li><strong>Resolution:</strong> 1080p (1920×1080) minimum</li>
                <li><strong>Aspect Ratio:</strong> Platform-dependent (see below)</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">YouTube</h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">▶️</span>
                <span className="font-bold text-red-900">The Video Giant</span>
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              YouTube supports the widest range of formats and resolutions. For best results:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Standard Videos (Horizontal)</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Setting</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Recommended</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Resolution</td>
                    <td className="px-4 py-3 text-gray-700">1080p (1920×1080) or 4K (3840×2160)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Aspect Ratio</td>
                    <td className="px-4 py-3 text-gray-700">16:9</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Frame Rate</td>
                    <td className="px-4 py-3 text-gray-700">24-60fps</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Bitrate (1080p)</td>
                    <td className="px-4 py-3 text-gray-700">8-12 Mbps</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Bitrate (4K)</td>
                    <td className="px-4 py-3 text-gray-700">35-45 Mbps</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Max File Size</td>
                    <td className="px-4 py-3 text-gray-700">256GB</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Max Length</td>
                    <td className="px-4 py-3 text-gray-700">12 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">YouTube Shorts (Vertical)</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li><strong>Resolution:</strong> 1080×1920 (9:16 aspect ratio)</li>
              <li><strong>Max Length:</strong> 60 seconds</li>
              <li><strong>Tip:</strong> Use the full vertical frame for maximum impact</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">TikTok</h2>
            <div className="bg-gray-900 border-l-4 border-pink-500 p-6 mb-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🎵</span>
                <span className="font-bold text-white">Short-Form King</span>
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              TikTok is optimized for vertical video. Getting these settings right is crucial for quality.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Setting</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Recommended</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Resolution</td>
                    <td className="px-4 py-3 text-gray-700">1080×1920</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Aspect Ratio</td>
                    <td className="px-4 py-3 text-gray-700">9:16 (vertical)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Frame Rate</td>
                    <td className="px-4 py-3 text-gray-700">30fps</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Bitrate</td>
                    <td className="px-4 py-3 text-gray-700">5-8 Mbps</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Max File Size</td>
                    <td className="px-4 py-3 text-gray-700">287.6MB (mobile), 500MB (web)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Max Length</td>
                    <td className="px-4 py-3 text-gray-700">10 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
              <p className="text-yellow-800">
                <strong>Pro Tip:</strong> TikTok compresses videos heavily. Upload at slightly higher quality
                than you think you need to compensate for compression.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Instagram</h2>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 mb-6 rounded-lg">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">📸</span>
                <span className="font-bold text-white">Visual Storytelling</span>
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              Instagram has different requirements for Feed posts, Stories, and Reels.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Instagram Reels</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Resolution:</strong> 1080×1920 (9:16)</li>
              <li><strong>Frame Rate:</strong> 30fps</li>
              <li><strong>Max Length:</strong> 90 seconds</li>
              <li><strong>Bitrate:</strong> 5-8 Mbps</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Instagram Stories</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Resolution:</strong> 1080×1920 (9:16)</li>
              <li><strong>Max Length:</strong> 60 seconds per story</li>
              <li><strong>Tip:</strong> Keep important content away from top/bottom edges (UI overlays)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Instagram Feed Videos</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li><strong>Square:</strong> 1080×1080 (1:1)</li>
              <li><strong>Portrait:</strong> 1080×1350 (4:5) — Recommended for more screen space</li>
              <li><strong>Landscape:</strong> 1080×608 (1.91:1)</li>
              <li><strong>Max Length:</strong> 60 minutes</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Twitter/X</h2>
            <div className="bg-blue-500 p-6 mb-6 rounded-lg">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">𝕏</span>
                <span className="font-bold text-white">Quick Engagement</span>
              </div>
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Setting</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Recommended</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Resolution</td>
                    <td className="px-4 py-3 text-gray-700">1280×720 minimum, 1920×1080 recommended</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Aspect Ratio</td>
                    <td className="px-4 py-3 text-gray-700">16:9 or 1:1</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Frame Rate</td>
                    <td className="px-4 py-3 text-gray-700">30-60fps</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Max File Size</td>
                    <td className="px-4 py-3 text-gray-700">512MB</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Max Length</td>
                    <td className="px-4 py-3 text-gray-700">2:20 (140 seconds)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Facebook</h2>
            <div className="bg-blue-600 p-6 mb-6 rounded-lg">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">📘</span>
                <span className="font-bold text-white">The All-Rounder</span>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Feed Videos</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Resolution:</strong> 1080p minimum</li>
              <li><strong>Aspect Ratio:</strong> 16:9 (landscape) or 9:16 (portrait) or 1:1 (square)</li>
              <li><strong>Max Length:</strong> 240 minutes</li>
              <li><strong>Max File Size:</strong> 4GB</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Facebook Reels</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li><strong>Resolution:</strong> 1080×1920 (9:16)</li>
              <li><strong>Max Length:</strong> 90 seconds</li>
              <li><strong>Tip:</strong> Same specs as Instagram Reels (Meta owns both)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">LinkedIn</h2>
            <div className="bg-blue-700 p-6 mb-6 rounded-lg">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">💼</span>
                <span className="font-bold text-white">Professional Network</span>
              </div>
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Setting</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Recommended</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Resolution</td>
                    <td className="px-4 py-3 text-gray-700">1920×1080</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Aspect Ratio</td>
                    <td className="px-4 py-3 text-gray-700">16:9, 1:1, or 9:16</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Frame Rate</td>
                    <td className="px-4 py-3 text-gray-700">30fps</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Max File Size</td>
                    <td className="px-4 py-3 text-gray-700">5GB</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Max Length</td>
                    <td className="px-4 py-3 text-gray-700">10 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Master Comparison Table</h2>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold text-gray-900">Platform</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-900">Best Resolution</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-900">Aspect Ratio</th>
                    <th className="px-3 py-3 text-left font-semibold text-gray-900">Max Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-3 font-medium text-gray-900">YouTube</td>
                    <td className="px-3 py-3 text-gray-700">1920×1080</td>
                    <td className="px-3 py-3 text-gray-700">16:9</td>
                    <td className="px-3 py-3 text-gray-700">12 hours</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium text-gray-900">YouTube Shorts</td>
                    <td className="px-3 py-3 text-gray-700">1080×1920</td>
                    <td className="px-3 py-3 text-gray-700">9:16</td>
                    <td className="px-3 py-3 text-gray-700">60 sec</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium text-gray-900">TikTok</td>
                    <td className="px-3 py-3 text-gray-700">1080×1920</td>
                    <td className="px-3 py-3 text-gray-700">9:16</td>
                    <td className="px-3 py-3 text-gray-700">10 min</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium text-gray-900">Instagram Reels</td>
                    <td className="px-3 py-3 text-gray-700">1080×1920</td>
                    <td className="px-3 py-3 text-gray-700">9:16</td>
                    <td className="px-3 py-3 text-gray-700">90 sec</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium text-gray-900">Instagram Feed</td>
                    <td className="px-3 py-3 text-gray-700">1080×1350</td>
                    <td className="px-3 py-3 text-gray-700">4:5</td>
                    <td className="px-3 py-3 text-gray-700">60 min</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium text-gray-900">Twitter/X</td>
                    <td className="px-3 py-3 text-gray-700">1920×1080</td>
                    <td className="px-3 py-3 text-gray-700">16:9</td>
                    <td className="px-3 py-3 text-gray-700">2:20</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium text-gray-900">Facebook</td>
                    <td className="px-3 py-3 text-gray-700">1920×1080</td>
                    <td className="px-3 py-3 text-gray-700">16:9</td>
                    <td className="px-3 py-3 text-gray-700">240 min</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium text-gray-900">LinkedIn</td>
                    <td className="px-3 py-3 text-gray-700">1920×1080</td>
                    <td className="px-3 py-3 text-gray-700">16:9</td>
                    <td className="px-3 py-3 text-gray-700">10 min</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tips for Best Results</h2>
            <ol className="list-decimal pl-6 space-y-3 text-gray-700 mb-6">
              <li>
                <strong>Always use MP4 with H.264:</strong> It's universally supported across all platforms.
              </li>
              <li>
                <strong>Don't upscale:</strong> If your source is 720p, don't convert to 1080p—it won't improve quality.
              </li>
              <li>
                <strong>Match the platform's preferred aspect ratio:</strong> Vertical (9:16) for TikTok/Reels,
                horizontal (16:9) for YouTube.
              </li>
              <li>
                <strong>Keep file sizes reasonable:</strong> Smaller files upload faster and process more reliably.
              </li>
              <li>
                <strong>Use AAC audio:</strong> 128-256 kbps stereo is sufficient for social media.
              </li>
            </ol>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Converting Your Videos</h2>
            <p className="text-gray-700 mb-4">
              Have a video that's not in the right format? Convert Videos Free makes it easy to get your videos
              ready for any platform:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
              <li>Upload your video (supports MOV, WebM, MKV, AVI)</li>
              <li>Choose your quality settings based on the platform's requirements</li>
              <li>Convert to MP4 instantly in your browser</li>
              <li>Download and upload to your social media platform</li>
            </ol>
            <p className="text-gray-700">
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">Try Convert Videos Free</Link> —
              get your videos platform-ready in seconds.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-3">Get Your Videos Platform-Ready</h3>
            <p className="mb-6 text-blue-100">
              Convert to MP4 with the perfect settings for any social media platform.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Start Converting
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/how-to-convert-mov-to-mp4" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-gray-900 mb-2">How to Convert MOV to MP4</h3>
              <p className="text-gray-600 text-sm">Perfect for iPhone videos that need to be shared online.</p>
            </Link>
            <Link href="/blog/best-video-formats-explained" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-gray-900 mb-2">Video Formats Explained</h3>
              <p className="text-gray-600 text-sm">Understand the differences between MP4, MOV, WebM, and more.</p>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Convert Videos Free. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
