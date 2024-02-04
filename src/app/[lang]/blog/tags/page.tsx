import React from 'react'
import { ArticlesByTags } from '@/components/blog/tags/articles-by-tags'
import '@/styles/blog/home.css'
import { Metadata } from 'next'

const BLOG_DOMAIN =
  `${process.env.DOMAIN}/blog` || 'https://fraineralex.vercel.app/blog'

export const metadata: Metadata = {
  title: 'Tags',
  description:
    'Here you will find the tags of articles about web development, software engineering, and many more geeky things in the world of programming.',
  openGraph: {
    title: "Tags | Frainer's Blog 📝",
    description:
      'Here you will find the tags of articles about web development, software engineering, and many more geeky things in the world of programming.',
    url: `${BLOG_DOMAIN}/blog/tags`
  }
}

export default async function TagsPage () {
  return (
    <div className='relative'>
      <div className='px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-26 home-header'>
        <header className='mx-auto max-w-2xl text-center home-header pb-14'>
          <h1 className='pb-2 md:pb-3 uppercase font-bold leading-none text-zinc-100'>
            Articles
          </h1>
          <p className='text-zinc-400 md:text-lg leading-relaxed text-sm'>
            Some of my thoughts on software engineering, web development, and
            life.
          </p>
        </header>
        <ArticlesByTags displayAllTags />
      </div>
    </div>
  )
}
