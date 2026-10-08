import type { ButtonHTMLAttributes, ReactNode } from 'react'

export const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(212.7_26.8%_83.9%)]'

export const tk = {
  bg: 'bg-[hsl(223_13%_10%)]',
  fg: 'text-[hsl(210_40%_98%)]',
  muted: 'text-[hsl(215_20.2%_65.1%)]',
  border: 'border-[hsl(217.2_32.6%_17.5%)]',
  card: 'border border-[hsl(217.2_32.6%_17.5%)] bg-[rgb(30_41_59/0.5)]',
  solid: 'bg-[hsl(222.2_84%_4.9%)]',
  primary: 'bg-[hsl(210_40%_98%)] text-[hsl(222.2_47.4%_11.2%)] shadow hover:bg-[hsl(210_40%_98%/0.9)]',
  ghost: 'text-[hsl(210_40%_98%)] hover:bg-[hsl(217.2_32.6%_17.5%)]',
  outline: 'border border-[hsl(217.2_32.6%_17.5%)] bg-[hsl(223_13%_10%)] text-[hsl(210_40%_98%)] shadow-sm hover:bg-[hsl(217.2_32.6%_17.5%)]',
  active: 'bg-[hsl(217.2_32.6%_17.5%)] text-[hsl(210_40%_98%)]'
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
