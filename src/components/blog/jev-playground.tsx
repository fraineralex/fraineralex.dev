'use client'

import { JSONUIProvider, defineRegistry, Renderer, type Spec } from '@json-render/react'
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
    if (this.state.hasError) return null
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
        <div className='rounded-xl border border-teal-500/30 bg-zinc-950/80 p-4 shadow-[0_0_0_1px_rgba(45,212,191,0.08)] backdrop-blur-sm'>
          <h3 className='mb-3 text-base font-semibold text-teal-100'>
            {asText(props.title, 'Composed card')}
          </h3>
          <div className='space-y-3'>{children}</div>
        </div>
      ),
      Text: ({ props }) => <p className='text-sm leading-relaxed text-zinc-300'>{asText(props.text)}</p>,
      Metric: ({ props }) => (
        <div className='flex items-baseline justify-between rounded-lg border border-zinc-700/80 bg-zinc-900/70 px-3 py-2'>
          <span className='text-xs uppercase tracking-wide text-zinc-400'>
            {asText(props.label, 'Metric')}
          </span>
          <span className='text-lg font-semibold text-zinc-50'>{asText(props.value, '--')}</span>
        </div>
      ),
      Button: ({ props }) => (
        <span className='inline-flex rounded-lg border border-teal-300/40 bg-teal-400/90 px-3 py-2 text-sm font-semibold text-zinc-950'>
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
  if (!input || typeof input !== 'object' || Array.isArray(input)) return false
  const candidate = input as {
    root?: unknown
    elements?: Record<string, unknown>
  }
  if (!candidate.elements || typeof candidate.elements !== 'object' || Array.isArray(candidate.elements)) {
    return false
  }
  if (Object.keys(candidate.elements).length === 0) return false
  return true
}

function normalizeSpec (input: unknown): Spec | null {
  if (!isRenderableSpec(input)) return null

  const rawSpec = input as {
    root?: unknown
    state?: unknown
    elements: Record<string, unknown>
  }
  const elements: Record<string, any> = {}

  for (const [key, value] of Object.entries(rawSpec.elements)) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue
    const source = value as Record<string, unknown>
    const children = Array.isArray(source.children)
      ? source.children.filter((child): child is string => typeof child === 'string')
      : []
    const props = source.props && typeof source.props === 'object' && !Array.isArray(source.props)
      ? source.props
      : {}
    const element: Record<string, unknown> = {
      type: typeof source.type === 'string' ? source.type : 'Text',
      props,
      children
    }

    if (source.slots && typeof source.slots === 'object' && !Array.isArray(source.slots)) {
      const slots = Object.entries(source.slots as Record<string, unknown>).reduce<Record<string, string[]>>((acc, [slotName, slotValue]) => {
        if (Array.isArray(slotValue)) {
          acc[slotName] = slotValue.filter((item): item is string => typeof item === 'string')
        }
        return acc
      }, {})

      if (Object.keys(slots).length > 0) {
        element.slots = slots
      }
    }

    if (source.visible && typeof source.visible === 'object' && !Array.isArray(source.visible)) {
      element.visible = source.visible
    }
    if (source.on && typeof source.on === 'object' && !Array.isArray(source.on)) {
      element.on = source.on
    }
    elements[key] = element
  }

  const firstKey = Object.keys(elements)[0]
  if (!firstKey) return null
  const root = typeof rawSpec.root === 'string' && elements[rawSpec.root] ? rawSpec.root : firstKey
  const state = rawSpec.state && typeof rawSpec.state === 'object' && !Array.isArray(rawSpec.state)
    ? rawSpec.state as Record<string, unknown>
    : {}

  return { root, elements, state }
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
      const normalizedSpec = normalizeSpec(result.spec)
      if (!normalizedSpec) {
        throw new Error('Live composition returned an incompatible spec payload.')
      }

      setSpec(normalizedSpec)
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
    <section className='my-8 overflow-hidden rounded-2xl border border-zinc-700/80 bg-gradient-to-b from-zinc-900/70 via-zinc-950/80 to-zinc-950/95 shadow-[0_0_0_1px_rgba(15,23,42,0.6)]'>
      <div className='border-b border-zinc-800/90 px-4 py-4 sm:px-5'>
        <div className='inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs text-teal-100'>
          <span className='h-2 w-2 rounded-full bg-teal-300' />
          Live jev playground
        </div>
        <p className='mt-3 text-sm text-zinc-100'>Compose a UI spec from the catalog using AI Gateway on the server.</p>
        <p className='mt-1 text-xs text-zinc-400'>The key stays server-only and never enters the browser.</p>
      </div>
      <div className='grid gap-4 p-4 sm:p-5 lg:grid-cols-[1.05fr_1fr]'>
        <div className='space-y-4'>
          <label className='block text-xs font-semibold tracking-[0.12em] text-zinc-400'>
            Prompt
          </label>
          <div className='flex flex-wrap gap-2'>
            {PROMPTS.map((item) => (
              <button
                key={item}
                type='button'
                onClick={() => setPrompt(item)}
                className={`rounded-full border px-3 py-2 text-left text-sm leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70 ${
                  prompt === item
                    ? 'border-teal-300/70 bg-teal-400/15 text-teal-100'
                    : 'border-zinc-600/90 text-zinc-200 hover:border-zinc-400'
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
            className='w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-3 py-3 text-lg text-zinc-100 outline-none transition-colors focus:border-teal-300/70'
          />
          <p className='text-sm text-zinc-400'>
            Catalog: Card, Text, Metric, Button, List · {prompt.trim().length}/{MAX_PROMPT_LENGTH}
          </p>
          <div className='flex flex-wrap items-center gap-3'>
            <button
              type='button'
              disabled={busy || !prompt.trim()}
              onClick={runCompose}
              className='rounded-xl bg-zinc-100 px-4 py-3 text-base font-semibold text-zinc-950 transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50'
            >
              {busy ? 'Composing with live jev...' : 'Compose with live jev'}
            </button>
            <span className='text-xs text-zinc-500'>
              {busy ? 'Composing live spec...' : 'Ready'}
            </span>
          </div>
          {error && (
            <p role='alert' className='rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200'>
              {error}
            </p>
          )}
          {steps && steps.length > 0 && (
            <div className='rounded-xl border border-zinc-700/80 bg-zinc-900/60 px-3 py-3'>
              <p className='mb-2 text-xs font-medium tracking-[0.1em] text-zinc-400'>Trace</p>
              <ol className='space-y-2 text-sm text-zinc-300'>
                {steps.map((step, index) => (
                  <li key={`${step.choice}-${index}`} className='flex items-start gap-2'>
                    <span className='mt-1 h-2 w-2 rounded-full bg-teal-300/90' />
                    <span>
                      {step.description} <span className='text-zinc-500'>({step.elapsedMs} ms)</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
        <div className='min-h-[260px] rounded-xl border border-zinc-700/80 bg-zinc-900/50 p-3 shadow-inner shadow-zinc-950/40'>
          {registryInit.error && <p className='text-sm text-rose-300'>{registryInit.error}</p>}

          {!registryInit.error && busy && (
            <div className='flex h-full min-h-[220px] items-center justify-center'>
              <p className='text-sm text-zinc-300'>Composing with jev through /api/jev-compose...</p>
            </div>
          )}

          {!registryInit.error && !busy && !spec && (
            <div className='flex h-full min-h-[220px] items-center justify-center rounded-lg border border-dashed border-zinc-700/90 bg-zinc-950/50 px-4'>
              <p className='text-sm text-zinc-400'>
                Choose a prompt and compose to render a live spec in this canvas.
              </p>
            </div>
          )}

          {!registryInit.error && renderError && (
            <p className='rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-3 text-sm text-rose-200'>
              {renderError}
            </p>
          )}

          {!registryInit.error && !busy && spec && registryInit.registry && (
            <RendererBoundary
              resetKey={renderKey}
              onError={() => setRenderError('The composed spec could not be rendered. Try another prompt.')}
            >
              <JSONUIProvider registry={registryInit.registry} initialState={spec.state}>
                <Renderer
                  spec={spec}
                  registry={registryInit.registry}
                  fallback={({ element }: { element: { type?: string } }) => (
                    <p className='rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-400'>
                      Unsupported component received: {asText(element.type, 'unknown')}
                    </p>
                  )}
                />
              </JSONUIProvider>
            </RendererBoundary>
          )}
        </div>
      </div>
    </section>
  )
}
