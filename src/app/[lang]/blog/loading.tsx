import ArticleSkeleton from '@/components/blog/articles/article-skeleton'

export default function Loading () {
  return (
    <div className='relative animate-pulse'>
      <div className='px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-26'>
        <header className='mx-auto max-w-2xl text-center'>
          <div className='h-16 bg-gray-200 rounded-xl dark:bg-gray-700 mb-7 mt-4 w-[50%] pb-2 md:pb-3 mx-auto'></div>
          <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 mb-3 w-[85%] mx-auto'></div>
          <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 mb-3 w-[40%] mx-auto'></div>
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
