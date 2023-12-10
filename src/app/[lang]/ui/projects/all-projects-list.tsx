import { GitHubIcon } from '@/components/common/SvgIcons'
import { ProjectInfo, TableHeaders } from '@/types/all-projects-type'

interface Props {
  projects: ProjectInfo[]
  tableHeaders: TableHeaders
}

export default function AllProjectsList ({ projects, tableHeaders }: Props) {
  return (
    <table id='content' className='mt-12 w-full border-collapse text-left'>
      <thead className='sticky top-0 z-10 border-b border-slate-50/20 px-6 py-5 backdrop-blur'>
        <tr>
          <th className='py-4 pr-8 text-sm font-semibold text-slate-200'>
            {tableHeaders.year}
          </th>
          <th className='py-4 pr-8 text-sm font-semibold text-slate-200'>
            {tableHeaders.project}
          </th>
          <th className='hidden py-4 pr-8 text-sm font-semibold text-slate-200 lg:table-cell'>
            {tableHeaders.description}
          </th>
          <th className='hidden py-4 pr-8 text-sm font-semibold text-slate-200 lg:table-cell'>
            {tableHeaders.technologies}
          </th>
          <th className='hidden py-4 pr-8 text-sm font-semibold text-slate-200 sm:table-cell'>
            {tableHeaders.links}
          </th>
        </tr>
      </thead>
      <tbody>
        {projects.length > 0 &&
          projects
            .sort((a, b) => b.year - a.year)
            .map(
              (
                {
                  title,
                  shortDescription,
                  githubRepositoryUrl,
                  technologies,
                  deployUrl,
                  year
                },
                index
              ) => (
                <tr
                  className='border-b border-slate-50/20 last:border-none'
                  key={index}
                >
                  <td className='py-4 pr-4 align-top text-sm'>
                    <span className='translate-y-px'>{year}</span>
                  </td>

                  <td className='py-4 pr-4 align-top font-semibold leading-snug text-slate-200'>
                    <div>
                      <span className='block sm:hidden'>
                        <a
                          className='inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-slate-200 focus-visible:text-teal-300 sm:hidden group/link text-base'
                          href={deployUrl || githubRepositoryUrl}
                          target='_blank'
                          rel='noreferrer noopener'
                          aria-label={`${title} (open in a new tab)`}
                        >
                          <p>
                            {' '}
                            <span className='inline-block'>
                              {title}
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                                className='inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px'
                                aria-hidden='true'
                              >
                                <path
                                  fill-rule='evenodd'
                                  d='M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z'
                                  clip-rule='evenodd'
                                ></path>
                              </svg>
                            </span>
                          </p>
                        </a>
                      </span>
                      <strong className='hidden sm:block font-semibold'>
                        {title}
                      </strong>
                    </div>
                  </td>
                  <td className='hidden py-4 pr-4 align-top text-sm lg:table-cell'>
                    <span className='translate-y-px'>{shortDescription}</span>
                  </td>
                  <td className='hidden py-4 pr-4 align-top lg:table-cell'>
                    <ul className='flex -translate-y-1.5 flex-wrap'>
                      {technologies.length > 0 &&
                        technologies.map((technology, index) => (
                          <li className='my-1 mr-1.5' key={index}>
                            <span className='flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300 '>
                              {technology}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </td>
                  <td className='hidden py-4 align-top sm:table-cell'>
                    <ul className='translate-y-1 inline-block space-x-3 whitespace-nowrap'>
                      <li className='mb-1 inline-flex items-center'>
                        <a
                          className='inline-flex items-baseline font-medium leading-tight hover:text-teal-300  text-slate-400 focus-visible:text-teal-300 group/link text-sm'
                          href={githubRepositoryUrl}
                          target='_blank'
                          rel='noreferrer'
                          aria-label={`${title} repositoty (open in a new tab)`}
                        >
                          <span className='inline-block text-sm font-medium'>
                            GitHub
                            <GitHubIcon className='inline-block h-4 w-4 shrink-0 ml-1' />
                          </span>
                        </a>
                      </li>
                      {deployUrl && (
                        <li className='mb-1 inline-flex items-center'>
                          <a
                            className='inline-flex items-baseline font-medium leading-tight hover:text-teal-300  text-slate-400 focus-visible:text-teal-300 group/link text-sm'
                            href={deployUrl}
                            target='_blank'
                            rel='noreferrer noopener'
                            aria-label={`${title} (opens in a new tab)`}
                          >
                            <span className='inline-block text-sm font-medium'>
                              {tableHeaders.deployText}
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                                className='inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-0.5'
                                aria-hidden='true'
                              >
                                <path
                                  fill-rule='evenodd'
                                  d='M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z'
                                  clip-rule='evenodd'
                                ></path>
                              </svg>
                            </span>
                          </a>
                        </li>
                      )}
                    </ul>
                  </td>
                </tr>
              )
            )}
      </tbody>
    </table>
  )
}
