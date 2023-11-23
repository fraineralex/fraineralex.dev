import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        'yellow-js': '#FFFF00',
        'green-node': '#026e00'
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
      }
    }
  },
  plugins: []
}
export default config
