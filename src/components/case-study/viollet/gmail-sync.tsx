'use client'

import { CheckCircle, CheckCircle2, Clock, Loader, Mail, RefreshCw, XCircle } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import { useRef, useState } from 'react'
import type { ViolletSyncCopy } from '@/types/case-study-types'
import { InteractivePanel } from './ui'
import { button, focusRing, v } from './tokens'

type Phase = 'idle' | 'connected' | 'watching' | 'ingested' | 'deduped'
type Action = 'connect' | 'watch' | 'push' | 'replay'

const ORDER: Action[] = ['connect', 'watch', 'push', 'replay']

const ACTION_ICON = {
  connect: Mail,
  watch: Clock,
  push: RefreshCw,
  replay: RefreshCw
} as const

export default function GmailSync ({ copy }: { copy: ViolletSyncCopy }) {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const [log, setLog] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const runId = useRef(0)

  function run (action: Action) {
    if (busy) return
    const lines = copy.lines[action]
    const nextPhase: Phase = action === 'connect'
      ? 'connected'
      : action === 'watch'
        ? 'watching'
        : action === 'push'
          ? 'ingested'
          : 'deduped'
    const id = runId.current + 1
    runId.current = id

    if (reduced) {
      setLog(current => [...current, ...lines])
      setPhase(nextPhase)
      return
    }

    setBusy(true)
    lines.forEach((line, index) => {
      window.setTimeout(() => {
        if (runId.current !== id) return
        setLog(current => [...current, line])
        if (index === lines.length - 1) {
          setPhase(nextPhase)
          setBusy(false)
        }
      }, 280 * (index + 1))
    })
  }

  function reset () {
    runId.current += 1
    setPhase('idle')
    setLog([])
    setBusy(false)
  }

  const unlocked = phase === 'idle' ? 0 : phase === 'connected' ? 1 : phase === 'watching' ? 2 : phase === 'ingested' ? 3 : 4
  const totalLines = ORDER.reduce((sum, action) => sum + copy.lines[action].length, 0)
  const progress = totalLines === 0 ? 0 : (log.length / totalLines) * 100
  const nextAction = unlocked < ORDER.length ? ORDER[unlocked] : null
  const badgeTone = busy
    ? 'border-transparent bg-teal-400/15 text-teal-200'
    : phase === 'idle'
      ? 'border-transparent bg-rose-400/15 text-rose-300'
      : 'border-transparent bg-emerald-400/15 text-emerald-300'

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.description}>
      <div className={`flex min-w-0 flex-col gap-6 rounded-xl border py-6 shadow-sm ${v.border} ${v.card} ${v.fg}`}>
        <div className='grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-4 sm:px-6'>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div className='min-w-0 space-y-1'>
              <h4 className='flex items-center gap-2 font-semibold leading-none'>
                <Mail className='size-5 shrink-0 text-teal-300' aria-hidden='true' />
                {copy.actionsLabel}
              </h4>
              <p className={`text-sm ${v.muted}`}>{copy.stateLabel}</p>
            </div>
            <span className={`inline-flex max-w-full items-center justify-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium leading-snug ${badgeTone}`}>
              {busy ? (
                <Loader className='size-3 shrink-0 animate-spin motion-reduce:animate-none' aria-hidden='true' />
              ) : phase === 'idle' ? (
                <XCircle className='size-3 shrink-0' aria-hidden='true' />
              ) : (
                <CheckCircle className='size-3 shrink-0' aria-hidden='true' />
              )}
              {copy.states[phase]}
            </span>
          </div>
        </div>

        <div className='space-y-6 px-4 sm:px-6'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className={`rounded-lg border p-4 ${v.border}`}>
              <div className={`mb-1 flex items-center gap-2 text-sm ${v.muted}`}>
                <Clock className='size-4 shrink-0' aria-hidden='true' />
                {copy.stateLabel}
              </div>
              <p className='flex items-start gap-2 font-medium' aria-live='polite'>
                {busy ? (
                  <Loader className='mt-0.5 size-4 shrink-0 animate-spin text-teal-300 motion-reduce:animate-none' aria-hidden='true' />
                ) : phase === 'idle' ? (
                  <XCircle className='mt-0.5 size-4 shrink-0 text-rose-300' aria-hidden='true' />
                ) : (
                  <CheckCircle className='mt-0.5 size-4 shrink-0 text-emerald-400' aria-hidden='true' />
                )}
                <span className='min-w-0'>{copy.states[phase]}</span>
              </p>
            </div>
            <div className={`rounded-lg border p-4 ${v.border}`}>
              <div className={`mb-1 flex items-center gap-2 text-sm ${v.muted}`}>
                <Mail className='size-4 shrink-0' aria-hidden='true' />
                {copy.actionsLabel}
              </div>
              <p className='font-medium'>
                {nextAction ? copy[nextAction] : copy.states.deduped}
              </p>
            </div>
          </div>

          <div
            className='relative h-2 w-full overflow-hidden rounded-full bg-teal-400/20'
            role='progressbar'
            aria-valuemin={0}
            aria-valuemax={totalLines}
            aria-valuenow={log.length}
            aria-label={copy.logLabel}
          >
            <div
              className='h-full w-full bg-teal-400 transition-transform motion-reduce:transition-none'
              style={{ transform: `translateX(-${100 - progress}%)` }}
            />
          </div>

          <div className='flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4'>
            {ORDER.map((action, index) => {
              const Icon = index < unlocked ? CheckCircle2 : ACTION_ICON[action]
              const spinning = busy && index === unlocked && (action === 'push' || action === 'replay')
              return (
                <button
                  key={action}
                  type='button'
                  disabled={busy || index !== unlocked}
                  className={`inline-flex min-h-11 sm:min-h-9 w-full max-w-full items-center justify-center gap-1.5 whitespace-normal rounded-md px-3.5 py-2 text-center text-sm font-medium leading-none transition-colors motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-45 sm:w-auto sm:whitespace-nowrap sm:py-0 ${focusRing} ${index === unlocked ? button.primary : button.outline}`}
                  onClick={() => run(action)}
                >
                  <Icon className={`size-4 shrink-0 ${index < unlocked ? 'text-emerald-300' : ''} ${spinning ? 'animate-spin motion-reduce:animate-none' : ''}`} aria-hidden='true' />
                  {copy[action]}
                </button>
              )
            })}
            <button
              type='button'
              className={`${button.base} ${button.ghost} w-full sm:w-auto`}
              onClick={reset}
            >
              {copy.reset}
            </button>
          </div>

          <div className={`min-w-0 overflow-hidden rounded-lg border bg-slate-900/50 ${v.border}`} aria-live='polite' aria-label={copy.logLabel}>
            <p className={`border-b px-4 py-2 text-xs font-medium ${v.border} ${v.muted}`}>{copy.logLabel}</p>
            {log.length === 0 ? (
              <p className={`p-4 text-center text-sm ${v.muted}`}>{copy.states.idle}</p>
            ) : (
              <ol className='space-y-0.5 p-2'>
                {log.map((line, index) => {
                  const active = busy && index === log.length - 1
                  return (
                    <li key={`${index}-${line.slice(0, 18)}`} className='flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left'>
                      {active ? (
                        <Loader className='mt-0.5 size-3.5 shrink-0 animate-spin text-teal-300 motion-reduce:animate-none' aria-hidden='true' />
                      ) : (
                        <CheckCircle2 className='mt-0.5 size-3.5 shrink-0 text-emerald-400' aria-hidden='true' />
                      )}
                      <span className='min-w-0 flex-1 break-words text-sm'>{line}</span>
                    </li>
                  )
                })}
              </ol>
            )}
          </div>
        </div>
      </div>
    </InteractivePanel>
  )
}
