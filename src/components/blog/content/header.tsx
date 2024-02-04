'use client'
import { Eye } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { SearchPosts } from '../search/search-posts'
import { ProfileLink } from '../nav/profile-link'

type Props = {
  views: number
}
export const Header: React.FC<Props> = ({ views }) => {
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
            ? 'bg-zinc-900/0 border-transparent'
            : 'bg-white/10  border-zinc-200 lg:border-transparent'
        }`}
      >
        <div className='container flex flex-row-reverse items-center justify-between p-6 mx-auto'>
          <div className='flex justify-between gap-6 pr-2'>
            <span
              title='View counter for this page'
              className={`duration-200 hover:font-medium flex items-center gap-1 ${
                isIntersecting
                  ? ' text-zinc-400 hover:text-zinc-100'
                  : 'text-zinc-600 hover:text-zinc-400'
              } `}
            >
              <Eye className='w-5 h-5' />{' '}
              {Intl.NumberFormat('en-US', { notation: 'compact' }).format(
                views
              )}
            </span>
            <SearchPosts
              className={`w-6 h-6 duration-200 hover:font-medium ${
                isIntersecting
                  ? ' text-zinc-400 hover:text-zinc-100'
                  : 'text-zinc-600 hover:text-zinc-400'
              } `}
            />
          </div>
          <ProfileLink
            className={
              isIntersecting ? '' : 'text-zinc-600 hover:text-zinc-400'
            }
          />
        </div>
      </div>
    </header>
  )
}

export default Header
