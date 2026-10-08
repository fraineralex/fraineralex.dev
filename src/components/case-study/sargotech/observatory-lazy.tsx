'use client'

import dynamic from 'next/dynamic'

const CoastalObservatory = dynamic(() => import('./coastal-observatory'), {
	ssr: false,
	loading: () => <div className='h-[620px] animate-pulse bg-[#071624] motion-reduce:animate-none sm:h-[660px] lg:h-[min(76vh,760px)] lg:min-h-[610px]' aria-hidden />,
})

export default function ObservatoryLazy({ lang }: { lang: 'en' | 'es' }) {
	return <CoastalObservatory lang={lang} />
}
