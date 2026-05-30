import { SidenavProps } from '@/types/sidenav-types'
import { LinkedinCard } from './linkedin-card'
import Link from 'next/link'
import SocialMedia from './social-media'
import {
  sidebarColumn,
  sidebarContent,
  sidebarInner,
  sidebarPadding
} from './sidebar-layout'

const lineBase =
  'h-px shrink-0 origin-left transition-[width,background-color] group-hover:w-24 group-hover:bg-slate-200 group-focus-visible:w-24 group-focus-visible:bg-slate-200 motion-reduce:transition-none'

function navLineClass (active: boolean) {
  return `${lineBase} ${active ? 'w-24 bg-slate-200' : 'w-8 bg-slate-400/70'}`
}

export default function SideNav ({ dictionary, inViews }: SidenavProps) {
  const { linkedinCard, navigation } = dictionary
  return (
    <header className={sidebarColumn}>
      <article
        className={`${sidebarPadding} mb-2 text-gray-200 lg:mb-0 lg:flex lg:h-full lg:min-h-0 lg:flex-col`}
      >
        <div className={`${sidebarContent} ${sidebarInner}`}>
          <div className='lg:shrink-0'>
            <LinkedinCard dictionary={linkedinCard} navigation={navigation} />
          </div>
          <nav
            className='nav mt-6 hidden shrink-0 lg:mt-8 lg:block'
            aria-label='In-page jump links'
          >
            <ul>
              <li>
                <Link
                  className='group flex items-center gap-4 py-2.5 lg:py-3'
                  href='#about'
                >
                  <span className={navLineClass(inViews.inViewAbout)} />
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
                <Link
                  className='group flex items-center gap-4 py-2.5 lg:py-3'
                  href='#experience'
                >
                  <span className={navLineClass(inViews.inViewExperience)} />
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
                <Link
                  className='group flex items-center gap-4 py-2.5 lg:py-3'
                  href='#projects'
                >
                  <span
                    className={navLineClass(
                      inViews.inViewProjects || inViews.inViewWriting
                    )}
                  />
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
            </ul>
          </nav>
          <div className='hidden min-h-0 lg:block lg:flex-1' aria-hidden='true' />
          <SocialMedia
            className='mt-6 hidden shrink-0 items-center lg:mt-0 lg:flex'
            navigation={navigation}
          />
        </div>
      </article>
    </header>
  )
}
