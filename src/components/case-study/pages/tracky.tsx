import dynamic from 'next/dynamic'
import { Bot, Gauge, NotebookPen, Salad } from 'lucide-react'
import { BackLink, Chapter, Decisions, Hero, Outro, P, Shell, Stage, Statement } from '../kit/layout'
import { StageCaption, Tiles } from '../kit/blocks'
import { SentenceScene } from '../tracky/sentence-scene'
import { StackScene } from '../tracky/stack-scene'
import { backLink, type Lang } from './shared'

const TrackyAppSim = dynamic(() => import('../tracky/tracky-app-sim'), {
	loading: () => <div className='h-[640px] animate-pulse rounded-xl border border-slate-700/60 bg-slate-900/50 motion-reduce:animate-none sm:h-[700px]' aria-hidden />,
})

const COPY = {
	en: {
		lede: 'A minimalist fitness tracker I designed and built on my own. It keeps the essentials (meals, workouts, progress and goals) and adds an AI chat that turns a plain sentence into diary entries. It is open source and live at tracky.fit, serving 100+ active users.',
		facts: [
			{ label: 'Role', value: 'Solo developer' },
			{ label: 'Year', value: '2024' },
			{ label: 'Stack', value: 'Next.js 15, Drizzle, OpenAI' },
			{ label: 'Status', value: 'Beta at tracky.fit' },
		],
		links: [
			{ label: 'Open tracky.fit', url: 'https://www.tracky.fit' },
			{ label: 'Source on GitHub', url: 'https://github.com/fraineralex/tracky' },
		],
		caption: 'Signed in as Frainer Encarnación. The interface is recreated from the Tracky repository and runs on sample data in your browser. Nothing is sent anywhere.',
		c1: {
			title: 'Logging a breakfast should not take ten taps',
			body: [
				'Most fitness apps bury simple logging under feature bloat. I wanted a tracker that stays out of the way: log what you ate or trained, see your progress against your goal, and move on.',
				'So I kept the surface small on purpose. Each page has one job.',
			],
		},
		tiles: [
			{ title: 'Dashboard', body: 'Progress, personal stats and quick access to the main actions, with charts for trends.' },
			{ title: 'Food', body: 'Food intake and macros, with the AI chat one click away.' },
			{ title: 'Exercise', body: 'Workouts with type, duration and intensity, or let the chat add them for you.' },
			{ title: 'Diary', body: 'A daily log of meals and workouts you can search and filter.' },
		],
		c2: {
			title: 'From a sentence to a diary entry',
			body: [
				'The core idea is the AI chat on the Food and Exercise pages. You describe what you did in your own words, the model structures it, and the entry lands in your diary.',
				'The animation below types a breakfast, turns it into diary entries and updates the daily totals automatically.',
			],
		},
		steps: [
			{ title: 'You type', body: 'In the Food chat you write something like "two eggs and a banana for breakfast".' },
			{ title: 'Model call', body: 'A server side call through the Vercel AI SDK sends the message to the OpenAI API and asks for structured output.', tag: 'ai sdk' },
			{ title: 'Structured entry', body: 'The reply is mapped to the food entries Tracky understands, with their nutrition values.' },
			{ title: 'Saved', body: 'A Server Action writes the entries to Postgres through Drizzle, scoped to the signed in Clerk user.', tag: 'server action' },
			{ title: 'Diary and dashboard', body: 'The diary and the dashboard refresh, so progress toward the daily goal updates right away.' },
		],
		flowNote: 'Illustrative flow based on the project README.',
		c3: {
			title: 'One framework, no separate API',
			body: [
				'I started from create-t3-app and moved to the Next.js 15 App Router with React 19. Mutations go through Server Actions, and Partial Prerendering lets static shells render instantly while user data streams in.',
			],
		},
		layers: [
			{ title: 'Client', items: [{ name: 'React 19 + shadcn/ui', detail: 'Tailwind and Radix primitives for a minimal, accessible interface.' }, { name: 'Framer Motion', detail: 'Small transitions between states.' }] },
			{ title: 'App server', items: [{ name: 'Next.js 15 App Router', detail: 'Routes, Partial Prerendering and Server Actions.' }, { name: 'Vercel AI SDK', detail: 'Wraps the OpenAI calls behind the chat.' }] },
			{ title: 'Services', items: [{ name: 'Clerk', detail: 'Authentication and user management.' }, { name: 'Drizzle + Neon Postgres', detail: 'Typed schema and queries on serverless Postgres.' }, { name: 'Cloudflare R2', detail: 'Object storage for media and assets.' }] },
		],
		layersCaption: 'Based on the stack listed in the repository README.',
		statement: 'I built Tracky alone: product scope, UI, data model, AI integration, auth, CI and deployment.',
		decisionsTitle: 'Trade-offs',
		decisions: [
			{ decision: 'Server Actions instead of a separate API', rationale: 'Keeping mutations next to the UI cut boilerplate for a solo project. The cost is that the logic is tied to Next.js.' },
			{ decision: 'Chat as a shortcut, not the only input', rationale: 'The AI chat speeds up logging, but regular forms are still there for when you want exact values.' },
			{ decision: 'Fewer features on purpose', rationale: 'I left out social feeds and gamification to keep the app focused on logging and progress.' },
		],
		outro: { title: 'See it live', note: 'Tracky is in beta at tracky.fit and the full source is on GitHub under the MIT license.' },
	},
	es: {
		lede: 'Un tracker de fitness minimalista que diseñé y construí por mi cuenta. Se queda con lo esencial (comidas, entrenamientos, progreso y metas) y suma un chat con IA que convierte una frase normal en entradas del diario. Es open source y está en vivo en tracky.fit, con más de 100 usuarios activos.',
		facts: [
			{ label: 'Rol', value: 'Desarrollador único' },
			{ label: 'Año', value: '2024' },
			{ label: 'Stack', value: 'Next.js 15, Drizzle, OpenAI' },
			{ label: 'Estado', value: 'Beta en tracky.fit' },
		],
		links: [
			{ label: 'Abrir tracky.fit', url: 'https://www.tracky.fit' },
			{ label: 'Código en GitHub', url: 'https://github.com/fraineralex/tracky' },
		],
		caption: 'Sesión iniciada como Frainer Encarnación. La interfaz está recreada a partir del repositorio de Tracky y funciona con datos de ejemplo en tu navegador. No se envía nada.',
		c1: {
			title: 'Registrar un desayuno no debería tomar diez toques',
			body: [
				'La mayoría de las apps de fitness esconden lo básico bajo un montón de funciones. Yo quería un tracker que no estorbe: registras lo que comiste o entrenaste, ves tu progreso contra tu meta y sigues con tu día.',
				'Por eso mantuve la app pequeña a propósito. Cada página tiene un solo trabajo.',
			],
		},
		tiles: [
			{ title: 'Dashboard', body: 'Progreso, estadísticas personales y acceso rápido a las acciones principales, con gráficos de tendencia.' },
			{ title: 'Comida', body: 'Consumo y macros, con el chat de IA a un clic.' },
			{ title: 'Ejercicio', body: 'Entrenamientos con tipo, duración e intensidad, o deja que el chat los agregue.' },
			{ title: 'Diario', body: 'Un registro diario de comidas y entrenamientos que puedes buscar y filtrar.' },
		],
		c2: {
			title: 'De una frase a una entrada del diario',
			body: [
				'La idea central es el chat con IA en las páginas de Comida y Ejercicio. Describes lo que hiciste con tus palabras, el modelo lo estructura y la entrada aparece en tu diario.',
				'La animación de abajo escribe un desayuno, lo convierte en entradas del diario y actualiza los totales del día automáticamente.',
			],
		},
		steps: [
			{ title: 'Escribes', body: 'En el chat de Comida escribes algo como "dos huevos y un guineo de desayuno".' },
			{ title: 'Llamada al modelo', body: 'Una llamada del lado del servidor con el Vercel AI SDK envía el mensaje a la API de OpenAI y pide una salida estructurada.', tag: 'ai sdk' },
			{ title: 'Entrada estructurada', body: 'La respuesta se convierte en las entradas de comida que Tracky entiende, con sus valores nutricionales.' },
			{ title: 'Guardado', body: 'Una Server Action guarda las entradas en Postgres con Drizzle, asociadas al usuario de Clerk.', tag: 'server action' },
			{ title: 'Diario y dashboard', body: 'El diario y el dashboard se actualizan, así el progreso hacia la meta del día cambia al instante.' },
		],
		flowNote: 'Flujo ilustrativo basado en el README del proyecto.',
		c3: {
			title: 'Un solo framework, sin API aparte',
			body: [
				'Empecé con create-t3-app y migré al App Router de Next.js 15 con React 19. Las mutaciones pasan por Server Actions y el Partial Prerendering muestra al instante las partes estáticas mientras llegan los datos del usuario.',
			],
		},
		layers: [
			{ title: 'Cliente', items: [{ name: 'React 19 + shadcn/ui', detail: 'Tailwind y primitivas de Radix para una interfaz mínima y accesible.' }, { name: 'Framer Motion', detail: 'Transiciones pequeñas entre estados.' }] },
			{ title: 'Servidor', items: [{ name: 'Next.js 15 App Router', detail: 'Rutas, Partial Prerendering y Server Actions.' }, { name: 'Vercel AI SDK', detail: 'Envuelve las llamadas a OpenAI detrás del chat.' }] },
			{ title: 'Servicios', items: [{ name: 'Clerk', detail: 'Autenticación y gestión de usuarios.' }, { name: 'Drizzle + Neon Postgres', detail: 'Esquema y consultas tipadas sobre Postgres serverless.' }, { name: 'Cloudflare R2', detail: 'Almacenamiento de archivos y recursos.' }] },
		],
		layersCaption: 'Basado en el stack que aparece en el README del repositorio.',
		statement: 'Construí Tracky solo: alcance del producto, interfaz, modelo de datos, integración con IA, autenticación, CI y despliegue.',
		decisionsTitle: 'Decisiones',
		decisions: [
			{ decision: 'Server Actions en vez de una API aparte', rationale: 'Tener las mutaciones junto a la interfaz me ahorró código repetido en un proyecto individual. El costo es que la lógica queda atada a Next.js.' },
			{ decision: 'El chat como atajo, no como única entrada', rationale: 'El chat acelera el registro, pero los formularios siguen ahí cuando quieres valores exactos.' },
			{ decision: 'Menos funciones a propósito', rationale: 'Dejé fuera feeds sociales y gamificación para que la app se enfoque en registrar y ver progreso.' },
		],
		outro: { title: 'Míralo en vivo', note: 'Tracky está en beta en tracky.fit y el código completo está en GitHub con licencia MIT.' },
	},
} as const

const ICONS = [<Gauge key='g' className='size-4' aria-hidden />, <Salad key='s' className='size-4' aria-hidden />, <Bot key='b' className='size-4' aria-hidden />, <NotebookPen key='n' className='size-4' aria-hidden />]

export default function TrackyCaseStudy({ lang }: { lang: Lang }) {
	const t = COPY[lang]
	const back = backLink(lang)
	return (
		<Shell>
			<BackLink href={back.href} label={back.label} />
			<Hero title='Tracky' lede={t.lede} facts={[...t.facts]} links={[...t.links]}>
				<TrackyAppSim lang={lang} />
				<StageCaption>{t.caption}</StageCaption>
			</Hero>

			<Chapter n='01' title={t.c1.title}>
				{t.c1.body.map((p) => (
					<P key={p}>{p}</P>
				))}
			</Chapter>
			<Stage>
				<Tiles cols={4} items={t.tiles.map((tile, i) => ({ ...tile, icon: ICONS[i] }))} />
			</Stage>

			<Chapter n='02' title={t.c2.title}>
				{t.c2.body.map((p) => (
					<P key={p}>{p}</P>
				))}
			</Chapter>
			<Stage>
				<SentenceScene lang={lang} />
			</Stage>

			<Statement>{t.statement}</Statement>

			<Chapter n='03' title={t.c3.title}>
				{t.c3.body.map((p) => (
					<P key={p}>{p}</P>
				))}
			</Chapter>
			<Stage>
				<StackScene lang={lang} layers={t.layers.map((layer) => ({ title: layer.title, items: [...layer.items] }))} caption={t.layersCaption} />
			</Stage>

			<Decisions title={t.decisionsTitle} items={[...t.decisions]} />
			<Outro title={t.outro.title} note={t.outro.note} links={[...t.links]} />
		</Shell>
	)
}
