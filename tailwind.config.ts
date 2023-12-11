import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'yellow-js': '#FFFF00',
        'green-node': '#026e00',
        'shark': {
          '50': '#f6f7f9',
          '100': '#eceff2',
          '200': '#d5dce2',
          '300': '#afbcca',
          '400': '#8499ac',
          '500': '#657c92',
          '600': '#506479',
          '700': '#425262',
          '800': '#394653',
          '900': '#333d47',
          '950': '#232931',
      },
      'black-pearl': {
        '50': '#f3f7fc',
        '100': '#e7eff7',
        '200': '#c9dcee',
        '300': '#99c0e0',
        '400': '#62a0ce',
        '500': '#3e84b9',
        '600': '#2d689c',
        '700': '#26547e',
        '800': '#234869',
        '900': '#213d59',
        '950': '#0e1925',
    },
        
      },
      keyframes: {
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        },
        levitate: {
          '0%': {
            transform: 'translateY(0)'
          },
          '30%': {
            transform: 'translateY(-10px)'
          },
          '50%': {
            transform: 'translateY(4px)'
          },
          '70%': {
            transform: 'translateY(-15px)'
          },
          '100%': {
            transform: 'translateY(0)'
          }
        }
      },
      animation: {
        heartbeat: 'heartbeat 1s ease-in-out infinite',
        levitate: 'levitate 5s ease infinite'
      },
      matrix3d: {
        'identity': 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)',
      },
    }
  },
  plugins: []
}
export default config
