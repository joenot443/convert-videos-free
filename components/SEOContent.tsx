'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Shield, Globe, Download, Settings, FileVideo } from 'lucide-react';

const faqs = [
  {
    question: 'How does the online video converter work?',
    answer: 'Our video converter uses the WebCodecs API to process videos directly in your browser. Simply select or drag a video file, choose your settings, and click convert. The entire conversion happens on your device without uploading files to any server.'
  },
  {
    question: 'Which video formats can I convert to MP4?',
    answer: 'Convert Videos Free supports MOV, WebM, MKV, and AVI formats. All videos are converted to MP4 with H.264 video codec and AAC audio codec for maximum compatibility across all devices and platforms.'
  },
  {
    question: 'Is there a file size limit for video conversion?',
    answer: 'Yes, the maximum file size is 2GB per video. This limit ensures smooth processing in your browser. For larger files, consider using desktop software or splitting your video into smaller segments.'
  },
  {
    question: 'Is my video data safe and private?',
    answer: 'Absolutely! Your videos never leave your device. All processing happens locally in your browser using WebCodecs technology. We don\'t upload, store, or have access to any of your files.'
  },
  {
    question: 'Do I need to install software to convert videos?',
    answer: 'No installation required! Convert Videos Free works entirely in your web browser. Just visit our site and start converting immediately. It works on Chrome, Edge, and Safari (16.4+).'
  },
  {
    question: 'Can I convert multiple videos at once?',
    answer: 'Yes! You can queue up to 10 videos for conversion. Add all your files to the queue and click "Start Processing" to convert them sequentially.'
  },
  {
    question: 'What quality settings are available?',
    answer: 'Choose from three quality presets: Low (2 Mbps), Medium (5 Mbps), or High (10 Mbps). You can also set maximum resolution caps: Original, 1080p, 720p, or 480p.'
  },
  {
    question: 'Why is the converted file sometimes larger than the original?',
    answer: 'File size depends on the codec and compression used. Some formats like MOV with ProRes use very efficient compression. Re-encoding to H.264 MP4 might result in a larger file, especially at higher quality settings.'
  }
];

const features = [
  {
    icon: Shield,
    title: '100% Private & Secure',
    description: 'Your videos never leave your browser. No uploads, no cloud storage, complete privacy guaranteed.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast Conversion',
    description: 'Powered by WebCodecs API for hardware-accelerated video processing directly in your browser.'
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description: 'No software installation needed. Works on any modern browser - Chrome, Edge, or Safari.'
  },
  {
    icon: Download,
    title: 'Free Forever',
    description: 'Convert unlimited videos without watermarks, registration, or hidden fees. Completely free to use.'
  },
  {
    icon: Settings,
    title: 'Customizable Quality',
    description: 'Choose your preferred quality settings and resolution to balance file size and video quality.'
  },
  {
    icon: FileVideo,
    title: 'Multiple Formats',
    description: 'Convert MOV, WebM, MKV, and AVI files to universally compatible MP4 format.'
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full py-4 flex items-start justify-between text-left hover:bg-gray-50 transition-colors px-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 px-1">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function SEOContent() {
  return (
    <div className="mt-12 space-y-12">
      {/* How It Works Section */}
      <section className="bg-white/60 backdrop-blur-sm border border-gray-300/60 rounded-2xl p-6 sm:p-8 shadow-lg shadow-gray-200/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          How to Convert Videos to MP4 Online
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-lg">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Upload Your Video</h3>
            <p className="text-sm text-gray-600">
              Drag and drop or click to browse. Support for MOV, WebM, MKV, and AVI files up to 2GB.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-lg">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Choose Settings</h3>
            <p className="text-sm text-gray-600">
              Select quality (Low/Medium/High) and maximum resolution. Or use default settings for best results.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-lg">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Convert & Download</h3>
            <p className="text-sm text-gray-600">
              Click convert and wait. Your MP4 file will download automatically when ready.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white/60 backdrop-blur-sm border border-gray-300/60 rounded-2xl p-6 sm:p-8 shadow-lg shadow-gray-200/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Why Choose Convert Videos Free?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white/60 backdrop-blur-sm border border-gray-300/60 rounded-2xl p-6 sm:p-8 shadow-lg shadow-gray-200/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>

      {/* Additional SEO Content */}
      <section className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-200/30 rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Free Online Video Converter - No Installation Required
        </h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Convert Videos Free is the easiest way to convert your video files to MP4 format online.
            Unlike traditional video converters that require software installation or file uploads to servers,
            our tool works entirely in your web browser using cutting-edge WebCodecs technology.
          </p>
          <p>
            Whether you need to convert MOV files from your iPhone, WebM videos from the internet, or MKV
            files from your collection, our converter handles them all. The output MP4 files use H.264 video
            codec and AAC audio codec, ensuring compatibility with all devices, platforms, and video players.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
            Perfect for Content Creators and Professionals
          </h3>
          <p>
            Content creators, video editors, and professionals choose Convert Videos Free for its speed,
            privacy, and convenience. Process your videos locally without worrying about internet speed,
            file size limits of cloud services, or privacy concerns about uploading sensitive content.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
            Browser-Based Video Processing Technology
          </h3>
          <p>
            Our converter leverages the WebCodecs API, a modern browser technology that provides low-level
            access to video and audio codecs. This means you get desktop-quality video conversion directly
            in your browser, with hardware acceleration support for faster processing.
          </p>
        </div>
      </section>
    </div>
  );
}