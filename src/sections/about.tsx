import Image from 'next/image'
import { FloatingComponents } from '../components/about/floating-components'
import { BsDownload } from 'react-icons/bs'
import { FaEnvelope } from 'react-icons/fa'

export default function About () {
  return (
    <section
      id='about'
      className='mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24'
      aria-label='About me'
    >
      <header className='sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0'>
        <h2 className='text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only'>
          About
        </h2>
      </header>
      <article>
        <figure className='flex justify-center'>
          <Image
            width={200}
            height={200}
            className='w-auto rounded-full'
            src='/images/hero/profile.png'
            alt='Frainer Encarnacion profile picture'
          />
        </figure>
        {/* <FloatingComponents /> */}
        <ul
          className='mt-6 mb-6 flex items-center justify-center gap-3'
          aria-label='Cotact me'
        >
          <a
            type='button'
            className='text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-4 py-3 text-center'
            href='mailto:fraineralex2001@gmail.com'
            target='_blank'
          >
            {/* <FaEnvelope className='inline me-1' /> */} Contact me
          </a>

          <a
            className='relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800'
            aria-label='View Full Résumé'
            href='/resume.pdf'
          >
            <span className='relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0'>
              <BsDownload className='inline me-1' /> Résumé
            </span>
          </a>
        </ul>
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
        <p className='mb-4'></p>
      </article>
    </section>
  )
}
