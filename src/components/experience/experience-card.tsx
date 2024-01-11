import { ExperienceCardData } from '@/types/experience-types'
import { LinkIcon } from '../common/SvgIcons'
import Image from 'next/image'
import Link from 'next/link'

export default function ExperienceCard ({
  startDate,
  endDate,
  title,
  otherTitles,
  company,
  description,
  skills,
  location,
  locationType,
  contract,
  imageName
}: ExperienceCardData) {
  return (
    <li className='mb-12'>
      <div className='group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50'>
        <span className='absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-600/20 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg'></span>
        <Image
          width={200}
          height={48}
          alt={`Image of the job experience ${title} at ${company.name} of Frainer Encarnación`}
          className='z-10 rounded group-hover:border-2 border-shark-200/10 transition group-hover:border-shark-200/30 hidden md:inline-block md:col-span-2 mt-2 w-20 mx-auto'
          src={`/images/experience/${imageName}`}
          style={{ color: 'transparent' }}
        />
        <aside className='z-10 sm:col-span-6'>
          <header className='font-medium leading-snug text-shark-200'>
            <h5
              className='text-slate-300/60 mb-1 text-sm block sm:hidden'
              aria-hidden='true'
            >
              {startDate} — {endDate}
              {/*  · {contract} */}
            </h5>
            <h3>
              <Link
                className='inline-flex items-baseline font-medium leading-tight text-shark-200 hover:text-teal-300 focus-visible:text-teal-300  group/link text-base'
                href={company.website}
                target='_blank'
                rel='noreferrer'
                aria-label={`${title} at ${company.name}`}
              >
                <span className='absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block'></span>
                <span>
                  {title} ·{' '}
                  <span className='inline-block'>
                    {company.name}
                    <LinkIcon />
                  </span>
                </span>
              </Link>
            </h3>
            {otherTitles &&
              otherTitles.map((title, index) => (
                <h5
                  className='text-slate-300/60'
                  aria-hidden='true'
                  key={index}
                >
                  {title}
                </h5>
              ))}
            <h5
              className='text-slate-300/60 mt-1 text-sm hidden sm:block'
              aria-hidden='true'
            >
              {startDate} — {endDate}
              {/*  · {contract} */}
            </h5>
            {location && locationType && (
              <h5 className='text-slate-300/60 mt-1 text-sm' aria-hidden='true'>
                {location}
                {/*  · {locationType} */}
              </h5>
            )}
          </header>
          <p className='mt-2.5 text-sm leading-normal text-slate-300/90'>
            {description}
          </p>
          <ul className='mt-2 flex flex-wrap' aria-label='Technologies used'>
            {skills.map((skill, index) => (
              <li className='mr-1.5 mt-2' key={index}>
                <span className='flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-200 '>
                  {skill}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </li>
  )
}
