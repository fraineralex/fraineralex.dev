export default function Footer () {
  return (
    <footer className='max-w-md pb-16 text-sm text-slate-500 sm:pb-0'>
      <p>
        Built with{' '}
        <a
          href='https://nextjs.org/'
          className='font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          Next.js
        </a>{' '}
        and{' '}
        <a
          href='https://tailwindcss.com/'
          className='font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          Tailwind CSS
        </a>
        , deployed with{' '}
        <a
          href='https://vercel.com/'
          className='font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          Vercel
        </a>
        . All text is set in the{' '}
        <a
          href='https://rsms.me/inter/'
          className='font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          Inter
        </a>{' '}
        typeface. Some credits for inspiration to{' '}
        <a
          href='https://brittanychiang.com'
          className='font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          Brittany Chiang
        </a>{' '}
        and{' '}
        <a
          href='https://jhey.dev'
          className='font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          Jhey Tompkins
        </a>
        , developer of the{' '}
        <a
          href='/plane.html'
          className='font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300'
          target='_blank'
          rel='noreferrer'
        >
          3D CSS Plane
        </a>
        .{' '}
      </p>
    </footer>
  )
}
