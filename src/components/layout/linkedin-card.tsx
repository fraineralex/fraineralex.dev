import Image from 'next/image'
import { BsDownload } from 'react-icons/bs'
import { ConnectIcon, EmailIcon } from '../common/SvgIcons'
import { LinkedinCardProps } from '@/types/sidenav-types'
import Link from 'next/link'
import SocialMedia from './social-media'

export const LinkedinCard = ({ dictionary, navigation }: LinkedinCardProps) => {
  const {
    profileImage,
    lifterLink,
    itlaLink,
    fullname,
    tagline,
    location,
    contactInfo,
    connections,
    connectButton,
    messageButton,
    resumeButton
  } = dictionary
  return (
    <article className='w-feature max-w-lg mx-auto'>
      <div className='w-full aspect-[3/1] bg-surface-4 mt-2 md:mt-0'>
        <iframe
          title='3D CSS Plane Demo'
          className='w-full h-full'
          loading='lazy'
          src='/plane.html'
        />
      </div>
      <div className='w-content max-w-full mv-0 mx-auto grid gap-2 px-4'>
        <div className='relative flex justify-end items-center min-h-half-avatar py-2 mb-8'>
          <picture>
            <Image
              className='absolute top-0 transform bg-surface-4 -translate-y-1/2 left-0 rounded-full aspect-square w-avatar border-4 border-text-1'
              src={profileImage}
              alt={`${fullname} profile picture`}
              width='100'
              height='100'
              loading='eager'
              decoding='async'
            />
          </picture>
          <Link
            href={lifterLink.url}
            target='_blank'
            rel='noopener noreferrer'
            className='items-center text-white bg-brand-fill absolute block me-8 mt-16 sm:mt-32'
          >
            <Image
              src={lifterLink.logo}
              alt='Lifter Logo'
              width='50'
              height='16'
            />
          </Link>
          <Link
            href={itlaLink.url}
            target='_blank'
            rel='noopener noreferrer'
            className='items-center text-white bg-brand-fill absolute block me-8 mt-32 sm:mt-48'
          >
            <Image src={itlaLink.logo} alt='Itla Logo' width='50' height='25' />
          </Link>
        </div>
        <h1 className='text-fluid-3 flex gap-x-2 items-center font-bold text-2xl text-shark-200'>
          {fullname}
          <span className='w-6 aspect-square inline-block'/>
        </h1>
        <div className='leading-tight'>
          <p className='mb-2 font-semibold text-shark-300 pe-20 sm:pe-24'>
            {tagline}
          </p>
          <p className='mb-2 text-sm font-semibold text-shark-400'>
            {location} <i className='hidden sm:inline me-1'>• </i>
            <span className='text-teal-300 hover:underline cursor-pointer block mt-2 sm:mt-0 sm:inline'>
              {contactInfo}
            </span>
          </p>
          <p className='mb-2 text-sm font-semibold text-teal-300'>
            {connections}
          </p>
        </div>
        <span className='flex gap-x-3 items-center text-fluid--1 text-text-4 whitespace-nowrap'>
          <Link
            type='button'
            className='bg-teal-300 focus:ring-4 font-medium rounded-3xl text-sm px-4 py-1.5 text-center text-black border-0 border-teal-300 align-middle hover:bg-teal-600 focus-visible:bg-teal-600'
            href={connectButton.url}
            target='_blank'
          >
            <ConnectIcon className='inline text-center' /> {connectButton.label}
          </Link>
          <Link
            className='font-medium rounded-3xl text-sm px-4 py-1.5 text-center text-teal-300 border-2 border-teal-300 hover:bg-teal-50/10 focus-visible:bg-teal-50/10'
            aria-label='View Full Résumé'
            href={messageButton.url}
          >
            <EmailIcon className='inline w-4' /> {messageButton.label}
          </Link>
          <Link
            className='font-medium rounded-3xl text-sm px-4 sm:px-5 py-1.5 text-center text-shark-300 border-2 border-shark-300 hover:bg-shark-50/10 focus-visible:bg-shark-50/10 hover:text-shark-100 hover:border-shark-100'
            aria-label='View Full Résumé'
            href={resumeButton.url}
            target='_blank'
          >
            <BsDownload className='inline me-1' />
            {resumeButton.label}
          </Link>
        </span>
        <SocialMedia
          className='mt-10 flex lg:hidden items-center'
          navigation={navigation}
        />
      </div>
    </article>
  )
}
