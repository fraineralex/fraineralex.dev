import { allPosts } from 'contentlayer/generated'
import { allTags } from '@/utils/data'

export default async function sitemap () {
  const DOMAIN = process.env.DOMAIN || 'https://fraineralex.dev'

  const lastPostDate = allPosts[allPosts.length - 1].date

  const articles = allPosts.map(post => ({
    url: `${DOMAIN}/blog/${post.slug}`,
    lastModified: lastPostDate
  }))

  const tags = allTags.map(tag => ({
    url: `${DOMAIN}/blog/${tag.name}`,
    lastModified: lastPostDate
  }))

  const routes = [
    '',
    '/projects',
    '/blog',
    '/blog/tags',
    '/blog/feed.xml',
    'resume',
    'curriculum'
  ].map(route => ({
    url: `${DOMAIN}${route}`,
    lastModified: lastPostDate
  }))

  return [...routes, ...articles, ...tags]
}
