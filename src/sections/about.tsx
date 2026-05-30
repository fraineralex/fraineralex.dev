import { AboutProps } from '@/types/about-types'
import Link from 'next/link'
import {
  aboutSectionWidth,
  sectionFullWidth,
  stickySectionHeader
} from '@/components/layout/content-layout'

function getYearsOfExperience(): number {
  const startDate = new Date(2021, 0, 1)
  const now = new Date()
  return now.getFullYear() - startDate.getFullYear()
}

const linkClass =
  'font-medium text-white hover:text-teal-300 focus-visible:text-teal-300'

const paragraphClass = 'mb-4 text-pretty'

export default function About ({ dictionary, refAbout }: AboutProps) {
  const { paragraph1, paragraph2, paragraph3, paragraph4 } = dictionary
  const yearsOfExperience = getYearsOfExperience()
  return (
    <section
      id='about'
      className={`mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24 ${sectionFullWidth} ${aboutSectionWidth}`}
      aria-label='About me'
      ref={refAbout}
    >
      <header className={stickySectionHeader}>
        <h2 className='text-sm font-bold uppercase tracking-widest text-white lg:sr-only'>
          {dictionary.title}
        </h2>
      </header>
      <article className='w-full max-w-none'>
        <p className={paragraphClass} style={{ textWrap: 'pretty' }}>
          {paragraph1.content}{' '}
          <strong className='font-medium text-slate-50'>
            {paragraph1.strong.content}
          </strong>{' '}
          {paragraph1.experiencePrefix} {yearsOfExperience}{' '}
          {paragraph1.experienceSuffix}
        </p>
        <p className={paragraphClass} style={{ textWrap: 'pretty' }}>
          {paragraph2.before}{' '}
          <Link
            className={linkClass}
            href={paragraph2.company.url}
            target='_blank'
            rel='noreferrer'
            aria-label={paragraph2.company.name}
          >
            {paragraph2.company.label}
          </Link>
          {paragraph2.after}
        </p>
        <p className={paragraphClass} style={{ textWrap: 'pretty' }}>
          {paragraph3.before}{' '}
          <Link
            className={linkClass}
            href={paragraph3.lifter.url}
            target='_blank'
            rel='noreferrer'
            aria-label={paragraph3.lifter.name}
          >
            {paragraph3.lifter.label}
          </Link>
          {paragraph3.middle}{' '}
          <Link
            className={linkClass}
            href={paragraph3.ipp.url}
            target='_blank'
            rel='noreferrer'
            aria-label={paragraph3.ipp.name}
          >
            {paragraph3.ipp.label}
          </Link>
          {paragraph3.end}{' '}
          <Link
            className={linkClass}
            href={paragraph3.nelmix.url}
            target='_blank'
            rel='noreferrer'
            aria-label={paragraph3.nelmix.name}
          >
            {paragraph3.nelmix.label}
          </Link>
          {paragraph3.closing}
        </p>
        <p className={paragraphClass} style={{ textWrap: 'pretty' }}>
          {paragraph4.content}{' '}
          <Link
            className={linkClass}
            href={paragraph4.viollet.url}
            target='_blank'
            rel='noreferrer'
            aria-label={paragraph4.viollet.name}
          >
            {paragraph4.viollet.label}
          </Link>{' '}
          {paragraph4.middle}{' '}
          <Link
            className={linkClass}
            href={paragraph4.tracky.url}
            target='_blank'
            rel='noreferrer'
            aria-label={paragraph4.tracky.name}
          >
            {paragraph4.tracky.label}
          </Link>
          {paragraph4.closing}
        </p>
      </article>
    </section>
  )
}
