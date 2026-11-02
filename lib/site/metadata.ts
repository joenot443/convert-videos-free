import type { Metadata } from 'next';
import { defaultLocale, Locale, locales } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

export const CONVERT_URL = 'https://convertvideosfree.com';
export const CROP_URL = 'https://cropvideosfree.com';

/** Metadata shared by every page. Each page adds its own canonical URL. */
export const siteMetadata: Metadata = {
  metadataBase: new URL(CONVERT_URL),
  title: 'Convert Videos Free - Online Video to MP4 Converter | No Upload Required',
  description:
    'Free online video converter to MP4. Convert MOV, WebM, and MKV files instantly in your browser. 100% privacy - no uploads, no registration. Powered by WebCodecs.',
  keywords:
    'free video converter, convert video to mp4, online video converter, mov to mp4, webm to mp4, mkv to mp4, browser video converter, no upload video converter, privacy video converter, convert videos online free, mp4 converter online, video format converter, webcodecs converter',
  authors: [{ name: 'Joe Crozier', url: 'https://joecrozier.ca' }],
  creator: 'Joe Crozier',
  publisher: 'Convert Videos Free',
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'Convert Videos Free - Online Video to MP4 Converter',
    description:
      'Free browser-based video converter. Convert MOV, WebM, and MKV to MP4 instantly. 100% privacy - files never leave your device.',
    url: CONVERT_URL,
    siteName: 'Convert Videos Free',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Convert Videos Free - Online Video to MP4 Converter',
    description: 'Free browser-based video converter. 100% privacy - files never leave your device.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const localeUrl = (lang: Locale) => (lang === defaultLocale ? CONVERT_URL : `${CONVERT_URL}/${lang}`);

/** Metadata for the converter homepage in one language, with hreflang links. */
export function homeMetadata(lang: Locale): Metadata {
  const dict = getDictionary(lang);
  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
    keywords: dict.metadata.keywords,
    alternates: {
      canonical: localeUrl(lang),
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, localeUrl(l)])),
        'x-default': CONVERT_URL,
      },
    },
    openGraph: {
      title: dict.metadata.title,
      description: dict.metadata.description,
      url: localeUrl(lang),
      siteName: 'Convert Videos Free',
      type: 'website',
      locale: lang,
    },
  };
}

export const homeJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Convert Videos Free',
    description:
      'Free online video converter to MP4. Convert MOV, WebM, and MKV files instantly in your browser with complete privacy.',
    url: CONVERT_URL,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: [
      'Convert videos to MP4 format',
      'Support for MOV, WebM, and MKV formats',
      'Browser-based processing',
      'No file uploads required',
      'Complete privacy',
      'No registration needed',
      'Powered by WebCodecs API',
    ],
    author: { '@type': 'Person', name: 'Joe Crozier', url: 'https://joecrozier.ca' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does the online video converter work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our video converter uses the WebCodecs API to process videos directly in your browser. Simply select or drag a video file, choose your settings, and click convert. The entire conversion happens on your device without uploading files to any server.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which video formats can I convert to MP4?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Convert Videos Free supports MP4, MOV, WebM, and MKV input. All videos are converted to MP4 with H.264 video codec and AAC audio codec for maximum compatibility across all devices and platforms.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is my video data safe and private?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Absolutely! Your videos never leave your device. All processing happens locally in your browser using WebCodecs technology. We don't upload, store, or have access to any of your files.",
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to install software to convert videos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No installation required! Convert Videos Free works entirely in your web browser. Just visit our site and start converting immediately. It works on Chrome, Edge, and Safari (16.4+).',
        },
      },
    ],
  },
];
