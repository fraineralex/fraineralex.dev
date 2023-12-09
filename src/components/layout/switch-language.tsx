'use client'

import { Locale, i18n } from '@/i18n-config'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function SwitchLanguage () {
  const pathname = usePathname()
  const [lang, setLang] = useState<Locale>(
    pathname.startsWith('/es') ? 'es' : 'en'
  )

  const newLang = lang === 'en' ? 'es' : 'en'

  return (
    <div className=' fixed right-10 top-5'>
      <Link
        href={`${lang === 'en' ? '/es' : '/'}`}
        className='p-2.5 text-white bg-gray-900 bg-opacity-80 hover:text-teal-300'
        onClick={() => {
          setLang(newLang)
        }}
      >
        {lang}
      </Link>
    </div>
  )
}
