'use client'

import dynamic from 'next/dynamic'
import { Component, type ReactNode } from 'react'

type EmbedBoundaryState = {
  hasError: boolean
}

class EmbedBoundary extends Component<{ children: ReactNode }, EmbedBoundaryState> {
  state: EmbedBoundaryState = { hasError: false }

  static getDerivedStateFromError (): EmbedBoundaryState {
    return { hasError: true }
  }

  render (): ReactNode {
    if (this.state.hasError) {
      return (
        <section className='my-8 rounded-2xl border border-zinc-700/80 bg-zinc-950/60 p-4'>
          <p className='text-sm text-rose-300'>
            The interactive playground is unavailable in this browser.
          </p>
        </section>
      )
    }
    return this.props.children
  }
}

const JevPlayground = dynamic(() => import('@/components/blog/jev-playground'), {
  ssr: false,
  loading: () => (
    <section className='my-8 rounded-2xl border border-zinc-700/80 bg-zinc-950/60 p-4'>
      <p className='text-sm text-zinc-400'>Loading the interactive playground...</p>
    </section>
  )
})

export default function JevPlaygroundEmbed () {
  return (
    <EmbedBoundary>
      <JevPlayground />
    </EmbedBoundary>
  )
}
