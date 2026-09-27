import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import CaseStudyPageContent from '@/components/case-study/case-study-content'
import { getDictionary } from '@/get-dictionary'
import { Locale, i18n } from '@/i18n-config'
import { SITE_URL } from '@/lib/site-metadata'

interface Props {
  params: Promise<{ lang?: Locale }>
}

function caseStudyPath (lang: Locale) {
  return lang === i18n.defaultLocale ? '/projects/viollet' : `/${lang}/projects/viollet`
}

export const dynamicParams = false

export async function generateMetadata ({ params }: Props): Promise<Metadata> {
  const { lang: paramLang } = await params
  if (!i18n.locales.some(locale => locale === paramLang)) notFound()
  const lang = paramLang || i18n.defaultLocale
  const { caseStudies } = await getDictionary(lang)
  const content = caseStudies.viollet
  const path = caseStudyPath(lang)

  return {
    title: content.meta.title,
    description: content.meta.description,
    keywords: content.hero.technologies,
    openGraph: {
      title: `${content.meta.title} | Frainer Encarnación`,
      description: content.meta.description,
      url: `${SITE_URL}${path}`,
      siteName: 'fraineralex.dev',
      images: [
        {
          url: `${SITE_URL}/images/projects/viollet.avif`,
          width: 1200,
          height: 675
        }
      ],
      locale: lang === 'es' ? 'es-DO' : 'en-US',
      type: 'article'
    },
    twitter: {
      title: `${content.meta.title} | Frainer Encarnación`,
      card: 'summary_large_image',
      creator: '@fraineralex',
      site: '@fraineralex',
      description: content.meta.description,
      images: [
        {
          url: `${SITE_URL}/images/projects/viollet.avif`,
          width: 1200,
          height: 675
        }
      ]
    },
    alternates: {
      canonical: path,
      languages: {
        'en-US': '/projects/viollet',
        'es-DO': '/es/projects/viollet'
      }
    }
  }
}

export default async function ViolletCaseStudyPage ({ params }: Props) {
  const { lang: paramLang } = await params
  if (!i18n.locales.some(locale => locale === paramLang)) notFound()
  const lang = paramLang || i18n.defaultLocale
  const { caseStudies } = await getDictionary(lang)

  return <CaseStudyPageContent content={caseStudies.viollet} />
}
