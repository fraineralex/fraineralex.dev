import EducationCard from '@/components/education/education-card'
import {
  sectionFullWidth,
  stickySectionHeader
} from '@/components/layout/content-layout'
import { EducationProps } from '@/types/education-types'

export default function Education ({ dictionary }: EducationProps) {
  const { title, cards } = dictionary
  return (
    <section
      id='education'
      className={`mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24 ${sectionFullWidth}`}
      aria-label='Education'
    >
      <header className={stickySectionHeader}>
        <h2 className='text-sm font-bold uppercase tracking-widest text-white lg:sr-only'>
          {title}
        </h2>
      </header>
      <article>
        <ol className='group/list'>
          {cards.map((card, index) => (
            <EducationCard key={index} {...card} id={index} />
          ))}
        </ol>
      </article>
    </section>
  )
}
