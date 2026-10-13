// Plain module (no 'use client') so server components can read the tokens too.
/*
 * Portfolio palette (slate canvas, slate cards, teal accent, Inter) used to
 * recolor components that copy the markup of the real Viollet app.
 * Mapping from the Viollet tokens: background -> slate-900, card -> slate-800/40,
 * border -> slate-700/60, muted-foreground -> slate-400, primary -> teal-300/400.
 */
export const v = {
  fg: 'text-slate-200',
  muted: 'text-slate-400',
  subtle: 'text-slate-500',
  border: 'border-slate-700/60',
  canvas: 'bg-slate-900/60',
  card: 'bg-slate-800/40',
  secondary: 'bg-slate-800',
  accent: 'bg-teal-400/10',
  primaryText: 'text-teal-300',
  primaryBg: 'bg-teal-400'
} as const

export const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300'

/** Buttons with fixed height and flex centered labels (shadcn sizes from the Viollet app). */
export const button = {
  base: `inline-flex h-11 shrink-0 sm:h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3.5 text-sm font-medium leading-none transition-colors motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-45 ${focusRing}`,
  primary: 'bg-teal-400/15 text-teal-200 hover:bg-teal-400/25',
  outline: 'border border-slate-700/60 bg-slate-900/60 text-slate-200 hover:border-teal-300/40 hover:text-teal-100',
  ghost: 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
} as const

/** Selectable row or tile. */
export function itemClass (active: boolean) {
  return `rounded-lg border text-left transition-colors duration-200 motion-reduce:transition-none ${focusRing} ${
    active
      ? 'border-teal-300/60 bg-teal-400/10'
      : 'border-slate-700/60 bg-slate-900/50 hover:border-slate-500'
  }`
}

/** Rounded pill filter or chip. */
export function pillClass (active: boolean) {
  return `inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 sm:h-8 sm:min-w-0 text-xs font-medium leading-none transition-colors motion-reduce:transition-none ${focusRing} ${
    active
      ? 'bg-teal-400/20 text-teal-100'
      : 'border border-slate-700/60 bg-slate-900/50 text-slate-300 hover:text-slate-100'
  }`
}

export const well = 'rounded-lg border border-slate-700/60 bg-slate-900/50 p-4'
export const kicker = 'text-[11px] font-medium uppercase tracking-wide text-teal-200/80'
export const inputClass = `h-11 sm:h-9 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 placeholder:text-slate-500 ${focusRing}`
