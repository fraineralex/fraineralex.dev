'use client'

import { ArrowRight, CheckCircle2, Mail } from 'lucide-react'
import type { ViolletInboxCopy, ViolletInboxMessage } from '@/types/case-study-types'
import { easeOut, sceneFocus, span, useSceneTimeline } from '../kit/scene'
import { bankIcon, bankWordmark } from './banks'
import { L, LC, badgeBase } from './light'
import { INBOX_BANKS, inboxMail, type InboxMail, type InboxRow } from './inbox-mail'
import { AppSurface, InteractivePanel } from './ui'

// Selection used to dwell 2600ms. ~2.2x faster, with a short handoff.
const STAGE = 1200
const HANDOFF = 90
const HOLD = 1100
// Row 0 is present immediately. Rows 1 to 4 finish by 960ms, inside the 1.5s cap.
const ARRIVE_START = [0, 80, 300, 520, 740]
const ARRIVE_FADE = 220
const ROW_HEIGHT = 88
// Fixed tray for the tallest sample letter at 360, 390, and 1280.
// Extra content scrolls inside instead of growing the page.
const READER_HEIGHT = 'h-[1056px] lg:h-[792px]'

function inkOn (hex: string): string {
  const n = Number.parseInt(hex.slice(1), 16)
  const lin = (channel: number) => {
    const s = channel / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  const luminance = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255)
  const white = 1.05 / (luminance + 0.05)
  return white >= 4.5 ? '#ffffff' : '#0b1220'
}

function SenderMark ({ name }: { name: string }) {
  const bank = INBOX_BANKS[name]
  return (
    <span
      className={`flex h-10 w-14 shrink-0 items-center justify-center rounded-lg border ${L.border} bg-white p-1.5`}
      style={{ boxShadow: bank ? `inset 0 -2px ${bank.color}` : undefined }}
    >
      {bank
        ? <img src={bankIcon(bank.id)} alt={name} width={44} height={28} className='h-full w-full object-contain' />
        : <Mail className={`size-5 ${L.subtle}`} aria-hidden='true' />}
    </span>
  )
}

function FieldTable ({ rows }: { rows: InboxRow[] }) {
  if (rows.length === 0) return null
  return (
    <dl className={`overflow-hidden rounded-lg border ${L.border}`}>
      {rows.map((row) => (
        <div key={row.label} className={`grid grid-cols-1 gap-x-2 gap-y-0.5 border-b px-2.5 py-1.5 last:border-b-0 sm:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] ${L.border}`}>
          <dt className={`min-w-0 break-words text-[11px] leading-snug ${L.muted}`}>{row.label}</dt>
          <dd className={`min-w-0 break-words text-xs font-medium leading-snug sm:text-right ${L.fg} ${row.mono ? L.mono : ''}`}>{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function Letter ({ message, mail }: { message: ViolletInboxMessage, mail: InboxMail }) {
  const bank = mail.kind === 'bank' ? INBOX_BANKS[message.from] : undefined
  const band = bank?.color ?? (mail.kind === 'plain' ? mail.band : '#3f3f46')
  const ink = inkOn(band)
  return (
    <div className={`overflow-hidden rounded-xl border bg-white ${L.border}`}>
      <div className='flex items-center gap-2.5 px-3 py-2.5' style={{ backgroundColor: band }}>
        {bank
          ? (
            <span className='flex h-11 w-16 shrink-0 items-center justify-center rounded-md bg-white px-1.5'>
              <img src={bankWordmark(bank.id)} alt={message.from} width={56} height={32} className='h-7 w-full object-contain' />
            </span>
            )
          : (
            <span className='flex size-11 shrink-0 items-center justify-center rounded-md bg-white text-sm font-semibold' style={{ color: band }} aria-hidden='true'>
              {message.from.slice(0, 1)}
            </span>
            )}
        <p className='min-w-0 flex-1 truncate text-sm font-semibold leading-5' style={{ color: ink }}>{message.from}</p>
      </div>
      <div className='space-y-2.5 p-3'>
        <p className={`break-all text-[11px] leading-snug ${L.muted}`}>{message.email}</p>
        <h4 className={`break-words text-sm font-semibold leading-5 ${L.fg}`}>{message.subject}</h4>
        <p className={`break-words text-sm leading-relaxed ${L.fg}`}>{mail.greeting}</p>
        {mail.kind === 'bank'
          ? <p className={`break-words text-sm leading-relaxed ${L.fg2}`}>{mail.intro}</p>
          : mail.paragraphs.map((paragraph) => (
            <p key={paragraph} className={`break-words text-sm leading-relaxed ${L.fg2}`}>{paragraph}</p>
          ))}
        {mail.kind === 'plain' && (
          <p className={`break-words text-sm leading-relaxed ${L.fg}`}>{mail.signoff}</p>
        )}
        <FieldTable rows={mail.rows} />
        <p className={`break-words text-[11px] leading-relaxed ${L.muted}`}>{mail.disclaimer}</p>
        <p className={`${badgeBase} ${L.neutralBadge}`}>{mail.sampleLabel}</p>
      </div>
    </div>
  )
}

export default function InboxExplorer ({ copy, lang }: { copy: ViolletInboxCopy, lang: 'es' | 'en' }) {
  const count = Math.max(1, copy.messages.length)
  const duration = count * STAGE
  const timeline = useSceneTimeline(duration, { loop: true, hold: HOLD })
  const reduced = timeline.reduced
  const finished = !reduced && timeline.elapsed >= duration
  const step = reduced ? 0 : Math.min(count - 1, Math.floor(timeline.elapsed / STAGE))
  const local = reduced || finished ? STAGE : timeline.elapsed - step * STAGE
  const active = reduced || finished || step === 0 || local >= HANDOFF ? step : step - 1
  const move = reduced || finished ? 1 : span(local, HANDOFF, HANDOFF + 140, easeOut)
  const highlight = reduced ? 0 : finished ? step : Math.max(0, step - 1) + (step > 0 ? move : 0)

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
                const arrival = reduced || finished || index === 0
                  ? 1
                  : span(timeline.elapsed, ARRIVE_START[index] ?? 0, (ARRIVE_START[index] ?? 0) + ARRIVE_FADE, easeOut)
                return (
                  <li key={item.id} className={`flex items-center gap-3 border-b last:border-b-0 ${L.border} px-3`} style={{ height: ROW_HEIGHT }}>
                    <div
                      className='flex w-full min-w-0 items-center gap-3'
                      style={{ opacity: arrival, transform: `translateX(${(1 - arrival) * 10}px)` }}
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

          <div
            className={`${READER_HEIGHT} min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain ${sceneFocus}`}
            tabIndex={0}
            role='region'
            aria-label={copy.prompt}
          >
            <div className='grid min-w-0'>
              {copy.messages.map((message, index) => {
                const visible = active === index
                const alert = message.kind === 'alert'
                const verdict = reduced || finished || index !== step ? 1 : span(local, 40, 220, easeOut)
                const mail = inboxMail(lang, message.id)
                return (
                  <article
                    key={message.id}
                    aria-hidden={!visible}
                    className='col-start-1 row-start-1 flex min-w-0 flex-col gap-3 p-3'
                    style={{ visibility: visible ? 'visible' : 'hidden' }}
                  >
                    {mail
                      ? <Letter message={message} mail={mail} />
                      : (
                        <div className={`${L.card} p-4`}>
                          <h4 className={`break-words text-sm font-semibold ${L.fg}`}>{message.subject}</h4>
                          <p className={`mt-2 break-words text-sm leading-relaxed ${L.fg2}`}>{message.snippet}</p>
                        </div>
                        )}
                    <div
                      className={`relative overflow-hidden rounded-xl border p-3 ${alert ? L.primaryBorder : L.border} ${alert ? L.primaryTint : L.secondary}`}
                      style={{ opacity: verdict }}
                      aria-hidden={!visible || verdict === 0}
                    >
                      <div className={`flex flex-wrap items-center gap-2 ${alert ? L.primaryText : L.muted}`}>
                        {alert ? <CheckCircle2 className='size-5 shrink-0' aria-hidden='true' /> : <Mail className='size-5 shrink-0' aria-hidden='true' />}
                        <span className='text-sm font-semibold'>{message.verdict}</span>
                        <span className={`${badgeBase} ${alert ? L.success : L.neutralBadge}`}>{alert ? copy.alert : copy.noise}</span>
                        {alert && <ArrowRight className='ml-auto size-4' aria-hidden='true' />}
                      </div>
                      <p className={`mt-2 break-words text-xs leading-relaxed ${L.muted}`}>{message.detail}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </AppSurface>
    </InteractivePanel>
  )
}
