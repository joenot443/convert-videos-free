import { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { locales, defaultLocale } from '@/lib/i18n/config'
import { CONVERT_URL, CROP_URL } from '@/lib/site/metadata'

const BLOG_POSTS = [
  'how-to-convert-mov-to-mp4',
  'best-video-formats-explained',
  'webcodecs-browser-video-processing',
  'video-settings-for-social-media',
]

const CROP_BLOG_POSTS = [
  'crop-videos-for-social-media',
  'understanding-aspect-ratios',
  'why-crop-in-browser',
]

function cropSitemap(lastModified: Date): MetadataRoute.Sitemap {
  return [
    { url: `${CROP_URL}/crop`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${CROP_URL}/crop/blog`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    ...CROP_BLOG_POSTS.map((slug) => ({
      url: `${CROP_URL}/crop/blog/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}

function convertSitemap(lastModified: Date): MetadataRoute.Sitemap {
  const localeUrl = (locale: string) => (locale === defaultLocale ? CONVERT_URL : `${CONVERT_URL}/${locale}`)

  return [
    ...locales.map((locale) => ({
      url: localeUrl(locale),
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: locale === defaultLocale ? 1 : 0.9,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, localeUrl(l)])),
      },
    })),
    { url: `${CONVERT_URL}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    ...BLOG_POSTS.map((slug) => ({
      url: `${CONVERT_URL}/blog/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${CONVERT_URL}/about`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${CONVERT_URL}/privacy`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${CONVERT_URL}/terms`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
  ]
}

// A sitemap may only list URLs on its own host, so each domain gets its own.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get('host') ?? ''
  const lastModified = new Date()
  return host.includes('cropvideosfree') ? cropSitemap(lastModified) : convertSitemap(lastModified)
}
