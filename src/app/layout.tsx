import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MouseShadow } from '@/components/layout/mouse-shadow'
import { Locale, i18n } from '@/i18n-config'
import Navigation from '@/components/blog/nav/nav'
import LocalFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'

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
    default: 'Frainer Encarnación',
    template: '%s | Frainer Encarnación'
  },
  category: 'Personal Portfolio',
  keywords: [
    'Frainer Encarnación',
    'Frainer Alexander Encarnación Valenzuela',
    'Web Developer',
    'Full Stack Developer',
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer'
  ],
  description:
    "I'm Frainer Encarnación, a Full Stack Developer based in Dominican Republic who builds accessible products and digital experiences for the web.",
  metadataBase: new URL(process.env.DOMAIN || 'https://fraineralex.dev'),
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
    title: 'Frainer Encarnación',
    description:
      'Full Stack Developer based in Dominican Republic who builds accessible products and digital experiences for the web.',
    url: `${process.env.DOMAIN}`,
    siteName: `${process.env.DOMAIN?.replace('https://', '')}`,
    images: [
      {
        url: '/og.webp',
        width: 1920,
        height: 1080
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
    title: 'Frainer Encarnación',
    card: 'summary_large_image',
    creator: '@fraineralex',
    site: '@fraineralex',
    description:
      'Full Stack Developer based in Dominican Republic who builds accessible products and digital experiences for the web.',
    images: [
      {
        url: '/og.webp',
        width: 1920,
        height: 1080
      }
    ]
  },
  icons: {
    shortcut: '/favicon.ico'
  }
}

interface Props {
  children: React.ReactNode
  params?: { lang: Locale }
}

export default function RootLayout ({ children, params }: Props) {
  const lang = params?.lang || i18n.defaultLocale
  return (
    <html
      className={`${[
        inter.variable,
        calSans.variable,
        londrinaSolid.variable
      ].join(' ')} scroll-smooth`}
      data-lt-installed='true'
      lang={lang}
    >
      <body className='bg-gray-800 leading-relaxed text-slate-400 antialiased selection:bg-teal-400 selection:text-white mx-auto min-h-screen max-w-screen-xl py-12 font-sans md:py-20 lg:py-0'>
        <MouseShadow />
        <Navigation />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
