'use client'

import { useMemo, useState } from 'react'
import type { ViolletAccessCopy } from '@/types/case-study-types'
import { INSTITUTIONS } from './sample-ledger'
import { focusRing, InteractivePanel } from './ui'

const CHOICES = INSTITUTIONS.slice(0, 6)

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
      <div className='grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]'>
        <fieldset className='rounded-lg border border-slate-700 bg-slate-900/60 p-3'>
          <legend className='px-1 text-sm font-medium text-slate-200'>{copy.authorized}</legend>
          <ul className='mt-2 space-y-2'>
            {CHOICES.map(item => {
              const checked = selected.includes(item.id)
              return (
                <li key={item.id}>
                  <label className={`flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-teal-300 ${checked ? 'border-teal-300/50 bg-teal-400/10' : 'border-slate-700'}`}>
                    <input
                      type='checkbox'
                      className={`mt-1 accent-teal-300 ${focusRing}`}
                      checked={checked}
                      onChange={() => toggle(item.id)}
                    />
                    <span>
                      <span className='block text-sm text-slate-100'>{item.name}</span>
                      <span className='block text-xs text-slate-400'>{item.sender}</span>
                      <span className='mt-1 inline-block text-[11px] text-teal-200/80'>
                        {item.confirmed ? copy.confirmed : copy.listed}
                      </span>
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </fieldset>

        <div className='space-y-3'>
          <form
            className='rounded-lg border border-rose-400/30 bg-rose-400/5 p-3'
            onSubmit={(event) => {
              event.preventDefault()
              setSummary(copy.bankRefusal)
            }}
          >
            <label className='block text-sm font-medium text-slate-200' htmlFor='viollet-bank-password'>
              {copy.passwordLabel}
            </label>
            <input
              id='viollet-bank-password'
              type='password'
              disabled
              value=''
              placeholder='••••••••'
              className='mt-2 w-full cursor-not-allowed rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-500'
            />
            <p className='mt-2 text-xs leading-relaxed text-slate-400'>{copy.passwordNote}</p>
            <button
              type='submit'
              className={`mt-3 rounded-md border border-rose-300/40 px-3 py-2 text-sm text-rose-100 hover:bg-rose-400/10 ${focusRing}`}
            >
              {copy.bankLogin}
            </button>
          </form>

          <div className='rounded-lg border border-slate-700 bg-slate-900/60 p-3'>
            <p className='font-mono text-xs text-teal-200'>{copy.scope}</p>
            <p className='mt-2 text-sm leading-relaxed text-slate-300'>{copy.scopeDetail}</p>
            <button
              type='button'
              className={`mt-3 rounded-md bg-teal-400/15 px-3 py-2 text-sm font-medium text-teal-100 hover:bg-teal-400/25 ${focusRing}`}
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

          <p className='min-h-12 text-sm leading-relaxed text-slate-200' aria-live='polite' aria-atomic='true'>
            <span className='sr-only'>{copy.summaryLabel} </span>
            {summary}
          </p>
        </div>
      </div>
    </InteractivePanel>
  )
}
