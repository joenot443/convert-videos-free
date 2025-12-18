import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Formats Explained: MP4, MOV, WebM, MKV - Which Should You Use? | Convert Videos Free',
  description: 'A comprehensive guide to video formats. Learn the pros and cons of MP4, MOV, WebM, MKV, and AVI formats and when to use each one.',
  openGraph: {
    title: 'Video Formats Explained: MP4, MOV, WebM, MKV - Which Should You Use?',
    description: 'A comprehensive guide to video formats. Learn the pros and cons of each format and when to use them.',
    type: 'article',
    publishedTime: '2024-12-14',
    authors: ['Joe Crozier'],
  },
};

export default function VideoFormatsArticle() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-900">Video Formats Explained</span>
        </nav>

        {/* Article */}
        <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Education
              </span>
              <span className="text-sm text-gray-500">8 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Video Formats Explained: MP4, MOV, WebM, MKV - Which Should You Use?
            </h1>
            <div className="flex items-center text-gray-600">
              <span>By Joe Crozier</span>
              <span className="mx-2">•</span>
              <time dateTime="2024-12-14">December 14, 2024</time>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-gray-600 mb-8">
              With so many video formats available, choosing the right one can be confusing.
              This guide breaks down the most common formats, explaining their strengths, weaknesses,
              and ideal use cases so you can make informed decisions.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Understanding Video Containers vs. Codecs</h2>
            <p className="text-gray-700 mb-4">
              Before diving into formats, it's important to understand two key concepts:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>
                <strong>Container (Format):</strong> The "wrapper" that holds video, audio, and metadata together.
                This is what we commonly call the video format (MP4, MOV, MKV, etc.)
              </li>
              <li>
                <strong>Codec:</strong> The compression algorithm used to encode/decode the actual video and audio data
                (H.264, H.265/HEVC, VP9, etc.)
              </li>
            </ul>
            <p className="text-gray-700 mb-4">
              A single container can support multiple codecs. For example, an MP4 file might contain H.264 or H.265 video.
              This distinction matters because compatibility depends on both the container and the codec inside.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">MP4 (MPEG-4 Part 14)</h2>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">📦</span>
                <span className="font-bold text-blue-900">The Universal Standard</span>
              </div>
              <p className="text-blue-800 mb-0">Best for: Web, social media, general sharing, cross-platform compatibility</p>
            </div>

            <p className="text-gray-700 mb-4">
              MP4 is the most widely supported video format in the world. Developed by the Moving Picture Experts Group,
              it's become the de facto standard for digital video.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Pros:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Plays on virtually every device, browser, and media player</li>
              <li>Excellent compression with H.264 codec</li>
              <li>Native support on all social media platforms</li>
              <li>Good balance of quality and file size</li>
              <li>Supports subtitles, chapters, and multiple audio tracks</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Cons:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Not ideal for professional editing workflows</li>
              <li>H.264 licensing fees (though usually invisible to consumers)</li>
              <li>Less efficient than newer codecs like H.265 or AV1</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">When to Use MP4:</h3>
            <p className="text-gray-700 mb-6">
              Use MP4 when you need maximum compatibility. It's the safest choice for sharing videos,
              uploading to social media, or playing on different devices. When in doubt, choose MP4.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">MOV (QuickTime)</h2>
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🍎</span>
                <span className="font-bold text-gray-900">Apple's Native Format</span>
              </div>
              <p className="text-gray-700 mb-0">Best for: Mac/iOS users, professional video editing, high-quality archives</p>
            </div>

            <p className="text-gray-700 mb-4">
              Developed by Apple for QuickTime, MOV is the default format for iPhones, iPads, and Mac computers.
              It's technically similar to MP4 (both based on MPEG-4 standard) but optimized for Apple's ecosystem.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Pros:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Excellent quality, especially from Apple devices</li>
              <li>Supports professional codecs like ProRes</li>
              <li>Native editing support in Final Cut Pro and other pro tools</li>
              <li>Can contain higher-quality video than typical MP4</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Cons:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Less compatible with Windows and Android devices</li>
              <li>Larger file sizes, especially with ProRes</li>
              <li>May require QuickTime or specific codecs on non-Apple devices</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">When to Use MOV:</h3>
            <p className="text-gray-700 mb-6">
              Keep videos in MOV if you're working within Apple's ecosystem or need to preserve maximum quality
              for editing. <Link href="/blog/how-to-convert-mov-to-mp4" className="text-blue-600 hover:text-blue-700">Convert to MP4</Link> when
              sharing with others or uploading to the web.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">WebM</h2>
            <div className="bg-orange-50 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🌐</span>
                <span className="font-bold text-orange-900">The Open Web Format</span>
              </div>
              <p className="text-orange-800 mb-0">Best for: Web embedding, HTML5 video, royalty-free requirements</p>
            </div>

            <p className="text-gray-700 mb-4">
              WebM is an open, royalty-free format developed by Google specifically for web use.
              It uses VP8/VP9 video codecs and Vorbis/Opus audio codecs.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Pros:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Completely royalty-free and open source</li>
              <li>Excellent compression efficiency with VP9</li>
              <li>Native support in Chrome, Firefox, and Edge</li>
              <li>Optimized for web streaming</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Cons:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Limited support on Apple devices (Safari has partial support)</li>
              <li>Not supported by many media players and devices</li>
              <li>Less widely used than MP4</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">When to Use WebM:</h3>
            <p className="text-gray-700 mb-6">
              Use WebM for web development when you need a royalty-free format and can provide MP4 fallback.
              It's also popular for animated content and screen recordings on the web.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">MKV (Matroska)</h2>
            <div className="bg-purple-50 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🎬</span>
                <span className="font-bold text-purple-900">The Flexible Container</span>
              </div>
              <p className="text-purple-800 mb-0">Best for: Movie archives, multiple audio/subtitle tracks, high-quality storage</p>
            </div>

            <p className="text-gray-700 mb-4">
              MKV is an open-source container format known for its flexibility. It can hold virtually any type of
              video, audio, and subtitle format, making it popular for movie enthusiasts and archivists.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Pros:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Supports unlimited audio, video, and subtitle tracks</li>
              <li>Can contain almost any codec</li>
              <li>Supports chapters and rich metadata</li>
              <li>Open source and free to use</li>
              <li>Excellent for archiving movies with multiple languages</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Cons:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Poor compatibility with mobile devices and smart TVs</li>
              <li>Not supported by most social media platforms</li>
              <li>Requires specific software to play reliably</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">When to Use MKV:</h3>
            <p className="text-gray-700 mb-6">
              Use MKV for personal movie libraries where you want to preserve multiple audio tracks and subtitles.
              Convert to MP4 when you need to share or play on various devices.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">AVI (Audio Video Interleave)</h2>
            <div className="bg-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">📼</span>
                <span className="font-bold text-gray-900">The Legacy Format</span>
              </div>
              <p className="text-gray-700 mb-0">Best for: Legacy systems, simple video storage</p>
            </div>

            <p className="text-gray-700 mb-4">
              AVI is one of the oldest video formats, introduced by Microsoft in 1992. While largely obsolete
              for modern use, you may still encounter AVI files from older cameras or archives.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Pros:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Wide support on Windows systems</li>
              <li>Simple structure, easy to edit</li>
              <li>Good compatibility with older software</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Cons:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Large file sizes compared to modern formats</li>
              <li>Limited codec support</li>
              <li>No native streaming support</li>
              <li>Outdated technology</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">When to Use AVI:</h3>
            <p className="text-gray-700 mb-6">
              Generally, don't create new AVI files. If you have existing AVI files, consider converting them
              to MP4 for better compatibility and smaller file sizes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Quick Comparison Table</h2>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Format</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Compatibility</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">File Size</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Best For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900">MP4</td>
                    <td className="px-4 py-3 text-green-600">Excellent</td>
                    <td className="px-4 py-3 text-gray-700">Small-Medium</td>
                    <td className="px-4 py-3 text-gray-700">Everything</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900">MOV</td>
                    <td className="px-4 py-3 text-yellow-600">Good (Apple)</td>
                    <td className="px-4 py-3 text-gray-700">Medium-Large</td>
                    <td className="px-4 py-3 text-gray-700">Mac/iOS, Editing</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900">WebM</td>
                    <td className="px-4 py-3 text-yellow-600">Good (Web)</td>
                    <td className="px-4 py-3 text-gray-700">Small</td>
                    <td className="px-4 py-3 text-gray-700">Web embedding</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900">MKV</td>
                    <td className="px-4 py-3 text-red-600">Limited</td>
                    <td className="px-4 py-3 text-gray-700">Varies</td>
                    <td className="px-4 py-3 text-gray-700">Archives, Movies</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900">AVI</td>
                    <td className="px-4 py-3 text-yellow-600">Good (Windows)</td>
                    <td className="px-4 py-3 text-gray-700">Large</td>
                    <td className="px-4 py-3 text-gray-700">Legacy systems</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Bottom Line</h2>
            <p className="text-gray-700 mb-4">
              For most people, <strong>MP4 is the best choice</strong>. It offers the best balance of compatibility,
              quality, and file size. Use other formats when you have specific needs:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li><strong>MOV</strong> for Apple ecosystem and professional editing</li>
              <li><strong>WebM</strong> for royalty-free web video</li>
              <li><strong>MKV</strong> for movie archives with multiple tracks</li>
              <li><strong>AVI</strong> only for legacy compatibility</li>
            </ul>
            <p className="text-gray-700">
              Need to convert between formats? <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">Try Convert Videos Free</Link> —
              convert any video to MP4 directly in your browser with complete privacy.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-3">Convert Any Video to MP4</h3>
            <p className="mb-6 text-blue-100">
              Free, private, browser-based conversion. No uploads required.
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
              <h3 className="font-bold text-gray-900 mb-2">How to Convert MOV to MP4 Without Losing Quality</h3>
              <p className="text-gray-600 text-sm">Step-by-step guide to converting MOV files with optimal settings.</p>
            </Link>
            <Link href="/blog/webcodecs-browser-video-processing" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-gray-900 mb-2">WebCodecs: Browser-Based Video Processing</h3>
              <p className="text-gray-600 text-sm">How modern browsers can process video without uploads.</p>
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
