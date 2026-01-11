import '@/styles/blog/tags.css'
import Link from 'next/link'
import { ReactIcon } from '@/components/blog/common/svg-icons'
import Image from 'next/image'
import { displayTags, allTags } from '@/utils/data'
import { Locale } from '@/i18n-config'
import { getDictionary } from '@/get-dictionary'
import SubscribeNewsletter from '../common/subscribe-newsletter'

interface Props {
  displayAllTags?: boolean
  lang: Locale
}

export async function ArticlesByTags ({ displayAllTags, lang }: Props) {
  const { postsByTags } = (await getDictionary(lang)).blog
  const tags = displayAllTags ? allTags : displayTags

  return (
    <section className='lg:mx-0 w-full animate-tags-section'>
      <h2 className='font-londrina text-3xl font-bold tracking-wide text-zinc-400 sm:text-4xl pb-5'>
        {postsByTags.label}
      </h2>
      <div className='w-full h-px bg-zinc-500' />
      <article className='mt-5 md:mt-10 flex flex-rows flex-wrap gap-2 sm:gap-5 text-zinc-100 mx-auto'>
        {tags &&
          tags.map((tag, index) => (
            <Link
              key={index}
              href={`/${lang}/blog/tags/${tag.name}`}
              className='border-2 border-zinc-400 group hover:border-zinc-100 items-center rounded-full flex h-8 text-sm px-3 sm:h-12 sm:text-xl sm:px-6 relative transition-all mb-1 md:mb-0'
            >
              {tag.name === 'react' ? (
                <ReactIcon className='h-3 w-3 sm:h-7 sm:w-7 text-[#149ECA] opacity-90 group-hover:opacity-100 block align-middle max-w-full' />
              ) : (
                <Image
                  src={tag.image}
                  className='h-3 w-3 sm:h-7 sm:w-7 opacity-90 group-hover:opacity-100 block align-middle max-w-full object-contain'
                  alt={`${tag.label} Logo`}
                  width={28}
                  height={28}
                />
              )}{' '}
              <span className='font-medium sm:font-semibold text-zinc-400 pl-2 sm:pl-3 group-hover:text-zinc-100'>
                {tag.label}
              </span>
            </Link>
          ))}
      </article>
      <article className='flex mx-auto mt-10'>
        <SubscribeNewsletter dictionary={postsByTags.newsletter} />
      </article>
    </section>
  )
}

export default ArticlesByTags
