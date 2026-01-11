'use client'
import Link from 'next/link'
import React, { useEffect, useRef, useState, lazy, Suspense } from 'react'
const SearchPosts = lazy(() => import('../search/search-posts'))
import { usePathname } from 'next/navigation'
const SwitchLanguage = lazy(() => import('@/components/layout/switch-language'))
import { Search } from 'lucide-react'

export const Navigation = () => {
  const pathname = usePathname()
  const [isBlogPage, setIsBlogPage] = useState<null | boolean>(null)
  const ref = useRef<HTMLElement>(null)
  const [isIntersecting, setIntersecting] = useState(true)

  const [locale, setLocale] = useState(
    pathname.startsWith('/es') ? '/es/' : '/en/'
  )

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const isBlog = pathname.includes('/blog') || pathname === '/blog'
    setIsBlogPage(isBlog)
    setLocale(pathname.startsWith('/es') ? '/es/' : '/en/')
    
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
      setIntersecting(true)
    }
  }, [pathname])

  const isBlogPostRoute = /^(\/(?:en|es))?\/blog\/(?!tags(?:\/|$))[^/]+\/?$/.test(pathname)
  if (isBlogPostRoute) return null

  return (
    <>
        <header ref={ref}>
          <div
            className={`fixed inset-x-0 top-0 z-50 backdrop-blur duration-200 animate-fade-in-down animate-duration-slower ${
              isIntersecting
                ? 'bg-zinc-900/0 border-transparent'
                : 'bg-zinc-900/50'
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
                  href={`${locale}`}
                  className={`ms-5 font-medium ${
                    isBlogPage === false
                      ? 'text-slate-100 underline underline-offset-8'
                      : 'hover:text-slate-100 hover:scale-105 duration-200'
                  }`}
                >
                  Portfolio
                </Link>
                <Link
                  href={`${locale}blog`}
                  className={`ms-5 font-medium ${
                    isBlogPage === true
                      ? 'text-slate-100 underline underline-offset-8'
                      : 'hover:text-slate-100 hover:scale-105 duration-200'
                  }`}
                >
                  Blog
                </Link>
              </div>
            </div>
          </div>
        </header>
    </>
  )
}

export default Navigation
