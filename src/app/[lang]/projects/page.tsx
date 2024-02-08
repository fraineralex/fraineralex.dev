import { FiArrowLeft } from 'react-icons/fi'
import { Locale, i18n } from '@/i18n-config'
import { getDictionary } from '@/get-dictionary'
import AllProjectsContent from '@/components/project/all-projects-content'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'A list of projects that I have worked on, including personal projects, open source projects, and client work.',
  openGraph: {
    title: 'Projects',
    description:
      'A list of projects that I have worked on, including personal projects, open source projects, and client work.',
    url: `${process.env.DOMAIN}/projects`,
    siteName: `${process.env.DOMAIN?.replace('https://', '')}`,
    images: [
      {
        url: `${process.env.DOMAIN}/images/projects/og-projects.webp`,
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
    title: 'Projects',
    card: 'summary_large_image',
    creator: '@fraineralex',
    site: '@fraineralex',
    images: [
      {
        url: `${process.env.DOMAIN}/images/projects/og-projects.webp`,
        width: 1920,
        height: 1080
      }
    ],
    description:
      'A list of projects that I have worked on, including personal projects, open source projects, and client work.'
  },
  icons: {
    shortcut: '/favicon.ico'
  },
  alternates: {
    types: {
      en: new URL(`${process.env.DOMAIN}/projects`),
      es: new URL(`${process.env.DOMAIN}/es/projects`)
    }
  }
}

interface Props {
  params: { lang?: Locale }
}

export default async function Projects ({ params }: Props) {
  const lang = params?.lang || i18n.defaultLocale
  const { allProjects } = await getDictionary(lang)

  return (
    <main className='mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0'>
      <section className='lg:py-24'>
        <header className='lg:pb-3'>
          <Link
            className='group mb-2 inline-flex items-center font-semibold leading-tight text-teal-200'
            href={allProjects.goBackUrl}
          >
            <FiArrowLeft className='mr-1 h-4 w-4 transition-transform group-hover:-translate-x-2' />
            {allProjects.fullname}
          </Link>
          <h1 className='text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl'>
            {allProjects.title}
          </h1>
        </header>
        <AllProjectsContent
          projects={allProjects.projects}
          tableHeaders={allProjects.tableHeaders}
        />
      </section>
    </main>
  )
}
