import { MetadataRoute } from 'next'
import { locales, defaultLocale } from '@/lib/i18n/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://convertvideosfree.com'

  const blogPosts = [
    'how-to-convert-mov-to-mp4',
    'best-video-formats-explained',
    'webcodecs-browser-video-processing',
    'video-settings-for-social-media',
  ]

  // Generate localized homepage URLs
  const localizedHomepages = locales.map((locale) => ({
    url: locale === defaultLocale ? baseUrl : `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: locale === defaultLocale ? 1 : 0.9,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, l === defaultLocale ? baseUrl : `${baseUrl}/${l}`])
      ),
    },
  }))

  return [
    ...localizedHomepages,
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogPosts.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
