'use client'

import { FiArrowLeft } from 'react-icons/fi'
import AllProjectsCard from '../ui/projects/all-projects-cards'
import { FaListUl, FaThLarge } from 'react-icons/fa'
import { useState } from 'react'

export default function Projects () {
  const [viewType, setViewType] = useState<'list' | 'grid'>('list')

  const handleChangeViewType = () => {
    const newViewType = viewType === 'list' ? 'grid' : 'list'
    setViewType(newViewType)
  }

  const buttonListClassNames = (): string => {
    const classNames = 'bg-gray-900 bg-opacity-80 text-white'
    return viewType === 'list' ? classNames : ''
  }

  const buttonGridClassNames = (): string => {
    const classNames = 'bg-gray-900 bg-opacity-80 text-white'
    return viewType === 'grid' ? classNames : ''
  }
  return (
    <main className='mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0'>
      <section className='lg:py-24'>
        <header className='lg:pb-3'>
          <a
            className='group mb-2 inline-flex items-center font-semibold leading-tight text-teal-300'
            href='/'
          >
            <FiArrowLeft className='mr-1 h-4 w-4 transition-transform group-hover:-translate-x-2' />
            Frainer Encarnación
          </a>
          <h1 className='text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl'>
            All Projects
          </h1>
          <aside className='float-right lg:px-20 space-x-3'>
            <button
              className={`p-2.5 ${buttonListClassNames()}`}
              onClick={handleChangeViewType}
              disabled={viewType === 'list'}
            >
              <FaListUl
                className={`${
                  viewType === 'grid' ? 'hover:text-teal-300' : ''
                }`}
              />
            </button>
            <button
              className={`p-2.5 ${buttonGridClassNames()}`}
              onClick={handleChangeViewType}
              disabled={viewType === 'grid'}
            >
              <FaThLarge
                className={`${
                  viewType === 'list' ? 'hover:text-teal-300' : ''
                }`}
              />
            </button>
          </aside>
        </header>
        <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 list-none mt-10 lg:px-10'>
          {viewType === 'list' ? <h1>List View</h1> : <AllProjectsCard />}
        </ul>
      </section>
    </main>
  )
}
