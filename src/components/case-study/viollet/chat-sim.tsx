'use client'

import { Bot, User, Wrench } from 'lucide-react'
import type { ViolletChatAnswer, ViolletChatCopy } from '@/types/case-study-types'
import { linear, span, typed, useSceneTimeline } from '../kit/scene'
import { L, LC } from './light'
import { AppSurface, InteractivePanel } from './ui'

const TURN_MS = 11000
const QUESTION_END = 2300
const TOOL_START = 2800
const REPLY_START = 4300
const REPLY_END = 8500

function ResultCard ({ answer, copy }: { answer: ViolletChatAnswer; copy: ViolletChatCopy }) {
  const budget = answer.tool === 'create_budget'
  const bankContext = !budget && /transport|bank|banco|qik|banreservas/i.test(`${answer.id} ${answer.prompt} ${answer.result}`)
  const amounts = Array.from(answer.result.matchAll(/RD\$([\d,]+(?:\.\d+)?)/g), match => Number(match[1].replaceAll(',', '')))
  const maximum = Math.max(1, ...amounts)
  const rows = answer.result.split(' · ')

  return (
    <figure className={`${L.card} overflow-hidden p-3`}>
      <figcaption className={`mb-2 text-xs font-medium ${L.muted}`}>{copy.result}</figcaption>
      {bankContext && (
        <div className={`mb-3 flex items-center gap-4 border-b ${L.border} pb-3`} aria-hidden='true'>
          {/* Brands illustrate the ledger context, without inventing a bank breakdown. */}
          <img src='/case-studies/viollet/banks/qik.svg' alt='' className='h-6 w-12 object-contain' />
          <img src='/case-studies/viollet/banks/banreservas.svg' alt='' className='h-6 w-24 object-contain' />
        </div>
      )}
      <div className='space-y-3'>
        {rows.map((row, index) => (
          <div key={row}>
            <p className={`text-xs leading-relaxed ${L.fg}`}>{row}</p>
            <div className={`mt-2 h-2 overflow-hidden rounded-full ${L.secondary}`} aria-hidden='true'>
              <div
                className='h-full rounded-full'
                style={{
                  // The budget result has no numeric outcome, so its bar is decorative.
                  width: budget ? '100%' : `${((amounts[index] ?? maximum) / maximum) * 100}%`,
                  background: budget ? LC.primarySoft : LC.primary
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </figure>
  )
}

export default function ChatSim ({ copy, lang }: { copy: ViolletChatCopy, lang: 'es' | 'en' }) {
  void lang
  const duration = Math.max(1, copy.answers.length) * TURN_MS
  const timeline = useSceneTimeline(duration, { loop: true, hold: 3400 })
  const index = Math.min(copy.answers.length - 1, Math.floor(timeline.elapsed / TURN_MS))
  const answer = copy.answers[index]
  const elapsed = timeline.elapsed >= duration ? TURN_MS : timeline.elapsed % TURN_MS
  const question = answer ? typed(answer.prompt, span(elapsed, 0, QUESTION_END, linear)) : ''
  const reply = answer ? typed(answer.reply, span(elapsed, REPLY_START, REPLY_END, linear)) : ''
  const toolVisible = elapsed >= TOOL_START
  const replyVisible = elapsed >= REPLY_START

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.description} timeline={timeline}>
      <AppSurface>
        <div className={`overflow-hidden rounded-xl border ${L.border} bg-white`}>
          <div className={`flex items-center gap-2 border-b ${L.border} px-4 py-3`}>
            <Bot className={`size-4 ${L.primaryText}`} aria-hidden='true' />
            <span className={`text-sm font-medium ${L.fg}`}>{copy.assistant}</span>
            <div className='ml-auto flex gap-1.5' aria-hidden='true'>
              {copy.answers.map((item, position) => (
                <span key={item.id} className='size-1.5 rounded-full' style={{ background: position === index ? LC.primary : LC.border }} />
              ))}
            </div>
          </div>

          {/* A fixed viewport and reserved text keep typing and turn changes from moving the page. */}
          <div className='h-[620px] overflow-y-auto overscroll-contain p-4 sm:h-[560px] sm:p-5' role='region' aria-label={copy.transcriptLabel}>
            {answer && (
              <div className='flex min-w-0 flex-col gap-5'>
                <div className='flex flex-row-reverse items-start gap-2'>
                  <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${L.secondary}`}>
                    <User className={`size-4 ${L.muted}`} aria-hidden='true' />
                  </div>
                  <div className='max-w-[85%] min-w-0'>
                    <p className={`mb-1 text-right text-xs ${L.muted}`}>{copy.you}</p>
                    <div className={`grid rounded-xl ${L.primaryTint} px-3 py-2 text-sm leading-relaxed ${L.fg}`}>
                      <span className='invisible col-start-1 row-start-1 break-words' aria-hidden='true'>{answer.prompt}</span>
                      <span className='col-start-1 row-start-1 break-words'>
                        {question}
                        {elapsed < QUESTION_END && <span className={`ml-0.5 inline-block h-4 w-px align-middle ${L.primaryBg}`} aria-hidden='true' />}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex items-start gap-2'>
                  <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${L.primaryTint}`}>
                    <Bot className={`size-4 ${L.primaryText}`} aria-hidden='true' />
                  </div>
                  <div className='min-w-0 flex-1 space-y-3'>
                    <p className={`text-xs font-medium ${L.muted}`}>{copy.assistant}</p>
                    <div className={`flex items-center gap-2 text-xs ${L.muted}`} style={{ visibility: replyVisible ? 'hidden' : 'visible' }}>
                      <span className={`size-1.5 rounded-full ${L.primaryBg}`} aria-hidden='true' />
                      {copy.thinking}
                    </div>
                    <div className={`rounded-lg border ${L.border} ${L.secondary} p-3`} style={{ visibility: toolVisible ? 'visible' : 'hidden' }}>
                      <p className={`flex items-start gap-2 text-xs font-medium ${L.fg}`}>
                        <Wrench className={`size-3.5 shrink-0 ${L.primaryText}`} aria-hidden='true' />
                        <span className='min-w-0 break-words'>{copy.tool}: {answer.tool}</span>
                      </p>
                      <p className={`mt-2 break-words text-[11px] leading-relaxed ${L.mono} ${L.muted}`}>{answer.args}</p>
                    </div>
                    <div className={`grid text-sm leading-relaxed ${L.fg}`} style={{ visibility: replyVisible ? 'visible' : 'hidden' }}>
                      <p className='invisible col-start-1 row-start-1 break-words' aria-hidden='true'>{answer.reply}</p>
                      <p className='col-start-1 row-start-1 break-words'>{reply}</p>
                    </div>
                    <div style={{ visibility: replyVisible ? 'visible' : 'hidden' }}>
                      <ResultCard answer={answer} copy={copy} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </AppSurface>
    </InteractivePanel>
  )
}
