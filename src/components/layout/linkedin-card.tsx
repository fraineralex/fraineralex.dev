import Image from 'next/image'
import { BsDownload } from 'react-icons/bs'
import { ConnectIcon, EmailIcon } from '../common/SvgIcons'
import { LinkedinCardProps } from '@/types/sidenav-types'
import Link from 'next/link'
import SocialMedia from './social-media'

export const LinkedinCard = ({ dictionary, navigation }: LinkedinCardProps) => {
  const {
    profileImage,
    vbsLink,
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
      <div className='w-full aspect-[5/1] max-h-16 sm:aspect-[3/1] sm:max-h-none bg-surface-4 mt-1 md:mt-0'>
        <iframe
          title='3D CSS Plane Demo'
          className='w-full h-full'
          loading='lazy'
          src='/plane.html'
        />
      </div>
      <div className='w-content max-w-full mv-0 mx-auto grid gap-1 sm:gap-2 px-4'>
        <div className='relative flex justify-end items-center min-h-12 sm:min-h-20 py-1 mb-2 sm:mb-6'>
          <picture>
            <img
              className='absolute -top-1 sm:-top-2 transform bg-surface-4 -translate-y-1/2 left-0 rounded-full aspect-square w-[4.5rem] sm:w-[6.875rem] border-2 sm:border-4 border-text-1'
              src={profileImage}
              alt={`${fullname} profile picture`}
              width='110'
              height='110'
              loading='eager'
              decoding='async'
            />
          </picture>
          <div className='absolute right-0 top-0 flex flex-col items-end gap-3 sm:gap-4 me-4 sm:me-8 mt-8 sm:mt-20'>
            <Link
              href={vbsLink.url}
              target='_blank'
              rel='noopener noreferrer'
              className='items-center text-white bg-brand-fill block'
            >
              <Image
                src={vbsLink.logo}
                alt='VB Solutions logo'
                width='28'
                height='9'
                className='w-7 h-auto'
              />
            </Link>
            <Link
              href={itlaLink.url}
              target='_blank'
              rel='noopener noreferrer'
              className='items-center text-white bg-brand-fill block'
            >
              <Image
                src={itlaLink.logo}
                alt='Itla Logo'
                width='50'
                height='25'
                className='w-10 sm:w-50 h-auto'
              />
            </Link>
          </div>
        </div>
        <h1 className='text-fluid-3 font-bold text-xl sm:text-2xl text-white leading-tight'>
          {fullname}
        </h1>
        <div className='leading-snug'>
          <p className='mb-1.5 sm:mb-2 text-sm font-medium text-shark-300 pe-14 sm:pe-20'>
            {tagline}
          </p>
          <p className='mb-1 text-xs sm:text-sm font-medium text-shark-400'>
            {location}
            <span className='hidden sm:inline'> · </span>
            <span className='text-teal-300 sm:inline block sm:mt-0 font-semibold'>
              {contactInfo}
            </span>
          </p>
          <p className='mb-2 text-xs sm:text-sm font-semibold text-teal-300 hidden sm:block'>
            {connections}
          </p>
        </div>
        <span className='flex flex-wrap gap-1.5 sm:gap-x-3 sm:flex-nowrap items-center text-fluid--1 text-text-4'>
          <Link
            type='button'
            className='bg-teal-300 font-medium rounded-3xl text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 text-center text-black border-1 border-teal-300 align-middle hover:bg-teal-600 focus-visible:bg-teal-600'
            href={connectButton.url}
            target='_blank'
          >
            <ConnectIcon className='inline text-center' /> {connectButton.label}
          </Link>
          <Link
            className='font-medium rounded-3xl text-xs px-2.5 sm:px-4 py-1 sm:py-1.5 text-center text-teal-300 border-2 border-teal-300 hover:bg-teal-50/10 focus-visible:bg-teal-50/10'
            aria-label='View Full Résumé'
            href={messageButton.url}
          >
            <EmailIcon className='inline w-3.5 sm:w-4' /> {messageButton.label}
          </Link>
          <Link
            className='font-medium rounded-3xl text-xs px-2.5 sm:px-5 py-1 sm:py-1.5 text-center text-shark-200 border-2 border-shark-200 hover:bg-shark-50/10 focus-visible:bg-shark-50/10 hover:text-shark-100 hover:border-shark-100'
            aria-label='View Full Résumé'
            href={resumeButton.url}
            target='_blank'
          >
            <BsDownload className='inline me-1' />
            {resumeButton.label}
          </Link>
        </span>
        <SocialMedia
          className='mt-3 sm:mt-6 flex lg:hidden items-center pb-2'
          navigation={navigation}
        />
      </div>
    </article>
  )
}
