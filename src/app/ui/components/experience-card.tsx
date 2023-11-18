import { LinkIcon } from "./SvgIcons"

type Props = {
  startDate: string
  endDate: string
  title: string
  otherTitles?: string[]
  company: {
    name: string
    website: string
  }
  description: string
  skills: string[]
}

export default function ExperienceCard ({
  startDate,
  endDate,
  title,
  otherTitles,
  company,
  description,
  skills
}: Props) {
  return (
    <li className='mb-12'>
      <div className='group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50'>
        <span className='absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg'></span>
        <aside
          className='z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2'
          aria-label='2018 to Present'
        >
          {startDate} — {endDate}
        </aside>
        <article className='z-10 sm:col-span-6'>
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
                <h5 className='text-slate-500' aria-hidden='true' key={index}>
                  {title}
                </h5>
              ))}
          </header>
          <p className='mt-2 text-sm leading-normal'>{description}</p>
          <ul className='mt-2 flex flex-wrap' aria-label='Technologies used'>
            {skills.map((skill, index) => (
              <li className='mr-1.5 mt-2' key={index}>
                <span className='flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300 '>
                  {skill}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </li>
  )
}
