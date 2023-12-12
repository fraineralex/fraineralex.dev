import Image from 'next/image'
import { GitHubIcon, LinkIcon, StarIcon } from '../common/SvgIcons'
import { Project } from '@/types/projects-types'
import Link from 'next/link'

export default function ProjectCard ({
  projectName,
  description,
  deployUrl,
  githubRepositoryUrl,
  starsOnGithub,
  technologies,
  imageSrc
}: Project) {
  return (
    <li className='mb-12'>
      <div className='group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50'>
        <span className='absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-shark-800/20 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg'></span>
        <aside className='z-10 sm:order-2 sm:col-span-6'>
          <h3>
            <Link
              className='inline-flex items-baseline font-medium leading-tight text-shark-200 hover:text-teal-300 focus-visible:text-teal-300  group/link text-base'
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
            </Link>
          </h3>
          <p className='mt-2 text-sm leading-normal text-slate-300/90'>{description}</p>
          {starsOnGithub >= 16 && (
            <Link
              className='relative mt-2 inline-flex items-center text-sm font-medium text-shark-300 hover:text-teal-300 focus-visible:text-teal-300'
              href={githubRepositoryUrl}
              target='_blank'
              rel='noreferrer'
              aria-label={`${starsOnGithub} stars on GitHub`}
            >
              <StarIcon />
              <span>{starsOnGithub}</span>
            </Link>
          )}
          <ul className='mt-2 flex flex-wrap' aria-label='Related links'>
            <li className='mr-4'>
              <Link
                className='relative mt-2 inline-flex items-center text-sm font-medium text-shark-300/80 hover:text-teal-300 focus-visible:text-teal-300'
                href={githubRepositoryUrl}
                target='_blank'
                rel='noreferrer'
              >
                <span>GitHub</span>
                <GitHubIcon className='ml-1.5 h-3.5 w-3.5 shrink-0' />
              </Link>
            </li>
          </ul>
          <ul
            className='mt-2 flex whitespace-nowrap'
            aria-label='Technologies used:'
          >
            {technologies.map((technology, index) => (
              <li className='mr-1.5 mt-2' key={index}>
                <span className='flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-200 mr-1.5'>
                  {technology}
                </span>
              </li>
            ))}
            {/* {children} */}
          </ul>
        </aside>
        <Image
          alt={`Cover image of the project`}
          width={200}
          height={48}
          className='rounded border-2 border-shark-200/10 transition group-hover:border-shark-200/30 sm:order-1 sm:col-span-2 sm:transhark-y-1'
          src={`/images/projects/${imageSrc}`}
          style={{ color: 'transparent' }}
        />
      </div>
    </li>
  )
}
