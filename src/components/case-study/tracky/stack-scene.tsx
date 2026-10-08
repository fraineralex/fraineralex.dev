'use client'

import { Fragment } from 'react'
import {
	SCENE_LABELS,
	SceneFrame,
	easeInOut,
	linear,
	pointOnPolyline,
	span,
	typed,
	useSceneTimeline,
} from '../kit/scene'
import './scenes.css'

const DURATION = 12000
const HOLD = 3200

const XS = [37.5, 62.5, 87.5]
const YS = [2.5, 35.83, 69.17]
const BUS = 24
const MOBILE_Y = [16.67, 50, 83.33]

const SEGS = [
	{ a: 0, b: 1100, from: 0, to: 0, hop: 0 },
	{ a: 1100, b: 2600, from: 0, to: 1, hop: 1 },
	{ a: 2600, b: 3400, from: 1, to: 1, hop: 1 },
	{ a: 3400, b: 4900, from: 1, to: 2, hop: 2 },
	{ a: 4900, b: 5700, from: 2, to: 2, hop: 2 },
	{ a: 5700, b: 7400, from: 2, to: 3, hop: 3 },
	{ a: 7400, b: 8200, from: 3, to: 3, hop: 3 },
	{ a: 8200, b: 9700, from: 3, to: 4, hop: 4 },
	{ a: 9700, b: 11200, from: 4, to: 5, hop: 5 },
	{ a: 11200, b: 12000, from: 5, to: 5, hop: 5 },
] as const

const COPY = {
	en: {
		kicker: 'App Router',
		title: 'Down the stack and back',
		hops: [
			'You log the meal in the UI.',
			'A Server Action receives it.',
			'The AI SDK calls the model.',
			'Drizzle writes it to Postgres.',
			'The response climbs back up.',
			'The diary refreshes on screen.',
		],
	},
	es: {
		kicker: 'App Router',
		title: 'Baja por el stack y vuelve',
		hops: [
			'Registras la comida en la UI.',
			'La Server Action la recibe.',
			'El AI SDK llama al modelo.',
			'Drizzle escribe en Postgres.',
			'La respuesta sube de vuelta.',
			'El diario se actualiza.',
		],
	},
} as const

interface StackItem {
	name: string
	detail: string
}

interface StackLayer {
	title: string
	items: readonly StackItem[]
}

interface NodeRef {
	lane: number
	item: number
}

function findNode(layers: readonly StackLayer[], needle: string): NodeRef {
	for (let lane = 0; lane < layers.length; lane++) {
		const item = layers[lane]?.items.findIndex((entry) => entry.name.includes(needle)) ?? -1
		if (item >= 0) return { lane, item }
	}
	return { lane: 0, item: 0 }
}

function buildRoute(layers: readonly StackLayer[]): NodeRef[] {
	return [
		findNode(layers, 'React 19'),
		findNode(layers, 'Next.js'),
		findNode(layers, 'Vercel'),
		findNode(layers, 'Drizzle'),
		findNode(layers, 'Next.js'),
		findNode(layers, 'React 19'),
	]
}

function anchor(node: NodeRef): [number, number] {
	return [XS[node.item] ?? XS[0], YS[node.lane] ?? YS[0]]
}

function hopPoints(from: NodeRef, to: NodeRef): [number, number][] {
	const start = anchor(from)
	const end = anchor(to)
	if (from.lane === to.lane) return [start, end]
	return [start, [BUS, YS[from.lane] ?? start[1]], [BUS, YS[to.lane] ?? end[1]], end]
}

function segAt(elapsed: number) {
	let index = 0
	for (let i = 0; i < SEGS.length; i++) if (elapsed >= SEGS[i].a) index = i
	return { index, seg: SEGS[index] ?? SEGS[0] }
}

function brightness(lane: number, item: number, route: NodeRef[], segIndex: number, travel: number) {
	const seg = SEGS[segIndex] ?? SEGS[0]
	const reached = travel > 0.62 ? seg.to : seg.from
	let value = 0
	for (let i = 0; i <= reached; i++) {
		const node = route[i]
		if (node && node.lane === lane && node.item === item) value = 0.62
	}
	const current = route[reached]
	if (current && current.lane === lane && current.item === item) value = 1
	return value
}

function NodeCard({ item, light }: { item: StackItem; light: number }) {
	const on = light > 0.4
	return (
		<div
			className={`flex h-full min-w-0 flex-col justify-start overflow-hidden rounded-md border px-2 py-1.5 sm:px-2.5 sm:py-2 ${on ? 'bg-slate-800/80' : 'bg-slate-900/50'}`}
			style={{
				borderColor: on ? `rgb(94 234 212 / ${0.35 + light * 0.6})` : 'rgb(51 65 85 / 0.7)',
				boxShadow: on ? `0 0 16px rgb(45 212 191 / ${light * 0.35})` : undefined,
			}}
		>
			<p className={`break-words text-xs font-medium leading-snug sm:text-[13px] ${on ? 'text-teal-100' : 'text-slate-100'}`}>{item.name}</p>
			<p className='mt-1 break-words text-[11px] leading-snug text-slate-400'>{item.detail}</p>
		</div>
	)
}

export function StackScene({ lang, layers, caption }: { lang: 'en' | 'es'; layers: readonly StackLayer[]; caption: string }) {
	const copy = COPY[lang]
	const tl = useSceneTimeline(DURATION, { loop: true, hold: HOLD })
	const route = buildRoute(layers)
	const { index, seg } = segAt(tl.elapsed)
	const travel = span(tl.elapsed, seg.a, seg.b, easeInOut)
	const from = route[seg.from] ?? route[0]
	const to = route[seg.to] ?? from
	const points = from && to ? hopPoints(from, to) : [[BUS, YS[0]], [BUS, YS[0]]] as [number, number][]
	const [x, y] = pointOnPolyline(points, travel)
	const hopStart = SEGS.find((item) => item.hop === seg.hop)?.a ?? 0
	const label = typed(copy.hops[seg.hop], span(tl.elapsed, hopStart, hopStart + 680, linear))
	const focus = (travel > 0.55 ? to : from) ?? route[0]
	const focused = focus ? layers[focus.lane]?.items[focus.item] : undefined
	const mobileY = from && to ? (MOBILE_Y[from.lane] ?? 50) + ((MOBILE_Y[to.lane] ?? 50) - (MOBILE_Y[from.lane] ?? 50)) * travel : 50
	const trailY = from && to ? (MOBILE_Y[from.lane] ?? 50) + ((MOBILE_Y[to.lane] ?? 50) - (MOBILE_Y[from.lane] ?? 50)) * Math.max(0, travel - 0.18) : mobileY
	const live = tl.playing && !tl.reduced
	const poly = routePoints(route)

	return (
		<SceneFrame timeline={tl} labels={SCENE_LABELS[lang]} kicker={copy.kicker} title={copy.title} caption={copy.hops[seg.hop]}>
			<div className='p-3 sm:p-4'>
				<p className='mb-3 flex h-6 items-center gap-2 font-mono text-[13px] text-teal-200 sm:text-sm' aria-hidden>
					<span className='inline-block w-[2ch] text-right tabular-nums text-slate-500'>{String(seg.hop + 1).padStart(2, '0')}</span>
					<span className='truncate'>{label}</span>
				</p>

				<div className='relative sm:hidden'>
					<svg className={`pointer-events-none absolute bottom-0 left-0 top-0 h-full w-7 ${live ? 'tracky-live' : ''}`} viewBox='0 0 28 100' preserveAspectRatio='none' aria-hidden>
						<line x1='14' y1='6' x2='14' y2='94' stroke='rgb(71 85 105)' strokeWidth='2' vectorEffect='non-scaling-stroke' strokeDasharray='4 6' className='tracky-dash' />
					</svg>
					<span className='absolute left-[14px] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300/50' style={{ top: `${trailY}%` }} aria-hidden />
					<span className='absolute left-[14px] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300 shadow-[0_0_12px_rgb(45_212_191/0.9)]' style={{ top: `${mobileY}%` }} aria-hidden />
					<div className='ml-7 min-w-0 divide-y divide-slate-700/50 border-y border-slate-700/50'>
						{layers.map((layer, lane) => (
							<div key={layer.title} className='flex h-[10.25rem] min-w-0 flex-col py-2'>
								<LaneTitle index={lane} title={layer.title} on={laneOn(route, lane, seg, travel)} />
								<div className='mt-1.5 flex min-h-0 flex-1 gap-2 overflow-x-auto overscroll-x-contain pb-1'>
									{layer.items.map((item, itemIndex) => (
										<div key={item.name} className='h-full w-[7.75rem] shrink-0'>
											<NodeCard item={item} light={brightness(lane, itemIndex, route, index, travel)} />
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>

				<div className='relative hidden h-[22rem] sm:block'>
					<svg className={`pointer-events-none absolute inset-0 h-full w-full ${live ? 'tracky-live' : ''}`} viewBox='0 0 100 100' preserveAspectRatio='none' aria-hidden>
						<polyline points={poly.map((point) => point.join(',')).join(' ')} fill='none' stroke='rgb(71 85 105)' strokeWidth='1.5' vectorEffect='non-scaling-stroke' strokeDasharray='4 6' className='tracky-dash' />
					</svg>
					<div className='grid h-full grid-cols-4 grid-rows-3'>
						{layers.map((layer, lane) => (
							<Fragment key={layer.title}>
								<div className='flex min-w-0 items-center pl-3 pr-6'>
									<LaneTitle index={lane} title={layer.title} on={laneOn(route, lane, seg, travel)} />
								</div>
								{[0, 1, 2].map((column) => {
									const item = layer.items[column]
									return (
										<div key={column} className='min-w-0 px-1.5 pb-1.5 pt-6'>
											{item ? <NodeCard item={item} light={brightness(lane, column, route, index, travel)} /> : null}
										</div>
									)
								})}
							</Fragment>
						))}
					</div>
					<span className='absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300/45' style={trailStyle(points, travel)} aria-hidden />
					<span className='absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300 shadow-[0_0_12px_rgb(45_212_191/0.9)]' style={{ left: `${x}%`, top: `${y}%` }} aria-hidden />
				</div>

				<p className='mt-3 h-16 overflow-hidden text-xs leading-5 text-slate-400' aria-hidden>
					{focused ? (
						<>
							<span className='font-medium text-slate-200'>{focused.name}. </span>
							{focused.detail}
						</>
					) : null}
				</p>
				<p className='mt-2 text-xs text-slate-500'>{caption}</p>
			</div>
		</SceneFrame>
	)
}

function routePoints(route: NodeRef[]) {
	const points: [number, number][] = []
	for (let i = 0; i < route.length - 1; i++) {
		const from = route[i]
		const to = route[i + 1]
		if (!from || !to) continue
		const hop = hopPoints(from, to)
		if (points.length === 0) points.push(...hop)
		else points.push(...hop.slice(1))
	}
	return points
}

function trailStyle(points: [number, number][], travel: number) {
	const [left, top] = pointOnPolyline(points, Math.max(0, travel - 0.16))
	return { left: `${left}%`, top: `${top}%` }
}

function laneOn(route: NodeRef[], lane: number, seg: (typeof SEGS)[number], travel: number) {
	const reached = travel > 0.62 ? seg.to : seg.from
	return route.some((node, nodeIndex) => node.lane === lane && nodeIndex <= reached)
}

function LaneTitle({ index, title, on }: { index: number; title: string; on: boolean }) {
	const pad = String(index + 1).padStart(2, '0')
	return (
		<div className='min-w-0'>
			<p className={`truncate font-mono text-[11px] uppercase tracking-wider ${on ? 'text-teal-100' : 'text-teal-300'}`}>
				{pad}
				<span className='sm:hidden'> · {title}</span>
			</p>
			<p className={`hidden truncate text-sm font-medium sm:block ${on ? 'text-teal-100' : 'text-slate-200'}`}>{title}</p>
		</div>
	)
}
