import Image from 'next/image'
import { LinkIcon } from '../common/SvgIcons'
import Link from 'next/link'
import TimeISO from '../common/time-iso'
import { Locale } from '@/i18n-config'

type Props = {
  title: string
  imageName: string
  date: string
  slug: string
  lang: Locale
}

export default function WritingCard ({ title, imageName, date, slug, lang }: Props) {
  const titleArray = title.split(' ')
  const TitleLastWord = titleArray.pop()
  const partialTitle = titleArray.join(' ')

  return (
    <li className='mb-10 animate-card'>
      <div className='group relative grid grid-cols-8 gap-4 transition-all sm:items-center sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50'>
        <span className='absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-600/40 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg'></span>
        <Image
          width={200}
          height={48}
          alt={`Image of the blog ${title}`}
          className='z-10 col-span-2 rounded transition sm:col-span-2 group-hover:scale-110'
          src={imageName}
          style={{ color: 'transparent' }}
        />
        <aside className='z-10 col-span-6'>
          <p className='-mt-1 text-sm font-medium leading-6 text-300/80'>
            <TimeISO stringDate={date} />
          </p>
          <h3 className='-mt-1'>
            <Link
              className='inline-flex items-baseline font-medium leading-tight text-white hover:text-teal-300 focus-visible:text-teal-300  group/link text-base'
              href={`/${lang}/blog/${slug}`}
              rel='noreferrer'
              aria-label={title}
            >
              <span className='absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block'></span>
              <p>
                {partialTitle}{' '}
                <span className='inline-block'>
                  {TitleLastWord}
                  <LinkIcon />
                </span>
              </p>
            </Link>
          </h3>
        </aside>
      </div>
    </li>
  )
}
