import type { Metadata } from 'next'
import type { Locale } from '@/i18n-config'
import { localizedUrl, SITE_URL } from '@/lib/site-metadata'

/** Fixed lastmod for the projects index and the five case studies. */
export const CASE_STUDY_LAST_MODIFIED = '2026-10-13'

export const CASE_STUDY_SITEMAP_PATHS = [
  '/projects',
  '/projects/viollet',
  '/projects/tracky',
  '/projects/sargotech',
  '/projects/chatify',
  '/projects/chess-ai'
] as const

const PERSON = {
  '@type': 'Person',
  name: 'Frainer Encarnación',
  url: SITE_URL,
  sameAs: [
    'https://github.com/fraineralex',
    'https://www.linkedin.com/in/fraineralex/'
  ]
}

type ImageMeta = { src: string; width: number; height: number; alt: string }

type StudySeo = {
  slug: string
  name: string
  title: string
  description: string
  image: ImageMeta
  /** Live product URL. Present for SoftwareApplication, absent for CreativeWork. */
  applicationUrl?: string
}

const EN_STUDIES: StudySeo[] = [
  {
    slug: 'viollet',
    name: 'Viollet',
    title: 'Viollet Case Study: AI Expense Tracking from Email',
    description: 'How I built Viollet, an AI personal finance app that turns bank email notifications into categorized spending without bank credentials or manual entry.',
    applicationUrl: 'https://viollet.app',
    image: {
      src: '/images/projects/viollet-og.webp',
      width: 1600,
      height: 900,
      alt: 'Viollet dashboard showing automated expense tracking from bank email notifications'
    }
  },
  {
    slug: 'tracky',
    name: 'Tracky',
    title: 'Tracky Case Study: Logging Meals and Workouts by Chat',
    description: 'How I built Tracky, a minimalist fitness tracker. An AI chat turns a sentence into meal and workout entries. Open source at tracky.fit, with 100+ active users.',
    applicationUrl: 'https://tracky.fit',
    image: {
      src: '/images/projects/tracky.webp',
      width: 1200,
      height: 675,
      alt: 'Tracky landing page with the headline Smart, simple Fitness Tracking, a meal, and a nutrition summary'
    }
  },
  {
    slug: 'sargotech',
    name: 'SargoTech',
    title: 'SargoTech Case Study: Coastal Sargassum Traffic Light',
    description: 'SargoTech is coastal technology from the Dominican Republic for Caribbean sargassum. A team of 4. I am the CTO and lead developer of the beach traffic light.',
    applicationUrl: 'https://sargotech.com',
    image: {
      src: '/images/projects/sargotech-og.webp',
      width: 1200,
      height: 630,
      alt: 'SargoTech logo, Costas Inteligentes, with a wave and sargassum forming an S'
    }
  },
  {
    slug: 'chatify',
    name: 'Chatify',
    title: 'Chatify Case Study: Realtime Chat, Media, Receipts',
    description: 'How I built Chatify, a realtime chat with Socket.io, Auth0, and Turso. It sends text, files, images, reactions, and read receipts, with 200+ sign ups.',
    applicationUrl: 'https://chatify.fraineralex.dev',
    image: {
      src: '/images/projects/chatify.webp',
      width: 2400,
      height: 1350,
      alt: 'Chatify landing page showing a chat with a contact list, a PDF file, and a shared image'
    }
  },
  {
    slug: 'chess-ai',
    name: 'Chess AI',
    title: 'Chess AI Case Study: Minimax and Alpha-Beta Search',
    description: 'How I built a Python chess engine that searches with minimax and alpha-beta pruning, scores positions with piece square tables, and plays under a time limit.',
    image: {
      src: '/images/projects/chess.webp',
      width: 1200,
      height: 900,
      alt: 'Chess AI board on a green and cream theme, with a knight on a highlighted square'
    }
  }
]

const ES_STUDIES: StudySeo[] = [
  {
    slug: 'viollet',
    name: 'Viollet',
    title: 'Viollet: gastos categorizados desde correos del banco',
    description: 'Cómo construí Viollet, una app de finanzas con IA que convierte avisos bancarios por correo en gastos categorizados, sin pedir credenciales del banco.',
    applicationUrl: 'https://viollet.app',
    image: {
      src: '/images/projects/viollet-og.webp',
      width: 1600,
      height: 900,
      alt: 'Panel de Viollet con el seguimiento de gastos a partir de avisos bancarios por correo'
    }
  },
  {
    slug: 'tracky',
    name: 'Tracky',
    title: 'Tracky: tracker fitness con registro por chat de IA',
    description: 'Cómo construí Tracky: tracker fitness minimalista donde un chat de IA convierte una frase en comidas y entrenamientos. En tracky.fit, con más de 100 usuarios.',
    applicationUrl: 'https://tracky.fit',
    image: {
      src: '/images/projects/tracky.webp',
      width: 1200,
      height: 675,
      alt: 'Página de Tracky con el titular de seguimiento fitness, una comida y un resumen de nutrición'
    }
  },
  {
    slug: 'sargotech',
    name: 'SargoTech',
    title: 'SargoTech: semáforo costero contra el sargazo caribeño',
    description: 'SargoTech es tecnología costera desde República Dominicana para el sargazo del Caribe. Equipo de 4. Soy el CTO y desarrollador principal del semáforo por playa.',
    applicationUrl: 'https://sargotech.com',
    image: {
      src: '/images/projects/sargotech-og.webp',
      width: 1200,
      height: 630,
      alt: 'Logo de SargoTech, Costas Inteligentes, con una ola y sargazo formando una S'
    }
  },
  {
    slug: 'chatify',
    name: 'Chatify',
    title: 'Chatify: chat en tiempo real con archivos y lecturas',
    description: 'Cómo construí Chatify, un chat en tiempo real con Socket.io, Auth0 y Turso, con texto, archivos, imágenes, reacciones y lecturas, y más de 200 registros.',
    applicationUrl: 'https://chatify.fraineralex.dev',
    image: {
      src: '/images/projects/chatify.webp',
      width: 2400,
      height: 1350,
      alt: 'Página de Chatify con un chat, la lista de contactos, un archivo PDF y una imagen compartida'
    }
  },
  {
    slug: 'chess-ai',
    name: 'Chess AI',
    title: 'Chess AI: motor de ajedrez con minimax y alfa-beta',
    description: 'Cómo construí un motor de ajedrez en Python que busca con minimax y poda alfa-beta, evalúa posiciones con tablas por casilla y juega con un límite de tiempo.',
    image: {
      src: '/images/projects/chess.webp',
      width: 1200,
      height: 900,
      alt: 'Tablero de Chess AI en verde y crema, con un caballo sobre una casilla resaltada'
    }
  }
]

const PROJECTS_SEO = {
  en: {
    title: 'Software Case Studies and Projects | Frainer Encarnación',
    description: 'Case studies and other software work by Frainer Encarnación: Viollet, Tracky, SargoTech, Chatify, and Chess AI, plus open source projects and client work.',
    image: {
      src: '/images/projects/og-projects.webp',
      width: 1920,
      height: 1080,
      alt: 'All Projects page listing software work with year, description, and technologies'
    },
    home: 'Home',
    projects: 'Projects',
    keywords: ['Side Projects', 'Open Source Projects', 'Client Work', 'Web Development Projects', 'Software Engineering Projects']
  },
  es: {
    title: 'Casos de estudio y proyectos | Frainer Encarnación',
    description: 'Casos de estudio y otros trabajos de Frainer Encarnación: Viollet, Tracky, SargoTech, Chatify y Chess AI, más código abierto y trabajo para clientes.',
    image: {
      src: '/images/projects/es-og-projects.webp',
      width: 1920,
      height: 1080,
      alt: 'Página de proyectos con el listado de trabajos, el año, la descripción y las tecnologías'
    },
    home: 'Inicio',
    projects: 'Proyectos',
    keywords: ['Proyectos Personales', 'Proyectos de Código Abierto', 'Trabajo para Clientes', 'Proyectos de Desarrollo Web', 'Proyectos de Ingeniería de Software']
  }
} as const

function studiesFor (lang: Locale) {
  return lang === 'es' ? ES_STUDIES : EN_STUDIES
}

export function getStudySeo (lang: Locale, slug: string) {
  return studiesFor(lang).find(study => study.slug === slug)
}

function languageAlternates (path: string) {
  return {
    'en-US': localizedUrl('en', path),
    'es-DO': localizedUrl('es', path),
    'x-default': localizedUrl('en', path)
  }
}

function ogImage (image: ImageMeta) {
  return {
    url: `${SITE_URL}${image.src}`,
    width: image.width,
    height: image.height,
    alt: image.alt
  }
}

function inLanguage (lang: Locale) {
  return lang === 'es' ? 'es-DO' : 'en-US'
}

function breadcrumbList (lang: Locale, crumbs: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: localizedUrl(lang, crumb.path)
    }))
  }
}

export function caseStudyMetadata (lang: Locale, slug: string): Metadata {
  const study = getStudySeo(lang, slug)
  if (!study) return {}
  const path = `/projects/${slug}`
  const canonical = localizedUrl(lang, path)
  const image = ogImage(study.image)
  return {
    title: { absolute: study.title },
    description: study.description,
    alternates: {
      canonical,
      languages: languageAlternates(path)
    },
    openGraph: {
      title: study.title,
      description: study.description,
      url: canonical,
      siteName: 'fraineralex.dev',
      images: [image],
      locale: lang === 'es' ? 'es_DO' : 'en_US',
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: study.title,
      description: study.description,
      creator: '@fraineralex',
      site: '@fraineralex',
      images: [image]
    }
  }
}

export function projectsMetadata (lang: Locale): Metadata {
  const copy = PROJECTS_SEO[lang === 'es' ? 'es' : 'en']
  const canonical = localizedUrl(lang, '/projects')
  const image = ogImage(copy.image)
  return {
    title: { absolute: copy.title },
    description: copy.description,
    keywords: [...copy.keywords],
    alternates: {
      canonical,
      languages: languageAlternates('/projects')
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: canonical,
      siteName: 'fraineralex.dev',
      images: [image],
      locale: lang === 'es' ? 'es_DO' : 'en_US',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      creator: '@fraineralex',
      site: '@fraineralex',
      images: [image]
    }
  }
}

export function caseStudyJsonLd (lang: Locale, slug: string) {
  const study = getStudySeo(lang, slug)
  if (!study) return null
  const locale = lang === 'es' ? 'es' : 'en'
  const labels = PROJECTS_SEO[locale]
  const pageUrl = localizedUrl(lang, `/projects/${slug}`)
  const work = study.applicationUrl
    ? {
        '@type': 'SoftwareApplication',
        name: study.name,
        description: study.description,
        url: study.applicationUrl,
        mainEntityOfPage: pageUrl,
        inLanguage: inLanguage(lang),
        image: `${SITE_URL}${study.image.src}`,
        author: PERSON,
        creator: PERSON
      }
    : {
        '@type': 'CreativeWork',
        name: study.name,
        description: study.description,
        url: pageUrl,
        inLanguage: inLanguage(lang),
        image: `${SITE_URL}${study.image.src}`,
        author: PERSON,
        creator: PERSON
      }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      work,
      breadcrumbList(lang, [
        { name: labels.home, path: '' },
        { name: labels.projects, path: '/projects' },
        { name: study.name, path: `/projects/${slug}` }
      ])
    ]
  }
}

export function projectsJsonLd (lang: Locale) {
  const locale = lang === 'es' ? 'es' : 'en'
  const copy = PROJECTS_SEO[locale]
  const studies = studiesFor(lang)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: copy.title,
        description: copy.description,
        url: localizedUrl(lang, '/projects'),
        inLanguage: inLanguage(lang),
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: studies.map((study, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: study.name,
            url: localizedUrl(lang, `/projects/${study.slug}`)
          }))
        }
      },
      breadcrumbList(lang, [
        { name: copy.home, path: '' },
        { name: copy.projects, path: '/projects' }
      ])
    ]
  }
}
