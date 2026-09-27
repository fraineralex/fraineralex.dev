import React from 'react'
import { ArticlesByTags } from '@/components/blog/tags/articles-by-tags'
import '@/styles/blog/home.css'
import { Metadata } from 'next'
import { Locale, i18n } from '@/i18n-config'
import { getDictionary } from '@/get-dictionary'
import { allTags } from '@/utils/data'
import { localizedUrl, SITE_URL } from '@/lib/site-metadata'

const englishMetadata: Metadata = {
  title: 'Tags',
  description:
    'Here you will find the tags of articles about web development, software engineering, and many more geeky things in the world of programming.',
  keywords: [allTags.map(tag => tag.label).join(', ')],
  alternates: {
    canonical: localizedUrl('en', '/blog/tags'),
    languages: {
      'en-US': localizedUrl('en', '/blog/tags'),
      'es-DO': localizedUrl('es', '/blog/tags'),
      'x-default': localizedUrl('en', '/blog/tags')
    },
    types: {
      'application/rss+xml': localizedUrl('en', '/blog/feed.xml')
    }
  },
  openGraph: {
    title: "Tags | Frainer's Blog 📝",
    description:
      'Here you will find the tags of articles about web development, software engineering, and many more geeky things in the world of programming.',
    url: localizedUrl('en', '/blog/tags'),
    images: [
      {
        url: `${SITE_URL}/images/blog/tags-og.webp`,
        width: 1920,
        height: 1080
      }
    ]
  },
  twitter: {
    title: "Tags | Frainer's Blog 📝",
    card: 'summary_large_image',
    creator: '@fraineralex',
    site: '@fraineralex',
    images: [
      {
        url: `${SITE_URL}/images/blog/tags-og.webp`,
        width: 1920,
        height: 1080
      }
    ],
    description:
      'Here you will find the tags of articles about web development, software engineering, and many more geeky things in the world of programming.'
  }
}

const spanishMetadata: Metadata = {
  title: "Etiquetas | Frainer's Blog 📝",
  description:
    'Aquí encontrarás las etiquetas de artículos sobre desarrollo web, ingeniería de software y muchas otras cosas geek en el mundo de la programación.',
  keywords: [allTags.map(tag => tag.label).join(', ')],
  alternates: {
    canonical: localizedUrl('es', '/blog/tags'),
    languages: {
      'en-US': localizedUrl('en', '/blog/tags'),
      'es-DO': localizedUrl('es', '/blog/tags'),
      'x-default': localizedUrl('en', '/blog/tags')
    },
    types: {
      'application/rss+xml': localizedUrl('es', '/blog/feed.xml')
    }
  },
  openGraph: {
    title: "Etiquetas | Frainer's Blog 📝",
    description:
      'Aquí encontrarás las etiquetas de artículos sobre desarrollo web, ingeniería de software y muchas otras cosas geek en el mundo de la programación.',
    url: localizedUrl('es', '/blog/tags'),
    images: [
      {
        url: `${SITE_URL}/images/blog/es-tags-og.webp`,
        width: 1920,
        height: 1080
      }
    ]
  },
  twitter: {
    title: "Etiquetas | Frainer's Blog 📝",
    card: 'summary_large_image',
    creator: '@fraineralex',
    site: '@fraineralex',
    images: [
      {
        url: `${SITE_URL}/images/blog/es-tags-og.webp`,
        width: 1920,
        height: 1080
      }
    ],
    description:
      'Aquí encontrarás las etiquetas de artículos sobre desarrollo web, ingeniería de software y muchas otras cosas geek en el mundo de la programación.'
  }
}

export const dynamicParams = false

export async function generateMetadata ({ params }: Props) {
  const { lang } = await params
  return lang === 'es' ? spanishMetadata : englishMetadata
}

interface Props {
  params: Promise<{
    lang: Locale
  }>
}

export default async function TagsPage ({ params }: Props) {
  const { lang: paramLang } = await params
  const lang = paramLang ?? i18n.defaultLocale
  const { tags } = (await getDictionary(lang)).blog
  return (
    <div className='relative'>
      <div className='px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-26 home-header'>
        <header className='mx-auto max-w-2xl text-center home-header pb-14'>
          <h1 className='pb-2 md:pb-3 uppercase font-bold leading-none text-zinc-100'>
            {tags.title}
          </h1>
          <p className='text-zinc-400 md:text-lg leading-relaxed text-sm'>
            {tags.description}
          </p>
        </header>
        <ArticlesByTags displayAllTags lang={lang} />
      </div>
    </div>
  )
}
