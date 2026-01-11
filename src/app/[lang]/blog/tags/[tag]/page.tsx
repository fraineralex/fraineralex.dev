import React from 'react'
import { Article } from '@/components/blog/articles/article'
import { getAllViewCounts } from '@/lib/views'
import { ArticlesByTags } from '@/components/blog/tags/articles-by-tags'
import { allTags } from '@/utils/data'
import { Metadata, ResolvingMetadata } from 'next'
import '@/styles/blog/home.css'
import { allPosts } from '@/lib/posts'
import { Locale, i18n } from '@/i18n-config'
import { getDictionary } from '@/get-dictionary'

type Props = {
  params: Promise<{
    lang: Locale
    tag: string
  }>
}

export async function generateStaticParams(): Promise<{ lang: Locale; tag: string }[]> {
  const allParams: { lang: Locale; tag: string }[] = []
  
  for (const tag of allTags) {
    allParams.push({ lang: 'en', tag: tag.name })
    allParams.push({ lang: 'es', tag: tag.name })
  }

  return allParams
}

const englishMetadata = async (tagName: string): Promise<Metadata> => {
  const tag = allTags.find(tag => tag.name === tagName)

  if (!tag) {
    return {
      title: 'Tag Not Found'
    }
  }

  const BLOG_DOMAIN =
    `${process.env.DOMAIN}/blog` || `https://fraineralex.dev/blog`

  return {
    title: tag.label,
    description: tag.description,
    keywords: [
      tag.label,
      `Articles about ${tag.label}`,
      `Tutorials about ${tag.label}`,
      `Best practices in ${tag.label}`
    ],
    openGraph: {
      title: `${tag.label} | Frainer's Blog 📝`,
      images: [
        {
          url: `${process.env.DOMAIN}${tag.image}`,
          width: 32,
          height: 32
        },
        {
          url: `${process.env.DOMAIN}/images/blog/tags-og.webp`,
          width: 1920,
          height: 1080
        }
      ],
      description: tag.description,
      url: `${BLOG_DOMAIN}/tags/${tag.name}`
    },
    twitter: {
      title: `${tag.label} | Frainer's Blog 📝`,
      card: 'summary_large_image',
      creator: '@fraineralex',
      site: '@fraineralex',
      images: [
        {
          url: `${process.env.DOMAIN}${tag.image}`,
          width: 32,
          height: 32
        },
        {
          url: `${process.env.DOMAIN}/images/blog/tags-og.webp`,
          width: 1920,
          height: 1080
        }
      ],
      description: tag.description
    }
  }
}

const spanishMetadata = async (tagName: string): Promise<Metadata> => {
  const tag = allTags.find(tag => tag.name === tagName)

  if (!tag) {
    return {
      title: 'Etiqueta no encontrada'
    }
  }

  const BLOG_DOMAIN =
    `${process.env.DOMAIN}/es/blog` || `https://fraineralex.dev/es/blog`

  return {
    title: tag.spanishLabel || tag.label,
    description: tag.spanishDescription,
    keywords: [
      tag.label,
      `Artículos sobre ${tag.spanishLabel || tag.label}`,
      `Tutoriales sobre ${tag.spanishLabel || tag.label}`,
      `Buenas prácticas en ${tag.spanishLabel || tag.label}`
    ],
    openGraph: {
      title: `${tag.spanishLabel || tag.label} | Frainer's Blog 📝`,
      images: [
        {
          url: `${process.env.DOMAIN}${tag.image}`,
          width: 32,
          height: 32
        },
        {
          url: `${process.env.DOMAIN}/images/blog/es-tags-og.webp`,
          width: 1920,
          height: 1080
        }
      ],
      description: tag.spanishDescription,
      url: `${BLOG_DOMAIN}/tags/${tag.name}`
    },
    twitter: {
      title: `${tag.spanishLabel || tag.label} | Frainer's Blog 📝`,
      card: 'summary_large_image',
      creator: '@fraineralex',
      site: '@fraineralex',
      images: [
        {
          url: `${process.env.DOMAIN}${tag.image}`,
          width: 32,
          height: 32
        },
        {
          url: `${process.env.DOMAIN}/images/blog/es-tags-og.webp`,
          width: 1920,
          height: 1080
        }
      ],
      description: tag.spanishDescription
    }
  }
}

export async function generateMetadata ({ params }: Props): Promise<Metadata> {
  const { lang, tag } = await params
  const metadata = lang === 'es' ? spanishMetadata : englishMetadata
  return await metadata(tag)
}

// Static pages - only regenerate on new deploy
export const revalidate = false

export default async function BlogPage ({ params }: Props) {
  const { tag: tagName, lang: paramLang } = await params
  const lang = paramLang ?? i18n.defaultLocale
  const dictionary = (await getDictionary(lang)).blog.tags['[tag]']

  const sortedPosts = allPosts
    .filter(
      post =>
        post.published && post.tags?.includes(tagName) && post.lang === lang
    )
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    )

  // Use cached view counts (5 minute cache) for better performance
  const slugs = sortedPosts.map(post => post.slug)
  const views = await getAllViewCounts(slugs)

  const tag = allTags.find(tag => tag.name === tagName)

  return (
    <div className='relative'>
      <div className='px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-26'>
        <header className='mx-auto max-w-4xl text-center home-header tag'>
          <h1 className='font-bold leading-none font-londrina text-white'>
            {dictionary.title}{' '}
            <code className='relative rounded bg-white bg-opacity-25 py-[0.2rem] px-[0.5rem] font-mono font-bold text-white lowercase'>
              {lang !== i18n.defaultLocale
                ? tag?.spanishLabel
                : tag?.label || tagName}
            </code>
          </h1>
          <p className='text-zinc-400 mt-6 md:mt-6 text-xs md:text-lg leading-relaxed'>
            {sortedPosts.length === 0 ? (
              <>
                {dictionary.notFound.first}{' '}
                <strong className='text-zinc-300 font-bold'>
                  {tag?.label || tagName}
                </strong>{' '}
                {dictionary.notFound.second}
              </>
            ) : lang !== i18n.defaultLocale ? (
              tag?.spanishDescription
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
                  lang={lang}
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
                  lang={lang}
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
