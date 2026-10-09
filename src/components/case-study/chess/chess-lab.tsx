'use client'

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { colorOf, evaluate, legalMoves, makeMove, moveLabel, outcome, searchBestMove, sqName, startPosition, type Move, type Position, type SearchResult } from './engine'
import { useSceneTimeline } from '../kit/scene'
import { SceneFrame } from './scene-frame'

type Lang = 'en' | 'es'
type Ply = { before: Position; move: Move }
type Comparison = [SearchResult, SearchResult]
const OPENING: Move[] = [{ from: 12, to: 28 }, { from: 6, to: 21 }, { from: 11, to: 27 }]
const GLYPH: Record<string, string> = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟', k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
const COPY = {
 en: {
  title: 'Watch, compare, or play White', board: 'Chess board. Arrow keys navigate. Enter or Space selects a piece and its legal destination.',
  intro: 'An opening plays in a loop. Touch the board or a control to play White against the engine.',
  note: 'The original minimizing branch never updates beta, so it almost never prunes. With the beta update, a completed search chooses the same move with fewer nodes. Positive evaluation favors Black.',
  original: 'As written', fixed: 'With beta update', pruning: 'Search mode', nodes: 'Nodes visited', pruned: 'Branches pruned',
  depth: 'Depth', theme: 'Piece theme', solid: 'Solid', outline: 'Outline', undo: 'Undo', restart: 'Restart', resume: 'Resume autoplay',
  you: 'Your move', thinking: 'The engine is searching…', auto: 'Autoplay', chosen: 'Chosen move', ready: 'Opening position',
  win: 'Checkmate. You win.', lose: 'Checkmate. The engine wins.', draw: 'Stalemate. Draw.', evaluation: 'Evaluation',
  timeout: 'Time budget reached. Best move found so far.', complete: 'Both modes completed the search.', pending: 'Comparing both modes…',
  moves: 'Moves', empty: 'empty', white: 'white', black: 'black', keys: 'Arrow keys navigate. Enter selects. R restarts. T switches piece theme.',
  pieces: { K: 'king', Q: 'queen', R: 'rook', B: 'bishop', N: 'knight', P: 'pawn' },
 },
 es: {
  title: 'Mira, compara o juega con blancas', board: 'Tablero de ajedrez. Las flechas navegan. Enter o Espacio selecciona una pieza y su destino legal.',
  intro: 'Una apertura se repite en bucle. Toca el tablero o un control para jugar con blancas contra el motor.',
  note: 'La rama minimizadora original nunca actualiza beta, así que casi nunca poda. Con beta actualizado, una búsqueda completa elige la misma jugada con menos nodos. La evaluación positiva favorece a las negras.',
  original: 'Original', fixed: 'Con beta actualizado', pruning: 'Modo de búsqueda', nodes: 'Nodos visitados', pruned: 'Ramas podadas',
  depth: 'Profundidad', theme: 'Tema de las piezas', solid: 'Sólido', outline: 'Contorno', undo: 'Deshacer', restart: 'Reiniciar', resume: 'Volver al autoplay',
  you: 'Tu turno', thinking: 'El motor está buscando…', auto: 'Autoplay', chosen: 'Jugada elegida', ready: 'Posición inicial',
  win: 'Jaque mate. Ganaste.', lose: 'Jaque mate. Gana el motor.', draw: 'Ahogado. Tablas.', evaluation: 'Evaluación',
  timeout: 'Se agotó el tiempo. Mejor jugada encontrada.', complete: 'Ambos modos completaron la búsqueda.', pending: 'Comparando ambos modos…',
  moves: 'Jugadas', empty: 'vacía', white: 'blanco', black: 'negro', keys: 'Las flechas navegan. Enter selecciona. R reinicia. T cambia el tema de las piezas.',
  pieces: { K: 'rey', Q: 'dama', R: 'torre', B: 'alfil', N: 'caballo', P: 'peón' },
 },
} as const
const BUTTON = 'flex h-11 min-w-0 items-center justify-center rounded-md border border-[#e7e5e4] px-2 text-xs font-medium text-[#486333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#486333]'

function Segmented<T extends string | number>({ label, value, options, change }: { label: string; value: T; options: { value: T; label: string }[]; change: (value: T) => void }) {
 return <div role='radiogroup' aria-label={label} className='grid min-w-0 gap-1' style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))` }}>
  {options.map(option => <button key={option.value} type='button' role='radio' aria-checked={value === option.value} onClick={() => change(option.value)} className={`${BUTTON} ${value === option.value ? 'bg-[#EAEBC8]' : 'bg-[#f7f6f2]'}`}>{option.label}</button>)}
 </div>
}

export default function ChessLab({ lang }: { lang: Lang }) {
 const t = COPY[lang]
 const timeline = useSceneTimeline(60000)
 const [pos, setPos] = useState(startPosition)
 const [plies, setPlies] = useState<Ply[]>([])
 const [autoplay, setAutoplay] = useState(true)
 const autoRef = useRef(true)
 const [depth, setDepth] = useState(2)
 const [textbook, setTextbook] = useState(false)
 const modeRef = useRef(false)
 const [outline, setOutline] = useState(false)
 const [selected, setSelected] = useState<number | null>(null)
 const [focus, setFocus] = useState(12)
 const [thinking, setThinking] = useState(false)
 const [comparison, setComparison] = useState<Comparison | null>(null)
 const [searchPosition, setSearchPosition] = useState<Position | null>(null)
 const squares = useRef<(HTMLButtonElement | null)[]>([])
 const runId = useRef(0)
 const cache = useRef(new Map<string, Promise<Comparison>>())
 const result = useMemo(() => outcome(pos), [pos])
 const legal = useMemo(() => legalMoves(pos), [pos])
 const targets = selected === null ? [] : legal.filter(move => move.from === selected)
 const last = plies.at(-1)
 const staticRun = useRef('')
 const active = autoplay && timeline.started && !timeline.reduced

 // Cache completed comparisons and in-flight searches. Never run both engines in parallel:
 // their time budgets share the browser thread.
 const compare = (position: Position, searchDepth: number) => {
  const key = `${JSON.stringify(position)}:${searchDepth}`
  let pending = cache.current.get(key)
  if (!pending) {
   pending = (async (): Promise<Comparison> => {
    const original = await searchBestMove(position, searchDepth, { limitMs: 3000, textbook: false })
    const fixed = await searchBestMove(position, searchDepth, { limitMs: 3000, textbook: true })
    return [original, fixed]
   })()
   if (cache.current.size >= 48) cache.current.delete(cache.current.keys().next().value!)
   cache.current.set(key, pending)
  }
  return pending
 }
 const reset = () => {
  runId.current++
  staticRun.current = ''; setPos(startPosition()); setPlies([]); setSelected(null); setThinking(false); setComparison(null); setSearchPosition(null)
 }
 const takeover = () => {
  if (!autoRef.current) return
  autoRef.current = false
  runId.current++
  setAutoplay(false)
  setSelected(null)
  // A pending Black reply is discarded and rolled back to the preceding White turn.
  if (pos.turn === 'b') {
   const previous = plies.at(-1)
   setPos(previous?.before ?? startPosition())
   setPlies(previous ? plies.slice(0, -1) : [])
   setComparison(null); setSearchPosition(null)
  }
  setThinking(false)
 }
 const append = (position: Position, move: Move) => {
  setPlies(previous => [...previous, { before: position, move }])
  setPos(makeMove(position, move)); setSelected(null)
 }

 useEffect(() => {
  if (!timeline.started) return
  let cancelled = false
  void (async () => {
   let position = startPosition()
   for (const planned of OPENING) {
    if (cancelled) return
    const move = legalMoves(position).find(candidate => candidate.from === planned.from && candidate.to === planned.to)
    if (!move) return
    position = makeMove(position, move)
    const pair = await compare(position, 2)
    if (cancelled || !pair[0].move) return
    position = makeMove(position, pair[0].move)
   }
  })()
  return () => { cancelled = true }
  // The cache is owned by this mounted lab; warm it only once the scene is on screen.
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [timeline.started])

 useEffect(() => {
  if (!active) return
  const timer = window.setInterval(() => {
   modeRef.current = !modeRef.current
   setTextbook(modeRef.current)
  }, 3000)
  return () => window.clearInterval(timer)
 }, [active])

 useEffect(() => {
  const id = ++runId.current
  let timer: number | undefined
  if (autoplay && timeline.reduced) {
   const staticKey = `${depth}`
   if (staticRun.current === staticKey && comparison) return
   staticRun.current = staticKey
   const initial = startPosition()
   const opened = makeMove(initial, OPENING[0])
   setThinking(true)
   void compare(opened, depth).then(pair => {
    if (id !== runId.current) return
    const reply = pair[0].move
    setComparison(pair); setSearchPosition(opened); setThinking(false)
    setPos(reply ? makeMove(opened, reply) : opened)
    setPlies([{ before: initial, move: OPENING[0] }, ...(reply ? [{ before: opened, move: reply }] : [])])
   })
  } else if (pos.turn === 'b' && !result && (!autoplay || active)) {
   setThinking(true); setComparison(null); setSearchPosition(pos)
   void compare(pos, depth).then(pair => {
    if (id !== runId.current) return
    setComparison(pair); setThinking(false)
    // Hold this exact position while both mode readouts alternate.
    timer = window.setTimeout(() => {
     if (id !== runId.current) return
     const reply = pair[(autoplay ? modeRef.current : textbook) ? 1 : 0].move
     if (reply) append(pos, reply)
    }, autoplay ? 6500 : 250)
   })
  } else if (!autoplay && searchPosition) {
   // Depth changes must also refresh the readout for the last Black reply.
   void compare(searchPosition, depth).then(pair => {
    if (id === runId.current) setComparison(pair)
   })
  } else if (active) {
   timer = window.setTimeout(() => {
    if (id !== runId.current) return
    if (plies.length >= 6 || result) { reset(); return }
    const planned = OPENING[Math.floor(plies.length / 2)]
    const move = legal.find(m => m.from === planned?.from && m.to === planned?.to) ?? legal[0]
    if (move) append(pos, move)
   }, 1400)
  }
  return () => { runId.current++; window.clearTimeout(timer) }
  // Automatic mode changes affect the readout, not the lifetime of a pending reply.
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [pos, depth, autoplay, active, timeline.reduced, autoplay ? null : textbook])

 const activate = (square: number) => {
  takeover()
  if (pos.turn !== 'w' || thinking || result) return
  const target = targets.find(move => move.to === square)
  if (target) append(pos, target)
  else setSelected(pos.board[square] && colorOf(pos.board[square]!) === 'w' ? selected === square ? null : square : null)
 }
 const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
  takeover()
  const file = focus % 8, rank = Math.floor(focus / 8)
  let next = focus
  if (event.key === 'ArrowUp') next = Math.min(7, rank + 1) * 8 + file
  else if (event.key === 'ArrowDown') next = Math.max(0, rank - 1) * 8 + file
  else if (event.key === 'ArrowLeft') next = rank * 8 + Math.max(0, file - 1)
  else if (event.key === 'ArrowRight') next = rank * 8 + Math.min(7, file + 1)
  else if (event.key.toLowerCase() === 'r') reset()
  else if (event.key.toLowerCase() === 't') setOutline(value => !value)
  else return
  event.preventDefault(); setFocus(next); squares.current[next]?.focus()
 }
 const undo = () => {
  takeover(); runId.current++
  const count = pos.turn === 'w' ? 2 : 1
  const previous = plies[Math.max(0, plies.length - count)]
  if (previous) { setPos(previous.before); setPlies(plies.slice(0, Math.max(0, plies.length - count))) }
  setThinking(false); setSelected(null); setComparison(null); setSearchPosition(null)
 }
 const shown = comparison?.[textbook ? 1 : 0]
 const status = result === 'checkmate' ? pos.turn === 'w' ? t.lose : t.win : result ? t.draw : thinking ? t.thinking : autoplay ? t.auto : pos.turn === 'w' ? t.you : t.thinking
 const evaluation = useMemo(() => evaluate(pos), [pos])
 const score = shown?.score ?? evaluation
 const stats = (entry: SearchResult | undefined) => <dl className='grid h-[88px] grid-cols-[1fr_auto] items-center gap-x-2 text-xs'>
  <dt>{t.nodes}</dt><dd className='font-mono tabular-nums'>{entry?.stats.nodes.toLocaleString(lang) ?? '…'}</dd>
  <dt>{t.pruned}</dt><dd className='font-mono tabular-nums'>{entry?.stats.pruned.toLocaleString(lang) ?? '…'}</dd>
 </dl>
 return <SceneFrame timeline={timeline} kicker='minimax.py' title={t.title} caption={t.note}>
  <div className='grid min-w-0 gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]'>
   <div className='min-w-0'>
    <div role='grid' aria-label={t.board} onKeyDown={onKey} className='mx-auto grid aspect-square w-full max-w-[480px] grid-cols-8 grid-rows-8 overflow-hidden rounded-lg'>
     {Array.from({ length: 64 }, (_, index) => {
      const square = (7 - Math.floor(index / 8)) * 8 + index % 8
      const dark = (Math.floor(square / 8) + square % 8) % 2 === 0
      const piece = pos.board[square]
      const traced = last && (last.move.from === square || last.move.to === square)
      const capture = last?.move.to === square && (last.before.board[square] || last.move.ep)
      const target = targets.some(move => move.to === square)
      const kind = piece?.toUpperCase() as keyof typeof t.pieces
      return <button key={square} ref={element => { squares.current[square] = element }} type='button' role='gridcell' tabIndex={focus === square ? 0 : -1} aria-selected={selected === square} aria-label={`${sqName(square)}, ${piece ? `${colorOf(piece) === 'w' ? t.white : t.black} ${t.pieces[kind]}` : t.empty}`} onFocus={() => setFocus(square)} onPointerDown={takeover} onClick={() => activate(square)} className='relative flex min-h-0 min-w-0 items-center justify-center outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#486333]' style={{ backgroundColor: capture ? dark ? '#C84646' : '#C86464' : traced || selected === square ? dark ? '#ACC333' : '#F4F774' : dark ? '#779A58' : '#EAEBC8' }}>
       {square % 8 === 0 && <span aria-hidden className='absolute left-0.5 top-0.5 text-[9px] font-semibold' style={{ color: dark ? '#EAEBC8' : '#486333' }}>{Math.floor(square / 8) + 1}</span>}
       {square < 8 && <span aria-hidden className='absolute bottom-0.5 right-1 text-[9px] font-semibold' style={{ color: dark ? '#EAEBC8' : '#486333' }}>{sqName(square)[0]}</span>}
       {piece && <span aria-hidden className='relative select-none text-[clamp(1.5rem,7vw,3rem)] leading-none' style={{ color: colorOf(piece) === 'w' ? '#f7f6f2' : '#1c1917', textShadow: colorOf(piece) === 'w' ? '0 1px 1px #1c1917, 1px 0 1px #1c1917, -1px 0 1px #1c1917' : undefined, WebkitTextStroke: outline ? '1px #1c1917' : undefined }}>{GLYPH[piece]}</span>}
       {target && <span aria-hidden className={piece ? 'absolute inset-1 rounded-full border-[3px] border-[#C84646]' : 'absolute size-[25%] rounded-full bg-[#486333]'} />}
      </button>
     })}
    </div>
    <p className='mx-auto mt-3 min-h-[3rem] max-w-[480px] text-xs leading-relaxed text-stone-600'>{t.keys}</p>
    <p className='h-6 text-center text-sm text-[#486333]' style={{ opacity: !autoplay && pos.turn === 'w' && !result ? 1 : 0 }}>{t.you}</p>
    <button type='button' className={`${BUTTON} mx-auto mt-2 w-full max-w-[480px] bg-[#EAEBC8]`} style={{ visibility: autoplay ? 'hidden' : 'visible', opacity: autoplay ? 0 : 1 }} onClick={() => { autoRef.current = true; setAutoplay(true); reset(); timeline.replay() }}>{t.resume}</button>
   </div>
   <aside className='min-w-0 rounded-lg border border-[#e7e5e4] bg-[#f7f6f2] p-3 sm:p-4'>
    <p className='min-h-[4.5rem] text-sm leading-relaxed'>{t.intro}</p>
    <p role='status' className='flex h-12 items-center text-sm font-semibold text-[#486333]'>{status}</p>
    <Segmented label={t.pruning} value={textbook ? 1 : 0} options={[{ value: 0, label: t.original }, { value: 1, label: t.fixed }]} change={value => { takeover(); modeRef.current = value === 1; setTextbook(value === 1) }} />
    <div className='h-[260px] pt-3'>
     {timeline.reduced ? <div className='grid grid-cols-2 gap-3'>{[t.original, t.fixed].map((label, index) => <div key={label}><p className='flex h-10 items-center text-xs font-semibold text-[#486333]'>{label}</p>{stats(comparison?.[index])}</div>)}</div> : <><p className='h-10 text-xs leading-relaxed text-stone-600'>{comparison ? comparison.some(entry => entry.timedOut) ? t.timeout : t.complete : t.pending}</p>{stats(shown)}</>}
     <p className='h-10 text-xs font-medium text-[#486333]'>{t.chosen}: {shown?.move && searchPosition ? moveLabel(searchPosition, shown.move, lang) : '…'}</p>
     <p className='h-6 text-xs'>{t.evaluation}: <span className='font-mono'>{Number.isFinite(score) ? `${score > 0 ? '+' : ''}${score.toFixed(1)}` : score > 0 ? '+∞' : '−∞'}</span></p>
     <p className='h-10 text-xs leading-relaxed text-stone-600'>{shown?.timedOut ? t.timeout : ''}</p>
    </div>
    <p className='mb-1 text-xs'>{t.depth}</p>
    <Segmented label={t.depth} value={depth} options={[1, 2, 3].map(value => ({ value, label: String(value) }))} change={value => { takeover(); setComparison(null); setDepth(value) }} />
    <p className='mb-1 mt-3 text-xs'>{t.theme}</p>
    <Segmented label={t.theme} value={outline ? 1 : 0} options={[{ value: 0, label: t.solid }, { value: 1, label: t.outline }]} change={value => { takeover(); setOutline(value === 1) }} />
    <p className='mt-3 text-xs'>{t.moves}</p>
    <ol className='mt-1 h-16 overflow-y-auto font-mono text-xs leading-5'>{plies.map((ply, index) => <li key={index}>{index + 1}. {moveLabel(ply.before, ply.move, lang)}</li>)}</ol>
    <div className='mt-3 grid grid-cols-2 gap-2'><button type='button' className={BUTTON} onClick={undo}>{t.undo}</button><button type='button' className={`${BUTTON} bg-[#EAEBC8]`} onClick={() => { takeover(); reset() }}>{t.restart}</button></div>
   </aside>
  </div>
 </SceneFrame>
}
