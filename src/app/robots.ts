export default function robots () {
  const DOMAIN = process.env.DOMAIN || 'https://fraineralex.dev'
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
