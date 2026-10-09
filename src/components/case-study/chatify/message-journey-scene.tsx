'use client'

import type { ReactNode } from 'react'
import { Check, CheckCheck } from 'lucide-react'
import {
	SCENE_LABELS,
	easeInOut,
	easeOut,
	linear,
	phaseAt,
	pointOnPolyline,
	span,
	typed,
	useSceneTimeline,
} from '../kit/scene'
import { ChatifySceneFrame as SceneFrame } from './scene-frame'

const DURATION = 12000

const COPY = {
	en: {
		kicker: 'Socket.io',
		title: 'From one window to the other',
		you: 'Frainer',
		peer: 'Laura',
		online: 'online',
		typing: 'typing...',
		placeholder: 'Type a message',
		message: 'Are you free tonight?',
		sent: 'Sent',
		delivered: 'Delivered',
		read: 'Read',
		log: 'Events',
		note: 'Event names come from the project source code.',
		server: 'Socket.io',
		db: 'Turso',
		captions: [
			'The Auth0 JWT rides the handshake and the shield turns green.',
			"Frainer types. Laura's window shows him typing.",
			'His client emits new_message. The bubble leaves with one tick.',
			'The server writes the message into Turso (libSQL).',
			'chat_message reaches Laura and delivered_message turns the ticks into a pair.',
			'read_message returns and the ticks take the read color.',
		],
	},
	es: {
		kicker: 'Socket.io',
		title: 'De una ventana a la otra',
		you: 'Frainer',
		peer: 'Laura',
		online: 'en línea',
		typing: 'escribiendo...',
		placeholder: 'Escribe un mensaje',
		message: '¿Estás libre esta noche?',
		sent: 'Enviado',
		delivered: 'Entregado',
		read: 'Leído',
		log: 'Eventos',
		note: 'Los nombres de los eventos vienen del código del proyecto.',
		server: 'Socket.io',
		db: 'Turso',
		captions: [
			'El JWT de Auth0 va en el handshake y el escudo pasa a verde.',
			'Frainer escribe. La ventana de Laura muestra que escribe.',
			'Su cliente emite new_message. El globo sale con un check.',
			'El servidor guarda el mensaje en Turso (libSQL).',
			'chat_message llega a Laura y delivered_message vuelve doble el check.',
			'read_message vuelve y los checks toman el color de leído.',
		],
	},
} as const

const LOG = [
	{ at: 1500, name: 'connection' },
	{ at: 4900, name: 'new_message' },
	{ at: 9300, name: 'chat_message' },
	{ at: 9900, name: 'delivered_message' },
	{ at: 11200, name: 'read_message' },
] as const

const CUE = [0, 1800, 4500, 6300, 8100, 9800]

type Pt = [number, number]

const GEO: Record<'row' | 'stack', { server: Pt; db: Pt; shield: Pt; left: Pt[]; right: Pt[]; down: Pt[]; back: Pt[] }> = {
	row: {
		server: [110, 64],
		db: [110, 170],
		shield: [32, 64],
		left: [[2, 64], [110, 64]],
		right: [[110, 64], [218, 64]],
		down: [[110, 84], [110, 152]],
		back: [[218, 202], [2, 202]],
	},
	stack: {
		server: [110, 96],
		db: [110, 174],
		shield: [110, 34],
		left: [[110, 2], [110, 96]],
		right: [[110, 114], [110, 216]],
		down: [[110, 116], [110, 156]],
		back: [[184, 216], [184, 2]],
	},
}

const pathOf = (pts: Pt[]) => `M ${pts.map((p) => p.join(' ')).join(' L ')}`

function bump(elapsed: number, start: number, end: number) {
	if (elapsed <= start || elapsed >= end) return 0
	return Math.sin(((elapsed - start) / (end - start)) * Math.PI)
}

function journeyAt(elapsed: number) {
	const bubbleOut = span(elapsed, 4500, 4900, easeOut)
	const ticks = bubbleOut < 0.35 ? 0 : elapsed >= 11200 ? 3 : elapsed >= 9900 ? 2 : 1
	return {
		shield: span(elapsed, 1100, 1650),
		server: span(elapsed, 1450, 1900),
		db: span(elapsed, 7300, 8100),
		jwtT: span(elapsed, 280, 1550, easeInOut),
		emitT: span(elapsed, 4700, 6100, easeInOut),
		dropT: span(elapsed, 6400, 7600, easeInOut),
		castT: span(elapsed, 8200, 9500, easeInOut),
		readT: span(elapsed, 9900, 11400, easeInOut),
		typeP: span(elapsed, 1900, 4300, linear),
		bubbleOut,
		bubbleIn: span(elapsed, 9200, 9700, easeOut),
		ticks,
		cue: phaseAt(elapsed, CUE),
		hot: Math.max(bump(elapsed, 400, 1700), bump(elapsed, 4700, 6300), bump(elapsed, 6400, 7800), bump(elapsed, 8200, 9700), bump(elapsed, 9900, 11600)),
	}
}

function Ticks({ level, sent, delivered, read }: { level: number; sent: string; delivered: string; read: string }) {
	const box = 'absolute inset-0 size-4'
	const label = level === 3 ? read : level === 2 ? delivered : level === 1 ? sent : ''
	return (
		<span className='relative inline-block size-4 shrink-0' aria-label={label || undefined}>
			<Check className={`${box} text-gray-500`} style={{ opacity: level === 1 ? 1 : 0 }} aria-hidden />
			<CheckCheck className={`${box} text-gray-500`} style={{ opacity: level === 2 ? 1 : 0 }} aria-hidden />
			<CheckCheck className={`${box} text-blue-500`} style={{ opacity: level === 3 ? 1 : 0 }} aria-hidden />
		</span>
	)
}

function Bubble({ mine, show, text, level, labels }: { mine: boolean; show: number; text: string; level: number; labels: { sent: string; delivered: string; read: string } }) {
	return (
		<div className={`flex w-full ${mine ? 'justify-end' : 'justify-start'}`} style={{ opacity: show, transform: `translateY(${(1 - show) * 8}px)` }}>
			<article className={`w-fit max-w-[92%] rounded-lg border border-transparent px-1 pb-1 pt-1 ${mine ? 'bg-gray-300' : 'bg-gray-100'}`}>
				<p className='inline w-full align-middle text-sm font-medium text-gray-800'>
					{text}{' '}
					<span className='float-end ms-2 mt-1 inline-flex items-end gap-0.5 whitespace-nowrap text-xs font-normal text-gray-500'>
						<time className='text-[10px] tabular-nums' dateTime='2024-06-12T15:24:00Z'>3:24</time>
						{mine && <Ticks level={level} sent={labels.sent} delivered={labels.delivered} read={labels.read} />}
					</span>
				</p>
			</article>
		</div>
	)
}

function Panel({
	name,
	initial,
	mine,
	status,
	draft,
	caret,
	placeholder,
	children,
}: {
	name: string
	initial: string
	mine: boolean
	status: string
	draft: string
	caret: boolean
	placeholder: string
	children: ReactNode
}) {
	return (
		<section className='flex h-32 min-w-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white sm:h-full' aria-hidden>
			<header className='flex h-8 shrink-0 items-center gap-2 border-b border-gray-200 bg-gray-200 px-2'>
				<span className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${mine ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-300 text-gray-800'}`}>{initial}</span>
				<h2 className='min-w-0 truncate text-xs font-bold text-gray-800'>{name}</h2>
				<p className='ms-auto shrink-0 text-[11px] text-emerald-600'>{status}</p>
			</header>
			<div className='flex min-h-0 flex-1 flex-col justify-end gap-1 overflow-hidden px-2 py-1.5'>
				<div className={`flex ${mine ? 'justify-start' : 'justify-end'}`}>
					<p className={`rounded-lg px-1 py-1 text-xs text-gray-800 ${mine ? 'bg-gray-100' : 'bg-gray-300'}`}>👋</p>
				</div>
				{children}
			</div>
			<div className='flex h-8 shrink-0 items-center border-t border-gray-200 px-2'>
				<div className='relative h-6 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-100'>
					<span className='absolute inset-0 truncate px-2.5 text-xs leading-6 text-gray-500' style={{ opacity: draft ? 0 : 1 }}>{placeholder}</span>
					<span className='absolute inset-0 truncate px-2.5 text-xs leading-6 text-gray-800'>
						{draft}
						<span className='ms-px inline-block h-3 w-px translate-y-px bg-blue-500 align-middle' style={{ opacity: caret ? 1 : 0 }} />
					</span>
				</div>
			</div>
		</section>
	)
}

function Dot({ pts, t }: { pts: Pt[]; t: number }) {
	const head = pointOnPolyline(pts, Math.min(1, Math.max(0, t)))
	const visible = t > 0.03 && t < 0.97
	return (
		<g opacity={visible ? 1 : 0}>
			{[0.14, 0.08, 0.03].map((lag, i) => {
				const [x, y] = pointOnPolyline(pts, Math.max(0, t - lag))
				return <circle key={lag} cx={x} cy={y} r={4.4 - i} fill='#3b82f6' opacity={0.28 - i * 0.07} />
			})}
			<circle cx={head[0]} cy={head[1]} r='6' fill='#3b82f6' opacity='0.28' />
			<circle cx={head[0]} cy={head[1]} r='3.1' fill='#3b82f6' />
		</g>
	)
}

function Hub({ layout, elapsed, f, server, db }: { layout: 'row' | 'stack'; elapsed: number; f: ReturnType<typeof journeyAt>; server: string; db: string }) {
	const g = GEO[layout]
	const beat = 0.6 + 0.4 * Math.sin(elapsed / 150)
	const wires = [
		{ pts: g.left, on: Math.max(span(elapsed, 200, 1600), span(elapsed, 4500, 6200)) },
		{ pts: g.down, on: span(elapsed, 6300, 7800) },
		{ pts: g.right, on: span(elapsed, 8100, 9700) },
		{ pts: g.back, on: span(elapsed, 9800, 11600) },
	]
	const shieldFill = f.shield > 0.55 ? '#d1fae5' : '#ffffff'
	const shieldStroke = f.shield > 0.55 ? '#059669' : '#6b7280'
	return (
		<svg viewBox='0 0 220 220' width='220' height='220' className='mx-auto block max-w-full' aria-hidden>
			{wires.map((wire) => (
				<path
					key={wire.pts.map((p) => p.join(',')).join(' ')}
					d={pathOf(wire.pts)}
					fill='none'
					stroke={wire.on > 0.45 ? '#3b82f6' : '#e5e7eb'}
					strokeWidth={wire.on > 0.45 ? 2 : 1.5}
					strokeDasharray={wire.on > 0.45 ? '4 7' : '0'}
					strokeDashoffset={-(elapsed / 42) % 48}
					strokeLinecap='round'
					opacity={0.45 + wire.on * 0.55}
				/>
			))}
			<g transform={`translate(${g.db[0]} ${g.db[1]})`} style={{ filter: f.db > 0.4 ? `drop-shadow(0 0 6px rgb(59 130 246 / ${0.35 + f.db * 0.4}))` : undefined }}>
				<rect x='-36' y='-16' width='72' height='34' rx='8' fill='#ffffff' stroke={f.db > 0.5 ? '#3b82f6' : '#e5e7eb'} strokeWidth='1.5' />
				<text y='5' textAnchor='middle' fontSize='12' fill='#1f2937'>{db}</text>
			</g>
			<g transform={`translate(${g.server[0]} ${g.server[1]})`} style={{ filter: `drop-shadow(0 0 ${4 + f.hot * 6}px rgb(59 130 246 / ${0.2 + f.server * (f.hot > 0.15 ? beat : 0.55)}))` }}>
				<rect x='-46' y='-18' width='92' height='36' rx='18' fill='#ffffff' stroke={f.server > 0.4 ? '#3b82f6' : '#e5e7eb'} strokeWidth='1.5' />
				<text y='4' textAnchor='middle' fontSize='12' fill='#1f2937'>{server}</text>
			</g>
			<g transform={`translate(${g.shield[0] - 11} ${g.shield[1] - 12})`}>
				<path d='M11 21s7-3.4 7-8.6V5.2L11 2.6 4 5.2v7.2C4 17.6 11 21 11 21z' fill={shieldFill} stroke={shieldStroke} strokeWidth='1.4' />
				<text x='11' y='-2' textAnchor='middle' fontSize='11' fill={f.shield > 0.55 ? '#059669' : '#6b7280'}>Auth0</text>
			</g>
			<g>
				{(() => {
					const [x, y] = pointOnPolyline(g.left, f.jwtT)
					const show = f.jwtT > 0.03 && f.jwtT < 0.97
					return (
						<g transform={`translate(${x} ${y})`} opacity={show ? 1 : 0}>
							<rect x='-16' y='-8' width='32' height='16' rx='8' fill='#ffffff' stroke='#3b82f6' />
							<text y='4' textAnchor='middle' fontSize='11' fill='#3b82f6' fontFamily='ui-monospace, monospace'>JWT</text>
						</g>
					)
				})()}
				<Dot pts={g.left} t={f.emitT} />
				<Dot pts={g.down} t={f.dropT} />
				<Dot pts={g.right} t={f.castT} />
				<Dot pts={g.back} t={f.readT} />
			</g>
		</svg>
	)
}

function Log({ elapsed, title, note }: { elapsed: number; title: string; note: string }) {
	return (
		<div className='mt-3 border-t border-gray-200 pt-2' aria-hidden>
			<p className='text-[11px] font-medium uppercase tracking-wide text-gray-500'>{title}</p>
			<ol className='relative mt-1 h-[110px] overflow-hidden'>
				{LOG.map((row, i) => {
					const enter = span(elapsed, row.at, row.at + 340, easeOut)
					return (
						<li key={row.name} className='absolute inset-x-0 flex h-[22px] items-center gap-2 border-b border-gray-200 font-mono text-[11px]' style={{ transform: `translateY(${i * 22}px)` }}>
							<span className='w-5 shrink-0 tabular-nums text-gray-500' style={{ opacity: enter }}>{String(i + 1).padStart(2, '0')}</span>
							<span className='truncate text-blue-500' style={{ opacity: enter, transform: `translateX(${(1 - enter) * -10}px)` }}>{row.name}</span>
						</li>
					)
				})}
			</ol>
			<p className='truncate text-[11px] text-gray-500'>{note}</p>
		</div>
	)
}

export function MessageJourneyScene({ lang }: { lang: 'en' | 'es' }) {
	const t = COPY[lang]
	const tl = useSceneTimeline(DURATION)
	const f = journeyAt(tl.elapsed)
	const draft = f.bubbleOut > 0 ? '' : typed(t.message, f.typeP)
	const caret = f.typeP > 0 && f.typeP < 1 && f.bubbleOut === 0 && Math.sin(tl.elapsed / 160) > 0
	const labels = { sent: t.sent, delivered: t.delivered, read: t.read }
	const typing = f.typeP > 0 && f.bubbleOut < 0.2
	const windows = () => ({
		sender: (
			<Panel name={t.you} initial='F' mine status={t.online} draft={draft} caret={caret} placeholder={t.placeholder}>
				<Bubble mine show={f.bubbleOut} text={t.message} level={f.ticks} labels={labels} />
			</Panel>
		),
		peer: (
			<Panel name={t.peer} initial='L' mine={false} status={typing ? t.typing : t.online} draft='' caret={false} placeholder={t.placeholder}>
				<Bubble mine={false} show={f.bubbleIn} text={t.message} level={0} labels={labels} />
			</Panel>
		),
	})
	const mobile = windows()
	const desktop = windows()
	return (
		<SceneFrame timeline={tl} labels={SCENE_LABELS[lang]} kicker={t.kicker} title={t.title} caption={<span className='block h-[3.25rem] overflow-hidden'>{t.captions[f.cue]}</span>}>
			<div className='p-3 sm:p-4'>
				<div className='flex flex-col items-center gap-1 sm:hidden'>
					<div className='w-full'>{mobile.sender}</div>
					<Hub layout='stack' elapsed={tl.elapsed} f={f} server={t.server} db={t.db} />
					<div className='w-full'>{mobile.peer}</div>
				</div>
				<div className='hidden h-[220px] items-stretch gap-2 sm:grid sm:grid-cols-[minmax(0,1fr)_220px_minmax(0,1fr)]'>
					{desktop.sender}
					<Hub layout='row' elapsed={tl.elapsed} f={f} server={t.server} db={t.db} />
					{desktop.peer}
				</div>
				<Log elapsed={tl.elapsed} title={t.log} note={t.note} />
			</div>
		</SceneFrame>
	)
}
