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
        technologies={['React', 'TypeScript', 'AutoAnimate', 'JSONBin']}
        deployUrl='https://frainer-todo-app.surge.sh'
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
        technologies={['C#', 'ASP.NET', 'SQL Server', 'Identity']}
        githubRepositoryUrl='https://github.com/fraineralex/RealEstate-App'
      />
      <ProjectCard
        title='Programming Quizzes'
        description='A simple React-based web app to choose a programming language and respond to diverse and non-repetitive questions with code snippets.'
        technologies={['React', 'TypeScript', 'Zustand', 'Material UI']}
        deployUrl='https://programming-quizzes.surge.sh'
        githubRepositoryUrl='https://github.com/fraineralex/learning-react/tree/main/projects/09-google-translate-clone'
      />
      <ProjectCard
        title='Google Translate Clone'
        description='A simple Google Translate clone, built with React and powered by the OpenAI API.'
        technologies={['React', 'TypeScript', 'OpenAI API', 'Bootstrap']}
        deployUrl='https://frainer-google-translate.surge.sh/'
        githubRepositoryUrl='https://github.com/fraineralex/learning-react/tree/main/projects/14-programming-quizzes-with-zustand'
      />

      <ProjectCard
        title='To Do List'
        description='
        Node.js web app for task management with user-friendly features. Supports permanent/temporary logins and user info updates.'
        technologies={['Node.js', 'Express', 'Handlerbars', 'Sequelize']}
        deployUrl='https://programming-quizzes.surge.sh'
        githubRepositoryUrl='https://todolist.3.us-1.fl0.io'
      />

      <ProjectCard
        title='Net Banking App'
        description='
        Net banking app built in C# following ONION architecture and SOLID principles. Enables secure user logins and seamless financial transactions.'
        technologies={['C#', 'ASP.NET', 'SQL Server', 'Identity']}
        githubRepositoryUrl='https://github.com/fraineralex/InternetBanking-App'
      />

      <ProjectCard
        title='Social Network App'
        description='
        A Node.js Social Network App for creating user profiles, sharing posts and events, commenting, connecting with friends, and ensuring secure account access.'
        technologies={['Node.js', 'Express', 'Handlerbars', 'Sequelize']}
        /* deployUrl='https://socialnetwork.up.railway.app' */
        githubRepositoryUrl='https://github.com/fraineralex/Social-Network-App'
      />

      <ProjectCard
        title='Books App'
        description='
        Node.js-based Books App for registration of publishers, categories, authors, and their respective books.'
        technologies={['Node.js', 'Express', 'Handlerbars', 'Sequelize']}
        /* deployUrl='https://book.up.railway.app/' */
        githubRepositoryUrl='https://github.com/fraineralex/Books-App'
      />

      <ProjectCard
        title='Real Estate Manager'
        description='
        Odoo Real Estate Management module allows you to manage properties, perform custom searches, assign sales agents and much more.'
        technologies={['Python', 'Odoo', 'PostgreSQL', 'XML']}
        githubRepositoryUrl='https://github.com/fraineralex/Books-App'
      />

      <ProjectCard
        title='E-Market'
        description='
        C# ASP.NET Core web platform following SOLID principles, offering secure user login, ad management, and image uploads.'
        technologies={['C#', 'ASP.NET', 'SQL Server', 'Identity']}
        githubRepositoryUrl='https://github.com/fraineralex/E-Market-App'
      />
    </>
  )
}
