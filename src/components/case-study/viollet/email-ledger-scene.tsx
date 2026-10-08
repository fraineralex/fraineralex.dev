'use client'

import { Mail, Receipt, ShoppingCart, User, Utensils, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  SCENE_LABELS,
  SceneFrame,
  easeInOut,
  easeOut,
  linear,
  phaseAt,
  pointOnPolyline,
  span,
  typed,
  useSceneTimeline
} from '../kit/scene'
import { formatDop } from './format'
import { L, LC } from './light'
import { CATEGORIES, METRICS, TRANSACTIONS } from './sample-ledger'

const DURATION = 12_000
const ROW = 42
const SLOTS = 4

const MARKET = CATEGORIES.find(item => item.key === 'supermarkets')?.amount ?? 443_600
const PURCHASE = Math.abs(TRANSACTIONS.find(item => item.id === 'bravo')?.amount ?? 259_100)
const MONTH_AFTER = METRICS.expenses
const MONTH_BEFORE = MONTH_AFTER - PURCHASE
const MARKET_BEFORE = MARKET - PURCHASE

const BODY = 'Visa Premia ••7392\nMonto: DOP 2,591.00\nBRAVO LA ESPERILLA\nFecha: 11:18 a.m.'

function bezier (a: [number, number], b: [number, number], c: [number, number], d: [number, number]): Array<[number, number]> {
  return Array.from({ length: 25 }, (_, i) => {
    const t = i / 24
    const u = 1 - t
    return [
      u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
      u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]
    ] as [number, number]
  })
}

function pathD (pts: Array<[number, number]>) {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
}

// Connector geometry in its own viewBox, drawn with xMidYMid meet so the packet never stretches.
const H_PTS = bezier([0, 40], [22, 14], [34, 66], [56, 40])
const V_PTS = bezier([40, 0], [14, 14], [66, 26], [40, 40])
const H_D = pathD(H_PTS)
const V_D = pathD(V_PTS)

const COPY = {
  en: {
    kicker: 'Email to ledger',
    title: 'Alert into the ledger',
    captions: ['A purchase alert arrives in Gmail.', 'Viollet reads it with read only access.', 'Fields extracted: merchant, amount, date and card.', 'Categorized as Supermarkets.', 'It lands in your ledger.'],
    gmail: 'Gmail', inbox: 'Inbox', readOnly: 'Read only', ledgerKicker: 'Sample', ledger: 'Ledger',
    month: 'This month', spent: 'Expenses', market: 'Supermarkets', category: 'Supermarkets',
    stages: ['Parse', 'Extract', 'Categorize'], fields: ['Merchant', 'Amount', 'Date', 'Card'],
    dateValue: 'Today 11:18', cardValue: '••7392',
    cats: { supermarkets: 'Supermarkets', food: 'Food and dining', bills: 'Bills and utilities' },
    mail: [
      { from: 'Banreservas', subject: 'Purchase alert', time: '11:18' },
      { from: 'Qik', subject: 'UBER*RIDES', time: '10:42' },
      { from: 'Banco BHD', subject: 'ATM withdrawal', time: '9:05' },
      { from: 'María Gómez', subject: 'Dinner on Friday?', time: 'Yesterday' }
    ]
  },
  es: {
    kicker: 'Del correo al libro',
    title: 'Del aviso al libro',
    captions: ['Llega un aviso de compra a Gmail.', 'Viollet lo lee con acceso de solo lectura.', 'Campos extraídos: comercio, monto, fecha y tarjeta.', 'Categorizado como Supermercados.', 'Entra a tu libro.'],
    gmail: 'Gmail', inbox: 'Bandeja', readOnly: 'Solo lectura', ledgerKicker: 'Muestra', ledger: 'Libro',
    month: 'Este mes', spent: 'Gastos', market: 'Supermercados', category: 'Supermercados',
    stages: ['Leer', 'Extraer', 'Categorizar'], fields: ['Comercio', 'Monto', 'Fecha', 'Tarjeta'],
    dateValue: 'Hoy 11:18', cardValue: '••7392',
    cats: { supermarkets: 'Supermercados', food: 'Comida y restaurantes', bills: 'Facturas y servicios' },
    mail: [
      { from: 'Banreservas', subject: 'Notificación de consumo', time: '11:18' },
      { from: 'Qik', subject: 'UBER*RIDES', time: '10:42' },
      { from: 'Banco BHD', subject: 'Retiro en cajero', time: '9:05' },
      { from: 'María Gómez', subject: '¿Cena el viernes?', time: 'Ayer' }
    ]
  }
} as const

const BANK_LOGOS: Record<string, string> = {
  Banreservas: 'banreservas.svg',
  'Banco BHD': 'bhd.svg',
  'Banco Popular': 'popular.svg',
  Qik: 'qik.svg',
  Scotiabank: 'scotiabank_do.avif',
  'Santa Cruz': 'santa_cruz.avif',
  'Banco Santa Cruz': 'santa_cruz.avif'
}

type Lang = 'en' | 'es'

const LEDGER: Array<{ id: string; icon: LucideIcon; fresh: boolean }> = [
  { id: 'bravo', icon: ShoppingCart, fresh: true },
  { id: 'nacional', icon: ShoppingCart, fresh: false },
  { id: 'uber-eats', icon: Utensils, fresh: false },
  { id: 'claro', icon: Receipt, fresh: false }
]

function frameAt (elapsed: number, lang: Lang) {
  const copy = COPY[lang]
  const arrive = span(elapsed, 200, 1150, easeOut)
  const fly1 = span(elapsed, 1650, 3450, easeInOut)
  const body = span(elapsed, 3450, 4200, easeOut)
  const beam = span(elapsed, 4000, 5300, linear)
  const parse = span(elapsed, 3350, 3850, easeOut)
  const extract = span(elapsed, 5200, 5600, easeOut)
  const merchantP = span(elapsed, 5250, 6100, linear)
  const amountP = span(elapsed, 6000, 6750, linear)
  const dateP = span(elapsed, 6650, 7250, linear)
  const cardP = span(elapsed, 7150, 7750, linear)
  const cat = span(elapsed, 7900, 8600, easeOut)
  const fly2 = span(elapsed, 8700, 10350, easeInOut)
  const land = span(elapsed, 10350, 11650, easeOut)
  const phase = phaseAt(elapsed, [0, 1650, 5200, 7900, 10350])
  const active = parse * (1 - span(elapsed, 10800, 11600))
  const glow = active * (0.62 + 0.38 * Math.sin(elapsed / 190))
  const bravo = TRANSACTIONS.find(item => item.id === 'bravo')
  return {
    arrive, fly1, fly2, body, beam, parse, extract, cat, land, phase, glow,
    inboxHot: arrive * (1 - span(elapsed, 1900, 2700)),
    merchant: typed(bravo?.merchant ?? 'BRAVO LA ESPERILLA', merchantP),
    amount: typed(formatDop(Math.abs(bravo?.amount ?? PURCHASE), lang), amountP),
    date: typed(copy.dateValue, dateP),
    card: typed(copy.cardValue, cardP),
    month: Math.round(MONTH_BEFORE + (MONTH_AFTER - MONTH_BEFORE) * land),
    market: Math.round(MARKET_BEFORE + (MARKET - MARKET_BEFORE) * land)
  }
}

function Wire ({
  t, elapsed, points, d, box, stroke, className
}: {
  t: number
  elapsed: number
  points: Array<[number, number]>
  d: string
  box: string
  stroke: number
  className: string
}) {
  const [x, y] = pointOnPolyline(points, t)
  const show = t > 0.04 && t < 0.97
  return (
    <svg viewBox={box} className={className} aria-hidden='true'>
      <path d={d} fill='none' stroke={LC.wire} strokeWidth={stroke} strokeLinecap='round' />
      <path
        d={d}
        fill='none'
        stroke={LC.primary}
        strokeWidth={stroke}
        strokeLinecap='round'
        pathLength={1}
        strokeDasharray='1'
        strokeDashoffset={1 - t}
        strokeOpacity={0.35 + 0.65 * Math.min(1, t * 2)}
      />
      <path
        d={d}
        fill='none'
        stroke={LC.primary}
        strokeWidth={stroke * 0.85}
        strokeDasharray='3 6'
        strokeDashoffset={-elapsed / 32}
        strokeOpacity='0.55'
      />
      {show && [0.07, 0.15, 0.23].map((gap, index) => {
        const at = t - gap
        if (at <= 0.02) return null
        const [cx, cy] = pointOnPolyline(points, at)
        return <circle key={gap} cx={cx} cy={cy} r={3.1 - index * 0.6} fill={LC.primary} opacity={0.5 - index * 0.14} />
      })}
      {show && (
        <g transform={`translate(${x} ${y})`}>
          <circle r='8' fill={LC.primary} opacity='0.28' />
          <rect x='-5.5' y='-4' width='11' height='8' rx='1.5' fill={LC.primary} />
          <path d='M-5.5 -4 L0 1 L5.5 -4' fill='none' stroke={LC.card} strokeWidth='0.9' />
        </g>
      )}
    </svg>
  )
}

function Connector ({ t, elapsed }: { t: number; elapsed: number }) {
  return (
    <div className='relative h-full min-h-0 min-w-0'>
      <Wire t={t} elapsed={elapsed} points={V_PTS} d={V_D} box='0 0 80 40' stroke={1.6} className='absolute inset-0 h-full w-full sm:hidden' />
      <Wire t={t} elapsed={elapsed} points={H_PTS} d={H_D} box='0 0 56 80' stroke={1.6} className='absolute inset-0 hidden h-full w-full sm:block' />
    </div>
  )
}

function Panel ({ kicker, title, hot, children }: { kicker: string; title: ReactNode; hot: number; children: ReactNode }) {
  return (
    <section
      className={`flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border bg-white p-2.5 ${hot > 0.2 ? 'border-[oklch(0.539_0.254_282/0.45)]' : 'border-[oklch(0.915_0.01_282)]'}`}
      style={{ boxShadow: hot > 0.08 ? `0 0 22px oklch(0.539 0.254 282 / ${0.16 * hot})` : undefined }}
    >
      <header className='mb-1 shrink-0'>
        <p className='text-[11px] font-medium uppercase leading-none tracking-wide text-[oklch(0.539_0.254_282)]'>{kicker}</p>
        <h4 className='mt-1 flex min-w-0 items-center gap-1.5 text-xs font-semibold leading-none text-[oklch(0.145_0_0)] sm:text-sm'>{title}</h4>
      </header>
      {children}
    </section>
  )
}

function catName (key: string, cats: { supermarkets: string; food: string; bills: string }) {
  if (key === 'food') return cats.food
  if (key === 'bills') return cats.bills
  return cats.supermarkets
}

export default function EmailLedgerScene ({ lang }: { lang: Lang }) {
  const copy = COPY[lang]
  const tl = useSceneTimeline(DURATION, { loop: true, hold: 3000 })
  const frame = frameAt(tl.elapsed, lang)
  const caption = copy.captions[Math.min(frame.phase, copy.captions.length - 1)] ?? copy.captions[0]
  const values = [
    frame.merchant || 'BRAVO LA ESPERILLA',
    frame.amount || formatDop(PURCHASE, lang),
    frame.date || copy.dateValue,
    frame.card || copy.cardValue
  ]
  const lits = [frame.parse, frame.extract, frame.cat]

  return (
    <SceneFrame
      timeline={tl}
      labels={SCENE_LABELS[lang]}
      kicker={copy.kicker}
      title={copy.title}
      caption={<span className='block h-10 overflow-hidden leading-5'>{caption}</span>}
      className='mt-6'
    >
      <div className={`relative overflow-hidden ${L.surface}`}>
        <div className='grid grid-cols-1 grid-rows-[14rem_2.75rem_16.75rem_2.75rem_18.75rem] p-2.5 sm:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1.22fr)_3.5rem_minmax(0,1.05fr)] sm:grid-rows-[18.75rem] sm:p-4'>
          <div className='row-start-1 min-h-0 min-w-0 sm:col-start-1 sm:row-start-1'>
            <Panel
              kicker={copy.gmail}
              title={<><Mail className='size-3.5 shrink-0 text-[oklch(0.539_0.254_282)]' aria-hidden='true' />{copy.inbox}</>}
              hot={frame.inboxHot}
            >
              <ul className='relative overflow-hidden' style={{ height: ROW * SLOTS }} aria-label={copy.inbox}>
                {copy.mail.map((item, index) => {
                  const fresh = index === 0
                  const y = (index - 1 + frame.arrive) * ROW
                  return (
                    <li
                      key={item.subject}
                      className='absolute inset-x-0 top-0'
                      style={{ height: ROW, transform: `translateY(${y}px)`, opacity: fresh ? frame.arrive : 1 }}
                      aria-hidden={fresh && frame.arrive < 0.25 ? true : undefined}
                    >
                      <div
                        className='flex h-full min-w-0 items-center gap-1.5 rounded-md px-1'
                        style={{ backgroundColor: fresh ? `oklch(0.539 0.254 282 / ${0.12 * frame.arrive})` : undefined }}
                      >
                        <span
                          className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold leading-none ${fresh ? 'bg-[oklch(0.539_0.254_282/0.08)] text-[oklch(0.539_0.254_282)]' : 'bg-[oklch(0.965_0.01_282)] text-[oklch(0.45_0_0)]'}`}
                        >
                          {BANK_LOGOS[item.from] ? (
                            <img src={`/case-studies/viollet/banks/${BANK_LOGOS[item.from]}`} alt={item.from} className='size-full rounded-full bg-white p-0.5 object-contain' />
                          ) : (
                            <User className='size-3.5' aria-hidden='true' />
                          )}
                        </span>
                        <span className='min-w-0 flex-1'>
                          <span className='flex items-baseline justify-between gap-1'>
                            <span className={`min-w-0 truncate text-xs text-[oklch(0.205_0_0)] ${fresh ? 'font-semibold' : 'font-medium'}`}>{item.from}</span>
                            <span className='shrink-0 text-[11px] tabular-nums text-[oklch(0.556_0_0)]'>{item.time}</span>
                          </span>
                          <span className={`block truncate text-[11px] ${fresh ? 'text-[oklch(0.205_0_0)]' : 'text-[oklch(0.45_0_0)]'}`}>{item.subject}</span>
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </Panel>
          </div>

          <div className='row-start-2 min-h-0 min-w-0 sm:col-start-2 sm:row-start-1'>
            <Connector t={frame.fly1} elapsed={tl.elapsed} />
          </div>

          <div className='row-start-3 min-h-0 min-w-0 sm:col-start-3 sm:row-start-1'>
            <Panel
              kicker={copy.readOnly}
              title={
                <>
                  <span
                    aria-hidden='true'
                    className='flex size-5 shrink-0 items-center justify-center rounded-md bg-[oklch(0.539_0.254_282/0.08)] text-[11px] font-bold text-[oklch(0.539_0.254_282)]'
                    style={{ boxShadow: frame.glow > 0.15 ? `0 0 0 3px oklch(0.539 0.254 282 / ${0.28 * frame.glow})` : undefined }}
                  >
                    V
                  </span>
                  Viollet
                </>
              }
              hot={frame.glow}
            >
              <div className='mb-1.5 flex gap-1 overflow-x-auto'>
                {copy.stages.map((label, index) => {
                  const lit = lits[index] ?? 0
                  return (
                    <span
                      key={label}
                      className='inline-flex h-6 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 text-[11px] font-medium'
                      style={{
                        borderColor: lit > 0.45 ? LC.primaryGlow : LC.border,
                        background: lit > 0.45 ? LC.primarySoft : 'transparent',
                        color: lit > 0.45 ? LC.primary : LC.muted,
                        boxShadow: lit > 0.7 ? `0 0 12px ${LC.primarySoft}` : undefined
                      }}
                    >
                      <span className='size-1.5 rounded-full bg-current' style={{ opacity: 0.35 + 0.65 * lit }} />
                      {label}
                    </span>
                  )
                })}
              </div>
              <div className='relative mb-1.5 h-[4.5rem] overflow-hidden rounded-md border border-[oklch(0.915_0.01_282)] bg-[oklch(0.985_0_0)] px-2 py-1'>
                <p className='whitespace-pre text-[11px] leading-4 text-[oklch(0.205_0_0)]' style={{ opacity: frame.body }}>{BODY}</p>
                <div aria-hidden='true' className='pointer-events-none absolute inset-0' style={{ transform: `translateY(${frame.beam * 100}%)`, opacity: Math.sin(frame.beam * Math.PI) }}>
                  <div className='absolute inset-x-0 top-0 h-3 -translate-y-1/2 bg-gradient-to-b from-transparent via-[oklch(0.539_0.254_282/0.25)] to-transparent' />
                </div>
              </div>
              <div>
                {copy.fields.map((label, index) => (
                  <div key={label} className='grid h-4 grid-cols-[3.75rem_minmax(0,1fr)] items-baseline gap-1'>
                    <span className='truncate text-[11px] text-[oklch(0.556_0_0)]'>{label}</span>
                    <span className='min-w-0 truncate text-[11px] font-medium tabular-nums text-[oklch(0.145_0_0)]'>{values[index]}</span>
                  </div>
                ))}
              </div>
              <div className='mt-1.5 flex h-7 items-center'>
                <span
                  className='inline-flex h-6 items-center gap-1 rounded-full bg-[oklch(0.539_0.254_282/0.08)] px-2 text-[11px] font-medium text-[oklch(0.539_0.254_282)]'
                  style={{ opacity: frame.cat, transform: `scale(${0.9 + 0.1 * frame.cat})`, transformOrigin: 'left center' }}
                >
                  <ShoppingCart className='size-3 shrink-0' aria-hidden='true' />
                  {copy.category}
                </span>
              </div>
            </Panel>
          </div>

          <div className='row-start-4 min-h-0 min-w-0 sm:col-start-4 sm:row-start-1'>
            <Connector t={frame.fly2} elapsed={tl.elapsed} />
          </div>

          <div className='row-start-5 min-h-0 min-w-0 sm:col-start-5 sm:row-start-1'>
            <Panel kicker={copy.ledgerKicker} title={copy.ledger} hot={frame.land}>
              <div className='mb-1.5 shrink-0'>
                <div className='flex items-baseline justify-between gap-2'>
                  <span className='truncate text-[11px] text-[oklch(0.45_0_0)]'>{copy.spent}</span>
                  <span className='shrink-0 text-[11px] text-[oklch(0.556_0_0)]'>{copy.month}</span>
                </div>
                <p className='text-sm font-semibold tabular-nums leading-5 text-[oklch(0.145_0_0)]'>{formatDop(frame.month, lang, 0)}</p>
                <div className='mt-1 flex items-baseline justify-between gap-2'>
                  <span className='truncate text-[11px] text-[oklch(0.45_0_0)]'>{copy.market}</span>
                  <span className='shrink-0 text-[11px] tabular-nums text-[oklch(0.45_0_0)]'>{formatDop(frame.market, lang, 0)}</span>
                </div>
                <div className='mt-1 h-1.5 overflow-hidden rounded-full bg-[oklch(0.965_0.01_282)]'>
                  <div className='h-full rounded-full bg-[oklch(0.539_0.254_282)]' style={{ width: `${Math.max(0, Math.min(100, (frame.market / MARKET) * 100))}%` }} />
                </div>
              </div>
              <ul className='relative overflow-hidden' style={{ height: ROW * SLOTS }} aria-label={copy.ledger}>
                {LEDGER.map((row, index) => {
                  const tx = TRANSACTIONS.find(item => item.id === row.id)
                  const y = (index - 1 + frame.land) * ROW
                  const Icon = row.icon
                  return (
                    <li
                      key={row.id}
                      className='absolute inset-x-0 top-0'
                      style={{ height: ROW, transform: `translateY(${y}px)`, opacity: row.fresh ? frame.land : 1 }}
                      aria-hidden={row.fresh && frame.land < 0.25 ? true : undefined}
                    >
                      <div
                        className='flex h-full min-w-0 items-center justify-between gap-1.5 rounded-md px-1'
                        style={{ backgroundColor: row.fresh ? `oklch(0.539 0.254 282 / ${0.12 * frame.land})` : undefined }}
                      >
                        <div className='flex min-w-0 flex-1 items-center gap-1.5'>
                          <span className={`flex size-6 shrink-0 items-center justify-center rounded-md ${row.fresh ? 'bg-[oklch(0.539_0.254_282/0.08)] text-[oklch(0.539_0.254_282)]' : 'bg-[oklch(0.965_0.01_282)] text-[oklch(0.45_0_0)]'}`}>
                            <Icon className='size-3.5' aria-hidden='true' />
                          </span>
                          <span className='min-w-0 flex-1'>
                            <span className='block truncate text-xs font-medium text-[oklch(0.205_0_0)]'>{tx?.merchant}</span>
                            <span className='flex items-baseline justify-between gap-1'>
                              <span className='min-w-0 truncate text-[11px] text-[oklch(0.45_0_0)]'>{catName(tx?.category ?? 'supermarkets', copy.cats)}</span>
                              <span className='shrink-0 text-[11px] font-semibold tabular-nums text-rose-700 sm:text-xs'>{formatDop(tx?.amount ?? 0, lang)}</span>
                            </span>
                          </span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </SceneFrame>
  )
}
