import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SideNav from '@/app/ui/components/sidenav'

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
        className={`${inter.className} leading-relaxed text-slate-400 antialiased selection:bg-teal-300 selection:text-teal-900 mx-auto min-h-screen max-w-screen-xl px-2 py-12 md:px-4 md:py-6 lg:px-8 lg:py-0`}
      >
        <div className='lg:flex lg:justify-between lg:gap-4 lg:px-16'>
          <SideNav />
          <main id='content' className='pt-24 lg:w-1/2 lg:py-24 lg:px-8'>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
