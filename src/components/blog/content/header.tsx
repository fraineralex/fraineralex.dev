'use client'
import React, { useEffect, useRef, useState } from 'react'
import { SearchPosts } from '../search/search-posts'
import { ProfileLink } from '../nav/profile-link'
import SwitchLanguage from '@/components/layout/switch-language'
import { Locale } from '@/i18n-config'

type Props = {
  viewsSlot: React.ReactNode
  lang: Locale
}

export const Header: React.FC<Props> = ({ viewsSlot, lang }) => {
  const ref = useRef<HTMLElement>(null)
  const [isIntersecting, setIntersecting] = useState(true)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <header
      ref={ref}
      className='relative isolate z-50 overflow-hidden bg-gradient-to-tl from-black via-zinc-900 to-black'
    >
      <div
        className={`fixed inset-x-0 top-0 z-50 backdrop-blur lg:backdrop-blur-none duration-200 border-b lg:bg-transparent ${
          isIntersecting
            ? 'bg-zinc-900/0 border-transparent text-zinc-300'
            : 'bg-slate-700/40  border-zinc-200 lg:border-transparent text-zinc-400'
        }`}
      >
        <div className='container flex items-center justify-between p-6 mx-auto'>
          <ProfileLink
            lang={lang}
            className={
              isIntersecting
                ? ''
                : 'md:text-zinc-600 md:hover:text-zinc-400 text-zinc-400 hover:text-zinc-200'
            }
          />
          <div className='flex justify-between gap-3 md:gap-6 pr-2'>
            <SwitchLanguage />
            <div
              className={`duration-200 hover:font-medium flex items-center gap-1 ${
                isIntersecting
                  ? ' text-zinc-400 hover:text-zinc-100'
                  : 'md:text-zinc-600 md:hover:text-zinc-400 text-zinc-400 hover:text-zinc-200'
              } `}
            >
              {viewsSlot}
            </div>
            <SearchPosts
              className={`w-6 h-6 duration-200 hover:font-medium ${
                isIntersecting
                  ? ' text-zinc-400 hover:text-zinc-100'
                  : 'md:text-zinc-600 md:hover:text-zinc-400 text-zinc-400 hover:text-zinc-200'
              } `}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
