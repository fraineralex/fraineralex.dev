export const runtime = 'nodejs'

import RSS from 'rss'
import { marked } from 'marked'
import { RSSHeader } from '@/components/blog/content/rss-header'
import { readPosts } from '@/utils/readPosts'

const posts = readPosts('es')

marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    link ({ href, tokens }) {
      const text = this.parser.parseInline(tokens)
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`
    }
  }
})

const renderPost = (md: string) => marked.parse(md) as string
export async function GET () {
  const DOMAIN =
    `${process.env.DOMAIN}/es/blog` || 'https://fraineralex.dev/es/blog'
  const lastPostDate = posts.length > 0 ? posts[posts.length - 1].date : ''
  const rss = new RSS({
    title: "Frainer's Blog 📝",
    description:
      "Articulos recientes de Frainer's Blog. Escribo sobre tecnología, programación y cualquier otra cosa en la que esté pensando!",
    site_url: `${DOMAIN}/`,
    feed_url: `${DOMAIN}/rss.xml`,
    image_url: `${process.env.DOMAIN}/images/blog/es-og.webp`,
    pubDate: lastPostDate,
    language: 'es-DO',
    categories: ['tecnología', 'programación', 'software'],
    custom_elements: [{ 'dc:creator': 'Frainer Encarnación' }]
  })

  posts.map(post => {
    const readTime = Math.ceil(post.body.split(/\s+/).length / 200).toString()

    const props = {
      hero: post.hero,
      heroSource: post.heroSource || '',
      tags: post.tags,
      date: post.updated || post.date,
      readTime: readTime,
      minRead: 'min de lectura'
    }

    const articleHeader = RSSHeader(props)
    const htmlArticle = `${articleHeader}<article style="text-wrap: balance;">${renderPost(
      post.body
    )}</article>`

    rss.item({
      title: post.title,
      url: `${DOMAIN}/${post.slug}`,
      date: post.updated || post.date,
      description: htmlArticle as string,
      categories: post.tags?.map((tag: string) => tag) || [],
      guid: `${DOMAIN}/${post.slug}`,
      author: 'Frainer Encarnación',
      enclosure: {
        url: `${DOMAIN}${post.hero
          .replace('cover/', 'cover/rss/')
          .replace('webp', 'png')}`,
        type: 'png'
      }
    })
  })

  return new Response(rss.xml({ indent: true }), {
    headers: { 'Content-Type': 'application/xml' },
    status: 200,
    statusText: 'OK'
  })
}
