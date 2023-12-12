'use client'

import { About, Blog, Experience, Footer, Projects, SideNav } from '@/sections'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

export default function Observer ({
  dictionary,
  lang
}: {
  dictionary: any
  lang: string
}) {
  const [refAbout, inViewAbout] = useInView({
    threshold: 0.5
  })
  const [refExperience, inViewExperience] = useInView({
    threshold: 0.5
  })
  const [refProjects, inViewProjects] = useInView({
    threshold: 0.22
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
        <Blog dictionary={dictionary.writing} refWriting={refWriting} />
        <Footer dictionary={dictionary.footer} />
      </main>
    </div>
  )
}
