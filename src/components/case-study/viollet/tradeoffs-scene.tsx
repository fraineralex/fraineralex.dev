'use client'

import { easeOut, span, useSceneTimeline } from '../kit/scene'
import { L, LC } from './light'
import { AppSurface } from './ui'

type Item = { decision: string; rationale: string }
const STEP = 6200

// Labels are excerpts of the supplied copy, never additional product claims.
function excerpt (text: string, pattern: RegExp) {
  return text.match(pattern)?.[0] ?? ''
}

function comparison (item: Item, index: number) {
  const source = `${item.decision} ${item.rationale}`
  const patterns = [
    [/Email notifications|Notificaciones por correo/i, /bank APIs|APIs bancarias/i],
    [/Turso \+ Drizzle/i, /single monolithic worker|worker monolítico/i],
    [/AI-assisted categorization|Categorización asistida por IA/i, /Pure rules|reglas puras/i],
    [/Clerk/i, /session management|gestión de sesiones/i]
  ]
  const pair = patterns[index % patterns.length]
  return pair.map(pattern => excerpt(source, pattern))
}

function DecisionGlyph ({ index, alternative = false, progress = 0 }: { index: number; alternative?: boolean; progress?: number }) {
  return (
    <svg viewBox='0 0 96 72' className='h-20 w-28 max-w-full' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      {index === 0 ? alternative ? (
        <g><path d='M20 27 48 12 76 27H20ZM24 58h48M20 63h56M29 32v21m13-21v21m13-21v21m13-21v21' /></g>
      ) : (
        <g style={{ transform: `translateY(${-4 * Math.sin(progress * Math.PI)}px)` }}><rect x='18' y='20' width='60' height='38' rx='6' /><path d='m20 23 28 22 28-22m-56 32 18-16m38 16L58 39' /></g>
      ) : index === 1 ? (
        <g><ellipse cx='48' cy='22' rx='20' ry='8' /><path d='M28 22v28c0 11 40 11 40 0V22M28 36c0 11 40 11 40 0' />{!alternative && <><path d='M8 36h14m52 0h14' stroke={LC.wire} /><circle cx={8 + progress * 14} cy='36' r='3' fill={LC.primary} stroke='none' /><circle cx='86' cy='36' r='4' /></>}</g>
      ) : index === 2 ? (
        <g><path d='M20 24h34M20 36h28M20 48h34' /><circle cx='13' cy='24' r='2' /><circle cx='13' cy='36' r='2' /><circle cx='13' cy='48' r='2' />{!alternative && <path d='m72 17 4 14 13 5-13 5-4 14-5-14-13-5 13-5Z' style={{ transformOrigin: '72px 36px', transform: `scale(${0.8 + progress * 0.2})` }} />}</g>
      ) : (
        <g><rect x='27' y='31' width='42' height='30' rx='7' /><path d='M35 31V23a13 13 0 0 1 26 0v8' /><circle cx='48' cy='44' r='3' /><path d='M48 47v6' />{!alternative && <path d='m73 45 5 5 10-12' strokeDasharray='24' strokeDashoffset={24 * (1 - progress)} />}</g>
      )}
    </svg>
  )
}

export default function TradeoffsScene ({ items, lang }: { items: Item[], lang: 'es' | 'en' }) {
  void lang
  const timeline = useSceneTimeline(Math.max(1, items.length) * STEP, { loop: true, hold: 3200 })
  const active = Math.min(items.length - 1, Math.floor(timeline.elapsed / STEP))
  const local = timeline.elapsed - active * STEP
  const chosen = span(local, 900, 2500, easeOut)

  return (
    <div ref={timeline.ref} data-scene='tradeoffs' className='min-w-0'>
      <AppSurface route='viollet.app'>
        <div className='flex items-center gap-2 pb-3' aria-hidden='true'>
          {items.map((item, index) => (
            <span key={item.decision} className={`h-1 flex-1 overflow-hidden rounded-full ${L.secondary}`}>
              <span className={`block h-full origin-left ${L.primaryBg}`} style={{ transform: `scaleX(${index < active ? 1 : index === active ? span(local, 0, STEP) : 0})` }} />
            </span>
          ))}
        </div>
        {/* Stacked, in-flow comparisons reserve the tallest copy at every width. */}
        <div className='grid'>
          {items.map((item, index) => {
            const visible = index === active
            const labels = comparison(item, index)
            return (
              <div key={item.decision} className='col-start-1 row-start-1 min-w-0' style={{ visibility: visible ? 'visible' : 'hidden' }} aria-hidden={!visible}>
                <div className='flex items-start gap-3 pb-4'>
                  <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-xs tabular-nums ${L.primaryTint} ${L.primaryText}`}>{String(index + 1).padStart(2, '0')}</span>
                  <h3 className={`text-sm font-semibold leading-6 ${L.fg}`}>{item.decision}</h3>
                </div>
                <div className={`relative overflow-hidden rounded-xl border ${L.border}`}>
                  <div className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 ${L.primaryTint}`} style={{ opacity: chosen }} />
                  <div className={`relative grid grid-cols-2 divide-x ${L.divide}`}>
                    {labels.map((label, side) => (
                      <div key={side} className='flex min-w-0 flex-col items-center gap-2 px-2 py-5 text-center sm:px-4' style={{ color: side === 0 ? LC.primary : LC.muted, opacity: side === 1 ? 1 - chosen * 0.45 : 1 }}>
                        <DecisionGlyph index={index} alternative={side === 1} progress={chosen} />
                        <span className='min-h-12 text-xs font-medium leading-5 sm:text-sm'>{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className='absolute inset-x-[25%] bottom-3 h-px' style={{ background: LC.wire }} aria-hidden='true'>
                    <span className='absolute -top-1 size-2 rounded-full' style={{ left: `${100 - chosen * 100}%`, transform: 'translateX(-50%)', background: LC.primary, boxShadow: `0 0 0 ${chosen * 4}px ${LC.primarySoft}` }} />
                  </div>
                </div>
                <p className={`py-4 text-sm leading-relaxed ${L.muted}`} style={{ textWrap: 'pretty' }}>{item.rationale}</p>
              </div>
            )
          })}
        </div>
        <ol className={`divide-y overflow-hidden rounded-lg border ${L.border} ${L.divide}`}>
          {items.map((item, index) => {
            const complete = index < active || (index === active && chosen === 1)
            return (
              <li key={item.decision} className={`flex min-h-12 items-center gap-3 px-3 py-2 text-xs ${complete ? L.primaryTint : L.secondary}`}>
                <span className={`shrink-0 tabular-nums ${L.muted}`}>{String(index + 1).padStart(2, '0')}</span>
                <span className={`min-w-0 flex-1 ${complete ? L.primaryText : L.muted}`}>{item.decision}</span>
                <svg viewBox='0 0 20 20' className={`size-4 shrink-0 ${L.primaryText}`} fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
                  <circle cx='10' cy='10' r='8' opacity={complete ? 0.2 : 0.5} />
                  <path d='m6 10 3 3 5-6' strokeDasharray='14' strokeDashoffset={complete ? 0 : 14} />
                </svg>
              </li>
            )
          })}
        </ol>
        <ul className='sr-only'>
          {items.map(item => <li key={item.decision}>{item.decision}. {item.rationale}</li>)}
        </ul>
      </AppSurface>
    </div>
  )
}
