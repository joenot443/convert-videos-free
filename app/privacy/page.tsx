import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="text-sm text-gray-500 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Commitment to Privacy</h2>
              <p className="mb-4">
                At Convert Videos Free, your privacy is our top priority. This Privacy Policy explains how our service operates
                with a complete commitment to protecting your personal information and files.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
                <p className="font-semibold text-blue-800">
                  The Simple Truth: We don't collect, store, or have access to any of your data or files. Everything happens in your browser.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Don't Collect</h2>
              <p className="mb-4">Unlike traditional online services, Convert Videos Free operates entirely in your browser. We do NOT:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Upload or store your video files on any server</li>
                <li>Access the content of your files</li>
                <li>Collect personal information such as names, email addresses, or phone numbers</li>
                <li>Track your conversion history</li>
                <li>Store any metadata from your files</li>
                <li>Require user registration or login</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How Convert Videos Free Works</h2>
              <p className="mb-4">
                Our service uses modern browser technology called WebCodecs API to process videos entirely on your device:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>You select a video file from your device</li>
                <li>Your browser processes the file locally using your device's resources</li>
                <li>The converted file is saved directly to your device</li>
                <li>At no point does your file leave your device or get transmitted over the internet</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Analytics and Cookies</h2>

              <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">Google Analytics</h3>
              <p className="mb-4">
                We use Google Analytics to understand how visitors use our website. This helps us improve the service.
                Google Analytics collects anonymous information such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Pages visited</li>
                <li>Time spent on the site</li>
                <li>Browser type and version</li>
                <li>General geographic location (country/city level)</li>
                <li>Device type (desktop/mobile)</li>
              </ul>
              <p className="mb-4">
                This information is aggregated and anonymous. We cannot identify individual users from this data.
                You can opt out of Google Analytics by using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Google Analytics Opt-out Browser Add-on</a>.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">Google AdSense</h3>
              <p className="mb-4">
                We display advertisements through Google AdSense to support the free operation of this service. Google AdSense may use cookies to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Display relevant advertisements</li>
                <li>Prevent showing the same ads repeatedly</li>
                <li>Detect and prevent invalid clicks</li>
              </ul>
              <p className="mb-4">
                You can learn more about how Google uses your data at <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Google's Privacy Policy</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Third-Party Services</h2>
              <p className="mb-4">
                Convert Videos Free uses the following third-party services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google Analytics:</strong> For anonymous usage statistics</li>
                <li><strong>Google AdSense:</strong> For displaying advertisements</li>
                <li><strong>Browser APIs:</strong> WebCodecs API for video processing (part of your browser, not a third-party service)</li>
              </ul>
              <p className="mt-4">
                These services have their own privacy policies and data handling practices. We encourage you to review their policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Security</h2>
              <p className="mb-4">
                Since we don't collect or store any of your data, there's no risk of data breaches affecting your personal information or files.
                Your videos are processed entirely within your browser's sandboxed environment, which provides additional security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Children's Privacy</h2>
              <p className="mb-4">
                Convert Videos Free does not knowingly collect any information from children under 13 years of age.
                Since we don't collect personal information from any users, children's privacy is inherently protected.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
              <p className="mb-4">
                Since we don't collect personal data, traditional data rights (access, deletion, portability) don't apply.
                However, you always have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the service without providing any personal information</li>
                <li>Block cookies through your browser settings</li>
                <li>Opt out of Google Analytics</li>
                <li>Stop using the service at any time without any data retention concerns</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Changes to This Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
                Since we don't collect user information, we cannot notify you directly of changes, so we encourage you to review this policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <p className="mb-4">
                If you have any questions or concerns about this Privacy Policy or our practices, please contact:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2"><strong>Developer:</strong> Joe Crozier</p>
                <p className="mb-2"><strong>Website:</strong> <a href="https://joecrozier.ca" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">joecrozier.ca</a></p>
                <p><strong>Location:</strong> Canada</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Consent</h2>
              <p>
                By using Convert Videos Free, you consent to this Privacy Policy. If you do not agree with this policy,
                please do not use our service.
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