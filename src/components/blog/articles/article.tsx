'use client'

import type { Post } from 'contentlayer/generated'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import Image from 'next/image'
import { Card } from './card'
import React, { useState, useEffect, useRef } from 'react'
import '@/styles/blog/article.css'

type Props = {
  post: Post
  views: number
  isTopArticle?: boolean
}

export const Article: React.FC<Props> = ({ post, views, isTopArticle }) => {
  const [showDiv, setShowDiv] = useState(false)
  const containerRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    if (containerRef.current && containerRef.current.offsetHeight > 500) {
      setShowDiv(true)
    }
  }, [])

  const aspectRatio = isTopArticle ? '8 / 11' : '15 / 7'
  const imageStyles: {} = isTopArticle
    ? { aspectRatio, objectFit: 'cover', height: '100%' }
    : { aspectRatio, objectFit: 'cover', width: '100%' }

  return (
    <Link
      ref={containerRef}
      href={`/blog/${post?.slug}`}
      className={`bg-gradient-to-br opacity-100  via-zinc-100/10 overflow-hidden relative border rounded-xl hover:bg-zinc-800/10 group hover:border-zinc-200/50 border-zinc-600 lg:hover:transform lg:hover:-translate-y-2 transition-all duration-300 ease-in-out ${
        isTopArticle ? 'relative grid grid-cols-8 ' : 'md:gap-0'
      }`}
    >
      <Image
        style={imageStyles}
        className={`squiggle z-50 ${
          isTopArticle ? 'h-full md:h-auto col-span-2' : ''
        } transform transition-transform group-hover:scale-110`}
        src={post.hero}
        alt={post.title}
        width='360'
        height='192'
      />

      <Card className={`${isTopArticle ? 'col-span-6' : ''}`}>
        <article className={`p-4 md:p-8 ${isTopArticle ? 'col-span-6' : ''}`}>
          <div className='flex justify-between gap-2 items-center'>
            <span className='text-xs duration-1000 text-zinc-300 group-hover:text-zinc-200 group-hover:border-zinc-200 drop-shadow-orange'>
              {post?.date ? (
                <time dateTime={new Date(post.date).toISOString()}>
                  {Intl.DateTimeFormat(undefined, {
                    dateStyle: 'medium'
                  }).format(new Date(post.date))}
                </time>
              ) : (
                <span>SOON</span>
              )}
            </span>
            <span className='text-zinc-500 text-xs  flex items-center gap-1 group-hover:text-zinc-400'>
              <Eye className='w-4 h-4' />{' '}
              {Intl.NumberFormat('en-US', { notation: 'compact' }).format(
                views
              )}
            </span>
          </div>
          <h2 className='z-20 text-xl font-bold duration-1000 lg:text-3xl text-zinc-300 group-hover:text-zinc-100 font-londrina'>
            {post?.title}
          </h2>
          <p className='z-20 mt-4 text-sm duration-1000 text-zinc-400 group-hover:text-zinc-300'>
            {post?.description}
          </p>
        </article>
      </Card>
      {showDiv && (
        <div className='absolute bottom-1 px-4 md:px-8 py-2'>
          <p className='hidden text-zinc-200 group-hover:text-white lg:block'>
            Just {post.readTime} min read <span aria-hidden='true'>&rarr;</span>
          </p>
        </div>
      )}
    </Link>
  )
}
