'use client'

import { useEffect, useId, useState, type KeyboardEvent, type ReactNode } from 'react'
import {
  Activity,
  Bike,
  BookOpen,
  ChevronRight,
  Circle,
  ClipboardList,
  Clock,
  Dumbbell,
  Drumstick,
  EggFried,
  Filter,
  Flame,
  FlameKindling,
  HandPlatter,
  HeartPulse,
  MessageSquare,
  Nut,
  Square,
  TrendingUp,
  Utensils,
  Weight,
  Wheat
} from 'lucide-react'
import { BarList, ColumnChart, LineChart } from './charts'
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
  foodsOn,
  formatDayKey,
  formatDuration,
  formatLong,
  formatNum,
  formatShort,
  formatTime,
  nameOf,
  rawPercent,
  sameUtcDay,
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
                  <button
                    key={day.toISOString()}
                    type='button'
                    aria-label={label}
                    onClick={() => setDetail(label)}
                    className={`h-6 rounded-md sm:h-8 ${focusRing}`}
                    style={{ background: `linear-gradient(to top, hsl(var(--foreground) / ${index === todayIndex ? 0.9 : 0.5}) ${fill}%, hsl(var(--foreground) / 0.18) ${fill}%)` }}
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
                <button
                  key={day.toISOString()}
                  type='button'
                  aria-label={label}
                  onClick={() => setDetail(label)}
                  className={`rounded-md py-1 text-center text-[11px] sm:text-xs ${focusRing} ${index === todayIndex ? 'border-2 border-[hsl(var(--foreground))] font-semibold' : tk.muted}`}
                >
                  {text.daysShort[index]}
                </button>
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
    { key: 'carbs' as const, name: text.nutrition.carbs, icon: Wheat },
    { key: 'fat' as const, name: text.nutrition.fats, icon: EggFried }
  ]
  return (
    <div className='mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4'>
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
  const goalRows = (source: typeof today, factor: number) => [
    { label: text.nutrition.calories, value: capPercent(source.kcal, GOALS.kcal * factor), color: 'hsl(var(--chart-2))' },
    { label: text.nutrition.protein, value: capPercent(source.protein, GOALS.protein * factor), color: 'hsl(var(--chart-3))' },
    { label: text.nutrition.carbs, value: capPercent(source.carbs, GOALS.carbs * factor), color: 'hsl(var(--chart-2))' },
    { label: text.nutrition.fat, value: capPercent(source.fat, GOALS.fat * factor), color: 'hsl(var(--chart-4))' }
  ]
  const macroRows = [
    { label: text.nutrition.protein, value: today.kcal ? (today.protein * 4 / today.kcal) * 100 : 0, color: 'hsl(var(--chart-1))' },
    { label: text.nutrition.carbs, value: today.kcal ? (today.carbs * 4 / today.kcal) * 100 : 0, color: 'hsl(var(--chart-2))' },
    { label: text.nutrition.fat, value: today.kcal ? (today.fat * 9 / today.kcal) * 100 : 0, color: 'hsl(var(--chart-4))' }
  ]
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
              className={`rounded-md px-3 py-1.5 text-xs sm:text-sm ${focusRing} ${selected ? 'bg-[hsl(var(--border))] text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]'}`}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      <TkCard className='mt-4 p-4'>
        {tab === 'weekly' && (
          <div role='tabpanel' aria-labelledby={`${base}-tab-weekly`} className='space-y-4'>
            <h3 className='text-lg font-medium'>{text.food.weeklyTitle}</h3>
            <ColumnChart title={text.nutrition.calories} labels={text.chartDays} values={totals.map((day) => day.kcal)} color='hsl(var(--chart-3))' />
            <LineChart
              title={text.food.weeklyTitle}
              labels={text.chartDays}
              series={[
                { id: 'protein', label: text.nutrition.protein, color: 'hsl(var(--chart-1))', values: totals.map((day) => day.protein) },
                { id: 'fats', label: text.nutrition.fats, color: 'hsl(var(--chart-4))', values: totals.map((day) => day.fat) },
                { id: 'carbs', label: text.nutrition.carbs, color: 'hsl(var(--chart-2))', values: totals.map((day) => day.carbs) }
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
              yMin={77}
              yMax={82}
              series={[{ id: 'weight', label: text.units.kg, color: 'hsl(var(--chart-2))', values: WEIGHT_TREND }]}
            />
          </div>
        )}
        {tab === 'macro' && (
          <div role='tabpanel' aria-labelledby={`${base}-tab-macro`}>
            <h3 className='mb-3 text-lg font-medium'>{text.food.macroTitle}</h3>
            <BarList title={text.food.macroTitle} rows={macroRows} suffix='%' />
          </div>
        )}
        {tab === 'today' && (
          <div role='tabpanel' aria-labelledby={`${base}-tab-today`}>
            <h3 className='mb-3 text-lg font-medium'>{text.food.todayTitle}</h3>
            <BarList title={text.food.todayTitle} rows={goalRows(today, 1)} suffix='%' />
          </div>
        )}
        {tab === 'week' && (
          <div role='tabpanel' aria-labelledby={`${base}-tab-week`}>
            <h3 className='mb-3 text-lg font-medium'>{text.food.weekTitle}</h3>
            <BarList title={text.food.weekTitle} rows={goalRows(week, 7)} suffix='%' />
          </div>
        )}
      </TkCard>
    </div>
  )
}

function MealRow ({ food, lang }: { food: FoodEntry, lang: Lang }) {
  const text = copy[lang]
  return (
    <article className='rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-3'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <h3 className='truncate font-medium capitalize'>{nameOf(food, lang)}</h3>
          <p className={`text-xs capitalize ${tk.muted}`}>{text.meals[food.meal]} · {food.grams} {food.unit}</p>
        </div>
        <p className='shrink-0 text-sm font-semibold tabular-nums'>{formatNum(food.kcal, lang)} {text.units.kcal}</p>
      </div>
      <p className={`mt-2 text-xs ${tk.muted}`}>
        {text.nutrition.protein} {Math.round(food.protein)}{text.units.g} · {text.nutrition.carbs} {Math.round(food.carbs)}{text.units.g} · {text.nutrition.fat} {Math.round(food.fat)}{text.units.g}
      </p>
    </article>
  )
}

function ExerciseRow ({ exercise, lang }: { exercise: ExerciseEntry, lang: Lang }) {
  const text = copy[lang]
  return (
    <article className='flex items-center justify-between gap-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-3'>
      <div className='flex min-w-0 items-center gap-3'>
        <Dumbbell className='h-5 w-5 shrink-0 text-[#93c5fd]' aria-hidden='true' />
        <div className='min-w-0'>
          <h3 className='truncate font-medium'>{nameOf(exercise, lang)}</h3>
          <p className={`text-xs capitalize ${tk.muted}`}>{text.exercise.efforts[exercise.effort]} · {exercise.minutes} {text.units.min}</p>
        </div>
      </div>
      <p className='shrink-0 text-sm font-semibold tabular-nums'>{formatNum(exercise.kcal, lang)} {text.units.kcal}</p>
    </article>
  )
}

export function DashboardPage ({ lang, foods, exercises, anchor, onOpenChat, onNavigate }: PageProps) {
  const text = copy[lang]
  const today = new Date(anchor)
  const todayFoods = foodsOn(foods, today).sort((a, b) => b.at.localeCompare(a.at))
  const todayExercises = exercisesOn(exercises, today).sort((a, b) => b.at.localeCompare(a.at))
  const todayTotals = dayMacros(foods, today)
  const allFood = addMacros(foods.map(foodMacros))
  const burned = PROFILE.historyBurned + exercises.reduce((sum, exercise) => sum + exercise.kcal, 0)
  const range = rangeLabel(anchor, lang)
  const goalRows = [
    { label: text.nutrition.calories, value: capPercent(todayTotals.kcal, GOALS.kcal), color: 'hsl(var(--chart-2))' },
    { label: text.nutrition.protein, value: capPercent(todayTotals.protein, GOALS.protein), color: 'hsl(var(--chart-3))' },
    { label: text.nutrition.carbs, value: capPercent(todayTotals.carbs, GOALS.carbs), color: 'hsl(var(--chart-2))' },
    { label: text.nutrition.fat, value: capPercent(todayTotals.fat, GOALS.fat), color: 'hsl(var(--chart-4))' }
  ]

  return (
    <div className='space-y-4 pb-2'>
      <div className='flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between'>
        <h1 className='text-center text-2xl font-bold uppercase md:text-left'>{formatLong(anchor, lang)}</h1>
        <div className='flex flex-wrap justify-center gap-2 md:justify-end'>
          <ChatButtons lang={lang} context='dashboard' onOpenChat={onOpenChat} extra='both' />
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
          <InsightCard title={text.sections.goalProgress} range={range} value='50' unit={text.units.percent} openLabel={text.openDiary} onOpen={() => onNavigate('diary')}>
            <div className='my-4 h-4 overflow-hidden rounded-full bg-[hsl(var(--foreground)/0.2)]' aria-hidden='true'>
              <div className='h-full w-1/2 bg-[hsl(var(--foreground))]' />
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
      <TkCard className='p-4'>
        <h2 className='mb-3 text-lg font-medium'>{text.food.todayTitle}</h2>
        <BarList title={text.food.todayTitle} rows={goalRows} suffix='%' />
      </TkCard>
      <div className='grid gap-3 md:grid-cols-2'>
        <section aria-label={text.todayFood} className='space-y-2'>
          <h2 className='text-sm font-semibold'>{text.todayFood}</h2>
          {todayFoods.length === 0 && <p className={`text-sm ${tk.muted}`}>{text.noFoodToday}</p>}
          {todayFoods.map((food) => <MealRow key={food.id} food={food} lang={lang} />)}
        </section>
        <section aria-label={text.todayExercise} className='space-y-2'>
          <h2 className='text-sm font-semibold'>{text.todayExercise}</h2>
          {todayExercises.length === 0 && <p className={`text-sm ${tk.muted}`}>{text.noExerciseToday}</p>}
          {todayExercises.map((exercise) => <ExerciseRow key={exercise.id} exercise={exercise} lang={lang} />)}
        </section>
      </div>
    </div>
  )
}

export function FoodPage ({ lang, foods, anchor, onOpenChat }: PageProps) {
  const text = copy[lang]
  return (
    <div className='pb-4'>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='hidden text-2xl font-bold uppercase sm:block'>{formatLong(anchor, lang)}</h1>
        <div className='flex w-full flex-wrap justify-center gap-2 sm:w-auto sm:justify-end'>
          <TkButton size='sm' onClick={(event) => onOpenChat('food', event.currentTarget)}>
            <ClipboardList className='h-4 w-4' aria-hidden='true' /> {text.food.registerFood}
          </TkButton>
          <TkButton size='sm' onClick={(event) => onOpenChat('food', event.currentTarget)}>
            <Utensils className='h-4 w-4' aria-hidden='true' /> {text.food.addMeal}
          </TkButton>
          <ChatButtons lang={lang} context='food' onOpenChat={onOpenChat} />
        </div>
      </div>
      <MacroCards foods={foods} anchor={anchor} lang={lang} />
      <FoodCharts foods={foods} anchor={anchor} lang={lang} />
    </div>
  )
}

const CATEGORY_ICONS = [Dumbbell, Activity, Flame, Circle, Bike, HeartPulse]

function exerciseBucket (exercise: ExerciseEntry) {
  const name = `${exercise.nameEn} ${exercise.nameEs}`.toLowerCase()
  if (name.includes('run') || name.includes('carrer') || name.includes('cardio')) return 1
  if (name.includes('gym') || name.includes('gimnasi') || name.includes('strength') || name.includes('fuerza')) return 0
  return -1
}

export function ExercisePage ({ lang, exercises, anchor, onOpenChat }: PageProps) {
  const text = copy[lang]
  const [category, setCategory] = useState<number | null>(null)
  const days = weekDays(anchor)
  const todayIndex = weekIndex(new Date(anchor))
  const burned = PROFILE.historyBurned + exercises.reduce((sum, exercise) => sum + exercise.kcal, 0)
  const minutes = PROFILE.historyMinutes + exercises.reduce((sum, exercise) => sum + exercise.minutes, 0)
  const sessions = PROFILE.historySessions + exercises.length
  const weekValues = days.map((day, index) => index > todayIndex ? 0 : exercisesOn(exercises, day).reduce((sum, exercise) => sum + exercise.kcal, 0))
  const weekBurn = weekValues.reduce((sum, value) => sum + value, 0)
  const weekCount = exercises.filter((exercise) => days.some((day) => sameUtcDay(new Date(exercise.at), day))).length
  const percent = Math.round((weekBurn / PROFILE.weekBurnTarget) * 100)
  const message = percent >= 100
    ? text.exercise.exceeded.replace('{percent}', String(percent - 100))
    : text.exercise.reached.replace('{percent}', String(percent))
  const counts = new Map<MealGroup, number>()
  exercises.forEach((exercise) => counts.set(exercise.meal, (counts.get(exercise.meal) ?? 0) + 1))
  let top: MealGroup = 'breakfast'
  let topCount = 0
  counts.forEach((count, meal) => {
    if (count > topCount) {
      top = meal
      topCount = count
    }
  })
  const cards = [
    { name: text.exercise.cards.burned, value: `${formatNum(burned, lang)} ${text.units.kcal}`, icon: Flame },
    { name: text.exercise.cards.time, value: formatDuration(minutes), icon: Clock },
    { name: text.exercise.cards.avg, value: formatDuration(Math.round(minutes / Math.max(sessions, 1))), icon: TrendingUp },
    { name: text.exercise.cards.week, value: `${formatNum(weekCount, lang)} ${text.exercise.cards.times}`, icon: Activity }
  ]
  const sorted = [...exercises].sort((a, b) => b.at.localeCompare(a.at))
  const visible = category === null ? sorted : sorted.filter((exercise) => exerciseBucket(exercise) === category)

  return (
    <div className='space-y-5 pb-4'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='hidden text-2xl font-bold uppercase sm:block'>{formatLong(anchor, lang)}</h1>
        <div className='flex flex-wrap justify-center gap-2 sm:justify-end'>
          <ChatButtons lang={lang} context='exercise' onOpenChat={onOpenChat} extra='exercise' />
        </div>
      </div>
      <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <TkCard key={card.name} className='p-4 transition-shadow hover:shadow-lg motion-reduce:transition-none'>
              <div className='flex items-center justify-between gap-2 pb-2'>
                <h2 className='text-sm font-medium'>{card.name}</h2>
                <Icon className='h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]' aria-hidden='true' />
              </div>
              <p className='text-xl font-bold tabular-nums sm:text-2xl'>{card.value}</p>
            </TkCard>
          )
        })}
      </div>
      <TkCard className='p-4'>
        <h2 className='text-lg font-medium'>{text.exercise.energyTitle}</h2>
        <p className={`mb-2 text-sm ${tk.muted}`}>{text.exercise.energyDesc}</p>
        <ColumnChart title={text.exercise.energyTitle} labels={text.chartDays} values={weekValues} color='hsl(var(--chart-1))' />
        <p className='mt-3 text-sm' aria-live='polite'>{message}. {text.exercise.mostActive.replace('{time}', text.meals[top])}</p>
      </TkCard>
      <section>
        <h2 className='mb-2 text-sm font-semibold'>{text.exercise.categories}</h2>
        <div className='grid grid-cols-3 gap-2 sm:grid-cols-6'>
          {text.categories.map((name, index) => {
            const Icon = CATEGORY_ICONS[index] ?? Dumbbell
            const selected = category === index
            const count = sorted.filter((exercise) => exerciseBucket(exercise) === index).length
            return (
              <button
                key={name}
                type='button'
                aria-pressed={selected}
                onClick={() => setCategory(selected ? null : index)}
                className={`flex h-24 flex-col items-center justify-center gap-1 rounded-lg border px-1 text-center text-xs transition-colors motion-reduce:transition-none sm:h-28 ${focusRing} ${selected ? 'border-[hsl(var(--foreground))] bg-[hsl(var(--foreground)/0.12)]' : 'border-[hsl(var(--border))] bg-[hsl(var(--foreground)/0.06)] hover:bg-[hsl(var(--foreground)/0.12)]'}`}
              >
                <Icon className='h-7 w-7 text-[hsl(var(--foreground)/0.8)]' aria-hidden='true' />
                <span className='line-clamp-2'>{name}</span>
                <span className='text-sm font-semibold tabular-nums'>{count}</span>
              </button>
            )
          })}
        </div>
      </section>
      <section className='space-y-2' aria-label={text.exercise.title}>
        <p className='sr-only' aria-live='polite'>
          {category === null ? '' : `${text.categories[category]}: ${visible.length}`}
        </p>
        {visible.length === 0 && <p className={`text-sm ${tk.muted}`}>{text.noCategory}</p>}
        {visible.map((exercise) => <ExerciseRow key={exercise.id} exercise={exercise} lang={lang} />)}
      </section>
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
            <span className='block'>{text.diary.date}</span>
            <select value={date} onChange={(event) => setDate(event.target.value)} className={`h-9 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 text-sm text-[hsl(var(--foreground))] sm:w-[200px] [&>option]:bg-[hsl(var(--card))] ${focusRing}`}>
              <option value='all'>{text.diary.allDates}</option>
              {dates.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className='space-y-2 text-sm font-medium'>
            <span className='block'>{text.diary.diaryGroup}</span>
            <select value={group} onChange={(event) => setGroup(event.target.value)} className={`h-9 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 text-sm text-[hsl(var(--foreground))] sm:w-[200px] [&>option]:bg-[hsl(var(--card))] ${focusRing}`}>
              <option value='all'>{text.diary.allGroups}</option>
              {MEAL_ORDER.map((meal) => <option key={meal} value={meal}>{text.meals[meal]}</option>)}
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
                      <span className='inline-flex items-center rounded-full bg-[hsl(var(--secondary))] px-2 py-1 text-xs font-medium text-[hsl(var(--secondary-foreground))]'><Flame className='mr-1 h-4 w-4 text-red-500' aria-hidden='true' />{Math.round(entry.kcal ?? 0)} {text.diary.kcal}</span>
                      <span className='inline-flex items-center rounded-full bg-[hsl(var(--secondary))] px-2 py-1 text-xs font-medium text-[hsl(var(--secondary-foreground))]'><Drumstick className='mr-1 h-4 w-4 text-blue-500' aria-hidden='true' />{Math.round(entry.protein ?? 0)}{text.units.g} {text.diary.protein}</span>
                      <span className='inline-flex items-center rounded-full bg-[hsl(var(--secondary))] px-2 py-1 text-xs font-medium text-[hsl(var(--secondary-foreground))]'><EggFried className='mr-1 h-4 w-4 text-yellow-500' aria-hidden='true' />{Math.round(entry.fat ?? 0)}{text.units.g} {text.diary.fat}</span>
                      <span className='inline-flex items-center rounded-full bg-[hsl(var(--secondary))] px-2 py-1 text-xs font-medium text-[hsl(var(--secondary-foreground))]'><Wheat className='mr-1 h-4 w-4 text-green-500' aria-hidden='true' />{Math.round(entry.carbs ?? 0)}{text.units.g} {text.diary.carbs}</span>
                    </div>
                  )}
                  {entry.kind === 'exercise' && (
                    <div className='mt-2 flex flex-wrap gap-2'>
                      <span className='inline-flex items-center rounded-full bg-[hsl(var(--secondary))] px-2 py-1 text-xs font-medium text-[hsl(var(--secondary-foreground))]'><Flame className='mr-1 h-4 w-4 text-red-500' aria-hidden='true' />{Math.round(entry.burned ?? 0)} {text.diary.kcalBurned}</span>
                      <span className='inline-flex items-center rounded-full bg-[hsl(var(--secondary))] px-2 py-1 text-xs font-medium text-[hsl(var(--secondary-foreground))]'><Clock className='mr-1 h-4 w-4 text-blue-500' aria-hidden='true' />{entry.minutes} {text.units.min}</span>
                      <span className='inline-flex items-center rounded-full bg-[hsl(var(--secondary))] px-2 py-1 text-xs font-medium text-[hsl(var(--secondary-foreground))]'><Weight className='mr-1 h-4 w-4 text-green-500' aria-hidden='true' />{text.diary.effort} {entry.effort}</span>
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
                    <span key={item.label} className='inline-flex items-center gap-1 rounded-full bg-[hsl(var(--border))] px-2 py-1 text-xs'>
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
