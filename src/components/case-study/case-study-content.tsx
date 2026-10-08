import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi'
import type { Locale } from '@/i18n-config'
import type { CaseStudyContent } from '@/types/case-study-types'

function InteractiveFallback () {
  return (
    <div
      className='mt-6 h-36 animate-pulse rounded-xl border border-slate-700/60 bg-slate-900/50 motion-reduce:animate-none'
      aria-hidden='true'
    />
  )
}

function HeroFallback () {
  return (
    <div
      className='h-36 animate-pulse rounded-xl border border-slate-700/60 bg-slate-900/50 motion-reduce:animate-none'
      aria-hidden='true'
    />
  )
}

const AppReplica = dynamic(() => import('./viollet/app-embed'), {
  loading: HeroFallback
})
const InboxExplorer = dynamic(() => import('./viollet/inbox-explorer'), {
  loading: InteractiveFallback
})
const AccessGate = dynamic(() => import('./viollet/access-gate'), {
  loading: InteractiveFallback
})
const OwnershipMap = dynamic(() => import('./viollet/ownership-map'), {
  loading: InteractiveFallback
})
const ArchitectureDiagram = dynamic(() => import('./viollet/architecture-diagram'), {
  loading: InteractiveFallback
})
const ParsePipeline = dynamic(() => import('./viollet/parse-pipeline'), {
  loading: InteractiveFallback
})
const BankCoverage = dynamic(() => import('./viollet/bank-coverage'), {
  loading: InteractiveFallback
})
const ChatSim = dynamic(() => import('./viollet/chat-sim'), {
  loading: InteractiveFallback
})
const GmailSync = dynamic(() => import('./viollet/gmail-sync'), {
  loading: InteractiveFallback
})

interface Props {
  content: CaseStudyContent
  lang: Locale
}

function SectionBlock ({
  section,
  children
}: {
  section: { title: string; paragraphs: string[]; bullets?: string[] }
  children?: ReactNode
}) {
  return (
    <section className='mb-14 scroll-mt-24'>
      <h2 className='mb-4 text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl'>
        {section.title}
      </h2>
      <div className='space-y-4 text-sm leading-relaxed text-slate-300/90 min-[400px]:text-base'>
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph} style={{ textWrap: 'pretty' }}>
            {paragraph}
          </p>
        ))}
        {section.bullets && section.bullets.length > 0 && (
          <ul className='list-disc space-y-2 pl-5 marker:text-teal-300/80'>
            {section.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>
      {children}
    </section>
  )
}

export default function CaseStudyPageContent ({ content, lang }: Props) {
  const { meta, backLink, hero, sections, interactives } = content

  return (
    <main className='mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0'>
      <article className='lg:py-24'>
        <header className='mb-10 lg:mb-14'>
          <Link
            className='group mb-4 inline-flex items-center font-semibold leading-tight text-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300'
            href={backLink.url}
          >
            <FiArrowLeft className='mr-1 h-4 w-4 transition-transform group-hover:-translate-x-2 motion-reduce:transition-none' />
            {backLink.label}
          </Link>
          <h1 className='text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl'>
            {meta.title}
          </h1>
          <p
            className='mt-5 max-w-3xl text-base leading-relaxed text-slate-300/90 sm:text-lg'
            style={{ textWrap: 'pretty' }}
          >
            {hero.summary}
          </p>
          <dl className='mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400'>
            <div>
              <dt className='sr-only'>Role</dt>
              <dd>{meta.role}</dd>
            </div>
            <div>
              <dt className='sr-only'>Year</dt>
              <dd>{meta.year}</dd>
            </div>
            <div>
              <dt className='sr-only'>Read time</dt>
              <dd>{meta.readTime}</dd>
            </div>
          </dl>
          <ul
            className='mt-6 flex flex-wrap gap-2'
            aria-label='Technologies used'
          >
            {hero.technologies.map((technology) => (
              <li key={technology}>
                <span className='flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-200'>
                  {technology}
                </span>
              </li>
            ))}
          </ul>
        </header>

        <section
          className='mb-14'
          aria-labelledby='viollet-product-walkthrough'
        >
          <div className='mb-4'>
            <h2
              id='viollet-product-walkthrough'
              className='text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl'
            >
              {sections.proof.appLabel}
            </h2>
            <p className='mt-2 max-w-3xl text-sm leading-relaxed text-slate-400 min-[400px]:text-base'>
              {sections.proof.appDescription}
            </p>
          </div>
          <AppReplica copy={interactives.app} lang={lang} />
        </section>

        <SectionBlock section={sections.context}>
          <InboxExplorer copy={interactives.inbox} />
        </SectionBlock>
        <SectionBlock section={sections.constraints}>
          <AccessGate copy={interactives.access} />
        </SectionBlock>
        <SectionBlock section={sections.responsibility}>
          <OwnershipMap copy={interactives.ownership} />
        </SectionBlock>

        <SectionBlock section={sections.architecture}>
          <ArchitectureDiagram copy={interactives.architecture} />
          <p className='mt-3 text-center text-sm text-slate-500'>
            {sections.architecture.diagramCaption}
          </p>
        </SectionBlock>

        <section className='mb-14 scroll-mt-24'>
          <h2 className='mb-4 text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl'>
            {sections.tradeOffs.title}
          </h2>
          <ul className='space-y-5'>
            {sections.tradeOffs.items.map((item) => (
              <li
                key={item.decision}
                className='rounded-lg border border-slate-700/50 bg-slate-800/30 p-5'
              >
                <h3 className='font-medium text-teal-200'>{item.decision}</h3>
                <p
                  className='mt-2 text-sm leading-relaxed text-slate-300/90 min-[400px]:text-base'
                  style={{ textWrap: 'pretty' }}
                >
                  {item.rationale}
                </p>
              </li>
            ))}
          </ul>
          <ParsePipeline copy={interactives.parse} controls={interactives.controls} lang={lang} />
        </section>

        <SectionBlock section={sections.impact}>
          <BankCoverage copy={interactives.banks} />
        </SectionBlock>
        <SectionBlock section={sections.assistant}>
          <ChatSim copy={interactives.chat} />
        </SectionBlock>
        <SectionBlock section={sections.operationalQuality}>
          <GmailSync copy={interactives.sync} />
        </SectionBlock>

        <section className='rounded-xl border border-teal-400/20 bg-teal-400/5 p-6 sm:p-8'>
          <h2 className='mb-3 text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl'>
            {sections.proof.demoLabel}
          </h2>
          <p
            className='mb-6 text-sm leading-relaxed text-slate-300/90 min-[400px]:text-base'
            style={{ textWrap: 'pretty' }}
          >
            {sections.proof.note}
          </p>
          <Link
            href={sections.proof.demoUrl}
            target='_blank'
            rel='noreferrer noopener'
            className='inline-flex items-center rounded-md bg-teal-400/10 px-4 py-2.5 text-sm font-semibold text-teal-200 transition hover:bg-teal-400/20 hover:text-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300'
          >
            viollet.app
            <FiExternalLink className='ml-2 h-4 w-4' />
          </Link>
          {sections.proof.relatedLinks?.length ? (
            <ul className='mt-5 space-y-2 text-sm text-slate-300/90 min-[400px]:text-base'>
              {sections.proof.relatedLinks.map((item) => (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    target='_blank'
                    rel='noreferrer noopener'
                    className='inline-flex items-center font-medium text-teal-200/90 underline decoration-teal-400/40 underline-offset-4 transition hover:text-teal-100 hover:decoration-teal-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300'
                  >
                    {item.label}
                    <FiExternalLink className='ml-1.5 h-3.5 w-3.5 shrink-0' />
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </article>
    </main>
  )
}
