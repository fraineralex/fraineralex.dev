import {
  GitHubIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon
} from '../common/SvgIcons'
import ItemLink from './item-link'
import { LinkedinCard } from './linkedin-card'

export default function SideNav () {
  return (
    <header className='lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-20'>
      <LinkedinCard />
      <article className='px-6 md:px-12 lg:px-20 mb-2 text-gray-200'>
        <nav className='nav hidden lg:block' aria-label='In-page jump links'>
          <ul className='mt-12 w-max'>
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
            {/* <li>
              <a className='group flex items-center py-3' href='#writing'>
                <span className='nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none'></span>
                <span className='nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200'>
                  Writing
                </span>
              </a>
            </li> */}
          </ul>
        </nav>
      </article>
      <ul
        className='ml-1 mt-10 flex items-center px-6 md:px-12 lg:px-20'
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
