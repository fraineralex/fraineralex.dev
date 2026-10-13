import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import CaseStudyPageContent from '@/components/case-study/case-study-content'
import { JsonLdScript } from '@/components/layout/json-ld'
import { getDictionary } from '@/get-dictionary'
import { Locale, i18n } from '@/i18n-config'
import { caseStudyJsonLd, caseStudyMetadata } from '@/lib/case-study-seo'

interface Props {
  params: Promise<{ lang?: Locale }>
}

export const dynamicParams = false

export async function generateMetadata ({ params }: Props): Promise<Metadata> {
  const { lang: paramLang } = await params
  if (!i18n.locales.some(locale => locale === paramLang)) notFound()
  const lang = paramLang || i18n.defaultLocale
  const { caseStudies } = await getDictionary(lang)

  return {
    ...caseStudyMetadata(lang, 'viollet'),
    keywords: caseStudies.viollet.hero.technologies
  }
}

export default async function ViolletCaseStudyPage ({ params }: Props) {
  const { lang: paramLang } = await params
  if (!i18n.locales.some(locale => locale === paramLang)) notFound()
  const lang = paramLang || i18n.defaultLocale
  const { caseStudies } = await getDictionary(lang)

  const jsonLd = caseStudyJsonLd(lang, 'viollet')

  return (
    <>
      {jsonLd ? <JsonLdScript data={jsonLd} /> : null}
      <CaseStudyPageContent content={caseStudies.viollet} lang={lang} />
    </>
  )
}
