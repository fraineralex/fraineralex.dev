import { notFound } from 'next/navigation'
import { Mdx } from '@/components/blog/articles/mdx'
import dynamic from 'next/dynamic'
const Header = dynamic(() => import('@/components/blog/content/header'))
import '@/styles/blog/mdx.css'
import { ReportView } from '@/components/blog/content/view'
import { Redis } from '@upstash/redis'
import Image from 'next/image'
import { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'
const Subscribe = dynamic(() => import('@/components/blog/footer/subscribe'))
import { allTags } from '@/utils/data'
import { allPosts } from 'contentlayer/generated'
import { Locale, i18n } from '@/i18n-config'
import { getDictionary } from '@/get-dictionary'
//import allPosts from '@/util/monks'

export const revalidate = 60
const redis = Redis.fromEnv()

type Props = {
  params: {
    lang: Locale
    slug: string
  }
}

export async function generateStaticParams (): Promise<Props['params'][]> {
  return allPosts
    .filter(post => post.published)
    .map(
      p =>
        ({
          lang: p.lang,
          slug: p.slug
        } as { lang: Locale; slug: string })
    )
}

export async function generateMetadata (
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params?.slug
  const lang = params?.lang ?? i18n.defaultLocale
  const post = allPosts.find(post => post.slug === slug && post.lang === lang)

  if (!post) {
    return {
      title: 'Not Found'
    }
  }

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
  const BLOG_DOMAIN =
    `${process.env.DOMAIN}/${
      lang !== i18n.defaultLocale ? `${lang}/` : ''
    }blog` ||
    `https://fraineralex.vercel.app${
      lang !== i18n.defaultLocale ? `${lang}/` : ''
    }blog`

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: `${post.title} | Frainer's Blog 📝`,
      images: [post.hero, ...previousImages],
      description: post.description,
      url: `${BLOG_DOMAIN}/${post.slug}`
    }
  }
}

export default async function PostPage ({ params }: Props) {
  const slug = params?.slug
  const lang = params?.lang ?? i18n.defaultLocale
  const dictionary = (await getDictionary(lang)).blog['[slug]']

  const post = allPosts.find(post => post.slug === slug && post.lang === lang)

  if (!post) {
    notFound()
  }

  const views =
    (await redis.get<number>(['pageviews', 'posts', slug].join(':'))) ?? 0

  return (
    <section className='min-h-screen max-w-6xl md:max-w-5xl mx-auto px-4 md:px-8 text-zinc-300'>
      <Header views={views} />
      <ReportView slug={post.slug} />
      <header className='mx-auto w-full text-center content pt-20 md:pt-28 home-header'>
        <h1 className='text-white mb-8 w-full'>{post.title}</h1>
      </header>

      <figure className='cover'>
        <Image
          className='rounded-xl mx-auto w-full'
          style={{ minWidth: '80%' }}
          loading='lazy'
          src={post.hero}
          alt={post.title}
          width={800}
          height={427}
        />
        {post.heroSource && (
          <figcaption className='text-right text-sm text-zinc-600 pe-8 pt-1 italic'>
            {post.heroSource}
          </figcaption>
        )}
      </figure>

      <small className='text-xs md:text-sm text-zinc-400 flex flex-col font-bold uppercase md:flex-row text-center pb-8 place-content-center py-6 md:px-6'>
        <span className='mb-2 md:mb-0'>
          {post.updated && <span>{dictionary.updatedOn}</span>}{' '}
          <time
            dateTime={new Date(post.updated || post.date).toISOString()}
            className={`${
              post.updated ? 'underline underline-offset-4' : undefined
            }`}
          >
            {Intl.DateTimeFormat(undefined, {
              dateStyle: 'medium'
            }).format(new Date(post.updated || post.date))}
          </time>{' '}
          <span className='px-1 md:px-4'>•</span>
          <span className='me-2 md:me-0'>
            {post.readTime} {dictionary.minRead}
          </span>
          {post.tags &&
            post.tags.slice(0, 2).map((tagName, index) => {
              const tag = allTags.find(tag => tag.name === tagName)
              return (
                <>
                  <Link
                    key={index}
                    href={`/blog/tags/${tag?.name || tagName}`}
                    className='text-teal-300 font-bold underline underline-offset-4 py-3 md:px-1 hover:text-white text-xs inline md:hidden'
                  >
                    {tag?.label || tagName}
                  </Link>
                  {index !== (post.tags?.length ?? 0) - 1 && (
                    <span className='px-1 inline md:hidden'>•</span>
                  )}
                </>
              )
            })}
        </span>
        <span className='hidden px-1 md:px-4 md:block'>|</span>
        <div className='hidden md:flex flex-wrap px-1 text-center place-content-center'>
          {post.tags &&
            post.tags.map((tagName, index) => {
              const tag = allTags.find(tag => tag.name === tagName)
              return (
                <div key={index}>
                  <Link
                    href={`/blog/tags/${tag?.name || tagName}`}
                    className='text-teal-300 font-medium md:font-bold underline underline-offset-4 py-3 md:px-1 hover:text-white'
                  >
                    {tag?.label || tagName}
                  </Link>
                  {index !== (post.tags?.length ?? 0) - 1 && (
                    <span className='px-1'>•</span>
                  )}
                </div>
              )
            })}
        </div>
      </small>

      <article className='max-w-6xl mx-auto md:max-w-4xl px-4 md:px-8 content pb-12'>
        <Mdx code={post.body.code} />
      </article>
      <Subscribe dictionary={dictionary.newsletter} />
    </section>
  )
}
