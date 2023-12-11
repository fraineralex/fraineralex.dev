interface Consultancy {
  label: string
  url: string
  name: string
  before?: string
}

interface Journey {
  consultancy: Consultancy
  productCompany: Consultancy
  financialConsultancy: Consultancy
}

interface Strong {
  content: string
}

interface Paragraph1 {
  content: string
  strong: Strong
  experience: string
  journey: Journey
}

interface Lifter {
  label: string
  url: string
}

interface PersonalProjects {
  label: string
}

interface FreelanceServices {
  label: string
  before: string
}

interface Paragraph2 {
  focus: string
  lifter: Lifter
  professionalRealm: string
  personalProjects: PersonalProjects
  freelanceServices: FreelanceServices
}

interface Paragraph3 {
  technologies: string
}

interface MyJSONStructure {
  title: string
  paragraph1: Paragraph1
  paragraph2: Paragraph2
  paragraph3: Paragraph3
  skills: string[]
}

export interface AboutProps {
  dictionary: MyJSONStructure
  refAbout: (node?: Element | null | undefined) => void
}
