import Link from 'next/link'

type Props = {
  title: string
  href: string
  children: React.ReactNode
}

export default function ItemLink ({ title, href, children }: Props) {
  return (
    <li className='mr-5 text-xs' aria-label={title} title={title}>
      <Link
        className='block hover:text-slate-200'
        href={href}
        target='_blank'
        rel='noreferrer'
      >
        <span className='sr-only'>{title}</span>
        {children}
      </Link>
    </li>
  )
}
