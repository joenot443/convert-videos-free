import Link from 'next/link';
import { Metadata } from 'next';
import GoogleAdSense from '@/components/GoogleAdSense';

export const metadata: Metadata = {
  alternates: { canonical: 'https://cropvideosfree.com/crop/blog/understanding-aspect-ratios' },
  title: 'Understanding Video Aspect Ratios | Crop Videos Free',
  description: 'What do 16:9, 9:16, 4:3, and 1:1 actually mean? A clear explanation of aspect ratios for video, from cinematic widescreen to vertical mobile.',
  openGraph: {
    title: 'Understanding Video Aspect Ratios: From Cinematic to Vertical',
    description: 'A clear explanation of aspect ratios and when to use each one.',
    type: 'article',
    publishedTime: '2024-12-19',
    authors: ['Joe Crozier'],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Understanding Video Aspect Ratios: From Cinematic to Vertical',
    description: 'What do 16:9, 9:16, 4:3, and 1:1 actually mean? A clear explanation of aspect ratios for video, from cinematic widescreen to vertical mobile.',
    datePublished: '2024-12-19',
    dateModified: '2024-12-19',
    author: {
      '@type': 'Person',
      name: 'Joe Crozier',
      url: 'https://joecrozier.ca',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Crop Videos Free',
      url: 'https://cropvideosfree.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://cropvideosfree.com/crop/blog/understanding-aspect-ratios',
    },
    articleSection: 'Education',
    keywords: ['aspect ratio', '16:9', '9:16', '4:3', '1:1', 'video dimensions', 'widescreen', 'vertical video'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://cropvideosfree.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://cropvideosfree.com/crop/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Aspect Ratios',
        item: 'https://cropvideosfree.com/crop/blog/understanding-aspect-ratios',
      },
    ],
  },
];

export default function AspectRatiosArticle() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/crop" className="hover:text-purple-400">Home</Link>
          <span>/</span>
          <Link href="/crop/blog" className="hover:text-purple-400">Blog</Link>
          <span>/</span>
          <span className="text-gray-200">Aspect Ratios</span>
        </nav>

        <article className="bg-gray-800/50 backdrop-blur rounded-2xl shadow-xl p-8 md:p-12 border border-gray-700">
          <header className="mb-8 pb-8 border-b border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full">
                Education
              </span>
              <span className="text-sm text-gray-400">5 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Understanding Video Aspect Ratios: From Cinematic to Vertical
            </h1>
            <p className="text-gray-400">
              By Joe Crozier · December 19, 2024
            </p>
          </header>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Aspect ratio is one of those things you don't think about until something looks wrong. Black bars where there shouldn't be any, or important parts of your video getting cut off. Let's demystify what these numbers actually mean.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4">What Is an Aspect Ratio?</h2>

            <p className="text-gray-300 mb-4">
              An aspect ratio describes the relationship between a video's width and height. When you see "16:9," it means for every 16 units of width, there are 9 units of height. The actual size doesn't matter—a 16:9 video could be 1920x1080 pixels or 3840x2160 pixels. What matters is the shape.
            </p>

            <p className="text-gray-300 mb-4">
              Think of it like a picture frame. A 16:9 frame is always a wide rectangle, whether it's the size of your phone screen or a movie theater.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4">The Common Ratios</h2>

            <h3 className="text-xl font-semibold text-white mt-8 mb-3">16:9 — The Standard Widescreen</h3>

            <p className="text-gray-300 mb-4">
              This is what most people mean when they say "widescreen." It's been the default for YouTube, computer monitors, and most TVs since the mid-2000s. If you're filming with your phone held horizontally, you're probably shooting 16:9.
            </p>

            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <p className="text-gray-300"><strong className="text-white">Used for:</strong> YouTube videos, TV shows, most web video, video calls</p>
              <p className="text-gray-300"><strong className="text-white">Common resolutions:</strong> 1920x1080 (1080p), 3840x2160 (4K)</p>
            </div>

            <h3 className="text-xl font-semibold text-white mt-8 mb-3">9:16 — Vertical Video</h3>

            <p className="text-gray-300 mb-4">
              Take 16:9 and rotate it 90 degrees. That's 9:16, and it's everywhere now thanks to smartphones and social media. TikTok, Instagram Reels, YouTube Shorts, Snapchat—they all use this format because that's how most people hold their phones.
            </p>

            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <p className="text-gray-300"><strong className="text-white">Used for:</strong> TikTok, Instagram Reels, YouTube Shorts, Stories</p>
              <p className="text-gray-300"><strong className="text-white">Common resolutions:</strong> 1080x1920</p>
            </div>

            <h3 className="text-xl font-semibold text-white mt-8 mb-3">1:1 — The Square</h3>

            <p className="text-gray-300 mb-4">
              Equal width and height. Instagram popularized this format, though they've since moved on to supporting other ratios. Square video still works well for content that needs to look good both on mobile and desktop, or when you want a balanced, neutral composition.
            </p>

            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <p className="text-gray-300"><strong className="text-white">Used for:</strong> Instagram feed, some ads, profile videos</p>
              <p className="text-gray-300"><strong className="text-white">Common resolutions:</strong> 1080x1080</p>
            </div>

            <div className="my-8">
              <GoogleAdSense
                dataAdSlot="XXXXXXXXXX"
                dataAdFormat="auto"
                dataFullWidthResponsive={true}
              />
            </div>

            <h3 className="text-xl font-semibold text-white mt-8 mb-3">4:5 — Portrait</h3>

            <p className="text-gray-300 mb-4">
              A subtle vertical format that's taller than it is wide, but not as extreme as 9:16. Instagram supports this for feed posts, and it's nice because it takes up more screen space than 1:1 while still fitting comfortably in a scrolling feed.
            </p>

            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <p className="text-gray-300"><strong className="text-white">Used for:</strong> Instagram feed posts, Facebook feed</p>
              <p className="text-gray-300"><strong className="text-white">Common resolutions:</strong> 1080x1350</p>
            </div>

            <h3 className="text-xl font-semibold text-white mt-8 mb-3">4:3 — The Old Standard</h3>

            <p className="text-gray-300 mb-4">
              This was the standard before widescreen took over. Old TVs, early computer monitors, and many webcams still use 4:3. It's slightly wider than it is tall—a stubby rectangle. You'll still see it in some contexts, but it's largely been replaced by 16:9.
            </p>

            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <p className="text-gray-300"><strong className="text-white">Used for:</strong> Older content, some webcams, iPad screens</p>
              <p className="text-gray-300"><strong className="text-white">Common resolutions:</strong> 1440x1080</p>
            </div>

            <h3 className="text-xl font-semibold text-white mt-8 mb-3">21:9 — Ultrawide / Cinematic</h3>

            <p className="text-gray-300 mb-4">
              Even wider than 16:9, this is what you see in many movies. It creates that "cinematic" look with black bars at the top and bottom when viewed on a 16:9 screen. Some filmmakers and content creators use it for aesthetic reasons.
            </p>

            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <p className="text-gray-300"><strong className="text-white">Used for:</strong> Films, cinematic content, ultrawide monitors</p>
              <p className="text-gray-300"><strong className="text-white">Common resolutions:</strong> 2560x1080, 3440x1440</p>
            </div>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4">Why Does This Matter?</h2>

            <p className="text-gray-300 mb-4">
              When your video's aspect ratio doesn't match where you're posting it, something has to give. Either:
            </p>

            <ul className="space-y-3 text-gray-300 mb-6">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span><strong className="text-white">Black bars appear</strong> (letterboxing or pillarboxing) to fill the extra space</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span><strong className="text-white">Parts get cropped off</strong> to make the video fit</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span><strong className="text-white">The video gets stretched</strong> (looks awful, avoid this)</span>
              </li>
            </ul>

            <p className="text-gray-300 mb-4">
              The first two are common and sometimes unavoidable. Stretching is never acceptable—people and objects will look distorted and wrong.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4">Converting Between Aspect Ratios</h2>

            <p className="text-gray-300 mb-4">
              If you've shot in one ratio and need another, you'll have to crop. This means deciding what part of the original frame to keep. With a tool that lets you position the crop region, you can focus on the most important part of each shot.
            </p>

            <p className="text-gray-300 mb-4">
              Going from horizontal to vertical loses a lot of width. Going from vertical to horizontal loses a lot of height. There's no way around this—cropping always means sacrificing part of the image.
            </p>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 my-6">
              <p className="font-semibold text-white mb-2">The takeaway:</p>
              <p className="text-gray-300">
                When possible, shoot in the ratio you'll need. When that's not possible, make sure your subject and important elements are positioned so they'll survive the crop.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4">A Visual Comparison</h2>

            <p className="text-gray-300 mb-4">
              Here's how the common ratios compare to each other when scaled to the same width:
            </p>

            <div className="space-y-4 my-6">
              <div className="flex items-end gap-4">
                <div className="bg-purple-500/30 border border-purple-500 w-full" style={{ aspectRatio: '21/9' }}>
                  <div className="p-2 text-sm text-purple-300">21:9 Cinematic</div>
                </div>
              </div>
              <div className="flex items-end gap-4">
                <div className="bg-purple-500/30 border border-purple-500 w-full" style={{ aspectRatio: '16/9' }}>
                  <div className="p-2 text-sm text-purple-300">16:9 Widescreen</div>
                </div>
              </div>
              <div className="flex items-end gap-4">
                <div className="bg-purple-500/30 border border-purple-500 w-3/4" style={{ aspectRatio: '4/3' }}>
                  <div className="p-2 text-sm text-purple-300">4:3 Classic</div>
                </div>
              </div>
              <div className="flex items-end gap-4">
                <div className="bg-purple-500/30 border border-purple-500 w-1/2" style={{ aspectRatio: '1/1' }}>
                  <div className="p-2 text-sm text-purple-300">1:1 Square</div>
                </div>
              </div>
              <div className="flex items-end gap-4">
                <div className="bg-purple-500/30 border border-purple-500 w-1/3" style={{ aspectRatio: '9/16' }}>
                  <div className="p-2 text-sm text-purple-300">9:16 Vertical</div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4">Wrapping Up</h2>

            <p className="text-gray-300 mb-4">
              Aspect ratios aren't complicated once you understand what they represent. The key things to remember: 16:9 for standard video, 9:16 for vertical social content, and always crop rather than stretch.
            </p>

            <p className="text-gray-300">
              Need to change your video's aspect ratio? <Link href="/crop" className="text-purple-400 hover:underline font-medium">Our cropping tool</Link> makes it easy to select a preset ratio and position the crop exactly where you want it.
            </p>
          </div>

          <div className="my-8">
            <GoogleAdSense
              dataAdSlot="YYYYYYYYYY"
              dataAdFormat="auto"
              dataFullWidthResponsive={true}
            />
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <h3 className="font-semibold text-white mb-4">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/crop/blog/crop-videos-for-social-media" className="block p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                <p className="font-medium text-white">Cropping for Social Media</p>
                <p className="text-sm text-gray-400">Platform-specific dimensions guide</p>
              </Link>
              <Link href="/crop/blog/why-crop-in-browser" className="block p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                <p className="font-medium text-white">Why Crop in Your Browser?</p>
                <p className="text-sm text-gray-400">The privacy and convenience benefits</p>
              </Link>
            </div>
          </div>
        </article>

        <footer className="text-center mt-12 text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Crop Videos Free. All rights reserved.</p>
        </footer>
      </div>
    </div>
    </>
  );
}
