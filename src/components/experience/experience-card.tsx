import { ExperienceCardData } from '@/types/experience'
import { LinkIcon } from '../common/SvgIcons'
import Image from 'next/image'

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
        <span className='absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg'></span>
        <Image
          width={200}
          height={48}
          alt={`Image of the job experience ${title} at ${company.name} of Frainer Encarnación`}
          className='z-10 rounded group-hover:border-2 border-slate-200/10 transition group-hover:border-slate-200/30 sm:col-span-2 mt-2 w-20 mx-auto'
          src={`/images/experience/${imageName}`}
          style={{ color: 'transparent' }}
        />
        <aside className='z-10 sm:col-span-6'>
          <header className='font-medium leading-snug text-slate-200'>
            <h3>
              <a
                className='inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-teal-300 focus-visible:text-teal-300  group/link text-base'
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
              </a>
            </h3>
            {otherTitles &&
              otherTitles.map((title, index) => (
                <h5 className='text-gray-500' aria-hidden='true' key={index}>
                  {title}
                </h5>
              ))}
            <h5 className='text-gray-500 mt-1 text-sm' aria-hidden='true'>
              {startDate} — {endDate} · {contract}
            </h5>
            {location && locationType && (
              <h5 className='text-gray-500 mt-1 text-sm' aria-hidden='true'>
                {location} · {locationType}
              </h5>
            )}
          </header>
          <p className='mt-2.5 text-sm leading-normal'>{description}</p>
          <ul className='mt-2 flex flex-wrap' aria-label='Technologies used'>
            {skills.map((skill, index) => (
              <li className='mr-1.5 mt-2' key={index}>
                <span className='flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300 '>
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
