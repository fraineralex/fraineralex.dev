import Link from 'next/link'
import ProjectCard from '@/components/project/project-card'
import { ArrowRigthIcon } from '@/components/common/SvgIcons'
import { ProjectsProps } from '@/types/projects-types'

export default function Projects ({ dictionary, refProjects }: ProjectsProps) {
  const { title, cards, link } = dictionary
  return (
    <section
      id='projects'
      className='mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24'
      aria-label='Selected projects'
      ref={refProjects}
    >
      <header className='sticky top-0 z-20 -mx-6 mb-4 w-screen bg-gradient-to-r from-black-pear-950/75 to-shark-950/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0'>
        <h2 className='text-sm font-bold uppercase tracking-widest text-slate-100 lg:sr-only'>
          {title}
        </h2>
      </header>
      <article>
        <ol className='group/list'>
          {cards.length > 0 &&
            cards.map((card, index) => (
              <ProjectCard
                key={index}
                projectName={card.projectName}
                description={card.description}
                technologies={card.technologies}
                deployUrl={card.deployUrl}
                githubRepositoryUrl={card.githubRepositoryUrl}
                starsOnGithub={card.starsOnGithub}
                imageSrc={card.imageSrc}
              />
            ))}
        </ol>
        <div className='mt-12 animate-card'>
          <Link
            className='inline-flex items-center leading-tight font-semibold text-slate-200 group'
            aria-label={link.ariaLabel}
            href={link.url}
          >
            <p>
              <strong className='border-b border-transparent pb-px transition group-hover:border-teal-300 motion-reduce:transition-none font-semibold'>
                {link.strong}{' '}
              </strong>
              <span className='marker:whitespace-nowrap'>
                <strong className='border-b border-transparent pb-px transition group-hover:border-teal-300 motion-reduce:transition-none font-semibold'>
                  {link.span}
                </strong>
                <ArrowRigthIcon />
              </span>
            </p>
          </Link>
        </div>
      </article>
    </section>
  )
}
