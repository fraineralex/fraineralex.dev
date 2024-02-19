import { allPosts } from 'contentlayer/generated'
import { allTags } from '@/utils/data'
import { i18n } from '@/i18n-config'

export default async function sitemap () {
  const DOMAIN = process.env.DOMAIN || 'https://fraineralex.dev'

  const lastPostDate = allPosts[allPosts.length - 1].date

  const articles = allPosts.map(post => ({
    url: `${DOMAIN}/blog/${post.slug}`,
    lastModified: lastPostDate
  }))

  const articlesByLocale = i18n.locales.flatMap(locale => {
    return allPosts.map(post => ({
      url: `${DOMAIN}/${locale}/blog/${post.slug}`,
      lastModified: lastPostDate
    }))
  })

  const tags = allTags.map(tag => ({
    url: `${DOMAIN}/blog/${tag.name}`,
    lastModified: lastPostDate
  }))

  const tagsByLocale = i18n.locales.flatMap(locale => {
    return allTags.map(tag => ({
      url: `${DOMAIN}/${locale}/blog/${tag.name}`,
      lastModified: lastPostDate
    }))
  })

  const routes = [
    '',
    '/projects',
    '/blog',
    '/blog/tags',
    '/blog/feed.xml',
    '/resume',
    '/curriculum'
  ].map(route => ({
    url: `${DOMAIN}${route}`,
    lastModified: lastPostDate
  }))

  const routesByLocale = i18n.locales.flatMap(locale => {
    const routes = [
      '',
      '/projects',
      '/blog',
      '/blog/tags',
      '/blog/feed.xml'
    ].map(route => ({
      url: `${DOMAIN}/${locale}${route}`,
      lastModified: lastPostDate
    }))

    return routes
  })

  return [
    ...routes,
    ...articles,
    ...tags,
    ...articlesByLocale,
    ...tagsByLocale,
    ...routesByLocale
  ]
}
