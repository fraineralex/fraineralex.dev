// Square isotypes for marks under ~48px. Wide wordmarks stay on large bands.
import { INSTITUTIONS } from './sample-ledger'

export type BankId = (typeof INSTITUTIONS)[number]['id']

const ICON_FILE = {
  apap: 'apap.png',
  banesco: 'banesco_do.png',
  banreservas: 'banreservas.svg',
  bhd: 'bhd.png',
  caribe: 'caribe.png',
  lafise: 'lafise.png',
  popular: 'popular.svg',
  promerica: 'promerica.png',
  qik: 'qik.svg',
  santa_cruz: 'santa_cruz.svg',
  scotiabank: 'scotiabank_do.png'
} as const satisfies Record<BankId, string>

const WORDMARK_FILE = {
  apap: 'apap.svg',
  banesco: 'banesco_do.svg',
  banreservas: 'banreservas.svg',
  bhd: 'bhd.svg',
  caribe: 'caribe.svg',
  lafise: 'lafise.svg',
  popular: 'popular.svg',
  promerica: 'promerica.svg',
  qik: 'qik.svg',
  santa_cruz: 'santa_cruz.avif',
  scotiabank: 'scotiabank_do.avif'
} as const satisfies Record<BankId, string>

/** Official brand colors from the Viollet institutions catalog. */
export const BANK_COLOR = {
  apap: '#205BA8',
  banesco: '#003B71',
  banreservas: '#264E72',
  bhd: '#50BA3F',
  caribe: '#1B765A',
  lafise: '#00583C',
  popular: '#001638',
  promerica: '#0961AD',
  qik: '#0082CD',
  santa_cruz: '#0961AD',
  scotiabank: '#EC0712'
} as const satisfies Record<BankId, string>

const ALIAS: Record<string, BankId> = {
  'asociacion popular': 'apap',
  'asociación popular': 'apap',
  'banco bhd': 'bhd',
  'banco caribe': 'caribe',
  'banco lafise': 'lafise',
  'banco popular': 'popular',
  'banco promerica': 'promerica',
  'banco santa cruz': 'santa_cruz',
  'qik banco digital': 'qik',
  'santa cruz': 'santa_cruz'
}

function isBankId (value: string): value is BankId {
  return Object.prototype.hasOwnProperty.call(ICON_FILE, value)
}

function resolveBankId (idOrName: string): BankId | undefined {
  const key = idOrName.trim().toLowerCase()
  if (isBankId(key)) return key
  return ALIAS[key]
}

/** Square isotype. Use for circles, avatars, chips, and other marks under ~48px. */
export function bankIcon (idOrName: string): string {
  const id = resolveBankId(idOrName)
  return id ? `/case-studies/viollet/icons/${ICON_FILE[id]}` : ''
}

/** Wide wordmark. Use only where the logo is shown large (header bands, cards over ~80px). */
export function bankWordmark (idOrName: string): string {
  const id = resolveBankId(idOrName)
  return id ? `/case-studies/viollet/banks/${WORDMARK_FILE[id]}` : ''
}

export function bankColor (id: BankId): string
export function bankColor (idOrName: string): string | undefined
export function bankColor (idOrName: string): string | undefined {
  const id = resolveBankId(idOrName)
  return id ? BANK_COLOR[id] : undefined
}
