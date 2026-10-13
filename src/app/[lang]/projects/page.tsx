import { notFound } from 'next/navigation'
import { FiArrowLeft } from 'react-icons/fi'
import { Locale, i18n } from '@/i18n-config'
import { getDictionary } from '@/get-dictionary'
import AllProjectsContent from '@/components/project/all-projects-content'
import { JsonLdScript } from '@/components/layout/json-ld'
import Link from 'next/link'
import { projectsJsonLd, projectsMetadata } from '@/lib/case-study-seo'

export const dynamicParams = false

export async function generateMetadata ({ params }: Props) {
  const { lang } = await params
  if (!i18n.locales.some(locale => locale === lang)) notFound()
  return projectsMetadata(lang === 'es' ? 'es' : 'en')
}

const caseStudyOrder = ['viollet', 'tracky', 'sargotech', 'chatify', 'chess-ai']

function orderProjects<T extends { caseStudyUrl?: string | null }> (projects: T[]): T[] {
  const rank = (p: T) => {
    const i = caseStudyOrder.findIndex(slug => p.caseStudyUrl?.endsWith(`/projects/${slug}`))
    return i === -1 ? caseStudyOrder.length : i
  }
  return projects.map((p, i) => ({ p, i })).sort((a, b) => rank(a.p) - rank(b.p) || a.i - b.i).map(x => x.p)
}

interface Props {
  params: Promise<{ lang?: Locale }>
}

export default async function Projects ({ params }: Props) {
  const { lang: paramLang } = await params
  if (!i18n.locales.some(locale => locale === paramLang)) notFound()
  const lang = paramLang || i18n.defaultLocale
  const { allProjects } = await getDictionary(lang)

  return (
    <main className='mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0'>
      <JsonLdScript data={projectsJsonLd(lang)} />
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
          projects={orderProjects(allProjects.projects)}
          tableHeaders={allProjects.tableHeaders}
        />
      </section>
    </main>
  )
}
