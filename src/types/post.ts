export type Post = {
  title: string
  description: string
  date: string
  updated?: string
  hero: string
  heroSource?: string
  tags: string[]
  published: boolean
  lang: string
  slug: string
  path: string
  readTime: number
  body: {
    raw: string
  }
}

export type PostMeta = Omit<Post, 'body'>
