import { Mails, Search } from 'lucide-react'
import ArticleSkeleton from '@/components/blog/articles/article-skeleton'

export default function Loading () {
  return (
    <div className='relative'>
      <header>
        <div className='fixed inset-x-0 top-0 z-50'>
          <div className='container flex flex-row-reverse items-center justify-between p-6 mx-auto'>
            <div className='flex justify-between gap-8 pr-5'>
              <Search className='h-6 w-6 text-gray-700' />

              <Mails
                className='h-6 w-6 text-gray-700'
                aria-label='Go to newslatter'
                xlinkTitle='Newslatter'
              />
            </div>

            <div className='flex flex-row items-center sm:pl-5'>
              <svg
                className='text-gray-200 dark:text-gray-700 mr-1 sm:mr-2 h-6 w-6 sm:h-8 sm:w-8 shrink-0 overflow-hidden rounded-full'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z' />
              </svg>
              <div>
                <div className='w-34 h-4 bg-gray-200 rounded-full dark:bg-gray-700'></div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className='px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-26'>
        <header className='mx-auto max-w-2xl text-center'>
          <div className='h-16 bg-gray-200 rounded-xl dark:bg-gray-700 mb-7 mt-4 w-[50%] pb-2 md:pb-3 mx-auto'></div>
          <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 mb-3 w-[70%] mx-auto'></div>
        </header>

        <div className='grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3'>
          <div className='grid grid-cols-1 gap-4'>
            <ArticleSkeleton />
          </div>
          <div className='grid grid-cols-1 gap-4'>
            <ArticleSkeleton />
          </div>
          <div className='grid grid-cols-1 gap-4'>
            <ArticleSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
