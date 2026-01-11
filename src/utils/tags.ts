type Tag = {
  name: string
  label: string
  image: string
  description: string
  spanishLabel?: string
  spanishDescription: string
}

export const allTags: Tag[] = [
  {
    name: 'javascript',
    label: 'JavaScript',
    image: '/images/blog/tags/javascript.webp',
    description:
      'Javascript is a programming language. Although at first it was designed to provide interactivity to web pages, today its use has extended to the server (with Node.js) or native applications.',
    spanishDescription:
      'JavaScript es un lenguaje de programación. Aunque inicialmente fue diseñado para proporcionar interactividad a las páginas web, hoy en día su uso se ha extendido al servidor (con Node.js) o aplicaciones nativas.',
    spanishLabel: 'JavaScript'
  },
  {
    name: 'react',
    label: 'React',
    image: '/images/blog/tags/react.svg',
    description:
      'React is an open source library created by Facebook for creating user interfaces.',
    spanishDescription:
      'React es una biblioteca de código abierto creada por Facebook para crear interfaces de usuario.',
    spanishLabel: 'React'
  },
  {
    name: 'nodejs',
    label: 'Node.js',
    image: '/images/blog/tags/node.webp',
    description:
      'Node.js is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside a web browser. It allows developers to use JavaScript to write command line tools and for server-side scripting—running scripts server-side.',
    spanishDescription:
      'Node.js es un entorno de ejecución de JavaScript de código abierto, multiplataforma, que ejecuta código JavaScript fuera de un navegador web. Permite a los desarrolladores usar JavaScript para escribir herramientas de línea de comandos y scripts del lado del servidor.',
    spanishLabel: 'Node.js'
  },
  {
    name: 'nextjs',
    label: 'Next.js',
    image: '/images/blog/tags/next.ico',
    description:
      'Next.js is an open-source React front-end development web framework that enables functionality such as server-side rendering and generating static websites for React based web applications.',
    spanishDescription:
      'Next.js es un marco de desarrollo web de código abierto para React que permite funcionalidades como la renderización del lado del servidor y la generación de sitios web estáticos para aplicaciones web basadas en React.',
    spanishLabel: 'Next.js'
  },
  {
    name: 'python',
    label: 'Python',
    image: '/images/blog/tags/python.webp',
    description:
      "Python is a high-level, interpreted programming language with dynamic semantics. It's known for its simple, easy-to-read syntax which emphasizes readability and reduces the cost of program maintenance.",
    spanishDescription:
      'Python es un lenguaje de programación de alto nivel e interpretado con semántica dinámica. Se destaca por su sintaxis simple y fácil de leer que enfatiza la legibilidad y reduce el costo del mantenimiento del programa.',
    spanishLabel: 'Python'
  },
  {
    name: 'typescript',
    label: 'TypeScript',
    image: '/images/blog/tags/typescript.webp',
    description:
      'TypeScript is a statically typed superset of JavaScript that adds optional types to the language. TypeScript is designed for the development of large applications and transcompiles to JavaScript.',
    spanishDescription:
      'TypeScript es un superconjunto estáticamente tipado de JavaScript que agrega tipos opcionales al lenguaje. TypeScript está diseñado para el desarrollo de aplicaciones grandes y se transcompila a JavaScript.',
    spanishLabel: 'TypeScript'
  },
  {
    name: 'odoo',
    label: 'Odoo',
    image: '/images/blog/tags/odoo.ico',
    description:
      'Odoo is a suite of open source business apps that cover all your company needs: CRM, eCommerce, accounting, inventory, point of sale, project management, etc.',
    spanishDescription:
      'Odoo es un conjunto de aplicaciones empresariales de código abierto que cubren todas las necesidades de una empresa: CRM, comercio electrónico, contabilidad, inventario, punto de venta, gestión de proyectos, etc.',
    spanishLabel: 'Odoo'
  },
  {
    name: 'css',
    label: 'CSS',
    image: '/images/blog/tags/css.webp',
    description:
      'CSS is a styling language that allows us to provide design and representation to our websites and applications.',
    spanishDescription:
      'CSS es un lenguaje de estilo que nos permite proporcionar diseño y representación a nuestros sitios web y aplicaciones.',
    spanishLabel: 'CSS'
  },
  {
    name: 'terminal',
    label: 'Terminal',
    image: '/images/blog/tags/terminal.webp',
    description:
      'Increasingly, the use of the terminal is more necessary to work on both the backend and the frontend, so having knowledge about it and optimizing its operation is important.',
    spanishDescription:
      'Cada vez es más necesario el uso del terminal para trabajar tanto en el backend como en el frontend, por lo que tener conocimiento sobre él y optimizar su funcionamiento es importante.',
    spanishLabel: 'Terminal'
  },
  {
    name: 'performance',
    label: 'Web Perf',
    image: '/images/blog/tags/performance.webp',
    description:
      'El rendimiento de una web es la percepción de un usuario que la página es rápida y responde correctamente. Para conseguirlo hay muchas buenas prácticas a seguir, técnicas a implementar y trucos que se pueden utilizar aunque a veces es algo que transciende a la parte técnica y debe verse como una mentalidad dentro de una organización o empresa.',
    spanishDescription:
      'El rendimiento de una web es la percepción de un usuario de que la página es rápida y responde correctamente. Para lograrlo, hay muchas buenas prácticas a seguir, técnicas a implementar y trucos que se pueden utilizar, aunque a veces es algo que trasciende a la parte técnica y debe verse como una mentalidad dentro de una organización o empresa.',
    spanishLabel: 'Rendimiento Web'
  },
  {
    name: 'git',
    label: 'Git',
    image: '/images/blog/tags/git.ico',
    description:
      'Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency.',
    spanishDescription:
      'Git es un sistema de control de versiones distribuido, gratuito y de código abierto diseñado para manejar proyectos desde pequeños hasta muy grandes con rapidez y eficiencia.',
    spanishLabel: 'Git'
  },
  {
    name: 'go',
    label: 'Go',
    image: '/images/blog/tags/go.webp',
    description:
      "Go, also known as Golang, is an open-source programming language that's known for its simplicity and efficiency. It was developed by Google and is designed to be easy to use, efficient to compile, and effective at concurrency.",
    spanishDescription:
      'Go, también conocido como Golang, es un lenguaje de programación de código abierto conocido por su simplicidad y eficiencia. Fue desarrollado por Google y está diseñado para ser fácil de usar, eficiente para compilar y efectivo en la concurrencia.',
    spanishLabel: 'Go'
  },
  {
    name: 'career',
    label: 'Career',
    image: '/images/blog/tags/work.webp',
    description:
      'Insightful advice and practical tips for advancing your career as developer. Covers goal setting, skill improvement, networking, and strategies for getting hired.',
    spanishDescription:
      'Consejos perspicaces y tips prácticos para avanzar en tu carrera como desarrollador. Cubre establecimiento de metas, mejora de habilidades, networking y estrategias para conseguir empleo.',
    spanishLabel: 'Carrera'
  }
]

export type { Tag }
