import About from './ui/sections/about'
import Experience from './ui/sections/experience'
import Projects from './ui/sections/projects'
import Blog from './ui/sections/blog'
import Footer from './ui/sections/footer'
import SideNav from './ui/components/sidenav'

export default function Home () {
  return (
    <div className='lg:flex lg:justify-between lg:gap-4'>
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
