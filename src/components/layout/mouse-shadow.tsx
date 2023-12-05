'use client'

import { PointerEvent, useEffect, useState } from 'react'

export function MouseShadow () {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      const { clientX, clientY } = event
      setPosition({ x: clientX, y: clientY })
    }

    window.addEventListener('pointermove', handleMove)

    return () => {
      window.removeEventListener('pointermove', handleMove)
    }
  })
  return (
    <div
      className='pointer-events-none fixed inset-0 z-30 transition duration-300'
      style={{
        background: `radial-gradient(600px at ${position.x}px ${position.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
      }}
    ></div>
  )
}
