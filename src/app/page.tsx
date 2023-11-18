import Image from 'next/image'
import About from './ui/sections/about'
import Experience from './ui/sections/experience'
import Projects from './ui/sections/projects'
import Blog from './ui/sections/blog'
import Footer from './ui/sections/footer'

export default function Home () {
  return (
    <>
      <About />
      <Experience />
      <Projects />
      <Blog />
      <Footer />
    </>
  )
}
