type ProjectTechnologies = string[]

export interface ProjectInfo {
  title: string
  shortDescription?: string
  description: string
  technologies: ProjectTechnologies
  githubRepositoryUrl: string
  deployUrl?: string
  year: number
}

interface TableHeaders {
  year: string
  project: string
  description: string
  technologies: string
  links: string
  deployText: string
}

interface AllProjectsInfo {
  fullname: string
  goBackUrl: string
  title: string
  projects: ProjectInfo[]
  tableHeaders: TableHeaders
}

export interface AllProjectsProps {
  dictionary: AllProjectsInfo
}
