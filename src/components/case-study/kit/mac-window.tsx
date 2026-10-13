import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Download, Lock, PanelLeft, Plus, RotateCw, Share, SquareStack } from 'lucide-react'

/** Mac browser frame. Light chrome by default, shared by the case studies. Pass `light={false}` for the dark frame. */
export function MacWindow({ url, children, className = '', glow = true, light = true }: { url: string; children: ReactNode; className?: string; glow?: boolean; light?: boolean }) {
	const icon = light ? 'text-zinc-500' : 'text-zinc-400'
	const tool = `hidden size-7 shrink-0 items-center justify-center sm:flex ${icon}`
	return (
		<div className={`relative ${className}`}>
			{glow && (
				<div
					aria-hidden
					className={`pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] blur-2xl ${light ? 'bg-[radial-gradient(50%_50%_at_50%_50%,oklch(0.86_0.1_155/0.4),transparent_70%)]' : 'bg-[radial-gradient(50%_50%_at_50%_50%,oklch(0.78_0.18_282/0.22),transparent_70%)]'}`}
				/>
			)}
			<div className={light ? 'overflow-hidden rounded-xl border border-black/10 bg-[#f2f2f4] shadow-2xl shadow-black/20' : 'overflow-hidden rounded-xl border border-white/10 bg-[rgb(37,37,42)] shadow-2xl shadow-violet-950/40'}>
				<div className={`flex items-center gap-1.5 px-3 py-2 sm:gap-2 sm:px-4 ${light ? 'border-b border-black/[0.08] bg-[#e8e8ed]' : 'border-b border-white/[0.08] bg-[rgb(44,44,50)]'}`} aria-hidden>
					<div className='flex shrink-0 items-center gap-1.5'>
						<span className='size-3 rounded-full bg-[#ff5f57]' />
						<span className='size-3 rounded-full bg-[#febc2e]' />
						<span className='size-3 rounded-full bg-[#28c804]' />
					</div>
					<div className='flex min-w-0 flex-1 items-center gap-0.5 sm:gap-1'>
						<span className={`hidden size-7 shrink-0 items-center justify-center sm:flex ${light ? 'text-zinc-600' : 'text-zinc-300'}`}>
							<PanelLeft className='size-3.5' strokeWidth={2} />
						</span>
						<span className={tool}>
							<ChevronLeft className='size-3.5' strokeWidth={2.5} />
						</span>
						<span className={tool}>
							<ChevronRight className='size-3.5' strokeWidth={2.5} />
						</span>
						<div className={`mx-auto flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 sm:max-w-md sm:gap-2 sm:px-3 ${light ? 'bg-white ring-1 ring-black/[0.08]' : 'bg-[rgb(30,30,35)] ring-1 ring-white/[0.08]'}`}>
							<Lock className='size-3 shrink-0 text-zinc-500' strokeWidth={2.5} />
							<span className={`min-w-0 truncate text-center text-[11px] sm:text-xs ${light ? 'text-zinc-700' : 'text-zinc-200'}`}>{url}</span>
							<RotateCw className='ml-auto size-3 shrink-0 text-zinc-500 sm:ml-0' strokeWidth={2.5} />
						</div>
						<span className={tool}>
							<Download className='size-3.5' strokeWidth={2} />
						</span>
						<span className={`hidden size-7 shrink-0 items-center justify-center md:flex ${icon}`}>
							<Share className='size-3.5' strokeWidth={2} />
						</span>
						<span className={`hidden size-7 shrink-0 items-center justify-center md:flex ${icon}`}>
							<Plus className='size-3.5' strokeWidth={2} />
						</span>
						<span className={`hidden size-7 shrink-0 items-center justify-center md:flex ${icon}`}>
							<SquareStack className='size-3.5' strokeWidth={2} />
						</span>
					</div>
				</div>
				<div className={light ? 'bg-white' : 'bg-[oklch(0.115_0.005_282)]'}>{children}</div>
			</div>
		</div>
	)
}
