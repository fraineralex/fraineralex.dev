import { EducationCardData } from '@/types/education-types'
import { LinkIcon } from '../common/SvgIcons'
import Image from 'next/image'
import Link from 'next/link'

export default function EducationCard ({
  degree,
  school,
  imageSrc,
  invertLogo,
  id
}: EducationCardData) {
  return (
    <li className={`mb-12 ${id !== 0 ? 'animate-card' : undefined}`}>
      <div className='group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50'>
        <span className='absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-600/40 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg'></span>
        <Image
          width={200}
          height={48}
          alt={`${school.name} logo`}
          className={`z-10 mx-auto mt-2 hidden rounded md:inline-block md:col-span-2 group-hover:scale-110 ${
            invertLogo ? 'w-20 brightness-0 invert' : 'w-20'
          }`}
          src={imageSrc}
          style={{ color: 'transparent' }}
        />
        <aside className='z-10 sm:col-span-6'>
          <header className='font-medium leading-snug text-shark-200'>
            <h3>
              <Link
                className='inline-flex items-baseline font-medium leading-tight text-white hover:text-teal-300 focus-visible:text-teal-300 group/link'
                href={school.website}
                target='_blank'
                rel='noreferrer'
                aria-label={`${degree} at ${school.name}`}
              >
                <span className='absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block'></span>
                <span>
                  {school.name}
                  <LinkIcon />
                </span>
              </Link>
            </h3>
            <p className='mt-1 text-xs leading-normal text-slate-300/80 min-[400px]:text-sm'>
              {degree}
            </p>
          </header>
        </aside>
      </div>
    </li>
  )
}
