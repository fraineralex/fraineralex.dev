interface CompanyLink {
  label: string
  url: string
  name: string
}

interface Strong {
  content: string
}

interface Paragraph1 {
  content: string
  strong: Strong
  experiencePrefix: string
  experienceSuffix: string
}

interface Paragraph2 {
  before: string
  company: CompanyLink
  after: string
}

interface Paragraph3 {
  before: string
  lifter: CompanyLink
  middle: string
  ipp: CompanyLink
  end: string
  nelmix: CompanyLink
  closing: string
}

interface Paragraph4 {
  content: string
  viollet: CompanyLink
  middle: string
  tracky: CompanyLink
  closing: string
}

interface MyJSONStructure {
  title: string
  paragraph1: Paragraph1
  paragraph2: Paragraph2
  paragraph3: Paragraph3
  paragraph4: Paragraph4
}

export interface AboutProps {
  dictionary: MyJSONStructure
  refAbout: (node?: Element | null | undefined) => void
}
