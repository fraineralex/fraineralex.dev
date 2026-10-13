'use client'

import { useEffect, useRef, useState } from 'react'

interface Item {
	name: string
	detail: string
}

interface Layer {
	title: string
	items: Item[]
}

/**
 * Architecture columns for Chatify. They stay in the dark page theme, stagger
 * in on scroll, and the connector between them draws in. Reduced motion and
 * no-JS keep the finished layout. Transforms only, so the height is reserved.
 */
export function ArchitectureColumns({ layers, caption }: { layers: Layer[]; caption?: string }) {
	const ref = useRef<HTMLElement>(null)
	const [state, setState] = useState<'idle' | 'hidden' | 'shown'>('idle')

	useEffect(() => {
		const el = ref.current
		if (!el) return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
		const rect = el.getBoundingClientRect()
		if (rect.top < window.innerHeight * 0.9) return
		setState('hidden')
		const io = new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				setState('shown')
				io.disconnect()
			}
		}, { rootMargin: '0px 0px -12% 0px' })
		io.observe(el)
		return () => io.disconnect()
	}, [])

	const hidden = state === 'hidden'
	const shown = state === 'shown'

	return (
		<figure ref={ref} className='min-w-0'>
			<div className='grid gap-3 md:grid-cols-3'>
				{layers.map((layer, i) => (
					<div
						key={layer.title}
						className={`relative min-w-0 rounded-lg border border-slate-700/50 bg-slate-800/30 p-4 transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${hidden ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'}`}
						style={shown ? { transitionDelay: `${i * 120}ms` } : undefined}
					>
						<p className='font-mono text-[11px] uppercase tracking-wider text-teal-300'>
							{String(i + 1).padStart(2, '0')} · {layer.title}
						</p>
						<ul className='mt-3 space-y-2'>
							{layer.items.map((item, j) => (
								<li
									key={item.name}
									className={`rounded-md border border-slate-700/60 bg-slate-900/50 px-3 py-2.5 transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${hidden ? 'translate-y-3 opacity-0' : 'translate-y-0 opacity-100'}`}
									style={shown ? { transitionDelay: `${i * 120 + (j + 1) * 70}ms` } : undefined}
								>
									<p className='text-sm font-medium text-slate-200'>{item.name}</p>
									<p className='mt-0.5 text-xs leading-relaxed text-slate-400'>{item.detail}</p>
								</li>
							))}
						</ul>
						{i < layers.length - 1 && (
							<>
								<span aria-hidden className='pointer-events-none absolute -bottom-3 left-1/2 h-3 w-px -translate-x-1/2 md:hidden'>
									<svg
										viewBox='0 0 2 12'
										className={`h-full w-full overflow-visible text-teal-300/50 transition-transform duration-500 ease-out motion-reduce:scale-y-100 motion-reduce:transition-none ${hidden ? 'origin-top scale-y-0' : 'origin-top scale-y-100'}`}
										style={shown ? { transitionDelay: `${i * 120 + 180}ms` } : undefined}
									>
										<line x1='1' y1='0' x2='1' y2='12' stroke='currentColor' strokeWidth='1.5' strokeDasharray='3 3' className='vk-flow-dash' />
									</svg>
								</span>
								<span aria-hidden className='pointer-events-none absolute -right-3 top-1/2 hidden h-px w-3 -translate-y-1/2 md:block'>
									<svg
										viewBox='0 0 12 2'
										preserveAspectRatio='none'
										className={`h-full w-full overflow-visible text-teal-300/50 transition-transform duration-500 ease-out motion-reduce:scale-x-100 motion-reduce:transition-none ${hidden ? 'origin-left scale-x-0' : 'origin-left scale-x-100'}`}
										style={shown ? { transitionDelay: `${i * 120 + 180}ms` } : undefined}
									>
										<line x1='0' y1='1' x2='12' y2='1' stroke='currentColor' strokeWidth='1.5' strokeDasharray='3 3' className='vk-flow-dash' />
									</svg>
								</span>
							</>
						)}
					</div>
				))}
			</div>
			{caption && <figcaption className='mt-3 text-xs text-slate-500'>{caption}</figcaption>}
		</figure>
	)
}
