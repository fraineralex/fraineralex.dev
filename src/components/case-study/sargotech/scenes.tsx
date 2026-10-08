'use client'

/*
 * Two autoplay scenes for the SargoTech case study. Everything is abstract
 * and illustrative: no data sources, thresholds, distances or numbers. Colors
 * follow the map traffic light (red, yellow, green).
 */
import { SCENE_LABELS, SceneFrame, easeInOut, easeOut, linear, phaseAt, pointOnPolyline, span, useSceneTimeline } from '../kit/scene'

type Lang = 'en' | 'es'
type Tone = 'red' | 'yellow' | 'green'
type Pt = [number, number]

const HEX: Record<Tone, string> = { red: '#ef4444', yellow: '#f59e0b', green: '#22c55e' }
const DOT: Record<Tone, string> = { red: 'bg-[#ef4444]', yellow: 'bg-[#f59e0b]', green: 'bg-[#22c55e]' }
const WEED = '#d6a84f'

// Fixed sunflower layout so the clump looks organic but never changes between renders.
const CLUMP: Pt[] = Array.from({ length: 26 }, (_, i) => {
	const r = Math.sqrt((i + 0.5) / 26)
	const a = i * 2.399963
	return [Math.cos(a) * r, Math.sin(a) * r * 0.62]
})

function Clump({ at, radius, opacity, scale = 1 }: { at: Pt; radius: number; opacity: number; scale?: number }) {
	if (opacity <= 0.01 || scale <= 0.02) return null
	return (
		<g transform={`translate(${at[0]} ${at[1]})`} opacity={opacity}>
			{CLUMP.map(([x, y], i) => (
				<circle key={i} cx={x * radius} cy={y * radius} r={(1.6 + (i % 3) * 0.7) * scale} fill={WEED} />
			))}
		</g>
	)
}

const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

/* ------------------------------------------------------------------ */
/* Scene B: how a beach turns red (aside of chapter 02)                */
/* ------------------------------------------------------------------ */

const SCAN_DURATION = 9600
const SCAN_STARTS = [0, 3200, 6400]

const SCAN_COPY = {
	en: {
		kicker: 'Traffic light',
		captions: [
			'Green: the beach scans the water around it and finds no sargassum close by.',
			'Yellow: a signal is approaching, still out at sea.',
			'Red: a strong signal right off the beach. Impact is likely.',
		],
		aria: 'A beach marker scans the sea around it while a sargassum patch drifts closer and grows stronger; the marker turns from green to yellow to red.',
	},
	es: {
		kicker: 'Semáforo',
		captions: [
			'Verde: la playa revisa el agua a su alrededor y no encuentra sargazo cerca.',
			'Amarillo: se acerca una señal, todavía mar adentro.',
			'Rojo: una señal fuerte justo frente a la playa. El impacto es probable.',
		],
		aria: 'Un marcador de playa revisa el mar a su alrededor mientras una mancha de sargazo se acerca y se hace más fuerte; el marcador pasa de verde a amarillo y a rojo.',
	},
} as const

export function BeachScanScene({
	lang,
	rules,
}: {
	lang: Lang
	rules: { title: string; items: readonly { tone: Tone; label: string; text: string }[] }
}) {
	const c = SCAN_COPY[lang]
	const tl = useSceneTimeline(SCAN_DURATION, { loop: true, hold: 2600 })
	const e = tl.elapsed
	const phase = phaseAt(e, SCAN_STARTS)
	const tone: Tone = (['green', 'yellow', 'red'] as const)[phase]
	const beach: Pt = [160, 150]
	const drift = span(e, 600, SCAN_DURATION - 800, easeInOut)
	const at = phase === 0 ? lerp([70, 26], [92, 40], span(e, 0, 3200, linear)) : lerp([92, 40], [150, 118], span(e, 3200, 8000, easeInOut))
	const strength = 0.25 + 0.75 * drift
	const ring = (offset: number) => ((e + offset) % 2400) / 2400
	const active = rules.items.findIndex((item) => item.tone === tone)

	return (
		<SceneFrame timeline={tl} labels={SCENE_LABELS[lang]} kicker={c.kicker} title={rules.title} caption={<span className='block min-h-[4.5rem] sm:min-h-[3rem]'>{c.captions[phase]}</span>}>
			<div className='p-3 sm:p-4'>
				<svg viewBox='0 0 320 190' className='block h-auto w-full rounded-lg border border-slate-700/60 bg-slate-950' role='img' aria-label={c.aria}>
					<defs>
						<radialGradient id='bs-sea' cx='50%' cy='0%' r='90%'>
							<stop offset='0%' stopColor='#0f2a3a' />
							<stop offset='100%' stopColor='#020617' />
						</radialGradient>
					</defs>
					<rect width='320' height='190' fill='url(#bs-sea)' />
					{[0, 800, 1600].map((o) => {
						const r = ring(o)
						return <circle key={o} cx={beach[0]} cy={beach[1]} r={10 + r * 90} fill='none' stroke='#5eead4' strokeWidth={1} opacity={tl.playing ? (1 - r) * 0.45 : o === 0 ? 0.25 : 0} />
					})}
					<Clump at={at} radius={16 + 10 * drift} opacity={strength} scale={0.8 + 0.5 * drift} />
					<path d='M0 162 C 60 150, 110 166, 160 158 S 260 148, 320 160 L320 190 L0 190 Z' fill='#1e293b' />
					<path d='M0 162 C 60 150, 110 166, 160 158 S 260 148, 320 160' fill='none' stroke='#475569' strokeWidth={1} />
					<circle cx={beach[0]} cy={beach[1]} r={13} fill={HEX[tone]} opacity={0.22} />
					<circle cx={beach[0]} cy={beach[1]} r={7} fill={HEX[tone]} stroke='#0f172a' strokeWidth={2} />
				</svg>
				<ul className='mt-3 space-y-2'>
					{rules.items.map((rule, i) => {
						const on = i === active
						return (
							<li key={rule.label} className={`flex gap-3 rounded-lg border p-3 transition-colors duration-300 motion-reduce:transition-none ${on ? 'border-slate-500 bg-slate-800/70' : 'border-slate-700/60 bg-slate-900/50'}`}>
								<span className={`mt-1 size-2.5 shrink-0 rounded-full ${DOT[rule.tone]} ${on ? '' : 'opacity-50'}`} aria-hidden />
								<span>
									<span className={`block text-sm font-medium ${on ? 'text-slate-50' : 'text-slate-300'}`}>{rule.label}</span>
									<span className='mt-0.5 block text-sm leading-relaxed text-slate-400'>{rule.text}</span>
								</span>
							</li>
						)
					})}
				</ul>
			</div>
		</SceneFrame>
	)
}

/* ------------------------------------------------------------------ */
/* Scene A: predict, contain, collect, manage disposal (chapter 03)    */
/* ------------------------------------------------------------------ */

const RESP_DURATION = 13200
const RESP_STARTS = [0, 3600, 6600, 10200]

const PATCH_START: Pt = [92, 96]
const PATCH_STOP: Pt = [196, 178]
const BEACH: Pt = [300, 206]
const TRAJECTORY = 'M92 96 Q 180 108 296 204'
const BARRIER = 'M228 146 Q 204 190 238 236'
const BOAT_PATH: Pt[] = [[262, 262], [226, 222], [208, 190]]
const ROAD: Pt[] = [[268, 258], [330, 232], [392, 196], [410, 140], [432, 92]]
const LAND = 'M300 0 L480 0 L480 300 L228 300 C 248 262, 290 244, 300 210 C 310 178, 288 150, 310 118 C 330 86, 300 40, 300 0 Z'

const RESP_COPY = {
	en: { kicker: 'Response', title: 'Four steps, one map', aria: 'Stylized coast: a satellite pass spots a sargassum patch offshore, a barrier is placed in front of the beach, a boat collects the patch at sea and a truck takes the load inland to a disposal site.' },
	es: { kicker: 'Respuesta', title: 'Cuatro pasos, un mapa', aria: 'Costa estilizada: una pasada satelital detecta una mancha de sargazo mar adentro, se coloca una barrera frente a la playa, un bote recoge la mancha en el mar y un camión lleva la carga tierra adentro a un sitio de disposición.' },
} as const

export function ResponseScene({ lang, steps }: { lang: Lang; steps: readonly { title: string; body: string }[] }) {
	const c = RESP_COPY[lang]
	const tl = useSceneTimeline(RESP_DURATION, { loop: true, hold: 3200 })
	const e = tl.elapsed
	const step = phaseAt(e, RESP_STARTS)

	const satX = 20 + 440 * span(e, 0, 2800, linear)
	const scanning = e < 2900
	const seen = span(e, 500, 1000, easeOut)
	const trajectory = span(e, 1100, 2600, easeInOut)
	const drift = span(e, 1400, 6200, easeInOut)
	const barrier = span(e, 3800, 5800, easeInOut)
	const boatOut = span(e, 6700, 8000, easeInOut)
	const collect = span(e, 8000, 9200, linear)
	const boatBack = span(e, 9200, 10200, easeInOut)
	const truck = span(e, 10400, 12800, easeInOut)
	const tone: Tone = e < 1800 ? 'green' : e < 3200 ? 'yellow' : e < 9300 ? 'red' : 'green'

	const patch = lerp(PATCH_START, PATCH_STOP, drift)
	const boat = boatBack > 0 ? pointOnPolyline([...BOAT_PATH].reverse() as Pt[], boatBack) : pointOnPolyline(BOAT_PATH, boatOut)
	const truckAt = pointOnPolyline(ROAD, truck)
	const loaded = collect > 0
	const progress = (i: number) => span(e, RESP_STARTS[i], RESP_STARTS[i + 1] ?? RESP_DURATION, linear)

	return (
		<SceneFrame timeline={tl} labels={SCENE_LABELS[lang]} kicker={c.kicker} title={c.title} caption={<span className='block min-h-[4.5rem] sm:min-h-[3rem]'>{steps[step]?.body}</span>}>
			<div className='p-3 sm:p-4'>
				<ol className='mx-auto grid max-w-[46rem] grid-cols-2 gap-2 pb-2 sm:grid-cols-4' aria-hidden>
					{steps.map((s, i) => {
						const on = i === step
						return (
							<li key={s.title} className={`flex h-11 min-w-0 flex-col justify-center rounded-lg border px-3 ${on ? 'border-teal-300/60 bg-teal-400/10' : 'border-slate-700/60 bg-slate-900/50'}`}>
								<span className={`flex items-center gap-2 text-xs font-medium ${on ? 'text-teal-100' : i < step ? 'text-slate-300' : 'text-slate-500'}`}>
									<span className='font-mono tabular-nums text-[11px]'>{String(i + 1).padStart(2, '0')}</span>
									<span className='truncate'>{s.title}</span>
								</span>
								<span className='mt-1.5 block h-0.5 overflow-hidden rounded-full bg-slate-800'>
									<span className='block h-full rounded-full bg-teal-300' style={{ width: `${progress(i) * 100}%` }} />
								</span>
							</li>
						)
					})}
				</ol>
				<svg viewBox='0 0 480 300' className='mx-auto mt-2 block h-auto w-full max-w-[46rem] rounded-lg border border-slate-700/60 bg-slate-950' role='img' aria-label={c.aria}>
					<defs>
						<linearGradient id='rs-sea' x1='0' y1='0' x2='1' y2='1'>
							<stop offset='0%' stopColor='#0b2233' />
							<stop offset='100%' stopColor='#04101c' />
						</linearGradient>
					</defs>
					<rect width='480' height='300' fill='url(#rs-sea)' />
					{/* scan band of the satellite pass */}
					{scanning && <rect x={satX - 28} y={34} width={56} height={266} fill='#5eead4' opacity={0.08} />}
					{scanning && <line x1={satX} y1={34} x2={satX} y2={300} stroke='#5eead4' strokeWidth={1} opacity={0.35} />}
					{/* trajectory */}
					<path d={TRAJECTORY} fill='none' stroke='#94a3b8' strokeWidth={1.4} strokeDasharray='4 6' opacity={0.75 * trajectory * (1 - collect)} />
					<Clump at={patch} radius={24} opacity={seen} scale={1 - collect} />
					{/* barrier */}
					<path d={BARRIER} fill='none' stroke='#fbbf24' strokeWidth={2.4} strokeLinecap='round' pathLength={1} strokeDasharray={`${barrier} 1`} />
					{barrier > 0.98 && [0.1, 0.3, 0.5, 0.7, 0.9].map((k) => {
						const p = pointOnPolyline([[228, 146], [214, 168], [212, 192], [222, 216], [238, 236]], k)
						return <circle key={k} cx={p[0]} cy={p[1]} r={2.6} fill='#fde68a' />
					})}
					{/* land */}
					<path d={LAND} fill='#1e293b' />
					<path d={LAND} fill='none' stroke='#475569' strokeWidth={1} />
					{/* road and disposal site */}
					<polyline points={ROAD.map((p) => p.join(',')).join(' ')} fill='none' stroke='#334155' strokeWidth={6} strokeLinecap='round' strokeLinejoin='round' />
					<polyline points={ROAD.map((p) => p.join(',')).join(' ')} fill='none' stroke='#64748b' strokeWidth={1} strokeDasharray='4 5' />
					<g transform='translate(432 76)'>
						<rect x={-16} y={-14} width={32} height={26} rx={4} fill='#0f172a' stroke={truck > 0.98 ? '#5eead4' : '#64748b'} strokeWidth={1.6} />
						<path d='M-8 -4 h16 M-6 -4 v10 h12 v-10' fill='none' stroke={truck > 0.98 ? '#5eead4' : '#94a3b8'} strokeWidth={1.4} />
					</g>
					{/* beach marker */}
					<circle cx={BEACH[0]} cy={BEACH[1]} r={14} fill={HEX[tone]} opacity={0.22} />
					<circle cx={BEACH[0]} cy={BEACH[1]} r={7} fill={HEX[tone]} stroke='#0f172a' strokeWidth={2} />
					{/* boat */}
					<g transform={`translate(${boat[0]} ${boat[1]})`} opacity={e >= 6500 ? 1 : 0.0}>
						<path d='M-11 0 L11 0 L7 6 L-7 6 Z' fill='#e2e8f0' />
						<rect x={-3} y={-7} width={7} height={7} rx={1} fill='#94a3b8' />
						{loaded && <circle cx={-6} cy={-2} r={2.6 * collect} fill={WEED} />}
					</g>
					{/* truck */}
					<g transform={`translate(${truckAt[0]} ${truckAt[1] - 6})`} opacity={e >= 10200 ? 1 : 0}>
						<rect x={-12} y={-7} width={16} height={11} rx={1.5} fill={WEED} />
						<rect x={4} y={-4} width={8} height={8} rx={1.5} fill='#e2e8f0' />
						<circle cx={-7} cy={5} r={2.4} fill='#0f172a' stroke='#94a3b8' />
						<circle cx={7} cy={5} r={2.4} fill='#0f172a' stroke='#94a3b8' />
					</g>
					{/* satellite */}
					<g transform={`translate(${satX} 20)`} opacity={scanning ? 1 : 0}>
						<rect x={-5} y={-5} width={10} height={10} rx={2} fill='#e2e8f0' />
						<rect x={-19} y={-3} width={12} height={6} fill='#5eead4' opacity={0.8} />
						<rect x={7} y={-3} width={12} height={6} fill='#5eead4' opacity={0.8} />
					</g>
				</svg>
			</div>
		</SceneFrame>
	)
}
