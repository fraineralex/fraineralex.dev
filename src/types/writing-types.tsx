interface BlogLink {
  ariaLabel: string
  url: string
  strong: string
  span: string
}

interface WritingSection {
  link: BlogLink
}

export interface WiritingProps {
  dictionary: WritingSection
}
