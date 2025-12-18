import Link from 'next/link';
import { Metadata } from 'next';
import GoogleAdSense from '@/components/GoogleAdSense';

export const metadata: Metadata = {
  title: 'Best Video Settings for YouTube, TikTok, Instagram | Convert Videos Free',
  description: 'Optimize your videos for every platform. Resolution, bitrate, and format recommendations for YouTube, TikTok, Instagram, Twitter, and Facebook.',
  openGraph: {
    title: 'Best Video Settings for YouTube, TikTok, Instagram',
    description: 'Platform-specific video settings for optimal quality and compatibility.',
    type: 'article',
    publishedTime: '2024-12-12',
    authors: ['Joe Crozier'],
  },
};

export default function SocialMediaSettingsArticle() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-900">Social Media Settings</span>
        </nav>

        <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <header className="mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                Guide
              </span>
              <span className="text-sm text-gray-500">7 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Best Video Settings for YouTube, TikTok, Instagram and More
            </h1>
            <p className="text-gray-600">
              By Joe Crozier · December 12, 2024
            </p>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Each platform has different video requirements. Wrong settings mean blurry videos, rejected uploads, or wasted bandwidth. This guide covers the optimal specs for every major platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Universal Settings</h2>

            <p className="text-gray-700 mb-4">
              These settings work well across all platforms:
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <ul className="space-y-2 text-gray-700">
                <li><span className="font-semibold">Format:</span> MP4 (H.264 video + AAC audio)</li>
                <li><span className="font-semibold">Frame rate:</span> 30fps (60fps for gaming or action)</li>
                <li><span className="font-semibold">Resolution:</span> 1080p minimum</li>
                <li><span className="font-semibold">Audio:</span> 128–256 kbps stereo AAC</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">YouTube</h2>

            <p className="text-gray-700 mb-4">
              YouTube supports the widest range of formats and offers the most flexibility.
            </p>

            <p className="font-semibold text-gray-900 mt-6 mb-3">Standard Videos</p>

            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Resolution</td>
                    <td className="p-3 text-gray-700">1920×1080 or 3840×2160 (4K)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Aspect ratio</td>
                    <td className="p-3 text-gray-700">16:9</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Frame rate</td>
                    <td className="p-3 text-gray-700">24–60fps</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Bitrate (1080p)</td>
                    <td className="p-3 text-gray-700">8–12 Mbps</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Bitrate (4K)</td>
                    <td className="p-3 text-gray-700">35–45 Mbps</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-700 font-medium">Max file size</td>
                    <td className="p-3 text-gray-700">256GB</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="font-semibold text-gray-900 mt-6 mb-3">YouTube Shorts</p>

            <ul className="space-y-2 text-gray-700 mb-6">
              <li><span className="font-semibold">Resolution:</span> 1080×1920 (9:16 vertical)</li>
              <li><span className="font-semibold">Max length:</span> 60 seconds</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">TikTok</h2>

            <p className="text-gray-700 mb-4">
              TikTok is optimized for vertical video. Note that TikTok compresses uploads heavily—upload at higher quality than you think necessary.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Resolution</td>
                    <td className="p-3 text-gray-700">1080×1920</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Aspect ratio</td>
                    <td className="p-3 text-gray-700">9:16 (vertical)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Frame rate</td>
                    <td className="p-3 text-gray-700">30fps</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Bitrate</td>
                    <td className="p-3 text-gray-700">5–8 Mbps</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Max file size</td>
                    <td className="p-3 text-gray-700">287MB (mobile), 500MB (web)</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-700 font-medium">Max length</td>
                    <td className="p-3 text-gray-700">10 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Instagram</h2>

            <p className="text-gray-700 mb-4">
              Instagram has different requirements for Feed posts, Stories, and Reels.
            </p>

            <p className="font-semibold text-gray-900 mt-6 mb-3">Instagram Reels</p>

            <ul className="space-y-2 text-gray-700 mb-4">
              <li><span className="font-semibold">Resolution:</span> 1080×1920 (9:16)</li>
              <li><span className="font-semibold">Max length:</span> 90 seconds</li>
              <li><span className="font-semibold">Bitrate:</span> 5–8 Mbps</li>
            </ul>

            <p className="font-semibold text-gray-900 mt-6 mb-3">Instagram Stories</p>

            <ul className="space-y-2 text-gray-700 mb-4">
              <li><span className="font-semibold">Resolution:</span> 1080×1920 (9:16)</li>
              <li><span className="font-semibold">Max length:</span> 60 seconds per story</li>
              <li>Keep important content away from edges (UI overlays)</li>
            </ul>

            <p className="font-semibold text-gray-900 mt-6 mb-3">Instagram Feed</p>

            <ul className="space-y-2 text-gray-700 mb-6">
              <li><span className="font-semibold">Square:</span> 1080×1080 (1:1)</li>
              <li><span className="font-semibold">Portrait:</span> 1080×1350 (4:5) — recommended for more screen space</li>
              <li><span className="font-semibold">Landscape:</span> 1080×608 (1.91:1)</li>
              <li><span className="font-semibold">Max length:</span> 60 minutes</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Twitter / X</h2>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Resolution</td>
                    <td className="p-3 text-gray-700">1280×720 min, 1920×1080 recommended</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Aspect ratio</td>
                    <td className="p-3 text-gray-700">16:9 or 1:1</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Frame rate</td>
                    <td className="p-3 text-gray-700">30–60fps</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Max file size</td>
                    <td className="p-3 text-gray-700">512MB</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-700 font-medium">Max length</td>
                    <td className="p-3 text-gray-700">2 minutes 20 seconds</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Facebook</h2>

            <p className="font-semibold text-gray-900 mt-6 mb-3">Feed Videos</p>

            <ul className="space-y-2 text-gray-700 mb-4">
              <li><span className="font-semibold">Resolution:</span> 1080p minimum</li>
              <li><span className="font-semibold">Aspect ratio:</span> 16:9, 9:16, or 1:1</li>
              <li><span className="font-semibold">Max length:</span> 240 minutes</li>
              <li><span className="font-semibold">Max file size:</span> 4GB</li>
            </ul>

            <p className="font-semibold text-gray-900 mt-6 mb-3">Facebook Reels</p>

            <ul className="space-y-2 text-gray-700 mb-6">
              <li><span className="font-semibold">Resolution:</span> 1080×1920 (9:16)</li>
              <li><span className="font-semibold">Max length:</span> 90 seconds</li>
              <li>Same specs as Instagram Reels (Meta owns both)</li>
            </ul>

            <div className="my-8">
              <GoogleAdSense
                dataAdSlot="XXXXXXXXXX"
                dataAdFormat="auto"
                dataFullWidthResponsive={true}
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">LinkedIn</h2>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Resolution</td>
                    <td className="p-3 text-gray-700">1920×1080</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Aspect ratio</td>
                    <td className="p-3 text-gray-700">16:9, 1:1, or 9:16</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Frame rate</td>
                    <td className="p-3 text-gray-700">30fps</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700 font-medium">Max file size</td>
                    <td className="p-3 text-gray-700">5GB</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-700 font-medium">Max length</td>
                    <td className="p-3 text-gray-700">10 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Quick Reference</h2>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 font-semibold text-gray-900 border-b">Platform</th>
                    <th className="text-left p-3 font-semibold text-gray-900 border-b">Resolution</th>
                    <th className="text-left p-3 font-semibold text-gray-900 border-b">Ratio</th>
                    <th className="text-left p-3 font-semibold text-gray-900 border-b">Max Length</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700">YouTube</td>
                    <td className="p-3 text-gray-700">1920×1080</td>
                    <td className="p-3 text-gray-700">16:9</td>
                    <td className="p-3 text-gray-700">12 hours</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700">YouTube Shorts</td>
                    <td className="p-3 text-gray-700">1080×1920</td>
                    <td className="p-3 text-gray-700">9:16</td>
                    <td className="p-3 text-gray-700">60 sec</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700">TikTok</td>
                    <td className="p-3 text-gray-700">1080×1920</td>
                    <td className="p-3 text-gray-700">9:16</td>
                    <td className="p-3 text-gray-700">10 min</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700">Instagram Reels</td>
                    <td className="p-3 text-gray-700">1080×1920</td>
                    <td className="p-3 text-gray-700">9:16</td>
                    <td className="p-3 text-gray-700">90 sec</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700">Instagram Feed</td>
                    <td className="p-3 text-gray-700">1080×1350</td>
                    <td className="p-3 text-gray-700">4:5</td>
                    <td className="p-3 text-gray-700">60 min</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700">Twitter/X</td>
                    <td className="p-3 text-gray-700">1920×1080</td>
                    <td className="p-3 text-gray-700">16:9</td>
                    <td className="p-3 text-gray-700">2:20</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 text-gray-700">Facebook</td>
                    <td className="p-3 text-gray-700">1920×1080</td>
                    <td className="p-3 text-gray-700">16:9</td>
                    <td className="p-3 text-gray-700">240 min</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-700">LinkedIn</td>
                    <td className="p-3 text-gray-700">1920×1080</td>
                    <td className="p-3 text-gray-700">16:9</td>
                    <td className="p-3 text-gray-700">10 min</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Best Practices</h2>

            <ol className="space-y-3 text-gray-700 mb-6">
              <li>
                <span className="font-semibold text-gray-900">1. Always use MP4 with H.264.</span> It's universally supported.
              </li>
              <li>
                <span className="font-semibold text-gray-900">2. Don't upscale.</span> If your source is 720p, don't convert to 1080p.
              </li>
              <li>
                <span className="font-semibold text-gray-900">3. Match the platform's aspect ratio.</span> Vertical for TikTok/Reels, horizontal for YouTube.
              </li>
              <li>
                <span className="font-semibold text-gray-900">4. Keep file sizes reasonable.</span> Smaller files upload faster and process more reliably.
              </li>
              <li>
                <span className="font-semibold text-gray-900">5. Use AAC audio.</span> 128–256 kbps stereo is sufficient for social media.
              </li>
            </ol>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Converting Your Videos</h2>

            <p className="text-gray-700 mb-4">
              Have a video that's not in the right format? The process is straightforward:
            </p>

            <ol className="space-y-2 text-gray-700 mb-6">
              <li>1. Upload your video (MOV, WebM, MKV, or AVI)</li>
              <li>2. Choose quality settings based on your target platform</li>
              <li>3. Convert to MP4</li>
              <li>4. Upload to your platform</li>
            </ol>

            <p className="text-gray-700">
              <Link href="/" className="text-blue-600 hover:underline font-medium">Convert Videos Free</Link> handles the conversion directly in your browser—no uploads to external servers required.
            </p>
          </div>

          <div className="my-8">
            <GoogleAdSense
              dataAdSlot="YYYYYYYYYY"
              dataAdFormat="auto"
              dataFullWidthResponsive={true}
            />
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/blog/how-to-convert-mov-to-mp4" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="font-medium text-gray-900">How to Convert MOV to MP4</p>
                <p className="text-sm text-gray-600">Convert iPhone videos for any platform</p>
              </Link>
              <Link href="/blog/best-video-formats-explained" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="font-medium text-gray-900">Video Formats Explained</p>
                <p className="text-sm text-gray-600">MP4, MOV, WebM, MKV compared</p>
              </Link>
            </div>
          </div>
        </article>

        <footer className="text-center mt-12 text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Convert Videos Free. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
