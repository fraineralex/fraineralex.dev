'use client'

/*
 * Scroll triggered scenes, ported from the technique used in the Viollet blog
 * stages (alert-lane-stage, email-scan-stage): a pure "frame at elapsed ms"
 * function, a native IntersectionObserver that starts the run once the scene
 * is visible, a requestAnimationFrame clock with cleanup, and the final state
 * for reduced motion, SSR and browsers without IntersectionObserver.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'

export const sceneFocus =
	'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300'

export interface Timeline {
	/** Attach to the scene root; the run starts when 35% of it is visible. */
	ref: React.RefObject<HTMLDivElement | null>
	/** Milliseconds into the run. Equals `duration` for the final state. */
	elapsed: number
	duration: number
	playing: boolean
	reduced: boolean
	/** True once the run has started at least once (false on SSR). */
	started: boolean
	toggle: () => void
	replay: () => void
}

/**
 * Autoplay clock for a scene. `loop` restarts after `duration` (plus `hold`
 * ms on the final frame). Until it starts, and with reduced motion, elapsed
 * is `duration` so the static final state is rendered.
 */
export function useSceneTimeline(duration: number, { loop = false, hold = 2400 }: { loop?: boolean; hold?: number } = {}): Timeline {
	const ref = useRef<HTMLDivElement | null>(null)
	const [elapsed, setElapsed] = useState(duration)
	const [playing, setPlaying] = useState(false)
	const [reduced, setReduced] = useState(false)
	const [started, setStarted] = useState(false)
	const elapsedRef = useRef(elapsed)
	elapsedRef.current = elapsed

	useEffect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
		const sync = () => {
			setReduced(mq.matches)
			if (mq.matches) {
				setPlaying(false)
				setElapsed(duration)
			}
		}
		sync()
		mq.addEventListener('change', sync)
		return () => mq.removeEventListener('change', sync)
	}, [duration])

	useEffect(() => {
		if (reduced) return
		const node = ref.current
		if (!node || typeof IntersectionObserver === 'undefined') return
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry?.isIntersecting) return
				elapsedRef.current = 0
				setElapsed(0)
				setStarted(true)
				setPlaying(true)
				observer.disconnect()
			},
			{ threshold: 0.35 },
		)
		observer.observe(node)
		return () => observer.disconnect()
	}, [reduced])

	useEffect(() => {
		if (!playing || reduced) return
		let frame = 0
		let last = performance.now()
		const total = duration + (loop ? hold : 0)
		const tick = (now: number) => {
			const delta = Math.min(now - last, 64)
			last = now
			let next = elapsedRef.current + delta
			if (next >= total) {
				if (!loop) {
					elapsedRef.current = duration
					setElapsed(duration)
					setPlaying(false)
					return
				}
				next = 0
			}
			elapsedRef.current = next
			setElapsed(next)
			frame = window.requestAnimationFrame(tick)
		}
		frame = window.requestAnimationFrame(tick)
		return () => window.cancelAnimationFrame(frame)
	}, [playing, reduced, duration, loop, hold])

	return {
		ref,
		elapsed: Math.min(elapsed, duration),
		duration,
		playing,
		reduced,
		started,
		toggle: () => {
			if (reduced) return
			if (!playing && elapsed >= duration && !loop) {
				elapsedRef.current = 0
				setElapsed(0)
			}
			setStarted(true)
			setPlaying((value) => !value)
		},
		replay: () => {
			if (reduced) return
			elapsedRef.current = 0
			setElapsed(0)
			setStarted(true)
			setPlaying(true)
		},
	}
}

/** 0..1 progress of `elapsed` between `start` and `end` (ms), eased. */
export function span(elapsed: number, start: number, end: number, ease: (t: number) => number = easeInOut) {
	if (elapsed <= start) return 0
	if (elapsed >= end) return 1
	return ease((elapsed - start) / (end - start))
}

export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
export const linear = (t: number) => t

/** Index of the active phase given phase start times in ms (ascending). */
export function phaseAt(elapsed: number, starts: number[]) {
	let index = 0
	for (let i = 0; i < starts.length; i++) if (elapsed >= starts[i]) index = i
	return index
}

/** Point at fraction t (0..1) along a polyline, by length. */
export function pointOnPolyline(points: Array<[number, number]>, t: number): [number, number] {
	if (points.length === 1) return points[0]
	const lengths: number[] = []
	let total = 0
	for (let i = 1; i < points.length; i++) {
		const l = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
		lengths.push(l)
		total += l
	}
	let target = Math.max(0, Math.min(1, t)) * total
	for (let i = 0; i < lengths.length; i++) {
		if (target <= lengths[i] || i === lengths.length - 1) {
			const f = lengths[i] === 0 ? 0 : target / lengths[i]
			const [x1, y1] = points[i]
			const [x2, y2] = points[i + 1]
			return [x1 + (x2 - x1) * Math.min(1, f), y1 + (y2 - y1) * Math.min(1, f)]
		}
		target -= lengths[i]
	}
	return points[points.length - 1]
}

/** First `chars` characters of `text` for typed text effects (by code point). */
export function typed(text: string, progress: number) {
	const chars = Array.from(text)
	return chars.slice(0, Math.round(chars.length * Math.max(0, Math.min(1, progress)))).join('')
}

export interface SceneLabels {
	pause: string
	play: string
	replay: string
}

export const SCENE_LABELS: Record<'en' | 'es', SceneLabels> = {
	en: { pause: 'Pause animation', play: 'Play animation', replay: 'Replay' },
	es: { pause: 'Pausar animación', play: 'Reproducir animación', replay: 'Repetir' },
}

/**
 * Portfolio styled frame for a scene: title row with discreet 44px pause and
 * replay controls, a visual body with a fixed aspect ratio or min height set
 * by the caller (no layout shift), and a polite live caption.
 */
export function SceneFrame({
	timeline,
	labels,
	title,
	kicker,
	caption,
	children,
	className = '',
}: {
	timeline: Timeline
	labels: SceneLabels
	title?: ReactNode
	kicker?: ReactNode
	caption?: ReactNode
	children: ReactNode
	className?: string
}) {
	const { ref, playing, reduced, toggle, replay } = timeline
	const control = `inline-flex size-11 items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/70 text-slate-300 leading-none transition-colors hover:border-teal-300/50 hover:text-teal-100 motion-reduce:transition-none ${sceneFocus}`
	return (
		<div ref={ref} className={`min-w-0 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950/60 ${className}`}>
			{(title || kicker || !reduced) && (
				<div className='flex items-center justify-between gap-3 border-b border-slate-700/60 px-4 py-2 sm:px-5'>
					<div className='min-w-0'>
						{kicker && <p className='text-[11px] font-medium uppercase tracking-wide text-teal-200/80'>{kicker}</p>}
						{title && <h3 className='truncate text-sm font-semibold text-slate-100'>{title}</h3>}
					</div>
					{!reduced && (
						<div className='flex shrink-0 items-center gap-1.5'>
							<button type='button' onClick={toggle} className={control} aria-label={playing ? labels.pause : labels.play}>
								{playing ? <Pause className='size-4' aria-hidden /> : <Play className='size-4' aria-hidden />}
							</button>
							<button type='button' onClick={replay} className={control} aria-label={labels.replay}>
								<RotateCcw className='size-4' aria-hidden />
							</button>
						</div>
					)}
				</div>
			)}
			{children}
			{caption && (
				<p className='min-h-[3.25rem] border-t border-slate-700/60 px-4 py-2.5 text-sm leading-relaxed text-slate-400 sm:px-5' aria-live='polite'>
					{caption}
				</p>
			)}
		</div>
	)
}
