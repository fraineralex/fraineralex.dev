'use client'

import { useState } from 'react'
import type { ViolletOwnershipCopy } from '@/types/case-study-types'
import { focusRing, InteractivePanel } from './ui'

export default function OwnershipMap ({ copy }: { copy: ViolletOwnershipCopy }) {
  const [selected, setSelected] = useState<string | null>(null)
  const item = copy.items.find(entry => entry.id === selected) ?? null

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.description}>
      <ul className='grid gap-2 sm:grid-cols-2' aria-label={copy.listLabel}>
        {copy.items.map(entry => {
          const active = entry.id === selected
          return (
            <li key={entry.id}>
              <button
                type='button'
                aria-pressed={active}
                className={`h-full w-full rounded-lg border px-3 py-3 text-left ${focusRing} ${active ? 'border-teal-300 bg-teal-400/10' : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'}`}
                onClick={() => setSelected(entry.id)}
              >
                <span className='block text-sm font-medium text-slate-100'>{entry.title}</span>
                <span className='mt-1 block text-xs leading-relaxed text-slate-400'>{entry.summary}</span>
              </button>
            </li>
          )
        })}
      </ul>
      <div className='mt-4 rounded-lg border border-slate-700 bg-slate-900/40 p-4' aria-live='polite'>
        {item ? (
          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <h4 className='text-xs font-semibold uppercase tracking-wide text-teal-200'>{copy.ownedLabel}</h4>
              <p className='mt-2 text-sm leading-relaxed text-slate-200'>{item.owned}</p>
            </div>
            <div>
              <h4 className='text-xs font-semibold uppercase tracking-wide text-slate-400'>{copy.deferredLabel}</h4>
              <p className='mt-2 text-sm leading-relaxed text-slate-300'>{item.deferred}</p>
            </div>
          </div>
        ) : (
          <p className='text-sm text-slate-400'>{copy.prompt}</p>
        )}
      </div>
    </InteractivePanel>
  )
}
