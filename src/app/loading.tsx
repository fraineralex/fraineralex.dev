'use client'

import '@/styles/loading.css'
import anime from 'animejs/lib/anime.es.js'
import { Metadata } from 'next'
import React, { useEffect } from 'react'

export const metadata: Metadata = {
  title: "Frainer Encarnación"
}

export default function Loading () {
  useEffect(() => {
    const anim = anime.timeline({
      loop: true,
      direction: 'alternate'
    })

    anim
      .add({
        targets: '#hexagon path',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutQuart',
        duration: 2000,
        delay: function (el, i) {
          return i * 250
        }
      })
      .add({
        targets: '#hexagon #F',
        duration: 1000,
        opacity: 1,
        easing: 'easeInOutQuart'
      })
  }, [])

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
              style={{ opacity: 0 }}
              font-family='system-ui,Calibre-Medium, Calibre,sans-serif'
              font-size='50'
              font-weight='500'
              letter-spacing='4.16666603'
            >
              <text>
                <tspan x='0.141666985' y='33'>
                  F
                </tspan>
              </text>
            </g>
            <path
              stroke='#64FFDA'
              stroke-width='5'
              stroke-linecap='round'
              stroke-linejoin='round'
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
