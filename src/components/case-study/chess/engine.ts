/*
 * Browser port of the Chess AI engine (fraineralex/ChessAI, minimax.py).
 *
 * Evaluation and search follow the Python code literally:
 * - Square s = rank * 8 + file (a1 = 0), and the piece square tables are read
 *   as table[rank][file], exactly like evaluationBoard/getPieceValue do. Black
 *   tables are numpy flip() of the white ones (both axes reversed).
 * - Leaf score = check_status + evaluationBoard + checkmate_status +
 *   good_square_moves, negated, so positive means good for Black (the AI).
 * - The minimizing branch in minimax.py never updates beta, so the original
 *   prunes very little. `textbookPruning` adds the missing beta update; the
 *   chosen move is the same either way, only the work changes.
 * The rules (python-chess in the original) are a small move generator written
 * for this port. Promotions always become queens.
 */

export type Color = 'w' | 'b'
export type Piece = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K' | 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
export type Square = Piece | null

export interface Move {
	from: number
	to: number
	promo?: boolean
	ep?: boolean
	castle?: 'K' | 'Q' | 'k' | 'q'
}

export interface Position {
	board: Square[]
	turn: Color
	castling: { K: boolean; Q: boolean; k: boolean; q: boolean }
	ep: number | null
}

type Table = number[][]

const pawnEvalWhite: Table = [
	[0, 0, 0, 0, 0, 0, 0, 0],
	[5, 5, 5, 5, 5, 5, 5, 5],
	[1, 1, 2, 3, 6, 2, 1, 1],
	[0.5, 0.5, 1, 2.5, 2.5, 1, 0.5, 0.5],
	[0, 0, 0, 2, 2, 0, 0, 0],
	[0.5, -0.5, -1, 0, 0, -1, -0.5, 0.5],
	[0.5, 1, 1, -2, -2, 1, 1, 0.5],
	[0, 0, 0, 0, 0, 0, 0, 0],
]
const knightEval: Table = [
	[-5, -4, -3, -3, -3, -3, -4, -5],
	[-4, -2, 0, 0, 0, 0, -2, -4],
	[-3, 0, 1, 1.5, 1.5, 1, 0, -3],
	[-3, 0.5, 1.5, 2, 2, 1.5, 0.5, -3],
	[-3, 0, 1.5, 2, 2, 1.5, 0, -3],
	[-3, 0.5, 1, 1.5, 1.5, 1, 0.5, -3],
	[-4, -2, 0, 0.5, 0.5, 0, -2, -4],
	[-5, -4, -3, -3, -3, -3, -4, -5],
]
const bishopEvalWhite: Table = [
	[-2, -1, -1, -1, -1, -1, -1, -2],
	[-1, 0, 0, 0, 0, 0, 0, -1],
	[-1, 0, 0.5, 1, 1, 0.5, 0, -1],
	[-1, 0.5, 0.5, 1, 1, 0.5, 0.5, -1],
	[-1, 0, 1, 1, 1, 1, 0, -1],
	[-1, 1, 1, 1, 1, 1, 1, -1],
	[-1, 0.5, 0, 0, 0, 0, 0.5, -1],
	[-2, -1, -1, -1, -1, -1, -1, -2],
]
const rookEvalWhite: Table = [
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0.5, 1, 1, 1, 1, 1, 1, 0.5],
	[-0.5, 0, 0, 0, 0, 0, 0, -0.5],
	[-0.5, 0, 0, 0, 0, 0, 0, -0.5],
	[-0.5, 0, 0, 0, 0, 0, 0, -0.5],
	[-0.5, 0, 0, 0, 0, 0, 0, -0.5],
	[-0.5, 0, 0, 0, 0, 0, 0, -0.5],
	[0, 0, 0, 0.5, 0.5, 0, 0, 0],
]
const queenEval: Table = [
	[-2, -1, -1, -0.5, -0.5, -1, -1, -2],
	[-1, 0, 0, 0, 0, 0, 0, -1],
	[-1, 0, 0.5, 0.5, 0.5, 0.5, 0, -1],
	[-0.5, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5],
	[0, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5],
	[-1, 0.5, 0.5, 0.5, 0.5, 0.5, 0, -1],
	[-1, 0, 0.5, 0, 0, 0, 0, -1],
	[-2, -1, -1, -0.5, -0.5, -1, -1, -2],
]
const kingEvalWhite: Table = [
	[-3, -4, -4, -5, -5, -4, -4, -3],
	[-3, -4, -4, -5, -5, -4, -4, -3],
	[-3, -4, -4, -5, -5, -4, -4, -3],
	[-3, -4, -4, -5, -5, -4, -4, -3],
	[-2, -3, -3, -4, -4, -3, -3, -2],
	[-1, -2, -2, -2, -2, -2, -2, -1],
	[2, 2, 0, 0, 0, 0, 2, 2],
	[2, 3, 1, 0, 0, 1, 3, 2],
]

const flip = (t: Table): Table => [...t].reverse().map((row) => [...row].reverse())
const pawnEvalBlack = flip(pawnEvalWhite)
const bishopEvalBlack = flip(bishopEvalWhite)
const rookEvalBlack = flip(rookEvalWhite)
const kingEvalBlack = flip(kingEvalWhite)

const VALUES: Record<Piece, [number, Table]> = {
	P: [10, pawnEvalWhite],
	p: [10, pawnEvalBlack],
	N: [30, knightEval],
	n: [30, knightEval],
	B: [30, bishopEvalWhite],
	b: [30, bishopEvalBlack],
	R: [50, rookEvalWhite],
	r: [50, rookEvalBlack],
	Q: [90, queenEval],
	q: [90, queenEval],
	K: [9000, kingEvalWhite],
	k: [9000, kingEvalBlack],
}

export const GOOD_SQUARES: Record<string, number> = { e4: 1, e5: 1, d4: 1, d5: 1, c6: 0.5, d6: 0.5, e6: 0.5, f6: 0.5, c3: 0.5, d3: 0.5, e3: 0.5, f3: 0.5, c4: 0.5, c5: 0.5, f4: 0.5, f5: 0.5 }

export const FILES = 'abcdefgh'
export const sqName = (s: number) => `${FILES[s % 8]}${Math.floor(s / 8) + 1}`
export const colorOf = (p: Piece): Color => (p === p.toUpperCase() ? 'w' : 'b')
const fileOf = (s: number) => s % 8
const rankOf = (s: number) => Math.floor(s / 8)

export function startPosition(): Position {
	const board: Square[] = Array(64).fill(null)
	const back: Piece[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
	for (let f = 0; f < 8; f++) {
		board[f] = back[f]
		board[8 + f] = 'P'
		board[48 + f] = 'p'
		board[56 + f] = back[f].toLowerCase() as Piece
	}
	return { board, turn: 'w', castling: { K: true, Q: true, k: true, q: true }, ep: null }
}

const KNIGHT: [number, number][] = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]]
const KING: [number, number][] = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]
const ROOK_DIRS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]]
const BISHOP_DIRS: [number, number][] = [[1, 1], [1, -1], [-1, 1], [-1, -1]]

function step(s: number, df: number, dr: number): number {
	const f = fileOf(s) + df
	const r = rankOf(s) + dr
	return f < 0 || f > 7 || r < 0 || r > 7 ? -1 : r * 8 + f
}

export function isAttacked(board: Square[], s: number, by: Color): boolean {
	const up = by === 'w' ? -1 : 1
	for (const df of [-1, 1]) {
		const t = step(s, df, up)
		if (t >= 0 && board[t] === (by === 'w' ? 'P' : 'p')) return true
	}
	for (const [df, dr] of KNIGHT) {
		const t = step(s, df, dr)
		if (t >= 0 && board[t] === (by === 'w' ? 'N' : 'n')) return true
	}
	for (const [df, dr] of KING) {
		const t = step(s, df, dr)
		if (t >= 0 && board[t] === (by === 'w' ? 'K' : 'k')) return true
	}
	const sliders: [[number, number][], string][] = [
		[ROOK_DIRS, by === 'w' ? 'RQ' : 'rq'],
		[BISHOP_DIRS, by === 'w' ? 'BQ' : 'bq'],
	]
	for (const [dirs, pieces] of sliders) {
		for (const [df, dr] of dirs) {
			let t = step(s, df, dr)
			while (t >= 0) {
				const p = board[t]
				if (p) {
					if (pieces.includes(p)) return true
					break
				}
				t = step(t, df, dr)
			}
		}
	}
	return false
}

const kingSquare = (board: Square[], c: Color) => board.indexOf(c === 'w' ? 'K' : 'k')

export function inCheck(pos: Position, c: Color = pos.turn): boolean {
	const k = kingSquare(pos.board, c)
	return k >= 0 && isAttacked(pos.board, k, c === 'w' ? 'b' : 'w')
}

function pseudoMoves(pos: Position): Move[] {
	const { board, turn } = pos
	const moves: Move[] = []
	const enemy: Color = turn === 'w' ? 'b' : 'w'
	for (let s = 0; s < 64; s++) {
		const p = board[s]
		if (!p || colorOf(p) !== turn) continue
		const kind = p.toUpperCase()
		if (kind === 'P') {
			const dir = turn === 'w' ? 1 : -1
			const startRank = turn === 'w' ? 1 : 6
			const lastRank = turn === 'w' ? 7 : 0
			const one = step(s, 0, dir)
			if (one >= 0 && !board[one]) {
				moves.push({ from: s, to: one, promo: rankOf(one) === lastRank })
				const two = step(s, 0, 2 * dir)
				if (rankOf(s) === startRank && two >= 0 && !board[two]) moves.push({ from: s, to: two })
			}
			for (const df of [-1, 1]) {
				const t = step(s, df, dir)
				if (t < 0) continue
				const q = board[t]
				if (q && colorOf(q) === enemy) moves.push({ from: s, to: t, promo: rankOf(t) === lastRank })
				else if (t === pos.ep) moves.push({ from: s, to: t, ep: true })
			}
		} else if (kind === 'N' || kind === 'K') {
			for (const [df, dr] of kind === 'N' ? KNIGHT : KING) {
				const t = step(s, df, dr)
				if (t < 0) continue
				const q = board[t]
				if (!q || colorOf(q) === enemy) moves.push({ from: s, to: t })
			}
			if (kind === 'K') {
				const base = turn === 'w' ? 0 : 56
				const [kc, qc] = turn === 'w' ? (['K', 'Q'] as const) : (['k', 'q'] as const)
				if (s === base + 4 && !isAttacked(board, s, enemy)) {
					if (pos.castling[kc] && board[base + 7] === (turn === 'w' ? 'R' : 'r') && !board[base + 5] && !board[base + 6] && !isAttacked(board, base + 5, enemy) && !isAttacked(board, base + 6, enemy))
						moves.push({ from: s, to: base + 6, castle: kc })
					if (pos.castling[qc] && board[base] === (turn === 'w' ? 'R' : 'r') && !board[base + 1] && !board[base + 2] && !board[base + 3] && !isAttacked(board, base + 3, enemy) && !isAttacked(board, base + 2, enemy))
						moves.push({ from: s, to: base + 2, castle: qc })
				}
			}
		} else {
			const dirs = kind === 'R' ? ROOK_DIRS : kind === 'B' ? BISHOP_DIRS : [...ROOK_DIRS, ...BISHOP_DIRS]
			for (const [df, dr] of dirs) {
				let t = step(s, df, dr)
				while (t >= 0) {
					const q = board[t]
					if (!q) moves.push({ from: s, to: t })
					else {
						if (colorOf(q) === enemy) moves.push({ from: s, to: t })
						break
					}
					t = step(t, df, dr)
				}
			}
		}
	}
	return moves
}

export function makeMove(pos: Position, m: Move): Position {
	const board = pos.board.slice()
	const p = board[m.from] as Piece
	const castling = { ...pos.castling }
	board[m.to] = m.promo ? ((colorOf(p) === 'w' ? 'Q' : 'q') as Piece) : p
	board[m.from] = null
	if (m.ep) board[m.to + (pos.turn === 'w' ? -8 : 8)] = null
	if (m.castle) {
		const base = pos.turn === 'w' ? 0 : 56
		if (m.castle === 'K' || m.castle === 'k') {
			board[base + 5] = board[base + 7]
			board[base + 7] = null
		} else {
			board[base + 3] = board[base]
			board[base] = null
		}
	}
	if (p === 'K') castling.K = castling.Q = false
	if (p === 'k') castling.k = castling.q = false
	for (const s of [m.from, m.to]) {
		if (s === 0) castling.Q = false
		if (s === 7) castling.K = false
		if (s === 56) castling.q = false
		if (s === 63) castling.k = false
	}
	const ep = p.toUpperCase() === 'P' && Math.abs(m.to - m.from) === 16 ? (m.from + m.to) / 2 : null
	return { board, turn: pos.turn === 'w' ? 'b' : 'w', castling, ep }
}

export function legalMoves(pos: Position): Move[] {
	return pseudoMoves(pos).filter((m) => !inCheck(makeMove(pos, m), pos.turn))
}

export function perft(depth: number, pos: Position = startPosition()): number {
	if (depth === 0) return 1
	let n = 0
	for (const m of legalMoves(pos)) n += perft(depth - 1, makeMove(pos, m))
	return n
}

/* ---------- Evaluation, as in minimax.py ---------- */

type Turn = 'white' | 'black'

function evaluationBoard(board: Square[]): number {
	let total = 0
	for (let s = 0; s < 64; s++) {
		const p = board[s]
		if (!p) continue
		const [base, table] = VALUES[p]
		const v = base + table[rankOf(s)][fileOf(s)]
		total += colorOf(p) === 'w' ? v : -v
	}
	return total
}

function leafScore(pos: Position, turn: Turn): number {
	const moves = legalMoves(pos)
	const check = inCheck(pos)
	const mate = check && moves.length === 0
	let node = 0
	if (check) node += turn === 'white' ? 10 : -10
	node += evaluationBoard(pos.board)
	if (mate) node += turn === 'white' ? Infinity : -Infinity
	for (const m of moves) {
		const bonus = GOOD_SQUARES[sqName(m.to)]
		if (bonus) node += turn === 'white' ? bonus : -bonus
	}
	return -node
}

/** Static score of the current position from Black's point of view, using the same leaf formula. */
export function evaluate(pos: Position): number {
	return leafScore(pos, pos.turn === 'w' ? 'black' : 'white')
}

export interface SearchStats {
	nodes: number
	pruned: number
}

interface Ctx {
	stats: SearchStats
	deadline: number
	textbook: boolean
}

function minimax(pos: Position, depth: number, alpha: number, beta: number, maximizing: boolean, turn: Turn, ctx: Ctx): number {
	ctx.stats.nodes++
	if (depth === 0 || performance.now() >= ctx.deadline) return leafScore(pos, turn)
	const moves = legalMoves(pos)
	if (maximizing) {
		let best = -Infinity
		for (let i = 0; i < moves.length; i++) {
			const value = minimax(makeMove(pos, moves[i]), depth - 1, alpha, beta, false, 'black', ctx)
			best = Math.max(best, value)
			alpha = Math.max(alpha, value)
			if (beta <= alpha) {
				ctx.stats.pruned += moves.length - i - 1
				return best
			}
			if (performance.now() >= ctx.deadline) return best
		}
		return best
	}
	let best = Infinity
	for (let i = 0; i < moves.length; i++) {
		const value = minimax(makeMove(pos, moves[i]), depth - 1, alpha, beta, true, 'white', ctx)
		best = Math.min(best, value)
		if (ctx.textbook) beta = Math.min(beta, value)
		if (beta <= alpha) {
			ctx.stats.pruned += moves.length - i - 1
			return best
		}
		if (performance.now() >= ctx.deadline) return best
	}
	return best
}

export interface SearchResult {
	move: Move | null
	score: number
	stats: SearchStats
	timedOut: boolean
}

/**
 * minimaxRoot for Black. Async so the page can repaint between root moves.
 * Like the original, ties keep the later move (value >= best).
 */
export async function searchBestMove(pos: Position, depth: number, opts: { limitMs: number; textbook: boolean }): Promise<SearchResult> {
	const ctx: Ctx = { stats: { nodes: 0, pruned: 0 }, deadline: performance.now() + opts.limitMs, textbook: opts.textbook }
	let best = -Infinity
	let bestMove: Move | null = null
	let timedOut = false
	for (const m of legalMoves(pos)) {
		const value = minimax(makeMove(pos, m), depth - 1, -Infinity, Infinity, false, 'black', ctx)
		if (value >= best) {
			best = value
			bestMove = m
		}
		if (performance.now() >= ctx.deadline) {
			timedOut = true
			break
		}
		await new Promise<void>((resolve) => setTimeout(resolve, 0))
	}
	return { move: bestMove, score: best, stats: ctx.stats, timedOut }
}

export type Outcome = 'checkmate' | 'stalemate' | null

export function outcome(pos: Position): Outcome {
	if (legalMoves(pos).length > 0) return null
	return inCheck(pos) ? 'checkmate' : 'stalemate'
}

const LETTERS = { en: { N: 'N', B: 'B', R: 'R', Q: 'Q', K: 'K' }, es: { N: 'C', B: 'A', R: 'T', Q: 'D', K: 'R' } } as const

/** Coordinate notation with a piece letter, for example Ng8-f6 or e7xd6. */
export function moveLabel(pos: Position, m: Move, lang: 'en' | 'es'): string {
	if (m.castle) return m.castle.toUpperCase() === 'K' ? 'O-O' : 'O-O-O'
	const p = pos.board[m.from] as Piece
	const kind = p.toUpperCase() as 'P' | 'N' | 'B' | 'R' | 'Q' | 'K'
	const letter = kind === 'P' ? '' : LETTERS[lang][kind]
	const capture = pos.board[m.to] || m.ep ? 'x' : '-'
	return `${letter}${sqName(m.from)}${capture}${sqName(m.to)}${m.promo ? `=${LETTERS[lang].Q}` : ''}`
}
