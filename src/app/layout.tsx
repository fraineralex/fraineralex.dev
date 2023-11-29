import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Frainer Encarnacion',
  description:
    'Frainer Encarnacion is a software engineer who builds accessible, inclusive products and digital experiences for the web.'
}

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className='scroll-smooth' data-lt-installed='true'>
      <body
        className={`${inter.className} leading-relaxed text-slate-400 antialiased selection:bg-teal-300 selection:text-teal-900 mx-auto min-h-screen max-w-screen-xl py-12 font-sans md:py-20 lg:py-0`}
      >
        {children}
      </body>
    </html>
  )
}
