import { SidenavProps } from '@/types/sidenav-types'
import { LinkedinCard } from './linkedin-card'
import Link from 'next/link'
import SocialMedia from './social-media'

export default function SideNav ({ dictionary, inViews }: SidenavProps) {
  const { linkedinCard, navigation } = dictionary
  return (
    <header className='lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-20'>
      <LinkedinCard dictionary={linkedinCard} navigation={navigation} />
      <article className='px-6 md:px-12 lg:px-20 mb-2 text-gray-200'>
        <nav className='nav hidden lg:block' aria-label='In-page jump links'>
          <ul className='mt-12 w-max'>
            <li>
              <Link
                className='group flex items-center py-3 active'
                href='#about'
              >
                <span
                  className={`nav-indicator mr-4 h-px transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none ${
                    inViews.inViewAbout
                      ? 'w-16 bg-slate-200'
                      : 'w-8 bg-slate-400/70'
                  }`}
                ></span>
                <span
                  className={`nav-text text-xs font-bold uppercase tracking-widest group-hover:text-white group-focus-visible:text-white ${
                    inViews.inViewAbout ? 'text-white' : 'text-slate-400/80'
                  }`}
                >
                  {navigation.about}
                </span>
              </Link>
            </li>
            <li>
              <Link className='group flex items-center py-3' href='#experience'>
                <span
                  className={`nav-indicator mr-4 h-px transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none ${
                    inViews.inViewExperience
                      ? 'w-16 bg-slate-200'
                      : 'w-8 bg-slate-400/70'
                  }`}
                ></span>
                <span
                  className={`nav-text text-xs font-bold uppercase tracking-widest group-hover:text-white group-focus-visible:text-white ${
                    inViews.inViewExperience
                      ? 'text-white'
                      : 'text-slate-400/80'
                  }`}
                >
                  {navigation.experience}
                </span>
              </Link>
            </li>
            <li>
              <Link className='group flex items-center py-3' href='#projects'>
                <span
                  className={`nav-indicator mr-4 h-px transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none ${
                    inViews.inViewProjects || inViews.inViewWriting
                      ? 'w-16 bg-slate-200'
                      : 'w-8 bg-slate-400/70 '
                  }`}
                ></span>
                <span
                  className={`nav-text text-xs font-bold uppercase tracking-widest group-hover:text-white group-focus-visible:text-white ${
                    inViews.inViewProjects || inViews.inViewWriting
                      ? 'text-white'
                      : 'text-slate-400/80'
                  }`}
                >
                  {navigation.projects}
                </span>
              </Link>
            </li>
            {/* <li>
              <a className='group flex items-center py-3' href='#writing'>
                <span className='nav-indicator mr-4 h-px w-8 bg-slate-400/70 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none'></span>
                <span className='nav-text text-xs font-bold uppercase tracking-widest text-slate-400/80 group-hover:text-white group-focus-visible:text-white'>
                  Writing
                </span>
              </a>
            </li> */}
          </ul>
        </nav>
      </article>
      <SocialMedia className='ml-1 mt-10 items-center px-6 md:px-12 lg:px-20 hidden lg:flex' navigation={navigation} />
    </header>
  )
}
