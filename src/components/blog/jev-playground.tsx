'use client'

import { defineRegistry, Renderer, StateProvider, type Spec } from '@json-render/react'
import { Component, type ReactNode, useMemo, useState } from 'react'
import { jevCatalog } from '@/lib/jev-catalog'

const PROMPTS = [
  'Show a train ticket summary with price and book action',
  'Show spending overview with two metrics',
  'Show a support checklist with next steps'
] as const

const MAX_PROMPT_LENGTH = 600

type CompositionResponse = {
  spec?: unknown
  steps?: Array<{ choice: string; description: string; elapsedMs: number }>
  error?: string
}

type RendererBoundaryProps = {
  resetKey: string
  onError: () => void
  children: ReactNode
}

type RendererBoundaryState = {
  hasError: boolean
}

class RendererBoundary extends Component<RendererBoundaryProps, RendererBoundaryState> {
  state: RendererBoundaryState = { hasError: false }

  static getDerivedStateFromError (): RendererBoundaryState {
    return { hasError: true }
  }

  componentDidCatch (): void {
    this.props.onError()
  }

  componentDidUpdate (prevProps: RendererBoundaryProps): void {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  render (): ReactNode {
    if (this.state.hasError) {
      return (
        <p className='text-sm text-rose-300'>
          The composed spec could not be rendered. Try another prompt.
        </p>
      )
    }
    return this.props.children
  }
}

function asText (value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asListItems (value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function buildRegistry () {
  return defineRegistry(jevCatalog, {
    components: {
      Card: ({ props, children }) => (
        <div className='rounded-xl border border-teal-400/30 bg-slate-950/70 p-4 shadow-lg'>
          <h3 className='mb-3 text-base font-semibold text-teal-100'>
            {asText(props.title, 'Composed card')}
          </h3>
          <div className='space-y-3'>{children}</div>
        </div>
      ),
      Text: ({ props }) => <p className='text-sm text-zinc-300'>{asText(props.text)}</p>,
      Metric: ({ props }) => (
        <div className='flex items-baseline justify-between rounded-lg bg-slate-900/80 px-3 py-2'>
          <span className='text-xs uppercase tracking-wide text-zinc-400'>
            {asText(props.label, 'Metric')}
          </span>
          <span className='text-lg font-semibold text-zinc-50'>{asText(props.value, '--')}</span>
        </div>
      ),
      Button: ({ props }) => (
        <span className='inline-flex rounded-lg bg-teal-500/90 px-3 py-2 text-sm font-medium text-slate-950'>
          {asText(props.label, 'Action')}
        </span>
      ),
      List: ({ props }) => {
        const items = asListItems(props.items)
        if (items.length === 0) {
          return <p className='text-sm text-zinc-500'>No list items were returned for this block.</p>
        }

        return (
          <ul className='list-disc space-y-1 pl-5 text-sm text-zinc-300'>
            {items.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )
      }
    },
    actions: {}
  }).registry
}

function isRenderableSpec (input: unknown): input is Spec {
  if (!input || typeof input !== 'object') return false
  const maybeSpec = input as { root?: unknown; elements?: unknown }
  if (typeof maybeSpec.root !== 'string') return false
  if (!maybeSpec.elements || typeof maybeSpec.elements !== 'object' || Array.isArray(maybeSpec.elements)) {
    return false
  }

  try {
    return jevCatalog.validate(input).success
  } catch {
    return false
  }
}

function normalizeSteps (steps: unknown): Array<{ choice: string; description: string; elapsedMs: number }> {
  if (!Array.isArray(steps)) return []
  return steps
    .filter((step): step is { choice: unknown; description: unknown; elapsedMs: unknown } => {
      return typeof step === 'object' && step !== null
    })
    .map(step => ({
      choice: asText(step.choice, 'choice'),
      description: asText(step.description, 'Composed one decision'),
      elapsedMs: typeof step.elapsedMs === 'number' ? step.elapsedMs : 0
    }))
}

export default function JevPlayground () {
  const [prompt, setPrompt] = useState<string>(PROMPTS[0])
  const [busy, setBusy] = useState(false)
  const [spec, setSpec] = useState<Spec | null>(null)
  const [steps, setSteps] = useState<Array<{ choice: string; description: string; elapsedMs: number }>>([])
  const [error, setError] = useState<string | null>(null)
  const [renderError, setRenderError] = useState<string | null>(null)

  const registryInit = useMemo(() => {
    try {
      return { registry: buildRegistry(), error: null as string | null }
    } catch {
      return {
        registry: null,
        error: 'The playground renderer could not initialize in this browser.'
      }
    }
  }, [])

  async function runCompose () {
    if (busy) return

    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt) {
      setError('Enter a prompt before composing.')
      return
    }
    if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
      setError(`Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer.`)
      return
    }

    setBusy(true)
    setError(null)
    setRenderError(null)
    setSpec(null)
    setSteps([])

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 30_000)
    try {
      const response = await fetch('/api/jev-compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmedPrompt }),
        signal: controller.signal
      })
      const result = (await response.json().catch(() => ({}))) as CompositionResponse

      if (!response.ok) {
        throw new Error(result.error || `Live composition failed with status ${response.status}.`)
      }
      if (!isRenderableSpec(result.spec)) {
        throw new Error('Live composition returned an incompatible spec.')
      }

      setSpec(result.spec)
      setSteps(normalizeSteps(result.steps))
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setError('Live composition timed out. Try a shorter prompt.')
      } else {
        setError(error instanceof Error ? error.message : 'Live composition is unavailable.')
      }
    } finally {
      window.clearTimeout(timeout)
      setBusy(false)
    }
  }

  const renderKey = spec ? `${spec.root}:${Object.keys(spec.elements ?? {}).length}` : 'empty'

  return (
    <section className='my-8 overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-950/60'>
      <div className='border-b border-zinc-800 px-4 py-3 sm:px-5'>
        <p className='text-sm font-medium text-zinc-100'>Interactive catalog playground</p>
        <p className='mt-1 text-xs text-zinc-400'>
          Live jev composes the catalog through Vercel AI Gateway on a server route. The key stays on
          the server only.
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
            maxLength={MAX_PROMPT_LENGTH}
            className='w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-teal-400/50'
          />
          <p className='text-xs text-zinc-500'>
            Catalog: Card, Text, Metric, Button, List · {prompt.trim().length}/{MAX_PROMPT_LENGTH}
          </p>
          <button
            type='button'
            disabled={busy || !prompt.trim()}
            onClick={runCompose}
            className='rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-900 disabled:opacity-50'
          >
            {busy ? 'Composing with live jev...' : 'Compose with live jev'}
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
          {registryInit.error && <p className='text-sm text-rose-300'>{registryInit.error}</p>}

          {!registryInit.error && busy && (
            <p className='text-sm text-zinc-400'>Composing with jev through /api/jev-compose...</p>
          )}

          {!registryInit.error && !busy && !spec && (
            <p className='text-sm text-zinc-500'>
              Choose a prompt and compose to render a live spec from the catalog.
            </p>
          )}

          {!registryInit.error && renderError && <p className='text-sm text-rose-300'>{renderError}</p>}

          {!registryInit.error && !busy && spec && registryInit.registry && (
            <RendererBoundary
              resetKey={renderKey}
              onError={() => setRenderError('The composed spec could not be rendered safely.')}
            >
              <StateProvider initialState={spec.state}>
                <Renderer
                  spec={spec}
                  registry={registryInit.registry}
                  fallback={({ element }: { element: { type?: string } }) => (
                    <p className='text-sm text-zinc-500'>
                      Unsupported component received: {asText(element.type, 'unknown')}
                    </p>
                  )}
                />
              </StateProvider>
            </RendererBoundary>
          )}
        </div>
      </div>
    </section>
  )
}
