'use client'

import { useEffect, useRef } from 'react'

type BlogAutoplayVideoProps = React.VideoHTMLAttributes<HTMLVideoElement>

export default function BlogAutoplayVideo (props: BlogAutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.isIntersecting) {
          const result = video.play()
          if (result && typeof result.catch === 'function') {
            result.catch(() => {})
          }
          return
        }
        video.pause()
      },
      { threshold: 0.55 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={videoRef}
      {...props}
      controls
      loop
      muted
      playsInline
      preload={props.preload ?? 'metadata'}
    />
  )
}
