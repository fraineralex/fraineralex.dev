import { FooterProps } from '@/types/footer-types'
import Link from 'next/link'

export default function Footer ({ dictionary }: FooterProps) {
  return (
    <footer className='max-w-md pb-16 text-sm text-slate-300/90 sm:pb-0 animate-link'>
      <p>
        {dictionary.takeALook}{' '}
        <Link
          href={dictionary.repositoryLink}
          className='font-semibold text-slate-300 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          {dictionary.githubRepository}
        </Link>
        . {dictionary.specialThanksTo}{' '}
        <Link
          href='https://brittanychiang.com'
          className='font-semibold text-slate-200 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          Brittany Chiang
        </Link>{' '}
        {dictionary.and}{' '}
        <Link
          href='https://jhey.dev'
          className='font-semibold text-slate-200 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          Jhey Tompkins
        </Link>
        ; {dictionary.developerOfThe}{' '}
        <Link
          href='/plane.html'
          className='font-semibold text-slate-200 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          {dictionary.dCssPlane}
        </Link>
        , {dictionary.forInspiration}{' '}
      </p>
    </footer>
  )
}
