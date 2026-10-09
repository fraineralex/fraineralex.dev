import dynamic from 'next/dynamic'
import { BackLink, Chapter, Decisions, Hero, Outro, P, Shell, Stage, Statement } from '../kit/layout'
import { Layers, StageCaption } from '../kit/blocks'
import { MessageJourneyScene } from '../chatify/message-journey-scene'
import { FeaturesScene } from '../chatify/features-scene'
import { backLink, type Lang } from './shared'

const ChatifyLiveSim = dynamic(() => import('../chatify/chatify-live-sim'), {
	loading: () => <div className='h-[640px] animate-pulse rounded-xl border border-slate-700/60 bg-slate-900/50 motion-reduce:animate-none' aria-hidden />,
})

const COPY = {
	en: {
		lede: 'A realtime messaging app I built as a full stack TypeScript project. One to one chats with text, files, images, videos, stickers, GIFs, emojis, reactions and read receipts, with 200+ sign ups.',
		facts: [
			{ label: 'Role', value: 'Solo full stack developer' },
			{ label: 'Year', value: '2024' },
			{ label: 'Realtime', value: 'Socket.io' },
			{ label: 'Data', value: 'Turso, S3' },
		],
		links: [
			{ label: 'Open Chatify', url: 'https://chatify.fraineralex.dev' },
			{ label: 'Source on GitHub', url: 'https://github.com/fraineralex/chatify' },
		],
		caption: 'Two sessions side by side: mine and a sample contact. The conversation plays automatically with socket events below. Everything runs locally with sample data.',
		c1: {
			title: 'What it takes to feel instant',
			body: [
				'I wanted to understand what it takes to build a messaging product that feels like the ones people use every day: instant delivery, rich media, read receipts and the small chat actions you expect.',
				'REST loads chats and history. Socket.io handles live delivery. Both sides are protected by the same Auth0 JWT.',
			],
		},
		steps: [
			{ title: 'Socket auth', body: 'When the client connects, authSocketMiddleware validates the Auth0 JWT before any event is accepted.', tag: 'handshake' },
			{ title: 'Emit', body: 'The sender\'s client emits a new_message event over Socket.io.', tag: 'new_message' },
			{ title: 'Persist', body: 'The server stores the message in Turso (libSQL).' },
			{ title: 'Broadcast', body: 'The server sends a chat_message event to the connected clients in that conversation.', tag: 'chat_message' },
			{ title: 'Delivered and read', body: 'The recipient renders the message and the read status flows back, so the sender sees the ticks change.', tag: 'read_message' },
		],
		flowNote: 'Event names come from the project source code.',
		c2: { title: 'The details that make a chat complete', body: ['Beyond sending text, most of the work went into the small things.'] },
		tiles: [
			{ title: 'Rich messages', body: 'Clickable links, images, videos and any file type with previews, plus a Tenor powered sticker and GIF picker.' },
			{ title: 'Replies', body: 'Reply to a specific message and jump back to it from the quote.' },
			{ title: 'Reactions', body: 'React to any message with an emoji.' },
			{ title: 'Read status', body: 'Sent, delivered and read ticks, plus notifications for unseen messages.' },
			{ title: 'Chat actions', body: 'Pin, hide, mute, mark as unread, block, clear or delete a chat.' },
			{ title: 'Search', body: 'Find chats and messages, and filter shared content by files and media.' },
		],
		c3: {
			title: 'A long running server on purpose',
			body: [
				'The repo is a pnpm workspace with a React client and a Node.js API. The client is on Cloudflare Pages. Realtime connections need a process that stays up, so the API runs on AWS EC2 with PM2, deployed by a GitHub Actions pipeline.',
			],
		},
		layers: [
			{ title: 'Client', items: [{ name: 'React + Vite', detail: 'Zustand for state and Dexie for local browser storage.' }, { name: 'Auth0', detail: 'Google, GitHub or email sign in. One JWT for REST and sockets.' }] },
			{ title: 'API', items: [{ name: 'Express', detail: 'REST routes guarded with express-oauth2-jwt-bearer.' }, { name: 'Socket.io', detail: 'new_message in, chat_message out, behind authSocketMiddleware.' }] },
			{ title: 'Data and infra', items: [{ name: 'Turso (libSQL)', detail: 'Users, chats and messages.' }, { name: 'S3 + CloudFront', detail: 'Media uploads with optional signed URLs.' }, { name: 'EC2 + PM2', detail: 'Runs the API, deployed from GitHub Actions.' }] },
		],
		layersCaption: 'Based on the architecture section of the repository README.',
		statement: 'I built the whole thing: client, API, realtime layer, data model, media pipeline, CI and the deployment pipeline.',
		decisionsTitle: 'Trade-offs',
		decisions: [
			{ decision: 'Socket.io on a long running server', rationale: 'Realtime connections need a process that stays up, so the API runs on EC2 with PM2 instead of serverless functions.' },
			{ decision: 'Media in S3, not in the database', rationale: 'Files go to object storage and only references live in Turso, which keeps the database small.' },
			{ decision: 'One auth model for REST and sockets', rationale: 'Reusing the Auth0 JWT on both paths means one place to reason about who can do what.' },
		],
		outro: { title: 'Try it', note: 'Chatify is live and the source is on GitHub under the MIT license.' },
	},
	es: {
		lede: 'Una app de mensajería en tiempo real que construí como proyecto full stack en TypeScript. Chats uno a uno con texto, archivos, imágenes, videos, stickers, GIFs, emojis, reacciones y confirmación de lectura, con más de 200 registros.',
		facts: [
			{ label: 'Rol', value: 'Desarrollador full stack único' },
			{ label: 'Año', value: '2024' },
			{ label: 'Tiempo real', value: 'Socket.io' },
			{ label: 'Datos', value: 'Turso, S3' },
		],
		links: [
			{ label: 'Abrir Chatify', url: 'https://chatify.fraineralex.dev' },
			{ label: 'Código en GitHub', url: 'https://github.com/fraineralex/chatify' },
		],
		caption: 'Dos sesiones lado a lado: la mía y un contacto de ejemplo. La conversación se reproduce automáticamente con los eventos del socket abajo. Todo corre localmente con datos de ejemplo.',
		c1: {
			title: 'Lo que hace falta para sentirse instantáneo',
			body: [
				'Quería entender qué hace falta para construir una app de mensajería que se sienta como las que usamos todos los días: entrega inmediata, multimedia, confirmación de lectura y esas pequeñas acciones que uno espera.',
				'REST carga los chats y el historial. Socket.io se encarga de la entrega en vivo. Ambos lados se protegen con el mismo JWT de Auth0.',
			],
		},
		steps: [
			{ title: 'Autenticación del socket', body: 'Cuando el cliente se conecta, authSocketMiddleware valida el JWT de Auth0 antes de aceptar cualquier evento.', tag: 'handshake' },
			{ title: 'Emitir', body: 'El cliente de quien envía emite un evento new_message por Socket.io.', tag: 'new_message' },
			{ title: 'Guardar', body: 'El servidor guarda el mensaje en Turso (libSQL).' },
			{ title: 'Difundir', body: 'El servidor envía un evento chat_message a los clientes conectados en esa conversación.', tag: 'chat_message' },
			{ title: 'Entregado y leído', body: 'Quien recibe ve el mensaje y el estado de lectura vuelve, así quien envía ve cambiar los checks.', tag: 'read_message' },
		],
		flowNote: 'Los nombres de los eventos vienen del código del proyecto.',
		c2: { title: 'Los detalles que completan un chat', body: ['Más allá de enviar texto, la mayor parte del trabajo estuvo en los detalles.'] },
		tiles: [
			{ title: 'Mensajes ricos', body: 'Enlaces clicables, imágenes, videos y cualquier archivo con vista previa, más un selector de stickers y GIFs con Tenor.' },
			{ title: 'Respuestas', body: 'Responde a un mensaje concreto y vuelve a él desde la cita.' },
			{ title: 'Reacciones', body: 'Reacciona a cualquier mensaje con un emoji.' },
			{ title: 'Estado de lectura', body: 'Checks de enviado, entregado y leído, y avisos de mensajes sin ver.' },
			{ title: 'Acciones del chat', body: 'Fijar, ocultar, silenciar, marcar como no leído, bloquear, vaciar o eliminar un chat.' },
			{ title: 'Búsqueda', body: 'Encuentra chats y mensajes, y filtra lo compartido por archivos y multimedia.' },
		],
		c3: {
			title: 'Un servidor siempre encendido, a propósito',
			body: [
				'El repo es un workspace de pnpm con un cliente en React y una API en Node.js. El cliente está en Cloudflare Pages. Las conexiones en tiempo real necesitan un proceso que no se apague, así que la API corre en AWS EC2 con PM2 y se despliega con GitHub Actions.',
			],
		},
		layers: [
			{ title: 'Cliente', items: [{ name: 'React + Vite', detail: 'Zustand para el estado y Dexie para almacenamiento local.' }, { name: 'Auth0', detail: 'Acceso con Google, GitHub o correo. Un solo JWT para REST y sockets.' }] },
			{ title: 'API', items: [{ name: 'Express', detail: 'Rutas REST protegidas con express-oauth2-jwt-bearer.' }, { name: 'Socket.io', detail: 'Entra new_message, sale chat_message, detrás de authSocketMiddleware.' }] },
			{ title: 'Datos e infraestructura', items: [{ name: 'Turso (libSQL)', detail: 'Usuarios, chats y mensajes.' }, { name: 'S3 + CloudFront', detail: 'Subida de archivos con URLs firmadas opcionales.' }, { name: 'EC2 + PM2', detail: 'Corre la API, desplegada desde GitHub Actions.' }] },
		],
		layersCaption: 'Basado en la sección de arquitectura del README del repositorio.',
		statement: 'Lo construí completo: cliente, API, capa de tiempo real, modelo de datos, manejo de archivos, CI y el pipeline de despliegue.',
		decisionsTitle: 'Decisiones',
		decisions: [
			{ decision: 'Socket.io en un servidor que no se apaga', rationale: 'Las conexiones en tiempo real necesitan un proceso activo, así que la API corre en EC2 con PM2 en vez de funciones serverless.' },
			{ decision: 'Archivos en S3, no en la base de datos', rationale: 'Los archivos van a almacenamiento de objetos y en Turso solo quedan las referencias, así la base de datos se mantiene liviana.' },
			{ decision: 'Un solo modelo de autenticación', rationale: 'Usar el mismo JWT de Auth0 en REST y sockets deja un solo lugar donde decidir quién puede hacer qué.' },
		],
		outro: { title: 'Pruébalo', note: 'Chatify está en vivo y el código está en GitHub con licencia MIT.' },
	},
} as const

export default function ChatifyCaseStudy({ lang }: { lang: Lang }) {
	const t = COPY[lang]
	const back = backLink(lang)
	return (
		<Shell>
			<BackLink href={back.href} label={back.label} />
			<Hero title='Chatify' lede={t.lede} facts={[...t.facts]} links={[...t.links]}>
				<ChatifyLiveSim lang={lang} />
				<StageCaption>{t.caption}</StageCaption>
			</Hero>

			<Chapter n='01' title={t.c1.title}>
				{t.c1.body.map((p) => (
					<P key={p}>{p}</P>
				))}
			</Chapter>
			<Stage>
				<MessageJourneyScene lang={lang} />
			</Stage>

			<Chapter n='02' title={t.c2.title}>
				{t.c2.body.map((p) => (
					<P key={p}>{p}</P>
				))}
			</Chapter>
			<Stage>
				<FeaturesScene lang={lang} items={t.tiles.map((tile) => ({ title: tile.title, body: tile.body }))} />
			</Stage>

			<Statement>{t.statement}</Statement>

			<Chapter n='03' title={t.c3.title}>
				{t.c3.body.map((p) => (
					<P key={p}>{p}</P>
				))}
			</Chapter>
			<Stage>
				<Layers layers={t.layers.map((l) => ({ title: l.title, items: [...l.items] }))} caption={t.layersCaption} />
			</Stage>

			<Decisions title={t.decisionsTitle} items={[...t.decisions]} />
			<Outro title={t.outro.title} note={t.outro.note} links={[...t.links]} />
		</Shell>
	)
}
