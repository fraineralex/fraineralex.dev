import type { Post } from '@/lib/posts'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import Image from 'next/image'
import { Card } from './card'
import '@/styles/blog/article.css'
import { Locale } from '@/i18n-config'

type Props = {
  post: Post
  views: number
  isTopArticle?: boolean
  lang?: Locale
  priority?: boolean
}

export const Article: React.FC<Props> = ({ post, views, isTopArticle, lang, priority }) => {
  const aspectRatio = isTopArticle ? '4 / 3' : '15 / 7'
  const imageStyles: {} = isTopArticle
    ? { aspectRatio, objectFit: 'contain', width: '100%', height: '100%' }
    : { aspectRatio, objectFit: 'cover', width: '100%' }

  return (
    <Link
      href={`/${lang}/blog/${post?.slug}`}
      className={`bg-gradient-to-br opacity-100 via-zinc-100/10 overflow-hidden relative border rounded-xl hover:bg-zinc-800/10 group hover:border-zinc-200/50 border-zinc-600 lg:hover:transform lg:hover:-translate-y-2 transition-all duration-300 ease-in-out ${
        isTopArticle ? 'relative grid grid-cols-8 min-h-[250px]' : 'md:gap-0'
      }`}
    >
      <Image
        style={imageStyles}
        className={`squiggle z-50 ${
          isTopArticle ? 'h-full w-full col-span-2 bg-slate-950 p-2' : ''
        } transform transition-transform group-hover:scale-110`}
        src={post.hero}
        alt={post.title}
        width='360'
        height='192'
        priority={priority}
      />

      <Card className={`${isTopArticle ? 'col-span-6 h-full flex' : ''}`}>
        <article className={`p-4 md:p-8 h-full flex flex-col ${isTopArticle ? 'col-span-6' : ''}`}>
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
          <h2 className='z-20 text-xl font-bold duration-1000 lg:text-3xl text-zinc-300 group-hover:text-zinc-100 font-londrina line-clamp-2'>
            {post?.title}
          </h2>
          <p className='z-20 mt-4 text-sm duration-1000 text-zinc-400 group-hover:text-zinc-300 line-clamp-3'>
            {post?.description}
          </p>
          <div className='mt-auto pt-4'>
            <p className='hidden text-zinc-200 group-hover:text-white lg:block'>
              Just {post.readTime} min read <span aria-hidden='true'>&rarr;</span>
            </p>
          </div>
        </article>
      </Card>
    </Link>
  )
}
