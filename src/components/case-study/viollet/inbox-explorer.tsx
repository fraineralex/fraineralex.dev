'use client'

import { ArrowRight, CheckCircle2, Mail } from 'lucide-react'
import type { ViolletInboxCopy } from '@/types/case-study-types'
import { easeOut, span, useSceneTimeline } from '../kit/scene'
import { L, LC, badgeBase } from './light'
import { AppSurface, InteractivePanel } from './ui'

const STAGE = 2600
const ROW_HEIGHT = 88
const BANKS: Record<string, { logo: string, color: string }> = {
  Banreservas: { logo: 'banreservas.svg', color: '#264E72' },
  Qik: { logo: 'qik.svg', color: '#0082CD' },
  'Banco BHD': { logo: 'bhd.svg', color: '#50BA3F' }
}

function SenderMark ({ name }: { name: string }) {
  const bank = BANKS[name]
  return (
    <span
      className={`flex h-10 w-14 shrink-0 items-center justify-center rounded-lg border ${L.border} bg-white p-1.5`}
      style={{ boxShadow: bank ? `inset 0 -2px ${bank.color}` : undefined }}
    >
      {bank
        ? <img src={`/case-studies/viollet/banks/${bank.logo}`} alt={name} width={44} height={28} className='h-full w-full object-contain' />
        : <Mail className={`size-5 ${L.subtle}`} aria-hidden='true' />}
    </span>
  )
}

export default function InboxExplorer ({ copy }: { copy: ViolletInboxCopy }) {
  const duration = copy.messages.length * STAGE
  const timeline = useSceneTimeline(duration, { loop: true, hold: 2400 })
  const finished = timeline.elapsed >= duration
  const step = Math.min(copy.messages.length - 1, Math.floor(timeline.elapsed / STAGE))
  const local = finished ? STAGE : timeline.elapsed - step * STAGE
  // Keep the previous email open while the next row arrives, then move the reader.
  const active = local < 400 && step > 0 ? step - 1 : step
  const move = span(local, 400, 850, easeOut)
  const highlight = finished ? step : Math.max(0, step - 1) + (step > 0 ? move : 0)

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.description} timeline={timeline}>
      <AppSurface route='viollet.app'>
        <div className={`flex items-center gap-2 border-b ${L.border} pb-3`}>
          <Mail className={`size-4 ${L.primaryText}`} aria-hidden='true' />
          <span className={`text-sm font-semibold ${L.fg}`}>{copy.listLabel}</span>
          <span className={`ml-auto ${badgeBase} ${L.neutralBadge}`}>{copy.messages.length}</span>
        </div>
        <div className='grid min-w-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'>
          <div className={`relative min-w-0 overflow-hidden border-b lg:border-b-0 lg:border-r ${L.border}`}>
            <div
              aria-hidden='true'
              className='pointer-events-none absolute inset-x-0 top-0 border-l-[3px]'
              style={{
                height: ROW_HEIGHT,
                transform: `translateY(${highlight * ROW_HEIGHT}px)`,
                background: 'oklch(0.539 0.254 282 / 0.08)',
                borderColor: LC.primary
              }}
            />
            <ul aria-label={copy.listLabel} className='relative m-0 list-none p-0'>
              {copy.messages.map((item, index) => {
                const arrival = finished ? 1 : span(timeline.elapsed, index * STAGE, index * STAGE + 400, easeOut)
                return (
                  <li key={item.id} className={`flex items-center gap-3 border-b last:border-b-0 ${L.border} px-3`} style={{ height: ROW_HEIGHT }}>
                    <div
                      className='flex w-full min-w-0 items-center gap-3'
                      style={{ opacity: index === 0 ? 0.25 + arrival * 0.75 : arrival, transform: `translateX(${(1 - arrival) * 18}px)` }}
                    >
                      <SenderMark name={item.from} />
                      <div className='min-w-0 flex-1'>
                        <p className={`truncate text-sm font-semibold ${active === index ? L.primaryText : L.fg}`}>{item.from}</p>
                        <p className={`mt-1 truncate text-xs ${L.fg2}`}>{item.subject}</p>
                        <p className={`mt-1 truncate text-[11px] ${L.subtle}`}>{item.email}</p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Overlaid grid cells reserve the tallest email's space at every frame. */}
          <div className='grid min-w-0'>
            {copy.messages.map((message, index) => {
              const visible = active === index
              const alert = message.kind === 'alert'
              const opening = finished || index < step ? 1 : span(local, 400, 850, easeOut)
              const verdict = finished || index < step ? 1 : span(local, 1300, 2000, easeOut)
              return (
                <article
                  key={message.id}
                  aria-hidden={!visible}
                  className='col-start-1 row-start-1 flex min-w-0 flex-col gap-5 p-4 sm:p-5'
                  style={{ visibility: visible ? 'visible' : 'hidden' }}
                >
                  <div className='flex min-w-0 items-center gap-3'>
                    <SenderMark name={message.from} />
                    <div className='min-w-0'>
                      <p className={`text-sm font-semibold ${L.fg}`}>{message.from}</p>
                      <p className={`break-all text-xs ${L.muted}`}>{message.email}</p>
                    </div>
                  </div>
                  <div style={{ opacity: 0.65 + opening * 0.35, transform: `translateY(${(1 - opening) * 10}px)` }}>
                    <h4 className={`break-words text-lg font-semibold ${L.fg}`}>{message.subject}</h4>
                    <div className={`mt-4 ${L.card} p-4`}>
                      <p className={`break-words text-sm leading-relaxed ${L.fg2}`}>{message.snippet}</p>
                    </div>
                  </div>
                  <div
                    className={`relative mt-auto overflow-hidden rounded-xl border p-4 ${alert ? L.primaryBorder : L.border} ${alert ? L.primaryTint : L.secondary}`}
                    style={{ opacity: verdict, transform: `translateY(${(1 - verdict) * 16}px) scale(${0.96 + verdict * 0.04})` }}
                    aria-hidden={!visible || verdict === 0}
                  >
                    <div className={`flex flex-wrap items-center gap-2 ${alert ? L.primaryText : L.muted}`}>
                      {alert ? <CheckCircle2 className='size-5 shrink-0' aria-hidden='true' /> : <Mail className='size-5 shrink-0' aria-hidden='true' />}
                      <span className='text-sm font-semibold'>{message.verdict}</span>
                      <span className={`${badgeBase} ${alert ? L.success : L.neutralBadge}`}>{alert ? copy.alert : copy.noise}</span>
                      {alert && <ArrowRight className='ml-auto size-4' aria-hidden='true' />}
                    </div>
                    <p className={`mt-3 break-words text-xs leading-relaxed ${L.muted}`}>{message.detail}</p>
                    <div aria-hidden='true' className='absolute inset-x-0 bottom-0 h-0.5 origin-left' style={{ background: alert ? LC.primary : LC.wire, transform: `scaleX(${verdict})` }} />
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </AppSurface>
    </InteractivePanel>
  )
}
