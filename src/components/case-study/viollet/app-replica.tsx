'use client'

import Image from 'next/image'
import { Home, Inbox, PieChart, Wallet, X } from 'lucide-react'
import { type KeyboardEvent, useId, useState } from 'react'
import type { Locale } from '@/i18n-config'
import type { ViolletAppCopy } from '@/types/case-study-types'
import { formatDop } from './format'
import {
  BUDGETS,
  CATEGORIES,
  METRICS,
  TRANSACTIONS,
  type CategoryKey
} from './sample-ledger'
import { focusRing } from './ui'

const TABS = ['dashboard', 'expenses', 'budgets', 'inbox'] as const
type Tab = (typeof TABS)[number]

const TAB_ICONS = {
  dashboard: Home,
  expenses: Wallet,
  budgets: PieChart,
  inbox: Inbox
}

interface Props {
  copy: ViolletAppCopy
  lang: Locale
}

export default function AppReplica ({ copy, lang }: Props) {
  const uid = useId()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [filter, setFilter] = useState<CategoryKey | 'all'>('all')
  const [selectedTx, setSelectedTx] = useState<string | null>(null)
  const [selectedMail, setSelectedMail] = useState<string | null>(null)
  const maxCategory = CATEGORIES[0].amount
  const visibleTx = TRANSACTIONS.filter(tx => filter === 'all' || tx.category === filter)
  const activeTx = TRANSACTIONS.find(tx => tx.id === selectedTx) ?? null

  function onTabKey (event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextIndex = event.key === 'ArrowRight' || event.key === 'ArrowDown'
      ? (index + 1) % TABS.length
      : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
        ? (index - 1 + TABS.length) % TABS.length
        : null
    if (nextIndex === null) return
    event.preventDefault()
    const next = TABS[nextIndex]
    setTab(next)
    document.getElementById(`${uid}-tab-${next}`)?.focus()
  }

  const mails = [
    {
      id: 'bravo',
      from: 'Banreservas',
      email: 'notificaciones@banreservas.com',
      subject: copy.mail.bravoSubject,
      snippet: copy.mail.bravoSnippet,
      ignored: false
    },
    {
      id: 'uber',
      from: 'Qik',
      email: 'notificaciones@qik.do',
      subject: copy.mail.uberSubject,
      snippet: copy.mail.uberSnippet,
      ignored: false
    },
    {
      id: 'claro',
      from: 'Qik',
      email: 'notificaciones@qik.do',
      subject: copy.mail.claroSubject,
      snippet: copy.mail.claroSnippet,
      ignored: false
    },
    {
      id: 'noise',
      from: copy.mail.noiseFrom,
      email: copy.mail.noiseEmail,
      subject: copy.mail.noiseSubject,
      snippet: copy.mail.noiseSnippet,
      ignored: true
    }
  ]
  const activeMail = mails.find(mail => mail.id === selectedMail) ?? null

  return (
    <figure className='overflow-hidden rounded-xl border border-teal-400/20 bg-[#070b14] shadow-lg shadow-black/30'>
      <figcaption className='sr-only'>{copy.frameLabel}</figcaption>
      <div className='flex items-center gap-3 border-b border-white/10 px-3 py-2.5 sm:px-4'>
        <div className='flex gap-1.5' aria-hidden='true'>
          <span className='h-2.5 w-2.5 rounded-full bg-rose-400/80' />
          <span className='h-2.5 w-2.5 rounded-full bg-amber-300/80' />
          <span className='h-2.5 w-2.5 rounded-full bg-emerald-400/80' />
        </div>
        <p className='truncate rounded-md bg-white/5 px-3 py-1 text-xs text-slate-400'>
          {copy.url}/{tab === 'dashboard' ? 'dashboard' : tab}
        </p>
      </div>

      <div className='flex flex-col md:min-h-[34rem] md:flex-row'>
        <div className='border-b border-white/10 bg-[#100d1c] md:flex md:w-56 md:flex-col md:border-b-0 md:border-r'>
          <div className='flex items-center gap-2 px-3 py-3'>
            <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500 text-sm font-semibold text-white' aria-hidden='true'>
              V
            </span>
            <div className='min-w-0'>
              <p className='truncate text-sm font-semibold text-white'>Viollet</p>
              <p className='truncate text-xs text-violet-200/70'>{copy.product}</p>
            </div>
            <span className='ml-auto rounded-full border border-violet-400/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-violet-200'>
              {copy.version}
            </span>
          </div>
          <div role='tablist' aria-label={copy.navLabel} className='flex gap-1 overflow-x-auto px-2 pb-2 md:flex-1 md:flex-col md:overflow-visible'>
            {([
              { label: copy.overview, ids: ['dashboard', 'expenses', 'budgets'] as Tab[] },
              { label: copy.tracking, ids: ['inbox'] as Tab[] }
            ]).map(group => (
              <div key={group.label} role='presentation' className='flex gap-1 md:flex-col'>
                <p aria-hidden='true' className='hidden px-3 pt-3 text-[11px] font-medium uppercase tracking-wide text-slate-500 md:block'>
                  {group.label}
                </p>
                {group.ids.map(id => {
                  const index = TABS.indexOf(id)
                  const Icon = TAB_ICONS[id]
                  const selected = tab === id
                  return (
                    <button
                      key={id}
                      id={`${uid}-tab-${id}`}
                      type='button'
                      role='tab'
                      aria-selected={selected}
                      aria-controls={`${uid}-panel`}
                      tabIndex={selected ? 0 : -1}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${focusRing} ${selected ? 'bg-violet-500/20 text-violet-100' : 'text-slate-300 hover:bg-white/5'}`}
                      onClick={() => setTab(id)}
                      onKeyDown={event => onTabKey(event, index)}
                    >
                      <Icon className='h-4 w-4' aria-hidden='true' />
                      {copy.tabs[id]}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
          <div className='flex items-center gap-2 border-t border-white/10 px-3 py-3'>
            <Image
              src='/images/projects/viollet-user.webp'
              alt={copy.userAlt}
              width={32}
              height={32}
              className='h-8 w-8 rounded-full object-cover'
            />
            <div className='min-w-0'>
              <p className='truncate text-sm text-white'>{copy.userName}</p>
              <p className='truncate text-xs text-slate-400'>
                <span className='sr-only'>{copy.signedIn}. </span>
                {copy.userEmail}
              </p>
            </div>
          </div>
        </div>

        <div
          id={`${uid}-panel`}
          role='tabpanel'
          aria-labelledby={`${uid}-tab-${tab}`}
          className='flex-1 bg-[#161222] p-3 sm:p-4'
        >
          <p className='mb-3 text-xs text-violet-200/80'>{copy.simulationNote}</p>

          {tab === 'dashboard' && (
            <div className='space-y-3'>
              <p className='text-xs font-medium uppercase tracking-wide text-slate-400'>{copy.period}</p>
              <div className='grid grid-cols-1 gap-2 min-[420px]:grid-cols-3'>
                <Metric label={copy.income} value={formatDop(METRICS.income, lang, 0)} change={`+${METRICS.incomeChange}%`} hint={copy.vsLast} positive />
                <Metric label={copy.expenses} value={formatDop(METRICS.expenses, lang, 0)} change={`+${METRICS.expensesChange}%`} hint={copy.vsLast} positive={false} />
                <Metric label={copy.net} value={formatDop(METRICS.net, lang, 0)} change='' hint={copy.period} positive />
              </div>
              <div className='rounded-lg border border-white/10 bg-white/5 p-3'>
                <h3 className='mb-3 text-sm font-medium text-white'>{copy.categories}</h3>
                <ul className='space-y-2'>
                  {CATEGORIES.slice(0, 6).map(category => (
                    <li key={category.key}>
                      <div className='mb-1 flex justify-between gap-3 text-xs text-slate-300'>
                        <span>{copy.categoryNames[category.key]}</span>
                        <span>{formatDop(category.amount, lang, 0)}</span>
                      </div>
                      <div className='h-1.5 rounded-full bg-white/10'>
                        <div
                          className='h-1.5 rounded-full'
                          style={{ width: `${(category.amount / maxCategory) * 100}%`, backgroundColor: category.color }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <RecentList
                copy={copy}
                lang={lang}
                onOpen={id => {
                  setSelectedTx(id)
                  setTab('expenses')
                }}
              />
            </div>
          )}

          {tab === 'expenses' && (
            <div className='space-y-3'>
              <label className='flex flex-col gap-1 text-xs text-slate-300 sm:flex-row sm:items-center sm:gap-2'>
                <span className='font-medium'>{copy.filterLabel}</span>
                <select
                  value={filter}
                  onChange={event => setFilter(event.target.value as CategoryKey | 'all')}
                  className={`rounded-md border border-white/10 bg-[#100d1c] px-2 py-2 text-sm text-white ${focusRing}`}
                >
                  <option value='all'>{copy.allCategories}</option>
                  {CATEGORIES.map(category => (
                    <option key={category.key} value={category.key}>
                      {copy.categoryNames[category.key]}
                    </option>
                  ))}
                </select>
              </label>
              {visibleTx.length === 0 ? (
                <p className='text-sm text-slate-400'>{copy.emptyFilter}</p>
              ) : (
                <ul className='divide-y divide-white/10 overflow-hidden rounded-lg border border-white/10'>
                  {visibleTx.map(tx => (
                    <li key={tx.id}>
                      <button
                        type='button'
                        className={`flex w-full items-center justify-between gap-3 px-3 py-3 text-left hover:bg-white/5 ${focusRing}`}
                        onClick={() => setSelectedTx(tx.id)}
                        aria-expanded={selectedTx === tx.id}
                      >
                        <span>
                          <span className='block text-sm text-white'>{tx.merchant}</span>
                          <span className='block text-xs text-slate-400'>
                            {copy.categoryNames[tx.category]} · {tx.account}
                          </span>
                        </span>
                        <span className='shrink-0 text-sm text-rose-200'>{formatDop(tx.amount, lang)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {activeTx && (
                <Detail
                  title={activeTx.merchant}
                  closeLabel={copy.closeDetail}
                  onClose={() => setSelectedTx(null)}
                  rows={[
                    [copy.amount, formatDop(activeTx.amount, lang)],
                    [copy.category, copy.categoryNames[activeTx.category]],
                    [copy.account, activeTx.account],
                    [copy.origin, `${copy.originEmail} · ${activeTx.email}`]
                  ]}
                />
              )}
            </div>
          )}

          {tab === 'budgets' && (
            <div className='space-y-3'>
              <h3 className='text-sm font-medium text-white'>{copy.budgetsTitle}</h3>
            <ul className='space-y-3'>
              {BUDGETS.map(budget => {
                const pct = Math.round((budget.spent / budget.amount) * 100)
                const over = budget.spent > budget.amount
                return (
                  <li key={budget.key} className='rounded-lg border border-white/10 bg-white/5 p-3'>
                    <div className='mb-2 flex items-start justify-between gap-3'>
                      <h3 className='text-sm font-medium text-white'>{copy.budgetNames[budget.key]}</h3>
                      {over && (
                        <span className='rounded-full bg-rose-400/15 px-2 py-0.5 text-[11px] font-medium text-rose-200'>
                          {copy.over}
                        </span>
                      )}
                    </div>
                    <div className='h-2 rounded-full bg-white/10'>
                      <div
                        className='h-2 rounded-full'
                        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: budget.color }}
                      />
                    </div>
                    <p className='mt-2 text-xs text-slate-400'>
                      {formatDop(budget.spent, lang, 0)} / {formatDop(budget.amount, lang, 0)} · {pct}%
                      {!over && ` · ${formatDop(budget.amount - budget.spent, lang, 0)} ${copy.remaining}`}
                    </p>
                  </li>
                )
              })}
            </ul>
            </div>
          )}

          {tab === 'inbox' && (
            <div className='space-y-3'>
              <h3 className='text-sm font-medium text-white'>{copy.inboxTitle}</h3>
              <ul className='divide-y divide-white/10 overflow-hidden rounded-lg border border-white/10'>
                {mails.map(mail => (
                  <li key={mail.id}>
                    <button
                      type='button'
                      className={`flex w-full flex-col gap-1 px-3 py-3 text-left hover:bg-white/5 ${focusRing}`}
                      onClick={() => setSelectedMail(mail.id)}
                      aria-expanded={selectedMail === mail.id}
                    >
                      <span className='flex items-center justify-between gap-2'>
                        <span className='text-sm text-white'>{mail.from}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] ${mail.ignored ? 'bg-slate-500/20 text-slate-300' : 'bg-violet-500/20 text-violet-100'}`}>
                          {mail.ignored ? copy.ignored : copy.parsed}
                        </span>
                      </span>
                      <span className='text-sm text-slate-200'>{mail.subject}</span>
                      <span className='text-xs text-slate-400'>{mail.snippet}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {activeMail && (
                <Detail
                  title={activeMail.subject}
                  closeLabel={copy.closeDetail}
                  onClose={() => setSelectedMail(null)}
                  rows={[
                    [copy.origin, `${activeMail.from} · ${activeMail.email}`],
                    [activeMail.ignored ? copy.ignored : copy.parsed, activeMail.ignored ? copy.mail.noiseReason : activeMail.snippet]
                  ]}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </figure>
  )
}

function Metric ({
  label,
  value,
  change,
  hint,
  positive
}: {
  label: string
  value: string
  change: string
  hint: string
  positive: boolean
}) {
  return (
    <div className='rounded-lg border border-white/10 bg-white/5 p-3'>
      <p className='text-[11px] uppercase tracking-wide text-slate-400'>{label}</p>
      <p className='mt-1 text-lg font-semibold text-white sm:text-xl'>{value}</p>
      <p className={`text-[11px] ${positive ? 'text-emerald-300' : 'text-rose-200'}`}>
        {change ? `${change} ` : ''}{hint}
      </p>
    </div>
  )
}

function RecentList ({
  copy,
  lang,
  onOpen
}: {
  copy: ViolletAppCopy
  lang: Locale
  onOpen: (id: string) => void
}) {
  return (
    <div className='rounded-lg border border-white/10 bg-white/5 p-3'>
      <h3 className='mb-2 text-sm font-medium text-white'>{copy.recent}</h3>
      <ul className='space-y-1'>
        {TRANSACTIONS.slice(0, 4).map(tx => (
          <li key={tx.id}>
            <button
              type='button'
              className={`flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left hover:bg-white/5 ${focusRing}`}
              onClick={() => onOpen(tx.id)}
            >
              <span className='min-w-0'>
                <span className='block truncate text-sm text-white'>{tx.merchant}</span>
                <span className='block text-xs text-slate-400'>{copy.categoryNames[tx.category]}</span>
              </span>
              <span className='shrink-0 text-sm text-rose-200'>{formatDop(tx.amount, lang)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Detail ({
  title,
  rows,
  closeLabel,
  onClose
}: {
  title: string
  rows: Array<[string, string]>
  closeLabel: string
  onClose: () => void
}) {
  return (
    <div className='rounded-lg border border-violet-400/30 bg-violet-500/10 p-3' aria-live='polite'>
      <div className='mb-2 flex items-start justify-between gap-3'>
        <h3 className='text-sm font-medium text-white'>{title}</h3>
        <button type='button' className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-violet-100 ${focusRing}`} onClick={onClose}>
          <X className='h-3.5 w-3.5' aria-hidden='true' />
          {closeLabel}
        </button>
      </div>
      <dl className='space-y-1 text-sm'>
        {rows.map(([label, value]) => (
          <div key={label} className='grid grid-cols-1 gap-0.5 sm:grid-cols-[8rem_1fr]'>
            <dt className='text-slate-400'>{label}</dt>
            <dd className='text-slate-100'>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
