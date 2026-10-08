'use client'

import { Check } from 'lucide-react'
import { useId } from 'react'
import { SCENE_LABELS, SceneFrame, easeOut, span, useSceneTimeline } from '../kit/scene'
import './alert-lanes-scene.css'

/* Blog lane minutes (fast 4 and 16, slow 36 and 62), fixed paces, ~10.5s plus hold. */
const MS_PER_MIN = 150
const SWIPE_MS = 1200
const MAX_MINUTE = 62
const TRAVEL_MS = MAX_MINUTE * MS_PER_MIN
const DURATION = SWIPE_MS + TRAVEL_MS
const ROW = '3rem'

const BANKS = [
  { id: 'scotiabank', mark: 'SB', delay: 62 },
  { id: 'bhd', mark: 'BHD', delay: 36 },
  { id: 'banreservas', mark: 'BR', delay: 16 },
  { id: 'popular', mark: 'BP', delay: 4 }
] as const

type Id = (typeof BANKS)[number]['id']
type Lang = 'en' | 'es'
type Pt = { x: number; y: number }
type Box = { x: number; y: number; w: number; h: number }
type Geom = {
  viewBox: string
  origin: Pt
  card: Box
  inbox: Box
  plug: 'right' | 'down'
  badgeR: number
  markSize: number
  labelSize: number
  countSize: number
  lanes: Record<Id, { control: Pt; end: Pt }>
}
type Lane = { id: Id; delay: number; progress: number; arrived: boolean }
type FeedEntry = { id: Id; arrived: boolean; order: number | null }
type Frame = { minute: number; lanes: Lane[]; feed: FeedEntry[] }

const DESKTOP: Geom = {
  viewBox: '0 0 400 280',
  origin: { x: 102, y: 140 },
  card: { x: 16, y: 102, w: 86, h: 76 },
  inbox: { x: 328, y: 36, w: 60, h: 208 },
  plug: 'right',
  badgeR: 15,
  markSize: 13,
  labelSize: 13,
  countSize: 18,
  lanes: {
    scotiabank: { control: { x: 186, y: 36 }, end: { x: 284, y: 62 } },
    bhd: { control: { x: 214, y: 92 }, end: { x: 296, y: 114 } },
    banreservas: { control: { x: 214, y: 188 }, end: { x: 296, y: 166 } },
    popular: { control: { x: 186, y: 246 }, end: { x: 284, y: 218 } }
  }
}

const MOBILE: Geom = {
  viewBox: '0 0 320 460',
  origin: { x: 160, y: 82 },
  card: { x: 114, y: 10, w: 92, h: 72 },
  inbox: { x: 18, y: 400, w: 284, h: 48 },
  plug: 'down',
  badgeR: 18,
  markSize: 15,
  labelSize: 15,
  countSize: 16,
  lanes: {
    scotiabank: { control: { x: 40, y: 188 }, end: { x: 48, y: 340 } },
    bhd: { control: { x: 104, y: 220 }, end: { x: 120, y: 354 } },
    banreservas: { control: { x: 216, y: 220 }, end: { x: 200, y: 354 } },
    popular: { control: { x: 280, y: 188 }, end: { x: 272, y: 340 } }
  }
}

function laneProgress (minute: number, delayMinutes: number): number {
  if (!Number.isFinite(delayMinutes) || delayMinutes <= 0) return 1
  if (!Number.isFinite(minute) || minute <= 0) return 0
  return Math.min(1, minute / delayMinutes)
}

function lanePoint (origin: Pt, control: Pt, end: Pt, progress: number): Pt {
  const t = laneProgress(progress, 1)
  const inverse = 1 - t
  return {
    x: inverse * inverse * origin.x + 2 * inverse * t * control.x + t * t * end.x,
    y: inverse * inverse * origin.y + 2 * inverse * t * control.y + t * t * end.y
  }
}

function pathsFor (geom: Geom): string[] {
  return BANKS.map(bank => {
    const lane = geom.lanes[bank.id]
    return `M ${geom.origin.x} ${geom.origin.y} Q ${lane.control.x} ${lane.control.y} ${lane.end.x} ${lane.end.y}`
  })
}

const DESKTOP_PATHS = pathsFor(DESKTOP)
const MOBILE_PATHS = pathsFor(MOBILE)

function displayedMinute (minute: number): number {
  if (!Number.isFinite(minute) || minute <= 0) return 0
  return Math.min(MAX_MINUTE, Math.floor(minute + 1e-4))
}

function feedAt (minute: number): FeedEntry[] {
  const safe = Number.isFinite(minute) ? Math.max(0, minute) : 0
  const arrived = BANKS.filter(bank => bank.delay <= safe + 0.001).slice().sort((a, b) => a.delay - b.delay)
  const pending = BANKS.filter(bank => bank.delay > safe + 0.001)
  return [
    ...arrived.map((bank, index) => ({ id: bank.id, arrived: true as const, order: index + 1 })),
    ...pending.map(bank => ({ id: bank.id, arrived: false as const, order: null }))
  ]
}

function frameAt (elapsedMs: number): Frame {
  const safe = Number.isFinite(elapsedMs) ? Math.max(0, Math.min(DURATION, elapsedMs)) : DURATION
  const minute = Math.max(0, Math.min(TRAVEL_MS, safe - SWIPE_MS)) / MS_PER_MIN
  const lanes = BANKS.map(bank => {
    const progress = safe < SWIPE_MS ? 0 : laneProgress(minute, bank.delay)
    return { id: bank.id, delay: bank.delay, progress, arrived: progress >= 1 }
  })
  return { minute, lanes, feed: feedAt(minute) }
}

const COPY = {
  en: {
    kicker: 'Alert lanes',
    title: 'One swipe, four clocks',
    clock: 't = {minutes} min',
    inbox: 'Inbox',
    feedTitle: 'Viollet feed',
    illustrative: 'Illustrative',
    arrived: 'Arrived',
    pending: 'On the way',
    banks: { scotiabank: 'Scotiabank', bhd: 'Banco BHD', banreservas: 'Banreservas', popular: 'Banco Popular' },
    launch: 'A card swipe at the register opens four bank lanes at the same moment. The envelopes head for the inbox on different clocks. The minutes are illustrative, not a measurement.',
    partial: '{bank} reached the inbox at {minutes} min and the feed pulled that row up. The remaining lanes are still moving. The minutes are illustrative, not a measurement.',
    done: 'All four alerts sit in the Viollet feed, reordered by arrival. Banco Popular was first at 4 min and Scotiabank last at 62 min. The minutes are illustrative, not a measurement.'
  },
  es: {
    kicker: 'Carriles de alertas',
    title: 'Un pase, cuatro relojes',
    clock: 't = {minutes} min',
    inbox: 'Buzón',
    feedTitle: 'Feed de Viollet',
    illustrative: 'Ilustrativo',
    arrived: 'Llegó',
    pending: 'En camino',
    banks: { scotiabank: 'Scotiabank', bhd: 'Banco BHD', banreservas: 'Banreservas', popular: 'Banco Popular' },
    launch: 'Un pase de tarjeta en el punto de venta abre cuatro carriles a la vez. Los sobres van al buzón con relojes distintos. Los minutos son ilustrativos, no una medición.',
    partial: '{bank} llegó al buzón a los {minutes} min y el feed subió su fila. Los otros carriles siguen en camino. Los minutos son ilustrativos, no una medición.',
    done: 'Las cuatro alertas ya están en el feed de Viollet, en orden de llegada. Banco Popular entró primero, a los 4 min, y Scotiabank de último, a los 62 min. Los minutos son ilustrativos, no una medición.'
  }
} as const

type Copy = (typeof COPY)[Lang]

function ClockMinutes ({ template, minutes }: { template: string; minutes: number }) {
  const [before, after = ''] = template.split('{minutes}')
  return (
    <>
      {before}
      <span className='inline-block w-[2ch] text-left tabular-nums'>{String(minutes).padStart(2, '0')}</span>
      {after}
    </>
  )
}

function BankBadge ({ mark, arrived }: { mark: string; arrived: boolean }) {
  return (
    <span
      aria-hidden='true'
      className={`flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full border text-[11px] font-bold leading-none tracking-tight ${
        arrived ? 'border-emerald-400/40 bg-emerald-400/15 text-emerald-200' : 'border-slate-700/60 bg-slate-800 text-teal-200'
      }`}
    >
      {mark}
    </span>
  )
}

function captionFor (copy: Copy, frame: Frame): string {
  const arrived = frame.lanes.filter(lane => lane.arrived)
  if (arrived.length === 0) return copy.launch
  if (arrived.length === BANKS.length) return copy.done
  const latest = arrived.reduce((best, lane) => (lane.delay > best.delay ? lane : best))
  return copy.partial.replace('{bank}', copy.banks[latest.id]).replace('{minutes}', String(latest.delay))
}

function LaneDiagram ({
  geom,
  paths,
  frame,
  swipe,
  copy,
  reduced
}: {
  geom: Geom
  paths: readonly string[]
  frame: Frame
  swipe: number
  copy: Copy
  reduced: boolean
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const { card, inbox, origin } = geom
  const down = geom.plug === 'down'
  const count = frame.lanes.filter(lane => lane.arrived).length
  const cx = inbox.x + inbox.w / 2
  const cy = inbox.y + inbox.h / 2
  const env = down ? { x: cx - 56, y: cy } : { x: cx, y: cy - 30 }
  const countAt = down ? { x: cx - 4, y: cy } : { x: cx, y: cy + 4 }
  const labelAt = down ? { x: cx + 50, y: cy } : { x: cx, y: cy + 28 }
  const sheenX = card.x - 20 + swipe * (card.w + 36)

  return (
    <svg viewBox={geom.viewBox} className='block h-auto w-full' aria-hidden='true'>
      <defs>
        <clipPath id={`alert-card-${uid}`}>
          <rect x={card.x} y={card.y} width={card.w} height={card.h} rx={10} />
        </clipPath>
        <filter id={`alert-glow-${uid}`} x='-60%' y='-60%' width='220%' height='220%'>
          <feDropShadow dx='0' dy='0' stdDeviation='2.2' floodColor='#5eead4' floodOpacity='0.9' />
        </filter>
      </defs>
      {BANKS.map((bank, index) => {
        const state = frame.lanes[index]
        const spec = geom.lanes[bank.id]
        const moving = state.progress > 0 && !state.arrived
        const dash = moving && !reduced
        const from = down ? { x: spec.end.x, y: spec.end.y + geom.badgeR } : { x: spec.end.x + geom.badgeR, y: spec.end.y }
        const to = down ? { x: spec.end.x, y: inbox.y } : { x: inbox.x, y: spec.end.y }
        return (
          <g key={bank.id}>
            <path d={paths[index]} fill='none' className='stroke-slate-800' strokeWidth={8} strokeLinecap='round' />
            <path d={paths[index]} fill='none' className='stroke-slate-600' strokeWidth={1.6} strokeLinecap='round' />
            <path
              d={paths[index]}
              fill='none'
              strokeLinecap='round'
              strokeWidth={dash ? 2.4 : 1.8}
              strokeDasharray={dash ? '5 7' : undefined}
              strokeOpacity={state.arrived ? 0.8 : moving ? 1 : swipe * 0.45}
              className={`stroke-teal-300 ${dash ? 'alert-lanes-dash' : ''}`}
            />
            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} strokeWidth={1.6} strokeLinecap='round' className={state.arrived ? 'stroke-emerald-400' : 'stroke-slate-600'} />
          </g>
        )
      })}
      <rect x={card.x} y={card.y} width={card.w} height={card.h} rx={10} strokeWidth={1.6} className={swipe > 0.85 ? 'fill-slate-900 stroke-teal-300' : 'fill-slate-900 stroke-slate-600'} />
      <rect x={card.x + 12} y={card.y + 16} width={24} height={16} rx={2} className='fill-teal-300' />
      {[7, 11, 15].map(radius => (
        <path key={radius} d={`M ${card.x + card.w - 22} ${card.y + 24 - radius} A ${radius} ${radius} 0 0 1 ${card.x + card.w - 22} ${card.y + 24 + radius}`} fill='none' className='stroke-teal-300/80' strokeWidth={1.4} />
      ))}
      <text x={card.x + card.w / 2} y={card.y + card.h - 16} textAnchor='middle' fontSize={geom.labelSize} fontWeight={600} className='fill-slate-200'>t = 0</text>
      <g clipPath={`url(#alert-card-${uid})`}>
        <rect x={sheenX} y={card.y - 8} width={12} height={card.h + 16} className='fill-teal-200/45' />
      </g>
      <rect x={inbox.x} y={inbox.y} width={inbox.w} height={inbox.h} rx={10} strokeWidth={1.6} className={count === BANKS.length ? 'fill-slate-900 stroke-emerald-400' : count > 0 ? 'fill-slate-900 stroke-teal-300' : 'fill-slate-900 stroke-slate-600'} />
      <g transform={`translate(${env.x} ${env.y})`}>
        <rect x={-11} y={-8} width={22} height={16} rx={2} className='fill-slate-950 stroke-teal-300' strokeWidth={1.4} />
        <path d='M -11 -8 L 0 3 L 11 -8' fill='none' className='stroke-teal-300' strokeWidth={1.4} />
      </g>
      <text x={countAt.x} y={countAt.y} textAnchor='middle' dominantBaseline='central' fontSize={geom.countSize} fontWeight={700} className='fill-slate-100 tabular-nums'>{String(count).padStart(2, '0')}</text>
      <text x={labelAt.x} y={labelAt.y} textAnchor='middle' dominantBaseline='central' fontSize={geom.labelSize} className='fill-slate-400'>{copy.inbox}</text>
      <circle cx={origin.x} cy={origin.y} r={4} className='fill-teal-300' />
      {BANKS.map((bank, index) => {
        const state = frame.lanes[index]
        const spec = geom.lanes[bank.id]
        const moving = state.progress > 0 && !state.arrived
        const point = lanePoint(origin, spec.control, spec.end, state.progress)
        const fade = !moving ? 0 : state.progress < 0.06 ? state.progress / 0.06 : state.progress > 0.88 ? (1 - state.progress) / 0.12 : 1
        return (
          <g key={bank.id}>
            {moving && !reduced && (
              <circle cx={spec.end.x} cy={spec.end.y} r={geom.badgeR + 5} fill='none' className='alert-lanes-pulse stroke-teal-300' strokeWidth={1.5} />
            )}
            <circle
              cx={spec.end.x}
              cy={spec.end.y}
              r={geom.badgeR}
              strokeWidth={state.arrived && frame.minute - state.delay < 1.4 ? 2.4 : 1.5}
              className={state.arrived ? 'fill-emerald-400/15 stroke-emerald-400' : moving ? 'fill-teal-400/10 stroke-teal-300' : 'fill-slate-800 stroke-slate-600'}
            />
            <text x={spec.end.x} y={spec.end.y} textAnchor='middle' dominantBaseline='central' fontSize={bank.mark.length > 2 ? geom.markSize - 3 : geom.markSize} fontWeight={700} className={state.arrived ? 'fill-emerald-200' : 'fill-teal-200'}>
              {bank.mark}
            </text>
            {fade > 0 && [4, 3, 2, 1].map(step => {
              const behind = state.progress - step * 0.055
              if (behind <= 0.02) return null
              const trail = lanePoint(origin, spec.control, spec.end, behind)
              return <circle key={step} cx={trail.x} cy={trail.y} r={3.4 - step * 0.45} className='fill-teal-300' opacity={fade * (0.14 + (4 - step) * 0.08)} />
            })}
            {fade > 0 && (
              <g transform={`translate(${point.x} ${point.y})`} opacity={fade} filter={`url(#alert-glow-${uid})`}>
                <rect x={-10} y={-7} width={20} height={14} rx={2} className='fill-slate-950 stroke-teal-300' strokeWidth={1.4} />
                <path d='M -10 -7 L 0 2.5 L 10 -7' fill='none' className='stroke-teal-300' strokeWidth={1.4} />
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function Feed ({ copy, frame }: { copy: Copy; frame: Frame }) {
  return (
    <div className='min-w-0 rounded-lg border border-slate-700/60 bg-slate-900 p-3'>
      <div className='flex h-6 items-center justify-between gap-2'>
        <p className='text-[11px] font-medium uppercase tracking-wide text-teal-200/80'>{copy.feedTitle}</p>
        <p className='text-[11px] text-slate-500'>{copy.illustrative}</p>
      </div>
      <ol className='sr-only' aria-label={`${copy.feedTitle}. ${copy.illustrative}`}>
        {frame.feed.map(entry => (
          <li key={entry.id}>
            {entry.order ? `${entry.order}. ` : ''}
            {copy.banks[entry.id]}. {entry.arrived ? copy.arrived : copy.pending}. {BANKS.find(bank => bank.id === entry.id)?.delay} min.
          </li>
        ))}
      </ol>
      <ol aria-hidden='true' className='relative mt-2' style={{ height: `calc(${ROW} * ${BANKS.length})` }}>
        {BANKS.map(bank => {
          const slot = Math.max(0, frame.feed.findIndex(entry => entry.id === bank.id))
          const entry = frame.feed[slot]
          const minute = String(bank.delay).padStart(2, '0')
          return (
            <li
              key={bank.id}
              className={`absolute inset-x-0 top-0 flex h-12 items-center gap-2 border-b border-slate-700/60 bg-slate-900 px-1 text-sm transition-transform duration-500 ease-out motion-reduce:transition-none ${entry?.arrived ? 'text-slate-100 shadow-[inset_2px_0_0_rgba(52,211,153,0.75)]' : 'text-slate-400'}`}
              style={{ transform: `translateY(calc(${ROW} * ${slot}))`, zIndex: entry?.arrived ? 2 : 1 }}
            >
              <span className='inline-block w-4 shrink-0 text-center font-mono text-xs tabular-nums'>{entry?.order ? entry.order : '·'}</span>
              <BankBadge mark={bank.mark} arrived={Boolean(entry?.arrived)} />
              <span className='min-w-0 flex-1 truncate'>{copy.banks[bank.id]}</span>
              <span className='grid w-14 shrink-0 text-right font-mono text-[11px] leading-none tabular-nums text-slate-400'>
                <span className={entry?.arrived ? '' : 'invisible'}>{minute} min</span>
                <span className={`col-start-1 row-start-1 ${entry?.arrived ? 'invisible' : ''}`}>·· min</span>
              </span>
              <span className='flex size-4 shrink-0 items-center justify-center'>
                <Check className={`size-3.5 text-emerald-300 ${entry?.arrived ? 'opacity-100' : 'opacity-0'}`} aria-hidden='true' />
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default function AlertLanesScene ({ lang }: { lang: Lang }) {
  const timeline = useSceneTimeline(DURATION, { loop: true, hold: 3000 })
  const copy = COPY[lang]
  const frame = frameAt(timeline.elapsed)
  const swipe = span(timeline.elapsed, 0, SWIPE_MS, easeOut)
  const diagram = { frame, swipe, copy, reduced: timeline.reduced }

  return (
    <SceneFrame
      timeline={timeline}
      labels={SCENE_LABELS[lang]}
      kicker={copy.kicker}
      title={copy.title}
      caption={<span className='block min-h-[8rem] sm:min-h-[5.5rem]'>{captionFor(copy, frame)}</span>}
    >
      <div className='min-w-0 p-3 lg:p-4'>
        <p className='mb-2 h-7 whitespace-pre font-mono text-sm leading-7 text-slate-200' aria-hidden='true'>
          <ClockMinutes template={copy.clock} minutes={displayedMinute(frame.minute)} />
        </p>
        <div className='grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center'>
          <div className='min-w-0'>
            <div className='mx-auto w-full max-w-[22rem] sm:hidden'>
              <LaneDiagram geom={MOBILE} paths={MOBILE_PATHS} {...diagram} />
            </div>
            <div className='mx-auto hidden w-full max-w-[34rem] sm:block'>
              <LaneDiagram geom={DESKTOP} paths={DESKTOP_PATHS} {...diagram} />
            </div>
          </div>
          <Feed copy={copy} frame={frame} />
        </div>
      </div>
    </SceneFrame>
  )
}
