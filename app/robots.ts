import { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { CONVERT_URL, CROP_URL } from '@/lib/site/metadata'

// Both domains are served by this app, and each needs its own sitemap URL.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get('host') ?? ''
  const baseUrl = host.includes('cropvideosfree') ? CROP_URL : CONVERT_URL

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/workers/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
