import { Metadata } from 'next'
import Footer from '@/components/blog/footer/footer'
import React from 'react'

import '@/styles/blog/main.css'

export const metadata: Metadata = {
  title: {
    absolute: "Frainer's Blog 📝",
    template: "%s | Frainer's Blog"
  },
  description:
    "I'm Frainer Encarnación, a Full Stack Developer in Dominican Republic. I write about tech, projects and whatever else I'm thinking about! Here you will find articles about web development, software engineering, and many more geeky things in the world of programming.",
  openGraph: {
    title: "Frainer's Blog 📝",
    description:
      "I'm Frainer Encarnación, a Full Stack Developer in Dominican Republic. I write about tech, projects and whatever else I'm thinking about!",
    url: 'https://frainer-blog.vercel.app',
    siteName: 'fraineralex.com',
    images: [
      {
        url: 'https://frainer-blog.vercel.app/og.png',
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
    title: "Frainer's Blog 📝",
    card: 'summary_large_image',
    creator: '@fraineralex',
    site: '@fraineralex',
    description:
      "I'm Frainer Encarnación, a Full Stack Developer in Dominican Republic. I write about tech, projects and whatever else I'm thinking about!"
  },
  icons: {
    shortcut: '/favicon.ico'
  },
  alternates: {
    types: {
      // See the RSS Feed section for more details
      'application/rss+xml': '/feed.xml'
    }
  }
}

export default function Layout ({ children }: { children: React.ReactNode }) {
  return (
    <main className='blog relative'>
      {children}
      <Footer />
    </main>
  )
}
