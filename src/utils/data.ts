import { allPosts as allPostsProd } from 'contentlayer/generated'
import { allPostsDev } from '@/util/monks'
const allPosts: typeof allPostsProd =
  process.env.NODE_ENV === 'development' ? allPostsDev : allPostsProd

type tag = {
  name: string
  label: string
  image: string
  description: string
}

export const allTags: tag[] = [
  {
    name: 'javascript',
    label: 'JavaScript',
    image: '/images/tags/javascript.webp',
    description:
      'Javascript is a programming language. Although at first it was designed to provide interactivity to web pages, today its use has extended to the server (with Node.js) or native applications.'
  },
  {
    name: 'react',
    label: 'React',
    image: '/images/tags/react.svg',
    description:
      'React is an open source library created by Facebook for creating user interfaces.'
  },
  {
    name: 'nodejs',
    label: 'Node.js',
    image: '/images/tags/node.webp',
    description:
      'Node.js is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside a web browser. It allows developers to use JavaScript to write command line tools and for server-side scripting—running scripts server-side.'
  },
  {
    name: 'nextjs',
    label: 'Next.js',
    image: '/images/tags/next.ico',
    description:
      'Next.js is an open-source React front-end development web framework that enables functionality such as server-side rendering and generating static websites for React based web applications.'
  },
  {
    name: 'python',
    label: 'Python',
    image: '/images/tags/python.webp',
    description:
      "Python is a high-level, interpreted programming language with dynamic semantics. It's known for its simple, easy-to-read syntax which emphasizes readability and reduces the cost of program maintenance."
  },
    {
    name: 'typescript',
    label: 'TypeScript',
    image: '/images/tags/typescript.webp',
    description:
      'TypeScript is a statically typed superset of JavaScript that adds optional types to the language. TypeScript is designed for the development of large applications and transcompiles to JavaScript.'
  },
  {
    name: 'odoo',
    label: 'Odoo',
    image: '/images/tags/odoo.ico',
    description:
      'Odoo is a suite of open source business apps that cover all your company needs: CRM, eCommerce, accounting, inventory, point of sale, project management, etc.'
  },
  {
    name: 'css',
    label: 'CSS',
    image: '/images/tags/css.webp',
    description:
      'CSS is a styling language that allows us to provide design and representation to our websites and applications.'
  },
  {
    name: 'terminal',
    label: 'Terminal',
    image: '/images/tags/terminal.webp',
    description:
      'Increasingly, the use of the terminal is more necessary to work on both the backend and the frontend, so having knowledge about it and optimizing its operation is important.'
  },
  {
    name: 'performance',
    label: 'Web Perf',
    image: '/images/tags/performance.webp',
    description:
      'El rendimiento de una web es la percepción de un usuario que la página es rápida y responde correctamente. Para conseguirlo hay muchas buenas prácticas a seguir, técnicas a implementar y trucos que se pueden utilizar aunque a veces es algo que transciende a la parte técnica y debe verse como una mentalidad dentro de una organización o empresa.'
  },
  {
    name: 'git',
    label: 'Git',
    image: '/images/tags/git.ico',
    description:
      'Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency.'
  },

  {
    name: 'go',
    label: 'Go',
    image: '/images/tags/go.webp',
    description:
      "Go, also known as Golang, is an open-source programming language that's known for its simplicity and efficiency. It was developed by Google and is designed to be easy to use, efficient to compile, and effective at concurrency."
  },
  {
    name: 'career',
    label: 'Career',
    image: '/images/tags/work.webp',
    description:
      'Insightful advice and practical tips for advancing your career as developer. Covers goal setting, skill improvement, networking, and strategies for getting hired.'
  }
]

export const displayTags: tag[] = [
  ...new Set(
    allPosts
      .map(post => {
        return (
          post.tags.map(
            tag => allTags.find(t => t.name === tag) || ({} as tag)
          ) || []
        )
      })
      .flat()
  )
]
