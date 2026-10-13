import { promptsFor, type Lang, type PresetId } from './copy'

export type MealGroup = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'uncategorized'
export type Effort = 'easy' | 'moderate' | 'hard' | 'very-hard'
export type Unit = 'g' | 'ml'

export interface FoodEntry {
  id: string
  nameEn: string
  nameEs: string
  meal: MealGroup
  grams: number
  unit: Unit
  kcal: number
  protein: number
  carbs: number
  fat: number
  at: string
}

export interface ExerciseEntry {
  id: string
  nameEn: string
  nameEs: string
  minutes: number
  effort: Effort
  kcal: number
  meal: MealGroup
  at: string
}

export interface NoteEntry {
  id: string
  kind: 'catalog' | 'weight'
  titleEn: string
  titleEs: string
  detailEn: string
  detailEs: string
  at: string
}

export interface Macros {
  kcal: number
  protein: number
  carbs: number
  fat: number
}

export const GOALS: Macros = { kcal: 2200, protein: 165, carbs: 220, fat: 73 }

export const PROFILE = {
  name: 'Frainer Encarnación',
  weight: 78,
  goalWeight: 74,
  startWeight: 82,
  heightCm: 178,
  bodyFat: 16,
  born: '1998-03-12',
  foodStreak: 6,
  exerciseStreak: 4,
  historyKcal: 12640,
  historyBurned: 4860,
  historyMinutes: 740,
  historySessions: 18,
  weekBurnTarget: 1800
}

export const WEIGHT_TREND = [81.4, 80.6, 80.1, 79.4, 78.8, 78]

const EMPTY: Macros = { kcal: 0, protein: 0, carbs: 0, fat: 0 }

interface FoodSeed {
  id: string
  nameEn: string
  nameEs: string
  meal: MealGroup
  grams: number
  unit: Unit
  kcal: number
  protein: number
  carbs: number
  fat: number
  day: number
  hour: number
  minute: number
}

interface ExerciseSeed {
  id: string
  nameEn: string
  nameEs: string
  minutes: number
  effort: Effort
  kcal: number
  day: number
  hour: number
  minute: number
}

const FOOD_SEEDS: FoodSeed[] = [
  { id: 'mon-oats', nameEn: 'Oatmeal with milk', nameEs: 'Avena con leche', meal: 'breakfast', grams: 250, unit: 'g', kcal: 380, protein: 14, carbs: 54, fat: 12, day: 0, hour: 8, minute: 10 },
  { id: 'mon-bowl', nameEn: 'Chicken rice bowl', nameEs: 'Bowl de pollo y arroz', meal: 'lunch', grams: 420, unit: 'g', kcal: 710, protein: 52, carbs: 74, fat: 20, day: 0, hour: 13, minute: 5 },
  { id: 'mon-yogurt', nameEn: 'Greek yogurt', nameEs: 'Yogur griego', meal: 'snack', grams: 170, unit: 'g', kcal: 146, protein: 15, carbs: 8, fat: 4, day: 0, hour: 16, minute: 15 },
  { id: 'mon-salmon', nameEn: 'Salmon and potatoes', nameEs: 'Salmón y papas', meal: 'dinner', grams: 380, unit: 'g', kcal: 760, protein: 46, carbs: 48, fat: 36, day: 0, hour: 19, minute: 40 },
  { id: 'tue-banana', nameEn: 'Banana oatmeal', nameEs: 'Avena con banana', meal: 'breakfast', grams: 280, unit: 'g', kcal: 410, protein: 13, carbs: 68, fat: 9, day: 1, hour: 8, minute: 20 },
  { id: 'tue-wrap', nameEn: 'Turkey wrap', nameEs: 'Wrap de pavo', meal: 'lunch', grams: 250, unit: 'g', kcal: 540, protein: 38, carbs: 46, fat: 20, day: 1, hour: 12, minute: 45 },
  { id: 'tue-apple', nameEn: 'Apple', nameEs: 'Manzana', meal: 'snack', grams: 180, unit: 'g', kcal: 95, protein: 0, carbs: 25, fat: 0, day: 1, hour: 16, minute: 0 },
  { id: 'tue-beef', nameEn: 'Beef stir fry', nameEs: 'Salteado de res', meal: 'dinner', grams: 400, unit: 'g', kcal: 820, protein: 48, carbs: 62, fat: 38, day: 1, hour: 20, minute: 5 },
  { id: 'wed-chicken', nameEn: 'Grilled chicken breast', nameEs: 'Pechuga de pollo a la plancha', meal: 'lunch', grams: 150, unit: 'g', kcal: 248, protein: 46, carbs: 0, fat: 5, day: 2, hour: 13, minute: 5 },
  { id: 'wed-rice', nameEn: 'White rice', nameEs: 'Arroz blanco', meal: 'lunch', grams: 180, unit: 'g', kcal: 234, protein: 4, carbs: 51, fat: 0, day: 2, hour: 13, minute: 5 },
  { id: 'wed-yogurt', nameEn: 'Greek yogurt', nameEs: 'Yogur griego', meal: 'snack', grams: 170, unit: 'g', kcal: 146, protein: 17, carbs: 6, fat: 4, day: 2, hour: 16, minute: 30 },
  { id: 'wed-almonds', nameEn: 'Almonds', nameEs: 'Almendras', meal: 'snack', grams: 20, unit: 'g', kcal: 116, protein: 4, carbs: 4, fat: 10, day: 2, hour: 16, minute: 30 }
]

const EXERCISE_SEEDS: ExerciseSeed[] = [
  { id: 'mon-run', nameEn: 'Run', nameEs: 'Carrera', minutes: 32, effort: 'moderate', kcal: 336, day: 0, hour: 7, minute: 0 },
  { id: 'tue-gym', nameEn: 'Gym', nameEs: 'Gimnasio', minutes: 45, effort: 'hard', kcal: 410, day: 1, hour: 18, minute: 30 },
  { id: 'wed-strength', nameEn: 'Strength training', nameEs: 'Entrenamiento de fuerza', minutes: 40, effort: 'moderate', kcal: 290, day: 2, hour: 7, minute: 30 }
]

export function utcToday (now = new Date ()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 15, 0, 0))
}

export function weekIndex (date: Date) {
  const day = date.getUTCDay()
  return day === 0 ? 6 : day - 1
}

export function mondayOf (date: Date) {
  const day = utcToday(date)
  const index = weekIndex(day)
  day.setUTCDate(day.getUTCDate() - index)
  return day
}

export function atUtc (monday: Date, day: number, hour: number, minute: number) {
  const next = new Date(monday)
  next.setUTCDate(monday.getUTCDate() + day)
  next.setUTCHours(hour, minute, 0, 0)
  return next.toISOString()
}

export function mealFromHour (hour: number): MealGroup {
  if (hour >= 5 && hour < 12) return 'breakfast'
  if (hour >= 12 && hour <= 14) return 'lunch'
  if (hour > 14 && hour < 17) return 'snack'
  return 'dinner'
}

export function sameUtcDay (a: Date, b: Date) {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate()
}

export function localeOf (lang: Lang) {
  return lang === 'es' ? 'es-ES' : 'en-US'
}

export function formatNum (value: number, lang: Lang) {
  return Math.round(value).toLocaleString(localeOf(lang))
}

export function formatLong (iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(localeOf(lang), {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })
}

export function formatDayKey (iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(localeOf(lang), {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  })
}

export function formatTime (iso: string, lang: Lang) {
  return new Date(iso).toLocaleTimeString(localeOf(lang), {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC'
  })
}

export function formatShort (iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(localeOf(lang), {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC'
  })
}

export function formatDuration (minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours && mins) return `${hours}h ${mins}m`
  if (hours) return `${hours}h`
  return `${mins}m`
}

export function addMacros (list: Macros[]): Macros {
  return list.reduce((acc, item) => ({
    kcal: acc.kcal + item.kcal,
    protein: acc.protein + item.protein,
    carbs: acc.carbs + item.carbs,
    fat: acc.fat + item.fat
  }), { ...EMPTY })
}

export function foodMacros (food: FoodEntry): Macros {
  return { kcal: food.kcal, protein: food.protein, carbs: food.carbs, fat: food.fat }
}

export function capPercent (consumed: number, needed: number) {
  if (needed <= 0) return 0
  return Math.max(0, Math.round((Math.min(consumed, needed) / needed) * 100))
}

export function rawPercent (consumed: number, needed: number) {
  if (needed <= 0) return 0
  return (consumed / needed) * 100
}

export interface TrackyModel {
  foods: FoodEntry[]
  exercises: ExerciseEntry[]
  notes: NoteEntry[]
  anchor: string
}

export function createModel (now = new Date()): TrackyModel {
  const today = utcToday(now)
  const todayIndex = weekIndex(today)
  const monday = mondayOf(today)
  const foods: FoodEntry[] = FOOD_SEEDS.filter((seed) => seed.day <= todayIndex).map((seed) => ({
    id: seed.id,
    nameEn: seed.nameEn,
    nameEs: seed.nameEs,
    meal: seed.meal,
    grams: seed.grams,
    unit: seed.unit,
    kcal: seed.kcal,
    protein: seed.protein,
    carbs: seed.carbs,
    fat: seed.fat,
    at: atUtc(monday, seed.day, seed.hour, seed.minute)
  }))
  const exercises: ExerciseEntry[] = EXERCISE_SEEDS.filter((seed) => seed.day <= todayIndex).map((seed) => ({
    id: seed.id,
    nameEn: seed.nameEn,
    nameEs: seed.nameEs,
    minutes: seed.minutes,
    effort: seed.effort,
    kcal: seed.kcal,
    meal: mealFromHour(seed.hour),
    at: atUtc(monday, seed.day, seed.hour, seed.minute)
  }))
  const noteDay = Math.max(0, todayIndex - 1)
  const notes: NoteEntry[] = [
    {
      id: 'note-weight',
      kind: 'weight',
      titleEn: 'New Weight',
      titleEs: 'Nuevo Peso',
      detailEn: '78 kg',
      detailEs: '78 kg',
      at: atUtc(monday, noteDay, 7, 10)
    },
    {
      id: 'note-food',
      kind: 'catalog',
      titleEn: 'Greek yogurt',
      titleEs: 'Yogur griego',
      detailEn: 'New Food Registration',
      detailEs: 'Nuevo Registro de Alimento',
      at: atUtc(monday, noteDay, 9, 0)
    }
  ]
  return { foods, exercises, notes, anchor: today.toISOString() }
}

export function nameOf (entry: { nameEn: string, nameEs: string }, lang: Lang) {
  return lang === 'es' ? entry.nameEs : entry.nameEn
}

export function weekDays (anchorIso: string) {
  const monday = mondayOf(new Date(anchorIso))
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday)
    day.setUTCDate(monday.getUTCDate() + index)
    return day
  })
}

export function foodsOn (foods: FoodEntry[], day: Date) {
  return foods.filter((food) => sameUtcDay(new Date(food.at), day))
}

export function exercisesOn (exercises: ExerciseEntry[], day: Date) {
  return exercises.filter((exercise) => sameUtcDay(new Date(exercise.at), day))
}

export function dayMacros (foods: FoodEntry[], day: Date) {
  return addMacros(foodsOn(foods, day).map(foodMacros))
}

export interface PresetFood {
  kind: 'meal'
  nameEn: string
  nameEs: string
  meal: MealGroup
  grams: number
  unit: Unit
  kcal: number
  protein: number
  carbs: number
  fat: number
}

export interface PresetExercise {
  kind: 'exercise'
  nameEn: string
  nameEs: string
  minutes: number
  effort: Effort
  kcal: number
}

export interface Preset {
  id: PresetId
  keywords: string[]
  items: Array<PresetFood | PresetExercise>
}

export const PRESETS: Preset[] = [
  {
    id: 'breakfast',
    keywords: ['egg', 'huevo', 'toast', 'tostad', 'coffee', 'cafe', 'breakfast', 'desayuno'],
    items: [
      { kind: 'meal', nameEn: 'Eggs', nameEs: 'Huevos', meal: 'breakfast', grams: 100, unit: 'g', kcal: 144, protein: 13, carbs: 1, fat: 10 },
      { kind: 'meal', nameEn: 'Toast', nameEs: 'Tostada', meal: 'breakfast', grams: 60, unit: 'g', kcal: 159, protein: 5, carbs: 29, fat: 2 },
      { kind: 'meal', nameEn: 'Coffee', nameEs: 'Café', meal: 'breakfast', grams: 240, unit: 'ml', kcal: 40, protein: 2, carbs: 3, fat: 2 }
    ]
  },
  {
    id: 'run',
    keywords: ['ran', 'run', 'corri', 'correr', 'carrera', 'jog', 'trot', 'pace', 'ritmo', 'modera', 'cardio', 'minute', 'minuto'],
    items: [
      { kind: 'exercise', nameEn: 'Run', nameEs: 'Carrera', minutes: 30, effort: 'moderate', kcal: 324 }
    ]
  },
  {
    id: 'chicken',
    keywords: ['chicken', 'pollo', 'pechuga', 'breast', 'lunch', 'almuerzo', 'rice', 'arroz'],
    items: [
      { kind: 'meal', nameEn: 'Chicken Breast', nameEs: 'Pechuga de Pollo', meal: 'lunch', grams: 100, unit: 'g', kcal: 165, protein: 31, carbs: 0, fat: 4 }
    ]
  }
]

function norm (value: string) {
  return value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

export function matchPreset (input: string): { preset: Preset, score: number } {
  const text = norm(input.trim())
  let best = PRESETS[0]!
  let bestScore = 0
  for (const preset of PRESETS) {
    let score = 0
    for (const prompt of promptsFor(preset.id)) {
      if (norm(prompt) === text) score += 100
    }
    for (const keyword of preset.keywords) {
      if (text.includes(keyword)) score += 1
    }
    if (score > bestScore) {
      best = preset
      bestScore = score
    }
  }
  return { preset: best, score: bestScore }
}

export function materialize (preset: Preset, now = new Date()): { foods: FoodEntry[], exercises: ExerciseEntry[] } {
  const hour = now.getUTCHours()
  const foods: FoodEntry[] = []
  const exercises: ExerciseEntry[] = []
  preset.items.forEach((item, index) => {
    const at = new Date(now.getTime() + index).toISOString()
    const id = `log-${item.kind}-${now.getTime()}-${index}-${Math.random().toString(16).slice(2)}`
    if (item.kind === 'meal') {
      foods.push({ ...item, id, at })
    } else {
      exercises.push({ ...item, id, at, meal: mealFromHour(hour) })
    }
  })
  return { foods, exercises }
}

export function mergeFoods (current: FoodEntry[], extra: FoodEntry[]) {
  const ids = new Set(current.map((item) => item.id))
  const fresh = extra.filter((item) => !ids.has(item.id))
  return fresh.length ? [...fresh, ...current] : current
}

export function mergeExercises (current: ExerciseEntry[], extra: ExerciseEntry[]) {
  const ids = new Set(current.map((item) => item.id))
  const fresh = extra.filter((item) => !ids.has(item.id))
  return fresh.length ? [...fresh, ...current] : current
}
