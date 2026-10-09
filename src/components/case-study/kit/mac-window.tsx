import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Download, Lock, PanelLeft, Plus, RotateCw, Share, SquareStack } from 'lucide-react'

/** Dark MacBrowserFrame from the viollet.app landing simulation, without the demo cursor plumbing. */
export function MacWindow({ url, children, className = '', glow = true }: { url: string; children: ReactNode; className?: string; glow?: boolean }) {
	return (
		<div className={`relative ${className}`}>
			{glow && <div aria-hidden className='pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(50%_50%_at_50%_50%,oklch(0.78_0.18_282/0.22),transparent_70%)] blur-2xl' />}
			<div className='overflow-hidden rounded-xl border border-white/10 bg-[rgb(37,37,42)] shadow-2xl shadow-violet-950/40'>
				<div className='flex items-center gap-1.5 border-b border-white/[0.08] bg-[rgb(44,44,50)] px-3 py-2 sm:gap-2 sm:px-4' aria-hidden>
					<div className='flex shrink-0 items-center gap-1.5'>
						<span className='size-3 rounded-full bg-[#ff5f57]' />
						<span className='size-3 rounded-full bg-[#febc2e]' />
						<span className='size-3 rounded-full bg-[#28c804]' />
					</div>
					<div className='flex min-w-0 flex-1 items-center gap-0.5 sm:gap-1'>
						<span className='hidden size-7 shrink-0 items-center justify-center text-zinc-300 sm:flex'>
							<PanelLeft className='size-3.5' strokeWidth={2} />
						</span>
						<span className='hidden size-7 shrink-0 items-center justify-center text-zinc-400 sm:flex'>
							<ChevronLeft className='size-3.5' strokeWidth={2.5} />
						</span>
						<span className='hidden size-7 shrink-0 items-center justify-center text-zinc-400 sm:flex'>
							<ChevronRight className='size-3.5' strokeWidth={2.5} />
						</span>
						<div className='mx-auto flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[rgb(30,30,35)] px-2.5 py-1.5 ring-1 ring-white/[0.08] sm:max-w-md sm:gap-2 sm:px-3'>
							<Lock className='size-3 shrink-0 text-zinc-500' strokeWidth={2.5} />
							<span className='min-w-0 truncate text-center text-[11px] text-zinc-200 sm:text-xs'>{url}</span>
							<RotateCw className='ml-auto size-3 shrink-0 text-zinc-500 sm:ml-0' strokeWidth={2.5} />
						</div>
						<span className='hidden size-7 shrink-0 items-center justify-center text-zinc-400 sm:flex'>
							<Download className='size-3.5' strokeWidth={2} />
						</span>
						<span className='hidden size-7 shrink-0 items-center justify-center text-zinc-400 md:flex'>
							<Share className='size-3.5' strokeWidth={2} />
						</span>
						<span className='hidden size-7 shrink-0 items-center justify-center text-zinc-400 md:flex'>
							<Plus className='size-3.5' strokeWidth={2} />
						</span>
						<span className='hidden size-7 shrink-0 items-center justify-center text-zinc-400 md:flex'>
							<SquareStack className='size-3.5' strokeWidth={2} />
						</span>
					</div>
				</div>
				<div className='bg-[oklch(0.115_0.005_282)]'>{children}</div>
			</div>
		</div>
	)
}

