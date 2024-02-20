import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tags"
}

export default function Loading () {
  return (
    <div className='min-h-screen max-w-6xl md:max-w-5xl mx-auto px-4 md:px-8 text-zinc-300'>
      <header className='mx-auto text-center mb-8 w-full'>
        <div className='flex items-center justify-center min-h-screen p-5 min-w-screen'>
        <div className='flex space-x-4 animate-pulse'>
            <div className='w-10 h-10 bg-gradient-to-tr from-indigo-500 to-teal-300 rounded-full '/>
            <div className='w-10 h-10 bg-gradient-to-tr from-indigo-500 to-teal-300 rounded-full '/>
            <div className='w-10 h-10 bg-gradient-to-tr from-indigo-500 to-teal-300 rounded-full '/>
          </div>
        </div>
      </header>
    </div>
  )
}
