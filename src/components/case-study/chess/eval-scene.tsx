'use client'

import { SCENE_LABELS, easeInOut, easeOut, span, useSceneTimeline } from '../kit/scene'

import { SceneFrame } from './scene-frame'

type Lang = 'en' | 'es'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const GOOD: Record<string, number> = { e4: 1, e5: 1, d4: 1, d5: 1, c6: 0.5, d6: 0.5, e6: 0.5, f6: 0.5, c3: 0.5, d3: 0.5, e3: 0.5, f3: 0.5, c4: 0.5, c5: 0.5, f4: 0.5, f5: 0.5 }
// A lone knight on f3: its eight legal moves, in the order they are generated here.
const KNIGHT = 'f3'
const TARGETS = ['e5', 'g5', 'h4', 'h2', 'g1', 'e1', 'd2', 'd4']

const BAR_START = 300
const BAR_STEP = 420
const HEAT_START = 600
const KNIGHT_START = 3400
const HOP = 620
const DURATION = KNIGHT_START + TARGETS.length * HOP + 700

const COPY = {
	en: {
		kicker: 'evaluate',
		title: 'What the engine adds up at a leaf',
		knightNote: 'Example: a lone knight on f3 has eight legal moves; two of them land on center squares.',
		mobility: 'Center moves bonus',
		captions: [
			'Material first: each piece adds its base value.',
			'The center squares light up: 1 for the four in the middle, 0.5 for the ring.',
			'Then every legal move is checked: a knight on f3 earns a bonus for each move that lands on a good square.',
			'Two of its eight moves reach the center, so the position gets +2 on top of material.',
		],
	},
	es: {
		kicker: 'evaluate',
		title: 'Lo que el motor suma en una hoja',
		knightNote: 'Ejemplo: un caballo solo en f3 tiene ocho jugadas legales; dos caen en casillas centrales.',
		mobility: 'Bono por jugadas al centro',
		captions: [
			'Primero el material: cada pieza suma su valor base.',
			'Se encienden las casillas del centro: 1 para las cuatro del medio, 0.5 para el anillo.',
			'Luego se revisa cada jugada legal: un caballo en f3 gana un bono por cada jugada que cae en una casilla buena.',
			'Dos de sus ocho jugadas llegan al centro, así que la posición suma +2 además del material.',
		],
	},
} as const

const coord = (sq: string) => ({ x: FILES.indexOf(sq[0]) + 0.5, y: 8 - Number(sq[1]) + 0.5 })

export default function EvalScene({
	lang,
	pieces,
	piecesTitle,
	kingNote,
	squaresTitle,
	squaresNote,
}: {
	lang: Lang
	pieces: readonly { glyph: string; value: number }[]
	piecesTitle: string
	kingNote: string
	squaresTitle: string
	squaresNote: string
}) {
	const c = COPY[lang]
	const tl = useSceneTimeline(DURATION, { loop: true, hold: 3500 })
	const e = tl.elapsed
	const hop = Math.min(TARGETS.length - 1, Math.max(0, Math.floor((e - KNIGHT_START) / HOP)))
	const hopT = e < KNIGHT_START ? 0 : span(e, KNIGHT_START + hop * HOP, KNIGHT_START + hop * HOP + HOP * 0.7, easeInOut)
	const reached = (i: number) => e >= KNIGHT_START + i * HOP + HOP * 0.7
	const bonus = TARGETS.reduce((sum, sq, i) => sum + (reached(i) && GOOD[sq] === 1 ? 1 : reached(i) ? GOOD[sq] ?? 0 : 0), 0)
	const knight = span(e, KNIGHT_START - 400, KNIGHT_START, easeOut)
	const phase = e < HEAT_START + 600 ? 0 : e < KNIGHT_START ? 1 : reached(TARGETS.length - 1) ? 3 : 2
	const from = coord(KNIGHT)
	const to = coord(TARGETS[hop])
	const moving = e >= KNIGHT_START && !reached(TARGETS.length - 1) && hopT > 0.02 && hopT < 0.98

	return (
		<SceneFrame
			timeline={tl}
			labels={SCENE_LABELS[lang]}
			kicker={c.kicker}
			title={c.title}
			caption={<span className='block min-h-[4.5rem] sm:min-h-[3rem]'>{c.captions[phase]}</span>}
		>
			<div className='grid min-w-0 gap-4 p-3 sm:p-4 lg:grid-cols-2'>
				<div className='min-w-0 rounded-lg border border-[#e7e5e4] bg-[#f7f6f2] p-4'>
					<h3 className='font-mono text-[11px] uppercase tracking-wider text-[#486333]'>{piecesTitle}</h3>
					<ul className='mt-5 space-y-3'>
						{pieces.map((piece, i) => {
							const grow = span(e, BAR_START + i * BAR_STEP, BAR_START + i * BAR_STEP + 700, easeOut)
							return (
								<li key={piece.glyph} className='grid grid-cols-[2rem_1fr_2.5rem] items-center gap-3'>
									<span className='text-2xl leading-none text-[#1c1917]' aria-hidden style={{ opacity: 0.35 + 0.65 * grow }}>
										{piece.glyph}
									</span>
									<span className='h-2 overflow-hidden rounded-full bg-[#f7f6f2]'>
										<span className='block h-full rounded-full bg-[#779A58]' style={{ width: `${(piece.value / 90) * 100 * grow}%` }} />
									</span>
									<span className='text-right font-mono text-sm tabular-nums text-[#1c1917]'>{Math.round(piece.value * grow)}</span>
								</li>
							)
						})}
					</ul>
					<p className='mt-5 flex items-center gap-3 text-sm text-[#57534e]'>
						<span className='text-2xl leading-none text-[#1c1917]' aria-hidden>
							♔
						</span>
						{kingNote}
					</p>
				</div>

				<div className='min-w-0 rounded-lg border border-[#e7e5e4] bg-[#f7f6f2] p-4'>
					<div className='flex items-start justify-between gap-3'>
						<h3 className='font-mono text-[11px] uppercase tracking-wider text-[#486333]'>{squaresTitle}</h3>
						<p className='shrink-0 text-right font-mono text-xs text-[#57534e]'>
							<span className='sr-only'>{c.mobility}: </span>
							<span aria-hidden>{c.mobility} </span>
							<span className='inline-block w-[3ch] text-left tabular-nums text-[#486333]'>+{bonus}</span>
						</p>
					</div>
					<div className='relative mx-auto mt-5 aspect-square w-full max-w-[280px] overflow-hidden rounded-lg border border-[#e7e5e4]' role='img' aria-label={`${squaresNote} ${c.knightNote}`}>
						<div className='grid h-full grid-cols-8 grid-rows-8'>
							{[8, 7, 6, 5, 4, 3, 2, 1].flatMap((rank) =>
								FILES.map((file, fi) => {
									const sq = `${file}${rank}`
									const v = GOOD[sq] ?? 0
									const dark = (fi + rank) % 2 === 0
									const ring = v === 1 ? 0 : 1
									const lit = v ? span(e, HEAT_START + ring * 700, HEAT_START + ring * 700 + 600, easeOut) : 0
									const targetIndex = TARGETS.indexOf(sq)
									const hit = targetIndex >= 0 && reached(targetIndex)
									return (
										<span key={sq} className={`relative flex items-center justify-center font-mono text-[9px] leading-none ${dark ? 'bg-[#779A58]' : 'bg-[#EAEBC8]'}`}>
											{v > 0 && <span className={`absolute inset-0 ${dark ? 'bg-[#ACC333]' : 'bg-[#F4F774]'}`} style={{ opacity: lit }} />}
											{hit && <span className={`absolute inset-[18%] rounded-full border-2 ${v ? 'border-[#486333]' : 'border-[#e7e5e4]'}`} />}
											<span className={`relative ${v === 1 ? 'text-[#57534e]' : 'text-[#1c1917]'}`} style={{ opacity: lit }}>
												{v ? v : ''}
											</span>
										</span>
									)
								}),
							)}
						</div>
						<svg viewBox='0 0 8 8' className='pointer-events-none absolute inset-0 h-full w-full' aria-hidden>
							{TARGETS.map((sq, i) => {
								if (!reached(i) && i !== hop) return null
								const p = coord(sq)
								const t = reached(i) ? 1 : e >= KNIGHT_START ? hopT : 0
								return <line key={sq} x1={from.x} y1={from.y} x2={from.x + (p.x - from.x) * t} y2={from.y + (p.y - from.y) * t} strokeWidth={0.06} strokeLinecap='round' className={GOOD[sq] ? 'stroke-[#779A58]' : 'stroke-[#a8a29e]'} />
							})}
							{moving && <circle cx={from.x + (to.x - from.x) * hopT} cy={from.y + (to.y - from.y) * hopT} r={0.16} className='fill-[#779A58]' />}
							<text x={from.x} y={from.y + 0.32} textAnchor='middle' fontSize={0.9} className='fill-white' opacity={knight} style={{ paintOrder: 'stroke' }} stroke='rgb(2 6 23)' strokeWidth={0.06}>
								♘
							</text>
						</svg>
					</div>
					<p className='mt-5 text-sm text-[#57534e]'>{squaresNote}</p>
					<p className='mt-2 text-xs text-[#57534e]'>{c.knightNote}</p>
				</div>
			</div>
		</SceneFrame>
	)
}
