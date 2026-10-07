'use client'

import { useState } from 'react'
import type { ViolletArchitectureCopy, ViolletArchitectureNode } from '@/types/case-study-types'
import { focusRing, InteractivePanel } from './ui'

const LINKS: Record<string, string[]> = {
  gmail: ['pubsub'],
  pubsub: ['gmail', 'next'],
  next: ['pubsub', 'clerk', 'vercel', 'ai', 'turso'],
  clerk: ['next'],
  vercel: ['next', 'ai'],
  ai: ['next', 'vercel', 'turso'],
  turso: ['next', 'ai']
}

export default function ArchitectureDiagram ({ copy }: { copy: ViolletArchitectureCopy }) {
  const [pinned, setPinned] = useState(copy.nodes[0]?.id ?? 'next')
  const [hover, setHover] = useState<string | null>(null)
  const activeId = hover ?? pinned
  const active = copy.nodes.find(node => node.id === activeId) ?? copy.nodes[0]
  if (!active) return null
  const neighbors = new Set(LINKS[active.id] ?? [])

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.description}>
      <ul
        className='grid gap-2 sm:grid-cols-2 lg:grid-cols-4'
        aria-label={copy.diagramLabel}
        onMouseLeave={() => setHover(null)}
      >
        {copy.nodes.map(node => {
          const isActive = node.id === active.id
          const linked = neighbors.has(node.id)
          return (
            <li key={node.id}>
              <button
                type='button'
                aria-pressed={pinned === node.id}
                className={`h-full w-full rounded-lg border px-3 py-3 text-left transition motion-reduce:transition-none ${focusRing} ${isActive ? 'border-teal-300 bg-teal-400/15 shadow-[0_0_0_1px_rgba(94,234,212,0.35)]' : linked ? 'border-teal-400/40 bg-slate-900' : 'border-slate-700 bg-slate-950 hover:border-slate-500'}`}
                onMouseEnter={() => setHover(node.id)}
                onFocus={() => setPinned(node.id)}
                onClick={() => setPinned(node.id)}
              >
                <span className='block text-[11px] uppercase tracking-wide text-teal-200/80'>{node.kicker}</span>
                <span className='mt-1 block text-sm font-semibold text-slate-100'>{node.name}</span>
                {pinned === node.id && (
                  <span className='mt-2 inline-block text-[11px] text-teal-100'>{copy.pinned}</span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
      <div className='mt-4 rounded-lg border border-slate-700 bg-slate-900/50 p-4' aria-live='polite'>
        <h4 className='text-base font-medium text-slate-100'>{active.name}</h4>
        <p className='mt-2 text-sm leading-relaxed text-slate-300'>{active.summary}</p>
        <p className='mt-3 text-xs text-slate-400'>
          {copy.talksTo}{' '}
          {copy.nodes.filter(node => neighbors.has(node.id)).map(node => node.name).join(', ')}
        </p>
      </div>
    </InteractivePanel>
  )
}
