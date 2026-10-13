'use client'

import { SCENE_LABELS, easeInOut, span, useSceneTimeline } from '../kit/scene'

/*
 * Alpha-beta on a small illustrative tree (depth 2, branching 3), searched
 * left to right exactly like minimax.py does with the beta update. Every
 * number on screen (values, alpha, beta, visited, pruned) is derived from the
 * leaf scores below, so the counters always match the tree.
 */

import { SceneFrame } from './scene-frame'

type Lang = 'en' | 'es'

const MOVES = ['e4', 'Nf3', 'Qh5'] as const
// null = never evaluated because the branch is pruned.
const LEAVES: (number | null)[][] = [
	[3, 12, 8],
	[2, null, null],
	[14, 1, null],
]

const STEP = 760
const W = 380
const H = 300
const ROOT = { x: 190, y: 40 }
const MIN_Y = 146
const LEAF_Y = 252
const MIN_X = [66, 190, 314]
const LEAF_DX = [-40, 0, 40]

type Event =
	| { kind: 'start' }
	| { kind: 'down'; branch: number }
	| { kind: 'leaf'; branch: number; leaf: number; value: number; beta: number }
	| { kind: 'prune'; branch: number; from: number; beta: number; alpha: number }
	| { kind: 'up'; branch: number; value: number; alpha: number }
	| { kind: 'best'; branch: number; value: number }

function buildEvents() {
	const events: Event[] = [{ kind: 'start' }]
	let alpha = -Infinity
	let best = 0
	LEAVES.forEach((leaves, branch) => {
		events.push({ kind: 'down', branch })
		let beta = Infinity
		for (let leaf = 0; leaf < leaves.length; leaf++) {
			const value = leaves[leaf]
			if (value === null) break
			beta = Math.min(beta, value)
			events.push({ kind: 'leaf', branch, leaf, value, beta })
			if (beta <= alpha && leaf < leaves.length - 1) {
				events.push({ kind: 'prune', branch, from: leaf + 1, beta, alpha })
				break
			}
		}
		if (beta > alpha) {
			alpha = beta
			best = branch
		}
		events.push({ kind: 'up', branch, value: beta, alpha })
	})
	events.push({ kind: 'best', branch: best, value: alpha })
	return events
}

const EVENTS = buildEvents()
const DURATION = EVENTS.length * STEP + 600
const TOTAL_NODES = 1 + LEAVES.length + LEAVES.length * 3
const LEAF_TOTAL = LEAVES.flat().length

const COPY = {
	en: {
		kicker: 'minimax.py',
		title: 'Alpha-beta, one branch at a time',
		max: 'MAX',
		min: 'MIN',
		engine: 'Engine to move',
		reply: 'Best reply',
		leaves: 'evaluate',
		visited: 'Nodes visited',
		pruned: 'Leaves pruned',
		alpha: 'alpha',
		beta: 'beta',
		bestMove: 'Best move',
		prunedTag: 'pruned',
		note: 'Illustrative tree and scores. Same order and pruning rule as the engine with the beta update.',
		start: 'minimaxRoot lists the candidate moves. Alpha starts at minus infinity: nothing is proven yet.',
		down: (m: string) => `minimax goes down ${m}. Now it is the opponent who chooses, so this level keeps the minimum.`,
		leaf: (v: number, b: number) => `evaluate scores the leaf at ${v}. Beta for this reply is now ${b}.`,
		prune: (b: number, a: number) => `Beta ${b} is not above alpha ${a}: this move is already worse than one we have. The rest of the branch is skipped.`,
		up: (m: string, v: number, a: number) => `${m} is worth ${v}. Alpha at the root is ${a}.`,
		best: (m: string, v: number) => `minimaxRoot keeps ${m} with a value of ${v} and plays it.`,
	},
	es: {
		kicker: 'minimax.py',
		title: 'Alpha-beta, rama por rama',
		max: 'MAX',
		min: 'MIN',
		engine: 'Juega el motor',
		reply: 'Mejor respuesta',
		leaves: 'evaluate',
		visited: 'Nodos visitados',
		pruned: 'Hojas podadas',
		alpha: 'alpha',
		beta: 'beta',
		bestMove: 'Mejor jugada',
		prunedTag: 'podada',
		note: 'Árbol y puntajes ilustrativos. Mismo orden y regla de poda que el motor con la actualización de beta.',
		start: 'minimaxRoot lista las jugadas candidatas. Alpha empieza en menos infinito: todavía no hay nada probado.',
		down: (m: string) => `minimax baja por ${m}. Ahora elige el rival, así que este nivel se queda con el mínimo.`,
		leaf: (v: number, b: number) => `evaluate puntúa la hoja con ${v}. Beta para esta respuesta queda en ${b}.`,
		prune: (b: number, a: number) => `Beta ${b} no supera a alpha ${a}: esta jugada ya es peor que una que tenemos. El resto de la rama se salta.`,
		up: (m: string, v: number, a: number) => `${m} vale ${v}. Alpha en la raíz queda en ${a}.`,
		best: (m: string, v: number) => `minimaxRoot se queda con ${m}, que vale ${v}, y la juega.`,
	},
} as const

const fmt = (n: number) => (n === Infinity ? '+∞' : n === -Infinity ? '−∞' : String(n))

interface State {
	index: number
	local: number
	minValue: (number | null)[]
	leafShown: boolean[][]
	leafFresh: number[][]
	prunedAt: number[][]
	alpha: number
	beta: number
	activeBranch: number | null
	down: { branch: number; t: number } | null
	leafDown: { branch: number; leaf: number; t: number } | null
	upT: { branch: number; t: number } | null
	best: number | null
	bestT: number
	visited: number
	prunedCount: number
}

function stateAt(elapsed: number): State {
	const index = Math.min(EVENTS.length - 1, Math.floor(elapsed / STEP))
	const local = span(elapsed, index * STEP, index * STEP + STEP * 0.8, easeInOut)
	const s: State = {
		index,
		local,
		minValue: LEAVES.map(() => null),
		leafShown: LEAVES.map((l) => l.map(() => false)),
		leafFresh: LEAVES.map((l) => l.map(() => 0)),
		prunedAt: LEAVES.map((l) => l.map(() => 0)),
		alpha: -Infinity,
		beta: Infinity,
		activeBranch: null,
		down: null,
		leafDown: null,
		upT: null,
		best: null,
		bestT: 0,
		visited: 1,
		prunedCount: 0,
	}
	for (let i = 0; i <= index; i++) {
		const e = EVENTS[i]
		const t = i === index ? local : 1
		if (e.kind === 'down') {
			s.activeBranch = e.branch
			s.beta = Infinity
			s.visited += 1
			if (i === index) s.down = { branch: e.branch, t }
		} else if (e.kind === 'leaf') {
			s.leafShown[e.branch][e.leaf] = true
			s.leafFresh[e.branch][e.leaf] = i === index ? 1 - t * 0.6 : 0
			s.beta = e.beta
			s.minValue[e.branch] = e.beta
			s.visited += 1
			if (i === index) s.leafDown = { branch: e.branch, leaf: e.leaf, t }
		} else if (e.kind === 'prune') {
			for (let l = e.from; l < 3; l++) s.prunedAt[e.branch][l] = t
			s.prunedCount += 3 - e.from
		} else if (e.kind === 'up') {
			s.alpha = e.alpha
			s.minValue[e.branch] = e.value
			if (i === index) s.upT = { branch: e.branch, t }
			else s.activeBranch = null
		} else if (e.kind === 'best') {
			s.best = e.branch
			s.bestT = t
			s.activeBranch = null
		}
	}
	return s
}

function caption(lang: Lang, e: Event) {
	const c = COPY[lang]
	switch (e.kind) {
		case 'start':
			return c.start
		case 'down':
			return c.down(MOVES[e.branch])
		case 'leaf':
			return c.leaf(e.value, e.beta)
		case 'prune':
			return c.prune(e.beta, e.alpha)
		case 'up':
			return c.up(MOVES[e.branch], e.value, e.alpha)
		case 'best':
			return c.best(MOVES[e.branch], e.value)
	}
}

const leafPos = (b: number, l: number) => ({ x: MIN_X[b] + LEAF_DX[l], y: LEAF_Y })

function Packet({ x1, y1, x2, y2, t }: { x1: number; y1: number; x2: number; y2: number; t: number }) {
	if (t <= 0.02 || t >= 0.98) return null
	const at = (k: number) => ({ x: x1 + (x2 - x1) * k, y: y1 + (y2 - y1) * k })
	const head = at(t)
	return (
		<g>
			{[0.18, 0.1].map((lag, i) => {
				const p = at(Math.max(0, t - lag))
				return <circle key={lag} cx={p.x} cy={p.y} r={2.4 + i} className='fill-[#779A58]' opacity={0.25 + i * 0.15} />
			})}
			<circle cx={head.x} cy={head.y} r={7} className='fill-[#779A58]' opacity={0.25} />
			<circle cx={head.x} cy={head.y} r={3.6} className='fill-[#779A58]' />
		</g>
	)
}

export default function AlphaBetaScene({ lang }: { lang: Lang }) {
	const c = COPY[lang]
	const tl = useSceneTimeline(DURATION, { loop: true, hold: 3200 })
	const s = stateAt(tl.elapsed)
	const event = EVENTS[s.index]
	const rootValue = s.alpha
	const final = s.best !== null

	return (
		<SceneFrame
			timeline={tl}
			labels={SCENE_LABELS[lang]}
			kicker={c.kicker}
			title={c.title}
			caption={<span className='block min-h-[4.5rem] sm:min-h-[3rem]'>{caption(lang, event)}</span>}
		>
			<div className='grid min-w-0 gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center'>
				<svg viewBox={`0 0 ${W} ${H}`} className='mx-auto block h-auto w-full max-w-[34rem]' role='img' aria-label={c.note}>
					<text x={6} y={ROOT.y + 4} className='fill-[#1c1917] font-mono' fontSize={11}>{c.max}</text>
					<text x={6} y={MIN_Y - 26} className='fill-[#1c1917] font-mono' fontSize={11}>{c.min}</text>
					{/* edges root -> min */}
					{MIN_X.map((x, b) => {
						const lit = s.activeBranch === b || s.best === b || s.minValue[b] !== null
						const best = s.best === b
						return (
							<g key={`e${b}`}>
								<line x1={ROOT.x} y1={ROOT.y + 18} x2={x} y2={MIN_Y - 18} strokeWidth={best ? 3 : 1.6} className={best ? 'stroke-[#779A58]' : lit ? 'stroke-[#779A58]' : 'stroke-[#a8a29e]'} />
								<text x={(ROOT.x + x) / 2 + (b === 1 ? 14 : b === 0 ? -14 : 14)} y={(ROOT.y + MIN_Y) / 2 + 2} textAnchor='middle' fontSize={12} className={`font-mono ${best ? 'fill-[#779A58]' : 'fill-[#1c1917]'}`}>
									{MOVES[b]}
								</text>
							</g>
						)
					})}
					{/* edges min -> leaves and leaves */}
					{LEAVES.map((leaves, b) =>
						leaves.map((value, l) => {
							const p = leafPos(b, l)
							const pruned = s.prunedAt[b][l]
							const shown = s.leafShown[b][l]
							const fresh = s.leafFresh[b][l]
							return (
								<g key={`l${b}${l}`} opacity={pruned > 0 ? 1 - pruned * 0.55 : 1}>
									<line
										x1={MIN_X[b]}
										y1={MIN_Y + 18}
										x2={p.x}
										y2={p.y - 15}
										strokeWidth={1.4}
										strokeDasharray={pruned > 0 ? '3 4' : undefined}
										className={pruned > 0 ? 'stroke-[#C84646]' : shown ? 'stroke-[#779A58]' : 'stroke-[#a8a29e]'}
									/>
									<rect
										x={p.x - 15}
										y={p.y - 15}
										width={30}
										height={30}
										rx={6}
										strokeWidth={1.4}
										className={pruned > 0 ? 'fill-[#f7f6f2] stroke-[#C84646]' : shown ? 'fill-[#779A58] stroke-[#779A58]' : 'fill-[#f7f6f2] stroke-[#a8a29e]'}
										style={fresh > 0.05 ? { filter: `drop-shadow(0 0 ${6 * fresh}px rgb(119 154 88 / 0.8))` } : undefined}
									/>
									<text x={p.x} y={p.y + 4.5} textAnchor='middle' fontSize={13} fontWeight={600} className={`tabular-nums ${shown ? 'fill-[#1c1917]' : 'fill-[#1c1917]'}`}>
										{shown && value !== null ? value : pruned > 0 ? '' : '?'}
									</text>
									{pruned > 0 && (
										<g opacity={pruned}>
											<line x1={(MIN_X[b] + p.x) / 2 - 7} y1={(MIN_Y + 18 + p.y - 15) / 2 - 5} x2={(MIN_X[b] + p.x) / 2 + 7} y2={(MIN_Y + 18 + p.y - 15) / 2 + 5} strokeWidth={2.2} className='stroke-[#C84646]' />
											<line x1={p.x - 9} y1={p.y - 9} x2={p.x + 9} y2={p.y + 9} strokeWidth={1.6} className='stroke-[#C84646]' />
										</g>
									)}
								</g>
							)
						}),
					)}
					{/* pruned tags under pruned groups */}
					{LEAVES.map((leaves, b) => {
						const first = leaves.findIndex((_, l) => s.prunedAt[b][l] > 0)
						if (first < 0) return null
						const p = leafPos(b, first)
						const last = leafPos(b, 2)
						return (
							<text key={`t${b}`} x={(p.x + last.x) / 2} y={LEAF_Y + 32} textAnchor='middle' fontSize={11} className='fill-[#C84646]' opacity={s.prunedAt[b][first]}>
								{c.prunedTag}
							</text>
						)
					})}
					{/* min nodes */}
					{MIN_X.map((x, b) => {
						const active = s.activeBranch === b
						const value = s.minValue[b]
						const best = s.best === b
						return (
							<g key={`m${b}`}>
								<circle cx={x} cy={MIN_Y} r={18} strokeWidth={active || best ? 2 : 1.4} className={best ? 'fill-[#779A58] stroke-[#779A58]' : active ? 'fill-[#f7f6f2] stroke-[#779A58]' : value !== null ? 'fill-[#f7f6f2] stroke-[#a8a29e]' : 'fill-[#f7f6f2] stroke-[#a8a29e]'} style={active ? { filter: 'drop-shadow(0 0 6px rgb(119 154 88 / 0.6))' } : undefined} />
								<text x={x} y={MIN_Y + 4.5} textAnchor='middle' fontSize={13} fontWeight={600} className={`tabular-nums ${value !== null ? 'fill-[#1c1917]' : 'fill-[#1c1917]'}`}>
									{value !== null ? value : '·'}
								</text>
								<text x={x + 24} y={MIN_Y - 14} fontSize={11} className='fill-[#779A58] font-mono' opacity={active ? 1 : 0}>
									β {fmt(s.beta)}
								</text>
							</g>
						)
					})}
					{/* root */}
					<circle cx={ROOT.x} cy={ROOT.y} r={20} strokeWidth={2} className={final ? 'fill-[#779A58] stroke-[#779A58]' : 'fill-[#f7f6f2] stroke-[#779A58]'} style={{ filter: `drop-shadow(0 0 ${final ? 10 * s.bestT : 4}px rgb(119 154 88 / 0.6))` }} />
					<text x={ROOT.x} y={ROOT.y + 4.5} textAnchor='middle' fontSize={13} fontWeight={700} className='fill-[#1c1917] tabular-nums'>
						{rootValue === -Infinity ? '·' : rootValue}
					</text>
					<text x={ROOT.x + 28} y={ROOT.y - 10} fontSize={11} className='fill-[#779A58] font-mono'>
						α {fmt(s.alpha)}
					</text>
					{/* packets */}
					{s.down && <Packet x1={ROOT.x} y1={ROOT.y + 18} x2={MIN_X[s.down.branch]} y2={MIN_Y - 18} t={s.down.t} />}
					{s.leafDown && <Packet x1={MIN_X[s.leafDown.branch]} y1={MIN_Y + 18} x2={leafPos(s.leafDown.branch, s.leafDown.leaf).x} y2={LEAF_Y - 15} t={Math.min(1, s.leafDown.t * 1.6)} />}
					{s.upT && <Packet x1={MIN_X[s.upT.branch]} y1={MIN_Y - 18} x2={ROOT.x} y2={ROOT.y + 18} t={s.upT.t} />}
				</svg>

				<div className='min-w-0 rounded-lg border border-[#e7e5e4] bg-[#f7f6f2] p-3 font-mono text-xs'>
					<dl className='grid grid-cols-[1fr_auto] gap-x-3 gap-y-2'>
						<dt className='text-[#57534e]'>{c.alpha}</dt>
						<dd className='w-[4ch] text-right tabular-nums text-[#486333]'>{fmt(s.alpha)}</dd>
						<dt className='text-[#57534e]'>{c.beta}</dt>
						<dd className='w-[4ch] text-right tabular-nums text-[#486333]'>{s.activeBranch === null ? '·' : fmt(s.beta)}</dd>
						<dt className='text-[#57534e]'>{c.visited}</dt>
						<dd className='text-right tabular-nums text-[#1c1917]'>
							{String(s.visited).padStart(2, '\u2007')}/{TOTAL_NODES}
						</dd>
						<dt className='text-[#57534e]'>{c.pruned}</dt>
						<dd className='text-right tabular-nums text-[#C84646]'>
							{s.prunedCount}/{LEAF_TOTAL}
						</dd>
						<dt className='text-[#57534e]'>{c.bestMove}</dt>
						<dd className='text-right text-[#1c1917]'>
							<span className={final ? 'text-[#486333]' : 'invisible'}>{MOVES[s.best ?? 0]}</span>
						</dd>
					</dl>
					<div className='mt-3 h-1.5 overflow-hidden rounded-full bg-[#f7f6f2]' aria-hidden>
						<div className='h-full rounded-full bg-[#779A58] transition-none' style={{ width: `${(s.visited / TOTAL_NODES) * 100}%` }} />
					</div>
					<p className='mt-3 font-sans text-[11px] leading-relaxed text-[#57534e]'>{c.note}</p>
				</div>
			</div>
		</SceneFrame>
	)
}

