'use client'
import Link from 'next/link'
import React, { useEffect, useRef, useState, lazy } from 'react'
const SearchPosts = lazy(() => import('../search/search-posts'))
import { usePathname } from 'next/navigation'
import { SwitchLanguage } from '@/components/layout/switch-language'
import { allPosts } from 'contentlayer/generated'

export const Navigation = () => {
  const pathname = usePathname()
  const [isBlogPage, setIsBlogPage] = useState(false)
  const [isContentPage, setIsContentPage] = useState(false)
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

  useEffect(() => {
    setIsBlogPage(pathname.includes('/blog'))
    const newIsContentPage = allPosts.filter(post =>
      pathname.includes(post.slug)
    )
    console.log(newIsContentPage.length)
    setIsContentPage(newIsContentPage.length > 0)
  }, [pathname])

  if (isContentPage) return

  return (
    <header ref={ref}>
      <div
        className={`fixed inset-x-0 top-0 z-50 backdrop-blur  duration-200 ${
          isIntersecting
            ? 'bg-zinc-900/0 border-transparent'
            : 'bg-zinc-900/500'
        }`}
      >
        <div className='container flex items-center justify-between p-6 mx-auto'>
          <div className='flex justify-between gap-5 pl-2'>
            {isBlogPage && <SearchPosts />}
            <SwitchLanguage />
          </div>
          <div className='inline-flex pr-5'>
            <Link
              href='/'
              className={`ms-5 font-sans${
                !isBlogPage
                  ? 'text-slate-300 underline underline-offset-8'
                  : 'hover:text-slate-100 hover:scale-105 duration-200'
              }`}
            >
              Portfolio
            </Link>
            <Link
              href='/blog'
              className={`ms-5 font-semibold ${
                isBlogPage
                  ? 'text-slate-300 underline underline-offset-8'
                  : 'hover:text-slate-100 hover:scale-105 duration-200'
              }`}
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navigation
