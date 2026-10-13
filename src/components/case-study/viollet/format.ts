import type { Locale } from '@/i18n-config'

export function formatDop (cents: number, lang: Locale, digits: 0 | 2 = 2) {
  const negative = cents < 0
  const formatted = new Intl.NumberFormat(lang === 'es' ? 'es-DO' : 'en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(Math.abs(cents) / 100)
  return `${negative ? '-' : ''}RD$${formatted}`
}
