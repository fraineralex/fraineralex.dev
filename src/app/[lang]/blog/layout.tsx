import { i18n } from '@/i18n-config'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
const Footer = dynamic(() => import('@/components/blog/footer'))
import React from 'react'
import {
  EN_SITE_OG_DESCRIPTION,
  ES_SITE_OG_DESCRIPTION
} from '@/lib/site-metadata'

import '@/styles/blog/main.css'

const englishmetadata: Metadata = {
  title: {
    absolute: "Frainer's Blog 📝",
    template: "%s | Frainer's Blog"
  },
  description:
    "I write about tech, projects and whatever else I'm thinking about! Here you will find articles about web development, software engineering, and many more geeky things in the world of programming.",
  keywords: [
    'Programming Blog',
    'Web Development Blog',
    'Personal Blog',
    'Programming Tutorials',
    'JavaScript',
    'Python',
    'React',
    'Next.js',
    'Node.js'
  ],
  category: 'Programming Blog',
  openGraph: {
    title: "Frainer's Blog 📝",
    description:
      "I write about tech, projects and whatever else I'm thinking about!",
    url: `${process.env.DOMAIN}/blog`,
    siteName: `${process.env.DOMAIN?.replace('https://', '')}`,
    images: [
      {
        url: `${process.env.DOMAIN}/images/blog/og.webp`,
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
    images: [
      {
        url: `${process.env.DOMAIN}/images/blog/og.webp`,
        width: 1920,
        height: 1080
      }
    ],
    description:
      EN_SITE_OG_DESCRIPTION +
      ' I write about tech, projects and whatever else I\'m thinking about!'
  }
}

const spanishMetadata: Metadata = {
  title: {
    absolute: "Frainer's Blog 📝",
    template: "%s | Frainer's Blog"
  },
  description:
    'Escribo sobre tecnología, proyectos y cualquier otra cosa en la que esté pensando. Aquí encontrarás artículos sobre desarrollo web, ingeniería de software y muchas cosas más relacionadas con el mundo geek de la programación.',
  keywords: [
    'Blog de Programación',
    'Blog de Desarrollo Web',
    'Blog Personal',
    'Tutoriales de Programación',
    'JavaScript',
    'Python',
    'React',
    'Next.js',
    'Node.js'
  ],
  category: 'Blog de Programación',
  openGraph: {
    title: "Frainer's Blog 📝",
    description:
      'Escribo sobre tecnología, proyectos y cualquier otra cosa en la que esté pensando.',
    url: `${process.env.DOMAIN}/es/blog`,
    siteName: `${process.env.DOMAIN?.replace('https://', '')}`,
    images: [
      {
        url: `${process.env.DOMAIN}/images/blog/es-og.webp`,
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
    title: 'Frainer\'s Blog 📝',
    card: 'summary_large_image',
    creator: '@fraineralex',
    site: '@fraineralex',
    images: [
      {
        url: `${process.env.DOMAIN}/images/blog/es-og.webp`,
        width: 1920,
        height: 1080
      }
    ],
    description:
      ES_SITE_OG_DESCRIPTION +
      ' Escribo sobre tecnología, proyectos y cualquier otra cosa en la que esté pensando.'
  }
}

export async function generateMetadata ({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!i18n.locales.some(locale => locale === lang)) notFound()
  return lang === 'es' ? spanishMetadata : englishmetadata
}

interface Props {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function Layout ({ children, params }: Props) {
  const { lang } = await params
  if (!i18n.locales.some(locale => locale === lang)) notFound()
  return (
    <main className='blog relative'>
      {children}
      <Footer />
    </main>
  )
}
