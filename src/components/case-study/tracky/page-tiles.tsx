import type { ReactNode } from 'react'
import Reveal from '../kit/reveal'
import type { Lang } from './copy'
import './scenes.css'

const COPY = {
	en: {
		days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
		stats: ['Goal', 'Meals', 'Move', 'Scale'],
		food: ['Calories', 'Protein', 'Carbs', 'Fat'],
		diary: [
			['Eggs and toast', 'Breakfast'],
			['Easy run', 'Exercise'],
			['Coffee', 'Breakfast']
		]
	},
	es: {
		days: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
		stats: ['Meta', 'Comida', 'Gasto', 'Peso'],
		food: ['Calorías', 'Proteína', 'Carbos', 'Grasa'],
		diary: [
			['Huevos y tostada', 'Desayuno'],
			['Carrera suave', 'Ejercicio'],
			['Café', 'Desayuno']
		]
	}
} as const

const LEVELS = [62, 84, 48, 73, 90, 36, 58]
const FOOD = [72, 64, 81, 45]

type PreviewCopy = (typeof COPY)[Lang]

function Frame ({ title, children }: { title: string, children: ReactNode }) {
	return (
		<div className='tracky-light flex h-40 flex-col overflow-hidden rounded-md border border-black/10 bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm' aria-hidden>
			<div className='flex h-7 shrink-0 items-center gap-2 border-b border-black/[0.08] bg-[#e8e8ed] px-2'>
				<span className='font-serif text-[11px] font-bold leading-none text-[#22c55e]' style={{ fontFamily: 'Georgia, "Iowan Old Style", Palatino, serif' }}>
					trac<span className='text-[hsl(var(--foreground))]'>ky</span>
				</span>
				<span className='ml-auto truncate text-[10px] text-zinc-500'>{title}</span>
			</div>
			<div className='min-h-0 flex-1 p-2'>{children}</div>
		</div>
	)
}

function Track ({ value }: { value: number }) {
	return (
		<span className='mt-1 block h-1.5 overflow-hidden rounded-full bg-[hsl(var(--foreground)/0.12)]'>
			<span className='block h-full rounded-full bg-[hsl(var(--chart-2))]' style={{ width: `${value}%` }} />
		</span>
	)
}

function Mini ({ kind, title, text }: { kind: number, title: string, text: PreviewCopy }) {
	if (kind === 1) {
		return (
			<Frame title={title}>
				<div className='grid h-full grid-cols-2 grid-rows-2 gap-1'>
					{text.food.map((name, index) => (
						<div key={name} className='flex min-w-0 flex-col justify-center rounded bg-[hsl(var(--card))] px-1.5 ring-1 ring-[hsl(var(--border))]'>
							<p className='truncate text-[10px] leading-none text-[hsl(var(--muted-foreground))]'>{name}</p>
							<Track value={FOOD[index] ?? 50} />
						</div>
					))}
				</div>
			</Frame>
		)
	}
	if (kind === 2) {
		return (
			<Frame title={title}>
				<div className='flex h-full flex-col justify-end'>
					<div className='flex h-16 items-end gap-1'>
						{LEVELS.map((value, index) => (
							<span key={index} className='flex h-full min-w-0 flex-1 items-end'>
								<span className='block w-full rounded-sm bg-[hsl(var(--chart-2))]' style={{ height: `${value}%` }} />
							</span>
						))}
					</div>
					<div className='mt-1.5 grid grid-cols-7 gap-1'>
						{text.days.map((day, index) => (
							<span key={`${day}-${index}`} className='text-center text-[10px] leading-none text-[hsl(var(--muted-foreground))]'>{day}</span>
						))}
					</div>
				</div>
			</Frame>
		)
	}
	if (kind === 3) {
		return (
			<Frame title={title}>
				<div className='flex h-full flex-col justify-center gap-1.5'>
					{text.diary.map(([row, meta]) => (
						<div key={row} className='flex min-w-0 items-center gap-1.5 rounded bg-[hsl(var(--card))] px-1.5 py-1 ring-1 ring-[hsl(var(--border))]'>
							<span className='size-2 shrink-0 rounded-full bg-[hsl(var(--chart-2))]' />
							<span className='min-w-0'>
								<span className='block truncate text-[11px] font-medium leading-tight'>{row}</span>
								<span className='block truncate text-[10px] leading-tight text-[hsl(var(--muted-foreground))]'>{meta}</span>
							</span>
						</div>
					))}
				</div>
			</Frame>
		)
	}
	return (
		<Frame title={title}>
			<div className='flex h-full flex-col justify-between'>
				<div className='grid grid-cols-4 gap-1'>
					{text.stats.map((name, index) => (
						<div key={name} className='min-w-0 rounded bg-[hsl(var(--card))] px-1 py-1 ring-1 ring-[hsl(var(--border))]'>
							<p className='truncate text-[10px] leading-none text-[hsl(var(--muted-foreground))]'>{name}</p>
							<Track value={FOOD[index] ?? 50} />
						</div>
					))}
				</div>
				<div className='grid grid-cols-7 gap-1'>
					{text.days.map((day, index) => (
						<span key={`${day}-${index}`} className='flex min-w-0 flex-col items-center gap-0.5'>
							<span
								className='h-5 w-full rounded-sm'
								style={{ background: `linear-gradient(to top, hsl(var(--foreground) / 0.72) ${LEVELS[index]}%, hsl(var(--foreground) / 0.16) ${LEVELS[index]}%)` }}
							/>
							<span className='text-[10px] leading-none text-[hsl(var(--muted-foreground))]'>{day}</span>
						</span>
					))}
				</div>
			</div>
		</Frame>
	)
}

/** Four app pages. Each tile fades up on scroll, staggered. Reduced motion stays on the finished frame. */
export function PageTiles ({ lang, items }: { lang: Lang, items: readonly { title: string, body: string }[] }) {
	const text = COPY[lang]
	return (
		<ul className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
			{items.map((item, index) => (
				<Reveal key={item.title} as='li' delay={index * 90} className='min-w-0 rounded-lg border border-slate-700/50 bg-slate-800/30 p-4 sm:p-5'>
					<Mini kind={index} title={item.title} text={text} />
					<h3 className='mt-4 font-medium text-slate-100'>{item.title}</h3>
					<p className='mt-1.5 text-sm leading-relaxed text-slate-400' style={{ textWrap: 'pretty' }}>{item.body}</p>
				</Reveal>
			))}
		</ul>
	)
}
