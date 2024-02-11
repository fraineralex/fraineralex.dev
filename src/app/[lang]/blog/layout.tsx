import { Metadata } from 'next'
import dynamic from 'next/dynamic'
const Footer = dynamic(() => import('@/components/blog/footer'))
import React from 'react'

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
      "I'm Frainer Encarnación, a Full Stack Developer based in Dominican Republic. I write about tech, projects and whatever else I'm thinking about!"
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
      'Soy Frainer Encarnación, un Desarrollador Full Stack basado en la República Dominicana. ¡Escribo sobre tecnología, proyectos y cualquier otra cosa en la que esté pensando!'
  }
}

export async function generateMetadata ({ params }: Props): Promise<Metadata> {
  return params?.lang === 'es' ? spanishMetadata : englishmetadata
}

interface Props {
  children: React.ReactNode
  params?: { lang: string }
}

export default function Layout ({ children, params }: Props) {
  return (
    <main className='blog relative'>
      {children}
      <Footer />
    </main>
  )
}
