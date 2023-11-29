import {
  GitHubIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon
} from '../common/SvgIcons'
import ItemLink from './item-link'
import Image from 'next/image'

export default function SideNav () {
  return (
    <header className='lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24'>
      <figure className='inline-flex place-items-center lg:ms-[-10px]'>
        <Image
          width={200}
          height={200}
          className='w-auto rounded-full lg:w-2/12 p-4'
          src='/images/hero/profile.jpg'
          alt='Frainer Encarnacion profile picture'
        />
        <aside className='lg:w-5/6'>
          <h1 className='text-4xl font-bold tracking-tighter text-slate-200 sm:text-5xl ms-[-2px]'>
            <a href='/'>Frainer Encarnación</a>
          </h1>
          <h2 className='mt-2 text-lg font-medium tracking-tight text-slate-200 sm:text-xl'>
            Experienced Full Stack Developer
          </h2>
        </aside>
      </figure>
      <article className='px-6 md:px-12 lg:px-24'>
        <p className='mt-4 max-w-xs leading-normal'>
          I’m a software engineer specializing in building outstanding and
          accessible digital experiences.
        </p>
        <nav className='nav hidden lg:block' aria-label='In-page jump links'>
          <ul className='mt-16 w-max'>
            <li>
              <a className='group flex items-center py-3 active' href='#about'>
                <span className='nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none'></span>
                <span className='nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200'>
                  About
                </span>
              </a>
            </li>
            <li>
              <a className='group flex items-center py-3' href='#experience'>
                <span className='nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none'></span>
                <span className='nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200'>
                  Experience
                </span>
              </a>
            </li>
            <li>
              <a className='group flex items-center py-3' href='#projects'>
                <span className='nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none'></span>
                <span className='nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200'>
                  Projects
                </span>
              </a>
            </li>
            <li>
              <a className='group flex items-center py-3' href='#writing'>
                <span className='nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none'></span>
                <span className='nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200'>
                  Writing
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </article>
      <ul
        className='ml-1 mt-8 flex items-center px-6 md:px-12 lg:px-24'
        aria-label='Social media'
      >
        <ItemLink title='Github' href='https://github.com/fraineralex'>
          <GitHubIcon />
        </ItemLink>

        <ItemLink
          title='Linkedin'
          href='https://www.linkedin.com/in/fraineralex'
        >
          <LinkedinIcon />
        </ItemLink>

        <ItemLink title='Instagram' href='https://instagram.com/frainer.alex'>
          <InstagramIcon />
        </ItemLink>

        <ItemLink title='Twitter' href='https://twitter.com/fraineralex'>
          <XIcon />
        </ItemLink>
      </ul>
    </header>
  )
}
