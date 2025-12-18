import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Converter
        </Link>

        {/* Page Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Convert Videos Free</h1>

          <div className="prose prose-lg max-w-none text-gray-600">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Convert Videos Free</h2>
              <p className="mb-4">
                Convert Videos Free is a powerful, privacy-focused video conversion tool that runs entirely in your web browser.
                No uploads, no server processing, no data collection - just fast, secure video conversion powered by modern web technology.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Built by an Engineer Who Values Privacy</h2>
              <p className="mb-4">
                Hi, I'm <a href="https://joecrozier.ca" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Joe Crozier</a>,
                an engineer from Canada. I built Convert Videos Free because I needed a simple, reliable way to convert video files without
                worrying about privacy or file size limits.
              </p>
              <p className="mb-4">
                Too many online converters require you to upload your files to their servers, which raises privacy concerns and takes
                unnecessary time. With Convert Videos Free, your videos never leave your device - everything happens right in your browser
                using the cutting-edge WebCodecs API.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Features</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>100% Privacy:</strong> Your files never leave your device</li>
                <li><strong>No File Size Limits:</strong> Convert videos as large as your device can handle</li>
                <li><strong>No Registration:</strong> Start converting immediately, no account needed</li>
                <li><strong>Modern Technology:</strong> Powered by WebCodecs API for fast, efficient conversion</li>
                <li><strong>Universal Output:</strong> Converts to MP4 (H.264 + AAC) for maximum compatibility</li>
                <li><strong>Free Forever:</strong> No premium tiers, no hidden fees</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
              <p className="mb-4">
                Convert Videos Free uses the WebCodecs API, a modern browser technology that provides low-level access to video and audio codecs.
                This allows us to:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Decode your input video file directly in the browser</li>
                <li>Re-encode it to the universally compatible MP4 format</li>
                <li>Save the converted file to your device</li>
              </ol>
              <p className="mt-4">
                All processing happens locally using your device's CPU and GPU. This means your conversion speed depends on your device's
                capabilities, but your privacy is always guaranteed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Supported Formats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Input Formats:</h3>
                  <ul className="list-disc pl-6 text-sm">
                    <li>MP4</li>
                    <li>MOV</li>
                    <li>WebM</li>
                    <li>MKV</li>
                    <li>AVI</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Output Format:</h3>
                  <ul className="list-disc pl-6 text-sm">
                    <li>MP4 (H.264 video + AAC audio)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Browser Compatibility</h2>
              <p className="mb-4">
                Convert Videos Free works best on modern browsers that support the WebCodecs API:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Chrome 94 or later (recommended)</li>
                <li>Microsoft Edge 94 or later</li>
                <li>Safari 16.4 or later</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact & Support</h2>
              <p className="mb-4">
                Have questions or feedback? Feel free to reach out:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Visit my website: <a href="https://joecrozier.ca" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">joecrozier.ca</a></li>
                <li>This tool is open source and contributions are welcome</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thank You</h2>
              <p>
                Thank you for using Convert Videos Free. I hope it makes your video conversion needs simpler and more private.
                If you find this tool useful, please share it with others who might benefit from a privacy-first video converter.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Convert Videos Free. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}