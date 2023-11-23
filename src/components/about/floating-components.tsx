import clsx from 'clsx'
import { FaDocker, FaReact } from 'react-icons/fa'
import { FaSquareJs, FaNodeJs } from 'react-icons/fa6'
import { TbBrandTypescript } from 'react-icons/tb'
import { PythonIcon, CSharpIcon, PostgreSQL } from '../common/SvgIcons'

export const FloatingComponents = () => {
  return (
    <figure className='hidden md:flex flex-col relative z-20 w-1/2'>
      <FaReact
        size={30}
        className='text-cyan-400 absolute -top-[320px] -right-[40px] animate-[levitate_14s_ease_infinite]'
      />

      <FaNodeJs
        size={30}
        className='text-green-500 absolute -top-[320px] -right-[200px] animate-[levitate_14s_ease_infinite]'
      />

      <span
        className='absolute -top-[200px] -right-[230px] animate-[levitate_14s_ease_infinite] text-blue-500'
        aria-label='ts'
      >
        <TbBrandTypescript size={30} />
      </span>

      <span
        className={clsx(
          'absolute -top-[320px] right-[180px] animate-[levitate_14s_ease_infinite] z-0 max-w-fit',
          ' p-4 rounded-lg  shadow-lg'
        )}
      >
        <PythonIcon />
      </span>

      <span
        className={clsx(
          'absolute -top-[40px] right-[180px] animate-[levitate_14s_ease_infinite] z-0 max-w-fit',
          ' p-4 rounded-lg  shadow-lg'
        )}
      >
        <CSharpIcon />
      </span>

      <span
        className='absolute right-[200px] -top-[200px] animate-[levitate_14s_ease_infinite]'
        aria-label='postgreSQL'
      >
        <PostgreSQL />
      </span>

      <span className='absolute z-10 -top-[40px] -right-[230px] animate-[levitate_14s_ease_infinite]'>
        <FaDocker size={30} className='text-cyan-400' />
      </span>

      <span className='absolute -top-[330px] right-[100px] z-0  animate-[levitate_14s_ease_infinite]'>
        <FaSquareJs size={27} className='text-yellow-js' />
      </span>
    </figure>
  )
}