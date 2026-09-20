'use client'

import { defineRegistry, Renderer, StateProvider, type Spec } from '@json-render/react'
import { useState } from 'react'
import { jevCatalog } from '@/lib/jev-catalog'

const PROMPTS = [
  'Show a train ticket summary with price and book action',
  'Show spending overview with two metrics',
  'Show a support checklist with next steps'
] as const

type CompositionResponse = {
  spec?: Spec
  steps?: Array<{ choice: string; description: string; elapsedMs: number }>
  error?: string
}

const { registry } = defineRegistry(jevCatalog, {
  components: {
    Card: ({ props, children }) => (
      <div className='rounded-xl border border-teal-400/30 bg-slate-950/70 p-4 shadow-lg'>
        <h3 className='mb-3 text-base font-semibold text-teal-100'>{props.title}</h3>
        <div className='space-y-3'>{children}</div>
      </div>
    ),
    Text: ({ props }) => <p className='text-sm text-zinc-300'>{props.text}</p>,
    Metric: ({ props }) => (
      <div className='flex items-baseline justify-between rounded-lg bg-slate-900/80 px-3 py-2'>
        <span className='text-xs uppercase tracking-wide text-zinc-400'>{props.label}</span>
        <span className='text-lg font-semibold text-zinc-50'>{props.value}</span>
      </div>
    ),
    Button: ({ props }) => (
      <span className='inline-flex rounded-lg bg-teal-500/90 px-3 py-2 text-sm font-medium text-slate-950'>
        {props.label}
      </span>
    ),
    List: ({ props }) => (
      <ul className='list-disc space-y-1 pl-5 text-sm text-zinc-300'>
        {props.items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }
})

export default function JevPlayground () {
  const [prompt, setPrompt] = useState<string>(PROMPTS[0])
  const [busy, setBusy] = useState(false)
  const [spec, setSpec] = useState<Spec | null>(null)
  const [steps, setSteps] = useState<CompositionResponse['steps']>([])
  const [error, setError] = useState<string | null>(null)

  async function runCompose () {
    setBusy(true)
    setSpec(null)
    setSteps([])
    setError(null)

    try {
      const response = await fetch('/api/jev-compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const result = (await response.json()) as CompositionResponse

      if (!response.ok || !result.spec) {
        throw new Error(result.error || 'Live composition did not return a spec.')
      }

      setSpec(result.spec)
      setSteps(result.steps ?? [])
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Live composition is unavailable.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className='my-8 overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-950/60'>
      <div className='border-b border-zinc-800 px-4 py-3 sm:px-5'>
        <p className='text-sm font-medium text-zinc-100'>Interactive catalog playground</p>
        <p className='mt-1 text-xs text-zinc-400'>
          Live jev composes the catalog through Vercel AI Gateway on a server route. The key stays on
          the server.
        </p>
      </div>
      <div className='grid gap-4 p-4 sm:p-5 lg:grid-cols-2'>
        <div className='space-y-3'>
          <label className='block text-xs font-medium uppercase tracking-wide text-zinc-400'>
            Prompt
          </label>
          <div className='flex flex-wrap gap-2'>
            {PROMPTS.map((item) => (
              <button
                key={item}
                type='button'
                onClick={() => setPrompt(item)}
                className={`rounded-full border px-3 py-1 text-left text-xs ${
                  prompt === item
                    ? 'border-teal-400/60 bg-teal-400/10 text-teal-100'
                    : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className='w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-teal-400/50'
          />
          <p className='text-xs text-zinc-500'>Catalog: Card, Text, Metric, Button, List</p>
          <button
            type='button'
            disabled={busy || !prompt.trim()}
            onClick={runCompose}
            className='rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-900 disabled:opacity-50'
          >
            {busy ? 'Composing…' : 'Compose with jev'}
          </button>
          {error && (
            <p role='alert' className='text-sm text-rose-300'>
              {error}
            </p>
          )}
          {steps && steps.length > 0 && (
            <ol className='list-decimal space-y-1 pl-4 text-xs text-zinc-400'>
              {steps.map((step, index) => (
                <li key={`${step.choice}-${index}`}>
                  {step.description} ({step.elapsedMs} ms)
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className='min-h-[220px] rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 p-3'>
          {spec ? (
            <StateProvider initialState={spec.state}>
              <Renderer spec={spec} registry={registry} />
            </StateProvider>
          ) : (
            <p className='text-sm text-zinc-500'>Compose with jev to render a Spec from the catalog.</p>
          )}
        </div>
      </div>
    </section>
  )
}
