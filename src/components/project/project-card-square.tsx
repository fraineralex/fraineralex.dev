'use client'

import { FiExternalLink, FiGithub } from 'react-icons/fi'
import { GoRepo } from 'react-icons/go'

interface Props {
  title: string
  description: string
  technologies: string[]
  githubRepositoryUrl: string
  deployUrl: string
}

export default function ProjectCardSquare ({
  title,
  description,
  technologies,
  githubRepositoryUrl,
  deployUrl
}: Props) {
  const handleHover = () => {
    const anchors = document.getElementsByTagName('a')
    const titleAnchor = anchors.item(anchors.length - 1)
    if (titleAnchor) {
      titleAnchor.focus()
    }
  }

  const handleClick = () => {
    const anchors = document.getElementsByTagName('a')
    const titleAnchor = anchors.item(anchors.length - 1)
    if (titleAnchor) {
      titleAnchor.click()
    }
  }

  return (
    <li
      className='relative group lg:hover:transform lg:hover:-translate-y-2 transition-all duration-300 ease-in-out overflow-auto cursor-pointer'
      onMouseEnter={handleHover}
      onClick={handleClick}
    >
      <article className='decoration-none shadow-md flex flex-col items-center relative h-full p-8 py-7 rounded-md bg-gray-900'>
        <header>
          <div className='flex justify-between items-center mb-7'>
            <span className='text-cyan-200'>
              <GoRepo className='w-10 h-10 align-middle' />
            </span>
            <span className='flex items-center text-gray-200'>
              <a
                href={githubRepositoryUrl}
                aria-label='External Link'
                className='flex justify-center items-center px-1 py-2 relative hover:text-teal-300 focus-visible:text-teal-300'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FiGithub className='-mt-1 w-5 h-5 mr-2' />
              </a>
              <a
                href={deployUrl}
                aria-label='External Link'
                className='flex justify-center items-center px-1 py-2 relative hover:text-teal-300 focus-visible:text-teal-300 deploy-link'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FiExternalLink className='-mt-1 w-5 h-5' />
              </a>
            </span>
          </div>
          <h3 className='mt-2 text-2xl font-bold leading-tight text-slate-200 group-hover:text-teal-300 group-focus-visible:text-teal-300'>
            <a
              href={deployUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='deploy-link outline-none focus-visible:outline-none'
            >
              {title}
            </a>
          </h3>
          <p className='text-gray-300 text-base mt-3 leading-tight'>
            {description}
          </p>
        </header>
        <footer>
          <ul className='flex flex-wrap items-end list-none mt-5 space-x-2'>
            {technologies.length > 0 &&
              technologies.map((tech, index) => <li key={index}>{tech}</li>)}
          </ul>
        </footer>
      </article>
    </li>
  )
}
