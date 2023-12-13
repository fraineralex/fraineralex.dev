import type { Metadata } from 'next'
import { Inter } from "next/font/google";
import '@/styles/globals.css'
import { MouseShadow } from '@/components/layout/mouse-shadow'
import { i18n } from '../i18n-config'
import SwitchLanguage from '@/components/layout/switch-language'

export async function generateStaticParams () {
  return i18n.locales.map(locale => ({ lang: locale }))
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'Frainer Encarnación',
    template: '%s | Frainer Encarnación'
  },
  description:
    'Full Stack Developer who builds accessible products and digital experiences for the web.',
  openGraph: {
    title: 'Frainer Encarnación',
    description:
      'Full Stack Developer who builds accessible products and digital experiences for the web.',
    url: 'https://fraineralex.com',
    siteName: 'fraineralex.com',
    images: [
      {
        url: 'https://fraineralex.com/og.jpg',
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
    card: 'summary_large_image'
  },
  icons: {
    shortcut: '/favicon.png'
  }
}

interface Props {
  children: React.ReactNode
}

export default function RootLayout ({ children }: Props) {
  return (
    <html
      className={`${inter.variable} scroll-smooth`}
      data-lt-installed='true'
      lang='en'
    >
      <body
        className={`leading-relaxed text-slate-400 antialiased selection:bg-teal-300 selection:text-teal-900 mx-auto min-h-screen max-w-screen-xl py-12 font-sans md:py-20 lg:py-0`}
      >
        <MouseShadow />
        <SwitchLanguage />
        {children}
      </body>
    </html>
  )
}
