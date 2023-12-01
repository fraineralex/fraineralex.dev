export default function ProjectCardSquare () {
  return (
    <li className='transition-all duration-250 ease-in-out opacity-100 transform matrix3d-identity relative '>
      <article className='shadow-md flex justify-between flex-col items-center relative h-full p-8 py-7 rounded-md bg-gray-900 transition-all duration-300 ease-in-out overflow-auto'>
        <header>
          <div className='flex justify-between items-center mb-9'>
            <span className='text-cyan-200'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                role='img'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                stroke-width='1'
                stroke-linecap='round'
                stroke-linejoin='round'
                className='w-10 h-10 fill-none align-middle'
              >
                <title>Folder</title>
                <path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'></path>
              </svg>
            </span>
            <span className='flex items-center -mr-3 text-gray-200'>
              <a
                href=''
                aria-label='External Link'
                className='fles justify-center items-center px-1 py-2 relative'
                target='_blank'
                rel='noopener noreferrer'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  role='img'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  className='-mt-1 w-6 h-6'
                >
                  <title>External Link</title>
                  <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
                  <polyline points='15 3 21 3 21 9'></polyline>
                  <line x1='10' y1='14' x2='21' y2='3'></line>
                </svg>
              </a>
            </span>
          </div>
          <h3 className='mt-2 text-2xl text-white'>
            <a
              href=''
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block decoration-none text-inherit transition-colors duration-200 ease-in-out hover:text-cyan-200'
            >
              Chess AI
            </a>
          </h3>
          <p className='text-gray-200 text-base mt-3'>
            Chess AI developed with the minimax adversarial search algorithm
            with alpha beta pruning and a set of heuristics that ensure great
            moves are made regardless of depth.
          </p>
        </header>
        <footer>
          <ul className='flex flex-wrap items-end list-none mt-5'>
            <li className='mr-4'>Python</li>
            <li className='mr-4'>Pygame</li>
            <li className='mr-4'>Numpy</li>
            <li className=''>Chess lib</li>
          </ul>
        </footer>
      </article>
    </li>
  )
}
