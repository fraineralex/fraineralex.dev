'use client'

import { FaThLarge, FaListUl } from 'react-icons/fa'
import { useState } from 'react'
import { ProjectInfo, TableHeaders } from '@/types/all-projects-type'
import AllProjectsGrid from '@/app/[lang]/ui/projects/all-projects-grid'
import AllProjectsList from '@/app/[lang]/ui/projects/all-projects-list'

interface Props {
  projects: ProjectInfo[]
  tableHeaders: TableHeaders
}

export default function AllProjectsContent ({ projects, tableHeaders }: Props) {
  const [viewType, setViewType] = useState<'list' | 'grid'>('list')

  const handleChangeViewType = () => {
    const newViewType = viewType === 'list' ? 'grid' : 'list'
    setViewType(newViewType)
  }

  const classNames = 'bg-gray-700 bg-opacity-80 text-white'
  const buttonListClassNames = (): string => {
    return viewType === 'list' ? classNames : ''
  }

  const buttonGridClassNames = (): string => {
    return viewType === 'grid' ? classNames : ''
  }

  return (
    <>
      <aside className='float-right lg:px-20 space-x-3'>
        <button
          className={`p-2.5 ${buttonListClassNames()}`}
          onClick={handleChangeViewType}
          disabled={viewType === 'list'}
        >
          <FaListUl
            className={`${viewType === 'grid' ? 'hover:text-teal-300' : ''}`}
          />
        </button>
        <button
          className={`p-2.5 ${buttonGridClassNames()}`}
          onClick={handleChangeViewType}
          disabled={viewType === 'grid'}
        >
          <FaThLarge
            className={`${viewType === 'list' ? 'hover:text-teal-300' : ''}`}
          />
        </button>
      </aside>
      {viewType === 'list' ? (
        <AllProjectsList projects={projects} tableHeaders={tableHeaders} />
      ) : (
        <AllProjectsGrid projects={projects} />
      )}
    </>
  )
}
