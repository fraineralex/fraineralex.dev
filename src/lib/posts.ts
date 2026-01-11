import 'server-only'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Post, PostMeta } from '@/types/post'

export type { Post, PostMeta }

const postsDirectory = path.join(process.cwd(), 'content/posts')

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function getAllPosts(): Post[] {
  const locales = ['en', 'es']
  const posts: Post[] = []

  for (const locale of locales) {
    const localeDir = path.join(postsDirectory, locale)
    if (!fs.existsSync(localeDir)) continue

    const files = fs.readdirSync(localeDir).filter(file => file.endsWith('.mdx'))

    for (const file of files) {
      const filePath = path.join(localeDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContent)

      const slug = file.replace('.mdx', '')

      posts.push({
        title: data.title,
        description: data.description,
        date: data.date,
        updated: data.updated,
        hero: data.hero,
        heroSource: data.heroSource,
        tags: data.tags || [],
        published: data.published ?? false,
        lang: data.lang || locale,
        slug,
        path: `/${locale}/blog/${slug}`,
        readTime: calculateReadTime(content),
        body: {
          raw: content
        }
      })
    }
  }

  return posts.sort(
    (a, b) =>
      new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
      new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
  )
}

export function getPostBySlug(slug: string, lang: string): Post | undefined {
  const allPosts = getAllPosts()
  return allPosts.find(post => post.slug === slug && post.lang === lang)
}

export function getPostContent(slug: string, lang: string): string | null {
  const filePath = path.join(postsDirectory, lang, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { content } = matter(fileContent)
  return content
}

export const allPosts = getAllPosts()

// Lightweight version for client-side search (excludes raw MDX body)
export function getAllPostsMeta(): PostMeta[] {
  return allPosts.map(({ body, ...meta }) => meta)
}

export const allPostsMeta = getAllPostsMeta()
