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

export interface WiritingProps {
  dictionary: WritingSection
  refWriting: (node?: Element | null | undefined) => void
}
