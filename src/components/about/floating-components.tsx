import { GopherIcon } from './icon'
import { colors } from '@nextui-org/theme'
import clsx from 'clsx'
import Image from 'next/image'
import { BiLogoKubernetes } from 'react-icons/bi'
import { FaAws, FaDocker, FaGithub, FaReact } from 'react-icons/fa'
import { SiIbmwatson } from 'react-icons/si'
import { TbBrandTypescript } from 'react-icons/tb'
import { IconCard } from './Icon-card'
//import { UserGitHubCard } from './user-github-card'

export const FloatingComponents = () => {
  return (
    <div className='hidden md:flex flex-col relative z-20 w-1/2'>
      <>
        <FaReact
          size={50}
          className='text-cyan-400 absolute -top-[220px] -right-[40px] animate-[levitate_13s_ease_infinite_1s_reverse]'
        />

        <IconCard
          className='absolute -top-[130px] -right-[120px] animate-[levitate_10s_ease_infinite]'
          color={colors.blue[500]}
          aria-label='ts'
        >
          <TbBrandTypescript size={30} />
        </IconCard>

        <div
          className={clsx(
            'absolute -top-[260px] right-[100px] animate-[levitate_12s_ease_infinite_1s] z-0 max-w-fit',
            'bg-content1 p-4 rounded-lg  shadow-lg'
          )}
        >
          <Image
            src='/images/hero/python.png'
            width={50}
            height={50}
            alt='Python'
          />
        </div>

        <IconCard
          className='absolute left-[170px] -top-[160px] animate-[levitate_17s_ease_infinite_1s]'
          color={colors.green[500]}
          aria-label='python'
        >
          <FaGithub size={30} />
        </IconCard>

        {/* <UserGitHubCard
          avatar={'/images/hero/profile.jpg'}
          fullName={'Frainer Encarnación'}
          username='fraineralex'
          detail='FullStack Developer'
          footer='58 Repositories'
          className='absolute left-[80px] -top-[50px] animate-[levitate_16s_ease_infinite] border-none'
        /> */}

        <div className='absolute right-[110px] -top-[60px] animate-[levitate_18s_ease_infinite] z-10 max-w-fit border-none'>
          <GopherIcon height={100} width={100} />
        </div>

        <div className='absolute z-10 -top-[40px] -right-[230px] animate-[levitate_14s_ease_infinite_1s]'>
          <FaDocker size={50} className='text-primary' />
        </div>

        <IconCard
          className='absolute left-[200px] top-[160px] max-w-fit animate-[levitate_14s_ease_infinite_0.5s]'
          color={colors.yellow[500]}
          aria-label='k8s'
        >
          <BiLogoKubernetes size={50} />
        </IconCard>

        <div className='absolute right-[10px] top-[30px] animate-[levitate_16s_ease_infinite] z-10 max-w-fit border-none'>
          <SiIbmwatson size={50} />
        </div>

        <div
          className={clsx(
            'absolute right-[60px] top-[100px] animate-[levitate_12s_ease_infinite_1s] z-0 max-w-fit',
            'bg-content1 p-4 rounded-lg shadow-lg'
          )}
        >
          <FaAws aria-label='aws' size={100} />
        </div>
      </>
    </div>
  )
}
