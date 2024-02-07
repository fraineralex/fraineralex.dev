'use client'

import { Locale } from '@/i18n-config'
import { About, Blog, Experience, Footer, Projects, SideNav } from '@/sections'
import { useInView } from 'react-intersection-observer'

export default function Observer ({
  dictionary,
  lang
}: {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  dictionary: any
  lang: Locale
}) {
  const [refAbout, inViewAbout] = useInView({
    threshold: 0.47
  })
  const [refExperience, inViewExperience] = useInView({
    threshold: 0.5
  })
  const [refProjects, inViewProjects] = useInView({
    threshold: 0.207
  })
  const [refWriting, inViewWriting] = useInView({
    threshold: 0.7
  })

  const inViews = {
    inViewAbout,
    inViewExperience,
    inViewProjects,
    inViewWriting
  }

  return (
    <div className='lg:flex lg:justify-between lg:gap-10' lang={lang}>
      <SideNav dictionary={dictionary.sidenav} inViews={inViews} />
      <main
        id='content'
        className='pt-24 lg:w-1/2 lg:py-24 lg:pr-20 xl:pr-20 2xl:pr-20 px-6 lg:px-0 xl:px-0 2xl:px-0'
      >
        <About dictionary={dictionary.about} refAbout={refAbout} />
        <Experience
          dictionary={dictionary.experience}
          refExperience={refExperience}
        />
        <Projects dictionary={dictionary.projects} refProjects={refProjects} />
        <Blog dictionary={dictionary.writing} refWriting={refWriting} lang={lang} />
        <Footer dictionary={dictionary.footer} />
      </main>
    </div>
  )
}
