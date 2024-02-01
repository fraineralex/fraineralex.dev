import React from 'react'
import { Navigation } from '@/components/blog/nav/nav'
import { Article } from '@/components/blog/articles/article'
import { Redis } from '@upstash/redis'
import { ArticlesByTags } from '@/components/blog/tags/articles-by-tags'
import { allTags } from '@/utils/data'
import { Metadata, ResolvingMetadata } from 'next'
import '@/styles/blog/home.css'
import { allPosts } from 'contentlayer/generated'
//import allPosts from '@/util/monks'

const redis = Redis.fromEnv()

type Props = {
  params: {
    tag: string
  }
}

/* export async function generateStaticParams (): Promise<Props['params'][]> {
  return allTags.map(tag => ({
    tag: tag.name
  }))
} */

export async function generateMetadata (
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const tagName = params?.tag
  const tag = allTags.find(tag => tag.name === tagName)

  if (!tag) {
    return {
      title: 'Tag Not Found'
    }
  }

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
  const BLOG_DOMAIN =
    `${process.env.DOMAIN}/blog` || 'https://fraineralex.vercel.app/blog'

  return {
    title: tag.label,
    description: tag.description,
    openGraph: {
      title: `${tag.label} | Frainer's Blog 📝`,
      images: [tag.image, ...previousImages],
      description: tag.description,
      url: `${BLOG_DOMAIN}/tags/${tag.name}`
    }
  }
}

export const revalidate = 60

export default async function BlogPage ({ params }: Props) {
  const tagName = params?.tag
  const sortedPosts = allPosts
    .filter(post => post.published && post.tags?.includes(tagName))
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    )
  const postKeys = sortedPosts
    .filter(post => post.tags?.includes(tagName))
    .map(post => ['pageviews', 'posts', post?.slug].join(':'))

  let views: Record<string, number> = {}

  if (postKeys.length > 0) {
    views = (await redis.mget<number[]>(...postKeys)).reduce((acc, v, i) => {
      acc[sortedPosts[i].slug] = v ?? 0
      return acc
    }, {} as Record<string, number>)
  }

  const tag = allTags.find(tag => tag.name === tagName)

  return (
    <div className='relative'>
      <Navigation />
      <div className='px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-26'>
        <header className='mx-auto max-w-4xl text-center home-header tag'>
          <h1 className='font-bold leading-none font-londrina text-white'>
            Articles about{' '}
            <code className='relative rounded bg-white bg-opacity-25 py-[0.2rem] px-[0.5rem] font-mono font-bold text-white lowercase'>
              {tag?.label || tagName}
            </code>
          </h1>
          <p className='text-zinc-400 mt-6 md:mt-6 text-xs md:text-lg leading-relaxed'>
            {sortedPosts.length === 0 ? (
              <>
                ☹️ There are no articles about{' '}
                <strong className='text-zinc-300 font-bold'>
                  {tag?.label || tagName}
                </strong>{' '}
                yet. Check back later!
              </>
            ) : (
              tag?.description
            )}
          </p>
        </header>

        <div className='grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3'>
          <div className='grid grid-cols-1 gap-4 animate-fade-up-one'>
            {sortedPosts
              .filter((_, i) => i % 3 === 0)
              .map((post, index) => (
                <Article
                  key={post?.slug || index}
                  post={post}
                  views={views[post?.slug] ?? 0}
                />
              ))}
          </div>
          <div className='grid grid-cols-1 gap-4 animate-fade-up-two'>
            {sortedPosts
              .filter((_, i) => i % 3 === 1)
              .map((post, index) => (
                <Article
                  key={post?.slug || index}
                  post={post}
                  views={views[post?.slug] ?? 0}
                />
              ))}
          </div>
          <div className='grid grid-cols-1 gap-4 animate-fade-up-three'>
            {sortedPosts
              .filter((_, i) => i % 3 === 2)
              .map((post, index) => (
                <Article
                  key={post?.slug || index}
                  post={post}
                  views={views[post?.slug] ?? 0}
                />
              ))}
          </div>
        </div>
        <ArticlesByTags />
      </div>
    </div>
  )
}
