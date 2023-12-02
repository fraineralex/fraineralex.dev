import ProjectCard from '@/components/project/project-card-square'

export default function Projects () {
  return (
    <main className='mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0'>
      <section className='lg:py-24'>
        <header>
          <a
            className='group mb-2 inline-flex items-center font-semibold leading-tight text-teal-300'
            href='/'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
              className='mr-1 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-2'
              aria-hidden='true'
            >
              <path
                fill-rule='evenodd'
                d='M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z'
                clip-rule='evenodd'
              ></path>
            </svg>
            Frainer Encarnación
          </a>
          <h1 className='text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl'>
            All Projects
          </h1>
        </header>
        <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 list-none mt-10 lg:px-10'>
          <ProjectCard
            title='Frainer Encarnación'
            description='My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel.'
            technologies={['Next.js', 'Tailwind CSS', 'TypeScript']}
            githubRepositoryUrl=''
            deployUrl='https://frainer.com'
           />
                     <ProjectCard
            title='Frainer Encarnación'
            description='My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel.'
            technologies={['Next.js', 'Tailwind CSS', 'TypeScript']}
            githubRepositoryUrl=''
            deployUrl='https://frainer.com'
           />
                     <ProjectCard
            title='Frainer Encarnación'
            description='My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel.'
            technologies={['Next.js', 'Tailwind CSS', 'TypeScript']}
            githubRepositoryUrl=''
            deployUrl='https://frainer.com'
           />
        </ul>
      </section>
    </main>
  )
}
