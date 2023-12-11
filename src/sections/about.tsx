import { CgShapeTriangle } from 'react-icons/cg'
import { AboutProps } from '@/types/about-types'

export default function About ({ dictionary, refAbout }: AboutProps) {
  const { paragraph1, paragraph2, paragraph3, skills } = dictionary
  return (
    <section
      id='about'
      className='mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24 lg:pr-6'
      aria-label='About me'
      ref={refAbout}
    >
      <header className='sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0'>
        <h2 className='text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only'>
          {dictionary.title}
        </h2>
      </header>
      <article>
        <p className='mb-4'>
          {paragraph1.content}{' '}
          <strong className='font-medium text-slate-200'>
            {paragraph1.strong.content}
          </strong>{' '}
          {paragraph1.experience}{' '}
          <a
            className='font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300'
            href={paragraph1.journey.consultancy.url}
            target='_blank'
            rel='noreferrer'
            aria-label={paragraph1.journey.consultancy.name}
          >
            {paragraph1.journey.consultancy.label}
          </a>
          {paragraph1.journey.productCompany.before}{' '}
          <a
            className='font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300'
            href={paragraph1.journey.productCompany.url}
            target='_blank'
            rel='noreferrer'
            aria-label={paragraph1.journey.productCompany.name}
          >
            {paragraph1.journey.productCompany.label}
          </a>
          {paragraph1.journey.financialConsultancy.before}{' '}
          <a
            className='font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300'
            href={paragraph1.journey.productCompany.url}
            target='_blank'
            rel='noreferrer'
            aria-label={paragraph1.journey.productCompany.name}
          >
            {paragraph1.journey.productCompany.label}
          </a>
        </p>
        <p className='mb-4'>
          {paragraph2.focus}{' '}
          <a
            className='font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300'
            href={paragraph2.lifter.url}
            target='_blank'
            rel='noreferrer'
            aria-label={paragraph2.lifter.label}
          >
            {paragraph2.lifter.label}.
          </a>{' '}
          {paragraph2.professionalRealm}{' '}
          <strong className='font-medium text-slate-200'>
            {paragraph2.personalProjects.label}{' '}
          </strong>
          {paragraph2.freelanceServices.before}{' '}
          <strong className='font-medium text-slate-200'>
            {paragraph2.freelanceServices.label}
          </strong>
        </p>
        <p className='mb-5'>{paragraph3.technologies}</p>
        <ul className='grid grid-cols-3 gap-x-10 gap-y-0 p-0 overflow-hidden list-none'>
          {skills &&
            skills.map((skill, index) => (
              <li key={index} className='text-sm flex items-center mb-2.5'>
                <CgShapeTriangle className='rotate-90 inline me-2 w-2.5 text-white' />
                {skill}
              </li>
            ))}
        </ul>
      </article>
    </section>
  )
}
