import type { ButtonHTMLAttributes, ReactNode } from 'react'

export const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--ring))]'

export const tk = {
  bg: 'bg-[hsl(var(--background))]',
  fg: 'text-[hsl(var(--foreground))]',
  muted: 'text-[hsl(var(--muted-foreground))]',
  border: 'border-[hsl(var(--border))]',
  card: 'border border-[hsl(var(--border))] bg-[hsl(var(--card))]',
  solid: 'bg-[hsl(var(--card))]',
  primary: 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow hover:bg-[hsl(var(--primary)/0.9)]',
  ghost: 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]',
  outline: 'border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm hover:bg-[hsl(var(--accent))]',
  active: 'bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]'
}

const sizes = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 rounded-md px-3 text-xs',
  icon: 'h-9 w-9'
}

const variants = {
  default: tk.primary,
  ghost: tk.ghost,
  outline: tk.outline
}

export function TkButton ({
  variant = 'default',
  size = 'default',
  className = '',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none ${sizes[size]} ${variants[variant]} ${focusRing} ${className}`}
      {...props}
    />
  )
}

export function TkCard ({ className = '', children }: { className?: string, children: ReactNode }) {
  return <div className={`rounded-lg ${tk.card} shadow-sm ${className}`}>{children}</div>
}

export function SrOnly ({ children }: { children: ReactNode }) {
  return <span className='sr-only'>{children}</span>
}
