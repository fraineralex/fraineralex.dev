export const runtime = 'nodejs'

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Locale } from '@/i18n-config'

export const readPosts = (lang: Locale) => {
  const postsDirectory = path.resolve(process.cwd(), `../../content/posts/${lang}`);
  
  return fs
    .readdirSync(postsDirectory)
    .filter(file => path.extname(file) === '.mdx')
    .map(file => {
      const postContent = fs.readFileSync(path.join(postsDirectory, file), 'utf8');
      const { data, content }: { data: any; content: string } = matter(postContent);
      
      return { ...data, body: content, slug: file.replace('.mdx', '') };
    })
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    );
}
