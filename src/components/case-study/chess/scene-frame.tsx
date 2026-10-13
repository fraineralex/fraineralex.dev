import type { ReactNode } from 'react'
import type { Timeline } from '../kit/scene'

export function SceneFrame({ timeline, title, kicker, caption, children, flush = false, titleLevel = 3 }: { timeline: Timeline; labels?: unknown; title?: ReactNode; kicker?: ReactNode; caption?: ReactNode; children: ReactNode; flush?: boolean; titleLevel?: 2 | 3 }) {
 // flush: the lab is full-bleed below md, so square corners and no side border keep every square's hit box intact.
 const shell = flush ? 'rounded-none border-y border-x-0 md:rounded-xl md:border' : 'rounded-xl border'
 const pad = flush ? 'px-6 md:px-5' : 'px-4 sm:px-5'
 const Title = titleLevel === 2 ? 'h2' : 'h3'
 return <div ref={timeline.ref} data-scene='' className={`min-w-0 overflow-hidden border-[#e7e5e4] bg-[#f7f6f2] text-[#1c1917] ${shell}`}>
  <div className={`flex min-h-[4rem] items-center border-b border-[#e7e5e4] py-2 ${pad}`}><div className='min-w-0'><p className='text-[11px] font-medium uppercase tracking-wide text-[#486333]'>{kicker}</p><Title className='text-sm font-semibold'>{title}</Title></div></div>
  {children}
  <div className={`min-h-[8rem] border-t border-[#e7e5e4] py-2.5 text-sm leading-relaxed text-stone-600 sm:min-h-[6rem] ${pad}`}>{caption}</div>
 </div>
}
