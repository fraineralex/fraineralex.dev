import { ExperienceProps } from '@/types/experience-types'
import { ArrowRigthIcon } from '../components/common/SvgIcons'
import ExperienceCard from '../components/experience/experience-card'
import Link from 'next/link'

export default function Experience ({
  dictionary,
  refExperience
}: ExperienceProps) {
  const { title, cards, resumeButton } = dictionary
  return (
    <section
      id='experience'
      className='mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24 animate-fade-in-up animate-delay-400 animate-duration-slow'
      aria-label='Work experience'
      ref={refExperience}
    >
      <header className='sticky top-0 z-20 -mx-6 mb-4 w-screen bg-gradient-to-r from-black-pear-950/75 to-shark-950/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0'>
        <h2 className='text-sm font-bold uppercase tracking-widest text-white lg:sr-only'>
          {title}
        </h2>
      </header>
      <article>
        <ol className='group/list'>
          {cards.length > 0 &&
            cards.map((card, index) => (
              <ExperienceCard
                key={index}
                startDate={card.startDate}
                endDate={card.endDate}
                title={card.title}
                company={card.company}
                description={card.description}
                skills={card.skills}
                contract={card.contract}
                location={card.location}
                locationType={card.locationType}
                imageName={card.imageName}
                id={index}
              />
            ))}
        </ol>
        <div className='mt-12 animate-link'>
          <Link
            className='inline-flex items-center leading-tight text-slate-200 font-semibold group'
            aria-label={`${resumeButton.strong} ${resumeButton.label}`}
            href={resumeButton.url}
            target='_blank'
          >
            <h6>
              <strong className='border-b border-transparent pb-px transition group-hover:border-teal-300 motion-reduce:transition-none font-semibold'>
                {resumeButton.strong}{' '}
              </strong>
              <span className='whitespace-nowrap'>
                <strong className='border-b border-transparent pb-px transition group-hover:border-teal-300 motion-reduce:transition-none font-semibold'>
                  {resumeButton.label}
                </strong>
                <ArrowRigthIcon />
              </span>
            </h6>
          </Link>
        </div>
      </article>
    </section>
  )
}
