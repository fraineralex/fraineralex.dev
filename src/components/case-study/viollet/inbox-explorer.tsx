'use client'

import { CheckCircle2, ChevronRight, CreditCard, Mail } from 'lucide-react'
import { useState } from 'react'
import type { ViolletInboxCopy, ViolletInboxMessage } from '@/types/case-study-types'
import { focusRing, v } from './tokens'
import { InteractivePanel } from './ui'

const badge =
  'inline-flex h-5 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md border px-1.5 text-xs font-medium leading-none'

export default function InboxExplorer ({ copy }: { copy: ViolletInboxCopy }) {
  const [selected, setSelected] = useState<string | null>(null)
  const message = copy.messages.find(item => item.id === selected) ?? null

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.description}>
      <div className='grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'>
        <ul
          className='box-border grid w-full min-w-0 grid-cols-1 gap-3'
          aria-label={copy.listLabel}
        >
          {copy.messages.map(item => {
            const active = item.id === selected
            const alert = item.kind === 'alert'
            return (
              <li key={item.id} className='min-w-0'>
                <button
                  type='button'
                  aria-pressed={active}
                  onClick={() => setSelected(item.id)}
                  className={`relative box-border flex h-full w-full max-w-full min-w-0 cursor-pointer flex-col gap-6 overflow-hidden rounded-xl border py-6 text-left shadow-sm transition-colors duration-200 motion-reduce:transition-none ${focusRing} ${
                    active
                      ? 'border-teal-300/60 bg-teal-400/10'
                      : alert
                        ? 'border-teal-400/30 bg-teal-400/5 hover:bg-slate-800/60'
                        : 'border-slate-700/60 bg-slate-800/40 hover:bg-slate-800/60'
                  }`}
                >
                  <span className='relative z-10 box-border w-full max-w-full min-w-0 overflow-hidden p-3'>
                    <span className='box-border flex w-full max-w-full min-w-0 flex-col gap-1 overflow-hidden'>
                      <span className='flex min-w-0 items-center gap-2'>
                        <span
                          aria-hidden='true'
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                            alert ? 'bg-teal-400/10' : 'bg-slate-800/60'
                          }`}
                        >
                          {alert
                            ? <CreditCard className='size-4 text-teal-300' />
                            : <Mail className='size-4 text-slate-400' />}
                        </span>
                        <span className='flex min-w-0 flex-1 items-center justify-between gap-2'>
                          <span className={`min-w-0 truncate text-sm text-slate-200 ${alert ? 'font-semibold' : 'font-medium'}`}>
                            {item.from}
                          </span>
                          <span className={`${badge} ${
                            alert
                              ? 'border-teal-400/40 bg-teal-400/10 text-teal-200'
                              : 'border-slate-600 text-slate-400'
                          }`}
                          >
                            {alert ? copy.alert : copy.noise}
                          </span>
                          <span className='flex-1' />
                          <ChevronRight className='size-4 shrink-0 text-slate-500' aria-hidden='true' />
                        </span>
                      </span>
                      <span className='flex min-w-0 items-start justify-between gap-2'>
                        <span className={`min-w-0 flex-1 truncate text-sm ${alert || active ? 'text-slate-200' : 'text-slate-400'}`}>
                          {item.subject}
                        </span>
                      </span>
                      <span className='flex min-w-0 items-center gap-2'>
                        <span className='min-w-0 flex-1 truncate text-xs text-slate-500'>{item.email}</span>
                        <ChevronRight className='size-4 shrink-0 text-slate-500' aria-hidden='true' />
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className='min-w-0' aria-live='polite'>
          {message ? (
            <MessageDetail message={message} alertLabel={copy.alert} noiseLabel={copy.noise} />
          ) : (
            <div className={`flex min-h-48 w-full items-center justify-center rounded-xl border bg-slate-800/40 p-8 text-center shadow-sm ${v.border}`}>
              <p className={`text-sm ${v.subtle}`}>{copy.prompt}</p>
            </div>
          )}
        </div>
      </div>
    </InteractivePanel>
  )
}

function MessageDetail ({
  message,
  alertLabel,
  noiseLabel
}: {
  message: ViolletInboxMessage
  alertLabel: string
  noiseLabel: string
}) {
  const alert = message.kind === 'alert'

  return (
    <div className='space-y-4'>
      <div className='space-y-4'>
        <div className='space-y-1'>
          <h4 className={`break-words text-xl font-semibold ${v.fg}`}>{message.subject}</h4>
          <div className={`flex flex-wrap items-center gap-2 text-sm ${v.muted}`}>
            <span className={`font-medium ${v.fg}`}>{message.from}</span>
            <span className='hidden sm:inline' aria-hidden='true'>-</span>
            <span className='text-xs break-all sm:text-sm'>{message.email}</span>
          </div>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <span className={`${badge} ${
            alert
              ? 'border-transparent bg-slate-800/60 text-emerald-300'
              : 'border-slate-600 text-slate-400'
          }`}
          >
            {alert
              ? <CheckCircle2 className='size-3' aria-hidden='true' />
              : <Mail className='size-3' aria-hidden='true' />}
            {message.verdict}
          </span>
          <span className={`${badge} ${
            alert
              ? 'border-teal-400/40 bg-teal-400/10 text-teal-200'
              : 'border-slate-600 text-slate-400'
          }`}
          >
            {alert ? alertLabel : noiseLabel}
          </span>
        </div>
      </div>
      <div aria-hidden='true' className='h-px w-full bg-slate-700/60' />
      <div className={`flex flex-col gap-6 overflow-hidden rounded-xl border py-6 shadow-sm ${v.border} bg-slate-800/40`}>
        <div className='px-4 sm:px-6'>
          <p className={`text-sm leading-relaxed break-words ${v.fg}`}>{message.snippet}</p>
          <p className={`mt-3 text-sm leading-relaxed break-words ${v.muted}`}>{message.detail}</p>
        </div>
      </div>
    </div>
  )
}
