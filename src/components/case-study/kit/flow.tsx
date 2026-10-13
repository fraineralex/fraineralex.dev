'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

const focusRing =
	'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300'

export interface FlowStep {
	title: string
	body: string
	tag?: string
}

/**
 * Stepper in the spirit of the Viollet blog EssayStepper: one active step, a
 * dashed animated rail, autoplay that respects reduced motion and pauses on
 * interaction.
 */
export default function Flow({
	steps,
	labels,
	note,
	interval = 3200,
}: {
	steps: FlowStep[]
	labels: { play: string; pause: string; prev: string; next: string; step: string }
	note?: string
	interval?: number
}) {
	const [active, setActive] = useState(0)
	const [playing, setPlaying] = useState(false)

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
		setPlaying(true)
	}, [])

	useEffect(() => {
		if (!playing) return
		const id = window.setInterval(() => setActive((i) => (i + 1) % steps.length), interval)
		return () => window.clearInterval(id)
	}, [playing, interval, steps.length])

	const go = (i: number) => {
		setPlaying(false)
		setActive((i + steps.length) % steps.length)
	}

	const btn =
		`inline-flex size-8 items-center justify-center rounded-md border border-slate-700/60 bg-slate-800/40 text-slate-200 leading-none transition-colors hover:bg-slate-800/80 motion-reduce:transition-none ${focusRing}`

	return (
		<div className='min-w-0 rounded-lg border border-slate-700/50 bg-slate-800/30 p-4 sm:p-5'>
			<ol className='relative space-y-1'>
				<svg aria-hidden className='pointer-events-none absolute left-[15px] top-4 h-[calc(100%-2rem)] w-px overflow-visible text-teal-300/40' preserveAspectRatio='none'>
					<line x1='0' y1='0' x2='0' y2='100%' stroke='currentColor' strokeWidth='1.5' strokeDasharray='4 5' className='vk-flow-dash' />
				</svg>
				{steps.map((step, i) => {
					const on = i === active
					return (
						<li key={step.title}>
							<button
								type='button'
								onClick={() => go(i)}
								aria-current={on ? 'step' : undefined}
								className={`relative flex w-full items-start gap-3 rounded-lg px-1.5 py-2 text-left transition-colors motion-reduce:transition-none ${focusRing} ${on ? 'bg-teal-400/10' : 'hover:bg-slate-800/60'}`}
							>
								<span
									className={`relative z-10 inline-flex size-[22px] shrink-0 items-center justify-center rounded-full border font-mono text-[10px] leading-none transition-colors motion-reduce:transition-none ${on ? 'border-transparent bg-teal-400 text-slate-950' : i < active ? 'border-teal-400/50 bg-slate-900/50 text-teal-300' : 'border-slate-600 bg-slate-900/50 text-slate-500'}`}
								>
									{i + 1}
								</span>
								<span className='min-w-0 pt-0.5'>
									<span className='flex flex-wrap items-center gap-2'>
										<span className={`text-sm font-medium ${on ? 'text-slate-100' : 'text-slate-300'}`}>{step.title}</span>
										{step.tag && <code className='rounded bg-teal-400/10 px-1.5 py-0.5 font-mono text-[10px] text-teal-200'>{step.tag}</code>}
									</span>
									<span className={`grid transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none ${on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
										<span className='overflow-hidden'>
											<span className='block pt-1 text-sm leading-relaxed text-slate-400'>{step.body}</span>
										</span>
									</span>
								</span>
							</button>
						</li>
					)
				})}
			</ol>
			<div className='mt-4 flex items-center justify-between gap-3 border-t border-slate-700/60 pt-4'>
				<p className='text-xs text-slate-400' aria-live='polite'>
					{labels.step} {active + 1} / {steps.length}
				</p>
				<div className='flex items-center gap-1.5'>
					<button type='button' className={btn} onClick={() => go(active - 1)} aria-label={labels.prev}>
						<ChevronLeft className='size-4' aria-hidden />
					</button>
					<button type='button' className={btn} onClick={() => setPlaying((p) => !p)} aria-label={playing ? labels.pause : labels.play} aria-pressed={playing}>
						{playing ? <Pause className='size-3.5' aria-hidden /> : <Play className='size-3.5' aria-hidden />}
					</button>
					<button type='button' className={btn} onClick={() => go(active + 1)} aria-label={labels.next}>
						<ChevronRight className='size-4' aria-hidden />
					</button>
				</div>
			</div>
			{note && <p className='mt-3 text-[11px] leading-relaxed text-slate-500'>{note}</p>}
		</div>
	)
}
