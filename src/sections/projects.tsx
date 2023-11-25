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
            technologies={['React', 'TypeScript', 'Styled Componets', 'SWR']}
            deployUrl='https://frainer-hacker-news.surge.sh'
            githubRepositoryUrl='https://github.com/fraineralex/learning-react/tree/main/projects/15-hacker-news-with-typescript-and-swr'
            /* starsOnGithub={3} */
            imageSrc='hacker_news.png'
          />
          <ProjectCard
            projectName='To Do App'
            description='An wep application built with React that allows users to create, update, delete, and filter the tasks. Additionally, the tasks are synchronized with a backend service provided by jsonbin.io, ensuring data persistence.'
            technologies={['React', 'TypeScript', 'Auto Animate', 'JSONBin']}
            deployUrl='https://frainer-todo-app.surge.sh/'
            githubRepositoryUrl='https://github.com/fraineralex/learning-react/blob/main/projects/08-todo-app-typescript'
            imageSrc='todo.png'
          />
          <ProjectCard
            projectName='Chess AI'
            description='Artificial Intelligence Chess developed with the minimax adversarial search algorithm with alpha beta pruning. It returns the best possible move it has been able to find at the given depth within a specified time interval, at each iteration the algorithm takes into account a series of Heuristics that tell it whether a particular move is good or bad based on the future outcome it might cause.'
            technologies={['Python', 'Numpy', 'Pygame', 'MiniMax Algorithm']}
            deployUrl='https://user-images.githubusercontent.com/89224196/216224624-7c3c1718-6f93-4592-8720-afc9e4b2dc11.mp4'
            githubRepositoryUrl='https://github.com/fraineralex/ChessAI'
            /* starsOnGithub={514} */
            imageSrc='chess.png'
          />
          <ProjectCard
            projectName='Real Estate App'
            description='A real estate management web application with distinct roles (agent, client, admin, and developer), each offering specific functionalities within the system. The project utilizes an integrated RESTful API to facilitate seamless interactions. Developed under the ONION architecture in C# ASP .Net Core, it adheres to the SOLID principles for robust and scalable design.'
            technologies={['C#', 'ASP.NET', 'JavaScript', 'SQL Server', 'CSS']}
            deployUrl='https://github.com/fraineralex/RealEstate-App'
            githubRepositoryUrl='https://github.com/fraineralex/RealEstate-App'
            imageSrc='real-estate.png'
          />
        </ol>
        <div className='mt-12'>
          <Link
            className='inline-flex items-center leading-tight font-semibold text-slate-200 group'
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
