import React from 'react'

export default function SearchSkeleton () {
  return (
    <div className='animate-pulse rounded w-full'>
      <article className='grid grid-cols-6 border-b border-slate-600 mx-8'>
        <aside className='border-b py-6 border-slate-800 bg-slate-800 rounded col-span-4'>
          <p className='mb-7 h-6 w-1/2 rounded-lg bg-slate-700'></p>
          <p className='mb-2 h-4 rounded-lg bg-slate-700'></p>
          <p className='mb-7 h-4 rounded-lg bg-slate-700'></p>
          <small className='flex flex-row'>
            <span className='mb-2 h-4 w-1/6 rounded-lg bg-slate-700 mr-2'></span>
            <span className='mb-2 h-4 w-3/12 rounded-lg bg-slate-700 mr-8'></span>
            <span className='mb-2 h-4 w-2/12 rounded-lg bg-slate-700 mr-2'></span>
            <span className='mb-2 h-4 w-2/12 rounded-lg bg-slate-700 mr-2'></span>
            <span className='mb-2 h-4 w-2/12 rounded-lg bg-slate-700 mr-2'></span>
          </small>
        </aside>
        <figure className='mb-5 h-30 rounded-lg bg-slate-700 mr-6 mt-10 col-span-2 ml-14'></figure>
      </article>
      <article className='grid grid-cols-6 border-b border-slate-600 mx-8'>
        <aside className='border-b py-6 border-slate-800 bg-slate-800 rounded col-span-4'>
          <p className='mb-7 h-6 w-1/2 rounded-lg bg-slate-700'></p>
          <p className='mb-2 h-4 rounded-lg bg-slate-700'></p>
          <p className='mb-7 h-4 rounded-lg bg-slate-700'></p>
          <small className='flex flex-row'>
            <span className='mb-2 h-4 w-1/6 rounded-lg bg-slate-700 mr-2'></span>
            <span className='mb-2 h-4 w-3/12 rounded-lg bg-slate-700 mr-8'></span>
            <span className='mb-2 h-4 w-2/12 rounded-lg bg-slate-700 mr-2'></span>
            <span className='mb-2 h-4 w-2/12 rounded-lg bg-slate-700 mr-2'></span>
            <span className='mb-2 h-4 w-2/12 rounded-lg bg-slate-700 mr-2'></span>
          </small>
        </aside>
        <figure className='mb-5 h-30 rounded-lg bg-slate-700 mr-6 mt-10 col-span-2 ml-14'></figure>
      </article>
      <article className='grid grid-cols-6 border-b border-slate-600 mx-8'>
        <aside className='border-b py-6 border-slate-800 bg-slate-800 rounded col-span-4'>
          <p className='mb-7 h-6 w-1/2 rounded-lg bg-slate-700'></p>
          <p className='mb-2 h-4 rounded-lg bg-slate-700'></p>
          <p className='mb-7 h-4 rounded-lg bg-slate-700'></p>
          <small className='flex flex-row'>
            <span className='mb-2 h-4 w-1/6 rounded-lg bg-slate-700 mr-2'></span>
            <span className='mb-2 h-4 w-3/12 rounded-lg bg-slate-700 mr-8'></span>
            <span className='mb-2 h-4 w-2/12 rounded-lg bg-slate-700 mr-2'></span>
            <span className='mb-2 h-4 w-2/12 rounded-lg bg-slate-700 mr-2'></span>
            <span className='mb-2 h-4 w-2/12 rounded-lg bg-slate-700 mr-2'></span>
          </small>
        </aside>
        <figure className='mb-5 h-30 rounded-lg bg-slate-700 mr-6 mt-10 col-span-2 ml-14'></figure>
      </article>
    </div>
  )
}
