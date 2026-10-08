import type { ReactNode } from 'react'

/** Layered architecture diagram: columns of cards with a dashed connector between layers. */
export function Layers({ layers, caption }: { layers: { title: string; items: { name: string; detail: string }[] }[]; caption?: string }) {
	return (
		<figure className='min-w-0'>
			<div className='grid gap-3 md:grid-cols-3'>
				{layers.map((layer, i) => (
					<div key={layer.title} className='relative min-w-0 rounded-lg border border-slate-700/50 bg-slate-800/30 p-4'>
						<p className='font-mono text-[11px] uppercase tracking-wider text-teal-300'>
							{String(i + 1).padStart(2, '0')} · {layer.title}
						</p>
						<ul className='mt-3 space-y-2'>
							{layer.items.map((item) => (
								<li key={item.name} className='rounded-md border border-slate-700/60 bg-slate-900/50 px-3 py-2.5'>
									<p className='text-sm font-medium text-slate-200'>{item.name}</p>
									<p className='mt-0.5 text-xs leading-relaxed text-slate-400'>{item.detail}</p>
								</li>
							))}
						</ul>
						{i < layers.length - 1 && (
							<svg aria-hidden className='absolute -right-3 top-1/2 hidden h-px w-3 overflow-visible text-teal-300/50 md:block'>
								<line x1='0' y1='0' x2='12' y2='0' stroke='currentColor' strokeDasharray='3 3' className='vk-flow-dash' />
							</svg>
						)}
					</div>
				))}
			</div>
			{caption && <figcaption className='mt-3 text-xs text-slate-500'>{caption}</figcaption>}
		</figure>
	)
}

/** Feature grid. Each tile is a portfolio card with an icon slot. */
export function Tiles({ items, cols = 3 }: { items: { icon?: ReactNode; title: string; body: string }[]; cols?: 2 | 3 | 4 }) {
	const grid = cols === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
	return (
		<ul className={`grid gap-3 ${grid}`}>
			{items.map((item) => (
				<li key={item.title} className='min-w-0 rounded-lg border border-slate-700/50 bg-slate-800/30 p-5'>
					{item.icon && <span className='inline-flex size-9 items-center justify-center rounded-lg bg-teal-400/10 text-teal-300'>{item.icon}</span>}
					<h3 className={`${item.icon ? 'mt-4' : ''} font-medium text-slate-100`}>{item.title}</h3>
					<p className='mt-1.5 text-sm leading-relaxed text-slate-400' style={{ textWrap: 'pretty' }}>
						{item.body}
					</p>
				</li>
			))}
		</ul>
	)
}

/** Caption under a stage, with the sample-data disclaimer style. */
export function StageCaption({ children }: { children: ReactNode }) {
	return <p className='mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-500'><span aria-hidden className='mt-1.5 size-1 shrink-0 rounded-full bg-teal-300' />{children}</p>
}
