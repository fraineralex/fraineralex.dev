// Plain module (no 'use client'): the light theme of the real Viollet app
// (/workspace/viollet src/app/globals.css :root), used by every component that
// stands for the app inside the case study. The page around them keeps the
// portfolio palette.
//   background oklch(0.985 0 0) · card oklch(1 0 0) · foreground oklch(0.145 0 0)
//   primary oklch(0.539 0.254 282) · secondary oklch(0.965 0.01 282)
//   muted-foreground oklch(0.45 0 0) · border oklch(0.915 0.01 282) · radius 0.75rem
export const L = {
  surface: 'bg-[oklch(0.985_0_0)] text-[oklch(0.145_0_0)] [font-family:var(--font-geist),ui-sans-serif,system-ui,sans-serif]',
  card: 'rounded-xl border border-[oklch(0.915_0.01_282)] bg-white shadow-sm',
  fg: 'text-[oklch(0.145_0_0)]',
  fg2: 'text-[oklch(0.205_0_0)]',
  muted: 'text-[oklch(0.45_0_0)]',
  subtle: 'text-[oklch(0.556_0_0)]',
  border: 'border-[oklch(0.915_0.01_282)]',
  divide: 'divide-[oklch(0.915_0.01_282)]',
  secondary: 'bg-[oklch(0.965_0.01_282)]',
  accent: 'bg-[oklch(0.95_0.02_282)]',
  primaryText: 'text-[oklch(0.539_0.254_282)]',
  primaryBg: 'bg-[oklch(0.539_0.254_282)] text-white',
  primaryTint: 'bg-[oklch(0.539_0.254_282/0.08)]',
  primaryBorder: 'border-[oklch(0.539_0.254_282/0.45)]',
  primaryRing: 'ring-2 ring-[oklch(0.539_0.254_282/0.25)]',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  danger: 'border-red-200 bg-red-50 text-red-700',
  neutralBadge: 'border-[oklch(0.915_0.01_282)] bg-[oklch(0.965_0.01_282)] text-[oklch(0.45_0_0)]',
  mono: '[font-family:var(--font-geist-mono),ui-monospace,monospace]'
} as const

/** Raw colors for inline SVG and style props. */
export const LC = {
  primary: 'oklch(0.539 0.254 282)',
  primarySoft: 'oklch(0.539 0.254 282 / 0.18)',
  primaryGlow: 'oklch(0.539 0.254 282 / 0.35)',
  border: 'oklch(0.915 0.01 282)',
  wire: 'oklch(0.86 0.02 282)',
  muted: 'oklch(0.45 0 0)',
  fg: 'oklch(0.145 0 0)',
  card: '#ffffff',
  canvas: 'oklch(0.985 0 0)',
  danger: 'oklch(0.577 0.245 27.325)'
} as const

export const badgeBase =
  'inline-flex h-5 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md border px-1.5 text-xs font-medium leading-none'
