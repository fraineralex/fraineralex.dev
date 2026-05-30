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
    unibeLink,
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
    <div className='flex flex-col gap-3 sm:block'>
      <div className='relative left-1/2 h-28 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden bg-slate-900 sm:relative sm:left-auto sm:h-24 sm:w-full sm:max-w-none sm:translate-x-0 sm:rounded-sm lg:rounded-sm'>
        <iframe
          title='3D CSS Plane Demo'
          className='h-full w-full'
          loading='lazy'
          src='/plane.html'
        />
      </div>
      <div className='relative h-10 sm:mt-0 sm:h-10'>
        <picture>
          <img
            className='absolute left-0 top-0 z-10 -translate-y-[55%] rounded-full border-[3px] border-slate-100 bg-slate-900 aspect-square w-[4.25rem] h-[4.25rem] sm:w-20 sm:h-20'
            src={profileImage}
            alt={`${fullname} profile picture`}
            width='80'
            height='80'
            loading='eager'
            decoding='async'
          />
        </picture>
      </div>
      <div className='flex items-start justify-between gap-3 sm:mt-2'>
        <div className='min-w-0 flex-1 space-y-1.5 sm:space-y-1'>
          <h1 className='text-base font-bold leading-tight text-white sm:text-xl'>
            {fullname}
          </h1>
          <p className='text-[11px] font-medium leading-snug text-shark-300 sm:text-sm'>
            {tagline}
          </p>
          <p className='text-[11px] font-medium text-shark-400 sm:text-sm'>
            {location}
            <span className='hidden sm:inline'> · </span>
            <span className='block font-semibold text-teal-300 sm:inline'>
              {contactInfo}
            </span>
          </p>
          <p className='hidden text-xs font-semibold text-teal-300 sm:block sm:text-sm'>
            {connections}
          </p>
        </div>
        <div className='flex shrink-0 flex-col items-center gap-4 pt-0.5 sm:gap-3 sm:pt-1'>
          <Link
            href={vbsLink.url}
            target='_blank'
            rel='noopener noreferrer'
            className='block leading-none'
          >
            <Image
              src={vbsLink.logo}
              alt='VB Solutions logo'
              width='28'
              height='9'
              className='h-auto w-7 sm:w-7'
            />
          </Link>
          <Link
            href={unibeLink.url}
            target='_blank'
            rel='noopener noreferrer'
            className='block leading-none'
          >
            <Image
              src={unibeLink.logo}
              alt='UNIBE logo'
              width='120'
              height='32'
              className='h-auto w-[4rem] sm:w-14'
            />
          </Link>
          <Link
            href={itlaLink.url}
            target='_blank'
            rel='noopener noreferrer'
            className='block leading-none'
          >
            <Image
              src={itlaLink.logo}
              alt='Itla Logo'
              width='44'
              height='22'
              className='h-auto w-10 brightness-0 invert sm:w-10'
            />
          </Link>
        </div>
      </div>
      <div className='flex flex-wrap items-center gap-2 sm:mt-3 sm:gap-2'>
        <Link
          type='button'
          className='rounded-3xl border-1 border-teal-300 bg-teal-300 px-2.5 py-1 text-[11px] font-medium text-black hover:bg-teal-600 focus-visible:bg-teal-600 sm:px-3.5 sm:text-xs'
          href={connectButton.url}
          target='_blank'
        >
          <ConnectIcon className='inline' /> {connectButton.label}
        </Link>
        <Link
          className='rounded-3xl border-2 border-teal-300 px-2.5 py-1 text-[11px] font-medium text-teal-300 hover:bg-teal-50/10 focus-visible:bg-teal-50/10 sm:px-3.5 sm:text-xs'
          aria-label='View Full Résumé'
          href={messageButton.url}
        >
          <EmailIcon className='inline w-3.5 sm:w-4' /> {messageButton.label}
        </Link>
        <Link
          className='rounded-3xl border-2 border-shark-200 px-2.5 py-1 text-[11px] font-medium text-shark-200 hover:border-shark-100 hover:bg-shark-50/10 hover:text-shark-100 focus-visible:bg-shark-50/10 sm:px-4 sm:text-xs'
          aria-label='View Full Résumé'
          href={resumeButton.url}
          target='_blank'
        >
          <BsDownload className='me-1 inline' />
          {resumeButton.label}
        </Link>
      </div>
      <SocialMedia
        className='mt-5 flex items-center pb-1 sm:mt-4 lg:hidden'
        navigation={navigation}
      />
    </div>
  )
}
