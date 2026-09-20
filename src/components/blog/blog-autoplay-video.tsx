'use client'

import { useEffect, useRef } from 'react'

type BlogAutoplayVideoProps = React.VideoHTMLAttributes<HTMLVideoElement>

export default function BlogAutoplayVideo (props: BlogAutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const inViewRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const tryPlay = () => {
      if (!inViewRef.current) return
      if (document.visibilityState !== 'visible') return
      video.muted = true
      const result = video.play()
      if (result && typeof result.catch === 'function') {
        result.catch(() => {})
      }
    }

    const pauseVideo = () => {
      if (!video.paused) {
        video.pause()
      }
    }

    const updatePlaybackByViewport = () => {
      const rect = video.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0))
      const visibleRatio = rect.height > 0 ? visibleHeight / rect.height : 0

      inViewRef.current = visibleRatio >= 0.5
      if (inViewRef.current) {
        tryPlay()
      } else {
        pauseVideo()
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        inViewRef.current = entry.isIntersecting && entry.intersectionRatio >= 0.35
        if (inViewRef.current) {
          tryPlay()
        } else {
          pauseVideo()
        }
      },
      { threshold: [0, 0.2, 0.35, 0.6, 1] }
    )

    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') {
        pauseVideo()
      } else {
        tryPlay()
      }
    }

    const handleTimeUpdate = () => {
      if (!inViewRef.current) {
        pauseVideo()
      }
    }

    video.addEventListener('loadeddata', tryPlay)
    video.addEventListener('canplay', tryPlay)
    video.addEventListener('timeupdate', handleTimeUpdate)
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('scroll', updatePlaybackByViewport, { passive: true })
    window.addEventListener('resize', updatePlaybackByViewport)
    observer.observe(video)
    updatePlaybackByViewport()
    const intervalId = window.setInterval(updatePlaybackByViewport, 300)

    return () => {
      observer.disconnect()
      video.removeEventListener('loadeddata', tryPlay)
      video.removeEventListener('canplay', tryPlay)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('scroll', updatePlaybackByViewport)
      window.removeEventListener('resize', updatePlaybackByViewport)
      window.clearInterval(intervalId)
      pauseVideo()
    }
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
