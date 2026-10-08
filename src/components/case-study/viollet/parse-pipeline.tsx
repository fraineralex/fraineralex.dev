'use client'

import { useReducedMotion } from 'framer-motion'
import {
  Activity,
  Building2,
  CheckCircle2,
  Code,
  CreditCard,
  DollarSign,
  FileText,
  Mail,
  Tag
} from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { Locale } from '@/i18n-config'
import type { ViolletControlsCopy, ViolletParseCopy } from '@/types/case-study-types'
import { formatDop } from './format'
import { kicker } from './tokens'
import { InteractivePanel, StepControls } from './ui'

const badge =
  'inline-flex min-h-5 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md border px-1.5 py-0.5 text-xs font-medium leading-none'

const cardFrame =
  'min-w-0 rounded-xl border shadow-sm transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none'

const activeTone = 'border-teal-300/60 bg-slate-800/70 ring-2 ring-teal-300/25'
const pendingTone = 'border-teal-400/35 bg-slate-800/50'
const idleTone = 'border-slate-700/60 bg-slate-800/40'

export default function ParsePipeline ({
  copy,
  controls,
  lang
}: {
  copy: ViolletParseCopy
  controls: ViolletControlsCopy
  lang: Locale
}) {
  const reduced = useReducedMotion()
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const total = copy.steps.length
  const current = copy.steps[step]

  useEffect(() => {
    if (!playing) return
    const delay = reduced ? 900 : 1700
    const timer = window.setTimeout(() => {
      setStep(value => {
        if (value >= total - 1) {
          setPlaying(false)
          return value
        }
        return value + 1
      })
    }, delay)
    return () => window.clearTimeout(timer)
  }, [playing, step, reduced, total])

  const showClean = step >= 2
  const showExtract = step >= 3
  const showCategory = step >= 4
  const showStored = step >= 5
  const emailTone = step < 2 ? activeTone : idleTone
  const ledgerTone = showStored ? activeTone : showExtract ? pendingTone : idleTone

  const ledgerFields: LedgerField[] = [
    {
      key: 'merchant',
      icon: Mail,
      label: copy.merchant,
      value: <span className='text-sm font-medium text-slate-200'>BRAVO LA ESPERILLA</span>
    },
    {
      key: 'amount',
      icon: DollarSign,
      label: copy.amount,
      value: (
        <span className='block text-right'>
          <span className='block text-xl font-bold leading-none tabular-nums text-rose-400 sm:text-2xl'>
            {formatDop(-259100, lang)}
          </span>
          <span className='mt-1 block font-mono text-[11px] font-normal leading-none text-slate-500'>· -259100</span>
        </span>
      )
    },
    {
      key: 'account',
      icon: Building2,
      label: copy.account,
      value: <span className='block max-w-full truncate text-sm font-medium text-slate-200'>Visa Premia *7392</span>
    },
    {
      key: 'type',
      icon: CreditCard,
      label: copy.typeLabel,
      value: (
        <span className={`${badge} border-transparent bg-orange-500/10 text-orange-300`}>
          {copy.typeValue}
        </span>
      )
    }
  ]

  if (showCategory) {
    ledgerFields.push(
      {
        key: 'category',
        icon: Tag,
        label: copy.category,
        value: (
          <span className={`${badge} border-transparent bg-teal-400/15 text-teal-200`}>
            {copy.categoryValue}
          </span>
        )
      },
      {
        key: 'confidence',
        icon: Activity,
        label: copy.confidence,
        value: <span className='text-sm font-medium text-slate-200'>{copy.confidenceValue}</span>
      },
      {
        key: 'source',
        icon: FileText,
        label: copy.source,
        value: <span className='font-mono text-xs font-medium text-slate-200'>{copy.sourceValue}</span>
      }
    )
  }

  if (showStored) {
    ledgerFields.push({
      key: 'stored',
      icon: CheckCircle2,
      iconClassName: 'text-emerald-300',
      label: copy.stored,
      value: (
        <span className='block max-w-full font-mono text-xs font-normal break-all text-emerald-300'>
          emails.gmailMessageId · onConflictDoNothing
        </span>
      )
    })
  }

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.description}>
      <StepControls
        copy={controls}
        step={step}
        total={total}
        playing={playing}
        onToggle={() => {
          if (step >= total - 1) setStep(0)
          setPlaying(value => !value)
        }}
        onPrev={() => {
          setPlaying(false)
          setStep(value => Math.max(0, value - 1))
        }}
        onNext={() => {
          setPlaying(false)
          setStep(value => Math.min(total - 1, value + 1))
        }}
        onReplay={() => {
          setStep(0)
          setPlaying(true)
        }}
      />

      <div className='mt-5 grid min-w-0 items-start gap-3 lg:grid-cols-2' aria-live='polite'>
        <article className={`${cardFrame} p-4 sm:p-6 ${emailTone}`}>
          <div className='space-y-4'>
            <div className='space-y-1'>
              <p className={kicker}>{copy.subjectLabel}</p>
              <h4 className='text-xl font-semibold break-words text-slate-200'>BRAVO LA ESPERILLA</h4>
              <div className='flex flex-wrap items-center gap-2 text-sm text-slate-400'>
                <span className='font-medium text-slate-200'>{step >= 1 ? 'Banreservas' : copy.rawLabel}</span>
                <span className='hidden sm:inline' aria-hidden='true'>-</span>
                <span className='text-xs break-all sm:text-sm'>
                  <span className='text-slate-500'>{copy.fromLabel}</span>
                  {' '}
                  notificaciones@banreservas.com
                </span>
              </div>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <span className={`${badge} border-slate-600 text-slate-300`}>
                <CreditCard className='size-3 shrink-0' aria-hidden='true' />
                Visa Premia ••7392
              </span>
              {step >= 1 && (
                <span className={`${badge} border-transparent bg-slate-800/60 text-slate-200`}>
                  <span
                    aria-hidden='true'
                    className='flex size-5 shrink-0 items-center justify-center overflow-hidden rounded text-[10px] font-bold leading-none text-white'
                    style={{ backgroundColor: '#264E72' }}
                  >
                    B
                  </span>
                  Banreservas
                </span>
              )}
              <span className={`${badge} ${
                showClean
                  ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                  : 'border-slate-600 text-slate-400'
              }`}
              >
                {showClean
                  ? <FileText className='size-3 shrink-0' aria-hidden='true' />
                  : <Code className='size-3 shrink-0' aria-hidden='true' />}
                {showClean ? 'text/plain' : 'text/html'}
              </span>
            </div>
          </div>

          <div aria-hidden='true' className='my-4 h-px w-full bg-slate-700/60' />

          <div className='flex flex-col gap-6 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/50 py-6 shadow-sm'>
            <pre className={`overflow-hidden px-4 font-sans text-sm leading-relaxed break-words whitespace-pre-wrap transition-colors motion-reduce:transition-none sm:px-6 ${showClean ? 'text-slate-200' : 'text-slate-500'}`}>
              {'Transacción en Visa Premia ••7392\nMonto: DOP 2,591.00'}
              {!showClean && `\n\n${copy.disclaimer}`}
            </pre>
            {showClean && (
              <p className='flex items-start gap-2 px-4 text-xs font-medium leading-relaxed text-emerald-300 sm:px-6'>
                <CheckCircle2 className='mt-0.5 size-3.5 shrink-0' aria-hidden='true' />
                {copy.cleanedLabel}
              </p>
            )}
          </div>
        </article>

        <article className={`${cardFrame} flex h-fit flex-col gap-6 overflow-hidden py-6 text-slate-200 ${ledgerTone}`}>
          <div className='grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 pb-3'>
            <div className='flex items-center gap-2 text-base leading-none font-semibold'>
              <Activity className='size-4 text-teal-300' aria-hidden='true' />
              {copy.ledgerLabel}
            </div>
          </div>
          <div className='space-y-3 px-6'>
            {showExtract ? (
              <>
                <div className='flex items-center justify-between gap-3 rounded-lg p-3 transition-colors motion-reduce:transition-none hover:bg-slate-800/60'>
                  <div className='flex min-w-0 flex-1 items-center gap-3'>
                    <div aria-hidden='true' className='h-3 w-3 flex-shrink-0 rounded-full bg-teal-400' />
                    <div className='min-w-0 flex-1'>
                      <div className='flex min-w-0 items-center gap-2'>
                        <p className='truncate text-sm font-medium text-slate-200'>BRAVO LA ESPERILLA</p>
                        <Mail className='size-3 shrink-0 text-slate-500' aria-hidden='true' />
                      </div>
                      <div className='flex min-w-0 items-center gap-2 text-xs text-slate-400'>
                        {showCategory && (
                          <>
                            <span className='truncate'>{copy.categoryValue}</span>
                            <span aria-hidden='true'>•</span>
                          </>
                        )}
                        <span className='truncate'>Visa Premia *7392</span>
                      </div>
                    </div>
                  </div>
                  <p className='shrink-0 text-right text-sm font-semibold tabular-nums text-slate-200'>
                    {formatDop(-259100, lang)}
                  </p>
                </div>
                <div>
                  {ledgerFields.map((field, index) => (
                    <FieldRow
                      key={field.key}
                      icon={field.icon}
                      iconClassName={field.iconClassName}
                      label={field.label}
                      bordered={index < ledgerFields.length - 1}
                    >
                      {field.value}
                    </FieldRow>
                  ))}
                </div>
              </>
            ) : (
              <p className='py-8 text-center text-sm text-slate-500'>{copy.waiting}</p>
            )}
          </div>
        </article>
      </div>

      <div className='mt-4 rounded-xl border border-teal-400/30 bg-teal-400/10 px-4 py-3.5'>
        <h4 className='text-sm font-semibold text-teal-100'>{current?.title}</h4>
        <p className='mt-1 text-sm leading-relaxed text-slate-300'>{current?.body}</p>
      </div>
    </InteractivePanel>
  )
}

interface LedgerField {
  key: string
  icon: LucideIcon
  iconClassName?: string
  label: string
  value: ReactNode
}

function FieldRow ({
  icon: Icon,
  iconClassName,
  label,
  bordered,
  children
}: {
  icon: LucideIcon
  iconClassName?: string
  label: string
  bordered: boolean
  children: ReactNode
}) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2 ${bordered ? 'border-b border-slate-700/60' : ''}`}>
      <div className='flex items-center gap-2 text-slate-400'>
        <Icon className={`size-4 shrink-0 ${iconClassName ?? ''}`} aria-hidden='true' />
        <span className='text-sm'>{label}</span>
      </div>
      <div className='ml-auto min-w-0 max-w-full text-right'>{children}</div>
    </div>
  )
}
