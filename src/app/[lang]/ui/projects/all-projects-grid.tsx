import ProjectCard from '@/components/project/project-card-square'
import { ProjectInfo } from '@/types/all-projects-type'

interface Props {
  projects: ProjectInfo[]
}

export default function AllProjectsGrid ({ projects }: Props) {
  return (
    <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 list-none mt-14 lg:px-10'>
      {projects.length > 0 &&
        projects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            description={project.description}
            technologies={project.technologies}
            githubRepositoryUrl={project.githubRepositoryUrl}
            deployUrl={project.deployUrl}
            year={project.year}
          />
        ))}
    </ul>
  )
}
