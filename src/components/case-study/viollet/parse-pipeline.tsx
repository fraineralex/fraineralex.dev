'use client'

import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { Locale } from '@/i18n-config'
import type { ViolletControlsCopy, ViolletParseCopy } from '@/types/case-study-types'
import { formatDop } from './format'
import { InteractivePanel, StepControls } from './ui'

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

      <div className='mt-4 grid gap-3 lg:grid-cols-2' aria-live='polite'>
        <article className={`rounded-lg border p-4 ${step < 2 ? 'border-teal-300/70 bg-teal-400/10' : 'border-slate-700 bg-slate-900/70'}`}>
          <p className='text-[11px] uppercase tracking-wide text-teal-200/80'>{step >= 1 ? 'Banreservas' : copy.rawLabel}</p>
          <p className='mt-2 text-xs text-slate-400'>{copy.fromLabel} notificaciones@banreservas.com</p>
          <h4 className='mt-2 text-sm font-medium text-slate-100'>{copy.subjectLabel} BRAVO LA ESPERILLA</h4>
          <p className={`mt-3 whitespace-pre-wrap text-sm leading-relaxed ${showClean ? 'text-slate-200' : 'text-slate-400'}`}>
            {'Transacción en Visa Premia ••7392\nMonto: DOP 2,591.00'}
            {!showClean && `\n\n${copy.disclaimer}`}
          </p>
          {showClean && (
            <p className='mt-3 text-xs text-teal-100'>{copy.cleanedLabel}</p>
          )}
        </article>

        <article className={`rounded-lg border p-4 ${showStored ? 'border-teal-300/70 bg-teal-400/10' : 'border-slate-700 bg-slate-900/70'}`}>
          <p className='text-[11px] uppercase tracking-wide text-teal-200/80'>{copy.ledgerLabel}</p>
          {step < 3 ? (
            <p className='mt-3 text-sm text-slate-400'>{copy.waiting}</p>
          ) : (
            <dl className='mt-3 space-y-2 text-sm'>
              <Row label={copy.merchant} value='BRAVO LA ESPERILLA' />
              <Row label={copy.amount} value={`${formatDop(-259100, lang)} · -259100`} />
              <Row label={copy.account} value='Visa Premia *7392' />
              <Row label={copy.typeLabel} value={copy.typeValue} />
              {showCategory && (
                <>
                  <Row label={copy.category} value={copy.categoryValue} />
                  <Row label={copy.confidence} value={copy.confidenceValue} />
                  <Row label={copy.source} value={copy.sourceValue} />
                </>
              )}
              {showStored && <Row label={copy.stored} value='emails.gmailMessageId · onConflictDoNothing' />}
            </dl>
          )}
        </article>
      </div>

      <div className='mt-4 rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3'>
        <h4 className='text-sm font-medium text-slate-100'>{current?.title}</h4>
        <p className='mt-1 text-sm leading-relaxed text-slate-300'>{current?.body}</p>
      </div>
    </InteractivePanel>
  )
}

function Row ({ label, value }: { label: string; value: string }) {
  return (
    <div className='grid grid-cols-1 gap-0.5 sm:grid-cols-[9rem_1fr]'>
      <dt className='text-slate-400'>{label}</dt>
      <dd className='font-mono text-xs text-teal-50 sm:text-sm'>{value}</dd>
    </div>
  )
}
