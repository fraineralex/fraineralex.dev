import ProjectCard from '@/components/project/project-card-square'
import { FiArrowLeft } from 'react-icons/fi'

export default function Projects () {
  return (
    <main className='mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0'>
      <section className='lg:py-24'>
        <header>
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
        </header>
        <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 list-none mt-10 lg:px-10'>
          <ProjectCard
            title='Frainer Encarnación'
            description='My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel. My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel.'
            technologies={['Next.js', 'Tailwind CSS', 'TypeScript']}
            githubRepositoryUrl=''
            deployUrl='https://frainer.com'
          />
          <ProjectCard
            title='Frainer Encarnación'
            description='My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel. My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel.'
            technologies={['Next.js', 'Tailwind CSS', 'TypeScript']}
            githubRepositoryUrl=''
            deployUrl='https://frainer.com'
          />
          <ProjectCard
            title='Frainer Encarnación'
            description='My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel. My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel.'
            technologies={['Next.js', 'Tailwind CSS', 'TypeScript']}
            githubRepositoryUrl=''
            deployUrl='https://frainer.com'
          />
          <ProjectCard
            title='Frainer Encarnación'
            description='My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel. My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel.'
            technologies={['Next.js', 'Tailwind CSS', 'TypeScript']}
            githubRepositoryUrl=''
            deployUrl='https://frainer.com'
          />
          <ProjectCard
            title='Frainer Encarnación'
            description='My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel. My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel.'
            technologies={['Next.js', 'Tailwind CSS', 'TypeScript']}
            githubRepositoryUrl=''
            deployUrl='https://frainer.com'
          />
          <ProjectCard
            title='Frainer Encarnación'
            description='My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel. My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel.'
            technologies={['Next.js', 'Tailwind CSS', 'TypeScript']}
            githubRepositoryUrl=''
            deployUrl='https://frainer.com'
          />
          <ProjectCard
            title='Frainer Encarnación'
            description='My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel. My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel.'
            technologies={['Next.js', 'Tailwind CSS', 'TypeScript']}
            githubRepositoryUrl=''
            deployUrl='https://frainer.com'
          />
          <ProjectCard
            title='Frainer Encarnación'
            description='My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel. My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel.'
            technologies={['Next.js', 'Tailwind CSS', 'TypeScript']}
            githubRepositoryUrl=''
            deployUrl='https://frainer.com'
          />
          <ProjectCard
            title='Frainer Encarnación'
            description='My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel. My personal website built with Next.js, Tailwind CSS, TypeScript, and deployed with Vercel.'
            technologies={['Next.js', 'Tailwind CSS', 'TypeScript']}
            githubRepositoryUrl=''
            deployUrl='https://frainer.com'
          />
        </ul>
      </section>
    </main>
  )
}
