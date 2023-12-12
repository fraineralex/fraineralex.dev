'use client'

import { Locale } from '@/i18n-config'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import FormControlLabel from '@mui/material/FormControlLabel'
import { SpainFlag, UsaFlag } from '../common/SvgIcons'
import { MaterialUISwitch } from './switch'

export default function SwitchLanguage () {
  const pathname = usePathname()
  const [lang, setLang] = useState<Locale>(
    pathname.startsWith('/es') ? 'es' : 'en'
  )

  const handleSetLanguage = () => {
    const newLang = lang === 'en' ? 'es' : 'en'
    setLang(newLang)
  }

  let newpath = `/es${pathname}`

  if (lang === 'es') {
    newpath = pathname.replace('/es', '/')
  }

  if (pathname.startsWith('/es/')) {
    newpath = pathname.replace('/es/', '/')
  }

  const ariaLabel =
    lang === 'en' ? 'Traducir a español' : 'Translate to english'

  return (
    <header className='absolute md:fixed right-4 md:right-10 top-1 md:top-5 z-50'>
      <SpainFlag className='inline' />
      <Link href={newpath}>
        <FormControlLabel
          control={<MaterialUISwitch sx={{ m: 1 }} checked={lang === 'en'} />}
          label=''
          className='inline pl-2'
          aria-label={ariaLabel}
          onClick={handleSetLanguage}
        />
      </Link>
      <UsaFlag className='inline -ml-5' />
    </header>
  )
}
