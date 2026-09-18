import {
  EN_SITE_DESCRIPTION,
  EN_SITE_TITLE,
  SITE_URL
} from '@/lib/site-metadata'

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Frainer Encarnación',
  alternateName: 'Frainer Alexander Encarnación Valenzuela',
  url: SITE_URL,
  image: `${SITE_URL}/og.jpg`,
  jobTitle: 'Senior Software Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'VB Solutions',
    url: 'https://vbsolutions.info'
  },
  sameAs: [
    'https://github.com/fraineralex',
    'https://www.linkedin.com/in/fraineralex/',
    'https://twitter.com/fraineralex',
    'https://www.instagram.com/frainer.alex/'
  ],
  knowsAbout: [
    'Software Architecture',
    'TypeScript',
    'React',
    'Node.js',
    'AWS',
    'Python',
    'Cloud Products'
  ],
  description: EN_SITE_DESCRIPTION
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: EN_SITE_TITLE,
  url: SITE_URL,
  description: EN_SITE_DESCRIPTION,
  inLanguage: ['en-US', 'es-DO'],
  author: {
    '@type': 'Person',
    name: 'Frainer Encarnación',
    url: SITE_URL
  }
}

export function SiteJsonLd () {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}
