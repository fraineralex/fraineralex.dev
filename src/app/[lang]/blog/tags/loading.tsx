import { Mails, Search } from 'lucide-react'

export default function Loading () {
  return (
    <div className='min-h-screen max-w-6xl md:max-w-5xl mx-auto px-4 md:px-8 text-zinc-300'>
      <header>
        <div className={`fixed inset-x-0 top-0 z-50`}>
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

      <header className='mx-auto text-center mb-8 w-full'>
        <div className='flex items-center justify-center min-h-screen p-5 min-w-screen'>
          <div className='flex space-x-4 animate-pulse'>
            <div className='w-10 h-10 bg-gradient-to-tr from-indigo-500 to-hot-pink rounded-full '></div>
            <div className='w-10 h-10 bg-gradient-to-tr from-indigo-500 to-hot-pink rounded-full '></div>
            <div className='w-10 h-10 bg-gradient-to-tr from-indigo-500 to-hot-pink rounded-full '></div>
          </div>
        </div>
      </header>
    </div>
  )
}
