import Image from 'next/image'
import { GitHubIcon, LinkIcon, StarIcon } from '../common/SvgIcons'
import { Children } from 'react'

interface Props {
  projectName: string
  description: string
  deployUrl: string
  githubRepositoryUrl: string
  starsOnGithub?: number
  technologies: string[]
  imageSrc: string
  children?: React.ReactNode
}

export default function ProjectCard ({
  projectName,
  description,
  deployUrl,
  githubRepositoryUrl,
  starsOnGithub,
  technologies,
  imageSrc,
  children
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
          {starsOnGithub && (
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
          )}
          <ul className='mt-2 flex flex-wrap' aria-label='Related links'>
            <li className='mr-4'>
              <a
                className='relative mt-2 inline-flex items-center text-sm font-medium text-slate-300 hover:text-teal-300 focus-visible:text-teal-300'
                href={githubRepositoryUrl}
                target='_blank'
                rel='noreferrer'
              >
                <span>GitHub</span>
                <GitHubIcon className='ml-1.5 h-3.5 w-3.5 shrink-0' />
              </a>
            </li>
          </ul>
          <ul className='mt-2 flex flex-wrap' aria-label='Technologies used:'>
            {/* {technologies.map((technology, index) => (
              <li className='mr-1.5 mt-2' key={index}>
                <span className='flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300 mr-1.5'>
                  {technology}
                </span>
              </li>
            ))} */}
            {children}
          </ul>
        </aside>
        <Image
          alt={`Cover image of the project`}
          width={543}
          height={336}
          className='rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30 md:order-1 md:col-span-2 md:translate-y-1 bg-black opacity-60 group-hover:opacity-80'
          src={`/images/projects/${imageSrc}`}
          style={{ color: 'transparent', width: '100%' }}
        />
      </div>
    </li>
  )
}
