import type { Locale } from '@/i18n-config'
import type { GenericCaseStudyContent } from '@/types/generic-case-study-types'
import { en } from './en'
import { es } from './es'

export const CASE_STUDY_SLUGS = ['tracky', 'sargotech', 'chatify', 'chess-ai'] as const

export const CASE_STUDY_IMAGES: Record<string, { src: string; width: number; height: number }> = {
  tracky: { src: 'tracky.webp', width: 1200, height: 675 },
  chatify: { src: 'chatify.webp', width: 2400, height: 1350 },
  'chess-ai': { src: 'chess.webp', width: 1200, height: 900 },
  sargotech: { src: 'sargotech-og.webp', width: 1200, height: 630 }
}

export function getCaseStudy (lang: Locale, slug: string): GenericCaseStudyContent | undefined {
  return (lang === 'es' ? es : en)[slug]
}
