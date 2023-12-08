import { FiExternalLink, FiGithub } from 'react-icons/fi'
import { GoRepo } from 'react-icons/go'
import { ProjectInfo } from '@/types/all-projects-type'

export default function ProjectCardSquare ({
  title,
  description,
  technologies,
  githubRepositoryUrl,
  deployUrl,
  year
}: ProjectInfo) {
  return (
    <li className='relative group lg:hover:transform lg:hover:-translate-y-2 transition-all duration-300 ease-in-out overflow-auto cursor-pointer'>
      <a
        className='decoration-none shadow-md flex flex-col items-center relative h-full p-8 py-7 rounded bg-gray-900'
        href={deployUrl || githubRepositoryUrl}
      >
        <header className='lg:min-h-[20vh]'>
          <div className='flex justify-between items-center mb-7'>
            <span className='text-cyan-200'>
              <GoRepo className='w-10 h-10 align-middle' />
            </span>
            <span className='flex items-center text-gray-200'>
              <a
                href={githubRepositoryUrl}
                aria-label='External Link'
                className='flex justify-center items-center px-1 py-2 relative hover:text-teal-300 focus-visible:outline-none'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FiGithub className='-mt-1 w-5 h-5 mr-2' />
              </a>
              {deployUrl && (
                <a
                  href={deployUrl}
                  aria-label='External Link'
                  className='flex justify-center items-center px-1 py-2 relative hover:text-teal-300 focus-visible:outline-none'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FiExternalLink className='-mt-1 w-5 h-5' />
                </a>
              )}
            </span>
          </div>
          <h3 className='mt-3 text-2xl font-bold text-slate-200 group-hover:text-teal-300 group-focus-visible:text-teal-300 leading-none'>
            <a
              href={deployUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='deploy-link outline-none focus-visible:outline-none'
            >
              {title}
            </a>
          </h3>
          <p className='text-gray-300 mt-3 text-sm leading-relaxed font-[450px]'>
            {description}
          </p>
        </header>
        <footer className='self-start mt-auto'>
          <ul className='flex flex-wrap list-none mt-5 space-x-2 leading-tight text-sm font-light'>
            {technologies.length > 0 &&
              technologies.map((tech, index) => <li key={index}>{tech}</li>)}
          </ul>
        </footer>
      </a>
    </li>
  )
}
