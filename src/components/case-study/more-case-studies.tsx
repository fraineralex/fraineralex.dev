import Link from 'next/link'
import type { Locale } from '@/i18n-config'

const STUDIES = [
  { slug: 'viollet', en: 'Viollet', es: 'Viollet' },
  { slug: 'tracky', en: 'Tracky', es: 'Tracky' },
  { slug: 'sargotech', en: 'SargoTech', es: 'SargoTech' },
  { slug: 'chatify', en: 'Chatify', es: 'Chatify' },
  { slug: 'chess-ai', en: 'Chess AI', es: 'Chess AI' }
] as const

export default function MoreCaseStudies ({ lang, current }: { lang: Locale; current: string }) {
  const locale = lang === 'es' ? 'es' : 'en'
  const title = locale === 'es' ? 'Más casos de estudio' : 'More case studies'
  const others = STUDIES.filter(study => study.slug !== current)

  return (
    <nav aria-label={title} className='mt-14'>
      <h2 className='text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl'>{title}</h2>
      <ul className='mt-4 flex flex-wrap gap-3'>
        {others.map(study => (
          <li key={study.slug}>
            <Link
              href={locale === 'es' ? `/es/projects/${study.slug}` : `/projects/${study.slug}`}
              className='inline-flex h-11 min-h-11 items-center rounded-md border border-slate-700/60 bg-slate-800/50 px-4 text-sm font-semibold text-slate-100 transition-colors hover:border-teal-300/40 hover:text-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 motion-reduce:transition-none'
            >
              {study[locale]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
