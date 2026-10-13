'use client'

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ViolletControlsCopy } from '@/types/case-study-types'

import { geist, geistMono } from '../kit/fonts'
import { sceneFocus, type Timeline } from '../kit/scene'
import { L } from './light'
import { button, v } from './tokens'

export { button, focusRing, inputClass, itemClass, kicker, pillClass, v, well } from './tokens'

export function InteractivePanel ({
  label,
  title,
  description,
  children,
  timeline,
  labels
}: {
  label: string
  title: string
  description: string
  children: ReactNode
  /** When set, the panel is a scroll triggered scene with discreet pause and replay. */
  timeline?: Timeline
  labels?: { pause: string, play: string, replay: string }
}) {
  const control = `inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/70 text-slate-300 leading-none transition-colors hover:border-teal-300/50 hover:text-teal-100 motion-reduce:transition-none ${sceneFocus}`
  return (
    <section
      ref={timeline?.ref}
      data-scene={timeline ? '' : undefined}
      aria-label={label}
      className='viollet-interactive mt-6 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950/60'
    >
      <div className='flex items-start justify-between gap-3 border-b border-slate-700/60 px-4 py-4 sm:px-5'>
        <div className='min-w-0'>
          <h3 className='text-base font-semibold text-slate-100'>{title}</h3>
          <p className='mt-1 text-sm leading-relaxed text-slate-400'>{description}</p>
        </div>
        {timeline && labels && !timeline.reduced && (
          <div className='flex shrink-0 items-center gap-1.5'>
            <button type='button' onClick={timeline.toggle} className={control} aria-label={timeline.playing ? labels.pause : labels.play}>
              {timeline.playing ? <Pause className='size-4' aria-hidden='true' /> : <Play className='size-4' aria-hidden='true' />}
            </button>
            <button type='button' onClick={timeline.replay} className={control} aria-label={labels.replay}>
              <RotateCcw className='size-4' aria-hidden='true' />
            </button>
          </div>
        )}
      </div>
      <div className='p-3 sm:p-5'>{children}</div>
    </section>
  )
}

/**
 * Light Viollet app surface (the same theme as the embedded viollet.app
 * simulation): light canvas, Geist, a thin browser bar with the app route.
 */
export function AppSurface ({ route, children, className = '' }: { route?: string, children: ReactNode, className?: string }) {
  return (
    <div className={`${geist.variable} ${geistMono.variable} ${L.surface} overflow-hidden rounded-xl border border-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] ${className}`}>
      {route && (
        <div className={`flex h-8 items-center gap-2 border-b ${L.border} bg-white px-3`}>
          <span className='flex gap-1' aria-hidden='true'>
            <span className='size-2 rounded-full bg-[#ff5f57]' />
            <span className='size-2 rounded-full bg-[#febc2e]' />
            <span className='size-2 rounded-full bg-[#28c840]' />
          </span>
          <span className={`mx-auto truncate rounded-md ${L.secondary} px-3 py-0.5 text-[11px] ${L.muted}`}>{route}</span>
        </div>
      )}
      <div className='p-3 sm:p-4'>{children}</div>
    </div>
  )
}

export function StepControls ({
  copy,
  step,
  total,
  playing,
  onToggle,
  onPrev,
  onNext,
  onReplay
}: {
  copy: ViolletControlsCopy
  step: number
  total: number
  playing: boolean
  onToggle: () => void
  onPrev: () => void
  onNext: () => void
  onReplay: () => void
}) {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-wrap items-center gap-2'>
        <button type='button' className={`${button.base} ${button.primary}`} onClick={onToggle} aria-pressed={playing}>
          {playing ? <Pause className='size-4' aria-hidden='true' /> : <Play className='size-4' aria-hidden='true' />}
          {playing ? copy.pause : copy.play}
        </button>
        <button type='button' className={`${button.base} ${button.outline}`} onClick={onPrev} disabled={step === 0}>
          <SkipBack className='size-4' aria-hidden='true' />
          {copy.previous}
        </button>
        <button type='button' className={`${button.base} ${button.outline}`} onClick={onNext} disabled={step === total - 1}>
          <SkipForward className='size-4' aria-hidden='true' />
          {copy.next}
        </button>
        <button type='button' className={`${button.base} ${button.ghost}`} onClick={onReplay}>
          <RotateCcw className='size-4' aria-hidden='true' />
          {copy.replay}
        </button>
        <p className={`ml-auto text-xs font-medium tabular-nums ${v.muted}`} aria-live='polite'>
          {copy.step} {step + 1} {copy.of} {total}
        </p>
      </div>
      <div
        className={`h-1.5 overflow-hidden rounded-full ${v.secondary}`}
        role='progressbar'
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step + 1}
        aria-valuetext={`${copy.step} ${step + 1} ${copy.of} ${total}`}
      >
        <div
          className='h-full rounded-full bg-teal-300 transition-[width] duration-300 motion-reduce:transition-none'
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  )
}
