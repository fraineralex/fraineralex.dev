'use client'

import { useEffect, useRef, useState, type ReactNode, type ElementType } from 'react'

interface Props {
  children: ReactNode
  as?: ElementType
  className?: string
  delay?: number
}

/** Fades content in once when it scrolls into view. Shows immediately with reduced motion or without JS. */
export default function Reveal ({ children, as: Tag = 'div', className = '', delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [state, setState] = useState<'idle' | 'hidden' | 'shown'>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.9) return
    setState('hidden')
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setState('shown')
        io.disconnect()
      }
    }, { rootMargin: '0px 0px -12% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`${className} transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${state === 'hidden' ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
