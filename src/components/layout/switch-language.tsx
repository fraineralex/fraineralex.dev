'use client'
import { ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Locale } from '@/i18n-config'
import Link from 'next/link'
import { SpainFlag, UsaFlag } from '../common/SvgIcons'

type langType = {
  current: {
    name: string
    flag: JSX.Element
    locale: Locale
  }
  new: {
    name: string
    flag: JSX.Element
    locale: Locale
  }
}

export function SwitchLanguage () {
  const pathname = usePathname()
  const [currentLocale, setCurrentLocale] = useState<Locale>(
    pathname.startsWith('/es') ? 'es' : 'en'
  )
  const [lang, setLang] = useState<langType>()

  useEffect(() => {
    const newCurrentLocale = pathname.startsWith('/es') ? 'es' : 'en'
    setCurrentLocale(newCurrentLocale)
    setLang({
      current: {
        name: newCurrentLocale === 'es' ? 'Español' : 'English',
        flag:
          newCurrentLocale === 'es' ? (
            <SpainFlag className='w-4 h-auto' />
          ) : (
            <UsaFlag className='w-4 h-auto' />
          ),
        locale: newCurrentLocale
      },
      new: {
        name: newCurrentLocale === 'es' ? 'English' : 'Español',
        flag:
          newCurrentLocale === 'es' ? (
            <UsaFlag className='w-4 h-auto' />
          ) : (
            <SpainFlag className='w-4 h-auto' />
          ),
        locale: newCurrentLocale === 'es' ? 'en' : 'es'
      }
    })
  }, [pathname])

  let newpath = `/es${pathname}`

  if (currentLocale === 'es') {
    newpath = pathname.replace('/es', '/en')
  }

  if (pathname.startsWith('/es/')) {
    newpath = pathname.replace('/es/', '/en/')
  }

  return (
    <div className='relative -mt-1 -mb-3 text-left duration-200'>
      <div className='group rounded-md text-xs font-semibold md:bg-black/30 hover:bg-black/70 transition-all'>
        <button
          type='button'
          className='inline-flex justify-start items-center w-full gap-x-2 px-3 py-2 font-semibold'
          aria-expanded='true'
          aria-haspopup='true'
        >
          {lang?.current.flag}
          <span className='hidden md:inline'>{lang?.current.name}</span>
          <span className='inline md:hidden uppercase'>
            {lang?.current.locale}
          </span>
          <ChevronDown className='-mr-1 h-5 w-5' />
        </button>
        <ul className='group-hover:block group-hover:animate-fade-down group-hover:animate-duration-200 hidden pt-0.5 absolute w-full'>
          <li className='py-[2px]'>
            <Link
              className='rounded-md bg-black/30 hover:bg-black/70 whitespace-no-wrap inline-flex justify-start items-center w-full gap-x-2 px-3 py-2 text-zinc-300'
              href={newpath}
            >
              {lang?.new.flag}
              <span className='hidden md:inline'>{lang?.new.name}</span>
              <span className='inline md:hidden uppercase'>
                {lang?.new.locale}
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default SwitchLanguage
