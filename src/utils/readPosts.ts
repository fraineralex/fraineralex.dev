export const runtime = 'nodejs'

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Locale } from '@/i18n-config'


export const readPosts = (lang: Locale) =>
  fs
    .readdirSync(`../../content/posts/${lang}`)
    .filter(file => path.extname(file) === '.mdx')
    .map(file => {
      const postContent = fs.readFileSync(`../../content/posts/${lang}/${file}`, 'utf8')
      const { data, content }: { data: any; content: string } =
        matter(postContent)
      return { ...data, body: content, slug: file.replace('.mdx', '') }
    })
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    )
