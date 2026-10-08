'use client'

import type { ReactNode } from 'react'
import { Check, CheckCheck, FileText, Pin, Search, Smile, Sticker } from 'lucide-react'
import {
	SCENE_LABELS,
	SceneFrame,
	easeInOut,
	easeOut,
	linear,
	phaseAt,
	span,
	typed,
	useSceneTimeline,
} from '../kit/scene'

const DURATION = 13200
const HOLD = 3000

const COPY = {
	en: {
		kicker: 'The chat',
		title: 'What a conversation holds',
		contact: 'Laura',
		sample: 'Sample',
		online: 'online',
		placeholder: 'Type a message',
		you: 'You',
		message: 'chatify.fraineralex.dev',
		reply: 'Got the link.',
		file: 'notes.pdf',
		kind: 'PDF',
		gif: 'GIF',
		query: 'pdf',
		search: 'Search in chat',
		sent: 'Sent',
		delivered: 'Delivered',
		read: 'Read',
		list: 'Features',
		now: 'Now',
		captions: [
			'Frainer types a text message with a link, then sends it.',
			'An emoji reaction pops on that message.',
			'An image arrives while the upload bar fills.',
			'A sticker GIF lands in the thread.',
			'A file attachment row slides into the chat.',
			'Laura replies and quotes the first message.',
			'The reaction stays on the message, one emoji.',
			'Ticks go from sent, to delivered, to read.',
			'The conversation is pinned from the header.',
			'Search matches the shared file by its name.',
		],
	},
	es: {
		kicker: 'El chat',
		title: 'Lo que cabe en una conversación',
		contact: 'Laura',
		sample: 'Ejemplo',
		online: 'en línea',
		placeholder: 'Escribe un mensaje',
		you: 'Tú',
		message: 'chatify.fraineralex.dev',
		reply: 'Vi el enlace.',
		file: 'notas.pdf',
		kind: 'PDF',
		gif: 'GIF',
		query: 'pdf',
		search: 'Buscar en el chat',
		sent: 'Enviado',
		delivered: 'Entregado',
		read: 'Leído',
		list: 'Funciones',
		now: 'Ahora',
		captions: [
			'Frainer escribe un mensaje con enlace y lo envía.',
			'Una reacción con emoji aparece sobre ese mensaje.',
			'Llega una imagen mientras se llena la barra de subida.',
			'Entra un sticker GIF en la conversación.',
			'Aparece la fila de un archivo adjunto.',
			'Laura responde y cita el primer mensaje.',
			'La reacción se queda en el mensaje.',
			'Los checks pasan de enviado a entregado y a leído.',
			'La conversación se fija desde el encabezado.',
			'La búsqueda encuentra el archivo por su nombre.',
		],
	},
} as const

const CUE = [0, 1500, 2700, 4200, 5400, 6600, 8000, 9400, 10800, 12000]
const ITEM_AT = [0, 6600, 8000, 9400, 10800, 12000]

type Copy = (typeof COPY)[keyof typeof COPY]

function frameAt(elapsed: number) {
	const react = span(elapsed, 1550, 2100, easeOut)
	const pulse = elapsed > 8000 && elapsed < 9400 ? 0.08 * Math.sin(elapsed / 120) : 0
	return {
		typeP: span(elapsed, 180, 1100, linear),
		textIn: span(elapsed, 1120, 1480, easeOut),
		react,
		reactScale: 0.55 + 0.45 * react + pulse,
		upload: span(elapsed, 2750, 4000, easeInOut),
		imageIn: span(elapsed, 3600, 4200, easeOut),
		sticker: span(elapsed, 4300, 4900, easeOut),
		file: span(elapsed, 5450, 6100, easeOut),
		reply: span(elapsed, 6700, 7450, easeOut),
		pin: span(elapsed, 10900, 11600, easeOut),
		search: span(elapsed, 12100, 12800, easeOut),
		query: span(elapsed, 12240, 12900, linear),
		cue: phaseAt(elapsed, CUE),
		item: phaseAt(elapsed, ITEM_AT),
	}
}

function ticks(elapsed: number, born: number) {
	if (elapsed < born) return 0
	if (elapsed < 10000) return 1
	if (elapsed < 10600) return 2
	return 3
}

function Ticks({ level, labels }: { level: number; labels: { sent: string; delivered: string; read: string } }) {
	const box = 'absolute inset-0 size-4'
	const name = level === 3 ? labels.read : level === 2 ? labels.delivered : level === 1 ? labels.sent : ''
	return (
		<span className='relative inline-block size-4 shrink-0' aria-label={name || undefined}>
			<Check className={`${box} text-slate-400`} style={{ opacity: level === 1 ? 1 : 0 }} aria-hidden />
			<CheckCheck className={`${box} text-slate-400`} style={{ opacity: level === 2 ? 1 : 0 }} aria-hidden />
			<CheckCheck className={`${box} text-teal-300`} style={{ opacity: level >= 3 ? 1 : 0 }} aria-hidden />
		</span>
	)
}

function Time({ level, labels, extra }: { level: number; labels: { sent: string; delivered: string; read: string }; extra?: string }) {
	return (
		<span className='float-end ms-2 mt-1 inline-flex items-end gap-0.5 whitespace-nowrap text-xs font-normal text-slate-400'>
			{extra && <span className='text-[11px] tabular-nums'>{extra}</span>}
			<time className='text-[10px] tabular-nums' dateTime='2024-06-12T15:24:00Z'>3:24</time>
			<Ticks level={level} labels={labels} />
		</span>
	)
}

function Row({ show, className, children }: { show: number; className: string; children: ReactNode }) {
	return (
		<li className={`flex shrink-0 ${className}`} style={{ opacity: show, transform: `translateY(${(1 - show) * 8}px)` }}>
			{children}
		</li>
	)
}

function Chat({ elapsed, t }: { elapsed: number; t: Copy }) {
	const f = frameAt(elapsed)
	const labels = { sent: t.sent, delivered: t.delivered, read: t.read }
	const draft = f.textIn > 0 ? '' : typed(t.message, f.typeP)
	const caret = f.typeP > 0 && f.typeP < 1 && f.textIn === 0 && Math.sin(elapsed / 160) > 0
	const uploading = f.upload > 0.02 && f.upload < 0.98
	const pct = String(Math.min(100, Math.round(f.upload * 100))).padStart(3, '\u2007')
	const imageShow = Math.max(span(elapsed, 2750, 3100, easeOut), f.imageIn)
	const found = span(elapsed, 12600, 13000, easeOut)
	const query = typed(t.query, f.query)
	return (
		<section className='flex h-[26.25rem] min-w-0 flex-col overflow-hidden rounded-lg border border-slate-700/60 bg-slate-900/70' aria-hidden>
			<header className='flex h-10 shrink-0 items-center gap-2 border-b border-slate-700/60 px-2.5'>
				<span className='relative shrink-0'>
					<span className='inline-flex size-8 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-100'>L</span>
					<span className='absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-slate-900 bg-emerald-400' />
				</span>
				<div className='min-w-0'>
					<h2 className='flex items-center gap-1 truncate text-sm font-bold text-slate-100'>
						{t.contact}
						<Pin className='size-3.5 shrink-0 text-teal-300' style={{ opacity: f.pin }} aria-hidden />
					</h2>
					<p className='text-[11px] leading-tight text-emerald-400'>{t.online}</p>
				</div>
				<span className='ms-auto inline-flex h-5 items-center rounded-full bg-teal-400/15 px-2 text-[10px] font-medium text-teal-200'>{t.sample}</span>
				<Search className='size-4 shrink-0 text-slate-400' style={{ opacity: 0.35 + f.search * 0.65 }} aria-hidden />
			</header>
			<ul className='flex min-h-0 flex-1 flex-col gap-1 overflow-hidden px-2.5 py-1'>
				<Row show={f.textIn} className='h-[4.25rem] justify-end'>
					<div className='flex w-full flex-col items-end'>
						<article className='w-fit max-w-[95%] rounded-lg border border-transparent bg-slate-700 px-1 pb-1 pt-1'>
							<p className='inline w-full align-middle text-sm font-medium text-slate-100'>
								<span className='text-teal-300 underline decoration-teal-300/50 underline-offset-2'>{t.message}</span>
								<Time level={ticks(elapsed, 1300)} labels={labels} />
							</p>
						</article>
						<span className='-mt-2 me-2 flex justify-end' style={{ opacity: f.react, transform: `scale(${f.reactScale})` }}>
							<span className='rounded-full border border-slate-600 bg-slate-800 px-[5px] py-[1px] text-sm leading-none'>👍</span>
						</span>
					</div>
				</Row>
				<Row show={imageShow} className='h-[4.25rem] justify-end'>
					<article className='w-fit max-w-[95%] rounded-lg border border-transparent bg-slate-700 px-1 pb-1 pt-1'>
						<div className='relative h-9 w-28 overflow-hidden rounded-md bg-slate-950'>
							<div className='absolute inset-0 bg-gradient-to-br from-teal-800/90 via-slate-600 to-slate-900' style={{ opacity: f.imageIn }} />
							<div className='absolute inset-x-1 bottom-1 h-1 overflow-hidden rounded-full bg-slate-950/80' style={{ opacity: uploading ? 1 : 0 }}>
								<div className='h-full rounded-full bg-teal-300' style={{ width: `${Math.round(f.upload * 100)}%` }} />
							</div>
						</div>
						<p className='flow-root ps-1 text-sm font-medium text-slate-100'>
							<Time level={ticks(elapsed, 3900)} labels={labels} extra={uploading ? `${pct}%` : undefined} />
						</p>
					</article>
				</Row>
				<Row show={f.sticker} className='h-12 justify-start'>
					<article className='relative w-fit rounded-lg border border-transparent px-1'>
						<p className='px-1 text-4xl leading-none'>🎉</p>
						<span className='absolute bottom-0 right-0 rounded bg-slate-800 px-1 text-[11px] font-medium text-slate-300'>{t.gif}</span>
					</article>
				</Row>
				<Row show={f.file} className='h-[3.25rem] justify-end'>
					<figure className='w-fit max-w-[95%] rounded-md bg-slate-800' style={{ outline: found > 0.2 ? '1px solid rgb(94 234 212 / 0.85)' : '1px solid transparent', borderRadius: 6 }}>
						<div className='flex items-center gap-2 px-2 py-1'>
							<FileText className='size-8 shrink-0 text-slate-300' aria-hidden />
							<span className='min-w-0 text-slate-400'>
								<span className='block w-36 truncate text-sm font-medium text-slate-100'>{t.file}</span>
								<span className='block text-[11px]'>{t.kind}</span>
							</span>
							<Ticks level={ticks(elapsed, 5900)} labels={labels} />
						</div>
					</figure>
				</Row>
				<Row show={f.reply} className='h-[4.75rem] justify-start'>
					<article className='w-fit max-w-[95%] rounded-lg border border-transparent bg-slate-800 px-1 pb-1 pt-1'>
						<div className='mb-1 flex flex-col rounded-lg border-l-4 border-teal-400 bg-slate-900/70 px-2'>
							<p className='my-0.5 text-xs font-medium text-teal-300'>{t.you}</p>
							<p className='truncate pb-1 text-xs font-normal text-slate-400'>{t.message}</p>
						</div>
						<p className='ps-1 text-sm font-medium text-slate-100'>
							{t.reply}
							<span className='float-end ms-2 mt-1 inline-flex text-[10px] font-normal text-slate-400'>
								<time className='tabular-nums' dateTime='2024-06-12T15:28:00Z'>3:28</time>
							</span>
						</p>
					</article>
				</Row>
			</ul>
			<div className='relative h-10 shrink-0 border-t border-slate-700/60'>
				<div className='absolute inset-0 flex items-center gap-1.5 px-2 text-slate-400' style={{ opacity: 1 - f.search }}>
					<Smile className='size-5 shrink-0' aria-hidden />
					<Sticker className='size-5 shrink-0' aria-hidden />
					<div className='relative h-7 min-w-0 flex-1 overflow-hidden rounded-full'>
						<span className='absolute inset-0 truncate px-2 text-sm leading-7 text-slate-500' style={{ opacity: draft ? 0 : 1 }}>{t.placeholder}</span>
						<span className='absolute inset-0 truncate px-2 text-sm leading-7 text-slate-100'>
							{draft}
							<span className='ms-px inline-block h-3.5 w-px translate-y-0.5 bg-teal-300 align-middle' style={{ opacity: caret ? 1 : 0 }} />
						</span>
					</div>
				</div>
				<div className='absolute inset-0 flex items-center px-2' style={{ opacity: f.search }}>
					<Search className='me-2 size-4 shrink-0 text-teal-300' aria-hidden />
					<div className='h-7 min-w-0 flex-1 truncate rounded-full bg-slate-800/80 px-3 text-sm leading-7 text-slate-100' aria-label={t.search}>
						{query}
						<span className='ms-px inline-block h-3.5 w-px translate-y-0.5 bg-teal-300 align-middle' style={{ opacity: f.search > 0.4 && f.query < 1 && Math.sin(elapsed / 160) > 0 ? 1 : 0 }} />
					</div>
				</div>
			</div>
		</section>
	)
}

export function FeaturesScene({ lang, items }: { lang: 'en' | 'es'; items: readonly { title: string; body: string }[] }) {
	const t = COPY[lang]
	const tl = useSceneTimeline(DURATION, { loop: true, hold: HOLD })
	const f = frameAt(tl.elapsed)
	const active = Math.min(f.item, Math.max(0, items.length - 1))
	return (
		<SceneFrame timeline={tl} labels={SCENE_LABELS[lang]} kicker={t.kicker} title={t.title} caption={<span className='block h-[3.25rem] overflow-hidden'>{t.captions[f.cue]}</span>}>
			<div className='grid items-start gap-3 p-3 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] sm:p-4'>
				<Chat elapsed={tl.elapsed} t={t} />
				<div className='min-w-0 rounded-lg border border-slate-700/60 bg-slate-900/50 p-3'>
					<p className='text-[11px] font-medium uppercase tracking-wide text-slate-500'>{t.list}</p>
					<div className='relative mt-2 h-28 overflow-hidden'>
						{items.map((item, i) => (
							<p key={item.title} className='absolute inset-0 text-sm leading-snug text-slate-300' style={{ opacity: i === active ? 1 : 0 }}>
								<span className='mb-0.5 block text-[11px] font-medium uppercase tracking-wide text-teal-200/80'>{t.now}</span>
								{item.body}
							</p>
						))}
					</div>
					<ol className='mt-2' aria-label={t.list}>
						{items.map((item, i) => {
							const tick = span(tl.elapsed, ITEM_AT[i] ?? DURATION, (ITEM_AT[i] ?? DURATION) + 400, easeOut)
							const on = i === active
							return (
								<li key={item.title} className='flex h-8 items-center gap-2' aria-current={on ? 'step' : undefined}>
									<span className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full border ${tick > 0.55 ? 'border-teal-300 bg-teal-400/15 text-teal-200' : 'border-slate-600 text-slate-600'}`}>
										<Check className='size-3' style={{ opacity: tick }} aria-hidden />
									</span>
									<span className={`min-w-0 truncate text-sm ${on ? 'font-medium text-slate-100' : tick > 0.55 ? 'text-slate-300' : 'text-slate-500'}`}>{item.title}</span>
								</li>
							)
						})}
					</ol>
				</div>
			</div>
		</SceneFrame>
	)
}
