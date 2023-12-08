import { Locale, i18n } from '@/i18n-config'
import { getDictionary } from '../get-dictionary'
import { About, Experience, Projects, Blog, Footer, SideNav } from '@/sections'

interface Props {
  params?: { lang: Locale }
}

export default async function Home ({ params }: Props) {
  const lang = params?.lang || i18n.defaultLocale
  const dictionary = await getDictionary(lang)

  return (
    <div className='lg:flex lg:justify-between lg:gap-10' lang={lang}>
      <SideNav dictionary={dictionary.sidenav} />
      <main id='content' className='pt-24 lg:w-1/2 lg:py-24 pr-20'>
        <About dictionary={dictionary.about} />
        <Experience dictionary={dictionary.experience} />
        <Projects dictionary={dictionary.projects}/>
        <Blog />
        <Footer />
      </main>
    </div>
  )
}
