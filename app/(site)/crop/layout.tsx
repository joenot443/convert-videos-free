import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://cropvideosfree.com'),
  title: "Crop Videos Free - Online Video Cropper & Trimmer | No Upload Required",
  description: "Free online video cropper and trimmer. Crop and trim videos instantly in your browser. 100% privacy - no uploads, no registration. Powered by WebCodecs.",
  keywords: "free video cropper, crop video online, trim video online, video cutter, resize video, aspect ratio converter, 16:9 crop, 9:16 crop, vertical video crop, instagram crop, tiktok crop",
  authors: [{ name: "Joe Crozier", url: "https://joecrozier.ca" }],
  creator: "Joe Crozier",
  publisher: "Crop Videos Free",
  openGraph: {
    title: "Crop Videos Free - Online Video Cropper & Trimmer",
    description: "Free browser-based video cropper. Crop and trim videos instantly. 100% privacy - files never leave your device.",
    url: "https://cropvideosfree.com/crop",
    siteName: "Crop Videos Free",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crop Videos Free - Online Video Cropper & Trimmer",
    description: "Free browser-based video cropper. 100% privacy - files never leave your device.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://cropvideosfree.com/crop",
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Crop Videos Free',
    description: 'Free online video cropper and trimmer. Crop videos to any aspect ratio for TikTok, Instagram Reels, YouTube Shorts, and more. 100% privacy - files never leave your device.',
    url: 'https://cropvideosfree.com/crop',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Crop videos to custom aspect ratios',
      'Preset ratios for TikTok, Instagram, YouTube',
      'Trim video start and end times',
      'Browser-based processing',
      'No file uploads required',
      'Complete privacy',
      'No registration needed',
    ],
    author: {
      '@type': 'Person',
      name: 'Joe Crozier',
      url: 'https://joecrozier.ca',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What aspect ratios can I crop videos to?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Crop Videos Free supports all common aspect ratios: 16:9 (YouTube), 9:16 (TikTok, Instagram Reels, YouTube Shorts), 1:1 (Instagram Feed, Twitter), and 4:5 (Instagram Portrait). You can also set custom crop dimensions.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is my video data private when cropping?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, completely private. All video processing happens locally in your browser using WebCodecs technology. Your videos are never uploaded to any server. We cannot see or access your files.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I trim videos while cropping?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! You can set custom start and end times to trim your video while also applying a crop. This is perfect for cutting out the parts you want for social media.'
        }
      },
      {
        '@type': 'Question',
        name: 'What video formats are supported for cropping?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Crop Videos Free supports MP4, MOV, WebM, and MKV. The output is always MP4 with H.264 video and AAC audio for maximum compatibility.'
        }
      }
    ]
  }
];

export default function CropLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#1a1a2e] text-white">
        {children}
      </div>
    </>
  );
}
