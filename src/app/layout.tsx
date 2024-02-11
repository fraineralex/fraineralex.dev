import '@/styles/globals.css'
import '@/styles/site.css'

interface Props {
  children: React.ReactNode
}

export default function LangLayout ({ children }: Props) {
  return <>{children}</>
}
