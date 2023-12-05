import { CgShapeTriangle } from 'react-icons/cg'
const skills = [
  'TypeScript',
  'Next.js',
  'Python',
  'React',
  'Node.js',
  'Odoo',
  'React Native',
  'C#',
  'ASP.NET'
]

export default function About () {
  return (
    <section
      id='about'
      className='mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24 lg:pr-6'
      aria-label='About me'
    >
      <header className='sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0'>
        <h2 className='text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only'>
          About
        </h2>
      </header>
      <article>
        <p className='mb-4'>
          I’m Frainer, a passionate{' '}
          <strong className='font-medium text-slate-200'>
            Full Stack Developer
          </strong>{' '}
          with over 3 years of experience, specializing in bringing ideas to
          life in the vast world of web development. Throughout my journey, I’ve
          had the privilege of contributing to software development for a{' '}
          <a
            className='font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300'
            href='https://nelmix.com/'
            target='_blank'
            rel='noreferrer'
            aria-label='Nelmix'
          >
            software consultancy
          </a>
          , a{' '}
          <a
            className='font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300'
            href='https://ippdr.com/'
            target='_blank'
            rel='noreferrer'
            aria-label='International Pack & Paper'
          >
            product company
          </a>
          , and a{' '}
          <a
            className='font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300'
            href='https://lifterdo.com'
            target='_blank'
            rel='noreferrer'
            aria-label='Lifter'
          >
            financial consultancy.
          </a>
        </p>
        <p className='mb-4'>
          Currently, I’m primarily focused on building accessible products and
          creating exceptional solutions and impactful digital experiences for
          our clients at{' '}
          <a
            className='font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300'
            href='https://lifterdo.com'
            target='_blank'
            rel='noreferrer'
            aria-label='Lifter'
          >
            Lifter.
          </a>{' '}
          Outside the professional realm, I immerse myself in exploring new
          technologies,{' '}
          <strong className='font-medium text-slate-200'>
            working on personal projects,{' '}
          </strong>
          and{' '}
          <strong className='font-medium text-slate-200'>
            offering freelance services.
          </strong>
        </p>
        <p className='mb-5'>
          Here are a few technologies I’ve been working with recently:
        </p>
        <ul className='grid grid-cols-3 gap-x-10 gap-y-0 p-0 overflow-hidden list-none'>
          {skills &&
            skills.map((skill, index) => (
              <li key={index} className='text-sm flex items-center mb-2.5'>
                <CgShapeTriangle className='rotate-90 inline me-2 w-2.5 text-white' />
                {skill}
              </li>
            ))}
        </ul>
      </article>
    </section>
  )
}
