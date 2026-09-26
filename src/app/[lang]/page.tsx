import { notFound } from 'next/navigation'
import { Locale, i18n } from '@/i18n-config'
import { getDictionary } from '@/get-dictionary'
import Observer from '@/components/common/intersection-observer'
import { Metadata } from 'next'
import { allPosts } from '@/lib/posts'
import {
  EN_SITE_DESCRIPTION,
  EN_SITE_KEYWORDS,
  EN_SITE_OG_DESCRIPTION,
  EN_SITE_TITLE,
  ES_SITE_DESCRIPTION,
  ES_SITE_KEYWORDS,
  ES_SITE_OG_DESCRIPTION,
  ES_SITE_TITLE,
  SITE_URL
} from '@/lib/site-metadata'

interface Props {
  params: Promise<{ lang: Locale }>
}

const englishMetadata: Metadata = {
  title: EN_SITE_TITLE,
  category: 'Personal Portfolio',
  keywords: EN_SITE_KEYWORDS,
  description: EN_SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
      'es-DO': '/es'
    },
    types: {
      'application/rss+xml': '/blog/feed.xml'
    }
  },
  openGraph: {
    title: EN_SITE_TITLE,
    description: EN_SITE_OG_DESCRIPTION,
    url: SITE_URL,
    siteName: 'fraineralex.dev',
    images: [
      {
        url: '/og.jpg',
        width: 2880,
        height: 1620
      }
    ],
    locale: 'en-US',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  twitter: {
    title: EN_SITE_TITLE,
    card: 'summary_large_image',
    creator: '@fraineralex',
    site: '@fraineralex',
    description: EN_SITE_OG_DESCRIPTION,
    images: [
      {
        url: '/og.jpg',
        width: 2880,
        height: 1620
      }
    ]
  },
  icons: {
    shortcut: '/favicon.ico'
  }
}

const spanishMetadata: Metadata = {
  title: ES_SITE_TITLE,
  category: 'Portafolio Personal',
  keywords: ES_SITE_KEYWORDS,
  description: ES_SITE_DESCRIPTION,
  metadataBase: new URL(`${SITE_URL}/es`),
  alternates: {
    canonical: '/',
    languages: {
      'es-DO': '/',
      'en-US': SITE_URL
    },
    types: {
      'application/rss+xml': '/blog/rss.xml'
    }
  },
  openGraph: {
    title: ES_SITE_TITLE,
    description: ES_SITE_OG_DESCRIPTION,
    url: `${SITE_URL}/es`,
    siteName: 'fraineralex.dev',
    images: [
      {
        url: `${process.env.DOMAIN}/es-og.webp`,
        width: 1920,
        height: 1080
      }
    ],
    locale: 'es-DO',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  twitter: {
    title: ES_SITE_TITLE,
    card: 'summary_large_image',
    creator: '@fraineralex',
    site: '@fraineralex',
    description: ES_SITE_OG_DESCRIPTION,
    images: [
      {
        url: `${process.env.DOMAIN}/es-og.webp`,
        width: 1920,
        height: 1080
      }
    ]
  },
  icons: {
    shortcut: '/favicon.ico'
  }
}

export const dynamicParams = false

export async function generateMetadata ({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!i18n.locales.some(locale => locale === lang)) notFound()
  return lang === 'es' ? spanishMetadata : englishMetadata
}

export default async function Home ({ params }: Props) {
  const { lang: paramLang } = await params
  if (!i18n.locales.some(locale => locale === paramLang)) notFound()
  const lang = paramLang || i18n.defaultLocale
  const dictionary = await getDictionary(lang)

  const posts = allPosts.map(post => ({
    title: post.title,
    hero: post.hero,
    date: post.date,
    slug: post.slug,
    lang: post.lang,
    published: post.published
  }))

  return (
    <>
      <Observer dictionary={dictionary} lang={lang} posts={posts} />
    </>
  )
}
