'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import AiChat, { type ChatContext } from './ai-chat'
import { copy, type Lang } from './copy'
import { createModel, mergeExercises, mergeFoods, type TrackyModel } from './data'
import { DashboardPage, DiaryPage, ExercisePage, FoodPage, SettingsPage } from './pages'
import TrackyFrame, { type PageId } from './shell'

export default function TrackyAppSim ({ lang }: { lang: 'en' | 'es' }) {
  const [locale, setLocale] = useState<Lang>(lang)
  const [page, setPage] = useState<PageId>('dashboard')
  const [model, setModel] = useState<TrackyModel>(() => createModel())
  const [chatOpen, setChatOpen] = useState(false)
  const [chatContext, setChatContext] = useState<ChatContext>('dashboard')
  const [announce, setAnnounce] = useState('')
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => { setLocale(lang) }, [lang])

  function openChat (context: ChatContext, button: HTMLButtonElement) {
    triggerRef.current = button
    setChatContext(context)
    setChatOpen(true)
  }

  function closeChat () {
    setChatOpen(false)
    triggerRef.current?.focus()
  }

  function onLogged (foods: TrackyModel['foods'], exercises: TrackyModel['exercises']) {
    setModel((current) => ({
      ...current,
      foods: mergeFoods(current.foods, foods),
      exercises: mergeExercises(current.exercises, exercises)
    }))
    const text = copy[locale]
    const kcal = foods.reduce((sum, food) => sum + food.kcal, 0)
    const burned = exercises.reduce((sum, exercise) => sum + exercise.kcal, 0)
    const total = kcal + burned
    setAnnounce(total ? `${text.logged} ${total} ${text.units.kcal}` : text.logged)
  }

  const pageProps = {
    lang: locale,
    foods: model.foods,
    exercises: model.exercises,
    notes: model.notes,
    anchor: model.anchor,
    onOpenChat: openChat,
    onNavigate: setPage
  }

  const body = page === 'food'
    ? <FoodPage {...pageProps} />
    : page === 'exercise'
      ? <ExercisePage {...pageProps} />
      : page === 'diary'
        ? <DiaryPage {...pageProps} />
        : page === 'settings'
          ? <SettingsPage lang={locale} />
          : <DashboardPage {...pageProps} />

  return (
    <TrackyFrame lang={locale} page={page} onPage={setPage} onLang={setLocale} overlay={
      <AiChat open={chatOpen} lang={locale} context={chatContext} onClose={closeChat} onLogged={onLogged} />
    }>
      <p className='sr-only' aria-live='polite'>{announce}</p>
      {reduced ? <div key={page}>{body}</div> : (
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          {body}
        </motion.div>
      )}
    </TrackyFrame>
  )
}
