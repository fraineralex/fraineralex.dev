'use client'

import { ArrowLeftRight, CreditCard, Landmark, Mail, Search, Shield } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ViolletBanksCopy } from '@/types/case-study-types'
import { INSTITUTIONS } from './sample-ledger'
import { focusRing, inputClass, pillClass, v } from './tokens'
import { InteractivePanel } from './ui'

type Filter = 'all' | 'confirmed' | 'listed'
type Institution = (typeof INSTITUTIONS)[number]

function statusBadgeClass (confirmed: boolean) {
  return confirmed
    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
    : 'border-slate-600/40 bg-slate-800/60 text-slate-400'
}

function LogoBanner ({ name }: { name: string }) {
  return (
    <span
      aria-hidden='true'
      className={`flex h-16 w-full items-center justify-center overflow-hidden rounded-none border-b bg-slate-800 text-lg font-bold text-teal-200 ${v.border}`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

function StatusBadge ({ confirmed, copy }: { confirmed: boolean; copy: ViolletBanksCopy }) {
  return (
    <span className={`inline-flex h-5 max-w-full items-center justify-center whitespace-nowrap rounded-full border px-2 text-[11px] font-medium leading-none ${statusBadgeClass(confirmed)}`}>
      {confirmed ? copy.confirmed : copy.listed}
    </span>
  )
}

function TrackChips ({ copy }: { copy: ViolletBanksCopy }) {
  const chips = [
    { icon: CreditCard, label: copy.tracksCards },
    { icon: Landmark, label: copy.tracksAccounts },
    { icon: ArrowLeftRight, label: copy.transfers }
  ]
  return (
    <div className='flex flex-wrap items-center gap-1.5'>
      {chips.map(chip => {
        const Icon = chip.icon
        return (
          <span key={chip.label} className={`inline-flex items-center gap-1 rounded bg-slate-800/60 px-1.5 py-0.5 text-[10px] ${v.muted}`}>
            <Icon className='size-2.5 shrink-0' aria-hidden='true' />
            {chip.label}
          </span>
        )
      })}
    </div>
  )
}

function InstitutionCardBody ({ item, copy }: { item: Institution; copy: ViolletBanksCopy }) {
  return (
    <span className='flex min-w-0 flex-1 flex-col gap-3 px-4 py-3'>
      <span className='min-w-0 space-y-1'>
        <span className={`block font-semibold leading-snug ${v.fg}`}>{item.name}</span>
        <span className={`block text-xs leading-relaxed ${v.muted}`}>
          {item.confirmed ? copy.confirmedHelp : copy.listedHelp}
        </span>
      </span>
      <span className={`flex min-w-0 items-center gap-1.5 text-xs ${v.muted}`}>
        <Mail className='size-3 shrink-0' aria-hidden='true' />
        <span className='truncate'>{item.sender}</span>
      </span>
      <span className='flex flex-wrap items-center gap-2'>
        <StatusBadge confirmed={item.confirmed} copy={copy} />
      </span>
      <TrackChips copy={copy} />
    </span>
  )
}

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
      <div className='min-w-0 space-y-3'>
        <label className='block min-w-0'>
          <span className={`mb-2 block text-sm font-medium leading-none ${v.fg}`}>{copy.searchLabel}</span>
          <span className='relative block'>
            <Search className={`pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 ${v.muted}`} aria-hidden='true' />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className={`${inputClass} cursor-text pl-9`}
            />
          </span>
        </label>
        <div role='group' aria-label={copy.filtersLabel} className='flex flex-wrap items-center gap-2'>
          {filters.map(item => (
            <button
              key={item.id}
              type='button'
              aria-pressed={filter === item.id}
              className={pillClass(filter === item.id)}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className={`mt-4 rounded-xl border border-dashed bg-slate-900/50 py-0 shadow-sm ${v.border}`}>
          <div className='flex flex-col items-center justify-center px-6 py-12 text-center'>
            <Shield className={`mb-4 size-12 opacity-50 ${v.subtle}`} aria-hidden='true' />
            <p className={`max-w-sm text-sm ${v.muted}`}>{copy.empty}</p>
          </div>
        </div>
      ) : (
        <ul className='mt-4 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
          {items.map(item => {
            const isSelected = selected === item.id
            return (
              <li key={item.id} className='min-w-0'>
                <button
                  type='button'
                  aria-pressed={isSelected}
                  onClick={() => setSelected(item.id)}
                  className={`flex h-full w-full min-w-0 cursor-pointer flex-col gap-0 overflow-hidden rounded-xl border bg-slate-900/50 py-0 text-left shadow-sm transition-all motion-reduce:transition-none ${focusRing} ${
                    isSelected
                      ? 'border-teal-300/70 ring-2 ring-teal-400/20'
                      : 'border-slate-700/60 hover:border-slate-500'
                  }`}
                >
                  <LogoBanner name={item.name} />
                  <InstitutionCardBody item={item} copy={copy} />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className={`mt-4 overflow-hidden rounded-xl border bg-slate-900/50 shadow-sm ${v.border}`} aria-live='polite'>
        {active ? (
          <>
            <LogoBanner name={active.name} />
            <div className='flex min-w-0 flex-col gap-3 px-4 py-3'>
              <div className='min-w-0 space-y-1'>
                <h4 className={`truncate text-sm font-semibold sm:text-base ${v.fg}`}>{active.name}</h4>
                <p className={`text-xs leading-relaxed ${v.muted}`}>
                  {active.confirmed ? copy.confirmedHelp : copy.listedHelp}
                </p>
              </div>
              <div className={`flex min-w-0 items-center gap-1.5 text-xs ${v.muted}`}>
                <Mail className='size-3 shrink-0' aria-hidden='true' />
                <span className='truncate'>{active.sender}</span>
              </div>
              <div className='flex flex-wrap items-center gap-2'>
                <StatusBadge confirmed={active.confirmed} copy={copy} />
              </div>
              <TrackChips copy={copy} />
              <dl className={`grid gap-3 border-t pt-3 text-sm sm:grid-cols-2 ${v.border} ${v.fg}`}>
                <div className='min-w-0'>
                  <dt className={v.muted}>{copy.sender}</dt>
                  <dd className='mt-0.5 truncate font-mono text-xs'>{active.sender}</dd>
                </div>
                <div>
                  <dt className={v.muted}>{copy.tracksCards}</dt>
                  <dd>{copy.yes}</dd>
                </div>
                <div>
                  <dt className={v.muted}>{copy.tracksAccounts}</dt>
                  <dd>{copy.yes}</dd>
                </div>
                <div>
                  <dt className={v.muted}>{copy.transfers}</dt>
                  <dd>{copy.yes}</dd>
                </div>
              </dl>
            </div>
          </>
        ) : (
          <p className={`px-4 py-6 text-sm ${v.subtle}`}>{copy.prompt}</p>
        )}
      </div>
    </InteractivePanel>
  )
}
