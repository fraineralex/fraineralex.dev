'use client'

import { Send } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import { FormEvent, useEffect, useRef, useState } from 'react'
import type { ViolletChatAnswer, ViolletChatCopy } from '@/types/case-study-types'
import { focusRing, InteractivePanel } from './ui'

interface Turn {
  id: string
  prompt: string
  answer: ViolletChatAnswer | null
  phase: 'thinking' | 'tool' | 'done'
}

export default function ChatSim ({ copy }: { copy: ViolletChatCopy }) {
  const reduced = useReducedMotion()
  const [draft, setDraft] = useState('')
  const [turns, setTurns] = useState<Turn[]>([])
  const timers = useRef<number[]>([])

  useEffect(() => () => {
    timers.current.forEach(timer => window.clearTimeout(timer))
  }, [])

  function resolve (prompt: string): ViolletChatAnswer | null {
    const text = prompt.toLowerCase()
    let best: ViolletChatAnswer | null = null
    let bestHits = 0
    for (const answer of copy.answers) {
      const hits = answer.keywords.filter(keyword => text.includes(keyword.toLowerCase())).length
      if (hits > bestHits) {
        best = answer
        bestHits = hits
      }
    }
    return best
  }

  function ask (prompt: string) {
    const trimmed = prompt.trim()
    if (!trimmed) return
    const answer = resolve(trimmed)
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setDraft('')
    setTurns(current => [...current, { id, prompt: trimmed, answer, phase: 'thinking' }])
    const toolDelay = reduced ? 0 : 450
    const doneDelay = reduced ? 0 : 900
    timers.current.push(window.setTimeout(() => {
      setTurns(current => current.map(turn => turn.id === id ? { ...turn, phase: answer ? 'tool' : 'done' } : turn))
    }, toolDelay))
    timers.current.push(window.setTimeout(() => {
      setTurns(current => current.map(turn => turn.id === id ? { ...turn, phase: 'done' } : turn))
    }, doneDelay))
  }

  function onSubmit (event: FormEvent) {
    event.preventDefault()
    ask(draft)
  }

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.description}>
      <div className='mb-3 flex flex-wrap gap-2' aria-label={copy.suggestionsLabel}>
        {copy.answers.map(answer => (
          <button
            key={answer.id}
            type='button'
            className={`rounded-full border border-slate-600 px-3 py-1.5 text-left text-xs text-slate-200 hover:border-teal-300/60 hover:text-teal-50 ${focusRing}`}
            onClick={() => ask(answer.prompt)}
          >
            {answer.prompt}
          </button>
        ))}
      </div>

      <div className='min-h-48 space-y-3 rounded-lg border border-slate-700 bg-slate-950/70 p-3' aria-live='polite' aria-label={copy.transcriptLabel}>
        {turns.length === 0 && (
          <p className='text-sm text-slate-500'>{copy.placeholder}</p>
        )}
        {turns.map(turn => (
          <article key={turn.id} className='space-y-2'>
            <p className='text-sm text-slate-100'>
              <span className='mr-2 text-xs font-semibold uppercase tracking-wide text-slate-400'>{copy.you}</span>
              {turn.prompt}
            </p>
            {turn.phase === 'thinking' && (
              <p className='text-xs text-teal-200/80'>{copy.thinking}</p>
            )}
            {turn.answer && turn.phase !== 'thinking' && (
              <div className='rounded-md border border-teal-400/20 bg-teal-400/5 px-3 py-2 font-mono text-[11px] leading-relaxed text-teal-50'>
                <p>{copy.tool}: {turn.answer.tool}</p>
                <p className='text-slate-400'>{turn.answer.args}</p>
                {turn.phase === 'done' && <p className='mt-1'>{copy.result}: {turn.answer.result}</p>}
              </div>
            )}
            {turn.phase === 'done' && (
              <p className='text-sm leading-relaxed text-slate-200'>
                <span className='mr-2 text-xs font-semibold uppercase tracking-wide text-teal-200'>{copy.assistant}</span>
                {turn.answer ? turn.answer.reply : copy.unknown}
              </p>
            )}
          </article>
        ))}
      </div>

      <form className='mt-3 flex gap-2' onSubmit={onSubmit}>
        <label className='sr-only' htmlFor='viollet-chat-input'>{copy.placeholder}</label>
        <input
          id='viollet-chat-input'
          value={draft}
          onChange={event => setDraft(event.target.value)}
          placeholder={copy.placeholder}
          className={`min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 ${focusRing}`}
        />
        <button type='submit' className={`inline-flex items-center gap-1.5 rounded-md bg-teal-400/15 px-3 py-2 text-sm font-medium text-teal-100 hover:bg-teal-400/25 ${focusRing}`}>
          <Send className='h-4 w-4' aria-hidden='true' />
          {copy.send}
        </button>
      </form>
    </InteractivePanel>
  )
}
