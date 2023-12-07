import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { MouseShadow } from '@/components/layout/mouse-shadow'
import { i18n } from '../i18n-config'

export async function generateStaticParams () {
  return i18n.locales.map(locale => ({ lang: locale }))
}

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Frainer Encarnación',
  description:
    'Frainer Encarnación is a full stack developer who builds accessible, inclusive products and digital experiences for the web.'
}

interface Props {
  children: React.ReactNode
}

export default function RootLayout ({ children }: Props) {
  return (
    <html className='scroll-smooth' data-lt-installed='true'>
      <body
        className={`${inter.className} leading-relaxed text-slate-400 antialiased selection:bg-teal-300 selection:text-teal-900 mx-auto min-h-screen max-w-screen-xl py-12 font-sans md:py-20 lg:py-0`}
      >
        <MouseShadow />
        {children}
      </body>
    </html>
  )
}
