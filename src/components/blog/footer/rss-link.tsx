'use client'

import { i18n, Locale } from '@/i18n-config'
import { Rss } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RSSLink () {
  const pathname = usePathname()
  const [lang, setLang] = useState<Locale>(i18n.defaultLocale)

  useEffect(() => {
    const pathnameLang = pathname.startsWith('/es') ? 'es' : 'en'
    setLang(pathnameLang)
  }, [pathname])

  const href =
    lang !== i18n.defaultLocale ? `/${lang}/blog/rss.xml` : `/${lang}/blog/feed.xml`

  return (
    <Link
      href={href}
      className='ml-4'
      target='_blank'
      aria-label='Rss'
      rel='noopener'
    >
      <Rss className='h-6 w-6 text-slate-300 hover:text-white hover:scale-110' />
    </Link>
  )
}
