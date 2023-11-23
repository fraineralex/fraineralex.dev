import { ArrowRigthIcon, LinkIcon } from '../components/common/SvgIcons'
import ExperienceCard from '../components/experience/experience-card'

export default function Experience () {
  return (
    <section
      id='experience'
      className='mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24'
      aria-label='Work experience'
    >
      <header className='sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0'>
        <h2 className='text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only'>
          Experience
        </h2>
      </header>
      <article>
        <ol className='group/list'>
          <ExperienceCard
            startDate='2018'
            endDate='Present'
            title='Senior Software Engineer'
            company={{
              name: 'Dell',
              website: 'https://dell.com'
            }}
            description='I work on a team that builds and maintains a design system for Dell’s internal applications. I also work on a team that builds and maintains a design system for Dell’s internal applications.'
            skills={['React', 'TypeScript', 'Storybook', 'Jest', 'Cypress']}
          />
          <ExperienceCard
            startDate='2018'
            endDate='Present'
            title='Senior Software Engineer'
            company={{
              name: 'Dell',
              website: 'https://dell.com'
            }}
            description='I work on a team that builds and maintains a design system for Dell’s internal applications. I also work on a team that builds and maintains a design system for Dell’s internal applications.'
            skills={['React', 'TypeScript', 'Storybook', 'Jest', 'Cypress']}
          />
          <ExperienceCard
            startDate='2018'
            endDate='Present'
            title='Senior Software Engineer'
            company={{
              name: 'Dell',
              website: 'https://dell.com'
            }}
            description='I work on a team that builds and maintains a design system for Dell’s internal applications. I also work on a team that builds and maintains a design system for Dell’s internal applications.'
            skills={['React', 'TypeScript', 'Storybook', 'Jest', 'Cypress']}
          />
        </ol>
        <div className='mt-12'>
          <a
            className='inline-flex items-center font-medium leading-tight text-slate-200 font-semibold text-slate-200 group'
            aria-label='View Full Résumé'
            href='/resume.pdf'
          >
            <h6>
              <strong className='border-b border-transparent pb-px transition group-hover:border-teal-300 motion-reduce:transition-none font-semibold'>
                View Full{' '}
              </strong>
              <span className='whitespace-nowrap'>
                <strong className='border-b border-transparent pb-px transition group-hover:border-teal-300 motion-reduce:transition-none font-semibold'>
                  Résumé
                </strong>
                <ArrowRigthIcon />
              </span>
            </h6>
          </a>
        </div>
      </article>
    </section>
  )
}
