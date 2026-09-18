import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MouseShadow } from '@/components/layout/mouse-shadow'
import { Locale, i18n } from '@/i18n-config'
import Navigation from '@/components/blog/nav/nav'
import LocalFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { PostsProvider } from '@/context/posts-context'
import { allPostsMeta } from '@/lib/posts'

import { SiteJsonLd } from '@/components/layout/json-ld'
import {
  EN_SITE_DESCRIPTION,
  EN_SITE_KEYWORDS,
  EN_SITE_OG_DESCRIPTION,
  EN_SITE_TITLE,
  SITE_URL
} from '@/lib/site-metadata'

import '@/styles/globals.css'
import '@/styles/site.css'

export async function generateStaticParams () {
  return i18n.locales.map(locale => ({ lang: locale }))
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const calSans = LocalFont({
  src: '../../public/fonts/CalSans-SemiBold.ttf',
  variable: '--font-calsans'
})

const londrinaSolid = LocalFont({
  src: '../../public/fonts/LondrinaSolid-Regular.ttf',
  variable: '--font-londrina'
})

export const metadata: Metadata = {
  title: {
    default: EN_SITE_TITLE,
    template: '%s | Frainer Encarnación'
  },
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
        width: 1200,
        height: 675
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
        width: 1200,
        height: 675,
        alt: 'Frainer Encarnación',
      }
    ]
  },
  icons: {
    shortcut: '/favicon.ico'
  }
}

interface Props {
  children: React.ReactNode
  params: Promise<{ lang?: Locale }>
}

export default async function RootLayout ({ children, params }: Props) {
  const { lang: paramLang } = await params
  const lang = paramLang || i18n.defaultLocale
  return (
    <html
      className={`${[
        inter.variable,
        calSans.variable,
        londrinaSolid.variable
      ].join(' ')} scroll-smooth bg-slate-900`}
      data-lt-installed='true'
      lang={lang}
    >
      <body className='bg-slate-900 leading-relaxed text-slate-400 antialiased selection:bg-teal-400 selection:text-white mx-auto min-h-screen max-w-screen-xl py-12 font-sans md:py-20 lg:py-0'>
        <SiteJsonLd />
        <PostsProvider posts={allPostsMeta}>
          <MouseShadow />
          <Navigation />
          {children}
        </PostsProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
