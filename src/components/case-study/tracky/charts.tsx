'use client'

import { useState } from 'react'
import { focusRing, tk } from './ui'

export interface LineSeries {
  id: string
  label: string
  color: string
  values: number[]
}

interface LineChartProps {
  title: string
  labels: string[]
  series: LineSeries[]
  describedBy?: string
  yMin?: number
  yMax?: number
}

function niceMax (value: number) {
  if (value <= 10) return 10
  const pow = Math.pow(10, Math.floor(Math.log10(value)))
  const step = pow / 2
  return Math.ceil(value / step) * step
}

export function LineChart ({ title, labels, series, describedBy, yMin = 0, yMax }: LineChartProps) {
  const [active, setActive] = useState(labels.length - 1)
  const width = 320
  const height = 168
  const pad = { l: 32, r: 8, t: 12, b: 22 }
  const max = yMax ?? niceMax(Math.max(...series.flatMap((item) => item.values), 1))
  const min = yMin
  const span = Math.max(max - min, 1)
  const innerW = width - pad.l - pad.r
  const innerH = height - pad.t - pad.b
  const x = (index: number) => pad.l + (labels.length === 1 ? innerW / 2 : (index * innerW) / (labels.length - 1))
  const y = (value: number) => pad.t + (1 - (value - min) / span) * innerH
  const ticks = [0, 0.5, 1].map((part) => Math.round(min + span * part))
  const safeActive = Math.min(active, labels.length - 1)

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} role='img' aria-label={title} className='h-auto w-full'>
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={pad.l} x2={width - pad.r} y1={y(tick)} y2={y(tick)} stroke='hsl(var(--border))' strokeWidth='1' />
            <text x={pad.l - 6} y={y(tick) + 3} textAnchor='end' fill='hsl(var(--muted-foreground))' fontSize='9'>{tick}</text>
          </g>
        ))}
        {series.map((item) => {
          const d = item.values.map((value, index) => `${index === 0 ? 'M' : 'L'} ${x(index).toFixed(1)} ${y(value).toFixed(1)}`).join(' ')
          return (
            <g key={item.id}>
              <path d={d} fill='none' stroke={item.color} strokeWidth='2' strokeLinejoin='round' strokeLinecap='round' />
              {item.values.map((value, index) => (
                <circle key={`${item.id}-${labels[index]}`} cx={x(index)} cy={y(value)} r={index === safeActive ? 3.5 : 2.2} fill={item.color} />
              ))}
            </g>
          )
        })}
        {labels.map((label, index) => (
          <text key={label} x={x(index)} y={height - 6} textAnchor='middle' fill={index === safeActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'} fontSize='9'>{label}</text>
        ))}
      </svg>
      <div className='mt-2 flex flex-wrap gap-1' role='group' aria-label={title}>
        {labels.map((label, index) => (
          <button
            key={`${label}-${index}`}
            type='button'
            aria-pressed={index === safeActive}
            className={`rounded-full px-2 py-1 text-[11px] transition-colors motion-reduce:transition-none ${focusRing} ${index === safeActive ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]' : `${tk.muted} hover:bg-[hsl(var(--accent))]`}`}
            onClick={() => setActive(index)}
          >
            {label}
          </button>
        ))}
      </div>
      <ul className='mt-2 flex flex-wrap gap-x-3 gap-y-1' aria-live='polite' id={describedBy}>
        {series.map((item) => (
          <li key={item.id} className='flex items-center gap-1.5 text-[11px] text-[hsl(var(--muted-foreground))]'>
            <span className='h-2 w-2 rounded-full' style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
            <span className='tabular-nums text-[hsl(var(--foreground))]'>{Math.round(item.values[safeActive] ?? 0)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export interface BarRow {
  label: string
  value: number
  color: string
}

export function BarList ({ title, rows, suffix = '' }: { title: string, rows: BarRow[], suffix?: string }) {
  const max = Math.max(...rows.map((row) => row.value), 1)
  const rowH = 36
  const height = rows.length * rowH
  const width = 320
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role='img' aria-label={title} className='h-auto w-full'>
      {rows.map((row, index) => {
        const y = index * rowH
        const barW = Math.max(0, Math.min(188, (row.value / max) * 188))
        return (
          <g key={row.label}>
            <text x='0' y={y + 14} fill='hsl(var(--muted-foreground))' fontSize='11'>{row.label}</text>
            <text x={width} y={y + 14} textAnchor='end' fill='hsl(var(--foreground))' fontSize='11'>{Math.round(row.value)}{suffix}</text>
            <rect x='0' y={y + 20} width='188' height='8' rx='4' fill='hsl(var(--foreground) / 0.12)' />
            <rect x='0' y={y + 20} width={barW} height='8' rx='4' fill={row.color} />
          </g>
        )
      })}
    </svg>
  )
}

export function ColumnChart ({ title, labels, values, color }: { title: string, labels: string[], values: number[], color: string }) {
  const [active, setActive] = useState(Math.max(0, values.findLastIndex((value) => value > 0)))
  const width = 320
  const height = 150
  const pad = { l: 28, r: 6, t: 10, b: 22 }
  const max = niceMax(Math.max(...values, 1))
  const innerW = width - pad.l - pad.r
  const innerH = height - pad.t - pad.b
  const gap = 8
  const barW = (innerW - gap * (labels.length - 1)) / labels.length
  const safeActive = Math.min(active, labels.length - 1)

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} role='img' aria-label={title} className='h-auto w-full'>
        <line x1={pad.l} x2={width - pad.r} y1={pad.t + innerH} y2={pad.t + innerH} stroke='hsl(var(--border))' />
        {values.map((value, index) => {
          const h = (value / max) * innerH
          const x = pad.l + index * (barW + gap)
          const y = pad.t + innerH - h
          return (
            <g key={labels[index]}>
              <rect x={x} y={y} width={barW} height={Math.max(h, value > 0 ? 2 : 0)} rx='3' fill={color} opacity={index === safeActive ? 1 : 0.55} />
              <text x={x + barW / 2} y={height - 6} textAnchor='middle' fill='hsl(var(--muted-foreground))' fontSize='9'>{labels[index]}</text>
            </g>
          )
        })}
      </svg>
      <div className='mt-2 flex flex-wrap gap-1'>
        {labels.map((label, index) => (
          <button
            key={`${label}-${index}`}
            type='button'
            aria-pressed={index === safeActive}
            onClick={() => setActive(index)}
            className={`rounded-full px-2 py-1 text-[11px] motion-reduce:transition-none ${focusRing} ${index === safeActive ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className='mt-2 text-xs text-[hsl(var(--muted-foreground))]' aria-live='polite'>
        {labels[safeActive]} <span className='tabular-nums text-[hsl(var(--foreground))]'>{Math.round(values[safeActive] ?? 0)}</span>
      </p>
    </div>
  )
}
