'use client'

import { useReducedMotion } from 'framer-motion'
import { useRef, useState } from 'react'
import type { ViolletSyncCopy } from '@/types/case-study-types'
import { focusRing, InteractivePanel } from './ui'

type Phase = 'idle' | 'connected' | 'watching' | 'ingested' | 'deduped'
type Action = 'connect' | 'watch' | 'push' | 'replay'

const ORDER: Action[] = ['connect', 'watch', 'push', 'replay']

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

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.description}>
      <div className='grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]'>
        <div>
          <p className='text-xs font-medium uppercase tracking-wide text-slate-400'>{copy.actionsLabel}</p>
          <div className='mt-2 flex flex-col gap-2'>
            {ORDER.map((action, index) => (
              <button
                key={action}
                type='button'
                disabled={busy || index !== unlocked}
                className={`rounded-md border border-slate-600 px-3 py-2 text-left text-sm text-slate-100 hover:border-teal-300/50 disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`}
                onClick={() => run(action)}
              >
                {copy[action]}
              </button>
            ))}
            <button
              type='button'
              className={`rounded-md px-3 py-2 text-left text-sm text-slate-400 hover:text-slate-200 ${focusRing}`}
              onClick={reset}
            >
              {copy.reset}
            </button>
          </div>
          <p className='mt-4 text-xs uppercase tracking-wide text-slate-500'>{copy.stateLabel}</p>
          <p className='mt-1 text-sm font-medium text-teal-100' aria-live='polite'>{copy.states[phase]}</p>
        </div>
        <div className='min-h-56 rounded-lg border border-slate-800 bg-slate-950 p-3' aria-live='polite' aria-label={copy.logLabel}>
          <p className='mb-2 font-mono text-[11px] uppercase tracking-wide text-slate-500'>{copy.logLabel}</p>
          {log.length === 0 ? (
            <p className='font-mono text-xs text-slate-600'>{copy.states.idle}</p>
          ) : (
            <ol className='space-y-1.5 font-mono text-xs leading-relaxed text-teal-50/90'>
              {log.map((line, index) => (
                <li key={`${index}-${line.slice(0, 18)}`}>{line}</li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </InteractivePanel>
  )
}
