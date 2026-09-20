'use client'

import { useMemo, useState } from 'react'

type Node =
  | { type: 'Card'; title: string; children: Node[] }
  | { type: 'Text'; text: string }
  | { type: 'Metric'; label: string; value: string }
  | { type: 'Button'; label: string }
  | { type: 'List'; items: string[] }

const PROMPTS = [
  'Show a train ticket summary with price and book action',
  'Show spending overview with two metrics',
  'Show a support checklist with next steps'
] as const

function composeFromPrompt(prompt: string): Node {
  const p = prompt.toLowerCase()
  if (p.includes('train') || p.includes('ticket')) {
    return {
      type: 'Card',
      title: 'Train ticket',
      children: [
        { type: 'Text', text: 'Santo Domingo → Santiago · Today 4:30 PM' },
        { type: 'Metric', label: 'Fare', value: 'RD$ 850' },
        { type: 'Button', label: 'Book seat' }
      ]
    }
  }
  if (p.includes('spend') || p.includes('metric')) {
    return {
      type: 'Card',
      title: 'Spending overview',
      children: [
        { type: 'Metric', label: 'This week', value: '$240' },
        { type: 'Metric', label: 'Budget left', value: '$160' },
        { type: 'Text', text: 'Top category: groceries' }
      ]
    }
  }
  return {
    type: 'Card',
    title: 'Support checklist',
    children: [
      {
        type: 'List',
        items: ['Confirm account email', 'Reset session', 'Escalate if unpaid invoice']
      },
      { type: 'Button', label: 'Mark resolved' }
    ]
  }
}

function RenderNode ({ node }: { node: Node }) {
  if (node.type === 'Card') {
    return (
      <div className='rounded-xl border border-teal-400/30 bg-slate-950/70 p-4 shadow-lg'>
        <h3 className='mb-3 text-base font-semibold text-teal-100'>{node.title}</h3>
        <div className='space-y-3'>
          {node.children.map((child, i) => (
            <RenderNode key={i} node={child} />
          ))}
        </div>
      </div>
    )
  }
  if (node.type === 'Text') {
    return <p className='text-sm text-zinc-300'>{node.text}</p>
  }
  if (node.type === 'Metric') {
    return (
      <div className='flex items-baseline justify-between rounded-lg bg-slate-900/80 px-3 py-2'>
        <span className='text-xs uppercase tracking-wide text-zinc-400'>{node.label}</span>
        <span className='text-lg font-semibold text-zinc-50'>{node.value}</span>
      </div>
    )
  }
  if (node.type === 'Button') {
    return (
      <button
        type='button'
        className='rounded-lg bg-teal-500/90 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-teal-400'
      >
        {node.label}
      </button>
    )
  }
  return (
    <ul className='list-disc space-y-1 pl-5 text-sm text-zinc-300'>
      {node.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export default function JevPlayground () {
  const [prompt, setPrompt] = useState<string>(PROMPTS[0])
  const [busy, setBusy] = useState(false)
  const [spec, setSpec] = useState<Node | null>(null)
  const [trace, setTrace] = useState<string[]>([])

  const catalog = useMemo(
    () => ['Card', 'Text', 'Metric', 'Button', 'List'],
    []
  )

  async function runCompose () {
    setBusy(true)
    setSpec(null)
    setTrace(['select root: Card', 'select children from catalog', 'layout complete'])
    await new Promise((r) => setTimeout(r, 350))
    setSpec(composeFromPrompt(prompt))
    setBusy(false)
  }

  return (
    <section className='my-8 overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-950/60'>
      <div className='border-b border-zinc-800 px-4 py-3 sm:px-5'>
        <p className='text-sm font-medium text-zinc-100'>Interactive catalog playground</p>
        <p className='mt-1 text-xs text-zinc-400'>
          Local choice evaluator for the blog. Same idea as compose then render. Use live jev on your
          server with AI Gateway when you are ready.
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
          <p className='text-xs text-zinc-500'>Catalog: {catalog.join(', ')}</p>
          <button
            type='button'
            disabled={busy || !prompt.trim()}
            onClick={runCompose}
            className='rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-900 disabled:opacity-50'
          >
            {busy ? 'Composing…' : 'Compose UI'}
          </button>
          {trace.length > 0 && (
            <ol className='list-decimal space-y-1 pl-4 text-xs text-zinc-400'>
              {trace.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          )}
        </div>
        <div className='min-h-[220px] rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 p-3'>
          {spec ? (
            <RenderNode node={spec} />
          ) : (
            <p className='text-sm text-zinc-500'>Run compose to render a Spec from the catalog.</p>
          )}
        </div>
      </div>
    </section>
  )
}
