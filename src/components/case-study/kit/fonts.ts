import { Geist, Geist_Mono } from 'next/font/google'

// Viollet's app uses Geist; the case studies share it so they read as one family.
export const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })
export const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })
