'use client'

import { Component, type ReactNode } from 'react'
import JevPlayground from '@/components/blog/jev-playground'

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

export default function JevPlaygroundEmbed () {
  return (
    <EmbedBoundary>
      <JevPlayground />
    </EmbedBoundary>
  )
}
