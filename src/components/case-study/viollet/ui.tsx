'use client'

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ViolletControlsCopy } from '@/types/case-study-types'

export const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300'

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
  const buttonClass = `inline-flex items-center gap-1.5 rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-teal-300/60 hover:text-teal-100 disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-wrap items-center gap-2'>
        <button type='button' className={buttonClass} onClick={onToggle} aria-pressed={playing}>
          {playing ? <Pause className='h-4 w-4' aria-hidden='true' /> : <Play className='h-4 w-4' aria-hidden='true' />}
          {playing ? copy.pause : copy.play}
        </button>
        <button type='button' className={buttonClass} onClick={onPrev} disabled={step === 0}>
          <SkipBack className='h-4 w-4' aria-hidden='true' />
          {copy.previous}
        </button>
        <button type='button' className={buttonClass} onClick={onNext} disabled={step === total - 1}>
          <SkipForward className='h-4 w-4' aria-hidden='true' />
          {copy.next}
        </button>
        <button type='button' className={buttonClass} onClick={onReplay}>
          <RotateCcw className='h-4 w-4' aria-hidden='true' />
          {copy.replay}
        </button>
        <p className='text-sm text-slate-400' aria-live='polite'>
          {copy.step} {step + 1} {copy.of} {total}
        </p>
      </div>
      <div
        className='h-1 overflow-hidden rounded-full bg-slate-800'
        role='progressbar'
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step + 1}
        aria-valuetext={`${copy.step} ${step + 1} ${copy.of} ${total}`}
      >
        <div
          className='h-full rounded-full bg-teal-300 motion-reduce:transition-none transition-[width] duration-300'
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  )
}
