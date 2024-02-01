'use client'
import {
  motion,
  useMotionTemplate,
  useSpring
} from 'framer-motion'

import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export const Card = ({ className, children }: Props) => {
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 })
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 })

  function onMouseMove ({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }
  const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`
  const style = { maskImage, WebkitMaskImage: maskImage }

  return (
    <div
      onMouseMove={onMouseMove}
      className={`overflow-hidden relative duration-700 ${className}`}
    >
      <div className='pointer-events-none'>
        <div className='absolute inset-0 z-0  transition duration-1000 [mask-image:linear-gradient(black,transparent)]' />
        <motion.div
          className='absolute inset-0 z-10 transition duration-1000 group-hover:opacity-50 '
          style={style}
        />
        <motion.div
          className='absolute inset-0 z-10 opacity-0 mix-blend-overlay transition duration-1000 group-hover:opacity-100'
          style={style}
        />
      </div>

      {children}
    </div>
  )
}
