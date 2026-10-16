'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { FiExternalLink } from 'react-icons/fi'
import type { Locale } from '@/i18n-config'
import { geist, geistMono } from '../kit/fonts'
import { L } from './light'

const POST_URL = 'https://x.com/fraineralex/status/2086889796979327442'
const POSTER_SRC = '/case-studies/viollet/video/viollet-promo-poster.webp'
const WEBM_SRC = '/case-studies/viollet/video/viollet-promo.webm'
const MP4_SRC = '/case-studies/viollet/video/viollet-promo.mp4'

const TEXT = {
  en: {
    heading: 'See it in real use',
    postLink: 'Watch the post on X',
    label: 'Promo video of Viollet turning bank email alerts into categorized spending'
  },
  es: {
    heading: 'Así se ve en uso real',
    postLink: 'Ver la publicación en X',
    label: 'Video promocional de Viollet convirtiendo avisos bancarios por correo en gasto categorizado'
  }
}

export default function PromoVideo ({ lang }: { lang: Locale }) {
  const t = TEXT[lang] ?? TEXT.en
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reduced, setReduced] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduced) return
    const root = wrapRef.current
    const video = videoRef.current
    if (!root || !video || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.intersectionRatio >= 0.25) {
          video.muted = true
          void video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: [0, 0.25, 0.5, 1] }
    )
    io.observe(root)
    return () => {
      io.disconnect()
      video.pause()
    }
  }, [reduced])

  return (
    <section className='mt-8 min-w-0 w-full' aria-labelledby='viollet-promo-heading'>
      <div className='mb-3 flex flex-wrap items-center gap-x-4'>
        <h3
          id='viollet-promo-heading'
          className='text-base font-semibold tracking-tight text-slate-100'
        >
          {t.heading}
        </h3>
        <Link
          href={POST_URL}
          target='_blank'
          rel='noopener'
          className='inline-flex min-h-11 min-w-11 max-w-full items-center gap-1.5 px-1 py-3 text-sm font-medium text-teal-200/90 underline decoration-teal-400/40 underline-offset-4 transition hover:text-teal-100 hover:decoration-teal-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300'
        >
          <span className='min-w-0 break-words'>{t.postLink}</span>
          <FiExternalLink className='h-3.5 w-3.5 shrink-0' aria-hidden='true' />
        </Link>
      </div>
      <div
        className={`${geist.variable} ${geistMono.variable} ${L.surface} overflow-hidden rounded-xl border border-white/10 bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]`}
      >
        <div
          className={`flex h-8 items-center gap-2 border-b ${L.border} bg-white px-3`}
          aria-hidden='true'
        >
          <span className='flex gap-1'>
            <span className='size-2 rounded-full bg-[#ff5f57]' />
            <span className='size-2 rounded-full bg-[#febc2e]' />
            <span className='size-2 rounded-full bg-[#28c840]' />
          </span>
          <span className={`mx-auto truncate rounded-md ${L.secondary} px-3 py-0.5 text-[11px] ${L.muted}`}>
            viollet.app
          </span>
        </div>
        <div
          ref={wrapRef}
          className='relative w-full overflow-hidden bg-white'
          style={{ aspectRatio: '16 / 9' }}
        >
          {reduced ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={POSTER_SRC}
              alt={t.label}
              width={1280}
              height={720}
              className='absolute inset-0 h-full w-full object-cover'
            />
          ) : (
            <video
              ref={videoRef}
              muted
              autoPlay
              loop
              playsInline
              preload='metadata'
              poster={POSTER_SRC}
              aria-label={t.label}
              className='absolute inset-0 h-full w-full object-cover'
            >
              <source src={WEBM_SRC} type='video/webm' />
              <source src={MP4_SRC} type='video/mp4' />
            </video>
          )}
        </div>
      </div>
    </section>
  )
}
