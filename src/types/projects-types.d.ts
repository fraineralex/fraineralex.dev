export interface Project {
  projectName: string
  description: string
  technologies: string[]
  deployUrl: string
  githubRepositoryUrl: string
  imageSrc: string
  starsOnGithub: number
  caseStudyUrl?: string
}

interface Link {
  ariaLabel: string
  url: string
  strong: string
  span: string
}

interface ProjectsSection {
  title: string
  cards: Project[]
  link: Link
  caseStudyLabel: string
  liveDemoLabel: string
}

export interface ProjectsProps {
  dictionary: ProjectsSection
  refProjects: (node?: Element | null | undefined) => void
}

export interface ProjectCardLabels {
  caseStudyLabel: string
  liveDemoLabel: string
}
