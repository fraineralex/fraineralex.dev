export type Lang = 'en' | 'es'

export const backLink = (lang: Lang) => (lang === 'es' ? { href: '/es/projects', label: 'Volver a proyectos' } : { href: '/projects', label: 'Back to projects' })

export const flowLabels = {
	en: { play: 'Play', pause: 'Pause', prev: 'Previous step', next: 'Next step', step: 'Step' },
	es: { play: 'Reproducir', pause: 'Pausar', prev: 'Paso anterior', next: 'Paso siguiente', step: 'Paso' },
} as const
