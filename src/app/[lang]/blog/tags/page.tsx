import React from 'react'
import { Navigation } from '@/components/blog/nav/nav'
import { ArticlesByTags } from '@/components/blog/tags/articles-by-tags'
import '@/styles/home.css'

export default async function TagsPage () {
  return (
    <div className='relative'>
      <Navigation />
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
