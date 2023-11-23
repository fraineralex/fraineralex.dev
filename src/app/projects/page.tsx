import { FloatingComponents } from '../ui/components/about/floating-components'

const Projects = () => {
  return (
    <section className='relative w-full flex flex-col gap-4 justify-evenly min-h-[calc(100vh-4rem)]'>
      <div className='flex flex-nowrap justify-between items-center h-full w-full'>
        <FloatingComponents />
      </div>
    </section>
  )
}

export default Projects
