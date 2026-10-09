'use client'

import { ArrowLeftRight, Check, CreditCard, Landmark, Mail, Search } from 'lucide-react'
import type { ViolletBanksCopy } from '@/types/case-study-types'
import { span, typed, useSceneTimeline } from '../kit/scene'
import { L, LC } from './light'
import { INSTITUTIONS } from './sample-ledger'
import { AppSurface, InteractivePanel } from './ui'

type Filter = 'all' | 'confirmed' | 'listed'
type Institution = (typeof INSTITUTIONS)[number]

const BANK_BRANDS = {
  banreservas: { file: 'banreservas.svg', color: '#264E72' },
  popular: { file: 'popular.svg', color: '#001638' },
  bhd: { file: 'bhd.svg', color: '#50BA3F' },
  lafise: { file: 'lafise.svg', color: '#00583C' },
  qik: { file: 'qik.svg', color: '#0082CD' },
  santa_cruz: { file: 'santa_cruz.avif', color: '#0961AD' },
  apap: { file: 'apap.svg', color: '#205BA8' },
  scotiabank: { file: 'scotiabank_do.avif', color: '#EC0712' },
  promerica: { file: 'promerica.svg', color: '#0961AD' },
  caribe: { file: 'caribe.svg', color: '#1B765A' },
  banesco: { file: 'banesco_do.svg', color: '#003B71' }
} satisfies Record<Institution['id'], { file: string; color: string }>

export default function BankCoverage ({ copy, lang }: { copy: ViolletBanksCopy, lang: 'es' | 'en' }) {
  void lang
  const timeline = useSceneTimeline(11000, { loop: true, hold: 3200 })
  const { elapsed } = timeline
  const query = elapsed < 4000
    ? typed(INSTITUTIONS[0].name, span(elapsed, 700, 2200))
    : ''
  const filter: Filter = elapsed < 4600 ? 'all' : elapsed < 6500 ? 'confirmed' : elapsed < 8500 ? 'listed' : 'confirmed'
  const filters: Array<{ id: Filter; label: string }> = [
    { id: 'all', label: copy.all },
    { id: 'confirmed', label: copy.confirmed },
    { id: 'listed', label: copy.listed }
  ]
  const tracks = [
    { icon: CreditCard, label: copy.tracksCards },
    { icon: Landmark, label: copy.tracksAccounts },
    { icon: ArrowLeftRight, label: copy.transfers }
  ]
  const matches = (item: Institution) => (
    (filter === 'all' || (filter === 'confirmed' ? item.confirmed : !item.confirmed)) &&
    (!query || item.name.toLowerCase().includes(query.toLowerCase()) || item.sender.toLowerCase().includes(query.toLowerCase()))
  )
  const resultCount = INSTITUTIONS.filter(matches).length

  return (
    <InteractivePanel label={copy.title} title={copy.title} description={copy.description} timeline={timeline}>
      <AppSurface>
        <div className='space-y-4'>
          <div>
            <p className={`mb-2 text-xs font-medium ${L.fg}`}>{copy.searchLabel}</p>
            <div
              role='img'
              aria-label={`${copy.searchLabel}: ${query || copy.searchPlaceholder}`}
              className={`relative flex h-11 min-w-0 items-center gap-2 rounded-lg border ${L.border} bg-white px-3`}
            >
              <Search className={`size-4 shrink-0 ${L.subtle}`} aria-hidden='true' />
              <span aria-hidden='true' className={`min-w-0 flex-1 truncate text-sm ${query ? L.fg : L.subtle}`}>
                {query || copy.searchPlaceholder}
                <span aria-hidden='true' className='ml-0.5 inline-block h-4 w-px align-[-2px]' style={{ backgroundColor: query && elapsed < 2200 ? LC.primary : 'transparent' }} />
              </span>
            </div>
          </div>

          <div className='flex h-11 items-center justify-between gap-2'>
            <div role='group' aria-label={copy.filtersLabel} className={`flex h-9 min-w-0 shrink items-center gap-0.5 overflow-hidden sm:gap-1 rounded-lg ${L.secondary} p-1`}>
              {filters.map(item => (
                <span
                  key={item.id}
                  aria-current={filter === item.id ? 'true' : undefined}
                  className={`inline-flex h-7 shrink-0 items-center rounded-md px-1.5 text-xs sm:px-2.5 font-medium ${filter === item.id ? `bg-white shadow-sm ${L.primaryText}` : L.muted}`}
                >
                  {item.label}
                </span>
              ))}
            </div>
            <span className={`w-10 shrink-0 text-right text-xs tabular-nums ${L.muted}`}>
              {resultCount}/{INSTITUTIONS.length}
            </span>
          </div>

          <ul className='grid min-w-0 grid-cols-1 gap-2 lg:grid-cols-2'>
            {INSTITUTIONS.map(item => {
              const brand = BANK_BRANDS[item.id]
              return (
                <li
                  key={item.id}
                  className={`flex min-w-0 items-center gap-3 p-3 ${L.card} transition-opacity duration-500 motion-reduce:transition-none`}
                  style={{ opacity: matches(item) ? 1 : 0.2 }}
                >
                  <div
                    className={`flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border ${L.border} bg-white p-2`}
                    style={{ borderBottom: `3px solid ${brand.color}` }}
                  >
                    {/* Official bank artwork retains its own proportions. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/case-studies/viollet/banks/${brand.file}`} alt={item.name} className='h-full w-full object-contain' />
                  </div>
                  <div className='min-w-0 flex-1 space-y-1.5'>
                    <p className={`truncate text-sm font-semibold ${L.fg}`}>{item.name}</p>
                    <p className={`flex min-w-0 items-center gap-1 text-[10px] ${L.muted}`}>
                      <Mail className='size-3 shrink-0' aria-hidden='true' />
                      <span className='truncate'>{item.sender}</span>
                    </p>
                    <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${item.confirmed ? L.success : L.neutralBadge}`}>
                      {item.confirmed && <Check className='size-3' aria-hidden='true' />}
                      {item.confirmed ? copy.confirmed : copy.listed}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className={`space-y-3 rounded-lg border ${L.border} ${L.primaryTint} p-3`}>
            <div className='grid'>
              <p className={`col-start-1 row-start-1 text-xs leading-relaxed ${L.muted}`} style={{ visibility: filter === 'listed' ? 'hidden' : 'visible' }}>{copy.confirmedHelp}</p>
              <p className={`col-start-1 row-start-1 text-xs leading-relaxed ${L.muted}`} style={{ visibility: filter === 'listed' ? 'visible' : 'hidden' }}>{copy.listedHelp}</p>
            </div>
            <div className='flex flex-wrap gap-x-4 gap-y-2'>
              {tracks.map(({ icon: Icon, label }) => (
                <span key={label} className={`inline-flex items-center gap-1.5 text-[11px] ${L.fg2}`}>
                  <Icon className={`size-3.5 ${L.primaryText}`} aria-hidden='true' />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </AppSurface>
    </InteractivePanel>
  )
}
