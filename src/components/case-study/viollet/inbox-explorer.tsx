'use client'

import { useState } from 'react'
import type { ViolletInboxCopy } from '@/types/case-study-types'
import { focusRing, InteractivePanel } from './ui'

export default function InboxExplorer ({ copy }: { copy: ViolletInboxCopy }) {
  const [selected, setSelected] = useState<string | null>(null)
  const message = copy.messages.find(item => item.id === selected) ?? null

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.description}>
      <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'>
        <ul className='space-y-2' aria-label={copy.listLabel}>
          {copy.messages.map(item => {
            const active = item.id === selected
            return (
              <li key={item.id}>
                <button
                  type='button'
                  aria-pressed={active}
                  className={`w-full rounded-lg border px-3 py-3 text-left transition ${focusRing} ${active ? 'border-teal-300/70 bg-teal-400/10' : 'border-slate-700 bg-slate-900/70 hover:border-slate-500'}`}
                  onClick={() => setSelected(item.id)}
                >
                  <span className='flex items-center justify-between gap-2'>
                    <span className='text-sm font-medium text-slate-100'>{item.from}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] ${item.kind === 'alert' ? 'bg-teal-400/15 text-teal-100' : 'bg-slate-700/80 text-slate-300'}`}>
                      {item.kind === 'alert' ? copy.alert : copy.noise}
                    </span>
                  </span>
                  <span className='mt-1 block text-sm text-slate-200'>{item.subject}</span>
                  <span className='mt-1 block truncate text-xs text-slate-500'>{item.email}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <div className='rounded-lg border border-slate-700/80 bg-slate-900/50 p-4' aria-live='polite'>
          {message ? (
            <>
              <p className='text-xs uppercase tracking-wide text-teal-200/80'>{message.verdict}</p>
              <h4 className='mt-2 text-base font-medium text-slate-100'>{message.subject}</h4>
              <p className='mt-1 text-xs text-slate-500'>{message.from} · {message.email}</p>
              <p className='mt-3 text-sm leading-relaxed text-slate-300'>{message.snippet}</p>
              <p className='mt-3 text-sm leading-relaxed text-slate-300'>{message.detail}</p>
            </>
          ) : (
            <p className='text-sm text-slate-400'>{copy.prompt}</p>
          )}
        </div>
      </div>
    </InteractivePanel>
  )
}
