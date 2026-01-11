import '@/styles/loading.css'

export default function Loading() {
  return (
    <section className='loading-section min-h-screen'>
      <div className='container-loading'>
        <svg
          id='hexagon'
          viewBox='0 0 100 100'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='loading-svg'
        >
          <g>
            <g
              id='F'
              transform='translate(36, 33)'
              fill='#64FFDA'
              style={{
                fontFamily: 'system-ui, Calibre-Medium, Calibre, sans-serif',
                fontSize: 50,
                fontWeight: 500,
                letterSpacing: '4.16666603'
              }}
            >
              <text>
                <tspan x='0.141666985' y='33'>
                  F
                </tspan>
              </text>
            </g>
            <path
              stroke='#64FFDA'
              strokeWidth='5'
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M 50, 5
                L 11, 27
                L 11, 72
                L 50, 95
                L 89, 73
                L 89, 28 z'
            />
          </g>
        </svg>
      </div>
    </section>
  )
}
