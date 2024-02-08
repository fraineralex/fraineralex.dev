import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MouseShadow } from '@/components/layout/mouse-shadow'
import { i18n } from '@/i18n-config'
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
  description:
    "I'm Frainer Encarnación, a Full Stack Developer in Dominican Republic who builds accessible products and digital experiences for the web.",
  openGraph: {
    title: 'Frainer Encarnación',
    description:
      'Full Stack Developer in Dominican Republic who builds accessible products and digital experiences for the web.',
    url: 'https://fraineralex.com',
    siteName: 'fraineralex.com',
    images: [
      {
        url: `${process.env.DOMAIN}/og.webp`,
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
    images: [
      {
        url: `${process.env.DOMAIN}/og.webp`,
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
  params?: { lang: string }
}

export default function RootLayout ({ children, params }: Props) {
  return (
    <html
      className={`${[
        inter.variable,
        calSans.variable,
        londrinaSolid.variable
      ].join(' ')} scroll-smooth`}
      data-lt-installed='true'
      lang={params?.lang || i18n.defaultLocale}
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
