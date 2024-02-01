import { MetadataRoute } from 'next'

export default function manifest (): MetadataRoute.Manifest {
  return {

    name: "Frainer Encarnación",
    short_name: "Frainer Encarnación",
    description:
      "I'm Frainer Encarnación, a Full Stack Developer in Dominican Republic who builds accessible products and digital experiences for the web.",
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
