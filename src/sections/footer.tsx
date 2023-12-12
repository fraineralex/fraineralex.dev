import { FooterProps } from "@/types/footer-types";
import Link from "next/link";

export default function Footer ({ dictionary }: FooterProps) {
  return (
    <footer className='max-w-md pb-16 text-sm text-slate-200/80/80 sm:pb-0'>
      <p>
        {dictionary.builtWith}{' '}
        <Link
          href='https://nextjs.org/'
          className='font-medium text-slate-200/80 hover:text-teal-200 focus-visible:text-teal-200'
          target='_blank'
          rel='noreferrer'
        >
          {dictionary.nextJs}
        </Link>{' '}
        {dictionary.and}{' '}
        <Link
          href='https://tailwindcss.com/'
          className='font-medium text-slate-200/80 hover:text-teal-200 focus-visible:text-teal-200'
          target='_blank'
          rel='noreferrer'
        >
          {dictionary.tailwindCss}
        </Link>
        , {dictionary.deployedWith}{' '}
        <Link
          href='https://vercel.com/'
          className='font-medium text-slate-200/80 hover:text-teal-200 focus-visible:text-teal-200'
          target='_blank'
          rel='noreferrer'
        >
          {dictionary.vercel}
        </Link>
        . {dictionary.allTextSetIn}{' '}
        <Link
          href='https://rsms.me/inter/'
          className='font-medium text-slate-200/80 hover:text-teal-200 focus-visible:text-teal-200'
          target='_blank'
          rel='noreferrer'
        >
          {dictionary.interTypeface}
        </Link>
        . {dictionary.specialThanksTo}{' '}
        <Link
          href='https://brittanychiang.com'
          className='font-medium text-slate-200/80 hover:text-teal-200 focus-visible:text-teal-200'
          target='_blank'
          rel='noreferrer'
        >
          Brittany Chiang
        </Link>{' '}
        {dictionary.and}{' '}
        <Link
          href='https://jhey.dev'
          className='font-medium text-slate-200/80 hover:text-teal-200 focus-visible:text-teal-200'
          target='_blank'
          rel='noreferrer'
        >
          Jhey Tompkins
        </Link>
        ; {dictionary.developerOfThe}{' '}
        <Link
          href='/plane.html'
          className='font-medium text-slate-200/80 hover:text-teal-200 focus-visible:text-teal-200'
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
