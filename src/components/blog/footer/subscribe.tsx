'use client'

import '@/styles/blog/mdx.css'
import { useState } from 'react'
import SubscribeModal from '../common/subscribe-modal'

export default function Subscribe () {
  const [open, setOpen] = useState(false)

  return (
    <>
      <aside className='text-center py-16 max-w-3x subscribe max-w-6xl mx-auto md:max-w-4xl px-4 md:px-8'>
        <div className='w-full border-t-2 mb-8 border-zinc-200 squiggle'></div>
        <h3 className='font-londrina text-4xl uppercase font-bold leading-none text-zinc-100 mb-4'>
          Subscribe to the newsletter
        </h3>
        <form className='mt-8 flex flex-wrap items-center md:w-2/3 mx-auto'>
          <input
            name='email'
            className='w-full flex-1 bg-zinc-500 py-3 px-6 rounded text-white border-zinc-500'
            type='email'
            placeholder='Type your email...'
            onClick={() => setOpen(true)}
          />
          <button
            className='bg-teal-300 md:ml-3 mt-3 md:mt-0 w-full md:w-auto text-slate-900 py-3 px-6 rounded hover:squiggle font-semibold hover:bg-teal-300/80'
            type='button'
            onClick={() => setOpen(true)}
          >
            Subscribe
          </button>
        </form>
        <div className='w-full border-b-2 mt-8 border-zinc-200 squiggle'></div>
      </aside>

      <SubscribeModal open={open} setOpen={setOpen} />
    </>
  )
}
