'use client'

import { CheckCircle2, Clock } from 'lucide-react'
import type { ViolletSyncCopy } from '@/types/case-study-types'
import { linear, span, useSceneTimeline } from '../kit/scene'
import { L, LC } from './light'
import { AppSurface, InteractivePanel } from './ui'

const DURATION = 12000
const STAGES = [
  { action: 'connect', state: 'connected', start: 0, end: 1800 },
  { action: 'watch', state: 'watching', start: 1800, end: 3600 },
  { action: 'push', state: 'ingested', start: 3600, end: 7600 },
  { action: 'replay', state: 'deduped', start: 8200, end: DURATION }
] as const

function routePoint (progress: number) {
  const second = progress > 0.5
  const t = second ? (progress - 0.5) * 2 : progress * 2
  const start = second ? 300 : 90
  return {
    x: start + 210 * t,
    y: 140 + (second ? 1 : -1) * 120 * t * (1 - t)
  }
}

function Envelope ({ x, y, opacity = 1 }: { x: number, y: number, opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <rect x={-23} y={-16} width={46} height={32} rx={5} fill={LC.card} stroke={LC.primary} strokeWidth={1.8} />
      <path d='M -22 -14 L 0 2 L 22 -14' fill='none' stroke={LC.primary} strokeWidth={1.5} />
      <circle cx={15} cy={12} r={11} fill={LC.card} stroke={LC.border} />
      <image href='/case-studies/viollet/banks/banreservas.svg' x={7} y={4} width={16} height={16} />
    </g>
  )
}

export default function GmailSync ({ copy }: { copy: ViolletSyncCopy }) {
  const timeline = useSceneTimeline(DURATION, { loop: true, hold: 3400 })
  const elapsed = timeline.elapsed
  const watching = elapsed >= 1800
  const ingested = elapsed >= 7600
  const deduped = elapsed >= 10800
  const state = deduped ? 'deduped' : ingested ? 'ingested' : watching ? 'watching' : 'connected'
  const delivery = span(elapsed, 3600, 7600, linear)
  const resend = span(elapsed, 8200, 10800, linear)
  const bounce = span(elapsed, 10800, 11600, linear)
  const point = routePoint(delivery)
  const duplicate = routePoint(resend)
  const lines = STAGES.flatMap(stage => copy.lines[stage.action].map((line, index, group) => ({
    line,
    at: stage.start + (stage.end - stage.start) * index / Math.max(1, group.length)
  })))

  return (
    <InteractivePanel label='Gmail → Viollet' title='Gmail → Viollet' description={copy.stateLabel} timeline={timeline}>
      <AppSurface route='viollet.app / Gmail'>
        <div className={`flex items-center justify-between gap-3 border-b pb-3 ${L.border}`}>
          <span className={`text-xs font-medium ${L.muted}`}>{copy.stateLabel}</span>
          <div className='grid min-w-0 text-right text-xs font-medium text-emerald-700' aria-live='polite'>
            {STAGES.map(stage => (
              <span key={stage.state} className={`col-start-1 row-start-1 ${state === stage.state ? '' : 'invisible'}`}>
                {copy.states[stage.state]}
              </span>
            ))}
          </div>
        </div>

        <svg viewBox='0 0 600 280' className='block h-auto w-full' role='img' aria-label={`Gmail → Pub/Sub → Viollet webhook. ${copy.states[state]}`}>
          {['M 90 140 Q 195 80 300 140', 'M 300 140 Q 405 200 510 140'].map((path, index) => (
            <g key={path}>
              <path d={path} fill='none' stroke={LC.primarySoft} strokeWidth={9} strokeLinecap='round' />
              <path d={path} fill='none' stroke={LC.wire} strokeWidth={1.5} />
              <path d={path} fill='none' stroke={LC.primary} strokeWidth={2} pathLength={1} strokeDasharray='1' strokeDashoffset={1 - Math.min(1, Math.max(0, delivery * 2 - index))} />
            </g>
          ))}
          {[90, 300, 510].map((x, index) => (
            <g key={x}>
              <rect x={x - 39} y={101} width={78} height={78} rx={18} fill={LC.card} stroke={index === 0 || (index === 1 ? delivery >= 0.5 : ingested) ? LC.primary : LC.wire} strokeWidth={1.8} />
              {index === 0 ? (
                <image href='/case-studies/viollet/gmail.png' x={x - 23} y={117} width={46} height={46} preserveAspectRatio='xMidYMid meet' />
              ) : index === 1 ? (
                <g fill={LC.primary} stroke={LC.primary} strokeWidth={2}>
                  <path d={`M ${x - 18} 128 L ${x} 140 L ${x + 18} 128 M ${x} 140 V 158`} fill='none' />
                  <circle cx={x - 18} cy={128} r={5} /><circle cx={x + 18} cy={128} r={5} /><circle cx={x} cy={158} r={5} />
                </g>
              ) : (
                <text x={x} y={150} textAnchor='middle' fontSize={30} fontWeight={700} fill={LC.primary}>V</text>
              )}
              <text x={x} y={207} textAnchor='middle' fontSize={14} fontWeight={600} fill={LC.fg}>{['Gmail', 'Pub/Sub', 'Viollet'][index]}</text>
              {index === 2 && <text x={x} y={225} textAnchor='middle' fontSize={11} fill={LC.muted}>/api/gmail/webhook</text>}
            </g>
          ))}
          <g opacity={watching ? 1 : 0.25}>
            <circle cx={90} cy={54} r={18} fill={LC.card} stroke={LC.primary} strokeWidth={1.5} />
            <path d='M 90 41 V 54 L 98 58' fill='none' stroke={LC.primary} strokeWidth={2} strokeLinecap='round' transform={`rotate(${watching ? span(elapsed, 1800, DURATION, linear) * 360 : 0} 90 54)`} />
            <path d='M 90 73 V 100' stroke={LC.wire} strokeDasharray='3 4' />
            <text x={118} y={58} fontSize={12} fill={LC.muted}>users.watch ↻</text>
          </g>
          {elapsed < 7600 && <Envelope x={point.x} y={point.y} />}
          {elapsed >= 8200 && elapsed < 11600 && (
            <Envelope x={duplicate.x - bounce * 55} y={duplicate.y - Math.sin(bounce * Math.PI / 2) * 40} opacity={1 - bounce * 0.8} />
          )}
          <g opacity={deduped ? 1 : 0}>
            <circle cx={548} cy={105} r={14} fill='#ecfdf5' stroke='#059669' />
            <path d='M 542 105 L 546 109 L 554 101' fill='none' stroke='#047857' strokeWidth={2} strokeLinecap='round' />
          </g>
        </svg>

        <div className={`grid gap-2 rounded-lg border p-3 ${L.border} ${L.secondary}`}>
          <p className={`flex items-center gap-2 text-xs ${L.muted} ${watching ? '' : 'invisible'}`}><Clock className='size-3.5' aria-hidden='true' />{copy.states.watching}</p>
          <div className='grid text-sm' aria-live='polite'>
            <div className={`col-start-1 row-start-1 flex items-center gap-3 ${ingested ? '' : 'invisible'}`}>
              <svg viewBox='0 0 32 32' className='size-8 shrink-0' aria-hidden='true'><image href='/case-studies/viollet/banks/banreservas.svg' width={32} height={32} /></svg>
              <span className='min-w-0 flex-1'>Banreservas <span className={L.muted}>· gmailMessageId</span></span>
              <span className={`shrink-0 font-mono ${L.primaryText}`}>01</span>
            </div>
          </div>
          <div className='grid text-xs font-medium text-emerald-700' aria-live='polite'>
            {[copy.states.ingested, copy.states.deduped].map((label, index) => (
              <span key={label} className={`col-start-1 row-start-1 ${ingested && (index === 1 ? deduped : !deduped) ? '' : 'invisible'}`}>{label}</span>
            ))}
          </div>
        </div>

        <div className={`mt-4 overflow-hidden rounded-lg border ${L.border} bg-white`}>
          <p className={`border-b px-3 py-2 text-xs font-medium ${L.border} ${L.muted}`}>{copy.logLabel}</p>
          <ol className='space-y-1 p-3' aria-label={copy.logLabel} aria-live='polite' aria-relevant='additions text'>
            {lines.map(({ line, at }, index) => (
              <li key={`${index}-${at}`} className={`flex items-start gap-2 text-xs leading-5 ${elapsed >= at ? '' : 'invisible'}`}>
                <CheckCircle2 className='mt-1 size-3 shrink-0 text-emerald-600' aria-hidden='true' />
                <span className={`min-w-0 break-words ${L.mono} ${L.fg2}`}>{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </AppSurface>
    </InteractivePanel>
  )
}
