'use client'

import { FormEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useId, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Bot, Camera, CheckCircle, Image as ImageIcon, Loader, MoreVertical, Send, X } from 'lucide-react'
import { copy, type Lang } from './copy'
import {
  formatTime,
  matchPreset,
  materialize,
  nameOf,
  type ExerciseEntry,
  type FoodEntry
} from './data'
import { focusRing, tk, TkButton } from './ui'

export type ChatContext = 'dashboard' | 'food' | 'exercise'

interface SuccessCardData {
  id: string
  message: string
  title: string
  quantity: string
  subTitle: string
  subTitleUnit?: string
  items: { name: string, amount: string }[]
}

interface UserMessage {
  id: string
  role: 'user'
  text: string
  at: string
}

interface AssistantMessage {
  id: string
  role: 'assistant'
  text: string
  full: string
  at: string
  phase: 'thinking' | 'typing' | 'done'
  cards: SuccessCardData[]
  foods: FoodEntry[]
  exercises: ExerciseEntry[]
}

type ChatMessage = UserMessage | AssistantMessage

const DOTS = ['#3b82f6', '#22c55e', '#eab308']

function chatMeta (lang: Lang, context: ChatContext) {
  const text = copy[lang]
  if (context === 'food') {
    return { title: text.food.chatWithAI, placeholder: text.food.placeholder, instruction: text.food.instruction }
  }
  if (context === 'exercise') {
    return { title: text.exercise.chatWithAI, placeholder: text.exercise.placeholder, instruction: text.exercise.instruction }
  }
  return { title: text.dashboardChat.title, placeholder: text.dashboardChat.placeholder, instruction: text.dashboardChat.instruction }
}

function buildCards (foods: FoodEntry[], exercises: ExerciseEntry[], lang: Lang): SuccessCardData[] {
  const text = copy[lang]
  return [
    ...foods.map((food) => ({
      id: food.id,
      message: text.ai.consumptionAdded,
      title: nameOf(food, lang),
      quantity: `${food.grams} ${food.unit}`,
      subTitle: String(Math.round(food.kcal)),
      subTitleUnit: text.nutrition.calories,
      items: [
        { name: text.nutrition.protein, amount: `${Math.round(food.protein)} ${text.units.g}` },
        { name: text.nutrition.carbs, amount: `${Math.round(food.carbs)} ${text.units.g}` },
        { name: text.nutrition.fats, amount: `${Math.round(food.fat)} ${text.units.g}` }
      ]
    })),
    ...exercises.map((exercise) => ({
      id: exercise.id,
      message: text.ai.exerciseAdded,
      title: nameOf(exercise, lang),
      quantity: `${exercise.minutes} ${text.units.min}`,
      subTitle: text.meals[exercise.meal],
      items: [
        { name: text.exercise.energy, amount: `${exercise.kcal} ${text.units.kcal}` },
        { name: text.exercise.duration, amount: `${exercise.minutes} ${text.units.min}` },
        { name: text.exercise.effort, amount: text.exercise.efforts[exercise.effort] }
      ]
    }))
  ]
}

function SuccessLogCard ({ card }: { card: SuccessCardData }) {
  const text = card
  return (
    <article className='mx-auto my-3 w-full overflow-hidden rounded-xl border border-green-200 bg-green-50 shadow-lg'>
      <div className='p-4'>
        <div className='mb-3 flex items-center'>
          <CheckCircle className='mr-2 h-6 w-6 shrink-0 text-green-500' aria-hidden='true' />
          <span className='font-medium text-green-700'>{text.message}</span>
        </div>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <h3 className='text-lg font-semibold capitalize text-gray-800'>{text.title}</h3>
            <p className='text-xs text-gray-500'>{text.quantity}</p>
          </div>
          <div className='flex items-baseline'>
            <span className='text-2xl font-bold capitalize text-gray-900'>{text.subTitle}</span>
            {text.subTitleUnit && <span className='ml-1 text-sm text-gray-500'>{text.subTitleUnit}</span>}
          </div>
        </div>
        <div className='mt-4 flex flex-wrap gap-x-3 gap-y-2'>
          {text.items.map((item, index) => (
            <div key={item.name} className='flex items-center'>
              <span className='mr-2 h-3 w-3 rounded-full' style={{ backgroundColor: DOTS[index] ?? DOTS[0] }} />
              <span className='text-xs text-gray-600 md:text-sm'>
                <span className='font-medium'>{item.name}:</span> {item.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function AiChat ({
  open,
  lang,
  context,
  onClose,
  onLogged
}: {
  open: boolean
  lang: Lang
  context: ChatContext
  onClose: () => void
  onLogged: (foods: FoodEntry[], exercises: ExerciseEntry[]) => void
}) {
  const text = copy[lang]
  const meta = chatMeta(lang, context)
  const reduced = useReducedMotion()
  const reducedRef = useRef(reduced)
  reducedRef.current = reduced
  const onLoggedRef = useRef(onLogged)
  onLoggedRef.current = onLogged
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [note, setNote] = useState('')
  const dialogRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const lock = useRef(false)
  const titleId = useId()
  const busy = messages.some((message) => message.role === 'assistant' && message.phase !== 'done')
  const latestAssistant = [...messages].reverse().find((message) => message.role === 'assistant')
  const liveStatus = !latestAssistant || latestAssistant.role !== 'assistant'
    ? ''
    : latestAssistant.phase === 'thinking'
      ? text.ai.analyzing
      : latestAssistant.phase === 'done'
        ? latestAssistant.text
        : ''
  const usage = `${Math.max(messages.length ? 0.1 : 0, messages.length * 0.04).toFixed(1)} MB / 50 MB`

  useEffect(() => () => {
    timers.current.forEach((id) => window.clearTimeout(id))
  }, [])

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    const node = scrollRef.current
    if (!node) return
    node.scrollTo({ top: node.scrollHeight, behavior: reduced ? 'auto' : 'smooth' })
  }, [messages, open, reduced])

  function later (ms: number, fn: () => void) {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
  }

  function clearTimers () {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
    lock.current = false
  }

  function play (assistantId: string, full: string, foods: FoodEntry[], exercises: ExerciseEntry[]) {
    const finish = () => {
      lock.current = false
      setMessages((current) => current.map((message) => (
        message.id === assistantId && message.role === 'assistant'
          ? { ...message, phase: 'done', text: full }
          : message
      )))
      onLoggedRef.current(foods, exercises)
    }
    if (reducedRef.current === true) {
      finish()
      return
    }
    later(680, () => {
      let index = 0
      const step = () => {
        index += 2
        if (index >= full.length) {
          finish()
          return
        }
        const slice = full.slice(0, index)
        setMessages((current) => current.map((message) => (
          message.id === assistantId && message.role === 'assistant'
            ? { ...message, phase: 'typing', text: slice }
            : message
        )))
        later(18, step)
      }
      step()
    })
  }

  function send (raw: string) {
    const pending = raw.trim()
    if (!pending || busy || lock.current) return
    lock.current = true
    const { preset, score } = matchPreset(pending)
    const logged = materialize(preset)
    const at = new Date().toISOString()
    const userId = `user-${at}`
    const assistantId = `assistant-${at}`
    const full = score > 0 ? text.logged : text.loggedFallback
    const assistant: AssistantMessage = {
      id: assistantId,
      role: 'assistant',
      text: '',
      full,
      at,
      phase: 'thinking',
      cards: buildCards(logged.foods, logged.exercises, lang),
      foods: logged.foods,
      exercises: logged.exercises
    }
    setDraft('')
    setNote('')
    setMenuOpen(false)
    setMessages((current) => [...current, { id: userId, role: 'user', text: pending, at }, assistant])
    play(assistantId, full, logged.foods, logged.exercises)
  }

  function onSubmit (event: FormEvent) {
    event.preventDefault()
    send(draft)
  }

  function onDialogKeyDown (event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
      return
    }
    if (event.key !== 'Tab' || !dialogRef.current) return
    const nodes = [...dialogRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea')]
      .filter((node) => !node.hasAttribute('disabled'))
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if (!first || !last) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  if (!open) return null

  return (
    <div className='absolute inset-0 z-30 flex items-end justify-center sm:items-center'>
      <button type='button' className={`absolute inset-0 bg-black/80 ${focusRing}`} aria-label={text.close} onClick={onClose} />
      <div
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        onKeyDown={onDialogKeyDown}
        className={`relative z-10 flex max-h-[92%] w-[94%] max-w-xl flex-col gap-3 overflow-hidden rounded-lg border border-[hsl(217.2_32.6%_17.5%)] bg-[hsl(223_13%_10%)] p-4 text-[hsl(210_40%_98%)] shadow-lg sm:p-6 ${tk.fg}`}
      >
        <div className='flex items-start justify-between gap-3'>
          <h2 id={titleId} className='text-lg font-semibold leading-none tracking-tight'>{meta.title}</h2>
          <TkButton variant='ghost' size='icon' className='-mr-2 -mt-1' onClick={onClose} aria-label={text.close}>
            <X className='h-4 w-4' />
          </TkButton>
        </div>
        <div className='-mt-1 flex items-center justify-between gap-2'>
          <p className={`text-sm ${tk.muted}`}>{text.ai.description}</p>
          <div className='relative'>
            <TkButton
              variant='ghost'
              size='icon'
              aria-expanded={menuOpen}
              aria-haspopup='menu'
              aria-label={text.ai.options}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <MoreVertical className='h-4 w-4' />
            </TkButton>
            {menuOpen && (
              <div role='menu' className='absolute right-0 z-10 mt-1 w-48 rounded-md border border-[hsl(217.2_32.6%_17.5%)] bg-[hsl(222.2_84%_4.9%)] p-1 shadow-lg'>
                <button
                  type='button'
                  role='menuitem'
                  className={`w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-[hsl(217.2_32.6%_17.5%)] ${focusRing}`}
                  onClick={() => {
                    clearTimers()
                    setMessages([])
                    setMenuOpen(false)
                  }}
                >
                  {text.ai.clear}
                </button>
                <p className={`px-2 py-1.5 text-xs ${tk.muted}`}>{text.ai.storage} {usage}</p>
              </div>
            )}
          </div>
        </div>
        <p className='sr-only' aria-live='polite'>{liveStatus}</p>
        <div ref={scrollRef} className='min-h-16 flex-1 overflow-y-auto pr-1'>
          {messages.map((message, index) => {
            const previous = messages[index - 1]
            const dayKey = (iso: string) => {
              const date = new Date(iso)
              return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`
            }
            const showDay = index === 0 || dayKey(message.at) !== dayKey(previous?.at ?? message.at)
            return (
              <div key={message.id} className='mb-4'>
                {showDay && (
                  <div className='my-3 flex items-center gap-2'>
                    <span className='h-px flex-1 bg-[hsl(217.2_32.6%_17.5%)]' />
                    <span className={`whitespace-nowrap px-2 text-[10px] uppercase tracking-wider ${tk.muted}`}>
                      {new Date(message.at).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' })}
                    </span>
                    <span className='h-px flex-1 bg-[hsl(217.2_32.6%_17.5%)]' />
                  </div>
                )}
                {message.role === 'user' ? (
                  <div className='flex items-end justify-end gap-2'>
                    <div className='max-w-[80%] rounded-2xl border border-[hsl(210_40%_98%/0.4)] bg-[hsl(222.2_47.4%_11.2%/0.5)] px-3 py-2 text-sm shadow-sm'>
                      <p className='whitespace-pre-wrap break-words'>{message.text}</p>
                      <span className={`mt-2 block text-right text-[10px] uppercase tracking-wide ${tk.muted}`}>{formatTime(message.at, lang)}</span>
                    </div>
                    <img src='/images/projects/viollet-user.webp' alt='' className='h-7 w-7 rounded-full object-cover' />
                  </div>
                ) : (
                  <div className='space-y-2'>
                    {message.phase === 'thinking' ? (
                      <div className={`flex items-center py-2 ${tk.muted}`}>
                        <Loader className='me-2 h-4 w-4 animate-spin motion-reduce:animate-none' aria-hidden='true' />
                        {text.ai.analyzing}
                      </div>
                    ) : (
                      <div className='flex items-end justify-start gap-2'>
                        <Bot className='mb-1 h-5 w-5 shrink-0 text-green-500' aria-hidden='true' />
                        <div className='max-w-[80%] rounded-2xl border border-[hsl(217.2_32.6%_17.5%)] bg-[hsl(217.2_32.6%_17.5%/0.6)] px-3 py-2 text-sm shadow-sm'>
                          <p className='whitespace-pre-wrap break-words'>{message.text}</p>
                          <span className={`mt-2 block text-right text-[10px] uppercase tracking-wide ${tk.muted}`}>{formatTime(message.at, lang)}</span>
                        </div>
                      </div>
                    )}
                    {message.phase === 'done' && buildCards(message.foods, message.exercises, lang).map((card) => <SuccessLogCard key={card.id} card={card} />)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {note && <p className='text-xs text-amber-100' aria-live='polite'>{note}</p>}
        <div className='flex flex-wrap gap-2' aria-label={text.chatSuggestions}>
          {text.presets.map((preset) => (
            <button
              key={preset.id}
              type='button'
              disabled={busy}
              onClick={() => send(preset.label)}
              className={`max-w-full rounded-full border border-[hsl(217.2_32.6%_17.5%)] px-3 py-1.5 text-left text-xs text-[hsl(210_40%_98%)] hover:bg-[hsl(217.2_32.6%_17.5%)] disabled:opacity-50 ${focusRing}`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <form onSubmit={onSubmit}>
          <div className='flex items-center gap-2'>
            <TkButton variant='outline' size='icon' aria-label={text.ai.entryPhoto} disabled={busy} onClick={() => setNote(text.imageNote)}>
              <Camera className='h-4 w-4' />
            </TkButton>
            <TkButton variant='outline' size='icon' aria-label={text.ai.entryImage} disabled={busy} onClick={() => setNote(text.imageNote)}>
              <ImageIcon className='h-4 w-4' />
            </TkButton>
            <label className='sr-only' htmlFor='tracky-ai-input'>{meta.placeholder}</label>
            <input
              id='tracky-ai-input'
              ref={inputRef}
              value={draft}
              disabled={busy}
              placeholder={meta.placeholder}
              onChange={(event) => setDraft(event.target.value)}
              className={`h-12 min-w-0 flex-1 rounded-md border border-[hsl(217.2_32.6%_17.5%)] bg-transparent px-3 text-sm outline-none ${focusRing}`}
            />
            <TkButton type='submit' size='icon' disabled={busy || !draft.trim()} aria-label={text.send}>
              <Send className='h-4 w-4' />
            </TkButton>
          </div>
          <p className={`mt-1 text-xs leading-tight ${tk.muted}`}>{meta.instruction}</p>
        </form>
      </div>
    </div>
  )
}
