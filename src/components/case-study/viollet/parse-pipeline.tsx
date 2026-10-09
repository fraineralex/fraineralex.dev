'use client'

import {
  Activity,
  Building2,
  CheckCircle2,
  CreditCard,
  DollarSign,
  FileText,
  Mail,
  Tag,
  type LucideIcon
} from 'lucide-react'
import type { ReactNode } from 'react'
import type { Locale } from '@/i18n-config'
import type { ViolletControlsCopy, ViolletParseCopy } from '@/types/case-study-types'
import { useSceneTimeline } from '../kit/scene'
import { formatDop } from './format'
import { L, LC, badgeBase } from './light'
import { AppSurface, InteractivePanel } from './ui'

const STAGE = 2200
const MERCHANT = 'BRAVO LA ESPERILLA'
const ACCOUNT = 'Visa Premia ••7392'

export default function ParsePipeline ({
  copy,
  lang
}: {
  copy: ViolletParseCopy
  // Retained for the existing call site; this scene has no manual controls.
  controls?: ViolletControlsCopy
  lang: Locale
}) {
  const duration = Math.max(1, copy.steps.length) * STAGE
  const timeline = useSceneTimeline(duration, { loop: true, hold: 3200 })
  const finished = !timeline.started || timeline.reduced || timeline.elapsed >= duration
  const step = finished ? copy.steps.length - 1 : Math.floor(timeline.elapsed / STAGE)
  const phase = copy.steps[step]?.id
  const clean = finished || step >= 2
  const amount = formatDop(-259100, lang)

  // The completed sample stays mounted through every loop. Only its emphasis
  // changes, so starting the next stage never clears the last parsed fields.
  const fields: LedgerField[] = [
    { key: 'merchant', icon: Mail, label: copy.merchant, value: MERCHANT, stage: 'extract' },
    {
      key: 'amount', icon: DollarSign, label: copy.amount, stage: 'extract',
      value: (
        <span className='block tabular-nums'>
          <span className='block font-semibold' style={{ color: LC.danger }}>{amount}</span>
          <span className={`block text-[11px] ${L.mono} ${L.subtle}`}>-259100</span>
        </span>
      )
    },
    { key: 'account', icon: Building2, label: copy.account, value: ACCOUNT, stage: 'extract' },
    {
      key: 'type', icon: CreditCard, label: copy.typeLabel, stage: 'extract',
      value: <span className={`${badgeBase} ${L.neutralBadge}`}>{copy.typeValue}</span>
    },
    {
      key: 'category', icon: Tag, label: copy.category, stage: 'category',
      value: <span className={`${badgeBase} ${L.primaryTint} ${L.primaryBorder} ${L.primaryText}`}>{copy.categoryValue}</span>
    },
    { key: 'confidence', icon: Activity, label: copy.confidence, value: copy.confidenceValue, stage: 'category' },
    { key: 'source', icon: FileText, label: copy.source, value: <span className={L.mono}>{copy.sourceValue}</span>, stage: 'category' },
    {
      key: 'stored', icon: CheckCircle2, label: copy.stored, stage: 'write',
      value: <CheckCircle2 className='ml-auto size-4 text-emerald-600' aria-label={copy.stored} />
    }
  ]

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.description}>
      <div ref={timeline.ref} data-scene=''>
        <AppSurface route='viollet.app'>
          <div className='grid min-w-0 items-stretch gap-3 lg:grid-cols-2'>
            <article className={`${L.card} flex min-w-0 flex-col overflow-hidden`}>
              <div className={`flex min-w-0 items-center gap-3 border-b ${L.border} p-4 sm:p-5`}>
                <span className={`flex h-11 w-16 shrink-0 items-center justify-center rounded-lg border ${L.border} bg-white p-2`}>
                  <img
                    src='/case-studies/viollet/banks/banreservas.svg'
                    alt='Banreservas'
                    width={48}
                    height={28}
                    className='h-7 w-12 object-contain'
                  />
                </span>
                <div className='min-w-0'>
                  <p className='text-sm font-semibold'>Banreservas</p>
                  <p className={`mt-1 break-all text-[11px] leading-relaxed ${L.muted}`}>
                    {copy.fromLabel} notificaciones@banreservas.com
                  </p>
                </div>
                <CheckCircle2
                  className='ml-auto size-4 shrink-0 text-emerald-600'
                  aria-hidden='true'
                  style={{ opacity: finished || step >= 1 ? 1 : 0.2 }}
                />
              </div>

              <div className='flex flex-1 flex-col gap-5 p-4 sm:p-5'>
                <div>
                  <p className={`text-[11px] font-medium uppercase tracking-wide ${L.muted}`}>{copy.subjectLabel}</p>
                  <h4 className='mt-2 text-lg font-semibold break-words'>{MERCHANT}</h4>
                  <div className='mt-3 flex flex-wrap items-center gap-2'>
                    <span className={`${badgeBase} ${L.neutralBadge}`}>
                      <CreditCard className='size-3' aria-hidden='true' />
                      {ACCOUNT}
                    </span>
                    <span className={`${badgeBase} w-24 ${L.neutralBadge} ${L.mono}`}>
                      {clean ? 'text/plain' : 'text/html'}
                    </span>
                  </div>
                </div>

                <div className={`relative flex-1 overflow-hidden rounded-xl border ${L.border} ${L.secondary} p-4`}>
                  <p className={`text-xs font-medium ${L.muted}`}>{copy.rawLabel}</p>
                  <div className='mt-4 space-y-3 text-sm leading-relaxed'>
                    <p className='font-semibold'>{MERCHANT}</p>
                    <p>{copy.account}: {ACCOUNT}</p>
                    <p>{copy.amount}: <span className='font-semibold tabular-nums'>{formatDop(259100, lang)}</span></p>
                    <p className={`text-xs ${L.subtle}`} style={{ opacity: clean ? 0.2 : 1 }}>{copy.disclaimer}</p>
                  </div>
                  <div className='mt-5 flex items-start gap-2 text-xs leading-relaxed text-emerald-700' style={{ opacity: clean ? 1 : 0 }} aria-hidden={!clean}>
                    <CheckCircle2 className='mt-0.5 size-3.5 shrink-0' aria-hidden='true' />
                    <p>{copy.cleanedLabel}</p>
                  </div>
                  <div
                    aria-hidden='true'
                    className='absolute inset-x-0 bottom-0 h-0.5 origin-left'
                    style={{ background: LC.primary, transform: `scaleX(${finished ? 1 : Math.min(1, timeline.elapsed / (STAGE * 3))})` }}
                  />
                </div>
              </div>
            </article>

            <article className={`${L.card} min-w-0 overflow-hidden`}>
              <div className={`flex items-center gap-2 border-b ${L.border} p-4 sm:p-5`}>
                <Activity className={`size-4 shrink-0 ${L.primaryText}`} aria-hidden='true' />
                <h4 className='text-sm font-semibold'>{copy.ledgerLabel}</h4>
                <CheckCircle2 className='ml-auto size-4 shrink-0 text-emerald-600' aria-hidden='true' />
              </div>
              <div className='p-3 sm:p-4'>
                <div className={`flex min-w-0 items-center gap-3 rounded-lg ${L.primaryTint} p-3`}>
                  <span className='size-2 shrink-0 rounded-full' style={{ background: LC.primary }} aria-hidden='true' />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-xs font-semibold sm:text-sm'>{MERCHANT}</p>
                    <p className={`mt-1 truncate text-[11px] ${L.muted}`}>{copy.categoryValue}</p>
                    <p className={`mt-1 truncate text-[11px] ${L.muted}`}>{ACCOUNT}</p>
                  </div>
                  <p className='shrink-0 text-xs font-semibold tabular-nums sm:text-sm' style={{ color: LC.danger }}>{amount}</p>
                </div>
                <dl className='mt-3'>
                  {fields.map(field => (
                    <FieldRow key={field.key} field={field} active={!finished && phase === field.stage} />
                  ))}
                </dl>
              </div>
            </article>
          </div>

          {/* All captions share one grid cell, reserving the tallest translation
              at every viewport width without clipping or frame-dependent height. */}
          <div className={`mt-3 overflow-hidden rounded-xl border ${L.primaryBorder} ${L.primaryTint}`}>
            <div className='grid min-w-0'>
              {copy.steps.map((item, index) => (
                <div
                  key={item.id}
                  className='col-start-1 row-start-1 min-w-0 p-4'
                  style={{ visibility: step === index ? 'visible' : 'hidden' }}
                  aria-hidden={step !== index}
                >
                  <h4 className={`text-sm font-semibold ${L.primaryText}`}>{item.title}</h4>
                  <p className={`mt-1 text-xs leading-relaxed sm:text-sm ${L.muted}`}>{item.body}</p>
                </div>
              ))}
            </div>
            <div className='h-0.5 origin-left' style={{ background: LC.primary, transform: `scaleX(${timeline.elapsed / duration})` }} aria-hidden='true' />
          </div>
        </AppSurface>
      </div>
    </InteractivePanel>
  )
}

interface LedgerField {
  key: string
  icon: LucideIcon
  label: string
  value: ReactNode
  stage: string
}

function FieldRow ({ field, active }: { field: LedgerField, active: boolean }) {
  const Icon = field.icon
  return (
    <div className={`grid min-w-0 grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-center gap-3 border-b last:border-b-0 ${L.border} rounded px-2 py-2.5 transition-colors duration-300 motion-reduce:transition-none ${active ? L.primaryTint : ''}`}>
      <dt className={`flex min-w-0 items-center gap-2 text-xs ${active ? L.primaryText : L.muted}`}>
        <Icon className='size-3.5 shrink-0' aria-hidden='true' />
        <span className='break-words'>{field.label}</span>
      </dt>
      <dd className='min-w-0 text-right text-xs font-medium break-words'>{field.value}</dd>
    </div>
  )
}
