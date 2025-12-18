import Link from 'next/link';

export default function TermsAndConditionsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>

          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="text-sm text-gray-500 mb-6">Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Agreement to Terms</h2>
              <p className="mb-4">
                By accessing and using Convert Videos Free ("the Service"), you agree to be bound by these Terms and Conditions.
                If you do not agree with any part of these terms, you should not use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Description of Service</h2>
              <p className="mb-4">
                Convert Videos Free is a free, browser-based video conversion tool that allows users to convert video files
                to MP4 format. The Service operates entirely within your web browser using WebCodecs API technology, meaning:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All processing happens locally on your device</li>
                <li>No files are uploaded to our servers</li>
                <li>No user registration is required</li>
                <li>The Service is provided free of charge</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Acceptable Use</h2>
              <p className="mb-4">You agree to use Convert Videos Free only for lawful purposes. You will NOT use the Service to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Convert copyrighted content without proper authorization</li>
                <li>Process illegal or inappropriate content</li>
                <li>Attempt to disrupt or damage the Service</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Intellectual Property Rights</h2>
              <p className="mb-4">
                <strong>Your Content:</strong> You retain all rights to the videos you process using the Service.
                Since files are processed locally in your browser and never uploaded to our servers, we have no access to
                or claims on your content.
              </p>
              <p className="mb-4">
                <strong>Our Service:</strong> The Convert Videos Free website, its design, functionality, and code are
                the property of Joe Crozier and are protected by copyright and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Disclaimer of Warranties</h2>
              <p className="mb-4">
                Convert Videos Free is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The Service will meet your specific requirements</li>
                <li>The Service will be uninterrupted, error-free, or free of viruses</li>
                <li>The results obtained from the Service will be accurate or reliable</li>
                <li>The quality of converted videos will meet your expectations</li>
                <li>Any errors in the Service will be corrected</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Limitation of Liability</h2>
              <p className="mb-4">
                To the maximum extent permitted by law, Joe Crozier and Convert Videos Free shall not be liable for any:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Direct, indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
                <li>Damages resulting from your use or inability to use the Service</li>
                <li>Damages resulting from any errors, mistakes, or inaccuracies in the Service</li>
                <li>Personal injury or property damage resulting from your use of the Service</li>
              </ul>
              <p className="mb-4">
                This limitation applies even if we have been advised of the possibility of such damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Indemnification</h2>
              <p className="mb-4">
                You agree to indemnify, defend, and hold harmless Joe Crozier and Convert Videos Free from any claims,
                damages, losses, liabilities, costs, and expenses (including attorney's fees) arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms and Conditions</li>
                <li>Your violation of any rights of another party</li>
                <li>Your violation of any applicable laws</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. User Responsibilities</h2>
              <p className="mb-4">As a user of Convert Videos Free, you are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ensuring you have the right to convert any videos you process</li>
                <li>Backing up your original files before conversion</li>
                <li>Checking that your browser meets the minimum requirements</li>
                <li>Understanding that conversion quality depends on your device's capabilities</li>
                <li>Accepting that large files may take significant time to process</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Privacy</h2>
              <p className="mb-4">
                Your use of Convert Videos Free is also governed by our Privacy Policy. By using the Service,
                you consent to the practices described in the Privacy Policy. Key points:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We don't collect or store your files</li>
                <li>All processing happens in your browser</li>
                <li>We use Google Analytics for anonymous usage statistics</li>
                <li>We display ads through Google AdSense</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Modifications to Service</h2>
              <p className="mb-4">
                We reserve the right to modify, suspend, or discontinue Convert Videos Free at any time without notice.
                We will not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Changes to Terms</h2>
              <p className="mb-4">
                We may update these Terms and Conditions from time to time. Changes will be posted on this page with an
                updated effective date. Your continued use of the Service after any changes indicates your acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Governing Law</h2>
              <p className="mb-4">
                These Terms and Conditions are governed by and construed in accordance with the laws of Canada,
                without regard to its conflict of law provisions. Any disputes arising from these terms or your use of
                the Service shall be subject to the exclusive jurisdiction of the courts in Canada.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Severability</h2>
              <p className="mb-4">
                If any provision of these Terms and Conditions is found to be invalid or unenforceable by a court,
                the remaining provisions will continue to be in effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">14. Entire Agreement</h2>
              <p className="mb-4">
                These Terms and Conditions, together with our Privacy Policy, constitute the entire agreement between
                you and Convert Videos Free regarding your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">15. Contact Information</h2>
              <p className="mb-4">
                For questions about these Terms and Conditions, please contact:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2"><strong>Developer:</strong> Joe Crozier</p>
                <p className="mb-2"><strong>Website:</strong> <a href="https://joecrozier.ca" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">joecrozier.ca</a></p>
                <p><strong>Location:</strong> Canada</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acknowledgment</h2>
              <p>
                By using Convert Videos Free, you acknowledge that you have read, understood, and agree to be bound by
                these Terms and Conditions.
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