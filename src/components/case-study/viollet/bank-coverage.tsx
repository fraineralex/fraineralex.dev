'use client'

import { useMemo, useState } from 'react'
import type { ViolletBanksCopy } from '@/types/case-study-types'
import { INSTITUTIONS } from './sample-ledger'
import { focusRing, InteractivePanel } from './ui'

type Filter = 'all' | 'confirmed' | 'listed'

export default function BankCoverage ({ copy }: { copy: ViolletBanksCopy }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const items = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return INSTITUTIONS.filter(item => {
      if (filter === 'confirmed' && !item.confirmed) return false
      if (filter === 'listed' && item.confirmed) return false
      if (!needle) return true
      return item.name.toLowerCase().includes(needle) || item.sender.toLowerCase().includes(needle)
    })
  }, [filter, query])

  const active = INSTITUTIONS.find(item => item.id === selected) ?? null
  const filters: Array<{ id: Filter; label: string }> = [
    { id: 'all', label: copy.all },
    { id: 'confirmed', label: copy.confirmed },
    { id: 'listed', label: copy.listed }
  ]

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.description}>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <label className='block flex-1 text-sm text-slate-300'>
          <span className='mb-1 block text-xs'>{copy.searchLabel}</span>
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={copy.searchPlaceholder}
            className={`w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 ${focusRing}`}
          />
        </label>
        <div role='group' aria-label={copy.filtersLabel} className='flex flex-wrap gap-2'>
          {filters.map(item => (
            <button
              key={item.id}
              type='button'
              aria-pressed={filter === item.id}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${focusRing} ${filter === item.id ? 'bg-teal-400/20 text-teal-100' : 'bg-slate-800 text-slate-300 hover:text-slate-100'}`}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <p className='mt-4 text-sm text-slate-400'>{copy.empty}</p>
      ) : (
        <ul className='mt-4 flex flex-wrap gap-2'>
          {items.map(item => (
            <li key={item.id}>
              <button
                type='button'
                aria-pressed={selected === item.id}
                className={`rounded-full border px-3 py-1.5 text-sm ${focusRing} ${selected === item.id ? 'border-teal-300 bg-teal-400/15 text-teal-50' : 'border-slate-700 text-slate-200 hover:border-slate-500'}`}
                onClick={() => setSelected(item.id)}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className='mt-4 rounded-lg border border-slate-700 bg-slate-900/50 p-4' aria-live='polite'>
        {active ? (
          <>
            <h4 className='text-base font-medium text-slate-100'>{active.name}</h4>
            <p className='mt-1 text-xs text-teal-200'>
              {active.confirmed ? copy.confirmedHelp : copy.listedHelp}
            </p>
            <dl className='mt-3 grid gap-2 text-sm sm:grid-cols-2'>
              <div>
                <dt className='text-slate-400'>{copy.sender}</dt>
                <dd className='font-mono text-xs text-slate-100'>{active.sender}</dd>
              </div>
              <div>
                <dt className='text-slate-400'>{copy.tracksCards}</dt>
                <dd>{copy.yes}</dd>
              </div>
              <div>
                <dt className='text-slate-400'>{copy.tracksAccounts}</dt>
                <dd>{copy.yes}</dd>
              </div>
              <div>
                <dt className='text-slate-400'>{copy.transfers}</dt>
                <dd>{copy.yes}</dd>
              </div>
            </dl>
          </>
        ) : (
          <p className='text-sm text-slate-400'>{copy.prompt}</p>
        )}
      </div>
    </InteractivePanel>
  )
}
