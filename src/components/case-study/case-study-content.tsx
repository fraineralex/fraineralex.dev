import Image from 'next/image'
import Link from 'next/link'
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi'
import type { CaseStudyContent } from '@/types/case-study-types'

interface Props {
  content: CaseStudyContent
}

function SectionBlock ({
  section,
  children
}: {
  section: { title: string; paragraphs: string[]; bullets?: string[] }
  children?: React.ReactNode
}) {
  return (
    <section className='mb-14 scroll-mt-24'>
      <h2 className='mb-4 text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl'>
        {section.title}
      </h2>
      <div className='space-y-4 text-sm leading-relaxed text-slate-300/90 min-[400px]:text-base'>
        {section.paragraphs.map((paragraph, index) => (
          <p key={index} style={{ textWrap: 'pretty' }}>
            {paragraph}
          </p>
        ))}
        {section.bullets && section.bullets.length > 0 && (
          <ul className='list-disc space-y-2 pl-5 marker:text-teal-300/80'>
            {section.bullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>
      {children}
    </section>
  )
}

export default function CaseStudyPageContent ({ content }: Props) {
  const { meta, backLink, hero, sections } = content

  return (
    <main className='mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0'>
      <article className='lg:py-24'>
        <header className='mb-10 lg:mb-14'>
          <Link
            className='group mb-4 inline-flex items-center font-semibold leading-tight text-teal-200'
            href={backLink.url}
          >
            <FiArrowLeft className='mr-1 h-4 w-4 transition-transform group-hover:-translate-x-2' />
            {backLink.label}
          </Link>
          <p className='mb-3 text-sm font-medium uppercase tracking-widest text-teal-300/80'>
            {hero.eyebrow}
          </p>
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

        <figure className='mb-14 overflow-hidden rounded-lg border border-slate-700/60 bg-slate-800/40'>
          <Image
            src='/images/projects/viollet.avif'
            alt={sections.proof.screenshotAlt}
            width={1200}
            height={675}
            className='w-full'
            priority
          />
        </figure>

        <SectionBlock section={sections.context} />
        <SectionBlock section={sections.constraints} />
        <SectionBlock section={sections.responsibility} />

        <SectionBlock section={sections.architecture}>
          <figure className='mt-6 overflow-x-auto rounded-lg border border-slate-700/60 bg-slate-950/60 p-4 sm:p-6'>
            <svg
              viewBox='0 0 920 220'
              role='img'
              aria-label={sections.architecture.diagramCaption}
              className='mx-auto min-w-[640px] w-full max-w-4xl text-slate-300'
            >
              <defs>
                <marker
                  id='arrow'
                  markerWidth='8'
                  markerHeight='8'
                  refX='6'
                  refY='3'
                  orient='auto'
                >
                  <path d='M0,0 L6,3 L0,6 Z' fill='#5eead4' />
                </marker>
              </defs>
              <rect x='10' y='70' width='120' height='56' rx='8' fill='#0f172a' stroke='#5eead4' />
              <text x='70' y='104' textAnchor='middle' fill='#e2e8f0' fontSize='13'>
                Gmail
              </text>
              <line x1='130' y1='98' x2='165' y2='98' stroke='#5eead4' markerEnd='url(#arrow)' />
              <rect x='165' y='70' width='130' height='56' rx='8' fill='#0f172a' stroke='#64748b' />
              <text x='230' y='96' textAnchor='middle' fill='#e2e8f0' fontSize='12'>
                Google Pub/Sub
              </text>
              <text x='230' y='112' textAnchor='middle' fill='#94a3b8' fontSize='11'>
                push notifications
              </text>
              <line x1='295' y1='98' x2='330' y2='98' stroke='#5eead4' markerEnd='url(#arrow)' />
              <rect x='330' y='70' width='120' height='56' rx='8' fill='#0f172a' stroke='#64748b' />
              <text x='390' y='96' textAnchor='middle' fill='#e2e8f0' fontSize='12'>
                Webhook
              </text>
              <text x='390' y='112' textAnchor='middle' fill='#94a3b8' fontSize='11'>
                ingest route
              </text>
              <line x1='450' y1='98' x2='485' y2='98' stroke='#5eead4' markerEnd='url(#arrow)' />
              <rect x='485' y='48' width='150' height='96' rx='8' fill='#0f172a' stroke='#5eead4' />
              <text x='560' y='78' textAnchor='middle' fill='#e2e8f0' fontSize='12'>
                Next.js app
              </text>
              <text x='560' y='98' textAnchor='middle' fill='#94a3b8' fontSize='11'>
                Clerk auth
              </text>
              <text x='560' y='114' textAnchor='middle' fill='#94a3b8' fontSize='11'>
                AI SDK categorization
              </text>
              <text x='560' y='130' textAnchor='middle' fill='#94a3b8' fontSize='11'>
                Drizzle data layer
              </text>
              <line x1='635' y1='98' x2='670' y2='98' stroke='#5eead4' markerEnd='url(#arrow)' />
              <rect x='670' y='70' width='110' height='56' rx='8' fill='#0f172a' stroke='#64748b' />
              <text x='725' y='96' textAnchor='middle' fill='#e2e8f0' fontSize='12'>
                Turso
              </text>
              <text x='725' y='112' textAnchor='middle' fill='#94a3b8' fontSize='11'>
                libSQL
              </text>
              <rect x='800' y='70' width='110' height='56' rx='8' fill='#0f172a' stroke='#64748b' />
              <text x='855' y='96' textAnchor='middle' fill='#e2e8f0' fontSize='12'>
                Dashboard
              </text>
              <text x='855' y='112' textAnchor='middle' fill='#94a3b8' fontSize='11'>
                budgets & insights
              </text>
              <line x1='780' y1='98' x2='800' y2='98' stroke='#5eead4' markerEnd='url(#arrow)' />
              <line x1='560' y1='144' x2='560' y2='178' stroke='#64748b' strokeDasharray='4 4' />
              <rect x='485' y='178' width='150' height='34' rx='8' fill='#0f172a' stroke='#64748b' />
              <text x='560' y='199' textAnchor='middle' fill='#94a3b8' fontSize='11'>
                Gmail OAuth sync (user-initiated)
              </text>
            </svg>
            <figcaption className='mt-4 text-center text-sm text-slate-500'>
              {sections.architecture.diagramCaption}
            </figcaption>
          </figure>
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
        </section>

        <SectionBlock section={sections.impact} />
        <SectionBlock section={sections.operationalQuality} />

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
        </section>
      </article>
    </main>
  )
}
