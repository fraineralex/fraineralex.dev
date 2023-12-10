import { Locale, i18n } from '@/i18n-config'

interface Props {
  params: { lang?: Locale }
}

export default function BlogPage ({ params }: Props) {
  const lang = params?.lang || i18n.defaultLocale
  return (
    <>
      <h1>Blog</h1>
    </>
  )
}
