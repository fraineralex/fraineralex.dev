import Image from 'next/image'
import { LinkIcon, StarIcon } from '../common/SvgIcons'

type Props = {
  projectName: string
  description: string
  deployUrl: string
  githubRepositoryUrl: string
  starsOnGithub?: number
  technologies: string[]
  imageSrc: string
}

export default function ProjectCard ({
  projectName,
  description,
  deployUrl,
  githubRepositoryUrl,
  starsOnGithub,
  technologies,
  imageSrc
}: Props) {
  return (
    <li className='mb-12'>
      <div className='group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50'>
        <span className='absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg'></span>
        <aside className='z-10 sm:order-2 sm:col-span-6'>
          <h3>
            <a
              className='inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-teal-300 focus-visible:text-teal-300  group/link text-base'
              href={deployUrl}
              target='_blank'
              rel='noreferrer'
              aria-label={projectName}
            >
              <span className='absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block'></span>
              <strong className='inline-block'>
                {projectName}
                <LinkIcon />
              </strong>
            </a>
          </h3>
          <p className='mt-2 text-sm leading-normal'>{description}</p>
          <a
            className='relative mt-2 inline-flex items-center text-sm font-medium text-slate-300 hover:text-teal-300 focus-visible:text-teal-300'
            href={githubRepositoryUrl}
            target='_blank'
            rel='noreferrer'
            aria-label={`${starsOnGithub} stars on GitHub`}
          >
            <StarIcon />
            <span>{starsOnGithub}</span>
          </a>
          <ul className='mt-2 flex flex-wrap' aria-label='Technologies used:'>
            {technologies.map((technology, index) => (
              <li className='mr-1.5 mt-2' key={index}>
                <span className='flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300 mr-1.5'>
                  {technology}
                </span>
              </li>
            ))}
          </ul>
        </aside>
        <figure>
          <Image
            alt={`Cover image of the project`}
            width='200'
            height='48'
            className='rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30 sm:order-1 sm:col-span-2 sm:translate-y-1'
            src={`/images/projects/${imageSrc}`}
            style={{ color: 'transparent' }}
          />
        </figure>
      </div>
    </li>
  )
}
