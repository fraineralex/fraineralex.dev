import '@/styles/blog/mdx.css'

export default function Subscribe () {
  return (
    <aside className='text-center py-16 max-w-3x subscribe max-w-6xl mx-auto md:max-w-4xl px-4 md:px-8'>
      <div className='w-full border-t-2 mb-8 border-zinc-200 squiggle'></div>
      <h3 className='font-londrina text-4xl uppercase font-bold leading-none text-zinc-100 mb-4'>
        Subscribe to the newsletter
      </h3>
      <iframe
        title='Subscribe to my newsletter'
        src='https://fraineralex.substack.com/embed'
        width='100%'
        height='150'
        className='bg-transparent border-0 flex mx-auto'
      ></iframe>
      <div className='w-full border-b-2 mt-8 border-zinc-200 squiggle'></div>
    </aside>
  )
}
