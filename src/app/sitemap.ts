import type { MetadataRoute } from 'next'
import { i18n } from '@/i18n-config'
import { allPosts } from '@/lib/posts'
import { localizedUrl } from '@/lib/site-metadata'
import { allTags } from '@/utils/data'

function localizedAlternates (path: string) {
  return {
    'en-US': localizedUrl('en', path),
    'es-DO': localizedUrl('es', path),
    'x-default': localizedUrl('en', path)
  }
}

export default function sitemap (): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/projects', '/projects/viollet', '/projects/tracky', '/projects/sargotech', '/projects/chatify', '/projects/chess-ai', '/blog', '/blog/tags']
  const staticEntries = i18n.locales.flatMap(lang =>
    staticRoutes.map(path => ({
      url: localizedUrl(lang, path),
      alternates: {
        languages: localizedAlternates(path)
      }
    }))
  )

  const publishedPosts = allPosts.filter(post => post.published)
  const postEntries = publishedPosts.map(post => {
    const path = `/blog/${post.slug}`
    const englishPost = publishedPosts.some(
      candidate => candidate.slug === post.slug && candidate.lang === 'en'
    )
    const spanishPost = publishedPosts.some(
      candidate => candidate.slug === post.slug && candidate.lang === 'es'
    )
    const languages: Record<string, string> = {}

    if (englishPost) {
      languages['en-US'] = localizedUrl('en', path)
      languages['x-default'] = localizedUrl('en', path)
    }
    if (spanishPost) {
      languages['es-DO'] = localizedUrl('es', path)
    }

    return {
      url: localizedUrl(post.lang, path),
      lastModified: post.updated || post.date,
      alternates: {
        languages
      }
    }
  })

  const tagEntries = i18n.locales.flatMap(lang =>
    allTags.map(tag => {
      const path = `/blog/tags/${tag.name}`
      const matchingPosts = publishedPosts.filter(
        post => post.lang === lang && post.tags?.includes(tag.name)
      )
      const lastModified = matchingPosts.reduce<string | undefined>(
        (latest, post) => {
          const postDate = post.updated || post.date
          return !latest || new Date(postDate) > new Date(latest)
            ? postDate
            : latest
        },
        undefined
      )

      return {
        url: localizedUrl(lang, path),
        ...(lastModified ? { lastModified } : {}),
        alternates: {
          languages: localizedAlternates(path)
        }
      }
    })
  )

  return Array.from(
    new Map(
      [...staticEntries, ...postEntries, ...tagEntries].map(entry => [
        entry.url,
        entry
      ])
    ).values()
  )
}
