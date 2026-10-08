'use client'

import { Check, LockKeyhole, Mail, Shield } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ViolletAccessCopy } from '@/types/case-study-types'
import { INSTITUTIONS } from './sample-ledger'
import { button, focusRing, itemClass, v } from './tokens'
import { InteractivePanel } from './ui'

const CHOICES = INSTITUTIONS.slice(0, 6)

function statusBadgeClass (confirmed: boolean) {
  return confirmed
    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
    : 'border-slate-600/40 bg-slate-800/60 text-slate-400'
}

export default function AccessGate ({ copy }: { copy: ViolletAccessCopy }) {
  const [selected, setSelected] = useState<string[]>(['banreservas', 'qik'])
  const [summary, setSummary] = useState('')

  const chosen = useMemo(
    () => CHOICES.filter(item => selected.includes(item.id)),
    [selected]
  )

  function toggle (id: string) {
    setSummary('')
    setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  }

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.description}>
      <div className='grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]'>
        <fieldset className='m-0 min-w-0 border-0 p-0'>
          <legend className={`mb-2 block text-sm font-semibold ${v.fg}`}>{copy.authorized}</legend>
          <ul className='grid min-w-0 gap-2'>
            {CHOICES.map(item => {
              const checked = selected.includes(item.id)
              return (
                <li key={item.id} className='min-w-0'>
                  <label className={`flex w-full min-w-0 cursor-pointer items-start gap-3 p-3 ${itemClass(checked)} ${checked ? 'ring-2 ring-teal-400/20' : ''}`}>
                    <span
                      aria-hidden='true'
                      className='flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-teal-400/15 text-sm font-bold leading-none text-teal-100'
                    >
                      {item.name.charAt(0).toUpperCase()}
                    </span>
                    <span className='min-w-0 flex-1'>
                      <span className={`block truncate text-sm font-semibold leading-snug ${v.fg}`}>{item.name}</span>
                      <span className={`mt-1 flex min-w-0 items-center gap-1.5 text-xs ${v.muted}`}>
                        <Mail className='size-3 shrink-0' aria-hidden='true' />
                        <span className='truncate'>{item.sender}</span>
                      </span>
                      <span className={`mt-2 inline-flex h-5 max-w-full items-center justify-center whitespace-nowrap rounded-full border px-2 text-[11px] font-medium leading-none ${statusBadgeClass(item.confirmed)}`}>
                        {item.confirmed ? copy.confirmed : copy.listed}
                      </span>
                    </span>
                    <span className='relative mt-0.5 flex size-4 shrink-0'>
                      <input
                        type='checkbox'
                        className={`peer size-4 cursor-pointer appearance-none rounded-[4px] border shadow-sm ${focusRing} ${checked ? 'border-teal-300 bg-teal-300' : 'border-slate-600 bg-slate-950'}`}
                        checked={checked}
                        onChange={() => toggle(item.id)}
                      />
                      <Check className='pointer-events-none absolute inset-0 m-auto size-3.5 stroke-[3] text-slate-950 opacity-0 peer-checked:opacity-100' aria-hidden='true' />
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </fieldset>

        <div className='min-w-0 space-y-3'>
          <form
            className='space-y-3 rounded-lg border border-rose-400/40 bg-rose-400/10 p-4'
            onSubmit={(event) => {
              event.preventDefault()
              setSummary(copy.bankRefusal)
            }}
          >
            <div className='space-y-2'>
              <label className='flex items-center gap-2 text-sm font-medium leading-none text-rose-200' htmlFor='viollet-bank-password'>
                <LockKeyhole className='size-4 shrink-0' aria-hidden='true' />
                {copy.passwordLabel}
              </label>
              <input
                id='viollet-bank-password'
                type='password'
                disabled
                value=''
                placeholder='••••••••'
                className='h-9 w-full min-w-0 cursor-not-allowed rounded-md border border-rose-400/40 bg-slate-950/70 px-3 text-sm text-rose-100 shadow-sm placeholder:text-rose-300/50 disabled:opacity-60'
              />
              <p className='text-xs leading-relaxed text-rose-300'>{copy.passwordNote}</p>
            </div>
            <button
              type='submit'
              className={`${button.base} border border-rose-400/45 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20`}
            >
              {copy.bankLogin}
            </button>
          </form>

          <section aria-label={copy.scope} className={`rounded-lg border text-left ${v.border} bg-slate-800/60`}>
            <div className='space-y-3 p-4'>
              <div className='flex items-center gap-2'>
                <span className='flex size-7 shrink-0 items-center justify-center rounded-md bg-teal-400/10 text-teal-300'>
                  <Shield className='size-3.5' aria-hidden='true' />
                </span>
                <p className={`text-sm font-medium tracking-tight ${v.fg}`}>{copy.scope}</p>
              </div>
              <ul className={`space-y-2.5 text-sm leading-relaxed ${v.muted}`}>
                <li className='flex gap-2.5'>
                  <span className='mt-2 size-1 shrink-0 rounded-full bg-teal-400' aria-hidden='true' />
                  <span className='min-w-0 break-words'>{copy.scopeDetail}</span>
                </li>
              </ul>
            </div>
            <div className={`border-t px-4 py-3 ${v.border}`}>
              <button
                type='button'
                className={`${button.base} ${button.primary}`}
                onClick={() => {
                  if (chosen.length === 0) {
                    setSummary(copy.noneSelected)
                    return
                  }
                  const senders = chosen.map(item => item.sender).join(', ')
                  setSummary(`${copy.grantReady.replace('{count}', String(chosen.length))} ${senders}`)
                }}
              >
                {copy.review}
              </button>
            </div>
          </section>

          <p className={`min-h-12 break-words text-sm leading-relaxed ${v.fg}`} aria-live='polite' aria-atomic='true'>
            <span className='sr-only'>{copy.summaryLabel} </span>
            {summary}
          </p>
        </div>
      </div>
    </InteractivePanel>
  )
}
