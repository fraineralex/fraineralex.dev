'use client'

import { useEffect, useRef, useState } from 'react'

type BlogAutoplayVideoProps = React.VideoHTMLAttributes<HTMLVideoElement>

export default function BlogAutoplayVideo (props: BlogAutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canAutoplayRef = useRef(false)
  const [needsTap, setNeedsTap] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const getVisibilityRatio = () => {
      const rect = video.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0))
      return rect.height > 0 ? visibleHeight / rect.height : 0
    }

    const shouldPlayInViewport = () => getVisibilityRatio() >= 0.2

    const tryPlay = () => {
      if (!canAutoplayRef.current) return
      if (document.visibilityState !== 'visible') return
      video.muted = true
      const result = video.play()
      if (result && typeof result.catch === 'function') {
        result
          .then(() => setNeedsTap(false))
          .catch(() => setNeedsTap(true))
      } else {
        setNeedsTap(false)
      }
    }

    const pauseVideo = () => {
      if (!video.paused) {
        video.pause()
      }
    }

    const syncPlayback = () => {
      canAutoplayRef.current = shouldPlayInViewport()
      if (canAutoplayRef.current) {
        tryPlay()
      } else {
        pauseVideo()
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        canAutoplayRef.current = entry.isIntersecting && entry.intersectionRatio >= 0.2
        syncPlayback()
      },
      { threshold: [0, 0.1, 0.2, 0.5, 1], rootMargin: '0px 0px -5% 0px' }
    )

    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') {
        pauseVideo()
      } else {
        syncPlayback()
      }
    }

    const handlePageShow = () => {
      syncPlayback()
    }

    const handleTimeUpdate = () => {
      if (!shouldPlayInViewport()) {
        canAutoplayRef.current = false
        pauseVideo()
      }
    }

    const handlePlay = () => {
      setNeedsTap(false)
      setHasStarted(true)
    }

    video.addEventListener('loadeddata', tryPlay)
    video.addEventListener('canplay', tryPlay)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('playing', handlePlay)
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('pageshow', handlePageShow)
    window.addEventListener('scroll', syncPlayback, { passive: true })
    window.addEventListener('resize', syncPlayback)
    observer.observe(video)
    syncPlayback()
    const intervalId = window.setInterval(syncPlayback, 250)

    return () => {
      observer.disconnect()
      video.removeEventListener('loadeddata', tryPlay)
      video.removeEventListener('canplay', tryPlay)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('playing', handlePlay)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('pageshow', handlePageShow)
      window.removeEventListener('scroll', syncPlayback)
      window.removeEventListener('resize', syncPlayback)
      window.clearInterval(intervalId)
      pauseVideo()
    }
  }, [])

  return (
    <div className='relative'>
      <video
        ref={videoRef}
        {...props}
        autoPlay
        controls
        loop
        muted
        playsInline
        preload={props.preload ?? 'metadata'}
        {...({ 'webkit-playsinline': 'true' } as Record<string, string>)}
      />
      {(needsTap || !hasStarted) && (
        <button
          type='button'
          onClick={() => {
            const video = videoRef.current
            if (!video) return
            video.muted = true
            const result = video.play()
            if (result && typeof result.catch === 'function') {
              result
                .then(() => setNeedsTap(false))
                .catch(() => setNeedsTap(true))
            } else {
              setNeedsTap(false)
            }
          }}
          className='absolute inset-0 flex items-center justify-center rounded-xl bg-zinc-950/50 text-sm font-semibold text-zinc-100 backdrop-blur-sm'
          aria-label='Play demo video'
        >
          Tap to play demo
        </button>
      )}
    </div>
  )
}
