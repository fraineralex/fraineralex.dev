'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Cpu, RotateCcw, Undo2 } from 'lucide-react'
import { colorOf, evaluate, legalMoves, makeMove, moveLabel, outcome, searchBestMove, sqName, startPosition, type Move, type Piece, type Position, type SearchStats } from './engine'

type Lang = 'en' | 'es'
type Theme = 'green' | 'brown' | 'blue' | 'gray'

const THEMES: Record<Theme, { dark: string; light: string }> = {
	green: { dark: '#779556', light: '#ebecd0' },
	brown: { dark: '#b58863', light: '#f0d9b5' },
	blue: { dark: '#8ca2ad', light: '#dee3e6' },
	gray: { dark: '#8b8b8b', light: '#d9d9d9' },
}
const THEME_ORDER: Theme[] = ['green', 'brown', 'blue', 'gray']

const GLYPH: Record<Piece, string> = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟', k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }

const COPY = {
	en: {
		window: 'chess-ai · engine port from python',
		board: 'Chess board. You play White. Use the arrow keys to move between squares and Enter to pick a piece and its destination.',
		pieces: { K: 'king', Q: 'queen', R: 'rook', B: 'bishop', N: 'knight', P: 'pawn' },
		white: 'white',
		black: 'black',
		empty: 'empty',
		readout: 'Engine readout',
		status: { you: 'Your move', thinking: 'The AI is thinking…', checkmateWin: 'Checkmate. You win.', checkmateLose: 'Checkmate. The AI wins.', stalemate: 'Stalemate. Draw.' },
		eval: 'Evaluation',
		evalHint: 'Positive favors Black (the AI), as in minimax.py.',
		nodes: 'Nodes visited',
		pruned: 'Branches pruned',
		depth: 'Depth',
		pruning: 'Pruning',
		original: 'As in minimax.py',
		textbook: 'With beta update',
		pruningHint: 'The original minimizing branch never updates beta, so it rarely prunes. Same move, different amount of work.',
		moves: 'Moves',
		noMoves: 'No moves yet.',
		restart: 'Restart',
		undo: 'Undo',
		theme: 'Board theme',
		themes: { green: 'Green', brown: 'Brown', blue: 'Blue', gray: 'Gray' },
		keys: 'With the board focused, t switches the theme and r restarts, like the desktop game.',
		played: (m: string) => `The AI played ${m}.`,
		timedOut: 'Time budget reached, best move so far.',
	},
	es: {
		window: 'chess-ai · motor portado desde python',
		board: 'Tablero de ajedrez. Juegas con blancas. Usa las flechas para moverte entre casillas y Enter para elegir una pieza y su destino.',
		pieces: { K: 'rey', Q: 'dama', R: 'torre', B: 'alfil', N: 'caballo', P: 'peón' },
		white: 'blanco',
		black: 'negro',
		empty: 'vacía',
		readout: 'Panel del motor',
		status: { you: 'Te toca', thinking: 'La IA está pensando…', checkmateWin: 'Jaque mate. Ganaste.', checkmateLose: 'Jaque mate. Gana la IA.', stalemate: 'Ahogado. Tablas.' },
		eval: 'Evaluación',
		evalHint: 'Positivo favorece a las negras (la IA), como en minimax.py.',
		nodes: 'Nodos visitados',
		pruned: 'Ramas podadas',
		depth: 'Profundidad',
		pruning: 'Poda',
		original: 'Como en minimax.py',
		textbook: 'Con beta actualizado',
		pruningHint: 'En el original, la rama minimizadora nunca actualiza beta, así que casi no poda. Misma jugada, distinta cantidad de trabajo.',
		moves: 'Jugadas',
		noMoves: 'Todavía no hay jugadas.',
		restart: 'Reiniciar',
		undo: 'Deshacer',
		theme: 'Tema del tablero',
		themes: { green: 'Verde', brown: 'Marrón', blue: 'Azul', gray: 'Gris' },
		keys: 'Con el tablero enfocado, t cambia el tema y r reinicia, igual que en el juego de escritorio.',
		played: (m: string) => `La IA jugó ${m}.`,
		timedOut: 'Se agotó el tiempo, mejor jugada hasta ahora.',
	},
} as const

const LIMIT_MS = 3000

const btn =
	'inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50'
const secondary = 'border border-white/10 bg-white/[0.03] text-zinc-100 hover:bg-white/[0.07]'

function Segmented<T extends string | number>({ label, value, options, onChange, disabled }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; disabled?: boolean }) {
	return (
		<div role='radiogroup' aria-label={label} className='grid gap-1 rounded-lg bg-white/[0.05] p-1' style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
			{options.map((o) => (
				<button
					key={String(o.value)}
					type='button'
					role='radio'
					aria-checked={value === o.value}
					disabled={disabled}
					onClick={() => onChange(o.value)}
					className={`inline-flex h-7 items-center justify-center rounded-md px-2 text-xs font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 motion-reduce:transition-none disabled:opacity-50 ${value === o.value ? 'bg-white/[0.12] text-white' : 'text-zinc-400 hover:text-white'}`}
				>
					{o.label}
				</button>
			))}
		</div>
	)
}

interface Ply {
	before: Position
	move: Move
	label: string
}

export default function ChessLab({ lang }: { lang: Lang }) {
	const t = COPY[lang]
	const [pos, setPos] = useState<Position>(startPosition)
	const [plies, setPlies] = useState<Ply[]>([])
	const [selected, setSelected] = useState<number | null>(null)
	const [focus, setFocus] = useState(12)
	const [theme, setTheme] = useState<Theme>('green')
	const [depth, setDepth] = useState(2)
	const [textbook, setTextbook] = useState(false)
	const [thinking, setThinking] = useState(false)
	const [stats, setStats] = useState<SearchStats>({ nodes: 0, pruned: 0 })
	const [score, setScore] = useState(0)
	const [announce, setAnnounce] = useState('')
	const [timedOut, setTimedOut] = useState(false)
	const squareRefs = useRef<(HTMLButtonElement | null)[]>([])
	const runId = useRef(0)

	const legal = useMemo(() => (pos.turn === 'w' && !thinking ? legalMoves(pos) : []), [pos, thinking])
	const targets = useMemo(() => (selected === null ? [] : legal.filter((m) => m.from === selected)), [legal, selected])
	const result = useMemo(() => outcome(pos), [pos])
	const last = plies[plies.length - 1]?.move

	const restart = useCallback(() => {
		runId.current++
		setPos(startPosition())
		setPlies([])
		setSelected(null)
		setThinking(false)
		setStats({ nodes: 0, pruned: 0 })
		setScore(0)
		setTimedOut(false)
		setAnnounce('')
	}, [])

	// AI reply (Black).
	useEffect(() => {
		if (pos.turn !== 'b' || result) return
		const id = ++runId.current
		setThinking(true)
		const timer = window.setTimeout(async () => {
			const r = await searchBestMove(pos, depth, { limitMs: LIMIT_MS, textbook })
			if (id !== runId.current || !r.move) return
			const label = moveLabel(pos, r.move, lang)
			const next = makeMove(pos, r.move)
			setPlies((p) => [...p, { before: pos, move: r.move as Move, label }])
			setPos(next)
			setStats(r.stats)
			setScore(Number.isFinite(r.score) ? r.score : r.score > 0 ? 9999 : -9999)
			setTimedOut(r.timedOut)
			setThinking(false)
			setAnnounce(t.played(label))
		}, 60)
		return () => window.clearTimeout(timer)
	}, [pos, depth, textbook, lang, result, t])

	const play = (m: Move) => {
		const label = moveLabel(pos, m, lang)
		setPlies((p) => [...p, { before: pos, move: m, label }])
		const next = makeMove(pos, m)
		setPos(next)
		setScore(evaluate(next))
		setSelected(null)
	}

	const undo = () => {
		if (thinking || plies.length === 0) return
		runId.current++
		const back = plies.length >= 2 && plies[plies.length - 1].before.turn === 'b' ? 2 : 1
		const target = plies[plies.length - back]
		setPos(target.before)
		setPlies((p) => p.slice(0, p.length - back))
		setSelected(null)
		setThinking(false)
	}

	const activate = (s: number) => {
		if (thinking || result || pos.turn !== 'w') return
		const p = pos.board[s]
		const target = targets.find((m) => m.to === s)
		if (target) return play(target)
		if (p && colorOf(p) === 'w' && legal.some((m) => m.from === s)) setSelected(s === selected ? null : s)
		else setSelected(null)
	}

	// Display rows from rank 8 to rank 1.
	const order = useMemo(() => Array.from({ length: 64 }, (_, i) => (7 - Math.floor(i / 8)) * 8 + (i % 8)), [])

	const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
		const f = focus % 8
		const r = Math.floor(focus / 8)
		let next = focus
		if (e.key === 'ArrowUp') next = Math.min(7, r + 1) * 8 + f
		else if (e.key === 'ArrowDown') next = Math.max(0, r - 1) * 8 + f
		else if (e.key === 'ArrowLeft') next = r * 8 + Math.max(0, f - 1)
		else if (e.key === 'ArrowRight') next = r * 8 + Math.min(7, f + 1)
		else if (e.key === 't' || e.key === 'T') {
			setTheme((th) => THEME_ORDER[(THEME_ORDER.indexOf(th) + 1) % THEME_ORDER.length])
			return
		} else if (e.key === 'r' || e.key === 'R') {
			restart()
			return
		} else return
		e.preventDefault()
		setFocus(next)
		squareRefs.current[next]?.focus()
	}

	const describe = (s: number) => {
		const p = pos.board[s]
		if (!p) return `${sqName(s)}, ${t.empty}`
		const kind = p.toUpperCase() as keyof typeof t.pieces
		return lang === 'es' ? `${sqName(s)}, ${t.pieces[kind]} ${colorOf(p) === 'w' ? t.white : t.black}` : `${sqName(s)}, ${colorOf(p) === 'w' ? t.white : t.black} ${t.pieces[kind]}`
	}

	const status = result === 'checkmate' ? (pos.turn === 'w' ? t.status.checkmateLose : t.status.checkmateWin) : result === 'stalemate' ? t.status.stalemate : thinking ? t.status.thinking : t.status.you
	const colors = THEMES[theme]
	const shown = Math.max(-60, Math.min(60, score))
	const blackShare = 50 + (shown / 60) * 50

	return (
		<div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start'>
			<div className='mx-auto w-full max-w-[560px]'>
				<div className='overflow-hidden rounded-xl border border-white/10 bg-[rgb(37,37,42)] shadow-2xl shadow-black/40'>
					<div className='flex items-center gap-2 border-b border-white/[0.08] bg-[rgb(44,44,50)] px-3 py-2' aria-hidden>
						<span className='flex shrink-0 gap-1.5'>
							<span className='size-3 rounded-full bg-[#ff5f57]' />
							<span className='size-3 rounded-full bg-[#febc2e]' />
							<span className='size-3 rounded-full bg-[#28c804]' />
						</span>
						<span className='mx-auto min-w-0 truncate rounded-lg bg-[rgb(30,30,35)] px-2.5 py-1.5 text-center text-[11px] text-zinc-200 ring-1 ring-white/[0.08]'>{t.window}</span>
						<span className='w-[52px] shrink-0' />
					</div>
					<div className='p-3 sm:p-4'>
						<div role='grid' aria-label={t.board} onKeyDown={onKey} className='grid aspect-square grid-cols-8 grid-rows-8 overflow-hidden rounded-md'>
							{order.map((s) => {
								const p = pos.board[s]
								const dark = (Math.floor(s / 8) + (s % 8)) % 2 === 0
								const isTarget = targets.some((m) => m.to === s)
								const isLast = last && (last.from === s || last.to === s)
								return (
									<button
										key={s}
										ref={(el) => {
											squareRefs.current[s] = el
										}}
										type='button'
										role='gridcell'
										tabIndex={s === focus ? 0 : -1}
										aria-label={describe(s)}
										aria-selected={selected === s}
										onFocus={() => setFocus(s)}
										onClick={() => activate(s)}
										className='relative flex items-center justify-center leading-none outline-none focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-teal-300'
										style={{ backgroundColor: dark ? colors.dark : colors.light }}
									>
										{isLast && <span aria-hidden className='absolute inset-0 bg-[#f6f669]/45' />}
										{selected === s && <span aria-hidden className='absolute inset-0 bg-teal-300/45' />}
										{s % 8 === 0 && (
											<span aria-hidden className='absolute left-0.5 top-0.5 text-[9px] font-semibold sm:text-[10px]' style={{ color: dark ? colors.light : colors.dark }}>
												{Math.floor(s / 8) + 1}
											</span>
										)}
										{s < 8 && (
											<span aria-hidden className='absolute bottom-0.5 right-1 text-[9px] font-semibold sm:text-[10px]' style={{ color: dark ? colors.light : colors.dark }}>
												{sqName(s)[0]}
											</span>
										)}
										{p && (
											<span
												aria-hidden
												className='relative select-none text-[clamp(1.5rem,8.5vw,3rem)] leading-none'
												style={
													colorOf(p) === 'w'
														? { color: '#ffffff', textShadow: '0 0 1px #111, 0 1px 1px #111, 1px 0 1px #111, -1px 0 1px #111, 0 -1px 1px #111' }
														: { color: '#18181b', textShadow: '0 0 1px #fff3' }
												}
											>
												{GLYPH[p]}
											</span>
										)}
										{isTarget && <span aria-hidden className={`absolute rounded-full ${p ? 'inset-1 border-4 border-black/25' : 'size-[28%] bg-black/25'}`} />}
									</button>
								)
							})}
						</div>
						<p className='mt-3 text-[11px] leading-relaxed text-zinc-400'>{t.keys}</p>
					</div>
				</div>
			</div>

			<aside className='rounded-lg border border-slate-700/50 bg-slate-800/30 p-5' aria-label={t.readout}>
				<div className='flex items-center justify-between gap-3'>
					<p className='font-mono text-[11px] uppercase tracking-wider text-teal-300'>{t.readout}</p>
					<Cpu className={`size-4 text-teal-300 ${thinking ? 'animate-pulse motion-reduce:animate-none' : ''}`} aria-hidden />
				</div>
				<p className='mt-3 text-lg font-medium text-white' role='status'>
					{status}
				</p>
				<p className='sr-only' aria-live='polite'>
					{announce}
				</p>

				<div className='mt-5'>
					<div className='flex items-baseline justify-between'>
						<span className='text-xs text-slate-400'>{t.eval}</span>
						<span className='font-mono text-sm text-zinc-100'>{score > 0 ? '+' : ''}{Math.abs(score) >= 9999 ? (score > 0 ? '∞' : '-∞') : score.toFixed(1)}</span>
					</div>
					<div className='mt-2 flex h-2 overflow-hidden rounded-full bg-white' aria-hidden>
						<span className='h-full bg-zinc-900 transition-[width] duration-500 motion-reduce:transition-none' style={{ width: `${blackShare}%` }} />
					</div>
					<p className='mt-1.5 text-[11px] text-zinc-500'>{t.evalHint}</p>
				</div>

				<dl className='mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10'>
					<div className='bg-slate-900/60 px-3 py-2.5'>
						<dt className='text-[11px] text-slate-400'>{t.nodes}</dt>
						<dd className='mt-0.5 font-mono text-sm text-zinc-100'>{stats.nodes.toLocaleString(lang === 'es' ? 'es-DO' : 'en-US')}</dd>
					</div>
					<div className='bg-slate-900/60 px-3 py-2.5'>
						<dt className='text-[11px] text-slate-400'>{t.pruned}</dt>
						<dd className='mt-0.5 font-mono text-sm text-zinc-100'>{stats.pruned.toLocaleString(lang === 'es' ? 'es-DO' : 'en-US')}</dd>
					</div>
				</dl>
				{timedOut && <p className='mt-2 text-[11px] text-amber-300/80'>{t.timedOut}</p>}

				<div className='mt-5 space-y-3'>
					<div>
						<p className='mb-1.5 text-xs text-slate-400'>{t.depth}</p>
						<Segmented label={t.depth} value={depth} disabled={thinking} options={[1, 2, 3].map((d) => ({ value: d, label: String(d) }))} onChange={setDepth} />
					</div>
					<div>
						<p className='mb-1.5 text-xs text-slate-400'>{t.pruning}</p>
						<Segmented label={t.pruning} value={textbook ? 'textbook' : 'original'} disabled={thinking} options={[{ value: 'original', label: t.original }, { value: 'textbook', label: t.textbook }]} onChange={(v) => setTextbook(v === 'textbook')} />
						<p className='mt-1.5 text-[11px] leading-relaxed text-zinc-500'>{t.pruningHint}</p>
					</div>
					<div>
						<p className='mb-1.5 text-xs text-slate-400'>{t.theme}</p>
						<Segmented label={t.theme} value={theme} options={THEME_ORDER.map((th) => ({ value: th, label: t.themes[th] }))} onChange={setTheme} />
					</div>
				</div>

				<div className='mt-5'>
					<p className='text-xs text-slate-400'>{t.moves}</p>
					<ol className='mt-2 grid max-h-28 grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-1 overflow-y-auto font-mono text-xs text-zinc-200 [scrollbar-width:thin]'>
						{plies.length === 0 && <li className='col-span-3 font-sans text-zinc-500'>{t.noMoves}</li>}
						{Array.from({ length: Math.ceil(plies.length / 2) }, (_, i) => (
							<li key={i} className='contents'>
								<span className='text-zinc-500'>{i + 1}.</span>
								<span>{plies[i * 2]?.label}</span>
								<span>{plies[i * 2 + 1]?.label ?? ''}</span>
							</li>
						))}
					</ol>
				</div>

				<div className='mt-5 grid grid-cols-2 gap-2'>
					<button type='button' className={`${btn} ${secondary}`} onClick={undo} disabled={thinking || plies.length === 0}>
						<Undo2 className='size-4' aria-hidden />
						{t.undo}
					</button>
					<button type='button' className={`${btn} bg-[oklch(0.78_0.18_282)] text-[oklch(0.115_0.005_282)] hover:bg-[oklch(0.84_0.14_282)]`} onClick={restart}>
						<RotateCcw className='size-4' aria-hidden />
						{t.restart}
					</button>
				</div>
			</aside>
		</div>
	)
}
