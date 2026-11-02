import Link from 'next/link';
import { Metadata } from 'next';
import GoogleAdSense from '@/components/GoogleAdSense';

export const metadata: Metadata = {
  alternates: { canonical: 'https://cropvideosfree.com/crop/blog/crop-videos-for-social-media' },
  title: 'How to Crop Videos for Social Media | Crop Videos Free',
  description: 'Learn the right dimensions for TikTok, Instagram Reels, YouTube Shorts, and more. A practical guide to cropping videos for every major platform.',
  openGraph: {
    title: 'How to Crop Videos for Social Media: A Platform-by-Platform Guide',
    description: 'Get your videos looking right on every platform with the correct dimensions and aspect ratios.',
    type: 'article',
    publishedTime: '2024-12-20',
    authors: ['Joe Crozier'],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'How to Crop Videos for Social Media: A Platform-by-Platform Guide',
    description: 'Learn the right dimensions for TikTok, Instagram Reels, YouTube Shorts, and more. A practical guide to cropping videos for every major platform.',
    datePublished: '2024-12-20',
    dateModified: '2024-12-20',
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
      '@id': 'https://cropvideosfree.com/crop/blog/crop-videos-for-social-media',
    },
    articleSection: 'Guide',
    keywords: ['crop video', 'social media video', 'TikTok dimensions', 'Instagram Reels', 'YouTube Shorts', 'aspect ratio', '9:16 video'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Crop Videos for Social Media',
    description: 'Crop videos to the right dimensions for TikTok, Instagram, and YouTube directly in your browser.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Open Crop Videos Free',
        text: 'Open Crop Videos Free in your browser',
        url: 'https://cropvideosfree.com',
      },
      {
        '@type': 'HowToStep',
        name: 'Upload your video',
        text: 'Drop in your video file',
      },
      {
        '@type': 'HowToStep',
        name: 'Select aspect ratio',
        text: 'Select the aspect ratio you need (9:16 for TikTok, etc.)',
      },
      {
        '@type': 'HowToStep',
        name: 'Position crop',
        text: 'Drag to position the crop region over the important part of your frame',
      },
      {
        '@type': 'HowToStep',
        name: 'Trim if needed',
        text: 'Trim if needed (cut out dead time at the start or end)',
      },
      {
        '@type': 'HowToStep',
        name: 'Export',
        text: 'Export and download your cropped video',
      },
    ],
    tool: {
      '@type': 'HowToTool',
      name: 'Crop Videos Free',
    },
    totalTime: 'PT2M',
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
        name: 'Social Media Cropping',
        item: 'https://cropvideosfree.com/crop/blog/crop-videos-for-social-media',
      },
    ],
  },
];

export default function SocialMediaCropArticle() {
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
          <span className="text-gray-200">Social Media Cropping</span>
        </nav>

        <article className="bg-gray-800/50 backdrop-blur rounded-2xl shadow-xl p-8 md:p-12 border border-gray-700">
          <header className="mb-8 pb-8 border-b border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full">
                Guide
              </span>
              <span className="text-sm text-gray-400">6 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How to Crop Videos for Social Media: A Platform-by-Platform Guide
            </h1>
            <p className="text-gray-400">
              By Joe Crozier · December 20, 2024
            </p>
          </header>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              You've shot a great video, but it doesn't quite fit the platform you want to post it on. The sides get cut off on TikTok, or there are awkward black bars on Instagram. Sound familiar? Let's fix that.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4">The Quick Reference</h2>

            <p className="text-gray-300 mb-4">
              Here's what you actually need to know for each platform:
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-700/50">
                    <th className="text-left p-4 font-semibold text-white border-b border-gray-600">Platform</th>
                    <th className="text-left p-4 font-semibold text-white border-b border-gray-600">Aspect Ratio</th>
                    <th className="text-left p-4 font-semibold text-white border-b border-gray-600">Resolution</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-700">
                    <td className="p-4">TikTok</td>
                    <td className="p-4">9:16 (vertical)</td>
                    <td className="p-4">1080 x 1920</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-4">Instagram Reels</td>
                    <td className="p-4">9:16 (vertical)</td>
                    <td className="p-4">1080 x 1920</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-4">Instagram Feed</td>
                    <td className="p-4">1:1 or 4:5</td>
                    <td className="p-4">1080 x 1080 or 1080 x 1350</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-4">YouTube Shorts</td>
                    <td className="p-4">9:16 (vertical)</td>
                    <td className="p-4">1080 x 1920</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-4">YouTube (standard)</td>
                    <td className="p-4">16:9 (horizontal)</td>
                    <td className="p-4">1920 x 1080</td>
                  </tr>
                  <tr>
                    <td className="p-4">Twitter/X</td>
                    <td className="p-4">16:9 or 1:1</td>
                    <td className="p-4">1280 x 720 or 720 x 720</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4">TikTok and Reels: The Vertical Video Era</h2>

            <p className="text-gray-300 mb-4">
              Both platforms want 9:16 vertical video. If you filmed horizontally (like most of us do by default), you've got some decisions to make.
            </p>

            <p className="text-gray-300 mb-4">
              The most common approach is to crop into the center of your footage. This works well when your subject is centered, but you'll lose about 44% of the frame width. That's a lot.
            </p>

            <p className="text-gray-300 mb-4">
              Before you start cropping, scrub through your video. Is there a particular area where the action happens? Maybe your subject moves around the frame. With most cropping tools, you can position the crop region to capture what matters most, even if it's not dead center.
            </p>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 my-6">
              <p className="font-semibold text-white mb-2">Pro tip:</p>
              <p className="text-gray-300">
                If you're planning to post on both YouTube and TikTok, film in 4K when possible. The extra resolution gives you more flexibility when cropping down to 1080p for vertical formats.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4">Instagram Feed: Square or Portrait?</h2>

            <p className="text-gray-300 mb-4">
              Instagram's feed is interesting because you have options. Square (1:1) used to be the only choice, but now 4:5 portrait videos are often a better pick. They take up more screen real estate as people scroll, which means more attention on your content.
            </p>

            <p className="text-gray-300 mb-4">
              That said, square still works great for certain content—particularly anything with text overlays or graphics that you want evenly balanced.
            </p>

            <div className="my-8">
              <GoogleAdSense
                dataAdSlot="XXXXXXXXXX"
                dataAdFormat="auto"
                dataFullWidthResponsive={true}
              />
            </div>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4">YouTube: The Horizontal Holdout</h2>

            <p className="text-gray-300 mb-4">
              Regular YouTube videos are still 16:9 horizontal, and that's not changing anytime soon. If you filmed vertically and want to post to YouTube proper (not Shorts), you've got a tougher situation. Your options are:
            </p>

            <ul className="space-y-3 text-gray-300 mb-6">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Black bars on the sides (simple, but looks amateur)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Blurred/zoomed background of the same video (popular, but busy)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Post as a Short instead (often the right call for short content)</span>
              </li>
            </ul>

            <p className="text-gray-300 mb-4">
              There's no perfect solution for converting vertical to horizontal. The best approach is usually to plan your shoot format ahead of time.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4">Twitter/X: Flexibility Wins</h2>

            <p className="text-gray-300 mb-4">
              Twitter is the most forgiving platform for video dimensions. It accepts pretty much anything from 1:1 to 16:9. The timeline will display your video appropriately either way.
            </p>

            <p className="text-gray-300 mb-4">
              That said, horizontal 16:9 tends to perform slightly better because it fills more of the tweet card. Square is a close second.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4">Actually Cropping the Video</h2>

            <p className="text-gray-300 mb-4">
              Now that you know what dimensions you need, here's the practical part. You've got a few options:
            </p>

            <p className="text-gray-300 mb-4">
              <strong className="text-white">Browser-based tools</strong> are the quickest for one-off crops. You don't install anything, and your video never leaves your device. Just upload, position the crop, and export.
            </p>

            <p className="text-gray-300 mb-4">
              <strong className="text-white">Desktop editors</strong> like DaVinci Resolve or Premiere Pro give you more control, but they're overkill if all you need is a quick crop.
            </p>

            <p className="text-gray-300 mb-4">
              <strong className="text-white">Mobile apps</strong> are convenient when you're working from your phone, but they often compress your video more than you'd like.
            </p>

            <div className="bg-gray-700/50 rounded-lg p-6 my-6">
              <p className="font-semibold text-white mb-3">Steps for browser-based cropping:</p>
              <ol className="space-y-2 text-gray-300">
                <li>1. Open <Link href="/crop" className="text-purple-400 hover:underline">Crop Videos Free</Link></li>
                <li>2. Drop in your video file</li>
                <li>3. Select the aspect ratio you need (9:16 for TikTok, etc.)</li>
                <li>4. Drag to position the crop region over the important part of your frame</li>
                <li>5. Trim if needed (cut out dead time at the start or end)</li>
                <li>6. Export and download</li>
              </ol>
            </div>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4">A Note on Quality</h2>

            <p className="text-gray-300 mb-4">
              Every time you crop and re-export a video, there's some quality loss from re-encoding. It's usually not noticeable, but if you're working with footage that's already been compressed heavily, keep it in mind.
            </p>

            <p className="text-gray-300 mb-4">
              Start from the highest quality source you have. If you still have the original file from your camera or phone, use that instead of something you've already exported once.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4">Wrapping Up</h2>

            <p className="text-gray-300 mb-4">
              Getting video dimensions right isn't glamorous, but it makes a real difference in how your content looks. A video that fills the screen properly just looks more professional than one with awkward black bars or chopped-off edges.
            </p>

            <p className="text-gray-300">
              The good news is that with the right tool, cropping takes about 30 seconds. <Link href="/crop" className="text-purple-400 hover:underline font-medium">Give it a try</Link> and see how quick it can be.
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
              <Link href="/crop/blog/understanding-aspect-ratios" className="block p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                <p className="font-medium text-white">Understanding Aspect Ratios</p>
                <p className="text-sm text-gray-400">What 16:9, 9:16, and 1:1 actually mean</p>
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
