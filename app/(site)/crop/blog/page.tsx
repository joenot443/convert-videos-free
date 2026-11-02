import Link from 'next/link';
import { Metadata } from 'next';
import GoogleAdSense from '@/components/GoogleAdSense';

export const metadata: Metadata = {
  alternates: { canonical: 'https://cropvideosfree.com/crop/blog' },
  title: 'Video Cropping Guides & Tips | Crop Videos Free Blog',
  description: 'Learn about video cropping, aspect ratios, and how to resize your videos for any platform. Expert guides for TikTok, Instagram, YouTube and more.',
};

const articles = [
  {
    slug: 'crop-videos-for-social-media',
    title: 'How to Crop Videos for Social Media: A Platform-by-Platform Guide',
    description: 'Get your videos looking right on every platform. Learn the ideal dimensions for TikTok, Instagram Reels, YouTube Shorts, and more.',
    date: '2024-12-20',
    readTime: '6 min read',
    category: 'Guides',
  },
  {
    slug: 'understanding-aspect-ratios',
    title: 'Understanding Video Aspect Ratios: From Cinematic to Vertical',
    description: 'What do 16:9, 9:16, 4:3, and 1:1 actually mean? A clear explanation of aspect ratios and when to use each one.',
    date: '2024-12-19',
    readTime: '5 min read',
    category: 'Education',
  },
  {
    slug: 'why-crop-in-browser',
    title: 'Why Cropping Videos in Your Browser Makes Sense',
    description: 'No software to install, no files uploaded to servers. How browser-based video tools work and why they might be the best choice for quick edits.',
    date: '2024-12-18',
    readTime: '4 min read',
    category: 'Technology',
  },
];

export default function CropBlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/crop"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Crop Tool
        </Link>

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Video Cropping Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Tips, guides, and everything you need to know about resizing and cropping videos.
          </p>
        </header>

        <div className="mb-8">
          <GoogleAdSense
            dataAdSlot="XXXXXXXXXX"
            dataAdFormat="auto"
            dataFullWidthResponsive={true}
          />
        </div>

        <div className="space-y-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/crop/blog/${article.slug}`}
              className="block bg-gray-800/50 backdrop-blur rounded-2xl hover:bg-gray-800/70 transition-all p-6 md:p-8 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full">
                  {article.category}
                </span>
                <span className="text-sm text-gray-400">{article.readTime}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3 hover:text-purple-300 transition-colors">
                {article.title}
              </h2>
              <p className="text-gray-300 mb-4">
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

        <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to Crop Your Videos?</h2>
          <p className="mb-6 text-purple-100">
            Use our free, browser-based video cropper. No uploads, no software to install.
          </p>
          <Link
            href="/crop"
            className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
          >
            Start Cropping
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <footer className="text-center mt-12 text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Crop Videos Free. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
