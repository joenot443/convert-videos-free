import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Formats Explained: MP4, MOV, WebM, MKV | Convert Videos Free',
  description: 'A comprehensive guide to video formats. Learn the pros and cons of MP4, MOV, WebM, MKV, and AVI formats and when to use each one.',
  openGraph: {
    title: 'Video Formats Explained: MP4, MOV, WebM, MKV',
    description: 'A comprehensive guide to video formats and when to use each one.',
    type: 'article',
    publishedTime: '2024-12-14',
    authors: ['Joe Crozier'],
  },
};

export default function VideoFormatsArticle() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-900">Video Formats</span>
        </nav>

        <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <header className="mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Education
              </span>
              <span className="text-sm text-gray-500">8 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Video Formats Explained: MP4, MOV, WebM, MKV
            </h1>
            <p className="text-gray-600">
              By Joe Crozier · December 14, 2024
            </p>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Choosing the right video format matters. The wrong choice can mean compatibility issues, bloated file sizes, or unnecessary quality loss. This guide covers everything you need to know about the most common video formats.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Containers vs. Codecs</h2>

            <p className="text-gray-700 mb-4">
              Before diving into specific formats, understand these two concepts:
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="mb-3">
                <span className="font-semibold text-gray-900">Container</span> — The file format that holds video, audio, and metadata together. This is what you see as the file extension: .mp4, .mov, .mkv.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Codec</span> — The compression algorithm that encodes and decodes the actual video data. Common codecs include H.264, H.265 (HEVC), VP9, and AV1.
              </p>
            </div>

            <p className="text-gray-700 mb-6">
              A single container can support multiple codecs. An MP4 file might contain H.264 or H.265 video. Compatibility depends on both the container and the codec inside.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">MP4</h2>

            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">The universal standard</p>

            <p className="text-gray-700 mb-4">
              MP4 (MPEG-4 Part 14) is the most widely supported video format. Developed by the Moving Picture Experts Group, it has become the default choice for digital video across platforms.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Strengths</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Plays on virtually every device</li>
                  <li>• Excellent compression efficiency</li>
                  <li>• Native support on all social platforms</li>
                  <li>• Good balance of quality and file size</li>
                  <li>• Supports subtitles and multiple audio tracks</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Weaknesses</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Not ideal for professional editing</li>
                  <li>• Less efficient than newer codecs</li>
                  <li>• H.264 has licensing considerations</li>
                </ul>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              <span className="font-semibold">When to use MP4:</span> Whenever you need maximum compatibility. Sharing videos, uploading to social media, playing on different devices. When in doubt, choose MP4.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">MOV</h2>

            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Apple's format</p>

            <p className="text-gray-700 mb-4">
              Developed by Apple for QuickTime, MOV is the default format for iPhones, iPads, and Macs. It's technically similar to MP4—both derive from the MPEG-4 standard—but optimized for Apple's ecosystem.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Strengths</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Excellent quality from Apple devices</li>
                  <li>• Supports professional codecs like ProRes</li>
                  <li>• Native editing support in Final Cut Pro</li>
                  <li>• Can store higher-quality video than typical MP4</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Weaknesses</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Less compatible with Windows and Android</li>
                  <li>• Often larger file sizes</li>
                  <li>• May require specific codecs on non-Apple devices</li>
                </ul>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              <span className="font-semibold">When to use MOV:</span> Within Apple's ecosystem or when preserving maximum quality for editing. <Link href="/blog/how-to-convert-mov-to-mp4" className="text-blue-600 hover:underline">Convert to MP4</Link> when sharing with others.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">WebM</h2>

            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">The open web format</p>

            <p className="text-gray-700 mb-4">
              WebM is an open, royalty-free format developed by Google for web use. It uses VP8 or VP9 video codecs and Vorbis or Opus audio codecs.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Strengths</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Completely royalty-free</li>
                  <li>• Excellent compression with VP9</li>
                  <li>• Native support in Chrome, Firefox, Edge</li>
                  <li>• Optimized for web streaming</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Weaknesses</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Limited support on Apple devices</li>
                  <li>• Not widely supported by media players</li>
                  <li>• Less common than MP4</li>
                </ul>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              <span className="font-semibold">When to use WebM:</span> Web development when you need a royalty-free format and can provide MP4 fallback. Popular for web animations and screen recordings.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">MKV</h2>

            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">The flexible container</p>

            <p className="text-gray-700 mb-4">
              MKV (Matroska) is an open-source container known for flexibility. It can hold virtually any video, audio, and subtitle format, making it popular for movie archiving.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Strengths</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Unlimited audio and subtitle tracks</li>
                  <li>• Supports almost any codec</li>
                  <li>• Chapters and rich metadata</li>
                  <li>• Open source and free</li>
                  <li>• Excellent for movies with multiple languages</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Weaknesses</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Poor compatibility with mobile devices</li>
                  <li>• Not supported by social media platforms</li>
                  <li>• Requires specific software to play reliably</li>
                </ul>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              <span className="font-semibold">When to use MKV:</span> Personal movie libraries where you want multiple audio tracks and subtitles. Convert to MP4 when sharing or playing on various devices.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">AVI</h2>

            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Legacy format</p>

            <p className="text-gray-700 mb-4">
              AVI (Audio Video Interleave) was introduced by Microsoft in 1992. While largely obsolete, you may encounter AVI files from older cameras or archives.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Strengths</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Wide Windows support</li>
                  <li>• Simple structure</li>
                  <li>• Compatible with older software</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Weaknesses</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Large file sizes</li>
                  <li>• Limited codec support</li>
                  <li>• No streaming support</li>
                  <li>• Outdated technology</li>
                </ul>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              <span className="font-semibold">When to use AVI:</span> Generally, don't create new AVI files. Convert existing AVI files to MP4 for better compatibility and smaller sizes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Quick Comparison</h2>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 font-semibold text-gray-900 border-b">Format</th>
                    <th className="text-left p-3 font-semibold text-gray-900 border-b">Compatibility</th>
                    <th className="text-left p-3 font-semibold text-gray-900 border-b">File Size</th>
                    <th className="text-left p-3 font-semibold text-gray-900 border-b">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium text-gray-900">MP4</td>
                    <td className="p-3 text-green-600 font-medium">Excellent</td>
                    <td className="p-3 text-gray-700">Small–Medium</td>
                    <td className="p-3 text-gray-700">Everything</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium text-gray-900">MOV</td>
                    <td className="p-3 text-yellow-600 font-medium">Good (Apple)</td>
                    <td className="p-3 text-gray-700">Medium–Large</td>
                    <td className="p-3 text-gray-700">Mac/iOS, Editing</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium text-gray-900">WebM</td>
                    <td className="p-3 text-yellow-600 font-medium">Good (Web)</td>
                    <td className="p-3 text-gray-700">Small</td>
                    <td className="p-3 text-gray-700">Web embedding</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium text-gray-900">MKV</td>
                    <td className="p-3 text-red-600 font-medium">Limited</td>
                    <td className="p-3 text-gray-700">Varies</td>
                    <td className="p-3 text-gray-700">Archives, Movies</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-gray-900">AVI</td>
                    <td className="p-3 text-yellow-600 font-medium">Good (Windows)</td>
                    <td className="p-3 text-gray-700">Large</td>
                    <td className="p-3 text-gray-700">Legacy systems</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Bottom Line</h2>

            <p className="text-gray-700 mb-4">
              For most people, MP4 is the right choice. It offers the best balance of compatibility, quality, and file size. Use other formats when you have specific needs:
            </p>

            <ul className="space-y-2 text-gray-700 mb-6">
              <li><span className="font-semibold">MOV</span> — Apple ecosystem and professional editing</li>
              <li><span className="font-semibold">WebM</span> — Royalty-free web video</li>
              <li><span className="font-semibold">MKV</span> — Movie archives with multiple tracks</li>
              <li><span className="font-semibold">AVI</span> — Only for legacy compatibility</li>
            </ul>

            <p className="text-gray-700">
              Need to convert between formats? <Link href="/" className="text-blue-600 hover:underline font-medium">Convert Videos Free</Link> handles any video to MP4, directly in your browser.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/blog/how-to-convert-mov-to-mp4" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="font-medium text-gray-900">How to Convert MOV to MP4</p>
                <p className="text-sm text-gray-600">Step-by-step guide with optimal settings</p>
              </Link>
              <Link href="/blog/webcodecs-browser-video-processing" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="font-medium text-gray-900">WebCodecs Technology</p>
                <p className="text-sm text-gray-600">How browser-based conversion works</p>
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
