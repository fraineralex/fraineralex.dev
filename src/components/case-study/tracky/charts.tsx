'use client'

import { useId, useState, type KeyboardEvent, type ReactNode } from 'react'
import { focusRing } from './ui'

export interface ChartSeries {
  id: string
  label: string
  color: string
  values: number[]
}

function niceMax (value: number) {
  if (!Number.isFinite(value) || value <= 0) return 1
  if (value <= 10) return 10
  const pow = Math.pow(10, Math.floor(Math.log10(value)))
  const step = pow / 2
  return Math.ceil(value / step) * step
}

function formatTick (value: number) {
  if (Math.abs(value) >= 100) return String(Math.round(value))
  const rounded = Math.round(value * 10) / 10
  return String(rounded)
}

function domainOf (values: number[], zeroBaseline: boolean, yMin?: number, yMax?: number) {
  const dataMin = values.length ? Math.min(...values) : 0
  const dataMax = values.length ? Math.max(...values) : 1
  if (yMin !== undefined && yMax !== undefined) return { min: yMin, max: yMax }
  if (zeroBaseline) return { min: 0, max: yMax ?? niceMax(dataMax) }
  const pad = Math.max((dataMax - dataMin) * 0.25, 0.4)
  return {
    min: yMin ?? dataMin - pad,
    max: yMax ?? dataMax + pad
  }
}

function smoothPath (xs: number[], ys: number[]) {
  const firstX = xs[0]
  const firstY = ys[0]
  if (firstX === undefined || firstY === undefined) return ''
  if (xs.length < 2) return `M ${firstX} ${firstY}`
  let d = `M ${firstX} ${firstY}`
  for (let index = 0; index < xs.length - 1; index++) {
    const x0 = xs[index] ?? 0
    const y0 = ys[index] ?? 0
    const x1 = xs[index + 1] ?? x0
    const y1 = ys[index + 1] ?? y0
    const bend = (x1 - x0) / 2
    d += ` C ${x0 + bend} ${y0}, ${x1 - bend} ${y1}, ${x1} ${y1}`
  }
  return d
}

function ChartTable ({ title, labels, series }: { title: string, labels: string[], series: ChartSeries[] }) {
  return (
    <table className='sr-only'>
      <caption>{title}</caption>
      <thead>
        <tr>
          <th scope='col'>{title}</th>
          {labels.map((label, index) => <th key={`${label}-${index}`} scope='col'>{label}</th>)}
        </tr>
      </thead>
      <tbody>
        {series.map((item) => (
          <tr key={item.id}>
            <th scope='row'>{item.label}</th>
            {labels.map((label, index) => <td key={`${item.id}-${label}-${index}`}>{Math.round(item.values[index] ?? 0)}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Tip ({ label, rows }: { label: string, rows: { name: string, color: string, value: string }[] }) {
  return (
    <div className='pointer-events-none absolute right-1 top-1 z-10 max-w-[70%] rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3 shadow-lg'>
      <p className='mb-1 text-sm font-semibold text-[hsl(var(--foreground))]'>{label}</p>
      {rows.map((row) => (
        <p key={row.name} className='text-sm text-[hsl(var(--foreground))]'>
          <span className='font-medium' style={{ color: row.color }}>{row.name}</span>
          {': '}{row.value}
        </p>
      ))}
    </div>
  )
}

function useProbe (count: number) {
  const [active, setActive] = useState<number | null>(null)
  function onKey (event: KeyboardEvent<HTMLDivElement>) {
    if (!count || !['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    setActive((current) => {
      const index = current ?? 0
      if (event.key === 'Home') return 0
      if (event.key === 'End') return count - 1
      const step = event.key === 'ArrowRight' ? 1 : -1
      return (index + step + count) % count
    })
  }
  return { active, setActive, onKey }
}

function Frame ({
  title,
  labels,
  series,
  children,
  active,
  setActive,
  onKey,
  tip
}: {
  title: string
  labels: string[]
  series: ChartSeries[]
  children: ReactNode
  active: number | null
  setActive: (index: number | null) => void
  onKey: (event: KeyboardEvent<HTMLDivElement>) => void
  tip: ReactNode
}) {
  const live = active === null || !labels[active]
    ? ''
    : `${labels[active]}: ${series.map((item) => `${item.label} ${Math.round(item.values[active] ?? 0)}`).join(', ')}`
  return (
    <div
      tabIndex={0}
      role='group'
      aria-label={title}
      onKeyDown={onKey}
      onMouseLeave={() => setActive(null)}
      className={`relative outline-none ${focusRing}`}
    >
      {children}
      {active !== null && tip}
      <ChartTable title={title} labels={labels} series={series} />
      <p className='sr-only' aria-live='polite'>{live}</p>
    </div>
  )
}

const width = 420
const height = 210
const pad = { l: 52, r: 16, t: 16, b: 28 }

export function LineChart ({
  title,
  labels,
  series,
  ySuffix = '',
  yMin,
  yMax,
  zeroBaseline = true
}: {
  title: string
  labels: string[]
  series: ChartSeries[]
  ySuffix?: string
  yMin?: number
  yMax?: number
  zeroBaseline?: boolean
}) {
  const { active, setActive, onKey } = useProbe(labels.length)
  const values = series.flatMap((item) => item.values)
  const { min, max } = domainOf(values, zeroBaseline, yMin, yMax)
  const span = Math.max(max - min, 0.001)
  const innerW = width - pad.l - pad.r
  const innerH = height - pad.t - pad.b
  const x = (index: number) => pad.l + (labels.length <= 1 ? innerW / 2 : (index * innerW) / (labels.length - 1))
  const y = (value: number) => pad.t + (1 - (value - min) / span) * innerH
  const ticks = [0, 0.5, 1].map((part) => min + span * part)
  const slot = labels.length <= 1 ? innerW : innerW / labels.length

  return (
    <Frame
      title={title}
      labels={labels}
      series={series}
      active={active}
      setActive={setActive}
      onKey={onKey}
      tip={active !== null && (
        <Tip
          label={labels[active] ?? ''}
          rows={series.map((item) => ({
            name: item.label,
            color: item.color,
            value: `${Math.round(item.values[active] ?? 0)}${ySuffix}`
          }))}
        />
      )}
    >
      <svg viewBox={`0 0 ${width} ${height}`} aria-hidden='true' className='h-auto w-full'>
        {ticks.map((tick) => (
          <text key={tick} x={pad.l - 6} y={y(tick) + 3} textAnchor='end' fill='hsl(var(--muted-foreground))' fontSize='10'>
            {formatTick(tick)}{ySuffix}
          </text>
        ))}
        {series.map((item) => {
          const xs = item.values.map((_, index) => x(index))
          const ys = item.values.map((value) => y(value))
          return (
            <g key={item.id}>
              <path d={smoothPath(xs, ys)} fill='none' stroke={item.color} strokeWidth='2' />
              {item.values.map((value, index) => (
                <circle key={`${item.id}-${labels[index]}-${index}`} cx={x(index)} cy={y(value)} r={index === active ? 4 : 3} fill={item.color} />
              ))}
            </g>
          )
        })}
        {labels.map((label, index) => (
          <g key={`${label}-${index}`}>
            <text x={x(index)} y={height - 8} textAnchor='middle' fill='hsl(var(--muted-foreground))' fontSize='10'>{label}</text>
            <rect
              x={x(index) - slot / 2}
              y={pad.t}
              width={slot}
              height={innerH}
              fill='transparent'
              onMouseEnter={() => setActive(index)}
            />
          </g>
        ))}
      </svg>
    </Frame>
  )
}

export function ColumnChart ({
  title,
  labels,
  values,
  color,
  ySuffix = ''
}: {
  title: string
  labels: string[]
  values: number[]
  color: string
  ySuffix?: string
}) {
  const series: ChartSeries[] = [{ id: 'value', label: title, color, values }]
  const { active, setActive, onKey } = useProbe(labels.length)
  const max = niceMax(Math.max(...values, 0))
  const innerW = width - pad.l - pad.r
  const innerH = height - pad.t - pad.b
  const gap = labels.length > 1 ? 12 : 0
  const natural = (innerW - gap * Math.max(labels.length - 1, 0)) / Math.max(labels.length, 1)
  const barW = Math.min(64, Math.max(8, natural))
  const used = labels.length * barW + gap * Math.max(labels.length - 1, 0)
  const origin = pad.l + (innerW - used) / 2
  const ticks = [0, max / 2, max]

  return (
    <Frame
      title={title}
      labels={labels}
      series={series}
      active={active}
      setActive={setActive}
      onKey={onKey}
      tip={active !== null && (
        <Tip
          label={labels[active] ?? ''}
          rows={[{ name: title, color, value: `${Math.round(values[active] ?? 0)}${ySuffix}` }]}
        />
      )}
    >
      <svg viewBox={`0 0 ${width} ${height}`} aria-hidden='true' className='h-auto w-full'>
        {ticks.map((tick) => {
          const y = pad.t + (1 - tick / max) * innerH
          return (
            <text key={tick} x={pad.l - 6} y={y + 3} textAnchor='end' fill='hsl(var(--muted-foreground))' fontSize='10'>
              {formatTick(tick)}{ySuffix}
            </text>
          )
        })}
        {values.map((value, index) => {
          const barH = Math.max((value / max) * innerH, value > 0 ? 2 : 0)
          const x = origin + index * (barW + gap)
          const y = pad.t + innerH - barH
          return (
            <g key={`${labels[index]}-${index}`} onMouseEnter={() => setActive(index)}>
              <rect x={x} y={y} width={barW} height={barH} rx='4' fill={color} />
              <text x={x + barW / 2} y={height - 8} textAnchor='middle' fill='hsl(var(--muted-foreground))' fontSize='10'>{labels[index]}</text>
            </g>
          )
        })}
      </svg>
    </Frame>
  )
}

export function StackedAreaChart ({ title, labels, series }: { title: string, labels: string[], series: ChartSeries[] }) {
  const reactId = useId().replace(/:/g, '')
  const { active, setActive, onKey } = useProbe(labels.length)
  const totals = labels.map((_, index) => series.reduce((sum, item) => sum + (item.values[index] ?? 0), 0))
  const max = niceMax(Math.max(...totals, 0))
  const innerW = width - pad.l - pad.r
  const innerH = height - pad.t - pad.b
  const x = (index: number) => pad.l + (labels.length <= 1 ? innerW / 2 : (index * innerW) / Math.max(labels.length - 1, 1))
  const y = (value: number) => pad.t + (1 - value / max) * innerH
  const slot = labels.length <= 1 ? innerW : innerW / labels.length
  const ticks = [0, max / 2, max]

  return (
    <Frame
      title={title}
      labels={labels}
      series={series}
      active={active}
      setActive={setActive}
      onKey={onKey}
      tip={active !== null && (
        <Tip
          label={labels[active] ?? ''}
          rows={series.map((item) => ({
            name: item.label,
            color: item.color,
            value: String(Math.round(item.values[active] ?? 0))
          }))}
        />
      )}
    >
      <svg viewBox={`0 0 ${width} ${height}`} aria-hidden='true' className='h-auto w-full'>
        <defs>
          {series.map((item) => (
            <linearGradient key={item.id} id={`${reactId}-${item.id}`} x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={item.color} stopOpacity='0.8' />
              <stop offset='95%' stopColor={item.color} stopOpacity='0.1' />
            </linearGradient>
          ))}
        </defs>
        {ticks.map((tick) => {
          const tickY = y(tick)
          return (
            <g key={tick}>
              <line x1={pad.l} x2={width - pad.r} y1={tickY} y2={tickY} stroke='hsl(var(--border))' strokeWidth='1' />
              <text x={pad.l - 6} y={tickY + 3} textAnchor='end' fill='hsl(var(--muted-foreground))' fontSize='10'>{formatTick(tick)}</text>
            </g>
          )
        })}
        {series.map((item, seriesIndex) => {
          const below = labels.map((_, index) => series.slice(0, seriesIndex).reduce((sum, other) => sum + (other.values[index] ?? 0), 0))
          const top = labels.map((_, index) => (below[index] ?? 0) + (item.values[index] ?? 0))
          const fill = `url(#${reactId}-${item.id})`
          if (labels.length === 1) {
            const barW = 28
            const barX = x(0) - barW / 2
            const barY = y(top[0] ?? 0)
            const barH = Math.max(y(below[0] ?? 0) - barY, 0)
            return <rect key={item.id} x={barX} y={barY} width={barW} height={barH} fill={fill} stroke={item.color} />
          }
          const topPath = smoothPath(labels.map((_, index) => x(index)), top.map((value) => y(value)))
          const bottomXs = labels.map((_, index) => x(index)).reverse()
          const bottomYs = below.map((value) => y(value)).reverse()
          const back = bottomXs.map((point, pointIndex) => `L ${point} ${bottomYs[pointIndex]}`).join(' ')
          const area = `${topPath} ${back} Z`
          return <path key={item.id} d={area} fill={fill} stroke={item.color} strokeWidth='2' />
        })}
        {labels.map((label, index) => (
          <g key={`${label}-${index}`}>
            <text x={x(index)} y={height - 8} textAnchor='middle' fill='hsl(var(--muted-foreground))' fontSize='10'>{label}</text>
            <rect x={x(index) - slot / 2} y={pad.t} width={slot} height={innerH} fill='transparent' onMouseEnter={() => setActive(index)} />
          </g>
        ))}
      </svg>
    </Frame>
  )
}

export function DualLineChart ({
  title,
  labels,
  left,
  right
}: {
  title: string
  labels: string[]
  left: ChartSeries
  right: ChartSeries
}) {
  const { active, setActive, onKey } = useProbe(labels.length)
  const leftMax = niceMax(Math.max(...left.values, 0))
  const rightMax = niceMax(Math.max(...right.values, 0))
  const innerW = width - pad.l - 44
  const innerH = height - pad.t - pad.b
  const x = (index: number) => pad.l + (labels.length <= 1 ? innerW / 2 : (index * innerW) / Math.max(labels.length - 1, 1))
  const yLeft = (value: number) => pad.t + (1 - value / leftMax) * innerH
  const yRight = (value: number) => pad.t + (1 - value / rightMax) * innerH
  const slot = labels.length <= 1 ? innerW : innerW / labels.length

  return (
    <Frame
      title={title}
      labels={labels}
      series={[left, right]}
      active={active}
      setActive={setActive}
      onKey={onKey}
      tip={active !== null && (
        <Tip
          label={labels[active] ?? ''}
          rows={[
            { name: left.label, color: left.color, value: String(Math.round(left.values[active] ?? 0)) },
            { name: right.label, color: right.color, value: String(Math.round(right.values[active] ?? 0)) }
          ]}
        />
      )}
    >
      <svg viewBox={`0 0 ${width} ${height}`} aria-hidden='true' className='h-auto w-full'>
        {[0, leftMax / 2, leftMax].map((tick) => (
          <text key={`l-${tick}`} x={pad.l - 6} y={yLeft(tick) + 3} textAnchor='end' fill='hsl(var(--muted-foreground))' fontSize='10'>{formatTick(tick)}</text>
        ))}
        {[0, rightMax / 2, rightMax].map((tick) => (
          <text key={`r-${tick}`} x={width - 8} y={yRight(tick) + 3} textAnchor='end' fill='hsl(var(--muted-foreground))' fontSize='10'>{formatTick(tick)}</text>
        ))}
        <path d={smoothPath(labels.map((_, index) => x(index)), left.values.map((value) => yLeft(value)))} fill='none' stroke={left.color} strokeWidth='2' />
        <path d={smoothPath(labels.map((_, index) => x(index)), right.values.map((value) => yRight(value)))} fill='none' stroke={right.color} strokeWidth='2' />
        {labels.map((label, index) => (
          <g key={`${label}-${index}`}>
            <circle cx={x(index)} cy={yLeft(left.values[index] ?? 0)} r={index === active ? 4 : 3} fill={left.color} />
            <circle cx={x(index)} cy={yRight(right.values[index] ?? 0)} r={index === active ? 4 : 3} fill={right.color} />
            <text x={x(index)} y={height - 8} textAnchor='middle' fill='hsl(var(--muted-foreground))' fontSize='10'>{label}</text>
            <rect x={x(index) - slot / 2} y={pad.t} width={slot} height={innerH} fill='transparent' onMouseEnter={() => setActive(index)} />
          </g>
        ))}
      </svg>
    </Frame>
  )
}
