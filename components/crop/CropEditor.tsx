'use client';

import { useRef, useCallback, useState } from 'react';
import { useCropStore } from '@/lib/crop/useCropStore';
import { cropToPixels } from '@/lib/crop/cropMath';
import { VideoDropZone } from './VideoDropZone';
import { VideoCanvas, VideoCanvasHandle } from './VideoCanvas';
import { CropOverlay } from './CropOverlay';
import { AspectRatioSelector } from './AspectRatioSelector';
import { Timeline } from './Timeline';
import { ExportButton } from './ExportButton';
import { X, RotateCcw, Crop, Scissors, Shield, Zap, Download, MonitorPlay, ChevronDown, ChevronUp } from 'lucide-react';

export function CropEditor() {
  const videoCanvasRef = useRef<VideoCanvasHandle>(null);

  const {
    file,
    videoMeta,
    clearFile,
    crop,
    trim,
    resetCrop,
    resetTrim,
  } = useCropStore();

  // Calculate output dimensions
  const outputDimensions = videoMeta
    ? cropToPixels(crop, videoMeta.width, videoMeta.height)
    : null;

  // Handle seek from timeline
  const handleSeek = useCallback((time: number) => {
    videoCanvasRef.current?.seek(time);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#1a1a2e]">
      {/* Header - shown when editing */}
      {file && (
        <header className="border-b border-white/10 bg-[#1a1a2e]/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-lg">
                  <Crop className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Crop Videos Free</h1>
                  <p className="text-gray-400 text-xs">
                    {videoMeta ? `${videoMeta.filename} (${videoMeta.width}×${videoMeta.height})` : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={clearFile}
                data-testid="clear-file"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                New Video
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        {!file ? (
          // Landing page when no file is loaded
          <div className="py-8 sm:py-12">
            {/* Hero Section */}
            <div className="text-center mb-10">
              {/* Animated Icon */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-2xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-purple-500 to-blue-600 p-4 rounded-2xl shadow-2xl">
                    <Crop className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
                Crop Videos{' '}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Free</span>
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-purple-500 opacity-50" viewBox="0 0 100 12" preserveAspectRatio="none">
                    <path d="M0,6 Q25,0 50,6 T100,6" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-6">
                Crop, resize, and trim your videos directly in your browser.
                <span className="text-gray-400"> No uploads, no watermarks, completely free.</span>
              </p>

              {/* Feature Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                <div className="flex items-center text-sm text-white bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30">
                  <Shield className="w-4 h-4 mr-2 text-green-400" />
                  <span>100% Private</span>
                </div>
                <div className="flex items-center text-sm text-white bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30">
                  <Zap className="w-4 h-4 mr-2 text-blue-400" />
                  <span>WebCodecs Powered</span>
                </div>
                <div className="flex items-center text-sm text-white bg-purple-500/20 px-4 py-2 rounded-full border border-purple-500/30">
                  <MonitorPlay className="w-4 h-4 mr-2 text-purple-400" />
                  <span>No Watermarks</span>
                </div>
              </div>
            </div>

            {/* Drop Zone */}
            <div className="max-w-3xl mx-auto mb-16">
              <VideoDropZone />
            </div>

            {/* How It Works Section */}
            <section className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <StepCard
                  number="1"
                  title="Upload Your Video"
                  description="Drag and drop or click to select any video file (MP4, MOV, WebM, MKV, AVI)"
                />
                <StepCard
                  number="2"
                  title="Crop & Trim"
                  description="Use the visual editor to select your crop area and set trim points on the timeline"
                />
                <StepCard
                  number="3"
                  title="Export & Download"
                  description="Click export and download your cropped video - all processed locally in your browser"
                />
              </div>
            </section>

            {/* Features Section */}
            <section className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
                Why Use Crop Videos Free?
              </h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <FeatureCard
                  icon={<Shield className="w-6 h-6 text-green-400" />}
                  title="Complete Privacy"
                  description="Your videos never leave your device. All processing happens locally in your browser using WebCodecs API."
                />
                <FeatureCard
                  icon={<Crop className="w-6 h-6 text-purple-400" />}
                  title="Visual Crop Editor"
                  description="Intuitive drag-and-drop interface with L-shaped handles. Choose from preset aspect ratios or go freeform."
                />
                <FeatureCard
                  icon={<Scissors className="w-6 h-6 text-blue-400" />}
                  title="Timeline Trimming"
                  description="Filmstrip thumbnail preview makes it easy to find the perfect start and end points for your clip."
                />
                <FeatureCard
                  icon={<Download className="w-6 h-6 text-orange-400" />}
                  title="High Quality Export"
                  description="Export to MP4 with H.264 video and AAC audio. No quality loss, no watermarks added."
                />
              </div>
            </section>

            {/* Use Cases Section */}
            <section className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
                Perfect For
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <UseCaseCard title="Social Media" description="Crop to 9:16 for TikTok, Reels, Shorts" />
                <UseCaseCard title="Presentations" description="Trim videos to highlight key moments" />
                <UseCaseCard title="Tutorials" description="Remove unwanted screen areas" />
                <UseCaseCard title="Content Creation" description="Resize for different platforms" />
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
                Frequently Asked Questions
              </h2>
              <div className="max-w-3xl mx-auto bg-[#16213e]/50 rounded-2xl border border-white/10 overflow-hidden">
                <FAQItem
                  question="Is this really free?"
                  answer="Yes, completely free! There are no hidden fees, no premium tiers, and no limitations. We don't even require you to create an account."
                />
                <FAQItem
                  question="Are my videos uploaded to a server?"
                  answer="No. Your videos are processed entirely in your browser using the WebCodecs API. They never leave your device, ensuring complete privacy."
                />
                <FAQItem
                  question="What video formats are supported?"
                  answer="We support MP4, MOV, WebM, MKV, and AVI input files. All videos are exported as MP4 with H.264 video and AAC audio for maximum compatibility."
                />
                <FAQItem
                  question="Is there a file size limit?"
                  answer="You can process videos up to 2GB. Larger files may work but could cause performance issues depending on your device's memory."
                />
                <FAQItem
                  question="Which browsers are supported?"
                  answer="This tool works in Chrome 94+, Edge 94+, and Safari 16.4+. Firefox support is coming when WebCodecs becomes available."
                />
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 pt-8">
              <div className="flex flex-col items-center space-y-4">
                <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
                  <a href="/" className="text-gray-400 hover:text-white transition-colors">
                    Convert Videos
                  </a>
                  <a href="/blog" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </a>
                  <a href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </a>
                  <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy
                  </a>
                  <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms
                  </a>
                </nav>

                <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400">
                  <div>
                    Made with <span className="text-red-400">♥</span> by{' '}
                    <a href="https://joecrozier.ca" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                      Joe Crozier
                    </a>
                  </div>
                  <div className="hidden sm:block text-gray-600">•</div>
                  <div>
                    Powered by <span className="font-semibold text-gray-300">WebCodecs API</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  © {new Date().getFullYear()} Crop Videos Free. All rights reserved.
                </div>
              </div>
            </footer>
          </div>
        ) : (
          // Editor when file is loaded
          <div className="py-6 space-y-6">
            {/* Video canvas with crop overlay */}
            <VideoCanvas ref={videoCanvasRef}>
              {videoMeta && videoCanvasRef.current?.containerRef && (
                <CropOverlay containerRef={videoCanvasRef.current.containerRef} />
              )}
            </VideoCanvas>

            {/* Timeline with filmstrip and trim handles */}
            {videoMeta && (
              <div className="bg-[#16213e]/80 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <Timeline onSeek={handleSeek} />
              </div>
            )}

            {/* Controls row */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              {/* Aspect ratio selector */}
              <div className="bg-[#16213e]/80 backdrop-blur-sm rounded-xl p-4 flex-1 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-300">Aspect Ratio</h3>
                  <button
                    onClick={resetCrop}
                    data-testid="reset-crop"
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </div>
                <AspectRatioSelector />
              </div>

              {/* Output info */}
              <div className="bg-[#16213e]/80 backdrop-blur-sm rounded-xl p-4 flex-1 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-300">Output</h3>
                  <button
                    onClick={resetTrim}
                    data-testid="reset-trim"
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Trim
                  </button>
                </div>
                {outputDimensions && videoMeta && (
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>
                      <span className="text-gray-500">Dimensions:</span>{' '}
                      <span data-testid="output-width">{outputDimensions.width}</span>
                      {' × '}
                      <span data-testid="output-height">{outputDimensions.height}</span>
                    </p>
                    <p>
                      <span className="text-gray-500">Position:</span>{' '}
                      X:{outputDimensions.left}, Y:{outputDimensions.top}
                    </p>
                    <p>
                      <span className="text-gray-500">Duration:</span>{' '}
                      <span data-testid="output-duration">{(trim.end - trim.start).toFixed(1)}s</span>
                      {trim.start > 0 || trim.end < videoMeta.duration ? (
                        <span className="text-gray-600 ml-1">
                          (trimmed from {videoMeta.duration.toFixed(1)}s)
                        </span>
                      ) : null}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Export button */}
            <div className="flex justify-center">
              <ExportButton />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="bg-[#16213e]/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
        <span className="text-white font-bold text-lg">{number}</span>
      </div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-[#16213e]/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 flex gap-4">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function UseCaseCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-[#16213e]/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
      <h3 className="font-semibold text-white mb-1 text-sm">{title}</h3>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        className="w-full py-4 px-6 flex items-start justify-between text-left hover:bg-white/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-white pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 px-6">
          <p className="text-gray-400 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
