import { About, Experience, Projects, Blog, Footer, SideNav } from '../sections'

export default function Home () {
  return (
    <div className='lg:flex lg:justify-between lg:gap-10'>
      <SideNav />
      <main id='content' className='pt-24 lg:w-1/2 lg:py-24'>
        <About />
        <Experience />
        <Projects />
        <Blog />
        <Footer />
      </main>
    </div>
  )
}
