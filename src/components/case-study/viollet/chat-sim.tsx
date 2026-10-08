'use client'

import { Bot, Send, Sparkles, User, Wrench } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import type { ViolletChatAnswer, ViolletChatCopy } from '@/types/case-study-types'
import { InteractivePanel } from './ui'
import { button, focusRing, v } from './tokens'

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
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => () => {
    timers.current.forEach(timer => window.clearTimeout(timer))
  }, [])

  useEffect(() => {
    const node = viewportRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [turns])

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

  function onComposerKeyDown (event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      ask(draft)
    }
  }

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.description}>
      <div className={`flex min-w-0 flex-col overflow-hidden rounded-xl border ${v.border} bg-slate-900/50 ${v.fg}`}>
        <div className={`flex gap-2 overflow-x-auto border-b ${v.border} px-4 py-2`} aria-label={copy.suggestionsLabel}>
          {copy.answers.map(answer => (
            <button
              key={answer.id}
              type='button'
              className={`inline-flex min-h-8 max-w-[16rem] shrink-0 items-center justify-start gap-1.5 whitespace-normal rounded-md border border-slate-700/60 bg-slate-900/60 px-3 py-1.5 text-left text-sm font-medium leading-snug text-slate-200 transition-colors hover:border-teal-300/40 hover:bg-slate-800/60 hover:text-teal-100 motion-reduce:transition-none ${focusRing}`}
              onClick={() => ask(answer.prompt)}
            >
              {answer.prompt}
            </button>
          ))}
        </div>

        <div className='relative flex min-h-0 flex-1 flex-col overflow-hidden'>
          <div
            ref={viewportRef}
            className='max-h-96 min-h-48 min-w-0 overflow-y-auto overscroll-contain px-4'
            aria-live='polite'
            aria-label={copy.transcriptLabel}
          >
            <div className='flex min-h-full flex-col gap-4 py-4'>
              {turns.length === 0 && (
                <div className={`group/marker relative flex min-h-4 w-full items-center gap-2 text-left text-sm ${v.muted} before:mr-1 before:h-px before:min-w-0 before:flex-1 before:bg-slate-700/60 before:content-[''] after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-slate-700/60 after:content-['']`}>
                  <span className={`min-w-0 flex-none text-center ${v.subtle}`}>{copy.placeholder}</span>
                </div>
              )}
              {turns.map(turn => (
                <div key={turn.id} className='flex min-w-0 flex-col gap-4'>
                  <div className='flex min-w-0 flex-col gap-2'>
                    <div data-align='end' className='group/message relative flex w-full min-w-0 flex-row-reverse gap-2 text-sm'>
                      <div className='flex size-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-slate-800/60 text-slate-300'>
                        <User className='size-4' aria-hidden='true' />
                      </div>
                      <div className='flex w-full min-w-0 flex-col items-end gap-2.5'>
                        <div data-align='end' data-variant='default' className='group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 self-end'>
                          <div className='w-fit max-w-full min-w-0 overflow-hidden break-words rounded-xl border border-transparent bg-teal-400/15 px-3 py-2 text-sm leading-relaxed text-teal-100'>
                            <span className='sr-only'>{copy.you}: </span>
                            {turn.prompt}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex min-w-0 flex-col gap-2'>
                    <div data-align='start' className='group/message relative flex w-full min-w-0 gap-2 text-sm'>
                      <div className='flex size-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-slate-800/60 text-teal-300'>
                        <Bot className='size-4' aria-hidden='true' />
                      </div>
                      <div className='flex w-full min-w-0 flex-col gap-2.5'>
                        <div className={`flex max-w-full min-w-0 items-center text-xs font-medium ${v.muted}`}>
                          {copy.assistant}
                        </div>
                        {turn.phase === 'thinking' && (
                          <div className={`group/marker relative flex min-h-4 w-full items-center gap-2 text-left text-sm ${v.muted}`}>
                            <span className='flex size-4 shrink-0 items-center justify-center text-teal-300' aria-hidden='true'>
                              <Sparkles className='size-4 motion-safe:animate-pulse' />
                            </span>
                            <span className='min-w-0 break-words'>{copy.thinking}</span>
                          </div>
                        )}
                        {turn.answer && turn.phase !== 'thinking' && (
                          <div className={`group/marker relative flex min-h-4 w-full items-start gap-2 text-left text-sm ${v.muted}`}>
                            <span className='mt-0.5 flex size-4 shrink-0 items-center justify-center text-teal-300' aria-hidden='true'>
                              <Wrench className='size-4' />
                            </span>
                            <span className='min-w-0 break-words'>
                              <span className={`block ${v.fg}`}>{copy.tool}: {turn.answer.tool}</span>
                              <span className={`mt-0.5 block font-mono text-xs ${v.subtle}`}>{turn.answer.args}</span>
                              {turn.phase === 'done' && (
                                <span className={`mt-1 block ${v.fg}`}>{copy.result}: {turn.answer.result}</span>
                              )}
                            </span>
                          </div>
                        )}
                        {turn.phase === 'done' && (
                          <div data-align='start' data-variant='ghost' className='group/bubble relative flex w-full min-w-0 max-w-full flex-col gap-1'>
                            <div className={`w-fit max-w-full min-w-0 overflow-hidden break-words bg-transparent p-0 text-sm leading-relaxed ${v.fg}`}>
                              {turn.answer ? turn.answer.reply : copy.unknown}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form className={`border-t ${v.border} p-4`} onSubmit={onSubmit}>
          <label className='sr-only' htmlFor='viollet-chat-input'>{copy.placeholder}</label>
          <textarea
            id='viollet-chat-input'
            value={draft}
            onChange={event => setDraft(event.target.value)}
            onKeyDown={onComposerKeyDown}
            placeholder={copy.placeholder}
            aria-label={copy.placeholder}
            rows={3}
            className={`min-h-20 w-full resize-none rounded-md border border-slate-700/60 bg-slate-950 px-3 py-2 text-base text-slate-100 shadow-sm transition-[color,box-shadow] placeholder:text-slate-500 motion-reduce:transition-none md:text-sm ${focusRing}`}
          />
          <div className='mt-2 flex items-center justify-end gap-2'>
            <button
              type='submit'
              className={`inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 text-sm font-medium leading-none transition-colors motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-45 ${focusRing} ${button.primary}`}
              disabled={!draft.trim()}
            >
              <Send className='size-3.5' aria-hidden='true' />
              {copy.send}
            </button>
          </div>
        </form>
      </div>
    </InteractivePanel>
  )
}
