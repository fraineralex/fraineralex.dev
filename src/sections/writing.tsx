import Link from 'next/link'
import BlogCard from '@/components/blog/blog-card'
import { WiritingProps } from '@/types/writing-types'
import { ArrowRigthIcon } from '@/components/common/SvgIcons'

export default function Writing ({ dictionary, refWriting }: WiritingProps) {
  const { link } = dictionary

  return (
    <section
      id='writing'
      className='mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24'
      aria-label='Blog posts'
      ref={refWriting}
    >
      <header className='sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0'>
        <h2 className='text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only'>
          Writing
        </h2>
      </header>
      <article>
        <ol className='group/list'>
          <BlogCard
            title='Dolore rem recusandae necessitatibus ab consequatur dolorum'
            imageName='trees.jpg'
            date=' October 2023'
          />
          <BlogCard
            title='Dolore rem recusandae necessitatibus ab consequatur dolorum'
            imageName='trees.jpg'
            date=' October 2023'
          />
        </ol>
        <div className='mt-12'>
          <Link
            className='inline-flex items-center leading-tight font-semibold text-slate-200 group'
            aria-label={link.ariaLabel}
            href={link.url}
          >
            <h6>
              <strong className='border-b border-transparent pb-px transition group-hover:border-teal-300 motion-reduce:transition-none font-semibold'>
                {link.strong}{' '}
              </strong>
              <span className='whitespace-nowrap'>
                <strong className='border-b border-transparent pb-px transition group-hover:border-teal-300 motion-reduce:transition-none font-semibold'>
                  {link.span}
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
