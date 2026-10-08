import Image from 'next/image'
import { Building2, Landmark, MapPin } from 'lucide-react'
import { BackLink, Chapter, Decisions, Hero, MacWindow, Outro, P, Shell, Stage, Statement } from '../kit/layout'
import { StageCaption, Tiles } from '../kit/blocks'
import { BeachScanScene, ResponseScene } from '../sargotech/scenes'
import ObservatoryLazy from '../sargotech/observatory-lazy'
import { backLink, type Lang } from './shared'

const COPY = {
	en: {
		lede: 'Coastal technology from the Dominican Republic to get ahead of sargassum in the Caribbean. It connects ocean observation with the people who can act: hotels, municipalities and field teams. We are four co-founders, and I am the CTO and lead developer.',
		facts: [
			{ label: 'Role', value: 'CTO & Lead Developer' },
			{ label: 'Team', value: '4 co-founders' },
			{ label: 'Year', value: '2026' },
			{ label: 'Map', value: 'MapLibre GL' },
		],
		links: [{ label: 'Visit sargotech.com', url: 'https://sargotech.com' }],
		imageAlt: 'Caribbean coastline at dusk, from the SargoTech landing',
		chips: ['Red', 'Yellow', 'Green'],
		heroNote: 'Traffic light per beach',
		c1: {
			title: 'When you see it on the sand, it already arrived',
			body: [
				'The response to sargassum has to start earlier, out at sea, with enough notice to contain it, collect it and dispose of it properly.',
				'The public site has one interactive piece at its center: a map of Dominican beaches where each beach gets a traffic light. This is that same component, running here.',
			],
		},
		caption:
			'The same map as the public site, over a simplified basemap. The colors here are sample data that show how the traffic light works; on sargotech.com each beach takes its color from the amount of sargassum.',
		c2: {
			title: 'How a beach turns red',
			body: [
				'With a satellite reading, each beach scans the pixels around it and looks at how strong and how close the floating sargassum signal is. The rules are short on purpose, so anyone on the team can explain why a beach changed color.',
			],
		},
		rules: {
			title: 'What each color means',
			items: [
				{ tone: 'red', label: 'Red', text: 'A strong sargassum signal very close to the beach. Impact is likely.' },
				{ tone: 'yellow', label: 'Yellow', text: 'Sargassum is approaching: a strong signal farther out, or several faint ones nearby.' },
				{ tone: 'green', label: 'Green', text: 'No sargassum alert close to this beach.' },
			],
		},
		c3: { title: 'From forecast to final destination', body: ['SargoTech frames the work as four steps. Observing and forecasting is only the first one; the platform is meant to connect all of them.'] },
		steps: [
			{ title: 'Predict', body: 'Estimate the trajectory, the zone and the arrival window.' },
			{ title: 'Contain', body: 'Place anti sargassum barriers or nets at sea, based on an assessment of the coast.' },
			{ title: 'Collect', body: 'Remove it at sea before it reaches the beach.' },
			{ title: 'Manage disposal', body: 'Move it to an identified destination, with reuse when viable or responsible final disposal.' },
		],
		flowNote: 'The four steps as SargoTech defines them.',
		audiencesTitle: 'One map, three jobs',
		audiences: [
			{ title: 'Hotels and resorts', body: 'Know ahead of time what is coming to the beachfront and plan the response.' },
			{ title: 'Municipalities', body: 'Decide which beaches need attention first and coordinate resources.' },
			{ title: 'Scouts and providers', body: 'Validate conditions in the field and carry out the service.' },
		],
		c4: {
			title: 'A team of four',
			body: [
				'Enmanuel Santos is CEO and product lead, Christopher Marrero is a software engineer, Martha Espinal leads operations and partnerships, and I am the CTO and lead developer.',
				'On the team page my part reads: grounding processes, data validation and coordination to turn alerts into measurable actions. The product is still evolving, so I keep this page to what is public.',
			],
		},
		statement: 'One color per beach, simple enough that anyone on the team can explain it.',
		decisionsTitle: 'Decisions so far',
		decisions: [
			{ decision: 'A reference mode instead of an empty map', rationale: 'If the live reading is late or missing, the map still shows every beach and says so on screen.' },
			{ decision: 'Rules you can explain', rationale: 'Each color comes from how close and how strong the signal is, which is easy to explain and to check in the field.' },
		],
		outro: { title: 'Visit SargoTech', note: 'The site is in Spanish and includes the live coastal map.' },
	},
	es: {
		lede: 'Tecnología costera desde República Dominicana para adelantarnos al sargazo en el Caribe. Conecta la observación del océano con quienes pueden actuar: hoteles, municipios y equipos de campo. Somos cuatro cofundadores y yo soy el CTO y desarrollador líder.',
		facts: [
			{ label: 'Rol', value: 'CTO & Lead Developer' },
			{ label: 'Equipo', value: '4 cofundadores' },
			{ label: 'Año', value: '2026' },
			{ label: 'Mapa', value: 'MapLibre GL' },
		],
		links: [{ label: 'Visitar sargotech.com', url: 'https://sargotech.com' }],
		imageAlt: 'Costa caribeña al atardecer, de la landing de SargoTech',
		chips: ['Rojo', 'Amarillo', 'Verde'],
		heroNote: 'Semáforo por playa',
		c1: {
			title: 'Cuando lo ves en la arena, ya llegó',
			body: [
				'La respuesta al sargazo tiene que empezar antes, en el mar, con tiempo suficiente para contenerlo, recolectarlo y disponerlo bien.',
				'El sitio público tiene una pieza interactiva en el centro: un mapa de playas dominicanas donde cada playa tiene un semáforo. Este es ese mismo componente, corriendo aquí.',
			],
		},
		caption:
			'El mismo mapa del sitio público, sobre un mapa base simplificado. Los colores aquí son datos de ejemplo que muestran cómo funciona el semáforo; en sargotech.com cada playa toma su color según la cantidad de sargazo.',
		c2: {
			title: 'Cómo una playa se pone en rojo',
			body: [
				'Con una lectura satelital, cada playa revisa los píxeles a su alrededor y mira qué tan fuerte y qué tan cerca está la señal de sargazo flotante. Las reglas son cortas a propósito, para que cualquiera del equipo pueda explicar por qué una playa cambió de color.',
			],
		},
		rules: {
			title: 'Qué significa cada color',
			items: [
				{ tone: 'red', label: 'Rojo', text: 'Una señal fuerte de sargazo muy cerca de la playa. El impacto es probable.' },
				{ tone: 'yellow', label: 'Amarillo', text: 'El sargazo se acerca: una señal fuerte más lejos, o varias señales tenues cerca.' },
				{ tone: 'green', label: 'Verde', text: 'Sin alerta de sargazo cerca de esta playa.' },
			],
		},
		c3: { title: 'Del pronóstico al destino final', body: ['SargoTech organiza el trabajo en cuatro pasos. Observar y pronosticar es solo el primero; la plataforma busca conectarlos todos.'] },
		steps: [
			{ title: 'Predecir', body: 'Estimar la trayectoria, la zona y la ventana de llegada.' },
			{ title: 'Contener', body: 'Colocar barreras o mallas antisargazo en el mar, según la evaluación de la costa.' },
			{ title: 'Recolectar', body: 'Retirarlo en el mar antes de que llegue a la playa.' },
			{ title: 'Gestionar la disposición', body: 'Trasladarlo a un destino identificado, con valorización cuando sea viable o disposición final responsable.' },
		],
		flowNote: 'Los cuatro pasos tal como los define SargoTech.',
		audiencesTitle: 'Un mapa, tres trabajos',
		audiences: [
			{ title: 'Hoteles y resorts', body: 'Saber con tiempo lo que viene a su frente de playa y planificar la respuesta.' },
			{ title: 'Municipios', body: 'Decidir qué playas necesitan atención primero y coordinar recursos.' },
			{ title: 'Scouts y proveedores', body: 'Validar las condiciones en campo y ejecutar el servicio.' },
		],
		c4: {
			title: 'Un equipo de cuatro',
			body: [
				'Enmanuel Santos es CEO y líder de producto, Christopher Marrero es ingeniero de software, Martha Espinal lidera operaciones y alianzas, y yo soy el CTO y desarrollador líder.',
				'En la sección de equipo, mi parte dice: aterrizar procesos, validación de datos y coordinación para convertir alertas en acciones medibles. El producto sigue evolucionando, así que en esta página me quedo con lo que es público.',
			],
		},
		statement: 'Un color por playa, tan simple que cualquiera del equipo lo puede explicar.',
		decisionsTitle: 'Decisiones hasta ahora',
		decisions: [
			{ decision: 'Modo de referencia en vez de un mapa vacío', rationale: 'Si la lectura en vivo se retrasa o falta, el mapa sigue mostrando cada playa y lo dice en pantalla.' },
			{ decision: 'Reglas que se pueden explicar', rationale: 'Cada color sale de qué tan cerca y qué tan fuerte está la señal, algo fácil de explicar y de verificar en campo.' },
		],
		outro: { title: 'Visita SargoTech', note: 'El sitio está en español e incluye el mapa costero en vivo.' },
	},
} as const

const TONE = { red: 'bg-[#ef4444]', yellow: 'bg-[#f59e0b]', green: 'bg-[#22c55e]' } as const
const AUDIENCE_ICONS = [Building2, Landmark, MapPin]

export default function SargoTechCaseStudy({ lang }: { lang: Lang }) {
	const t = COPY[lang]
	const back = backLink(lang)
	return (
		<Shell>
			<BackLink href={back.href} label={back.label} />
			<Hero title='SargoTech' lede={t.lede} facts={[...t.facts]} links={[...t.links]} layout='split'>
				<figure className='relative overflow-hidden rounded-lg border border-slate-700/50'>
					<Image src='/images/projects/sargotech/costa-caribe.webp' alt={t.imageAlt} width={1600} height={900} priority sizes='(min-width: 1024px) 640px, 100vw' className='aspect-[4/3] w-full object-cover sm:aspect-[16/10]' />
					<div aria-hidden className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent' />
					<figcaption className='absolute inset-x-4 bottom-4 flex flex-wrap items-center gap-2 sm:inset-x-5 sm:bottom-5'>
						<span className='mr-1 hidden text-xs font-medium uppercase tracking-[0.14em] text-slate-200 sm:inline'>{t.heroNote}</span>
						{t.chips.map((chip, i) => (
							<span key={chip} className='inline-flex h-7 items-center gap-2 rounded-full border border-slate-600/50 bg-slate-950/80 px-3 text-xs leading-none text-slate-100 backdrop-blur'>
								<span className={`size-2 rounded-full ${[TONE.red, TONE.yellow, TONE.green][i]}`} aria-hidden />
								{chip}
							</span>
						))}
					</figcaption>
				</figure>
			</Hero>

			<Chapter n='01' title={t.c1.title}>
				{t.c1.body.map((p) => (
					<P key={p}>{p}</P>
				))}
			</Chapter>
			<Stage>
				<MacWindow url='sargotech.com/#mapa-interactivo'>
					<ObservatoryLazy lang={lang} />
				</MacWindow>
				<StageCaption>{t.caption}</StageCaption>
			</Stage>

			<Chapter
				n='02'
				title={t.c2.title}
				aside={<BeachScanScene lang={lang} rules={t.rules} />}
			>
				{t.c2.body.map((p) => (
					<P key={p}>{p}</P>
				))}
			</Chapter>

			<Chapter n='03' title={t.c3.title}>
				{t.c3.body.map((p) => (
					<P key={p}>{p}</P>
				))}
			</Chapter>
			<Stage>
				<ResponseScene lang={lang} steps={t.steps} />
				<StageCaption>{t.flowNote}</StageCaption>
			</Stage>

			<section className='mt-14 scroll-mt-24'>
				<h2 className='text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl'>{t.audiencesTitle}</h2>
				<div className='mt-5'>
					<Tiles
						items={t.audiences.map((a, i) => {
							const Icon = AUDIENCE_ICONS[i]
							return { ...a, icon: <Icon className='size-4' aria-hidden /> }
						})}
					/>
				</div>
			</section>

			<Statement>{t.statement}</Statement>

			<Chapter n='04' title={t.c4.title}>
				{t.c4.body.map((p) => (
					<P key={p}>{p}</P>
				))}
			</Chapter>

			<Decisions title={t.decisionsTitle} items={[...t.decisions]} />
			<Outro title={t.outro.title} note={t.outro.note} links={[...t.links]} />
		</Shell>
	)
}
