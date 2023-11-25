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
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 16 16'
                  fill='currentColor'
                  className='ml-1.5 h-3.5 w-3.5 shrink-0'
                  aria-hidden='true'
                >
                  <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z'></path>
                </svg>
              </a>
            </li>
          </ul>
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
