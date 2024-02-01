export default function robots () {
  const DOMAIN = process.env.DOMAIN || 'https://fraineralex.vercel.app'
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/']
      }
    ],
    sitemap: `${DOMAIN}/sitemap.xml`,
    host: DOMAIN
  }
}
