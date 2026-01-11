import { Instagram, Rss } from 'lucide-react'
import Link from 'next/link'
import '@/styles/blog/footer.css'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
const RssLink = dynamic(() => import('./rss-link'))

export default function SocialMedia () {
  return (
    <div className='flex items-center justify-center mt-4 text-center'>
      <Link
        href='https://www.linkedin.com/in/fraineralex'
        target='_blank'
        className='ml-4'
        aria-label='Linkedin'
        rel='noopener'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='h-6 w-6 text-slate-300 hover:text-white hover:scale-110'
          aria-hidden='true'
        >
          <path d='M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z'></path>
        </svg>
      </Link>
      <Link
        href='https://instagram.com/frainer.alex'
        target='_blank'
        className='ml-4'
        aria-label='Instagram'
        rel='noopener'
      >
        <Instagram className='h-6 w-6 text-slate-300 hover:text-white hover:scale-110' />
      </Link>
      <Link
        href='https://twitter.com/fraineralex'
        className='ml-4'
        aria-label='Twitter'
        rel='noopener'
      >
        <svg
          viewBox='0 0 24 24'
          fill='currentColor'
          className='h-6 w-6 text-slate-300 hover:text-white hover:scale-110'
          aria-hidden='true'
        >
          <g>
            <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'></path>
          </g>
        </svg>
      </Link>
      <Link
        href='https://github.com/fraineralex'
        target='_blank'
        className='ml-4'
        aria-label='Github'
        rel='noopener'
      >
        <svg
          className='h-6 w-6 text-slate-300 hover:text-white hover:scale-110'
          xmlns='http://www.w3.org/2000/svg'
          version='1.1'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          viewBox='0 0 16 16'
          width='16'
          height='16'
        >
          &gt;
          <g transform='matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)'>
            <path
              d='M12,0.28C5.373,0.278-0.002,5.649-0.004,12.276c-0.002,5.197,3.342,9.804,8.284,11.414h0.29 c0.551,0.034,1.026-0.385,1.06-0.936c0.003-0.041,0.003-0.083,0-0.124v-0.21c0-0.17,0-0.4,0-1.09c-0.02-0.132-0.092-0.251-0.2-0.33 c-0.118-0.095-0.272-0.132-0.42-0.1c-2.68,0.58-3.25-1.1-3.29-1.21C5.384,18.801,4.784,18.037,4,17.5 c-0.047-0.041-0.097-0.077-0.15-0.11c0.116-0.063,0.249-0.087,0.38-0.07c0.511,0.071,0.948,0.405,1.15,0.88 c0.804,1.4,2.572,1.913,4,1.16c0.15-0.065,0.258-0.2,0.29-0.36c0.038-0.463,0.236-0.897,0.56-1.23 c0.206-0.183,0.225-0.499,0.042-0.706c-0.081-0.091-0.191-0.149-0.312-0.164c-2.37-0.27-4.79-1.1-4.79-5.19 c-0.02-1.027,0.356-2.023,1.05-2.78C6.351,8.786,6.386,8.579,6.31,8.4C6.032,7.624,6.036,6.774,6.32,6 c0.924,0.164,1.791,0.559,2.52,1.15c0.122,0.086,0.277,0.112,0.42,0.07c0.893-0.242,1.814-0.367,2.74-0.37 c0.929,0.001,1.854,0.125,2.75,0.37c0.14,0.039,0.291,0.013,0.41-0.07c0.73-0.589,1.597-0.984,2.52-1.15 c0.272,0.77,0.272,1.61,0,2.38c-0.076,0.179-0.041,0.386,0.09,0.53c0.687,0.75,1.062,1.733,1.05,2.75c0,4.09-2.43,4.91-4.81,5.18 c-0.275,0.029-0.474,0.274-0.446,0.549c0.013,0.129,0.076,0.248,0.176,0.331c0.448,0.463,0.671,1.099,0.61,1.74v3.18 c-0.01,0.317,0.122,0.621,0.36,0.83c0.303,0.227,0.696,0.298,1.06,0.19c6.285-2.103,9.676-8.902,7.573-15.187 C21.71,3.592,17.147,0.296,12,0.28z'
              stroke='none'
              fill='currentColor'
              strokeWidth='0'
              strokeLinecap='round'
              strokeLinejoin='round'
            ></path>
          </g>
        </svg>
      </Link>
      <Link
        href='mailto:fraineralex2001@gmail.com'
        className='ml-4'
        aria-label='Email'
        rel='noopener'
      >
        <svg
          className='h-6 w-6 text-slate-300 hover:text-white hover:scale-110'
          xmlns='http://www.w3.org/2000/svg'
          version='1.1'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          viewBox='0 0 16 16'
          width='16'
          height='16'
        >
          &gt;
          <g transform='matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)'>
            <path
              d='M 2.25,4.5h19.5c0.828,0,1.5,0.672,1.5,1.5v12c0,0.828-0.672,1.5-1.5,1.5H2.25c-0.828,0-1.5-0.672-1.5-1.5V6 C0.75,5.172,1.422,4.5,2.25,4.5z '
              stroke='currentColor'
              fill='none'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            ></path>
            <path
              d='M 15.687,9.975L19.5,13.5 '
              stroke='currentColor'
              fill='none'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            ></path>
            <path
              d='M 8.313,9.975L4.5,13.5 '
              stroke='currentColor'
              fill='none'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            ></path>
            <path
              d='M 22.88,5.014l-9.513,6.56 c-0.823,0.568-1.911,0.568-2.734,0L1.12,5.014'
              stroke='currentColor'
              fill='none'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            ></path>
          </g>
        </svg>
      </Link>

      <Suspense
        fallback={
          <Rss className='ml-4 h-6 w-6 text-slate-300 hover:text-white hover:scale-110' />
        }
      >
        <RssLink />
      </Suspense>
    </div>
  )
}
