import { SITE_URL } from '@/lib/site-metadata'

export default function robots () {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/']
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  }
}
