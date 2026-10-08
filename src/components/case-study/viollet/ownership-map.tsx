'use client'

import type { ViolletOwnershipCopy } from '@/types/case-study-types'
import { easeInOut, useSceneTimeline } from '../kit/scene'
import { L, LC } from './light'
import { AppSurface, InteractivePanel } from './ui'

const STOP_MS = 2800
const TRAVEL_MS = 850
const ROW = 96

function stopPoint (index: number) {
  return { x: index % 2 === 0 ? 20 : 44, y: index * ROW + ROW / 2 }
}

/** The same cubic geometry drives the route and its traveling dots. */
function routePoint (index: number, progress: number) {
  const start = stopPoint(index)
  const end = stopPoint(index + 1)
  const middle = (start.y + end.y) / 2
  const t = easeInOut(progress)
  const inverse = 1 - t
  return {
    x: inverse ** 3 * start.x + 3 * inverse ** 2 * t * start.x + 3 * inverse * t ** 2 * end.x + t ** 3 * end.x,
    y: inverse ** 3 * start.y + 3 * inverse ** 2 * t * middle + 3 * inverse * t ** 2 * middle + t ** 3 * end.y
  }
}

export default function OwnershipMap ({ copy }: { copy: ViolletOwnershipCopy }) {
  const timeline = useSceneTimeline(Math.max(1, copy.items.length) * STOP_MS, { loop: true, hold: 3200 })
  const active = Math.min(copy.items.length - 1, Math.floor(timeline.elapsed / STOP_MS))
  const travel = Math.max(0, Math.min(1, (timeline.elapsed % STOP_MS - (STOP_MS - TRAVEL_MS)) / TRAVEL_MS))
  const moving = active >= 0 && active < copy.items.length - 1 && travel > 0

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.description} timeline={timeline}>
      <AppSurface>
        <div className='grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center'>
          <div className='relative grid min-w-0 grid-cols-[4rem_minmax(0,1fr)]'>
            <svg
              viewBox={`0 0 64 ${Math.max(1, copy.items.length) * ROW}`}
              preserveAspectRatio='none'
              className='absolute inset-y-0 left-0 h-full w-16 overflow-visible'
              fill='none'
              aria-hidden='true'
            >
              {copy.items.slice(1).map((item, index) => {
                const start = stopPoint(index)
                const end = stopPoint(index + 1)
                const middle = (start.y + end.y) / 2
                const path = `M ${start.x} ${start.y} C ${start.x} ${middle}, ${end.x} ${middle}, ${end.x} ${end.y}`
                const progress = index < active ? 1 : index === active ? travel : 0
                return (
                  <g key={item.id}>
                    <path d={path} stroke={LC.wire} strokeWidth={2} />
                    <path d={path} stroke={LC.primary} strokeWidth={2.5} pathLength={1} strokeDasharray={`${progress} 1`} />
                  </g>
                )
              })}
              {copy.items.map((item, index) => {
                const point = stopPoint(index)
                return (
                  <g key={item.id}>
                    <circle cx={point.x} cy={point.y} r={14} fill={index === active ? LC.primarySoft : LC.canvas} />
                    <circle cx={point.x} cy={point.y} r={7} fill={index <= active ? LC.primary : LC.card} stroke={index <= active ? LC.primary : LC.wire} strokeWidth={2} />
                    <circle cx={point.x} cy={point.y} r={2} fill={LC.card} opacity={index <= active ? 1 : 0} />
                  </g>
                )
              })}
              {[0.16, 0.08, 0].map((lag, index) => {
                const point = routePoint(Math.max(0, active), Math.max(0, travel - lag))
                return <circle key={lag} cx={point.x} cy={point.y} r={index === 2 ? 5 : 3} fill={LC.primary} stroke={LC.card} strokeWidth={index === 2 ? 2 : 0} opacity={moving && travel > lag ? (index + 1) / 3 : 0} />
              })}
            </svg>
            <ol className='col-start-2 grid auto-rows-fr' aria-label={copy.listLabel}>
              {copy.items.map((item, index) => (
                <li
                  key={item.id}
                  aria-current={index === active ? 'step' : undefined}
                  className={`flex min-h-24 flex-col justify-center border-b py-4 pr-2 last:border-b-0 ${L.border}`}
                >
                  <h4 className={`text-sm font-semibold ${index <= active ? L.primaryText : L.muted}`}>{item.title}</h4>
                  <p className={`mt-1 text-xs leading-relaxed ${index <= active ? L.fg2 : L.subtle}`}>{item.summary}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className={`grid min-w-0 rounded-xl border ${L.border} ${L.secondary} p-4 sm:p-5`}>
            {copy.items.map((item, index) => (
              <article
                key={item.id}
                aria-hidden={index !== active}
                className={`col-start-1 row-start-1 min-w-0 ${index === active ? 'visible' : 'invisible'}`}
              >
                <h4 className={`text-lg font-semibold ${L.fg}`}>{item.title}</h4>
                <p className={`mt-2 text-sm leading-relaxed ${L.muted}`}>{item.summary}</p>
                <div className={`mt-6 border-l-2 ${L.primaryBorder} pl-4`}>
                  <h5 className={`text-xs font-semibold uppercase tracking-wide ${L.primaryText}`}>{copy.ownedLabel}</h5>
                  <p className={`mt-2 text-sm leading-relaxed ${L.fg2}`}>{item.owned}</p>
                </div>
                <div className={`mt-5 border-l-2 ${L.border} pl-4`}>
                  <h5 className={`text-xs font-semibold uppercase tracking-wide ${L.muted}`}>{copy.deferredLabel}</h5>
                  <p className={`mt-2 text-sm leading-relaxed ${L.muted}`}>{item.deferred}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </AppSurface>
    </InteractivePanel>
  )
}
