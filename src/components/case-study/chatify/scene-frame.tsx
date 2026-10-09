import type { ComponentProps } from 'react'
import type { SceneFrame } from '../kit/scene'

/** Chatify's light surface, scoped to the autoplay simulations. */
export function ChatifySceneFrame({ timeline, kicker, title, caption, children }: ComponentProps<typeof SceneFrame>) {
	return (
		<div ref={timeline.ref} data-scene='' className='min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-[#fffffe] text-gray-800'>
			<header className='flex h-16 items-center border-b border-gray-200 bg-gray-200 px-4 sm:px-5'>
				<div className='min-w-0'>
					<p className='text-[11px] font-medium uppercase tracking-wide text-blue-500'>{kicker}</p>
					<h3 className='truncate text-sm font-semibold'>{title}</h3>
				</div>
			</header>
			{children}
			<div className='h-[5.25rem] overflow-hidden border-t border-gray-200 px-4 py-2.5 text-sm leading-relaxed text-gray-500 sm:px-5' aria-live='polite'>
				{caption}
			</div>
		</div>
	)
}
