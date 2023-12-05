import BlogCard from '../components/blog/blog-card'

export default function Blog () {
  return (
    <section
      id='writing'
      className='mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24'
      aria-label='Blog posts'
    >
      <header className='sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0'>
        <h2 className='text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only'>
          Writing
        </h2>
      </header>
      <article>
        <ol className='group/list'>
          <BlogCard
            title='Dolore rem recusandae necessitatibus ab consequatur dolorum'
            imageName='trees.jpg'
            date=' October 2023'
          />
          <BlogCard
            title='Dolore rem recusandae necessitatibus ab consequatur dolorum'
            imageName='trees.jpg'
            date=' October 2023'
          />
        </ol>
      </article>
    </section>
  )
}
