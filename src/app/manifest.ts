import { MetadataRoute } from 'next'
import {
  EN_SITE_DESCRIPTION,
  EN_SITE_TITLE
} from '@/lib/site-metadata'

export default function manifest (): MetadataRoute.Manifest {
  return {
    name: EN_SITE_TITLE,
    short_name: 'Frainer Encarnación',
    description: EN_SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#1F222A',
    theme_color: '#1F222A',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon'
      }
    ]
  }
}
