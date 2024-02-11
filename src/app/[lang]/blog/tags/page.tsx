import React from 'react'
import { ArticlesByTags } from '@/components/blog/tags/articles-by-tags'
import '@/styles/blog/home.css'
import { Metadata } from 'next'
import { Locale, i18n } from '@/i18n-config'
import { getDictionary } from '@/get-dictionary'

const BLOG_DOMAIN =
  `${process.env.DOMAIN}/blog` || 'https://fraineralex.dev/blog'

const englishMetadata: Metadata = {
  title: 'Tags',
  description:
    'Here you will find the tags of articles about web development, software engineering, and many more geeky things in the world of programming.',
  openGraph: {
    title: "Tags | Frainer's Blog 📝",
    description:
      'Here you will find the tags of articles about web development, software engineering, and many more geeky things in the world of programming.',
    url: `${BLOG_DOMAIN}/blog/tags`,
    images: [
      {
        url: `${process.env.DOMAIN}/images/blog/tags-og.webp`,
        width: 1920,
        height: 1080
      }
    ]
  }
}

const spanishMetadata: Metadata = {
  title: 'Etiquetas',
  description:
    'Aquí encontrarás las etiquetas de artículos sobre desarrollo web, ingeniería de software y muchas otras cosas geek en el mundo de la programación.',
  openGraph: {
    title: "Etiquetas | Frainer's Blog 📝",
    description:
      'Aquí encontrarás las etiquetas de artículos sobre desarrollo web, ingeniería de software y muchas otras cosas geek en el mundo de la programación.',
    url: `${BLOG_DOMAIN}/blog/etiquetas`,
    images: [
      {
        url: `${process.env.DOMAIN}/images/blog/es-tags-og.webp`,
        width: 1920,
        height: 1080
      }
    ]
  }
}

export async function getMetadata (params: { lang: Locale }) {
  return params.lang === 'es' ? spanishMetadata : englishMetadata
}

interface Props {
  params: {
    lang: Locale
  }
}

export default async function TagsPage ({ params }: Props) {
  const lang = params?.lang ?? i18n.defaultLocale
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
