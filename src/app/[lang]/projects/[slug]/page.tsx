import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import TrackyCaseStudy from '@/components/case-study/pages/tracky'
import ChatifyCaseStudy from '@/components/case-study/pages/chatify'
import SargoTechCaseStudy from '@/components/case-study/pages/sargotech'
import ChessCaseStudy from '@/components/case-study/pages/chess'
import { getCaseStudy, CASE_STUDY_SLUGS, CASE_STUDY_IMAGES } from '@/dictionaries/case-studies'
import { Locale, i18n } from '@/i18n-config'
import { SITE_URL } from '@/lib/site-metadata'

interface Props {
  params: Promise<{ lang?: Locale; slug: string }>
}

export const dynamicParams = false

export function generateStaticParams () {
  return i18n.locales.flatMap((lang) => CASE_STUDY_SLUGS.map((slug) => ({ lang, slug })))
}

function path (lang: Locale, slug: string) {
  return lang === i18n.defaultLocale ? `/projects/${slug}` : `/${lang}/projects/${slug}`
}

function resolve (lang: Locale | undefined, slug: string) {
  if (!i18n.locales.some((l) => l === lang)) notFound()
  const locale = lang || i18n.defaultLocale
  const content = getCaseStudy(locale, slug)
  if (!content) notFound()
  return { locale, content }
}

export async function generateMetadata ({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  const { locale, content } = resolve(lang, slug)
  const image = { url: `${SITE_URL}/images/projects/${CASE_STUDY_IMAGES[slug].src}`, width: CASE_STUDY_IMAGES[slug].width, height: CASE_STUDY_IMAGES[slug].height }
  const title = `${content.meta.title} | Frainer Encarnación`
  return {
    title: content.meta.title,
    description: content.meta.description,
    keywords: content.hero.technologies,
    openGraph: {
      title,
      description: content.meta.description,
      url: `${SITE_URL}${path(locale, slug)}`,
      siteName: 'fraineralex.dev',
      images: [image],
      locale: locale === 'es' ? 'es-DO' : 'en-US',
      type: 'article'
    },
    twitter: {
      title,
      card: 'summary_large_image',
      creator: '@fraineralex',
      site: '@fraineralex',
      description: content.meta.description,
      images: [image]
    },
    alternates: {
      canonical: path(locale, slug),
      languages: { 'en-US': `/projects/${slug}`, 'es-DO': `/es/projects/${slug}` }
    }
  }
}

export default async function CaseStudyPage ({ params }: Props) {
  const { lang, slug } = await params
  const { locale } = resolve(lang, slug)
  const l = locale === 'es' ? 'es' : 'en'
  if (slug === 'tracky') return <TrackyCaseStudy lang={l} />
  if (slug === 'chatify') return <ChatifyCaseStudy lang={l} />
  if (slug === 'sargotech') return <SargoTechCaseStudy lang={l} />
  return <ChessCaseStudy lang={l} />
}
