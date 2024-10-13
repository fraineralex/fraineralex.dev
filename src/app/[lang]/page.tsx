import { Locale, i18n } from '@/i18n-config'
import { getDictionary } from '@/get-dictionary'
import Observer from '@/components/common/intersection-observer'
import { Metadata } from 'next'

interface Props {
  params?: { lang: Locale }
}

const englishMetadata: Metadata = {
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
  metadataBase: new URL(process.env.DOMAIN ?? 'https://fraineralex.dev'),
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
        url: '/og.jpg',
        width: 2880,
        height: 1620
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
        url: '/og.jpg',
        width: 2880,
        height: 1620
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
      'es-DO': '/',
      'en-US': `${process.env.DOMAIN}` || 'https://fraineralex.dev'
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
        url: `${process.env.DOMAIN}/es-og.webp`,
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
        url: `${process.env.DOMAIN}/es-og.webp`,
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

export default async function Home ({ params }: Props) {
  const lang = params?.lang || i18n.defaultLocale
  const dictionary = await getDictionary(lang)

  return (
    <>
      <Observer dictionary={dictionary} lang={lang} />
    </>
  )
}
