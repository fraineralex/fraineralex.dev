import Image from 'next/image'
import { BsDownload } from 'react-icons/bs'
import { ConnectIcon, EmailIcon } from '../common/SvgIcons'

export const LinkedinCard = () => {
  return (
    <article className='w-feature max-w-lg mx-auto'>
      <div className='w-full aspect-[3/1] bg-surface-4'>
        <iframe
          title="Jhey's 3D CSS Plane Demo"
          className='w-full h-full'
          loading='lazy'
          src='/plane.html'
        ></iframe>
      </div>
      <div className='w-content max-w-full mv-0 mx-auto grid gap-2 px-4'>
        <div className='relative flex justify-end items-center min-h-half-avatar py-2 mb-8'>
          <picture>
            <img
              className='absolute top-0 transform bg-surface-4 -translate-y-1/2 left-0 rounded-full aspect-square w-avatar border-4 border-text-1'
              src='/images/hero/profile.jpg'
              alt='Jhey'
              width='100'
              height='100'
              loading='eager'
              decoding='async'
            />
          </picture>
          <a
            href='https://twitter.com/intent/follow?screen_name=jh3yy'
            target='_blank'
            rel='noopener noreferrer'
            className='items-center text-white bg-brand-fill absolute block me-8 mt-32'
          >
            <Image
              src='/images/experience/lifter.png'
              alt='Lifter Logo'
              width='50'
              height='16'
            />
          </a>
          <a
            href='https://twitter.com/intent/follow?screen_name=jh3yy'
            target='_blank'
            rel='noopener noreferrer'
            className='items-center text-white bg-brand-fill absolute block me-8 mt-48'
          >
            <Image
              src='/images/hero/itla.webp'
              alt='Lifter Logo'
              width='50'
              height='25'
            />
          </a>
        </div>
        <h1 className='text-fluid-3 flex gap-x-2 items-center font-bold text-2xl text-slate-200'>
          Frainer Encarnación
          <span className='w-6 aspect-square inline-block'></span>
        </h1>
        <div className='leading-tight'>
          <p className='mb-2 font-semibold text-slate-400 pe-24'>
            Full Stack Developer specializing in building outstanding and
            accessible digital experiences.
          </p>
          <p className='mb-2 text-sm font-semibold text-gray-500'>
            Santo Domingo, Dominican Republic •{' '}
            <span className='text-blue-500 hover:underline cursor-pointer'>
              Contact info
            </span>
          </p>
          <p className='mb-2 text-sm font-semibold text-blue-500'>
            500+ connections
          </p>
        </div>
        <span className='flex gap-x-3 items-center text-fluid--1 flex-wrap text-text-4'>
          <a
            type='button'
            className='bg-blue-500 focus:ring-4 font-medium rounded-3xl text-sm px-4 py-1.5 text-center text-black border-0 border-blue-500 align-middle'
            href='https://www.linkedin.com/in/fraineralex/'
            target='_blank'
          >
            <ConnectIcon className='inline text-center' /> Connect
          </a>
          <a
            className='font-medium rounded-3xl text-sm px-4 py-1.5 text-center text-blue-500 border-2 border-blue-500'
            aria-label='View Full Résumé'
            href='mailto:fraineralex2001@gmail.com'
          >
            <EmailIcon className='inline w-4' /> Message
          </a>
          <a
            className='font-medium rounded-3xl text-sm px-5 py-1.5 text-center text-slate-300 border-2 border-slate-300'
            aria-label='View Full Résumé'
            href='/resume.pdf'
            target='_blank'
          >
            <BsDownload className='inline me-1' />
            Résumé
          </a>
        </span>
      </div>
    </article>
  )
}