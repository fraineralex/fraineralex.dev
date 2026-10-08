'use client'

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ViolletControlsCopy } from '@/types/case-study-types'

import { button, v } from './tokens'

export { button, focusRing, inputClass, itemClass, kicker, pillClass, v, well } from './tokens'

export function InteractivePanel ({
  label,
  title,
  description,
  children
}: {
  label: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section
      aria-label={label}
      className='viollet-interactive mt-6 overflow-hidden rounded-xl border border-teal-400/20 bg-slate-950/60'
    >
      <div className='border-b border-slate-700/60 px-4 py-4 sm:px-5'>
        <h3 className='text-base font-semibold text-slate-100'>{title}</h3>
        <p className='mt-1 text-sm leading-relaxed text-slate-400'>{description}</p>
      </div>
      <div className='p-4 sm:p-5'>{children}</div>
    </section>
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
