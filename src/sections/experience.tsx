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
            startDate='Jun 2023'
            endDate='Present'
            title='Senior Software Engineer'
            company={{
              name: 'Lifter',
              website: 'https://lifterdo.com'
            }}
            description='My role is to develop and deliver customized solutions for our clients. I’m responsible for managing direct client requests, assigning tasks within the team, and developing new features and modules to meet specific requirements. Additionally, I also monitor the process pull requests for production deployments.'
            skills={['JavaScript', 'Python', 'Odoo', 'React', 'Node.js', 'AWS']}
            contract='Full-time'
            location='Santo Domingo, Dominican Republic'
            locationType='Remote'
            imageName='lifter.png'
          />
          <ExperienceCard
            startDate='Feb'
            endDate='Jun 2023'
            title='Full Stack Developer'
            company={{
              name: 'International Pack & Paper',
              website: 'https://ippdr.com'
            }}
            description='My role involved creating and customizing features to meet the needs of our clients. This included developing new functionalities, conducting thorough testing, and documenting code, as well as building web solutions using technologies such as JavaScript, Python, and CSS.'
            skills={['Python', 'JavaScript', 'Odoo', 'Docker', 'React']}
            contract='Full-time'
            location='Santo Domingo, Dominican Republic'
            locationType='Remote'
            imageName='ipp.png'
          />
          <ExperienceCard
            startDate='Sep 2022'
            endDate='Feb 2023'
            title='Full Stack Developer'
            company={{
              name: 'Nelmix',
              website: 'https://nelmix.com'
            }}
            description='I worked on creating custom modules for Odoo, focusing on accounting and product management applications tailored to meet the unique needs of our clients. Additionally, I had the opportunity to contribute to the development of various features for web applications.'
            skills={['JavaScript', 'TypeScript', 'Python', 'Odoo', 'Node.js']}
            contract='Internship'
            location='Santo Domingo, Dominican Republic'
            locationType='Remote'
            imageName='nelmix.png'
          />
        </ol>
        <div className='mt-12'>
          <a
            className='inline-flex items-center leading-tight text-slate-200 font-semibold group'
            aria-label='View Full Résumé'
            href='/resume.pdf'
            target='_blank'
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
