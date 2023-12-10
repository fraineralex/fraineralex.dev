import { FooterProps } from "@/types/footer-types";

export default function Footer ({ dictionary }: FooterProps) {
  return (
    <footer className='max-w-md pb-16 text-sm text-slate-400 sm:pb-0'>
      <p>
        {dictionary.builtWith}{' '}
        <a
          href='https://nextjs.org/'
          className='font-medium text-slate-300 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          {dictionary.nextJs}
        </a>{' '}
        {dictionary.and}{' '}
        <a
          href='https://tailwindcss.com/'
          className='font-medium text-slate-300 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          {dictionary.tailwindCss}
        </a>
        , {dictionary.deployedWith}{' '}
        <a
          href='https://vercel.com/'
          className='font-medium text-slate-300 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          {dictionary.vercel}
        </a>
        . {dictionary.allTextSetIn}{' '}
        <a
          href='https://rsms.me/inter/'
          className='font-medium text-slate-300 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          {dictionary.interTypeface}
        </a>
        . {dictionary.specialThanksTo}{' '}
        <a
          href='https://brittanychiang.com'
          className='font-medium text-slate-300 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          Brittany Chiang
        </a>{' '}
        {dictionary.and}{' '}
        <a
          href='https://jhey.dev'
          className='font-medium text-slate-300 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          Jhey Tompkins
        </a>
        ; {dictionary.developerOfThe}{' '}
        <a
          href='/plane.html'
          className='font-medium text-slate-300 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          {dictionary.dCssPlane}
        </a>
        , {dictionary.forInspiration}{' '}
      </p>
    </footer>
  )
}
