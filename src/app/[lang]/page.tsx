import { Locale, i18n } from '@/i18n-config'
import { getDictionary } from '../../get-dictionary'
import Observer from '@/components/common/intersection-observer'

interface Props {
  params?: { lang: Locale }
}

export default async function Home ({ params }: Props) {
  const lang = params?.lang || i18n.defaultLocale
  const dictionary = await getDictionary(lang)

  return <Observer dictionary={dictionary} lang={lang} />
}
