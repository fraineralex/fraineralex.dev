export interface ExperienceCardData {
  startDate: string
  endDate: string
  title: string
  company: {
    name: string
    website: string
  }
  description: string
  skills: string[]
  contract: string
  location: string
  locationType: string
  imageName: string
  otherTitles?: string[]
  id?: number
}

interface ResumeButton {
  label: string
  url: string
  strong: string
}

interface ExperienceSection {
  title: string
  cards: ExperienceCardData[]
  resumeButton: ResumeButton
}

export interface ExperienceProps {
  dictionary: ExperienceSection
  refExperience: (node?: Element | null | undefined) => void
}
