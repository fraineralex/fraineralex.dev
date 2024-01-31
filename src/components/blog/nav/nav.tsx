'use client'
import Link from 'next/link'
import React, { useEffect, useRef, useState, lazy } from 'react'
const SearchPosts = lazy(() => import('../search/search-posts'))
import { ProfileLink } from './profile-link'
import { Mails } from 'lucide-react'

export const Navigation: React.FC = () => {
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
    <header ref={ref}>
      <div
        className={`fixed inset-x-0 top-0 z-50 backdrop-blur  duration-200 border-b  ${
          isIntersecting
            ? 'bg-zinc-900/0 border-transparent'
            : 'bg-zinc-900/500  border-zinc-800 '
        }`}
      >
        <div className='container flex flex-row-reverse items-center justify-between p-6 mx-auto'>
          <div className='flex justify-between gap-8 pr-5'>
            <SearchPosts />
            <Link
              href='https://fraineralex.substack.com/'
              className=' text-slate-400 hover:text-slate-100 hover:scale-110'
              title='Newslatter'
            >
              <Mails
                className='h-6 w-6'
                aria-label='Go to newslatter'
                xlinkTitle='Newslatter'
              />
            </Link>
          </div>

          {/* <Link
            href='/'
            className='duration-200 text-zinc-300 hover:text-zinc-100'
          >
            <ArrowLeft className='w-6 h-6 ' />
          </Link> */}
          <ProfileLink />
        </div>
      </div>
    </header>
  )
}

export default Navigation
