import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Conversion Guides & Tips | Convert Videos Free Blog',
  description: 'Learn about video formats, conversion techniques, and get the most out of your video files. Expert guides on MOV, MP4, WebM, and more.',
};

const articles = [
  {
    slug: 'how-to-convert-mov-to-mp4',
    title: 'How to Convert MOV to MP4 Without Losing Quality',
    description: 'Learn the best methods to convert MOV files to MP4 while preserving video quality. Understand the differences between formats and choose the right settings.',
    date: '2024-12-15',
    readTime: '5 min read',
    category: 'Guides',
  },
  {
    slug: 'best-video-formats-explained',
    title: 'Video Formats Explained: MP4, MOV, WebM, MKV',
    description: 'A comprehensive guide to video formats. Learn the pros and cons of each format and when to use them for YouTube, social media, or archiving.',
    date: '2024-12-14',
    readTime: '8 min read',
    category: 'Education',
  },
  {
    slug: 'webcodecs-browser-video-processing',
    title: 'WebCodecs: The Future of Browser-Based Video Processing',
    description: 'Discover how WebCodecs API is revolutionizing video processing in the browser. Learn why local processing means better privacy and faster conversions.',
    date: '2024-12-13',
    readTime: '6 min read',
    category: 'Technology',
  },
  {
    slug: 'video-settings-for-social-media',
    title: 'Best Video Settings for YouTube, TikTok, Instagram and More',
    description: 'Optimize your videos for every platform. Resolution, bitrate, and format recommendations for YouTube, TikTok, Instagram, Twitter, and Facebook.',
    date: '2024-12-12',
    readTime: '7 min read',
    category: 'Guides',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Converter
        </Link>

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Video Conversion Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Guides, tips, and insights to help you get the most out of your video files.
          </p>
        </header>

        <div className="space-y-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 md:p-8 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {article.category}
                </span>
                <span className="text-sm text-gray-500">{article.readTime}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                {article.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {article.description}
              </p>
              <time dateTime={article.date} className="text-sm text-gray-500">
                {new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to Convert Your Videos?</h2>
          <p className="mb-6 text-blue-100">
            Use our free, privacy-focused video converter. No uploads, no registration required.
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

        <footer className="text-center mt-12 text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Convert Videos Free. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
