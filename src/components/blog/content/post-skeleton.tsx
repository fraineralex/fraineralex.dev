export default function PostSkeleton () {
  return (
    <section className='min-h-screen max-w-6xl md:max-w-5xl mx-auto px-4 md:px-8 text-zinc-300 animate-pulse'>
      <div className='mx-auto w-full text-center pt-20 md:pt-28'>
        <div className='h-10 md:h-12 bg-slate-700/70 rounded-lg w-3/4 mx-auto' />
        <div className='h-10 md:h-12 bg-slate-700/70 rounded-lg w-1/2 mx-auto mt-3' />
      </div>

      <div className='cover mt-8'>
        <div className='rounded-xl mx-auto w-full min-h-[260px] md:min-h-[420px] bg-slate-800/70 border border-slate-700/80' />
      </div>

      <div className='flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 py-6'>
        <div className='h-3 bg-slate-700/70 rounded-full w-28' />
        <div className='h-3 bg-slate-700/70 rounded-full w-20' />
        <div className='h-3 bg-slate-700/70 rounded-full w-28' />
      </div>

      <article className='max-w-6xl mx-auto md:max-w-4xl px-4 md:px-8 pb-12 space-y-5'>
        <div className='h-4 bg-slate-700/70 rounded-full w-full' />
        <div className='h-4 bg-slate-700/70 rounded-full w-11/12' />
        <div className='h-4 bg-slate-700/70 rounded-full w-10/12' />
        <div className='h-4 bg-slate-700/70 rounded-full w-full' />
        <div className='h-4 bg-slate-700/70 rounded-full w-9/12' />
        <div className='h-4 bg-slate-700/70 rounded-full w-10/12' />
        <div className='h-40 bg-slate-800/70 rounded-xl border border-slate-700/80 mt-8' />
        <div className='h-4 bg-slate-700/70 rounded-full w-full' />
        <div className='h-4 bg-slate-700/70 rounded-full w-11/12' />
      </article>
    </section>
  )
}
