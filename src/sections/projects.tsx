import Link from 'next/link'
import ProjectCard from '../components/project/project-card'
import { ArrowRigthIcon } from '../components/common/SvgIcons'

export default function Projects () {
  return (
    <section
      id='projects'
      className='mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24'
      aria-label='Selected projects'
    >
      <header className='sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0'>
        <h2 className='text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only'>
          Projects
        </h2>
      </header>
      <article>
        <ol className='group/list'>
          <ProjectCard
            projectName='Hacker News Clone'
            description='Wep app that mimics Hacker News using React and the Hacker News API. It showcases the top 20 stories with infinite scrolling for a seamless news browsing experience. Additionally, it provides easy access to the comments section for each story.'
            technologies={[
              'React',
              'TypeScript',
              'Styled Componets',
              'SWR',
            ]}
            deployUrl='https://frainer-hacker-news.surge.sh'
            githubRepositoryUrl='https://github.com/fraineralex/learning-react/tree/main/projects/15-hacker-news-with-typescript-and-swr'
            /* starsOnGithub={3} */
            imageSrc='hacker-news.png'
          />
          <ProjectCard
            projectName='Project Example #1'
            description='Doloribus corporis totam nostrum illo quisquam, nisi earum iste! Sunt corrupti in, nostrum sint voluptates autem doloremque! Cum aliquid at tempore odit quidem minima dignissimos molestiae quibusdam non, facilis quo quaerat voluptate esse iure temporibus nostrum a ad vel.'
            technologies={[
              'React',
              'TypeScript',
              'Storybook',
              'Jest',
              'Cypress'
            ]}
            deployUrl='https://www.github.com'
            githubRepositoryUrl='https://www.github.com'
            starsOnGithub={514}
            imageSrc='trees.jpg'
          />
          <ProjectCard
            projectName='Project Example #1'
            description='Doloribus corporis totam nostrum illo quisquam, nisi earum iste! Sunt corrupti in, nostrum sint voluptates autem doloremque! Cum aliquid at tempore odit quidem minima dignissimos molestiae quibusdam non, facilis quo quaerat voluptate esse iure temporibus nostrum a ad vel.'
            technologies={[
              'React',
              'TypeScript',
              'Storybook',
              'Jest',
              'Cypress'
            ]}
            deployUrl='https://www.github.com'
            githubRepositoryUrl='https://www.github.com'
            starsOnGithub={514}
            imageSrc='trees.jpg'
          />
          <ProjectCard
            projectName='Project Example #1'
            description='Doloribus corporis totam nostrum illo quisquam, nisi earum iste! Sunt corrupti in, nostrum sint voluptates autem doloremque! Cum aliquid at tempore odit quidem minima dignissimos molestiae quibusdam non, facilis quo quaerat voluptate esse iure temporibus nostrum a ad vel.'
            technologies={[
              'React',
              'TypeScript',
              'Storybook',
              'Jest',
              'Cypress'
            ]}
            deployUrl='https://www.github.com'
            githubRepositoryUrl='https://www.github.com'
            starsOnGithub={514}
            imageSrc='trees.jpg'
          />
        </ol>
        <div className='mt-12'>
          <Link
            className='inline-flex items-center font-medium leading-tight text-slate-200 font-semibold text-slate-200 group'
            aria-label='View Full Project Achive'
            href='/projects'
          >
            <h6>
              <strong className='border-b border-transparent pb-px transition group-hover:border-teal-300 motion-reduce:transition-none font-semibold'>
                View Full{' '}
              </strong>
              <span className='whitespace-nowrap'>
                <strong className='border-b border-transparent pb-px transition group-hover:border-teal-300 motion-reduce:transition-none font-semibold'>
                  Project Achive
                </strong>
                <ArrowRigthIcon />
              </span>
            </h6>
          </Link>
        </div>
      </article>
    </section>
  )
}
