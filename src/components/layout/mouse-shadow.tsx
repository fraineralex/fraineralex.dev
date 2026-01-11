'use client'

import { useEffect, useRef, useCallback } from 'react'

export function MouseShadow () {
  const rafRef = useRef<number | null>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const elementRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.style.background = `radial-gradient(600px at ${positionRef.current.x}px ${positionRef.current.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
    }
    rafRef.current = null
  }, [])

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      positionRef.current = { x: event.clientX, y: event.clientY }
      
      // Throttle updates with requestAnimationFrame
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updatePosition)
      }
    }

    window.addEventListener('pointermove', handleMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handleMove)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [updatePosition])

  return (
    <div
      ref={elementRef}
      className='pointer-events-none fixed inset-0 z-1 will-change-[background]'
    />
  )
}
