'use client'

import { useState, lazy } from 'react'
const SubscribeModal = lazy(() => import('./subscribe-modal'))

export default function SubscribeNewsletter () {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className='mx-auto max-w-xs'>
        <form className='flex items-end pt-2'>
          <input
            className='flex h-10 w-full rounded-md border bg-gray-600/10 px-3 py-4 text-sm placeholder:text-slate-300 border-teal-300'
            placeholder='Type your email...'
            type='email'
            onClick={() => setOpen(true)}
          />
          <button
            className='absolute right-0 items-center justify-center whitespace-nowrap rounded-e-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 text-slate-800 bg-teal-300 hover:bg-teal-300/90 h-10 px-4 py-2'
            type='button'
            onClick={() => setOpen(true)}
          >
            Subscribe
          </button>
        </form>
        <p className='text-slate-400 mt-2 text-center px-2 text-sm'>
          Susbcribe to the newsletter! Get the latest updates of the blog.
        </p>
      </div>

      <SubscribeModal open={open} setOpen={setOpen} />
    </>
  )
}
