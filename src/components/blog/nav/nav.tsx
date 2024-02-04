'use client'
import Link from 'next/link'
import React, { useEffect, useRef, useState, lazy, Suspense } from 'react'
const SearchPosts = lazy(() => import('../search/search-posts'))
import { usePathname } from 'next/navigation'
const SwitchLanguage = lazy(() => import('@/components/layout/switch-language'))
import { allPosts } from 'contentlayer/generated'
import { Search } from 'lucide-react'

export const Navigation = () => {
  const pathname = usePathname()
  const [isBlogPage, setIsBlogPage] = useState<null | boolean>(null)
  const [isContentPage, setIsContentPage] = useState<null | boolean>(null)
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
    setIsContentPage(newIsContentPage.length > 0)
  }, [pathname])

  return (
    <>
      {isContentPage === false && (
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
                {isBlogPage && (
                  <Suspense
                    fallback={
                      <Search className='h-6 w-6 text-slate-400 hover:text-slate-100 hover:scale-110' />
                    }
                  >
                    <SearchPosts />
                  </Suspense>
                )}
                <SwitchLanguage />
              </div>
              <div className='inline-flex pr-5'>
                <Link
                  href='/'
                  className={`ms-5 font-sans${
                    isBlogPage === false
                      ? 'text-slate-300 underline underline-offset-8'
                      : 'hover:text-slate-100 hover:scale-105 duration-200'
                  }`}
                >
                  Portfolio
                </Link>
                <Link
                  href='/blog'
                  className={`ms-5 font-semibold ${
                    isBlogPage === true
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
      )}
    </>
  )
}

export default Navigation
