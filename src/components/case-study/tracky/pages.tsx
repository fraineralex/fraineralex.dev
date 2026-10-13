'use client'

import { useEffect, useId, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import {
  Activity,
  BookOpen,
  Calendar,
  ChevronRight,
  Circle,
  ClipboardList,
  Clock,
  Coffee,
  Dumbbell,
  Drumstick,
  EggFried,
  Filter,
  Flame,
  FlameKindling,
  HandPlatter,
  MessageSquare,
  Moon,
  Nut,
  PlusCircle,
  Square,
  Sun,
  TrendingUp,
  Utensils,
  Weight,
  Wheat
} from 'lucide-react'
import { ColumnChart, DualLineChart, LineChart, StackedAreaChart, type ChartSeries } from './charts'
import type { ChatContext } from './ai-chat'
import { copy, type Lang } from './copy'
import {
  GOALS,
  PROFILE,
  WEIGHT_TREND,
  addMacros,
  capPercent,
  dayMacros,
  exercisesOn,
  foodMacros,
  formatDayKey,
  formatDuration,
  formatLong,
  formatNum,
  formatShort,
  formatTime,
  nameOf,
  rawPercent,
  sameUtcDay,
  mondayOf,
  weekDays,
  weekIndex,
  type ExerciseEntry,
  type FoodEntry,
  type MealGroup,
  type NoteEntry
} from './data'
import type { PageId } from './shell'
import { focusRing, tk, TkButton, TkCard } from './ui'

export interface SimHandlers {
  onOpenChat: (context: ChatContext, button: HTMLButtonElement) => void
  onNavigate: (page: PageId) => void
}

interface PageProps extends SimHandlers {
  lang: Lang
  foods: FoodEntry[]
  exercises: ExerciseEntry[]
  notes: NoteEntry[]
  anchor: string
}

const MEAL_ORDER: MealGroup[] = ['breakfast', 'lunch', 'snack', 'dinner', 'uncategorized']

/** Painted cell stays the same size. The control is at least 44px and sits out of flow so the row does not grow. */
function DayTarget ({
  label,
  onSelect,
  className,
  children,
  style
}: {
  label: string
  onSelect: () => void
  className: string
  children?: ReactNode
  style?: CSSProperties
}) {
  return (
    <div className={`relative ${className}`} style={style}>
      {children}
      <button
        type='button'
        aria-label={label}
        onClick={onSelect}
        className={`absolute left-1/2 top-1/2 z-10 h-11 w-full min-w-11 -translate-x-1/2 -translate-y-1/2 rounded-md bg-transparent focus-visible:z-20 ${focusRing}`}
      />
    </div>
  )
}

function neededOf (key: 'kcal' | 'protein' | 'carbs' | 'fat') {
  if (key === 'kcal') return GOALS.kcal
  if (key === 'protein') return GOALS.protein
  if (key === 'carbs') return GOALS.carbs
  return GOALS.fat
}

function rangeLabel (anchor: string, lang: Lang) {
  const start = new Date(anchor)
  start.setUTCDate(start.getUTCDate() - 26)
  return `${formatShort(start.toISOString(), lang)} - ${copy[lang].now}`
}

function ChatButtons ({ lang, context, onOpenChat, extra }: {
  lang: Lang
  context: ChatContext
  onOpenChat: SimHandlers['onOpenChat']
  extra?: 'meal' | 'exercise' | 'both'
}) {
  const text = copy[lang]
  return (
    <>
      {(extra === 'meal' || extra === 'both') && context !== 'exercise' && (
        <TkButton size='sm' className='flex-grow sm:flex-grow-0' onClick={(event) => onOpenChat(context, event.currentTarget)}>
          <ClipboardList className='h-4 w-4' aria-hidden='true' />
          {context === 'food' ? text.food.registerFood : text.food.addMeal}
        </TkButton>
      )}
      {extra === 'both' && (
        <TkButton size='sm' className='flex-grow sm:flex-grow-0' onClick={(event) => onOpenChat('exercise', event.currentTarget)}>
          <Dumbbell className='h-4 w-4' aria-hidden='true' /> {text.exercise.addExercise}
        </TkButton>
      )}
      {extra === 'exercise' && (
        <TkButton size='sm' className='flex-grow sm:flex-grow-0' onClick={(event) => onOpenChat('exercise', event.currentTarget)}>
          <Dumbbell className='h-4 w-4' aria-hidden='true' /> {text.exercise.addExercise}
        </TkButton>
      )}
      <TkButton size='sm' className='flex-grow sm:flex-grow-0' onClick={(event) => onOpenChat(context, event.currentTarget)}>
        <MessageSquare className='h-4 w-4' aria-hidden='true' /> {text.food.aiChat}
      </TkButton>
    </>
  )
}

function NutritionGraphic ({ foods, anchor, lang }: { foods: FoodEntry[], anchor: string, lang: Lang }) {
  const text = copy[lang]
  const [showConsumed, setShowConsumed] = useState(true)
  const [detail, setDetail] = useState(text.squareHint)
  useEffect(() => { setDetail(text.squareHint) }, [lang, text.squareHint])
  const days = weekDays(anchor)
  const todayIndex = weekIndex(new Date(anchor))
  const totals = days.map((day) => dayMacros(foods, day))
  const keys = ['kcal', 'protein', 'fat', 'carbs'] as const

  function cell (key: typeof keys[number], index: number) {
    const needed = neededOf(key)
    const consumed = index > todayIndex ? 0 : totals[index]?.[key] ?? 0
    const shown = showConsumed ? consumed : Math.max(needed - consumed, 0)
    const percent = index > todayIndex
      ? (showConsumed ? 0 : 100)
      : (showConsumed ? rawPercent(consumed, needed) : rawPercent(Math.max(needed - consumed, 0), needed))
    return { consumed, needed, shown, percent }
  }

  function score (index: number) {
    if (index > todayIndex) return showConsumed ? 0 : 100
    const parts = keys.map((key) => Math.min(1, (totals[index]?.[key] ?? 0) / neededOf(key)))
    const avg = parts.reduce((sum, part) => sum + part, 0) / 4
    return showConsumed ? avg * 100 : (1 - avg) * 100
  }

  const names = {
    kcal: text.nutrition.calories,
    protein: text.nutrition.protein,
    fat: text.nutrition.fats,
    carbs: text.nutrition.carbs
  }
  const marks = { kcal: '', protein: ' P', fat: ' F', carbs: ' C' }

  return (
    <TkCard className='p-3 sm:p-4'>
      <h2 className='mb-3 font-semibold'>{text.sections.nutritionTargets}</h2>
      <div className='flex gap-2'>
        <div className='min-w-0 flex-1 space-y-1.5'>
          {keys.map((key) => (
            <div key={key} className='grid grid-cols-7 gap-1'>
              {days.map((day, index) => {
                const info = cell(key, index)
                const label = `${text.days[index]}, ${names[key]}, ${Math.round(info.percent)}%. ${text.nutrition.consumed} ${formatNum(info.consumed, lang)} / ${formatNum(info.needed, lang)}`
                const fill = Math.max(0, Math.min(100, info.percent))
                return (
                  <DayTarget
                    key={day.toISOString()}
                    label={label}
                    onSelect={() => setDetail(label)}
                    className='h-6 rounded-md sm:h-8'
                    style={{ background: `linear-gradient(to top, hsl(var(--foreground) / ${index === todayIndex ? 0.9 : 0.5}) ${fill}%, hsl(var(--primary) / 0.2) ${fill}%)` }}
                  />
                )
              })}
            </div>
          ))}
          <div className='grid grid-cols-7 gap-1 pt-1'>
            {days.map((day, index) => {
              const value = score(index)
              const label = `${text.days[index]} ${Math.round(value)}%`
              return (
                <DayTarget
                  key={day.toISOString()}
                  label={label}
                  onSelect={() => setDetail(label)}
                  className={`rounded-md py-1 text-center text-[11px] sm:text-xs ${index === todayIndex ? 'border-2 border-[hsl(var(--foreground))] font-semibold' : tk.muted}`}
                >
                  <span aria-hidden='true'>{text.daysShort[index]}</span>
                </DayTarget>
              )
            })}
          </div>
        </div>
        <div className='flex w-14 shrink-0 flex-col justify-between py-0.5 text-center sm:w-16'>
          {keys.map((key) => {
            const info = cell(key, todayIndex)
            return (
              <p key={key} className='text-xs font-bold leading-tight tabular-nums sm:text-sm'>
                {formatNum(info.shown, lang)}{marks[key]}
                {key === 'kcal' && <Flame className='inline h-4 w-4 pb-0.5' aria-hidden='true' />}
                <small className={`block text-[10px] font-normal sm:text-xs ${tk.muted}`}>{text.of} {formatNum(info.needed, lang)}</small>
              </p>
            )
          })}
          <p className='text-xs font-bold leading-tight tabular-nums sm:text-sm'>
            {Math.round(score(todayIndex))}%
            <small className={`block text-[10px] font-normal sm:text-xs ${tk.muted}`}>{text.of} 100</small>
          </p>
        </div>
      </div>
      <p className={`mt-3 min-h-8 text-xs ${tk.muted}`} aria-live='polite'>{detail}</p>
      <div className='mt-2 flex justify-center gap-2'>
        <TkButton variant={showConsumed ? 'default' : 'ghost'} className='rounded-full' aria-pressed={showConsumed} onClick={() => setShowConsumed(true)}>
          {text.sections.consumed}
        </TkButton>
        <TkButton variant={!showConsumed ? 'default' : 'ghost'} className='rounded-full' aria-pressed={!showConsumed} onClick={() => setShowConsumed(false)}>
          {text.sections.remaining}
        </TkButton>
      </div>
    </TkCard>
  )
}

function InsightCard ({ title, range, value, unit, children, onOpen, openLabel }: {
  title: string
  range: string
  value: string
  unit?: string
  children: ReactNode
  onOpen?: () => void
  openLabel?: string
}) {
  return (
    <TkCard className='flex flex-col p-4 pb-2'>
      <h3 className='font-semibold capitalize'>{title}</h3>
      <p className={`text-xs ${tk.muted}`}>{range}</p>
      <div className='flex-1'>{children}</div>
      <footer className='mt-2 flex items-center justify-between border-t border-[hsl(var(--border))] pt-1'>
        <p className='tabular-nums'>
          {value} {unit && <span className={`text-sm ${tk.muted}`}>{unit}</span>}
        </p>
        {onOpen && (
          <TkButton variant='ghost' size='icon' aria-label={openLabel} onClick={onOpen} className='rounded-full'>
            <ChevronRight className='h-5 w-5' />
          </TkButton>
        )}
      </footer>
    </TkCard>
  )
}

function MacroCards ({ foods, anchor, lang }: { foods: FoodEntry[], anchor: string, lang: Lang }) {
  const text = copy[lang]
  const today = dayMacros(foods, new Date(anchor))
  const items = [
    { key: 'kcal' as const, name: text.nutrition.calories, icon: Flame },
    { key: 'protein' as const, name: text.nutrition.protein, icon: Drumstick },
    { key: 'fat' as const, name: text.nutrition.fats, icon: EggFried },
    { key: 'carbs' as const, name: text.nutrition.carbs, icon: Wheat }
  ]
  return (
    <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {items.map((item) => {
        const consumed = today[item.key]
        const needed = neededOf(item.key)
        const percent = capPercent(consumed, needed)
        const Icon = item.icon
        return (
          <TkCard key={item.key} className='p-4 transition-shadow hover:shadow-lg motion-reduce:transition-none'>
            <div className='flex items-center justify-between pb-2'>
              <h3 className='text-sm font-medium'>{item.name}</h3>
              <Icon className='h-4 w-4 text-[hsl(var(--muted-foreground))]' aria-hidden='true' />
            </div>
            <p className='text-xl font-bold tabular-nums sm:text-2xl'>
              {formatNum(consumed, lang)} / {formatNum(needed, lang)}
            </p>
            <p className={`mt-1 text-xs ${tk.muted}`}>{percent}% {text.food.ofDailyGoal}</p>
            <div className='mt-3 h-2 overflow-hidden rounded-full bg-[hsl(var(--foreground)/0.2)]'>
              <div className='h-full bg-[hsl(var(--foreground))] transition-[width] duration-300 motion-reduce:transition-none' style={{ width: `${percent}%` }} />
            </div>
          </TkCard>
        )
      })}
    </div>
  )
}

function FoodCharts ({ foods, anchor, lang }: { foods: FoodEntry[], anchor: string, lang: Lang }) {
  const text = copy[lang]
  const base = useId()
  const tabs = [
    { id: 'weekly', label: text.food.tabs.weekly },
    { id: 'weight', label: text.food.tabs.weight },
    { id: 'macro', label: text.food.tabs.macro },
    { id: 'today', label: text.food.tabs.today },
    { id: 'week', label: text.food.tabs.week }
  ] as const
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('weekly')
  const days = weekDays(anchor)
  const todayIndex = weekIndex(new Date(anchor))
  const totals = days.map((day, index) => index > todayIndex ? { kcal: 0, protein: 0, carbs: 0, fat: 0 } : dayMacros(foods, day))
  const today = totals[todayIndex] ?? { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  const week = addMacros(totals)
  const goalValues = (source: typeof today, factor: number) => [
    capPercent(source.kcal, GOALS.kcal * factor),
    capPercent(source.protein, GOALS.protein * factor),
    capPercent(source.carbs, GOALS.carbs * factor),
    capPercent(source.fat, GOALS.fat * factor)
  ]
  const goalLabels = [text.nutrition.calories, text.nutrition.protein, text.nutrition.carbs, text.nutrition.fat]
  const macroShare = (grams: number) => today.kcal ? Math.round((grams / today.kcal) * 100) : 0
  const macroLabels = [text.nutrition.protein, text.nutrition.carbs, text.nutrition.fat]
  const macroValues = [macroShare(today.protein), macroShare(today.carbs), macroShare(today.fat)]
  const weightLabels = WEIGHT_TREND.map((_, index) => {
    const date = new Date(anchor)
    date.setUTCDate(date.getUTCDate() - (WEIGHT_TREND.length - 1 - index) * 7)
    return formatShort(date.toISOString(), lang)
  })

  function onTabsKey (event: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex((item) => item.id === tab)
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
    const next = tabs[nextIndex]!
    setTab(next.id)
    document.getElementById(`${base}-tab-${next.id}`)?.focus()
  }

  return (
    <div>
      <div role='tablist' aria-label={text.food.title} className='flex flex-wrap gap-1' onKeyDown={onTabsKey}>
        {tabs.map((item) => {
          const selected = tab === item.id
          return (
            <button
              key={item.id}
              id={`${base}-tab-${item.id}`}
              type='button'
              role='tab'
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(item.id)}
              className={`inline-flex min-h-11 min-w-11 items-center rounded-md px-3 text-xs sm:text-sm ${focusRing} ${selected ? 'bg-[hsl(var(--border))] text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]'}`}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      <TkCard className='mt-4 p-4'>
        {tab === 'weekly' && (
          <div role='tabpanel' aria-labelledby={`${base}-tab-weekly`}>
            <h3 className='mb-2 text-lg font-medium'>{text.food.weeklyTitle}</h3>
            <LineChart
              title={text.food.weeklyTitle}
              labels={text.chartDays}
              series={[
                { id: 'calories', label: text.nutrition.calories, color: '#3b82f6', values: totals.map((day) => day.kcal) },
                { id: 'protein', label: text.nutrition.protein, color: '#f43f5e', values: totals.map((day) => day.protein) },
                { id: 'fats', label: text.nutrition.fats, color: '#fbbf24', values: totals.map((day) => day.fat) },
                { id: 'carbs', label: text.nutrition.carbs, color: '#4ade80', values: totals.map((day) => day.carbs) }
              ]}
            />
          </div>
        )}
        {tab === 'weight' && (
          <div role='tabpanel' aria-labelledby={`${base}-tab-weight`}>
            <h3 className='mb-2 text-lg font-medium'>{text.food.weightTitle}</h3>
            <LineChart
              title={text.food.weightTitle}
              labels={weightLabels}
              ySuffix={` ${text.units.kg}`}
              zeroBaseline={false}
              series={[{ id: 'weight', label: text.units.kg, color: '#10b981', values: WEIGHT_TREND }]}
            />
          </div>
        )}
        {tab === 'macro' && (
          <div role='tabpanel' aria-labelledby={`${base}-tab-macro`}>
            <h3 className='mb-2 text-lg font-medium'>{text.food.macroTitle}</h3>
            <ColumnChart title={text.food.macroTitle} labels={macroLabels} values={macroValues} color='#3b82f6' ySuffix='%' />
          </div>
        )}
        {tab === 'today' && (
          <div role='tabpanel' aria-labelledby={`${base}-tab-today`}>
            <h3 className='mb-2 text-lg font-medium'>{text.food.todayTitle}</h3>
            <ColumnChart title={text.food.todayTitle} labels={goalLabels} values={goalValues(today, 1)} color='#4ade80' ySuffix='%' />
          </div>
        )}
        {tab === 'week' && (
          <div role='tabpanel' aria-labelledby={`${base}-tab-week`}>
            <h3 className='mb-2 text-lg font-medium'>{text.food.weekTitle}</h3>
            <ColumnChart title={text.food.weekTitle} labels={goalLabels} values={goalValues(week, 7)} color='#8b5cf6' ySuffix='%' />
          </div>
        )}
      </TkCard>
    </div>
  )
}

export function DashboardPage ({ lang, foods, exercises, anchor, onOpenChat, onNavigate }: PageProps) {
  const text = copy[lang]
  const allFood = addMacros(foods.map(foodMacros))
  const burned = PROFILE.historyBurned + exercises.reduce((sum, exercise) => sum + exercise.kcal, 0)
  const range = rangeLabel(anchor, lang)
  const goalProgress = Math.round(((PROFILE.startWeight - PROFILE.weight) / (PROFILE.startWeight - PROFILE.goalWeight)) * 100)

  return (
    <div className='space-y-4 pb-2'>
      <div className='flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between'>
        <h1 className='text-center text-2xl font-bold uppercase md:text-left'>{formatLong(anchor, lang)}</h1>
        <div className='flex flex-wrap justify-center gap-2 md:justify-end'>
          <TkButton size='sm' className='flex-grow sm:flex-grow-0' onClick={(event) => onOpenChat('dashboard', event.currentTarget)}>
            <MessageSquare className='h-4 w-4' aria-hidden='true' /> {text.food.aiChat}
          </TkButton>
          <TkButton size='sm' className='flex-grow sm:flex-grow-0' onClick={(event) => onOpenChat('dashboard', event.currentTarget)}>
            <ClipboardList className='h-4 w-4' aria-hidden='true' /> {text.food.addMeal}
          </TkButton>
          <TkButton size='sm' className='flex-grow sm:flex-grow-0' onClick={(event) => onOpenChat('exercise', event.currentTarget)}>
            <Dumbbell className='h-4 w-4' aria-hidden='true' /> {text.exercise.addExercise}
          </TkButton>
        </div>
      </div>
      <div className='grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]'>
        <NutritionGraphic foods={foods} anchor={anchor} lang={lang} />
        <div className='grid gap-3'>
          <div className='grid grid-cols-2 gap-3'>
            <InsightCard title={text.sections.expenditure} range={range} value={formatNum(burned, lang)} unit={text.units.kcal} openLabel={text.openDiary} onOpen={() => onNavigate('diary')}>
              <span className='my-4 flex justify-end'><Square className='h-4 w-4 text-red-400' strokeWidth={4} aria-hidden='true' /></span>
            </InsightCard>
            <InsightCard title={text.sections.scaleWeight} range={range} value={String(PROFILE.weight)} unit={text.units.kg} openLabel={text.openDiary} onOpen={() => onNavigate('diary')}>
              <span className='my-4 flex justify-end'><Circle className='h-4 w-4 text-purple-400' strokeWidth={4} aria-hidden='true' /></span>
            </InsightCard>
          </div>
          <InsightCard title={text.sections.goalProgress} range={range} value={text.timeIn} openLabel={text.openDiary} onOpen={() => onNavigate('diary')}>
            <div className='my-4 h-4 overflow-hidden rounded-full bg-[hsl(var(--primary)/0.2)]' aria-hidden='true'>
              <div className='h-full bg-[hsl(var(--primary))]' style={{ width: `${goalProgress}%` }} />
            </div>
          </InsightCard>
        </div>
      </div>
      <div className='grid gap-3 md:grid-cols-3'>
        <InsightCard title={text.sections.nutrition} range={range} value={formatNum(PROFILE.historyKcal + allFood.kcal, lang)} unit={text.units.kcal} openLabel={text.openDiary} onOpen={() => onNavigate('diary')}>
          <span className='my-3 flex justify-end'><Square className='h-4 w-4 text-yellow-400' strokeWidth={4} aria-hidden='true' /></span>
        </InsightCard>
        <TkCard className='py-1'>
          <div className='grid grid-cols-2 gap-4 p-4'>
            <div className='flex flex-col items-center gap-1 text-center'>
              <HandPlatter className='h-7 w-7' aria-hidden='true' />
              <div className='text-2xl font-bold tabular-nums'>{PROFILE.foodStreak}</div>
              <p className={`text-xs ${tk.muted}`}>{text.streaks.food}</p>
            </div>
            <div className='flex flex-col items-center gap-1 text-center'>
              <Dumbbell className='h-7 w-7' aria-hidden='true' />
              <div className='text-2xl font-bold tabular-nums'>{PROFILE.exerciseStreak}</div>
              <p className={`text-xs ${tk.muted}`}>{text.streaks.exercise}</p>
            </div>
          </div>
        </TkCard>
        <InsightCard title={text.sections.weightGoal.replace('{goal}', text.goalLose)} range={range} value={String(PROFILE.goalWeight)} unit={text.units.kg} openLabel={text.openDiary} onOpen={() => onNavigate('diary')}>
          <span className='my-3 flex justify-end'><Circle className='h-4 w-4 text-green-400' strokeWidth={4} aria-hidden='true' /></span>
        </InsightCard>
      </div>
    </div>
  )
}

export function FoodPage ({ lang, foods, anchor, onOpenChat }: PageProps) {
  const text = copy[lang]
  return (
    <div className='pb-4'>
      <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='hidden text-2xl font-bold uppercase sm:block'>{formatLong(anchor, lang)}</h1>
        <div className='flex w-full flex-wrap justify-center gap-2 sm:w-auto sm:justify-end'>
          <TkButton size='sm' onClick={(event) => onOpenChat('food', event.currentTarget)}>
            <PlusCircle className='h-4 w-4' aria-hidden='true' /> {text.food.registerFood}
          </TkButton>
          <TkButton size='sm' onClick={(event) => onOpenChat('food', event.currentTarget)}>
            <ClipboardList className='h-4 w-4' aria-hidden='true' /> {text.food.addMeal}
          </TkButton>
          <ChatButtons lang={lang} context='food' onOpenChat={onOpenChat} />
        </div>
      </div>
      <MacroCards foods={foods} anchor={anchor} lang={lang} />
      <FoodCharts foods={foods} anchor={anchor} lang={lang} />
    </div>
  )
}

const TIME_ICONS = { breakfast: Sun, lunch: Utensils, snack: Coffee, dinner: Moon } as const

function exerciseKind (exercise: ExerciseEntry) {
  const name = `${exercise.nameEn} ${exercise.nameEs}`.toLowerCase()
  if (name.includes('run') || name.includes('carrer') || name.includes('cardio')) return 'cardio'
  return 'gym'
}

function ChartNote ({ lead, note, trend = true }: { lead: string, note: string, trend?: boolean }) {
  return (
    <footer className='mt-3 flex flex-col items-start gap-2 text-sm'>
      <p className='flex items-center gap-2 font-medium leading-none'>
        {lead}
        {trend && <TrendingUp className='h-4 w-4' aria-hidden='true' />}
      </p>
      <p className={`leading-none ${tk.muted}`}>{note}</p>
    </footer>
  )
}

export function ExercisePage ({ lang, exercises, anchor, onOpenChat }: PageProps) {
  const text = copy[lang]
  const graphics = text.exercise.graphics
  const base = useId()
  const tabs = [
    { id: 'energy', label: graphics.tabs.energy },
    { id: 'frequency', label: graphics.tabs.frequency },
    { id: 'time', label: graphics.tabs.time },
    { id: 'progress', label: graphics.tabs.progress }
  ] as const
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('energy')
  const days = weekDays(anchor)
  const todayIndex = weekIndex(new Date(anchor))
  const burned = PROFILE.historyBurned + exercises.reduce((sum, exercise) => sum + exercise.kcal, 0)
  const minutes = PROFILE.historyMinutes + exercises.reduce((sum, exercise) => sum + exercise.minutes, 0)
  const sessions = PROFILE.historySessions + exercises.length
  const energyLabels = text.chartDays.slice(0, todayIndex + 1)
  const energyValues = days.slice(0, todayIndex + 1).map((day) => exercisesOn(exercises, day).reduce((sum, exercise) => sum + exercise.kcal, 0))
  const weekBurn = energyValues.reduce((sum, value) => sum + value, 0)
  const weekCount = exercises.filter((exercise) => days.some((day) => sameUtcDay(new Date(exercise.at), day))).length
  const weekMinutes = exercises.filter((exercise) => days.some((day) => sameUtcDay(new Date(exercise.at), day))).reduce((sum, exercise) => sum + exercise.minutes, 0)
  const percent = Math.round((weekBurn / PROFILE.weekBurnTarget) * 100)
  const energyLead = percent >= 100
    ? text.exercise.exceeded.replace('{percent}', String(percent - 100))
    : text.exercise.reached.replace('{percent}', String(percent))
  const energyNote = percent >= 100 ? graphics.outstanding : percent >= 70 ? graphics.closer : graphics.every
  const avgTime = weekMinutes / 7
  const frequencyLead = avgTime > 30 ? graphics.excellent : avgTime > 15 ? graphics.goodProgress : graphics.room
  const frequencyNote = avgTime > 30 ? graphics.dedication : avgTime > 15 ? graphics.routine : graphics.increase
  const loggedDays = days.filter((day, index) => index <= todayIndex && exercisesOn(exercises, day).length > 0)
  const frequencyLabels = loggedDays.map((day) => formatShort(day.toISOString(), lang))
  const gymLabel = lang === 'es' ? 'Gimnasio' : 'Gym'
  const frequencySeries: ChartSeries[] = [
    {
      id: 'gym',
      label: gymLabel,
      color: 'hsl(var(--chart-1))',
      values: loggedDays.map((day) => exercisesOn(exercises, day).filter((exercise) => exerciseKind(exercise) === 'gym').reduce((sum, exercise) => sum + exercise.minutes, 0))
    },
    {
      id: 'cardio',
      label: 'Cardio',
      color: 'hsl(var(--chart-2))',
      values: loggedDays.map((day) => exercisesOn(exercises, day).filter((exercise) => exerciseKind(exercise) === 'cardio').reduce((sum, exercise) => sum + exercise.minutes, 0))
    }
  ].filter((series) => series.values.some((value) => value > 0))
  const timeMeals = ['breakfast', 'lunch', 'snack', 'dinner'] as const
  const timeCounts = timeMeals.map((meal) => ({
    meal,
    sessions: exercises.filter((exercise) => exercise.meal === meal).length
  }))
  const topTime = [...timeCounts].sort((a, b) => b.sessions - a.sessions)[0] ?? { meal: 'breakfast' as const, sessions: 0 }
  const topName = text.meals[topTime.meal]
  const monthMap = new Map<string, { label: string, kcal: number, minutes: number }>()
  exercises.forEach((exercise) => {
    const start = mondayOf(new Date(exercise.at))
    const end = new Date(start)
    end.setUTCDate(start.getUTCDate() + 6)
    const key = start.toISOString()
    const current = monthMap.get(key) ?? {
      label: `${formatShort(start.toISOString(), lang)} - ${formatShort(end.toISOString(), lang)}`,
      kcal: 0,
      minutes: 0
    }
    current.kcal += exercise.kcal
    current.minutes += exercise.minutes
    monthMap.set(key, current)
  })
  const monthPoints = [...monthMap.entries()].sort((a, b) => a[0].localeCompare(b[0])).map((entry) => entry[1])
  const monthBurn = monthPoints.reduce((sum, point) => sum + point.kcal, 0)
  const monthPercent = Math.round((monthBurn / PROFILE.weekBurnTarget) * 100)
  const monthLead = monthPercent >= 100
    ? graphics.exceededMonth.replace('{percent}', String(monthPercent - 100))
    : graphics.reachedMonth.replace('{percent}', String(monthPercent))
  const monthNote = monthPercent >= 100 ? graphics.outstandingMonth : monthPercent >= 70 ? graphics.greatMonth : graphics.keepGoing
  const cards = [
    { name: text.exercise.cards.burned, value: `${formatNum(burned, lang)} ${text.units.kcal}`, icon: Flame },
    { name: text.exercise.cards.time, value: formatDuration(minutes), icon: Clock },
    { name: text.exercise.cards.avg, value: formatDuration(Math.round(minutes / Math.max(sessions, 1))), icon: TrendingUp },
    { name: text.exercise.cards.week, value: `${formatNum(weekCount, lang)} ${text.exercise.cards.times}`, icon: Activity }
  ]

  function onTabsKey (event: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex((item) => item.id === tab)
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
    const next = tabs[nextIndex]!
    setTab(next.id)
    document.getElementById(`${base}-tab-${next.id}`)?.focus()
  }

  return (
    <div className='space-y-5 pb-4'>
      <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='hidden text-xl font-bold uppercase sm:block lg:text-2xl'>{formatLong(anchor, lang)}</h1>
        <div className='flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end'>
          <ChatButtons lang={lang} context='exercise' onOpenChat={onOpenChat} extra='exercise' />
        </div>
      </div>
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <TkCard key={card.name} className='p-4 transition-shadow hover:shadow-lg motion-reduce:transition-none'>
              <div className='flex items-center justify-between gap-2 pb-2'>
                <h2 className='text-sm font-medium'>{card.name}</h2>
                <Icon className='h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]' aria-hidden='true' />
              </div>
              <p className='text-2xl font-bold tabular-nums'>{card.value}</p>
            </TkCard>
          )
        })}
      </div>
      <div>
        <div role='tablist' aria-label={text.exercise.title} className='flex w-fit flex-wrap gap-1' onKeyDown={onTabsKey}>
          {tabs.map((item) => {
            const selected = tab === item.id
            return (
              <button
                key={item.id}
                id={`${base}-tab-${item.id}`}
                type='button'
                role='tab'
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(item.id)}
                className={`inline-flex min-h-11 min-w-11 flex-grow items-center rounded-md px-3 text-xs sm:flex-grow-0 sm:text-sm ${focusRing} ${selected ? 'bg-[hsl(var(--border))] text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]'}`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
        <TkCard className='mt-4 p-4'>
          {tab === 'energy' && (
            <div role='tabpanel' aria-labelledby={`${base}-tab-energy`}>
              <h2 className='text-lg font-medium'>{text.exercise.energyTitle}</h2>
              <p className={`mb-2 text-sm ${tk.muted}`}>{text.exercise.energyDesc}</p>
              <ColumnChart title={graphics.caloriesBurned} labels={energyLabels} values={energyValues} color='hsl(var(--chart-1))' />
              <ChartNote lead={energyLead} note={energyNote} />
            </div>
          )}
          {tab === 'frequency' && (
            <div role='tabpanel' aria-labelledby={`${base}-tab-frequency`}>
              <h2 className='text-lg font-medium'>{graphics.frequencyTitle}</h2>
              <p className={`mb-2 text-sm ${tk.muted}`}>{graphics.frequencyDesc}</p>
              {frequencyLabels.length > 0 && (
                <StackedAreaChart title={graphics.frequencyTitle} labels={frequencyLabels} series={frequencySeries} />
              )}
              <ChartNote lead={frequencyLead} note={frequencyNote} trend={avgTime > 15} />
            </div>
          )}
          {tab === 'time' && (
            <div role='tabpanel' aria-labelledby={`${base}-tab-time`}>
              <h2 className='text-lg font-medium'>{graphics.timeTitle}</h2>
              <p className={`mb-3 text-sm ${tk.muted}`}>{graphics.timeDesc}</p>
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                {timeCounts.map((item) => {
                  const Icon = TIME_ICONS[item.meal]
                  return (
                    <TkCard key={item.meal} className='bg-slate-200'>
                      <div className='flex flex-col items-center justify-center p-6 text-center'>
                        <Icon className='mb-2 h-8 w-8 text-[hsl(var(--primary))]' aria-hidden='true' />
                        <h3 className='text-lg font-semibold'>{text.meals[item.meal]}</h3>
                        <p className='text-2xl font-bold tabular-nums'>{item.sessions}</p>
                        <p className={`text-sm ${tk.muted}`}>{graphics.sessions}</p>
                      </div>
                    </TkCard>
                  )
                })}
              </div>
              <ChartNote
                lead={topTime.sessions > 0 ? text.exercise.mostActive.replace('{time}', topName) : graphics.noActive}
                note={topTime.sessions > 0 ? graphics.greatJob.replace('{time}', topName) : graphics.couch}
                trend={topTime.sessions > 0}
              />
            </div>
          )}
          {tab === 'progress' && (
            <div role='tabpanel' aria-labelledby={`${base}-tab-progress`}>
              <h2 className='text-lg font-medium'>{graphics.progressTitle}</h2>
              <p className={`mb-2 text-sm ${tk.muted}`}>{graphics.progressDesc}</p>
              {monthPoints.length > 0 && (
                <DualLineChart
                  title={graphics.progressTitle}
                  labels={monthPoints.map((point) => point.label)}
                  left={{ id: 'energy', label: graphics.energyKcal, color: 'hsl(var(--chart-1))', values: monthPoints.map((point) => point.kcal) }}
                  right={{ id: 'time', label: graphics.timeMinutes, color: 'hsl(var(--chart-2))', values: monthPoints.map((point) => point.minutes) }}
                />
              )}
              <ChartNote lead={monthLead} note={monthNote} />
            </div>
          )}
        </TkCard>
      </div>
    </div>
  )
}

type DiaryFilter = 'meal' | 'exercise' | 'food' | 'updates'

export function DiaryPage ({ lang, foods, exercises, notes, anchor }: PageProps) {
  const text = copy[lang]
  const [types, setTypes] = useState<DiaryFilter[]>(['meal', 'exercise', 'food', 'updates'])
  const [date, setDate] = useState('all')
  const [group, setGroup] = useState('all')

  const rows = [
    ...foods.map((food) => ({
      id: food.id,
      kind: 'meal' as const,
      at: food.at,
      title: nameOf(food, lang),
      meal: food.meal,
      kcal: food.kcal,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat
    })),
    ...exercises.map((exercise) => ({
      id: exercise.id,
      kind: 'exercise' as const,
      at: exercise.at,
      title: nameOf(exercise, lang),
      meal: exercise.meal,
      burned: exercise.kcal,
      minutes: exercise.minutes,
      effort: text.exercise.efforts[exercise.effort]
    })),
    ...notes.map((note) => ({
      id: note.id,
      kind: note.kind === 'catalog' ? 'food' as const : 'weight' as const,
      at: note.at,
      title: lang === 'es' ? note.titleEs : note.titleEn,
      detail: lang === 'es' ? note.detailEs : note.detailEn,
      meal: undefined,
      kcal: undefined,
      protein: undefined,
      carbs: undefined,
      fat: undefined,
      burned: undefined,
      minutes: undefined,
      effort: undefined
    }))
  ].sort((a, b) => b.at.localeCompare(a.at))

  const dates = [...new Set(rows.map((row) => formatDayKey(row.at, lang)))]
  const filtered = rows.filter((row) => {
    const typeOk = (row.kind === 'meal' && types.includes('meal'))
      || (row.kind === 'exercise' && types.includes('exercise'))
      || (row.kind === 'food' && types.includes('food'))
      || (row.kind === 'weight' && types.includes('updates'))
    const dateOk = date === 'all' || formatDayKey(row.at, lang) === date
    const groupOk = group === 'all' || row.meal === group
    return typeOk && dateOk && groupOk
  })
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, row) => {
    const key = formatDayKey(row.at, lang)
    acc[key] = [...(acc[key] ?? []), row]
    return acc
  }, {})

  function toggle (type: DiaryFilter) {
    setTypes((current) => current.includes(type) ? current.filter((item) => item !== type) : [...current, type])
  }

  return (
    <div className='space-y-6 pb-4'>
      <h1 className='text-2xl font-bold uppercase'>{formatLong(anchor, lang)}</h1>
      <header className='rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-lg sm:p-6'>
        <h2 className='mb-4 flex items-center text-xl font-semibold sm:text-2xl'>
          <Filter className='mr-2 h-5 w-5' aria-hidden='true' /> {text.diary.filters}
        </h2>
        <div className='flex flex-col gap-4 sm:flex-row sm:flex-wrap'>
          <div className='min-w-0 flex-1'>
            <h3 className='mb-2 text-sm font-medium'>{text.diary.entryTypes}</h3>
            <div className='flex flex-wrap gap-2'>
              {(['meal', 'exercise', 'food', 'updates'] as const).map((type) => (
                <TkButton key={type} size='sm' variant={types.includes(type) ? 'default' : 'outline'} aria-pressed={types.includes(type)} className='capitalize' onClick={() => toggle(type)}>
                  {text.diary.types[type]}
                </TkButton>
              ))}
            </div>
          </div>
          <label className='space-y-2 text-sm font-medium'>
            <span className='mb-2 block'>{text.diary.date}</span>
            <span className='relative block'>
            <Calendar className='pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]' aria-hidden='true' />
            <select value={date} onChange={(event) => setDate(event.target.value)} className={`h-11 min-h-11 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] pl-8 pr-2 text-sm text-[hsl(var(--foreground))] sm:w-[200px] [&>option]:bg-[hsl(var(--card))] ${focusRing}`}>
              <option value='all'>{text.diary.allDates}</option>
              {dates.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            </span>
          </label>
          <label className='space-y-2 text-sm font-medium'>
            <span className='block'>{text.diary.diaryGroup}</span>
            <select value={group} onChange={(event) => setGroup(event.target.value)} className={`h-11 min-h-11 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 text-sm text-[hsl(var(--foreground))] sm:w-[200px] [&>option]:bg-[hsl(var(--card))] ${focusRing}`}>
              <option value='all'>{text.diary.allGroups}</option>
              {MEAL_ORDER.filter((meal) => meal !== 'uncategorized').map((meal) => <option key={meal} value={meal}>{text.meals[meal]}</option>)}
            </select>
          </label>
        </div>
      </header>
      {Object.entries(grouped).map(([day, entries]) => {
        const dayFoods = foods.filter((food) => formatDayKey(food.at, lang) === day)
        const dayExercises = exercises.filter((exercise) => formatDayKey(exercise.at, lang) === day)
        const macros = addMacros(dayFoods.map(foodMacros))
        const burned = dayExercises.reduce((sum, exercise) => sum + exercise.kcal, 0)
        const duration = dayExercises.reduce((sum, exercise) => sum + exercise.minutes, 0)
        const summary = [
          types.includes('exercise') && burned > 0 ? { label: text.diary.burned, value: `${formatNum(burned, lang)}/${formatNum(400, lang)} ${text.units.kcal}`, icon: FlameKindling } : null,
          types.includes('meal') && macros.kcal > 0 ? { label: text.diary.cal, value: `${formatNum(macros.kcal, lang)}/${formatNum(GOALS.kcal, lang)} ${text.units.kcal}`, icon: Flame } : null,
          types.includes('meal') && macros.protein > 0 ? { label: text.nutrition.protein, value: `${formatNum(macros.protein, lang)}/${formatNum(GOALS.protein, lang)} ${text.units.g}`, icon: Drumstick } : null,
          types.includes('meal') && macros.carbs > 0 ? { label: text.nutrition.carbs, value: `${formatNum(macros.carbs, lang)}/${formatNum(GOALS.carbs, lang)} ${text.units.g}`, icon: Wheat } : null,
          types.includes('meal') && macros.fat > 0 ? { label: text.nutrition.fat, value: `${formatNum(macros.fat, lang)}/${formatNum(GOALS.fat, lang)} ${text.units.g}`, icon: Nut } : null,
          types.includes('exercise') && duration > 0 ? { label: text.diary.duration, value: `${formatNum(duration, lang)} ${text.units.min}`, icon: Clock } : null
        ].filter((item): item is { label: string, value: string, icon: typeof Flame } => Boolean(item))
        return (
          <section key={day} className='overflow-hidden rounded-lg shadow-md'>
            <div className='flex items-center px-2 py-4'>
              <span className='h-px flex-1 bg-[hsl(var(--foreground))]' />
              <h3 className='px-3 text-sm'>{day}</h3>
              <span className='h-px flex-1 bg-[hsl(var(--foreground))]' />
            </div>
            <div className='divide-y divide-[hsl(var(--border))]'>
              {entries.map((entry) => (
                <article key={entry.id} className='px-2 py-4 sm:px-4'>
                  <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex items-center gap-3'>
                      {entry.kind === 'meal' && <Utensils className='h-6 w-6 text-green-500' aria-hidden='true' />}
                      {entry.kind === 'exercise' && <Dumbbell className='h-6 w-6 text-blue-500' aria-hidden='true' />}
                      {entry.kind === 'food' && <BookOpen className='h-6 w-6 text-purple-500' aria-hidden='true' />}
                      {entry.kind === 'weight' && <Weight className='h-6 w-6 text-red-500' aria-hidden='true' />}
                      <div>
                        <h4 className='text-lg font-medium capitalize'>{entry.title}</h4>
                        <p className={`text-sm capitalize ${tk.muted}`}>{entry.meal ? text.meals[entry.meal] : entry.detail}</p>
                      </div>
                    </div>
                    <p className={`flex items-center text-sm ${tk.muted}`}>
                      <Clock className='mr-1 h-4 w-4' aria-hidden='true' /> {formatTime(entry.at, lang)}
                    </p>
                  </div>
                  {entry.kind === 'meal' && (
                    <div className='mt-2 flex flex-wrap gap-2'>
                      <span className='inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium'><Flame className='mr-1 h-4 w-4 text-red-500' aria-hidden='true' />{Math.round(entry.kcal ?? 0)} {text.diary.kcal}</span>
                      <span className='inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium'><Drumstick className='mr-1 h-4 w-4 text-blue-500' aria-hidden='true' />{Math.round(entry.protein ?? 0)}{text.units.g} {text.diary.protein}</span>
                      <span className='inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium'><EggFried className='mr-1 h-4 w-4 text-yellow-500' aria-hidden='true' />{Math.round(entry.fat ?? 0)}{text.units.g} {text.diary.fat}</span>
                      <span className='inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium'><Wheat className='mr-1 h-4 w-4 text-green-500' aria-hidden='true' />{Math.round(entry.carbs ?? 0)}{text.units.g} {text.diary.carbs}</span>
                    </div>
                  )}
                  {entry.kind === 'exercise' && (
                    <div className='mt-2 flex flex-wrap gap-2'>
                      <span className='inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium'><Flame className='mr-1 h-4 w-4 text-red-500' aria-hidden='true' />{Math.round(entry.burned ?? 0)} {text.diary.kcalBurned}</span>
                      <span className='inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium'><Clock className='mr-1 h-4 w-4 text-blue-500' aria-hidden='true' />{entry.minutes} {text.units.min}</span>
                      <span className='inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium'><Weight className='mr-1 h-4 w-4 text-green-500' aria-hidden='true' />{text.diary.effort} {entry.effort}</span>
                    </div>
                  )}
                </article>
              ))}
            </div>
            {summary.length > 0 && (
              <div className='px-2 pb-5 pt-2'>
                <div className='mb-3 flex items-center'>
                  <span className='h-px flex-1 bg-[hsl(var(--muted-foreground)/0.5)]' />
                  <h3 className='px-3 text-lg font-medium'>{text.diary.daySummary}</h3>
                  <span className='h-px flex-1 bg-[hsl(var(--muted-foreground)/0.5)]' />
                </div>
                <div className='flex flex-wrap justify-center gap-2'>
                  {summary.map((item) => (
                    <span key={item.label} className='inline-flex items-center gap-1 rounded-full bg-[hsl(var(--accent))] px-2 py-1 text-xs text-[hsl(var(--accent-foreground))]'>
                      <item.icon className='h-4 w-4' aria-hidden='true' /> {item.label}: {item.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )
      })}
      {rows.length > 0 && filtered.length === 0 && <p className='pt-6 text-center'>{text.diary.noFiltered}</p>}
      {rows.length === 0 && <p className='pt-6 text-center'>{text.diary.noEntries}</p>}
    </div>
  )
}

export function SettingsPage ({ lang }: { lang: Lang }) {
  const text = copy[lang]
  const rows = [
    { label: text.settings.born, value: new Date(`${PROFILE.born}T12:00:00Z`).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { dateStyle: 'long', timeZone: 'UTC' }) },
    { label: text.settings.sex, value: text.settings.sexValue },
    { label: text.settings.activity, value: text.settings.activityValue },
    { label: text.settings.height, value: `${PROFILE.heightCm} ${text.units.cm}` },
    { label: text.settings.weight, value: `${PROFILE.weight} ${text.units.kg}` },
    { label: text.settings.bodyFat, value: `${PROFILE.bodyFat}${text.units.percent}` },
    { label: text.settings.goal, value: text.settings.goalValue },
    { label: text.settings.goalWeight, value: `${PROFILE.goalWeight} ${text.units.kg}` }
  ]
  return (
    <div className='space-y-5 pb-6'>
      <header>
        <h1 className='text-2xl font-bold'>{text.settings.title}</h1>
        <p className={`mt-1 text-sm ${tk.muted}`}>{text.settings.subtitle}</p>
      </header>
      <section className='space-y-2'>
        <h2 className='text-sm font-semibold'>{text.settings.personal}</h2>
        <TkCard className='divide-y divide-[hsl(var(--border))]'>
          {rows.slice(0, 5).map((row) => (
            <div key={row.label} className='flex items-center justify-between gap-3 px-4 py-3 text-sm'>
              <span className={tk.muted}>{row.label}</span>
              <span className='text-right capitalize'>{row.value}</span>
            </div>
          ))}
        </TkCard>
      </section>
      <section className='space-y-2'>
        <h2 className='text-sm font-semibold'>{text.settings.goals}</h2>
        <TkCard className='divide-y divide-[hsl(var(--border))]'>
          {rows.slice(5).map((row) => (
            <div key={row.label} className='flex items-center justify-between gap-3 px-4 py-3 text-sm'>
              <span className={tk.muted}>{row.label}</span>
              <span className='text-right capitalize'>{row.value}</span>
            </div>
          ))}
        </TkCard>
      </section>
      <p className={`text-xs ${tk.muted}`}>{text.version}</p>
    </div>
  )
}
