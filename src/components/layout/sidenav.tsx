import { SidenavProps } from '@/types/sidenav-types'
import { LinkedinCard } from './linkedin-card'
import Link from 'next/link'
import SocialMedia from './social-media'
import { sidebarContent, sidebarPadding } from './sidebar-layout'

export default function SideNav ({ dictionary, inViews }: SidenavProps) {
  const { linkedinCard, navigation } = dictionary
  return (
    <header className='lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-20'>
      <article className={`${sidebarPadding} mb-2 text-gray-200`}>
        <div className={sidebarContent}>
          <LinkedinCard dictionary={linkedinCard} navigation={navigation} />
          <nav className='nav block' aria-label='In-page jump links'>
            <ul className='mt-6 lg:mt-8'>
              <li>
                <Link
                  className='group flex items-center gap-4 py-2.5 lg:py-3'
                  href='#about'
                >
                  <span
                    className={`h-px w-8 shrink-0 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none ${
                      inViews.inViewAbout
                        ? 'w-16 bg-slate-200'
                        : 'bg-slate-400/70'
                    }`}
                  />
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
                  <span
                    className={`h-px w-8 shrink-0 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none ${
                      inViews.inViewExperience
                        ? 'w-16 bg-slate-200'
                        : 'bg-slate-400/70'
                    }`}
                  />
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
                    className={`h-px w-8 shrink-0 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none ${
                      inViews.inViewProjects || inViews.inViewWriting
                        ? 'w-16 bg-slate-200'
                        : 'bg-slate-400/70'
                    }`}
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
          <SocialMedia
            className='mt-6 hidden items-center lg:mt-10 lg:flex'
            navigation={navigation}
          />
        </div>
      </article>
    </header>
  )
}
