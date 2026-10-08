'use client'

import type { ViolletArchitectureCopy } from '@/types/case-study-types'
import { useSceneTimeline } from '../kit/scene'
import { L, LC } from './light'
import { AppSurface, InteractivePanel } from './ui'

const LINKS: Record<string, string[]> = {
  gmail: ['pubsub'],
  pubsub: ['gmail', 'next'],
  next: ['pubsub', 'clerk', 'vercel', 'ai', 'turso'],
  clerk: ['next'],
  vercel: ['next', 'ai'],
  ai: ['next', 'vercel', 'turso'],
  turso: ['next', 'ai']
}

const STEP_MS = 6400
const POSITIONS: Record<string, Point> = {
  gmail: { x: 80, y: 70 },
  pubsub: { x: 260, y: 70 },
  next: { x: 260, y: 225 },
  clerk: { x: 80, y: 225 },
  vercel: { x: 440, y: 70 },
  ai: { x: 440, y: 225 },
  turso: { x: 260, y: 380 }
}

type Point = { x: number; y: number }

function curve (from: Point, to: Point) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy) || 1
  const control = {
    x: (from.x + to.x) / 2 - dy * 0.22,
    y: (from.y + to.y) / 2 + dx * 0.22
  }
  const start = { x: from.x + dx / length * 27, y: from.y + dy / length * 27 }
  const end = { x: to.x - dx / length * 27, y: to.y - dy / length * 27 }
  return { start, control, end, path: `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}` }
}

function pointOnCurve (link: ReturnType<typeof curve>, t: number): Point {
  const u = 1 - t
  return {
    x: u * u * link.start.x + 2 * u * t * link.control.x + t * t * link.end.x,
    y: u * u * link.start.y + 2 * u * t * link.control.y + t * t * link.end.y
  }
}

export default function ArchitectureDiagram ({ copy }: { copy: ViolletArchitectureCopy }) {
  const duration = Math.max(1, copy.nodes.length) * STEP_MS
  const timeline = useSceneTimeline(duration, { loop: true, hold: 2600 })
  const index = Math.min(copy.nodes.length - 1, Math.floor(timeline.elapsed / STEP_MS))
  const active = copy.nodes[index]
  const finished = timeline.elapsed >= duration
  const neighbors = new Set(LINKS[active?.id ?? ''] ?? [])
  // Keep geometry independent of dictionary order, with room for additional IDs.
  const positions = Object.fromEntries(copy.nodes.map((node, i) => [node.id, POSITIONS[node.id] ?? {
    x: 260 + Math.cos(i / copy.nodes.length * Math.PI * 2) * 180,
    y: 225 + Math.sin(i / copy.nodes.length * Math.PI * 2) * 155
  }]))
  const edges = copy.nodes.flatMap(node => (LINKS[node.id] ?? [])
    .filter(id => positions[id] && node.id < id)
    .map(id => ({ from: node.id, to: id, ...curve(positions[node.id], positions[id]) })))
  const outgoing = edges.filter(edge => edge.from === active?.id || edge.to === active?.id)
  const local = timeline.elapsed - Math.max(0, index) * STEP_MS
  const slotMs = STEP_MS / Math.max(1, outgoing.length)
  const packetIndex = Math.min(outgoing.length - 1, Math.floor(local / slotMs))
  const packetProgress = (local % slotMs) / slotMs

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.diagramLabel} timeline={timeline}>
      <AppSurface>
        <svg viewBox='0 0 520 460' role='img' aria-label={copy.diagramLabel} className='mx-auto block h-auto w-full max-w-[36rem]'>
          <title>{copy.diagramLabel}</title>
          {edges.map(edge => {
            const connected = edge.from === active?.id || edge.to === active?.id
            const moving = !finished && !timeline.reduced && outgoing[packetIndex] === edge
            const t = edge.from === active?.id ? packetProgress : 1 - packetProgress
            const packet = pointOnCurve(edge, t)
            const opacity = Math.min(1, packetProgress * 10, (1 - packetProgress) * 10)
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path d={edge.path} fill='none' stroke={LC.primarySoft} strokeWidth={8} strokeOpacity={connected ? 0.6 : 0.18} />
                <path d={edge.path} fill='none' stroke={connected ? LC.primary : LC.wire} strokeWidth={connected ? 2 : 1.5} strokeLinecap='round' />
                {moving && (
                  <g opacity={opacity}>
                    {[1, 2, 3].map(step => {
                      const behind = packetProgress - step * 0.045
                      if (behind < 0) return null
                      const trail = pointOnCurve(edge, edge.from === active?.id ? behind : 1 - behind)
                      return <circle key={step} cx={trail.x} cy={trail.y} r={4 - step * 0.6} fill={LC.primary} opacity={0.4 / step} />
                    })}
                    <circle cx={packet.x} cy={packet.y} r={12} fill={LC.primaryGlow} />
                    <rect x={packet.x - 6} y={packet.y - 5} width={12} height={10} rx={3} fill={LC.card} stroke={LC.primary} strokeWidth={2} />
                  </g>
                )}
              </g>
            )
          })}
          {copy.nodes.map(node => {
            const point = positions[node.id]
            const selected = node.id === active?.id
            const linked = neighbors.has(node.id)
            return (
              <g key={node.id}>
                {selected && <circle cx={point.x} cy={point.y} r={34} fill={LC.primarySoft} />}
                <circle cx={point.x} cy={point.y} r={25} fill={LC.card} stroke={selected || linked ? LC.primary : LC.wire} strokeWidth={selected ? 2.5 : 1.5} />
                <circle cx={point.x} cy={point.y} r={selected ? 9 : 5} fill={selected || linked ? LC.primary : LC.wire} />
                <text x={point.x} y={point.y + 49} textAnchor='middle' fontSize={17} fontWeight={selected ? 700 : 500} fill={selected ? LC.primary : LC.fg}>{node.name}</text>
              </g>
            )
          })}
        </svg>
        {/* All explanations share one grid cell, reserving the tallest at any width. */}
        <div className={`grid rounded-xl border p-4 sm:p-5 ${L.border} ${L.secondary}`}>
          {copy.nodes.map(node => {
            const selected = node.id === active?.id
            const names = copy.nodes.filter(other => (LINKS[node.id] ?? []).includes(other.id)).map(other => other.name).join(', ')
            return (
              <div key={node.id} className={`col-start-1 row-start-1 min-w-0 ${selected ? 'visible' : 'invisible'}`} aria-hidden={!selected}>
                <p className={`text-xs font-medium uppercase tracking-wide ${L.primaryText}`}>{node.kicker}</p>
                <h4 className={`mt-1 text-lg font-semibold ${L.fg}`}>{node.name}</h4>
                <p className={`mt-2 text-sm leading-relaxed ${L.muted}`}>{node.summary}</p>
                <p className={`mt-3 text-xs leading-relaxed ${L.primaryText}`}>{copy.talksTo}{' '}{names}</p>
              </div>
            )
          })}
        </div>
      </AppSurface>
    </InteractivePanel>
  )
}
