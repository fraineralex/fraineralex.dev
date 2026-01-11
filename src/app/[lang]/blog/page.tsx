import '@/styles/blog/home.css'
import { Locale, i18n } from '@/i18n-config'
import Link from 'next/link'
import React from 'react'
import dynamic from 'next/dynamic'
import { Article } from '@/components/blog/articles/article'
import { getAllViewCounts } from '@/lib/views'
import { Eye } from 'lucide-react'
import Image from 'next/image'
const ArticlesByTags = dynamic(
  () => import('@/components/blog/tags/articles-by-tags')
)
import { allPosts } from '@/lib/posts'
import { getDictionary } from '@/get-dictionary'

// Static pages - only regenerate on new deploy
export const revalidate = false

interface Props {
  params: Promise<{ lang?: Locale }>
}

export default async function BlogPage ({ params }: Props) {
  const { lang: paramLang } = await params
  const lang = paramLang || i18n.defaultLocale
  const { home } = (await getDictionary(lang)).blog

  // Use cached view counts (5 minute cache) for better performance
  const slugs = allPosts.map(post => post.slug)
  const views = await getAllViewCounts(slugs)

  let sorted = allPosts.filter(post => post.lang === lang)
  const thereAreFourPosts = sorted.length >= 4

  // define featured, top2, top3 as type Post
  let featured = allPosts[0]
  let top2 = allPosts[0]
  let top3 = allPosts[0]

  if (thereAreFourPosts) {
    featured = allPosts.find(post => post?.slug === home.topArticles.featured)!

    top2 = allPosts.find(post => post?.slug === home.topArticles.top2)!

    top3 = allPosts.find(post => post?.slug === home.topArticles.top3)!
    sorted = allPosts
      .filter(post => post.published)
      .filter(
        post =>
          post?.slug !== featured.slug &&
          post?.slug !== top2?.slug &&
          post?.slug !== top3?.slug
      )
      .sort(
        (a, b) =>
          new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
          new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
      )
  }

  const locale = lang !== i18n.defaultLocale ? `/${lang}` : ''

  return (
    <div className='relative'>
      <div className='px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-26'>
        <header className='mx-auto max-w-2xl text-center home-header'>
          <h1 className='pb-2 md:pb-3 uppercase font-bold leading-none text-zinc-100'>
            {' '}
            {thereAreFourPosts ? home.title.main : home.title.temporal}
          </h1>
          <p className='text-zinc-400 md:text-lg leading-relaxed text-sm'>
            {home.description}
          </p>
        </header>

        {thereAreFourPosts && (
          <>
            <div className='mx-auto lg:mx-0 w-full'>
              <h2 className='text-3xl font-bold tracking-wide text-zinc-500 sm:text-4xl pb-5 font-londrina'>
                {home.topArticles.label}
              </h2>
              <div className='w-full h-px bg-zinc-700' />
            </div>

            <div className='grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2'>
              <Link
                href={`${locale}/${featured.slug}`}
                className='bg-gradient-to-br opacity-100  via-zinc-100/10 overflow-hidden relative border rounded-xl hover:bg-zinc-800/10 group md:gap-8 hover:border-zinc-400/50 border-zinc-600'
              >
                <Image
                  style={{
                    width: '100%',
                    aspectRatio: '15 / 5',
                    objectFit: 'cover'
                  }}
                  className='squiggle'
                  src={featured.hero}
                  alt={featured.title}
                  width='360'
                  height='192'
                  priority
                />
                <article className='relative w-full h-full p-4 md:p-8'>
                  <div className='flex items-center justify-between gap-2'>
                    <div className='text-xs text-zinc-100'>
                      {featured.date ? (
                        <time dateTime={new Date(featured.date).toISOString()}>
                          {Intl.DateTimeFormat(undefined, {
                            dateStyle: 'medium'
                          }).format(new Date(featured.date))}
                        </time>
                      ) : (
                        <span>{home.soon}</span>
                      )}
                    </div>
                    <span className='flex items-center gap-1 text-xs text-zinc-500'>
                      <Eye className='w-4 h-4' />{' '}
                      {Intl.NumberFormat('en-US', {
                        notation: 'compact'
                      }).format(views[featured.slug] ?? 0)}
                    </span>
                  </div>

                  <h2
                    id='featured-post'
                    className='mt-4 text-3xl sm:text-4xl font-bold text-zinc-100 group-hover:text-white  font-londrina'
                  >
                    {featured.title}
                  </h2>
                  <p className='mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300'>
                    {featured.description}
                  </p>
                  <div className='absolute bottom-52'>
                    <p className='hidden text-zinc-200 hover:text-zinc-50 lg:block'>
                      {home.just} {featured.readTime} {home.minRead}{' '}
                      <span aria-hidden='true'>&rarr;</span>
                    </p>
                  </div>
                </article>
              </Link>

              <div className='flex flex-col w-full gap-9 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 '>
                {[top2, top3].map((post, index) => (
                  <Article
                    key={post?.slug || index}
                    post={post}
                    views={views[post?.slug] ?? 0}
                    isTopArticle
                    lang={lang}
                    priority={index === 0}
                  />
                ))}
              </div>
            </div>
            <div className='mx-auto lg:mx-0 w-full'>
              <h2 className='text-3xl font-bold tracking-wide text-zinc-500 sm:text-4xl pb-5 font-londrina'>
                {home.latestArticles}
              </h2>
              <div className='w-full h-px bg-zinc-700' />
            </div>
          </>
        )}

        <div className='grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3'>
          <div className='grid grid-cols-1 gap-4 animate-fade-up-one'>
            {sorted
              .filter((_, i) => i % 3 === 0)
              .map((post, index) => (
                <Article
                  key={post?.slug || index}
                  post={post}
                  views={views[post?.slug] ?? 0}
                  lang={lang}
                />
              ))}
          </div>
          <div className='grid grid-cols-1 gap-4 animate-fade-up-two'>
            {sorted
              .filter((_, i) => i % 3 === 1)
              .map((post, index) => (
                <Article
                  key={post?.slug || index}
                  post={post}
                  views={views[post?.slug] ?? 0}
                  lang={lang}
                />
              ))}
          </div>
          <div className='grid grid-cols-1 gap-4 animate-fade-up-three'>
            {sorted
              .filter((_, i) => i % 3 === 2)
              .map((post, index) => (
                <Article
                  key={post?.slug || index}
                  post={post}
                  views={views[post?.slug] ?? 0}
                  lang={lang}
                />
              ))}
          </div>
        </div>
        <ArticlesByTags lang={lang} />
      </div>
    </div>
  )
}
