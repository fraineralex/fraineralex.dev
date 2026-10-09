import type { ReactNode } from 'react'
import type { Timeline } from '../kit/scene'

export function SceneFrame({ timeline, title, kicker, caption, children }: { timeline: Timeline; labels?: unknown; title?: ReactNode; kicker?: ReactNode; caption?: ReactNode; children: ReactNode }) {
 return <div ref={timeline.ref} data-scene='' className='min-w-0 overflow-hidden rounded-xl border border-[#e7e5e4] bg-[#f7f6f2] text-[#1c1917]'>
  <div className='flex min-h-[4rem] items-center border-b border-[#e7e5e4] px-4 py-2 sm:px-5'><div className='min-w-0'><p className='text-[11px] font-medium uppercase tracking-wide text-[#486333]'>{kicker}</p><h3 className='text-sm font-semibold'>{title}</h3></div></div>
  {children}
  <div className='min-h-[8rem] border-t border-[#e7e5e4] px-4 py-2.5 text-sm leading-relaxed text-stone-600 sm:min-h-[6rem] sm:px-5'>{caption}</div>
 </div>
}
