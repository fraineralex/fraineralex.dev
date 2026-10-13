import type { Locale } from '@/i18n-config'
import type { GenericCaseStudyContent } from '@/types/generic-case-study-types'
import { en } from './en'
import { es } from './es'

export const CASE_STUDY_SLUGS = ['tracky', 'sargotech', 'chatify', 'chess-ai'] as const

export function getCaseStudy (lang: Locale, slug: string): GenericCaseStudyContent | undefined {
  return (lang === 'es' ? es : en)[slug]
}
