'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  Check,
  CheckCheck,
  EllipsisVertical,
  Megaphone,
  MegaphoneOff,
  Reply,
  RotateCcw,
  Search,
  SendHorizontal,
  Smile,
  Sticker,
  X
} from 'lucide-react'
import {
  FormEvent,
  KeyboardEvent,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  createContext
} from 'react'
import { COPY, NAMES, type Copy, type Lang, type Side } from './copy'

/** Blue focus ring inside the Chatify windows. Uses the same accent as the source app. */
const CHAT_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
const focusRing = CHAT_RING

const chatIconBtn =
  `inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md leading-none text-gray-700 transition duration-100 ease-out hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100 ${CHAT_RING}`

const composerBtn =
  `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md leading-none transition duration-100 ease-out hover:scale-125 motion-reduce:transition-none motion-reduce:hover:scale-100 ${CHAT_RING}`

const REACTIONS = ['👍', '🔥', '😂', '😮', '😢', '🙏', '😡']
const EMOJIS = ['😀', '😁', '😂', '😊', '😍', '😎', '🤔', '😅', '😢', '😮', '😡', '👍', '👏', '🙏', '🔥', '❤️', '🎉', '✅', '✨', '🚀', '👋', '💯', '🤝', '⭐']
const STICKERS = ['🎉', '😂', '🔥', '👍', '❤️', '👋', '🚀', '😎', '🙏', '💯', '🥳', '✨']

const MESSAGE_EVENTS = ['new_message', 'Turso INSERT', 'chat_message', 'delivered_message', 'read_message'] as const
const REACTION_EVENTS = ['edit_message', 'Turso UPDATE', 'update_message'] as const

interface SimMessage {
  id: string
  sender: Side
  body: string
  kind: 'text' | 'sticker'
  replyToId: string | null
  reactions: Partial<Record<Side, string>>
  createdAt: number
  isSent: boolean
  isDelivered: boolean
  isRead: boolean
  onReceiver: boolean
}

interface Trace {
  id: string
  event: string
  caption: string
}

interface Journey {
  messageId: string
  step: number
  mode: 'message' | 'reaction'
  holdRead: boolean
}

interface SendOpts {
  kind: 'text' | 'sticker'
  replyToId: string | null
}

interface SimApi {
  lang: Lang
  copy: Copy
  motionOk: boolean
  messages: SimMessage[]
  traces: Trace[]
  journey: Journey | null
  drafts: Record<Side, string>
  replyTo: Record<Side, string | null>
  scriptTyping: Side | null
  replaying: boolean
  mobileView: Side
  isDesktop: boolean
  setMobileView: (side: Side) => void
  setDraft: (side: Side, value: string) => void
  setReply: (side: Side, id: string | null) => void
  send: (side: Side, body: string, opts: SendOpts) => string
  react: (side: Side, messageId: string, emoji: string) => void
  markRead: (side: Side) => void
  noteUser: () => void
  startReplay: () => void
  uid: string
}

const SimContext = createContext<SimApi | null>(null)

function useSim () {
  const value = useContext(SimContext)
  if (!value) throw new Error('Chatify simulation is missing its provider')
  return value
}

function other (side: Side): Side {
  return side === 'frainer' ? 'laura' : 'frainer'
}

function canSee (message: SimMessage, viewer: Side) {
  return message.sender === viewer || message.onReceiver
}

function unreadFor (messages: SimMessage[], viewer: Side) {
  return messages.filter(message => message.sender !== viewer && message.onReceiver && !message.isRead).length
}

function formatTime (ms: number, lang: Lang, stable = false) {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-DO' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    ...(stable ? { timeZone: 'UTC' as const } : {})
  }).format(ms)
}

function isSingleEmoji (text: string) {
  const trimmed = text.trim()
  if (!trimmed) return false
  const chars = Array.from(trimmed.replace(/\uFE0F/g, ''))
  return chars.length === 1 && /\p{Extended_Pictographic}/u.test(chars[0] ?? '')
}

function buildSeed (copy: Copy): SimMessage[] {
  const base = Date.parse('2024-06-12T15:24:00.000Z')
  return copy.seed.map((line, index) => {
    const reactions: SimMessage['reactions'] = {}
    if (line.reaction) reactions[other(line.side)] = line.reaction
    return {
      id: `seed-${index}`,
      sender: line.side,
      body: line.body,
      kind: 'text',
      replyToId: null,
      reactions,
      createdAt: base + index * 60_000,
      isSent: true,
      isDelivered: true,
      isRead: true,
      onReceiver: true
    }
  })
}

function Avatar ({ side, size, className = '' }: { side: Side; size: number; className?: string }) {
  const box = { width: size, height: size, aspectRatio: '1 / 1', objectFit: 'cover' as const }
  if (side === 'frainer') {
    return (
      <img
        src='/images/projects/viollet-user.webp'
        alt=''
        aria-hidden='true'
        width={size}
        height={size}
        className={`inline-block shrink-0 rounded-full object-cover ${className}`}
        style={box}
      />
    )
  }
  return (
    <span
      aria-hidden='true'
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-green-500 font-semibold leading-none text-white ${className}`}
      style={{ ...box, fontSize: Math.max(11, Math.round(size * 0.4)) }}
    >
      L
    </span>
  )
}

function Ticks ({
  message,
  compact,
  sentLabel,
  deliveredLabel,
  readLabel
}: {
  message: SimMessage
  compact?: boolean
  sentLabel: string
  deliveredLabel: string
  readLabel: string
}) {
  const className = `inline h-4 w-4 shrink-0 text-[10px] ${compact ? 'mx-1' : ''} ${message.isRead ? 'text-blue-500' : 'text-gray-500'}`
  if (!message.isSent) return null
  if (message.isDelivered) {
    return <CheckCheck className={className} aria-label={message.isRead ? readLabel : deliveredLabel} />
  }
  return <Check className={className} aria-label={sentLabel} />
}

function stepCaption (copy: Copy, event: string) {
  if (event === 'new_message' || event === 'edit_message') return event === 'edit_message' ? copy.stepEdit : copy.stepEmit
  if (event.startsWith('Turso')) return copy.stepPersist
  if (event === 'chat_message') return copy.stepBroadcast
  if (event === 'update_message') return copy.stepUpdate
  if (event === 'delivered_message') return copy.stepDelivered
  return copy.stepRead
}

function Timeline () {
  const { copy, journey, traces, motionOk } = useSim()
  const events = journey?.mode === 'reaction' ? REACTION_EVENTS : MESSAGE_EVENTS
  const steps = events.map(event => ({ event, caption: stepCaption(copy, event) }))
  const active = journey ? journey.step : -1


  return (
    <div className='rounded-xl border border-gray-200 bg-white px-4 py-4'>
      <div className='flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1'>
        <h3 className='text-xs font-semibold text-gray-800'>{copy.timeline}</h3>
        <p className='text-[10px] text-gray-500'>{copy.gate}</p>
      </div>
      <div className='relative mt-3 h-24'>
        <div className='pointer-events-none absolute inset-x-0 top-[5px] h-px bg-gray-200' aria-hidden='true' />
        {motionOk && active >= 0 && (
          <motion.span
            key={journey?.messageId}
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 top-0 z-10 block h-2.5'
            initial={false}
            animate={{ x: `${((active + 0.5) / steps.length) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <span className='absolute left-0 top-0 size-2.5 -ml-[5px] rounded-full bg-blue-500 shadow-[0_0_0_4px_rgb(94_234_212/0.25)]' />
          </motion.span>
        )}
        <ol
          className='relative grid'
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((step, index) => {
            const waiting = Boolean(journey?.holdRead && journey.mode === 'message' && index === steps.length - 1 && active < index)
            const reached = active >= index && !waiting
            const current = active === index
            return (
              <li key={step.event} className='flex min-w-0 flex-col items-center gap-1 text-center' aria-current={current ? 'step' : undefined}>
                <span
                  aria-hidden='true'
                  className={`z-10 size-2.5 rounded-full border-2 ${reached ? 'border-blue-500 bg-blue-500' : 'border-gray-200 bg-white'}`}
                />
                <code className={`w-full break-all px-0.5 font-mono text-[10px] leading-tight ${reached || current ? 'font-semibold text-blue-500' : 'text-gray-500'}`} title={step.event}>
                  {step.event}
                </code>
                <span className='text-[10px] leading-tight text-gray-500'>{step.caption}</span>
              </li>
            )
          })}
        </ol>
      </div>

      <ol aria-live='polite' aria-relevant='additions' className='mt-2 h-24 space-y-1 overflow-y-auto [scrollbar-color:#475569_transparent] [scrollbar-width:thin]'>
        {traces.length === 0 && <li className='text-[11px] text-gray-500'>{copy.idle}</li>}
        {traces.slice(-4).map(trace => (
          <li key={trace.id} className='flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[11px]'>
            <code className='font-mono text-blue-500'>{trace.event}</code>
            <span className='text-gray-500'>{trace.caption}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function ChatWindow ({ side }: { side: Side }) {
  const sim = useSim()
  const {
    copy, lang, motionOk, messages, drafts, replyTo, scriptTyping, uid
  } = sim
  const contact = other(side)
  const listRef = useRef<HTMLUListElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const flashTimer = useRef<number | null>(null)
  const [picker, setPicker] = useState<'emoji' | 'sticker' | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarQuery, setSidebarQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [muted, setMuted] = useState(false)
  const [pinned, setPinned] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const inputId = `${uid}-${side}-input`
  const visible = messages.filter(message => {
    if (!canSee(message, side)) return false
    const query = searchQuery.trim().toLowerCase()
    return query.length === 0 || message.body.toLowerCase().includes(query)
  })
  const last = [...messages].reverse().find(message => canSee(message, side))
  const unread = unreadFor(messages, side)
  const otherTyping = scriptTyping === contact || drafts[contact].trim().length > 0
  const staged = messages.find(message => message.id === replyTo[side]) ?? null
  const chatVisible = NAMES[contact].toLowerCase().includes(sidebarQuery.trim().toLowerCase())

  useEffect(() => {
    const node = listRef.current
    if (!node) return
    node.scrollTo({ top: node.scrollHeight, behavior: motionOk ? 'smooth' : 'auto' })
  }, [visible.length, last?.id, last?.isRead, last?.isDelivered, otherTyping, motionOk, searchQuery])

  useEffect(() => () => {
    if (flashTimer.current) window.clearTimeout(flashTimer.current)
  }, [])

  useEffect(() => {
    function onPointer (event: MouseEvent) {
      const target = event.target as Node
      if (menuRef.current && !menuRef.current.contains(target)) setMenuOpen(false)
      if (formRef.current && !formRef.current.contains(target)) setPicker(null)
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [])

  function flashMessage (id: string) {
    setFlash(id)
    if (flashTimer.current) window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => {
      setFlash(current => current === id ? null : current)
    }, 1200)
  }

  function jumpTo (id: string) {
    const node = listRef.current?.querySelector<HTMLElement>(`[data-id="${id}"]`)
    node?.scrollIntoView({ behavior: motionOk ? 'smooth' : 'auto', block: 'center' })
    flashMessage(id)
  }

  function onDraft (value: string) {
    sim.noteUser()
    sim.setDraft(side, value)
  }

  function submit (event: FormEvent) {
    event.preventDefault()
    const text = drafts[side].trim()
    if (!text) return
    sim.noteUser()
    sim.send(side, text, { kind: 'text', replyToId: replyTo[side] })
    sim.setDraft(side, '')
    sim.setReply(side, null)
    setPicker(null)
  }

  function sendQuick (text: string) {
    sim.noteUser()
    sim.send(side, text, { kind: 'text', replyToId: replyTo[side] })
    sim.setReply(side, null)
    setPicker(null)
    inputRef.current?.focus()
  }

  function sendSticker (emoji: string) {
    sim.noteUser()
    sim.send(side, emoji, { kind: 'sticker', replyToId: replyTo[side] })
    sim.setReply(side, null)
    setPicker(null)
  }

  function onReact (messageId: string, emoji: string) {
    sim.noteUser()
    sim.react(side, messageId, emoji)
    setPinned(null)
  }

  function beginReply (messageId: string) {
    sim.noteUser()
    sim.setReply(side, messageId)
    setPinned(null)
    inputRef.current?.focus()
  }

  const pill = side === 'frainer' ? copy.youPill : copy.samplePill

  return (
    <section
      id={`${uid}-panel-${side}`}
      role='region'
      aria-label={copy.windowLabel(NAMES[side])}
      onKeyDown={event => {
        if (event.key !== 'Escape') return
        setPicker(null)
        setMenuOpen(false)
        setPinned(null)
        setSearchOpen(false)
        setSearchQuery('')
        sim.setReply(side, null)
      }}
      className={`flex @container h-[32rem] min-w-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-[#fffffe] font-sans text-gray-800`}
    >
      <header className='flex items-center justify-between gap-2 border-b border-gray-200 bg-gray-200 px-3 py-3 @md:hidden'>
        <Avatar side={side} size={40} className='h-10 w-10' />
        <span className='inline-flex h-5 shrink-0 items-center justify-center rounded-full bg-blue-500 px-2 text-[10px] font-medium leading-none text-white'>
          {pill}
        </span>
      </header>
      <div className='flex min-h-0 min-w-0 flex-1'>
        <aside className='hidden min-h-0 w-[32%] min-w-[8.5rem] max-w-[14rem] shrink-0 flex-col border-r border-gray-200 @md:flex'>
          <header className='flex items-center justify-between gap-1 rounded-sm border-b border-gray-200 bg-gray-200 px-2 py-3'>
            <Avatar side={side} size={40} className='h-10 w-10' />
            <span className='inline-flex h-5 shrink-0 items-center justify-center rounded-full bg-blue-500 px-2 text-[10px] font-medium leading-none text-white'>
              {pill}
            </span>
          </header>
          <div className='relative mb-2 mt-2 w-full px-2'>
            <label className='sr-only' htmlFor={`${uid}-${side}-chats`}>{copy.searchBtn}</label>
            <input
              id={`${uid}-${side}-chats`}
              value={sidebarQuery}
              onChange={event => setSidebarQuery(event.target.value)}
              placeholder={copy.searchBtn}
              className={`w-full rounded-lg bg-gray-200 px-2 py-2 text-sm text-gray-800 outline-none placeholder-gray-700 focus:border-gray-300 ${CHAT_RING}`}
            />
          </div>
          <nav className='min-h-0 flex-1 px-1 pb-2'>
            <ul className='h-full overflow-y-auto scroll-smooth pb-6 [scrollbar-color:#9ca3af_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-[5px] [&::-webkit-scrollbar-thumb]:bg-[#9ca3af]'>
              {chatVisible && last && (
                <li
                  className='group flex w-full cursor-default items-center space-x-2 rounded-md border border-transparent border-b-gray-300 bg-gray-300 px-2 py-2'
                  aria-current='true'
                >
                  <Avatar side={contact} size={48} className='h-12 w-12' />
                  <article className='w-full min-w-0 items-center overflow-hidden text-left'>
                    <div className='flex w-full flex-grow justify-between gap-1 text-left'>
                      <h2 className='inline-flex min-w-0 items-center truncate text-base font-medium capitalize'>
                        {NAMES[contact]}
                      </h2>
                      <time
                        className='mt-1 inline-flex shrink-0 text-right text-xs text-gray-500'
                        dateTime={new Date(last.createdAt).toISOString()}
                      >
                        {formatTime(last.createdAt, lang, last.id.startsWith('seed-'))}
                      </time>
                    </div>
                    <aside className='flex w-full flex-grow items-center justify-between text-left text-gray-500'>
                      <p className='inline-block min-w-0 max-w-full flex-1 truncate text-sm'>
                        {last.sender === side && (
                          <Ticks
                            message={last}
                            compact
                            sentLabel={copy.tickSent}
                            deliveredLabel={copy.tickDelivered}
                            readLabel={copy.tickRead}
                          />
                        )}
                        {last.kind === 'sticker' && (
                          <Sticker className='me-1 inline h-4 w-4 align-middle' aria-hidden='true' />
                        )}
                        <span className='align-middle font-medium'>{last.body}</span>
                      </p>
                      <span className='flex shrink-0 space-x-2'>
                        {muted && <MegaphoneOff className='h-4 w-4' aria-label={copy.mute} />}
                        {unread > 0 && (
                          <span className='inline-flex h-5 min-w-5 items-center justify-center whitespace-nowrap rounded-full border border-blue-500 bg-blue-500 px-1 text-xs font-medium leading-none text-white'>
                            {unread}
                          </span>
                        )}
                      </span>
                    </aside>
                  </article>
                </li>
              )}
              {!chatVisible && (
                <li className='px-2 py-4 text-center text-sm font-medium'>{copy.chatNotFound}</li>
              )}
            </ul>
          </nav>
        </aside>
        <main className='relative flex min-h-0 min-w-0 max-w-full flex-1 flex-col'>
          <header className='relative flex min-w-0 justify-between gap-2 border-b border-gray-200 py-3'>
            <article className='flex min-w-0 gap-2'>
              <span className='relative shrink-0'>
                <Avatar side={contact} size={40} className='h-10 w-10' />
                <span aria-hidden='true' className='absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#fffffe] bg-green-500' />
              </span>
              <div className='my-auto min-w-0'>
                <h2 className='truncate text-sm font-bold capitalize md:text-base'>
                  {NAMES[contact]}
                </h2>
                <p className='truncate text-[11px] leading-tight'>
                  {otherTyping
                    ? <span className='text-blue-600'>{copy.typing}</span>
                    : <span className='text-green-500'>{copy.online}</span>}
                </p>
              </div>
            </article>
            <aside className='me-1 mt-1 flex shrink-0 items-start space-x-2 md:me-3 md:mt-3 md:space-x-6'>
              <span className='flex'>
                {searchOpen && (
                  <div className='absolute left-2 right-2 top-full z-30 mt-1'>
                    <label className='sr-only' htmlFor={`${uid}-${side}-search`}>{copy.search}</label>
                    <input
                      id={`${uid}-${side}-search`}
                      value={searchQuery}
                      onChange={event => setSearchQuery(event.target.value)}
                      placeholder={copy.search}
                      className={`w-full rounded-full border-0 bg-white px-3 py-1 text-xs text-gray-800 outline-none ring-2 ring-blue-500 placeholder:text-gray-500 ${CHAT_RING}`}
                    />
                  </div>
                )}
                <button
                  type='button'
                  className={`${chatIconBtn} ${searchOpen ? 'bg-gray-200 text-gray-800' : ''}`}
                  aria-pressed={searchOpen}
                  aria-label={searchOpen ? copy.closeSearch : copy.searchBtn}
                  onClick={() => {
                    setSearchOpen(open => !open)
                    if (searchOpen) setSearchQuery('')
                  }}
                >
                  <Search className='h-5 w-5' aria-hidden='true' />
                </button>
              </span>
              <div className='relative' ref={menuRef}>
                <button
                  type='button'
                  className={`${chatIconBtn} hover:contrast-200 ${menuOpen ? 'text-gray-800' : ''}`}
                  aria-label={copy.options}
                  aria-haspopup='menu'
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen(open => !open)}
                >
                  <EllipsisVertical className='h-5 w-5' aria-hidden='true' />
                </button>
                <div
                  role='menu'
                  className={`z-30 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow ${menuOpen ? 'absolute right-0 mt-2' : 'hidden'}`}
                >
                  <ul className='py-2 text-sm text-gray-700'>
                    <li>
                      <button
                        type='button'
                        role='menuitem'
                        className={`flex h-9 w-full items-center px-4 text-left align-middle text-sm leading-none hover:bg-gray-100 ${CHAT_RING}`}
                        onClick={() => {
                          setMuted(value => !value)
                          setMenuOpen(false)
                        }}
                      >
                        {muted ? <Megaphone className='me-2 inline h-5 w-5' aria-hidden='true' /> : <MegaphoneOff className='me-2 inline h-5 w-5' aria-hidden='true' />}
                        {muted ? copy.unmute : copy.mute}
                      </button>
                    </li>
                    <li>
                      <button
                        type='button'
                        role='menuitem'
                        className={`flex h-9 w-full items-center px-4 text-left align-middle text-sm leading-none hover:bg-gray-100 disabled:opacity-40 ${CHAT_RING}`}
                        disabled={unread === 0}
                        onClick={() => {
                          sim.noteUser()
                          sim.markRead(side)
                          setMenuOpen(false)
                        }}
                      >
                        <CheckCheck className='me-2 inline h-5 w-5' aria-hidden='true' />
                        {copy.markRead}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </header>
          <ul
            ref={listRef}
            className='min-h-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto scroll-smooth px-2 pb-2 pt-12 [scrollbar-color:#9ca3af_transparent] [scrollbar-width:thin] md:px-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-[5px] [&::-webkit-scrollbar-thumb]:bg-[#9ca3af]'
            aria-label={copy.windowLabel(NAMES[side])}
          >
            {visible.length === 0 && (
              <li className='pt-6 text-center text-sm text-gray-500'>{copy.noMatches}</li>
            )}
            {visible.map(message => {
              const isMe = message.sender === side
              const quoted = message.replyToId ? messages.find(item => item.id === message.replyToId) ?? null : null
              const quotedMine = quoted?.sender === side
              const bigEmoji = message.kind === 'text' && isSingleEmoji(message.body)
              const shown = pinned === message.id
              const reactions = reactionEntries(message.reactions)
              const accent = quotedMine ? 'border-blue-500 text-blue-500' : 'border-green-500 text-green-500'
              return (
                <li
                  key={message.id}
                  data-id={message.id}
                  className={`group relative flex w-full max-w-full flex-col space-y-2 ${isMe ? 'items-end' : 'items-start'} ${pinned === message.id ? 'z-20' : ''} hover:z-20 focus-within:z-20`}
                >
                  <div className={`flex w-full items-start gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className='mt-2 hidden h-7 w-7 shrink-0 md:inline-flex'>
                      <Avatar side={message.sender} size={28} className='h-7 w-7' />
                    </span>
                    <aside className={`flex min-w-0 max-w-full items-center ${isMe ? 'place-content-start' : 'place-content-end'}`}>
                      <div
                        data-actions={message.id}
                        role='group'
                        aria-label={copy.messageActions}
                        className={`absolute -top-10 z-20 flex w-max max-w-full flex-wrap items-center gap-1 rounded-md border border-gray-200 bg-white/80 p-1 shadow-sm backdrop-blur-3xl transition-opacity duration-150 ease-in-out motion-reduce:transition-none ${isMe ? 'right-0' : 'left-0'} ${shown ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100'}`}
                      >
                        {REACTIONS.map(emoji => (
                          <button
                            key={emoji}
                            type='button'
                            aria-label={copy.reactWith(emoji)}
                            aria-pressed={message.reactions[side] === emoji}
                            className={`inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded px-1 text-sm leading-none text-gray-800 transition duration-100 ease-linear hover:scale-110 hover:text-blue-500 motion-reduce:transition-none motion-reduce:hover:scale-100 ${CHAT_RING} ${message.reactions[side] === emoji ? 'bg-blue-100' : ''}`}
                            onClick={() => onReact(message.id, emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                        <button
                          type='button'
                          aria-label={copy.reply}
                          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded leading-none text-gray-800 transition duration-100 ease-linear hover:scale-110 hover:text-blue-500 motion-reduce:transition-none motion-reduce:hover:scale-100 ${CHAT_RING}`}
                          onClick={() => beginReply(message.id)}
                        >
                          <Reply className='h-5 w-5' aria-hidden='true' />
                        </button>
                      </div>
                      <div className='relative mt-1 max-w-full'>
                        <article
                          onClick={event => {
                            if ((event.target as HTMLElement).closest('button')) return
                            setPinned(current => current === message.id ? null : message.id)
                          }}
                          className={`w-fit max-w-[min(20rem,100%)] cursor-pointer items-center whitespace-normal break-words rounded-lg border border-transparent md:max-w-[min(36rem,100%)] ${isMe ? 'bg-gray-300' : 'bg-gray-100'} ${message.kind !== 'sticker' ? 'px-1 pb-1 ps-1 pt-1' : ''} ${flash === message.id ? 'ring-2 ring-blue-500' : ''}`}
                        >
                          {quoted && (
                            <button
                              type='button'
                              onClick={event => {
                                event.stopPropagation()
                                jumpTo(quoted.id)
                              }}
                              className={`mb-1 flex w-full cursor-pointer flex-col whitespace-normal break-words rounded-lg border-l-4 bg-gray-100 px-2 text-left ${accent} ${CHAT_RING}`}
                            >
                              <p className='my-1 text-xs font-medium'>{quotedMine ? copy.you : NAMES[quoted.sender]}</p>
                              <p className='line-clamp-2 max-w-md truncate pb-2 pr-6 text-xs font-normal text-gray-600'>{quoted.body}</p>
                            </button>
                          )}
                          {message.kind === 'sticker' && (
                            <p className='px-1 text-6xl leading-none'>{message.body}</p>
                          )}
                          <div className={`${!bigEmoji && message.kind !== 'sticker' ? 'flex h-full justify-between ps-1' : ''}`}>
                            {message.kind !== 'sticker'
                              ? (
                                <p className={`inline w-full align-middle font-medium ${bigEmoji ? 'text-5xl' : 'text-sm'}`}>
                                  {message.body}{' '}
                                  <span className={`float-end ms-2 inline-flex items-end space-x-1 whitespace-nowrap text-xs font-normal text-gray-500 ${bigEmoji ? 'mt-1' : 'mt-2'}`}>
                                    <time className='text-[10px]' dateTime={new Date(message.createdAt).toISOString()}>
                                      {formatTime(message.createdAt, lang, message.id.startsWith('seed-'))}
                                    </time>
                                    {isMe && (
                                      <Ticks message={message} sentLabel={copy.tickSent} deliveredLabel={copy.tickDelivered} readLabel={copy.tickRead} />
                                    )}
                                  </span>
                                </p>
                                )
                              : (
                                <p className='inline w-full align-middle'>
                                  <span className='float-end ms-2 mt-1 inline-flex items-center space-x-1 whitespace-nowrap pe-1 text-xs font-normal text-gray-500'>
                                    <time className='text-[10px]' dateTime={new Date(message.createdAt).toISOString()}>
                                      {formatTime(message.createdAt, lang, message.id.startsWith('seed-'))}
                                    </time>
                                    {isMe && (
                                      <Ticks message={message} sentLabel={copy.tickSent} deliveredLabel={copy.tickDelivered} readLabel={copy.tickRead} />
                                    )}
                                  </span>
                                </p>
                                )}
                          </div>
                        </article>
                        {reactions.length > 0 && (
                          <span className={`${isMe ? 'me-2 justify-end' : 'ms-2 justify-start'} z-20 m-0 flex`}>
                            {reactions.map(([emoji, count]) => (
                              <span
                                key={emoji}
                                className={`${isMe ? 'border border-gray-200 bg-gray-100' : 'border border-gray-100 bg-gray-200'} -mt-2 mb-0 rounded-full px-[5px] py-[1px] text-sm`}
                              >
                                {emoji}
                                {count > 1 && <small className='text-xs font-medium'>{count}</small>}
                              </span>
                            ))}
                          </span>
                        )}
                      </div>
                    </aside>
                  </div>
                </li>
              )
            })}
            {otherTyping && (
              <li className='flex items-start gap-2' aria-label={copy.typingLabel(NAMES[contact])}>
                <span className='mt-2 hidden h-7 w-7 shrink-0 md:inline-flex'>
                  <Avatar side={contact} size={28} className='h-7 w-7' />
                </span>
                <span className='mt-1 rounded-lg border border-transparent bg-gray-100 px-3 py-2'>
                  <span className='flex items-center gap-1' aria-hidden='true'>
                    {[0, 1, 2].map(dot => (
                      <span
                        key={dot}
                        className={`size-1.5 rounded-full bg-gray-500 ${motionOk ? 'animate-bounce motion-reduce:animate-none' : ''}`}
                        style={motionOk ? { animationDelay: `${dot * 120}ms` } : undefined}
                      />
                    ))}
                  </span>
                </span>
              </li>
            )}
          </ul>
          <form ref={formRef} className='relative w-full max-w-full shrink-0 border-t border-gray-200 p-2' onSubmit={submit}>
            {staged && (
              <span className={`relative mx-5 mb-3 flex flex-col whitespace-normal break-words rounded-lg border-l-[5px] bg-gray-100 px-4 py-5 ${staged.sender === side ? 'border-blue-500 text-blue-500' : 'border-green-500 text-green-500'}`}>
                <button
                  type='button'
                  aria-label={copy.cancelReply}
                  className={`absolute right-0 top-0 m-2 inline-flex h-8 w-8 items-center justify-center rounded-md leading-none text-gray-500 duration-100 ease-in-out hover:scale-110 hover:text-gray-800 motion-reduce:transition-none motion-reduce:hover:scale-100 ${CHAT_RING}`}
                  onClick={() => sim.setReply(side, null)}
                >
                  <X className='h-5 w-5' aria-hidden='true' />
                </button>
                <p className='pe-8 text-xs font-medium'>
                  {copy.replyingTo(staged.sender === side ? copy.yourself : NAMES[staged.sender])}
                </p>
                <p className='mt-1 line-clamp-2 max-w-full pe-8 text-xs text-gray-600'>{staged.body}</p>
              </span>
            )}
            <div className='mb-2 flex max-w-full gap-2 overflow-x-auto px-1' aria-label={copy.quick}>
              {copy.quickReplies[side].map(text => (
                <button
                  key={text}
                  type='button'
                  className={`inline-flex h-8 shrink-0 items-center justify-center rounded-full bg-gray-200 px-3 text-xs font-medium leading-none text-gray-800 transition hover:bg-gray-300 motion-reduce:transition-none ${CHAT_RING}`}
                  onClick={() => sendQuick(text)}
                >
                  {text}
                </button>
              ))}
            </div>
            {picker && (
              <div
                id={`${inputId}-${picker}`}
                className='absolute bottom-full left-0 z-30 mb-1 w-full max-w-full rounded-lg border border-gray-200 bg-white p-2 shadow-lg'
              >
                <p className='mb-1 px-0.5 text-[10px] font-medium text-gray-500'>
                  {picker === 'emoji' ? copy.emojis : copy.stickerNote}
                </p>
                <div className={picker === 'emoji' ? 'grid grid-cols-8 gap-0.5' : 'grid grid-cols-4 gap-1 sm:grid-cols-6'}>
                  {(picker === 'emoji' ? EMOJIS : STICKERS).map(emoji => (
                    <button
                      key={emoji}
                      type='button'
                      aria-label={emoji}
                      className={`inline-flex items-center justify-center rounded-md leading-none hover:bg-gray-100 ${CHAT_RING} ${picker === 'emoji' ? 'h-9 text-lg' : 'h-12 text-2xl'}`}
                      onMouseDown={event => event.preventDefault()}
                      onClick={() => {
                        if (picker === 'emoji') {
                          onDraft(`${drafts[side]}${emoji}`)
                          inputRef.current?.focus()
                        } else {
                          sendSticker(emoji)
                        }
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <aside className='flex items-center space-x-2 text-gray-600 sm:space-x-3'>
              <button
                type='button'
                name='emoji'
                title={copy.emojis}
                aria-label={copy.emojis}
                aria-pressed={picker === 'emoji'}
                aria-controls={`${inputId}-emoji`}
                className={`${composerBtn} ${picker === 'emoji' ? 'text-blue-500' : 'text-gray-600'}`}
                onClick={() => setPicker(current => current === 'emoji' ? null : 'emoji')}
              >
                <Smile className='h-6 w-6' aria-hidden='true' />
              </button>
              <button
                type='button'
                name='gif'
                title={copy.stickers}
                aria-label={copy.stickers}
                aria-pressed={picker === 'sticker'}
                aria-controls={`${inputId}-sticker`}
                className={`${composerBtn} ${picker === 'sticker' ? 'text-blue-500' : 'text-gray-600'}`}
                onClick={() => setPicker(current => current === 'sticker' ? null : 'sticker')}
              >
                <Sticker className='h-6 w-6' aria-hidden='true' />
              </button>
              <label className='sr-only' htmlFor={inputId}>{copy.placeholder}</label>
              <input
                ref={inputRef}
                id={inputId}
                name='content'
                value={drafts[side]}
                onChange={event => onDraft(event.target.value.slice(0, 500))}
                onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                  if (event.key === 'Escape') {
                    setPicker(null)
                    sim.setReply(side, null)
                  }
                }}
                placeholder={copy.placeholder}
                autoComplete='off'
                className={`mx-1 h-10 min-w-0 flex-1 rounded-full border-0 bg-transparent px-3 py-2 text-sm text-gray-800 placeholder:text-gray-500 sm:mx-3 ${CHAT_RING}`}
              />
              <button
                type='submit'
                className={`${composerBtn} text-gray-600 hover:text-gray-700 disabled:opacity-40 disabled:hover:scale-100`}
                aria-label={copy.send}
                disabled={drafts[side].trim().length === 0}
              >
                <SendHorizontal className='h-6 w-6' aria-hidden='true' />
              </button>
            </aside>
          </form>
        </main>
      </div>
    </section>
  )
}

function reactionEntries (reactions: SimMessage['reactions']) {
  const counts = new Map<string, number>()
  ;(Object.keys(reactions) as Side[]).forEach(key => {
    const emoji = reactions[key]
    if (!emoji) return
    counts.set(emoji, (counts.get(emoji) ?? 0) + 1)
  })
  return [...counts.entries()]
}

export default function ChatifyLiveSim ({ lang }: { lang: Lang }) {
  const copy = COPY[lang]
  const motionOk = useReducedMotion() === false
  const uid = useId()
  const rootRef = useRef<HTMLElement>(null)
  const messagesRef = useRef<SimMessage[]>([])
  const focusRef = useRef({ desktop: false, view: 'frainer' as Side })
  const scriptTypingRef = useRef<Side | null>(null)
  const token = useRef(0)
  const pipeGen = useRef(0)
  const seq = useRef(0)
  const traceSeq = useRef(0)
  const readTraced = useRef(new Set<string>())
  const replayTimers = useRef<number[]>([])
  const pipelineTimers = useRef<number[]>([])
  const autoplayed = useRef(false)
  const interacted = useRef(false)
  const api = useRef<Pick<SimApi, 'send' | 'react' | 'startReplay'>>({
    send: () => '',
    react: () => undefined,
    startReplay: () => undefined
  })

  const [messages, setMessages] = useState<SimMessage[]>(() => buildSeed(copy))
  const [traces, setTraces] = useState<Trace[]>([])
  const [journey, setJourney] = useState<Journey | null>(null)
  const [drafts, setDrafts] = useState<Record<Side, string>>({ frainer: '', laura: '' })
  const [replyTo, setReplyTo] = useState<Record<Side, string | null>>({ frainer: null, laura: null })
  const [scriptTyping, setScriptTyping] = useState<Side | null>(null)
  const [replaying, setReplaying] = useState(false)
  const [mobileView, setMobileView] = useState<Side>('frainer')
  const [isDesktop, setIsDesktop] = useState(false)

  messagesRef.current = messages
  focusRef.current.view = mobileView

  function focused (_side: Side) {
    // Both sessions remain visible, including on mobile.
    return true
  }

  function addTrace (event: string, caption: string) {
    traceSeq.current += 1
    const item = { id: `t-${traceSeq.current}`, event, caption }
    setTraces(prev => [...prev.slice(-11), item])
  }

  function setTyping (side: Side | null) {
    scriptTypingRef.current = side
    setScriptTyping(side)
  }

  function clearPipeline () {
    pipeGen.current += 1
    pipelineTimers.current.forEach(id => window.clearTimeout(id))
    pipelineTimers.current = []
  }

  function later (fn: () => void, ms: number) {
    const gen = pipeGen.current
    const id = window.setTimeout(() => {
      if (pipeGen.current !== gen) return
      fn()
    }, ms)
    pipelineTimers.current.push(id)
  }

  function haltScript () {
    token.current += 1
    replayTimers.current.forEach(id => window.clearTimeout(id))
    replayTimers.current = []
    const typingSide = scriptTypingRef.current
    if (typingSide) {
      scriptTypingRef.current = null
      setScriptTyping(null)
      setDrafts(current => ({ ...current, [typingSide]: '' }))
    }
    setReplaying(false)
  }

  function noteUser () {
    interacted.current = true
    haltScript()
  }

  function send (sender: Side, body: string, opts: SendOpts) {
    const text = body.trim()
    if (!text) return ''
    const id = `m-${seq.current + 1}`
    seq.current += 1
    const message: SimMessage = {
      id,
      sender,
      body: text,
      kind: opts.kind,
      replyToId: opts.replyToId,
      reactions: {},
      createdAt: Date.now(),
      isSent: true,
      isDelivered: false,
      isRead: false,
      onReceiver: false
    }
    setMessages(prev => [...prev, message])
    addTrace('new_message', copy.traceEmit(NAMES[sender]))
    setJourney({ messageId: id, step: 0, mode: 'message', holdRead: false })
    const receiver = other(sender)
    const gap = motionOk ? 340 : 0
    later(() => {
      addTrace('Turso INSERT', copy.traceTurso)
      setJourney(current => current && current.messageId === id ? { ...current, step: 1 } : current)
    }, gap)
    later(() => {
      setMessages(prev => prev.map(item => item.id === id ? { ...item, onReceiver: true } : item))
      addTrace('chat_message', copy.traceBroadcast)
      setJourney(current => current && current.messageId === id ? { ...current, step: 2 } : current)
    }, gap * 2)
    later(() => {
      setMessages(prev => prev.map(item => item.id === id ? { ...item, isDelivered: true } : item))
      addTrace('delivered_message', copy.traceDelivered(NAMES[receiver]))
      setJourney(current => current && current.messageId === id ? { ...current, step: 3, holdRead: false } : current)
    }, gap * 3)
    later(() => {
      if (readTraced.current.has(id)) {
        setJourney(current => current && current.messageId === id ? { ...current, step: 4, holdRead: false } : current)
        return
      }
      if (!focused(receiver)) {
        setJourney(current => current && current.messageId === id ? { ...current, step: 3, holdRead: true } : current)
        return
      }
      readTraced.current.add(id)
      setMessages(prev => prev.map(item => item.id === id ? { ...item, isDelivered: true, isRead: true } : item))
      addTrace('read_message', copy.traceRead(NAMES[receiver]))
      setJourney(current => current && current.messageId === id ? { ...current, step: 4, holdRead: false } : current)
    }, gap * 4)
    return id
  }

  function react (side: Side, messageId: string, emoji: string) {
    const message = messagesRef.current.find(item => item.id === messageId)
    if (!message || message.reactions[side] === emoji || !canSee(message, side)) return
    const journeyId = `react-${messageId}-${traceSeq.current + 1}`
    setJourney({ messageId: journeyId, step: 0, mode: 'reaction', holdRead: false })
    addTrace('edit_message', copy.traceEdit(NAMES[side]))
    const gap = motionOk ? 280 : 0
    later(() => {
      addTrace('Turso UPDATE', copy.traceTursoUpdate)
      setJourney(current => current && current.messageId === journeyId ? { ...current, step: 1 } : current)
    }, gap)
    later(() => {
      setMessages(prev => prev.map(item => item.id === messageId ? { ...item, reactions: { ...item.reactions, [side]: emoji } } : item))
      addTrace('update_message', copy.traceUpdate)
      setJourney(current => current && current.messageId === journeyId ? { ...current, step: 2 } : current)
    }, gap * 2)
  }

  function markRead (viewer: Side) {
    const snapshot = messagesRef.current
    const ids = snapshot
      .filter(message => message.sender !== viewer && message.onReceiver && !message.isRead && !readTraced.current.has(message.id))
      .map(message => message.id)
    if (ids.length === 0) return
    ids.forEach(id => readTraced.current.add(id))
    setMessages(prev => prev.map(message => ids.includes(message.id) ? { ...message, isDelivered: true, isRead: true } : message))
    addTrace('read_message', copy.traceRead(NAMES[viewer]))
    setJourney(current => current && current.mode === 'message' && ids.includes(current.messageId) ? { ...current, step: 4, holdRead: false } : current)
  }

  function setDraft (side: Side, value: string) {
    setDrafts(current => ({ ...current, [side]: value }))
  }

  function setReply (side: Side, id: string | null) {
    setReplyTo(current => ({ ...current, [side]: id }))
  }

  function startReplay () {
    haltScript()
    const my = token.current
    clearPipeline()
    readTraced.current.clear()
    setReplaying(true)
    setTyping(null)
    setDrafts({ frainer: '', laura: '' })
    setReplyTo({ frainer: null, laura: null })
    setMessages(buildSeed(copy))
    setTraces([])
    setJourney(null)
    const ids: string[] = []
    let cursor = motionOk ? 420 : 0
    const typeMs = motionOk ? 560 : 0
    const gap = motionOk ? 1500 : 0
    const at = (delay: number, fn: () => void) => {
      const timer = window.setTimeout(() => {
        if (token.current !== my) return
        fn()
      }, delay)
      replayTimers.current.push(timer)
    }
    copy.script.forEach((step, index) => {
      if (step.kind === 'react') {
        at(cursor, () => {
          const target = ids[step.target ?? 0]
          if (target) api.current.react(step.side, target, step.body)
        })
        cursor += motionOk ? 780 : 0
        return
      }
      at(cursor, () => {
        setTyping(step.side)
        if (step.kind === 'text') setDrafts(current => ({ ...current, [step.side]: '' }))
      })
      if (step.kind === 'text') {
        const chars = Array.from(step.body)
        chars.forEach((_, charIndex) => {
          at(cursor + (typeMs * (charIndex + 1)) / chars.length, () => {
            setDrafts(current => ({ ...current, [step.side]: chars.slice(0, charIndex + 1).join('') }))
          })
        })
      }
      cursor += typeMs
      at(cursor, () => {
        setTyping(null)
        setDrafts(current => ({ ...current, [step.side]: '' }))
        const replyId = step.replyTo !== undefined ? ids[step.replyTo] ?? null : null
        ids[index] = api.current.send(step.side, step.body, {
          kind: step.kind === 'sticker' ? 'sticker' : 'text',
          replyToId: replyId
        })
      })
      cursor += gap
    })
    at(cursor, () => {
      setReplaying(false)
      setTyping(null)
    })
  }

  api.current.send = send
  api.current.react = react
  api.current.startReplay = startReplay

  useEffect(() => {
    setMessages(prev => {
      if (!prev.every(message => message.id.startsWith('seed-'))) return prev
      const next = buildSeed(copy)
      const same = next.length === prev.length && next.every((message, index) => message.body === prev[index]?.body && message.sender === prev[index]?.sender)
      return same ? prev : next
    })
  }, [copy])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const apply = () => {
      focusRef.current.desktop = media.matches
      setIsDesktop(media.matches)
    }
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const snapshot = messagesRef.current
    const ids = snapshot
      .filter(message => message.onReceiver && message.isDelivered && !message.isRead && focused(other(message.sender)) && !readTraced.current.has(message.id))
      .map(message => message.id)
    if (ids.length === 0) return
    ids.forEach(id => readTraced.current.add(id))
    setMessages(prev => prev.map(message => ids.includes(message.id) ? { ...message, isDelivered: true, isRead: true } : message))
    const receivers = new Set(ids.map(id => other(snapshot.find(message => message.id === id)?.sender ?? 'frainer')))
    receivers.forEach(receiver => addTrace('read_message', copy.traceRead(NAMES[receiver])))
    setJourney(current => current && current.mode === 'message' && ids.includes(current.messageId) ? { ...current, step: 4, holdRead: false } : current)
  }, [isDesktop, mobileView, copy])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let cancel = false
    const observer = new IntersectionObserver(([entry]) => {
      if (cancel || !entry?.isIntersecting || entry.intersectionRatio < 0.1) return
      if (autoplayed.current || interacted.current) return
      autoplayed.current = true
      api.current.startReplay()
    }, { threshold: [0.1] })
    observer.observe(root)
    return () => {
      cancel = true
      observer.disconnect()
    }
  }, [motionOk])

  useEffect(() => () => {
    token.current += 1
    pipeGen.current += 1
    replayTimers.current.forEach(id => window.clearTimeout(id))
    pipelineTimers.current.forEach(id => window.clearTimeout(id))
  }, [])

  const apiValue: SimApi = {
    lang,
    copy,
    motionOk,
    messages,
    traces,
    journey,
    drafts,
    replyTo,
    scriptTyping,
    replaying,
    mobileView,
    isDesktop,
    setMobileView,
    setDraft,
    setReply,
    send,
    react,
    markRead,
    noteUser,
    startReplay,
    uid
  }

  return (
    <SimContext.Provider value={apiValue}>
      <section
        ref={rootRef}
        className='w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-gray-200 bg-[#fffffe] text-gray-800 shadow-sm'
      >
        <div className='flex h-14 items-center justify-between gap-2 px-3 pt-3'>
          <p className='text-[11px] font-medium uppercase tracking-wide text-blue-500'>{copy.sampleBadge}</p>
          <button
            type='button'
            className={`inline-flex h-11 w-28 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-blue-500/10 sm:h-8 px-3 text-xs font-medium leading-none text-blue-500 transition-colors hover:bg-blue-500/15 motion-reduce:transition-none ${focusRing}`}
            aria-pressed={replaying}
            onClick={() => {
              interacted.current = true
              startReplay()
            }}
          >
            <RotateCcw className='size-3.5' aria-hidden='true' />
            {replaying ? copy.replaying : copy.replay}
          </button>
        </div>
        <div className='grid grid-cols-1 gap-4 px-3 pt-3 sm:px-4 lg:grid-cols-2'>
          <ChatWindow side='frainer' />
          <ChatWindow side='laura' />
        </div>
        <div className='px-3 pb-3 pt-3'>
          <Timeline />
          <p className='mt-2 px-0.5 text-[11px] leading-relaxed text-gray-500'>{copy.caption}</p>
        </div>
      </section>
    </SimContext.Provider>
  )
}
