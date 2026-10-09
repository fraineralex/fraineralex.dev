'use client'

import { LockKeyhole, Shield, X } from 'lucide-react'
import type { ViolletAccessCopy } from '@/types/case-study-types'
import { linear, span, useSceneTimeline } from '../kit/scene'
import { L, LC, badgeBase } from './light'
import { INSTITUTIONS } from './sample-ledger'
import { AppSurface, InteractivePanel } from './ui'

const CHOICES = INSTITUTIONS.slice(0, 6)
const BANK_MARKS = {
  banreservas: { file: 'banreservas.svg', color: '#264E72' },
  popular: { file: 'popular.svg', color: '#001638' },
  bhd: { file: 'bhd.svg', color: '#50BA3F' },
  lafise: { file: 'lafise.svg', color: '#00583C' },
  qik: { file: 'qik.svg', color: '#0082CD' },
  santa_cruz: { file: 'santa_cruz.avif', color: '#0961AD' },
  apap: { file: 'apap.svg', color: '#205BA8' },
  scotiabank: { file: 'scotiabank_do.avif', color: '#EC0712' },
  promerica: { file: 'promerica.svg', color: '#0961AD' },
  caribe: { file: 'caribe.svg', color: '#1B765A' },
  banesco: { file: 'banesco_do.svg', color: '#003B71' }
} as const

const BANK_START = 500
const BANK_STEP = 650
const PASSWORD_START = 4700
const REFUSAL_START = 6000
const SCOPE_START = 7200
const READY_START = 9200
const DURATION = 10400

function DrawCheck ({ progress }: { progress: number }) {
  return (
    <svg viewBox='0 0 24 24' className='size-5 shrink-0' aria-hidden='true'>
      <path d='M5 12.5 10 17 19 7' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' pathLength='1' strokeDasharray='1' strokeDashoffset={1 - progress} />
    </svg>
  )
}

export default function AccessGate ({ copy, lang }: { copy: ViolletAccessCopy, lang: 'es' | 'en' }) {
  void lang
  const timeline = useSceneTimeline(DURATION, { loop: true, hold: 3400 })
  const elapsed = timeline.elapsed
  const bankTravel = span(elapsed, BANK_START, BANK_START + BANK_STEP * (CHOICES.length - 1), linear)
  const password = span(elapsed, PASSWORD_START, PASSWORD_START + 450)
  const refusal = span(elapsed, REFUSAL_START, REFUSAL_START + 500)
  const scope = span(elapsed, SCOPE_START, SCOPE_START + 1400, linear)
  const ready = span(elapsed, READY_START, READY_START + 600)
  const selected = CHOICES.filter((_, index) => elapsed >= BANK_START + index * BANK_STEP + 400)

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.description} timeline={timeline}>
      <AppSurface>
        <div className='grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'>
          <section aria-label={copy.authorized} className='min-w-0'>
            <div className='mb-3 flex h-7 items-center justify-between gap-2'>
              <h4 className={`text-sm font-semibold ${L.fg}`}>{copy.authorized}</h4>
              <span className={`${badgeBase} ${L.neutralBadge} tabular-nums`} aria-hidden='true'>{selected.length} / {CHOICES.length}</span>
            </div>
            <div className='relative pl-6'>
              <div className='absolute bottom-10 left-2 top-10 w-px' style={{ background: LC.wire }} aria-hidden='true'>
                <div className='absolute inset-x-0 top-0' style={{ height: `${bankTravel * 100}%`, background: LC.primary }} />
                <span className='absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-violet-100' style={{ top: `${bankTravel * 100}%`, background: LC.primary }} />
              </div>
              <ul className='space-y-2'>
                {CHOICES.map((item, index) => {
                  const progress = span(elapsed, BANK_START + index * BANK_STEP, BANK_START + index * BANK_STEP + 400, linear)
                  const mark = BANK_MARKS[item.id]
                  return (
                    <li key={item.id} className={`relative flex h-[72px] min-w-0 items-center gap-2 rounded-xl border bg-white px-2 sm:gap-3 sm:px-3 ${progress === 1 ? L.primaryBorder : L.border}`}>
                      <span aria-hidden='true' className='absolute -left-[21px] size-1.5 rounded-full' style={{ background: progress > 0 ? LC.primary : LC.wire }} />
                      <span className='flex h-10 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-100 border-b-2 bg-white p-1.5' style={{ borderBottomColor: mark.color }}>
                        <img src={`/case-studies/viollet/banks/${mark.file}`} alt={item.name} width={48} height={40} className='h-full w-full object-contain' />
                      </span>
                      <div className='min-w-0 flex-1'>
                        <p className={`truncate text-xs font-semibold sm:text-sm ${L.fg}`}>{item.name}</p>
                        <p className={`truncate text-[10px] sm:text-[11px] ${L.muted}`}>{item.sender}</p>
                        <p className={`mt-0.5 text-[10px] ${L.subtle}`}>{item.confirmed ? copy.confirmed : copy.listed}</p>
                      </div>
                      <span className={`flex size-6 shrink-0 items-center justify-center rounded-full ${progress > 0 ? L.primaryTint : L.secondary} ${L.primaryText}`}>
                        <DrawCheck progress={progress} />
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>

          <div className='min-w-0 space-y-3 lg:pt-10'>
            <section aria-label={copy.passwordLabel} className={`relative overflow-hidden rounded-xl border p-4 ${refusal > 0 ? L.danger : `${L.border} bg-white`}`}>
              <div className='flex items-center gap-2'>
                <LockKeyhole className='size-4 shrink-0' aria-hidden='true' />
                <h4 className='text-sm font-semibold'>{copy.passwordLabel}</h4>
              </div>
              <div aria-hidden='true' className={`relative mt-3 flex h-9 items-center justify-between overflow-hidden rounded-md border bg-white px-3 ${refusal > 0 ? 'border-red-200' : L.border}`} style={{ opacity: 0.5 + password * 0.5 }}>
                <span className='flex gap-1.5'>{Array.from({ length: 8 }, (_, index) => <span key={index} className='size-1.5 rounded-full bg-slate-300' />)}</span>
                <X className='size-4 text-red-600' style={{ opacity: refusal, transform: `scale(${0.7 + refusal * 0.3})` }} />
                <span className='absolute inset-y-0 left-0 bg-red-100/60' style={{ width: `${refusal * 100}%` }} />
              </div>
              <p className={`mt-2 text-xs leading-relaxed ${L.muted}`}>{copy.passwordNote}</p>
              <p className='mt-3 text-xs font-medium leading-relaxed text-red-700' style={{ opacity: refusal }}>{copy.bankRefusal}</p>
            </section>

            <section aria-label={copy.scope} className={`overflow-hidden ${L.card}`}>
              <div className='p-4'>
                <div className={`flex items-center gap-2 ${L.primaryText}`}>
                  <Shield className='size-4 shrink-0' aria-hidden='true' />
                  <h4 className={`flex-1 text-sm font-semibold ${L.mono}`}>{copy.scope}</h4>
                  <DrawCheck progress={scope} />
                </div>
                <p className={`mt-3 break-words text-xs leading-relaxed ${L.muted}`}>{copy.scopeDetail}</p>
              </div>
              <div className={`relative h-1 ${L.secondary}`} aria-hidden='true'>
                <div className='h-full' style={{ width: `${scope * 100}%`, background: LC.primary }} />
                <span className='absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full' style={{ left: `${scope * 100}%`, background: LC.primary, opacity: scope > 0 && scope < 1 ? 1 : 0 }} />
              </div>
            </section>
          </div>
        </div>

        <section aria-label={copy.summaryLabel} className={`mt-4 rounded-xl border p-4 ${ready > 0 ? L.success : `${L.border} ${L.secondary}`}`}>
          <div className='flex items-start gap-2'>
            <span className='mt-0.5'><DrawCheck progress={ready} /></span>
            <div className='min-w-0 flex-1'>
              <div className='grid text-sm font-semibold leading-relaxed'>
                <p className='col-start-1 row-start-1' style={{ opacity: 1 - ready }}>{copy.summaryLabel}</p>
                <p className='col-start-1 row-start-1' style={{ opacity: ready }}>{copy.grantReady.replace('{count}', String(selected.length))}</p>
              </div>
              <ul className='mt-2 grid min-w-0 gap-x-4 gap-y-1 sm:grid-cols-2'>
                {CHOICES.map((item, index) => (
                  <li key={item.id} className={`truncate text-[11px] ${L.mono}`} style={{ opacity: elapsed >= BANK_START + index * BANK_STEP + 400 ? 1 : 0.3 }}>{item.sender}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </AppSurface>
    </InteractivePanel>
  )
}
