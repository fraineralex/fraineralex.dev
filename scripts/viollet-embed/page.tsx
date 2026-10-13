import { Suspense } from 'react'
import { LandingPrototypeApp } from '~/components/landing/landing-prototype-app'

export default function EmbedPage() {
	return (
		<div id='hero-prototype' className='hero-prototype-wrap relative'>
			<div className='hero-prototype-frame relative h-full overflow-hidden'>
				<Suspense fallback={<div className='bg-background h-full w-full' />}>
					<LandingPrototypeApp />
				</Suspense>
			</div>
		</div>
	)
}
