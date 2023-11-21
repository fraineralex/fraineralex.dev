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
      className="absolute before:h-[300px] before:w-[480px] before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[800px] after:w-[800px] after:rounded-full after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[400px] z-[-1]"
        style={{
        opacity: 0.2,
        pointerEvents: 'none',
        transform: `translate(${position.x - 560}px, ${position.y - 300}px)`
      }}
    ></div>
  )
}
