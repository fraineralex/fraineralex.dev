export interface EducationCardData {
  degree: string
  description: string
  school: {
    name: string
    website: string
  }
  imageSrc: string
  invertLogo?: boolean
  id?: number
}

interface EducationSection {
  title: string
  cards: EducationCardData[]
}

export interface EducationProps {
  dictionary: EducationSection
}
