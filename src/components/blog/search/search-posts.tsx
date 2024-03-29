'use client'

import React, { useState, lazy } from 'react'
import { Search } from 'lucide-react'
const SearchResult = lazy(() => import('./search-result'))
const Modal = lazy(() => import('@/components/blog/common/modal'))
import { displayTags } from '@/utils/data'
import Link from 'next/link'
import { i18n } from '@/i18n-config'
import { usePathname } from 'next/navigation'

export function SearchPosts ({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const pathname = usePathname()
  const lang = pathname.startsWith('/es') ? 'es' : i18n.defaultLocale

  return (
    <>
      <button
        aria-label='Search article'
        title='Search article'
        type='button'
        onClick={() => setOpen(!open)}
      >
        <Search
          className={`${
            className ||
            'h-6 w-6 text-slate-400 hover:text-slate-100 hover:scale-110'
          }`}
        />
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className='fixed left-0 right-0 top-0 z-50 mx-2 mt-32 max-w-[1200px] flex-col items-center overflow-hidden rounded-2xl p-6 shadow-md border border-slate-700 bg-slate-800 md:mx-8 lg:mx-auto lg:w-3/4 xl:w-2/3 md:max-h-50 max-h-132 flex'>
          <div className='relative mb-2 w-full md:mb-4'>
            <input
              autoFocus
              type='text'
              className='w-full placeholder-slate-500 bg-transparent border outline-none disabled:bg-slate-50 text-white border-slate-400 focus:bg-slate-900/50 focus:border-slate-300  focus:border-2 rounded-full px-6 py-3'
              placeholder='Start typing to search'
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {!searchTerm && (
            <small className='mb-4 text-slate-400 md:flex flex-col md:flex-row text-center hidden'>
              <div className='flex flex-wrap'>
                {displayTags &&
                  displayTags.map((tag, index) => (
                    <div key={index}>
                      <Link
                        href={`/${lang}/tags/${tag.name}`}
                        className='text-teal-300 font-bold underline uppercase underline-offset-4 py-3 px-1 hover:text-pink-400'
                      >
                        {tag.label}
                      </Link>
                      {index !== (displayTags?.length ?? 0) - 1 && (
                        <span className='px-1'>•</span>
                      )}
                    </div>
                  ))}
              </div>
            </small>
          )}
          <div className='relative w-full'>
            {!searchTerm && (
              <div className='my-4 flex flex-row items-center justify-center text-slate-300'>
                <Search className='h-5 w-5 me-2' />
                <h2 id='radix-:rh:' className='font-normal'>
                  Search articles from this blog
                </h2>
              </div>
            )}
          </div>
          {searchTerm && <SearchResult searchTerm={searchTerm} lang={lang} />}
        </div>
      </Modal>
    </>
  )
}

export default SearchPosts
