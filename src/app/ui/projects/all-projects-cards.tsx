import ProjectCard from '@/components/project/project-card-square'

export default function AllProjectsCard () {
  return (
    <>
      <ProjectCard
        title='Hacker News Clone'
        description='A simple Hacker News clone built with React and the Hacker News API. It showcases the top 20 stories with infinite scrolling for a seamless news browsing experience.'
        technologies={['React', 'TypeScript', 'Styled Compts', 'SWR']}
        githubRepositoryUrl='https://github.com/fraineralex/learning-react/tree/main/projects/15-hacker-news-with-typescript-and-swr'
        deployUrl='https://frainer-hacker-news.surge.sh'
      />
      <ProjectCard
        title='To Do App'
        description='A single page app to manage todos, the todos are synchronized with a backend service provided by jsonbin.io, ensuring data persistence.'
        technologies={['React', 'TypeScript', 'Auto Animate', 'JSONBin']}
        deployUrl='https://frainer-todo-app.surge.sh/'
        githubRepositoryUrl='https://github.com/fraineralex/learning-react/blob/main/projects/08-todo-app-typescript'
      />
      <ProjectCard
        title='Chess AI'
        description='Chess AI project utilizing the minimax adversarial search algorithm with alpha-beta pruning and heuristics. The system is designed to determine the optimal move within a specified depth.'
        technologies={['Python', 'Numpy', 'Pygame']}
        deployUrl='https://user-images.githubusercontent.com/89224196/216224624-7c3c1718-6f93-4592-8720-afc9e4b2dc11.mp4'
        githubRepositoryUrl='https://github.com/fraineralex/ChessAI'
      />
      <ProjectCard
        title='Real Estate App'
        description='A real estate management web app with four distinct roles, each offering specific functionalities within the system to manage the real estate properties.'
        technologies={['C#', 'ASP.NET', 'JavaScript', 'SQL Server']}
        deployUrl='https://github.com/fraineralex/RealEstate-App'
        githubRepositoryUrl='https://github.com/fraineralex/RealEstate-App'
      />
    </>
  )
}
