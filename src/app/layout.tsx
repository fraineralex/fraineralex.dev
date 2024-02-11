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

const englishMetadata: Metadata = {
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

const spanishMetadata: Metadata = {
  title: {
    default: 'Frainer Encarnación',
    template: '%s | Frainer Encarnación'
  },
  category: 'Portafolio Personal',
  keywords: [
    'Frainer Encarnación',
    'Frainer Alexander Encarnación Valenzuela',
    'Desarrollador Web',
    'Desarrollador Full Stack',
    'Ingeniero de Software',
    'Desarrollador Frontend',
    'Desarrollador Backend'
  ],
  description:
    'Soy Frainer Encarnación, un Desarrollador Full Stack basado en la República Dominicana que construye productos accesibles y experiencias digitales para la web.',
  metadataBase: new URL(
    `${process.env.DOMAIN}/es` || 'https://fraineralex.dev/es'
  ),
  alternates: {
    canonical: '/',
    languages: {
      'es-DO': '/es',
      'en-US': '/'
    },
    types: {
      'application/rss+xml': '/blog/rss.xml'
    }
  },
  openGraph: {
    title: 'Frainer Encarnación',
    description:
      'Desarrollador Full Stack basado en la República Dominicana que construye productos accesibles y experiencias digitales para la web.',
    url: `${process.env.DOMAIN}/es`,
    siteName: `${process.env.DOMAIN?.replace('https://', '')}`,
    images: [
      {
        url: '/es-og.webp',
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
    title: 'Frainer Encarnación',
    card: 'summary_large_image',
    creator: '@fraineralex',
    site: '@fraineralex',
    description:
      'Desarrollador Full Stack basado en la República Dominicana que construye productos accesibles y experiencias digitales para la web.',
    images: [
      {
        url: '/es-og.webp',
        width: 1920,
        height: 1080
      }
    ]
  },
  icons: {
    shortcut: '/favicon.ico'
  }
}

export async function generateMetadata ({ params }: Props): Promise<Metadata> {
  return params?.lang === 'es' ? spanishMetadata : englishMetadata
}

interface Props {
  children: React.ReactNode
  params?: { lang: Locale }
}

export default function LangLayout ({ children, params }: Props) {
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
