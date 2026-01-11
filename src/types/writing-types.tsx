import { Locale } from '@/i18n-config'

interface BlogLink {
  ariaLabel: string
  url: string
  strong: string
  span: string
}

interface WritingSection {
  title: string
  link: BlogLink
}

export interface WritingPost {
  title: string
  hero: string
  date: string
  slug: string
  lang: string
  published: boolean
}

export interface WiritingProps {
  dictionary: WritingSection
  refWriting: (node?: Element | null | undefined) => void
  lang?: Locale
  posts: WritingPost[]
}
