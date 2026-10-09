'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Dumbbell, Github, Ham, House, Languages, Moon, NotepadText, Settings } from 'lucide-react'
import { copy, type Lang } from './copy'
import { PROFILE } from './data'
import { focusRing, tk, TkButton } from './ui'
import './scenes.css'
import { MacWindow } from '../kit/mac-window'

export type PageId = 'dashboard' | 'food' | 'exercise' | 'diary' | 'settings'

const PATHS: Record<PageId, string> = {
  dashboard: 'dashboard',
  food: 'food',
  exercise: 'exercise',
  diary: 'diary',
  settings: 'settings'
}

const NAV: { id: PageId, icon: typeof House }[] = [
  { id: 'dashboard', icon: House },
  { id: 'food', icon: Ham },
  { id: 'exercise', icon: Dumbbell },
  { id: 'diary', icon: NotepadText },
  { id: 'settings', icon: Settings }
]

function navLabel (id: PageId, lang: Lang) {
  const nav = copy[lang].nav
  return id === 'dashboard' ? nav.overview : nav[id]
}

function Header ({ lang, onLang }: { lang: Lang, onLang: (lang: Lang) => void }) {
  const text = copy[lang]
  const [langOpen, setLangOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [themeNote, setThemeNote] = useState('')
  const langRef = useRef<HTMLDivElement>(null)
  const themeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc (event: globalThis.MouseEvent) {
      if (!langRef.current?.contains(event.target as Node)) setLangOpen(false)
      if (!themeRef.current?.contains(event.target as Node)) setThemeOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <header className='flex items-center justify-between gap-2 px-3 pb-2 pt-4 sm:px-5 sm:pt-6'>
      <div className='flex min-w-0 items-center gap-2'>
        <p className='font-serif text-2xl font-bold tracking-tight text-[#22c55e] sm:text-3xl' style={{ fontFamily: 'Georgia, "Iowan Old Style", Palatino, serif' }}>
          trac<span className='text-[hsl(var(--foreground))]'>ky</span>
        </p>
        <span className='hidden rounded-full border border-[hsl(var(--border))] px-2.5 py-0.5 text-xs font-semibold sm:inline-flex'>{text.beta}</span>
      </div>
      <div className='flex items-center gap-1 sm:gap-2'>
        <a
          href='https://github.com/fraineralex/tracky'
          target='_blank'
          rel='noreferrer'
          aria-label={text.github}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${tk.ghost} ${focusRing}`}
        >
          <Github className='h-5 w-5' />
        </a>
        <div className='relative' ref={langRef}>
          <TkButton variant='ghost' size='icon' aria-label={text.switchLanguage} aria-expanded={langOpen} aria-haspopup='menu' onClick={() => { setLangOpen((open) => !open); setThemeOpen(false) }}>
            <Languages className='h-5 w-5' />
          </TkButton>
          {langOpen && (
            <div role='menu' aria-label={text.switchLanguage} className='absolute right-0 z-20 mt-1 w-36 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-lg'>
              {(['en', 'es'] as const).map((code) => (
                <button
                  key={code}
                  type='button'
                  role='menuitemradio'
                  aria-checked={lang === code}
                  className={`w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-[hsl(var(--accent))] ${focusRing} ${lang === code ? 'text-[#22c55e]' : ''}`}
                  onClick={() => { onLang(code); setLangOpen(false) }}
                >
                  {text.languages[code]}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className='relative' ref={themeRef}>
          <TkButton variant='ghost' size='icon' aria-label={text.toggleTheme} aria-expanded={themeOpen} aria-haspopup='menu' onClick={() => { setThemeOpen((open) => !open); setLangOpen(false) }}>
            <Moon className='h-5 w-5' />
          </TkButton>
          {themeOpen && (
            <div role='menu' aria-label={text.toggleTheme} className='absolute right-0 z-20 mt-1 w-32 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-lg'>
              {(['light', 'dark', 'system'] as const).map((theme) => (
                <button
                  key={theme}
                  type='button'
                  role='menuitemradio'
                  aria-checked={theme === 'light'}
                  className={`w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-[hsl(var(--accent))] ${focusRing} ${theme === 'light' ? 'text-[#22c55e]' : ''}`}
                  onClick={() => {
                    setThemeNote(theme === 'light' ? '' : text.themeNote)
                    setThemeOpen(false)
                  }}
                >
                  {text[theme]}
                </button>
              ))}
            </div>
          )}
        </div>
        <img src='/images/projects/viollet-user.webp' alt={PROFILE.name} className='h-7 w-7 rounded-full object-cover ring-1 ring-[hsl(var(--border))]' />
      </div>
      <p className='sr-only' aria-live='polite'>{themeNote}</p>
    </header>
  )
}

function SideNav ({ lang, page, onPage }: { lang: Lang, page: PageId, onPage: (page: PageId) => void }) {
  const text = copy[lang]
  return (
    <nav aria-label={text.navLabel} className={`shrink-0 border-b md:w-[180px] md:border-b-0 md:border-r md:pt-2 ${tk.border}`}>
      <div className='flex gap-1 overflow-x-auto px-2 py-2 md:flex-col md:overflow-visible md:px-3'>
        {NAV.map((item) => {
          const Icon = item.icon
          const active = page === item.id
          return (
            <button
              key={item.id}
              type='button'
              aria-current={active ? 'page' : undefined}
              onClick={() => onPage(item.id)}
              className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md px-2.5 text-sm transition-colors motion-reduce:transition-none md:justify-start ${focusRing} ${active ? tk.active : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]'}`}
            >
              <Icon className='h-5 w-5 md:h-4 md:w-4' aria-hidden='true' />
              <span className='sr-only sm:not-sr-only sm:text-xs md:text-sm'>{navLabel(item.id, lang)}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default function TrackyFrame ({
  lang,
  page,
  onPage,
  onLang,
  children,
  overlay
}: {
  lang: Lang
  page: PageId
  onPage: (page: PageId) => void
  onLang: (lang: Lang) => void
  children: ReactNode
  overlay?: ReactNode
}) {
  const text = copy[lang]
  return (
    <section aria-label={text.appLabel} className='w-full max-w-full'>
      <MacWindow url={`tracky.fit/${PATHS[page]}`}>
      <div className={`tracky-light ${tk.bg} ${tk.fg}`}>
      <div className='relative flex h-[640px] max-h-[85vh] min-h-[520px] flex-col sm:h-[700px]'>
        <Header lang={lang} onLang={onLang} />
        <div className='flex min-h-0 flex-1 flex-col md:flex-row'>
          <SideNav lang={lang} page={page} onPage={onPage} />
          <div className='min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 sm:px-4 md:px-5'>
            {children}
          </div>
        </div>
        <p className={`border-t px-3 py-1.5 text-[10px] leading-snug ${tk.border} ${tk.muted}`}>{text.sampleCaption}</p>
        {overlay}
      </div>
      </div>
      </MacWindow>
    </section>
  )
}
