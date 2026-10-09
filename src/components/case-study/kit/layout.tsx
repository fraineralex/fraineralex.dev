import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import Reveal from './reveal'
export { MacWindow } from './mac-window'

/*
 * Case study page kit in the portfolio style (see case-study-content.tsx):
 * the site font, a normal content column, slate cards and teal accents.
 */
export const vk = {
	bg: 'bg-slate-900',
	card: 'bg-slate-800/30',
	sidebar: 'bg-slate-900/50',
	border: 'border-slate-700/60',
	muted: 'text-slate-400',
	primaryText: 'text-teal-300',
	primaryBg: 'bg-teal-400',
} as const

export const focusRing =
	'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300'

/** Buttons and button-like links. Fixed height plus flex centering keeps labels centered on both axes. */
export const btn = {
	base: `inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 text-sm font-semibold leading-none transition-colors motion-reduce:transition-none ${focusRing}`,
	primary: 'bg-teal-400/10 text-teal-200 hover:bg-teal-400/20 hover:text-teal-100',
	secondary: 'border border-slate-700/60 bg-slate-800/40 text-slate-200 hover:border-teal-300/40 hover:text-teal-100',
	ghost: 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100',
	sm: 'h-8 px-3 text-xs',
} as const

export interface Fact {
	label: string
	value: string
}

/** Portfolio page column. The site canvas and Inter come from the root layout. */
export function Shell({ children }: { children: ReactNode }) {
	return (
		<main className='mx-auto min-h-screen max-w-screen-xl overflow-x-clip px-6 py-12 font-sans text-slate-300/90 md:px-12 md:py-20 lg:px-24 lg:py-0'>
			<article className='min-w-0 lg:py-24'>{children}</article>
		</main>
	)
}

export function BackLink({ href, label }: { href: string; label: string }) {
	return (
		<Link href={href} className={`group mb-4 inline-flex items-center font-semibold leading-tight text-teal-200 ${focusRing}`}>
			<ArrowLeft className='mr-1 size-4 transition-transform group-hover:-translate-x-2 motion-reduce:transition-none' aria-hidden />
			{label}
		</Link>
	)
}

/** Small pill used above headings. */
export function Badge({ children, dot = true }: { children: ReactNode; dot?: boolean }) {
	return (
		<span className='inline-flex items-center gap-2 rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-200'>
			{dot && <span className='size-1.5 rounded-full bg-teal-300' aria-hidden />}
			{children}
		</span>
	)
}

export interface HeroLink {
	label: string
	url: string
}

/** Editorial hero with a visual slot that can sit beside (split) or below the text. */
export function Hero({
	title,
	lede,
	facts,
	links = [],
	children,
	layout = 'stack',
}: {
	title: ReactNode
	lede: string
	facts: Fact[]
	links?: HeroLink[]
	children?: ReactNode
	layout?: 'stack' | 'split'
}) {
	const text = (
		<div className={`min-w-0 ${layout === 'split' ? 'lg:max-w-xl' : ''}`}>
			<h1 className='text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl' style={{ textWrap: 'balance' }}>
				{title}
			</h1>
			<p className='mt-5 max-w-3xl text-base leading-relaxed text-slate-300/90 sm:text-lg' style={{ textWrap: 'pretty' }}>
				{lede}
			</p>
			{links.length > 0 && (
				<div className='mt-6 flex flex-wrap gap-3'>
					{links.map((link, i) => (
						<a key={link.url} href={link.url} target='_blank' rel='noreferrer noopener' className={`${btn.base} ${i === 0 ? btn.primary : btn.secondary}`}>
							{link.label}
							<ArrowUpRight className='size-4' aria-hidden />
						</a>
					))}
				</div>
			)}
			<dl className='mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400'>
				{facts.map((fact) => (
					<div key={fact.label} className='min-w-0 max-w-full'>
						<dt className='text-xs text-slate-500'>{fact.label}</dt>
						<dd className='mt-0.5 font-medium text-slate-200'>{fact.value}</dd>
					</div>
				))}
			</dl>
		</div>
	)
	return (
		<header className='mb-10 lg:mb-14'>
			{layout === 'split' && children ? (
				<div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12'>
					{text}
					<div className='min-w-0'>{children}</div>
				</div>
			) : (
				<>
					{text}
					{children && <div className='mt-10 min-w-0'>{children}</div>}
				</>
			)}
		</header>
	)
}

/** Portfolio card. */
export function Card({ children, className = '', as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' | 'section' | 'article' }) {
	return <Tag className={`rounded-lg border border-slate-700/50 bg-slate-800/30 p-5 ${className}`}>{children}</Tag>
}

/** Numbered chapter. With an aside it becomes a two column layout with a sticky aside on desktop. */
export function Chapter({ n, title, children, aside, id, flip = false }: { n: string; title: string; children: ReactNode; aside?: ReactNode; id?: string; flip?: boolean }) {
	return (
		<section id={id} className='mt-14 scroll-mt-24'>
			<Reveal className={aside ? 'grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-12' : ''}>
				<div className={`min-w-0 ${aside && flip ? 'lg:order-2' : ''}`}>
					<p className={`font-mono text-xs tracking-wide ${vk.primaryText}`}>{n}</p>
					<h2 className='mt-2 text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl' style={{ textWrap: 'balance' }}>
						{title}
					</h2>
					<div className='mt-4 space-y-4 text-sm leading-relaxed text-slate-300/90 min-[400px]:text-base'>{children}</div>
				</div>
				{aside && <div className={`min-w-0 lg:sticky lg:top-24 ${flip ? 'lg:order-1' : ''}`}>{aside}</div>}
			</Reveal>
		</section>
	)
}

/** Wide stage for big interactive pieces. */
export function Stage({ children, className = '' }: { children: ReactNode; className?: string }) {
	return <Reveal className={`mt-8 min-w-0 ${className}`}>{children}</Reveal>
}

export function P({ children }: { children: ReactNode }) {
	return <p style={{ textWrap: 'pretty' }}>{children}</p>
}

export function Strong({ children }: { children: ReactNode }) {
	return <strong className='font-medium text-slate-100'>{children}</strong>
}

/** Pull quote that breaks the rhythm once per page. */
export function Statement({ children }: { children: ReactNode }) {
	return (
		<Reveal className='mt-14'>
			<p className='max-w-4xl text-3xl font-semibold leading-[1.15] tracking-tight text-slate-100 sm:text-5xl' style={{ textWrap: 'balance' }}>
				{children}
			</p>
		</Reveal>
	)
}

export function Decisions({ title, items }: { title: string; items: { decision: string; rationale: string }[] }) {
	return (
		<section className='mt-14 scroll-mt-24'>
			<Reveal>
				<h2 className='text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl'>{title}</h2>
				<ol className='mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{items.map((item, i) => (
						<Card as='li' key={item.decision}>
							<span className={`font-mono text-xs ${vk.primaryText}`}>{String(i + 1).padStart(2, '0')}</span>
							<h3 className='mt-3 font-medium text-teal-200'>{item.decision}</h3>
							<p className='mt-2 text-sm leading-relaxed text-slate-300/90 min-[400px]:text-base' style={{ textWrap: 'pretty' }}>
								{item.rationale}
							</p>
						</Card>
					))}
				</ol>
			</Reveal>
		</section>
	)
}

export function Outro({ title, note, links }: { title: string; note: string; links: HeroLink[] }) {
	return (
		<section className='mt-14'>
			<Reveal>
				<div className='rounded-xl border border-teal-400/20 bg-teal-400/5 p-6 sm:p-8'>
					<h2 className='mb-3 text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl'>{title}</h2>
					<p className='mb-6 max-w-xl text-sm leading-relaxed text-slate-300/90 min-[400px]:text-base'>{note}</p>
					<ul className='flex flex-wrap gap-3'>
						{links.map((link, i) => (
							<li key={link.url}>
								<a href={link.url} target='_blank' rel='noreferrer noopener' className={`${btn.base} ${i === 0 ? btn.primary : btn.secondary}`}>
									{link.label}
									<ArrowUpRight className='size-4' aria-hidden />
								</a>
							</li>
						))}
					</ul>
				</div>
			</Reveal>
		</section>
	)
}

/** Tech chips row. */
export function Stack({ items }: { items: string[] }) {
	return (
		<ul className='flex flex-wrap gap-2'>
			{items.map((item) => (
				<li key={item} className='inline-flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-200'>
					{item}
				</li>
			))}
		</ul>
	)
}
