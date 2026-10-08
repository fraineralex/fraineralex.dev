'use client'

import { Camera, EggFried, Flame, Image as ImageIcon, Send, Wheat, Drumstick } from 'lucide-react'
import {
	SCENE_LABELS,
	SceneFrame,
	easeInOut,
	easeOut,
	linear,
	phaseAt,
	pointOnPolyline,
	span,
	typed,
	useSceneTimeline,
} from '../kit/scene'
import './scenes.css'

const DURATION = 12000
const HOLD = 3000

const FOODS = [
	{ en: 'Eggs', es: 'Huevos', amount: '100 g', kcal: 155, protein: 13, carbs: 1, fat: 11 },
	{ en: 'Toast', es: 'Tostada', amount: '40 g', kcal: 106, protein: 4, carbs: 18, fat: 1 },
	{ en: 'Coffee', es: 'Café', amount: '180 ml', kcal: 16, protein: 1, carbs: 2, fat: 0 },
] as const

const TOTAL = FOODS.reduce(
	(sum, food) => ({
		kcal: sum.kcal + food.kcal,
		protein: sum.protein + food.protein,
		carbs: sum.carbs + food.carbs,
		fat: sum.fat + food.fat,
	}),
	{ kcal: 0, protein: 0, carbs: 0, fat: 0 },
)

const GOALS = { kcal: 2200, protein: 165, carbs: 220, fat: 73 } as const

const TOKENS = ['logHealthAI', 'generateObject', 'MultiIntentSchema', 'intent: consumption'] as const

const COPY = {
	en: {
		kicker: 'Food chat',
		title: 'A sentence becomes diary entries',
		chatTitle: 'Chat with AI',
		placeholder: 'Log 100 g of chicken breast for lunch',
		instruction: 'Name the food, the portion and the meal.',
		sentence: 'Two eggs, toast and a coffee for breakfast',
		diary: 'Diary',
		meal: 'Breakfast',
		today: 'Today',
		ofGoal: 'of daily goal',
		units: { kcal: 'kcal', g: 'g' },
		macros: [
			{ key: 'kcal', label: 'Calories', goal: GOALS.kcal },
			{ key: 'protein', label: 'Protein', goal: GOALS.protein },
			{ key: 'carbs', label: 'Carbs', goal: GOALS.carbs },
			{ key: 'fat', label: 'Fat', goal: GOALS.fat },
		],
		macroShort: { protein: 'Protein', carbs: 'Carbs', fat: 'Fat' },
		note: 'Sample portions, not a measurement.',
		captions: [
			'You type the meal in the chat.',
			'logHealthAI structures the meal.',
			'The foods slide into the diary.',
			"Today's totals fill in.",
		],
	},
	es: {
		kicker: 'Chat de comida',
		title: 'Una frase se vuelve entradas del diario',
		chatTitle: 'Chat con IA',
		placeholder: 'Registra 100 g de pechuga para el almuerzo',
		instruction: 'Indica el alimento, la porción y la comida.',
		sentence: 'Dos huevos, una tostada y un café de desayuno',
		diary: 'Diario',
		meal: 'Desayuno',
		today: 'Hoy',
		ofGoal: 'del objetivo diario',
		units: { kcal: 'kcal', g: 'g' },
		macros: [
			{ key: 'kcal', label: 'Calorías', goal: GOALS.kcal },
			{ key: 'protein', label: 'Proteína', goal: GOALS.protein },
			{ key: 'carbs', label: 'Carbos', goal: GOALS.carbs },
			{ key: 'fat', label: 'Grasa', goal: GOALS.fat },
		],
		macroShort: { protein: 'Proteína', carbs: 'Carbos', fat: 'Grasa' },
		note: 'Porciones de ejemplo, no una medición.',
		captions: [
			'Escribes la comida en el chat.',
			'logHealthAI estructura la comida.',
			'Las comidas entran al diario.',
			'Los totales del día suben.',
		],
	},
} as const

type Copy = (typeof COPY)[keyof typeof COPY]

const DESK = {
	model: [50, 50] as [number, number],
	inbound: [[2, 26], [50, 50]] as [number, number][],
	outbound: [
		[[50, 50], [98, 23.6]],
		[[50, 50], [98, 54.7]],
		[[50, 50], [98, 85.8]],
	] as [number, number][][],
}

const PHONE = {
	model: [54, 38] as [number, number],
	inbound: [[4, 38], [54, 38]] as [number, number][],
	outbound: [
		[[54, 38], [22, 94]],
		[[54, 38], [54, 94]],
		[[54, 38], [86, 94]],
	] as [number, number][][],
}

function frameAt(elapsed: number) {
	const items = [0, 1, 2].map((index) => {
		const start = 5200 + index * 1150
		return {
			fly: span(elapsed, start, start + 820, easeInOut),
			row: span(elapsed, start + 500, start + 1040, easeOut),
		}
	})
	const glowIn = span(elapsed, 3400, 4500, easeOut)
	const pulse = elapsed >= 8600 ? 1 : 0.55 + 0.45 * Math.sin(elapsed / 170)
	return {
		phase: phaseAt(elapsed, [0, 2600, 5200, 8900]),
		typed: span(elapsed, 180, 2400, linear),
		caret: elapsed > 180 && elapsed < 2400 && Math.sin(elapsed / 80) > 0,
		send: span(elapsed, 2460, 2620, easeOut) * (1 - span(elapsed, 2620, 3000, easeOut)),
		packet: span(elapsed, 2680, 4300, easeInOut),
		tokens: [0, 1, 2, 3].map((index) => span(elapsed, 3880 + index * 300, 4320 + index * 300, easeOut)),
		items,
		macros: span(elapsed, 8900, 11600, easeOut),
		glow: glowIn * pulse,
	}
}

function Dots({ points, t }: { points: readonly (readonly [number, number])[]; t: number }) {
	if (t <= 0) return null
	return (
		<>
			{[0, 0.16].map((back, index) => {
				const [x, y] = pointOnPolyline(points as [number, number][], Math.max(0, t - back))
				const size = index === 0 ? 11 : 6
				return (
					<span key={back} className='pointer-events-none absolute inset-0' style={{ transform: `translate(${x}%, ${y}%)` }}>
					<span
						className='absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300'
						style={{
							width: size,
							height: size,
							opacity: index === 0 ? 1 : 0.45,
							boxShadow: index === 0 ? '0 0 12px rgb(45 212 191 / 0.9)' : undefined,
						}}
					/>
					</span>
				)
			})}
		</>
	)
}

function Lines({ spec, packet, items, live }: { spec: typeof DESK; packet: number; items: { fly: number }[]; live: boolean }) {
	const [inA, inB] = spec.inbound
	return (
		<svg className={`absolute inset-0 h-full w-full ${live ? 'tracky-live' : ''}`} viewBox='0 0 100 100' preserveAspectRatio='none' aria-hidden>
			<line x1={inA[0]} y1={inA[1]} x2={inB[0]} y2={inB[1]} stroke='rgb(71 85 105)' strokeWidth='1.5' vectorEffect='non-scaling-stroke' strokeDasharray='4 6' className='tracky-dash' />
			{packet > 0 && <line x1={inA[0]} y1={inA[1]} x2={inA[0] + (inB[0] - inA[0]) * packet} y2={inA[1] + (inB[1] - inA[1]) * packet} stroke='#5eead4' strokeWidth='2' vectorEffect='non-scaling-stroke' strokeLinecap='round' />}
			{spec.outbound.map((path, index) => {
				const [a, b] = path
				const fly = items[index]?.fly ?? 0
				return (
					<g key={index}>
						<line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke='rgb(71 85 105)' strokeWidth='1.5' vectorEffect='non-scaling-stroke' strokeDasharray='4 6' className='tracky-dash' />
						{fly > 0 && <line x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * fly} y2={a[1] + (b[1] - a[1]) * fly} stroke='#5eead4' strokeWidth='2' vectorEffect='non-scaling-stroke' strokeLinecap='round' />}
					</g>
				)
			})}
		</svg>
	)
}

function Bridge({ spec, packet, items, glow, live }: { spec: typeof DESK; packet: number; items: { fly: number }[]; glow: number; live: boolean }) {
	const [mx, my] = spec.model
	return (
		<div className='relative h-[5.75rem] sm:h-[18.5rem]' aria-hidden>
			<Lines spec={spec} packet={packet} items={items} live={live} />
			<span
				className='absolute size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-300/50'
				style={{ left: `${mx}%`, top: `${my}%`, opacity: glow, transform: `translate(-50%, -50%) scale(${1 + glow * 0.08})` }}
			/>
			<div
				className='absolute flex h-10 w-[6.6rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border bg-slate-950'
				style={{
					left: `${mx}%`,
					top: `${my}%`,
					borderColor: glow > 0.15 ? 'rgb(94 234 212 / 0.95)' : 'rgb(51 65 85)',
					boxShadow: glow > 0.15 ? `0 0 18px rgb(45 212 191 / ${0.2 + glow * 0.55})` : undefined,
				}}
			>
				<span className='font-mono text-[11px] font-medium text-teal-100'>logHealthAI</span>
			</div>
			{packet > 0.04 && packet < 0.94 && <Dots points={spec.inbound} t={packet} />}
			{spec.outbound.map((path, index) => {
				const fly = items[index]?.fly ?? 0
				if (fly <= 0.06 || fly >= 0.98) return null
				return <Dots key={index} points={path} t={fly} />
			})}
		</div>
	)
}

const ICONS = { kcal: Flame, protein: Drumstick, carbs: Wheat, fat: EggFried } as const

export function SentenceScene({ lang }: { lang: 'en' | 'es' }) {
	const copy = COPY[lang]
	const tl = useSceneTimeline(DURATION, { loop: true, hold: HOLD })
	const frame = frameAt(tl.elapsed)
	const message = typed(copy.sentence, frame.typed)
	const live = tl.playing && !tl.reduced

	return (
		<SceneFrame timeline={tl} labels={SCENE_LABELS[lang]} kicker={copy.kicker} title={copy.title} caption={copy.captions[frame.phase]}>
			<div className='p-3 sm:p-4'>
				<div className='flex min-w-0 flex-col gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_9.25rem_minmax(0,1.05fr)] sm:items-stretch sm:gap-2'>
					<Chat copy={copy} message={message} caret={frame.caret} send={frame.send} tokens={frame.tokens} />
					<div className='sm:hidden'>
						<Bridge spec={PHONE} packet={frame.packet} items={frame.items} glow={frame.glow} live={live} />
					</div>
					<div className='hidden sm:block'>
						<Bridge spec={DESK} packet={frame.packet} items={frame.items} glow={frame.glow} live={live} />
					</div>
					<Diary copy={copy} lang={lang} rows={frame.items.map((item) => item.row)} />
				</div>
				<Macros copy={copy} progress={frame.macros} />
			</div>
		</SceneFrame>
	)
}

function Chat({ copy, message, caret, send, tokens }: { copy: Copy; message: string; caret: boolean; send: number; tokens: number[] }) {
	return (
		<div className='flex h-[18.5rem] min-w-0 flex-col overflow-hidden rounded-lg border border-slate-700/60 bg-slate-900/50 p-3'>
			<p className='text-sm font-semibold leading-none text-slate-100'>{copy.chatTitle}</p>
			<div className='mt-3 flex min-h-0 flex-1 items-start justify-end gap-2'>
				<div className='max-w-[85%] rounded-2xl border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 shadow-sm'>
					<p className='relative leading-5'>
						<span className='invisible'>{copy.sentence}</span>
						<span className='absolute inset-0 whitespace-pre-wrap break-words'>
							{message}
							{caret && <span className='text-teal-300'>▍</span>}
						</span>
					</p>
					<span className='mt-1 block text-right text-[10px] uppercase tracking-wide text-slate-500'>08:12</span>
				</div>
				<img src='/images/projects/viollet-user.webp' alt='' className='h-7 w-7 shrink-0 rounded-full object-cover' />
			</div>
			<div className='mt-2 h-16 shrink-0 font-mono text-[11px] leading-4 text-teal-200'>
				{TOKENS.map((token, index) => {
					const progress = tokens[index] ?? 0
					return (
						<p key={token} className='h-4 truncate' style={{ opacity: progress }}>
							{typed(token, progress)}
						</p>
					)
				})}
			</div>
			<div className='mt-2 shrink-0' aria-hidden>
				<div className='flex items-center gap-2'>
					<span className='inline-flex size-9 items-center justify-center rounded-md border border-slate-700/60 text-slate-400'>
						<Camera className='size-4' />
					</span>
					<span className='inline-flex size-9 items-center justify-center rounded-md border border-slate-700/60 text-slate-400'>
						<ImageIcon className='size-4' />
					</span>
					<span className='h-9 min-w-0 flex-1 truncate rounded-md border border-slate-700/60 px-3 text-sm leading-9 text-slate-500'>{copy.placeholder}</span>
					<span
						className='inline-flex size-9 items-center justify-center rounded-md bg-teal-400/15 text-teal-200'
						style={{ boxShadow: send > 0 ? `0 0 12px rgb(45 212 191 / ${send})` : undefined }}
					>
						<Send className='size-4' />
					</span>
				</div>
				<p className='mt-1 h-4 truncate text-xs leading-4 text-slate-500'>{copy.instruction}</p>
			</div>
		</div>
	)
}

function Diary({ copy, lang, rows }: { copy: Copy; lang: 'en' | 'es'; rows: number[] }) {
	return (
		<div className='flex h-[16.5rem] min-w-0 flex-col sm:h-[18.5rem]'>
			<p className='mb-2 h-5 text-xs font-medium uppercase tracking-wide text-slate-500'>{copy.diary}</p>
			<div className='flex min-h-0 flex-1 flex-col gap-2'>
				{FOODS.map((food, index) => {
					const row = rows[index] ?? 0
					const name = food[lang]
					return (
						<div key={name} className='relative min-h-0 flex-1 overflow-hidden'>
							<div className='absolute inset-0 rounded-lg border border-dashed border-slate-700/50' style={{ opacity: 1 - row }} />
							<article
								aria-hidden={row < 0.85}
								className='absolute inset-0 rounded-lg border border-slate-700/60 bg-slate-900/50 px-3 py-2'
								style={{ opacity: row, transform: `translateY(${(1 - row) * 100}%)` }}
							>
								<div className='flex items-start justify-between gap-3'>
									<div className='min-w-0'>
										<h3 className='truncate text-sm font-medium capitalize text-slate-100'>{name}</h3>
										<p className='text-xs text-slate-400'>
											{copy.meal} · {food.amount}
										</p>
									</div>
									<p className='shrink-0 text-sm font-semibold tabular-nums text-slate-100'>
										<span className='inline-block w-[3ch] text-right'>{food.kcal}</span>
										<span className='text-slate-400'> {copy.units.kcal}</span>
									</p>
								</div>
								<p className='mt-1 truncate text-xs text-slate-400'>
									{copy.macroShort.protein} {food.protein}
									{copy.units.g} · {copy.macroShort.carbs} {food.carbs}
									{copy.units.g} · {copy.macroShort.fat} {food.fat}
									{copy.units.g}
								</p>
							</article>
						</div>
					)
				})}
			</div>
		</div>
	)
}

function Macros({ copy, progress }: { copy: Copy; progress: number }) {
	return (
		<div className='mt-3'>
			<p className='mb-2 h-5 text-xs font-medium uppercase tracking-wide text-slate-500'>{copy.today}</p>
			<div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
				{copy.macros.map((macro) => {
					const key = macro.key
					const goal = macro.goal
					const value = TOTAL[key] * progress
					const width = Math.min(100, (value / goal) * 100)
					const percent = Math.round(width)
					const Icon = ICONS[key]
					return (
						<div key={key} className='rounded-lg border border-slate-700/60 bg-slate-900/50 px-3 py-2.5'>
							<div className='flex items-center justify-between gap-2'>
								<h3 className='text-xs font-medium text-slate-300'>{macro.label}</h3>
								<Icon className='size-3.5 text-slate-500' aria-hidden />
							</div>
							<p className='mt-1 text-sm font-semibold text-slate-100'>
								<span className='inline-block w-[3ch] text-right tabular-nums'>{Math.round(value)}</span>
								<span className='font-medium text-slate-500'> / {goal}</span>
							</p>
							<p className='mt-0.5 text-[11px] text-slate-500'>
								<span className='inline-block w-[2ch] text-right tabular-nums'>{percent}</span>% {copy.ofGoal}
							</p>
							<div className='mt-2 h-2 overflow-hidden rounded-full bg-slate-800' aria-hidden>
								<div className='h-full rounded-full bg-teal-400' style={{ width: `${width}%`, boxShadow: width > 0 ? '0 0 8px rgb(45 212 191 / 0.45)' : undefined }} />
							</div>
						</div>
					)
				})}
			</div>
			<p className='mt-2 h-4 truncate text-[11px] text-slate-500'>{copy.note}</p>
		</div>
	)
}
