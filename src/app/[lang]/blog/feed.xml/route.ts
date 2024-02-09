export const runtime = 'nodejs'

import RSS from 'rss'
import fs from 'fs'
import path from 'path'
import { marked } from 'marked'
import matter from 'gray-matter'
import { RSSHeader } from '@/components/blog/content/rss-header'

const posts = fs
  .readdirSync('./content/posts')
  .filter(file => path.extname(file) === '.mdx')
  .map(file => {
    const postContent = fs.readFileSync(`./content/posts/${file}`, 'utf8')
    const { data, content }: { data: any; content: string } =
      matter(postContent)
    return { ...data, body: content, slug: file.replace('.mdx', '') }
  })
  .sort(
    (a, b) =>
      new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
      new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
  )

const renderer = new marked.Renderer()

renderer.link = (href: string, _: any, text: string) =>
  `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`

marked.setOptions({
  gfm: true,
  breaks: true,
  renderer
})

const renderPost = (md: string) => marked.parse(md)
export async function GET () {
  const DOMAIN = `${process.env.DOMAIN}/blog` || 'https://fraineralex.dev/blog'
  const lastPostDate = posts[posts.length - 1].date
  const feed = new RSS({
    title: "Frainer's Blog 📝",
    description:
      "Recent articles from Frainer's Blog. I write about tech, programming and whatever else I'm thinking about!",
    site_url: `${DOMAIN}/`,
    feed_url: `${DOMAIN}/feed.xml`,
    image_url: `${DOMAIN}/og.png`,
    pubDate: lastPostDate,
    language: 'en-US',
    categories: ['tech', 'programming', 'software'],
    custom_elements: [{ 'dc:creator': 'Frainer Encarnación' }]
  })

  posts.map(post => {
    const readTime = Math.ceil(post.body.split(/\s+/).length / 200).toString()

    const props = {
      hero: post.hero,
      heroSource: post.heroSource || '',
      tags: post.tags,
      date: post.updated || post.date,
      readTime: readTime
    }

    const articleHeader = RSSHeader(props)
    const htmlArticle = `${articleHeader}<article style="text-wrap: balance;">${renderPost(
      post.body
    )}</article>`

    feed.item({
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

  return new Response(feed.xml({ indent: true }), {
    headers: { 'Content-Type': 'application/xml' },
    status: 200,
    statusText: 'OK'
  })
}
