import { getViewCount } from '@/lib/views'
import { Eye } from 'lucide-react'

interface Props {
  slug: string
  className?: string
}

export async function ViewCount({ slug, className }: Props) {
  const views = await getViewCount(slug)
  
  return (
    <span
      title='View counter for this page'
      className={`flex items-center gap-1 ${className ?? ''}`}
    >
      <Eye className='w-5 h-5' />
      {Intl.NumberFormat('en-US', { notation: 'compact' }).format(views)}
    </span>
  )
}

export function ViewCountSkeleton({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-1 ${className ?? ''}`}>
      <Eye className='w-5 h-5' />
      <span className='inline-block w-8 h-4 bg-zinc-700 rounded animate-pulse' />
    </span>
  )
}
