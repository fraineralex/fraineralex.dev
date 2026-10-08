'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n-config'
import type { ViolletAppCopy } from '@/types/case-study-types'
import { focusRing } from './ui'

const TEXT = {
  en: {
    load: 'Start the interactive preview',
    reduced: 'Motion is reduced on your device, so the preview waits for you. It plays a short guided demo once it starts.',
    hint: 'This is the same app simulation that runs on the viollet.app landing page. Click around: the sidebar, filters, charts and inbox all respond.'
  },
  es: {
    load: 'Iniciar la vista interactiva',
    reduced: 'Tu dispositivo tiene el movimiento reducido, así que la vista espera por ti. Al iniciar, reproduce una demo guiada corta.',
    hint: 'Es la misma simulación de la app que corre en la landing de viollet.app. Explora: el menú, los filtros, las gráficas y el inbox responden.'
  }
}

export default function AppEmbed ({ copy, lang }: { copy: ViolletAppCopy; lang: Locale }) {
  const t = TEXT[lang] ?? TEXT.en
  const wrapRef = useRef<HTMLDivElement>(null)
  const [reduced, setReduced] = useState(false)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    if (mq.matches) return
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setLoad(true)
        io.disconnect()
      }
    }, { rootMargin: '200px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <figure className='relative'>
      <div aria-hidden='true' className='pointer-events-none absolute -inset-x-6 -top-10 bottom-10 -z-10 rounded-[2.5rem] bg-[radial-gradient(60%_60%_at_50%_30%,rgba(139,92,246,0.45),transparent_70%)] blur-2xl' />
      <div
        ref={wrapRef}
        className='relative h-[640px] overflow-hidden rounded-2xl bg-[#0b0712] shadow-[0_30px_80px_-20px_rgba(76,29,149,0.65)] ring-1 ring-violet-300/25 sm:h-[600px] lg:h-[680px]'
      >
        {load ? (
          <iframe
            src={`/embeds/viollet-app/index.html`}
            title={copy.frameLabel}
            className='h-full w-full border-0'
            loading='lazy'
          />
        ) : (
          <div className='relative h-full w-full'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='/images/projects/viollet-app-poster.webp' alt='' className='h-full w-full object-cover object-left-top opacity-60' />
            <div className='absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-t from-[#0b0712] via-[#0b0712]/60 to-transparent p-6 text-center'>
              <button
                type='button'
                onClick={() => setLoad(true)}
                className={`inline-flex h-11 items-center justify-center rounded-full bg-violet-500 px-5 text-sm font-semibold leading-none text-white shadow-lg shadow-violet-900/50 transition hover:bg-violet-400 motion-reduce:transition-none ${focusRing}`}
              >
                {t.load}
              </button>
              {reduced && <p className='max-w-sm text-xs text-violet-100/80'>{t.reduced}</p>}
            </div>
          </div>
        )}
      </div>
      <figcaption className='mt-3 text-sm leading-relaxed text-slate-400'>
        {t.hint} <span className='text-slate-500'>{copy.simulationNote}</span>
      </figcaption>
    </figure>
  )
}
