export type Lang = 'en' | 'es'
export type Side = 'frainer' | 'laura'

export interface SeedLine {
  side: Side
  body: string
  /** Emoji the other person already left on this message. */
  reaction?: string
}

export interface ScriptStep {
  side: Side
  kind: 'text' | 'sticker' | 'react'
  body: string
  /** Index of an earlier script step to quote. */
  replyTo?: number
  /** Index of an earlier script step to react to. */
  target?: number
}

export interface Copy {
  sampleBadge: string
  caption: string
  replay: string
  replaying: string
  switchLabel: string
  youPill: string
  samplePill: string
  online: string
  typing: string
  typingLabel: (name: string) => string
  placeholder: string
  send: string
  emojis: string
  stickers: string
  stickerNote: string
  reply: string
  cancelReply: string
  replyingTo: (name: string) => string
  you: string
  yourself: string
  search: string
  searchBtn: string
  closeSearch: string
  options: string
  mute: string
  unmute: string
  markRead: string
  timeline: string
  gate: string
  idle: string
  waiting: string
  quick: string
  noMatches: string
  chatNotFound: string
  windowLabel: (name: string) => string
  stepEmit: string
  stepPersist: string
  stepBroadcast: string
  stepDelivered: string
  stepRead: string
  stepEdit: string
  stepUpdate: string
  traceEmit: (name: string) => string
  traceTurso: string
  traceBroadcast: string
  traceDelivered: (name: string) => string
  traceRead: (name: string) => string
  traceEdit: (name: string) => string
  traceTursoUpdate: string
  traceUpdate: string
  reactWith: (emoji: string) => string
  messageActions: string
  openMenu: string
  tickSent: string
  tickDelivered: string
  tickRead: string
  seed: SeedLine[]
  script: ScriptStep[]
  quickReplies: Record<Side, string[]>
}

const en: Copy = {
  sampleBadge: 'Sample data',
  caption: 'Sample conversation. Simulation of the Chatify UI built from the open source repo.',
  replay: 'Replay',
  replaying: 'Replaying',
  switchLabel: 'Choose whose screen to view',
  youPill: 'You',
  samplePill: 'Sample',
  online: 'online',
  typing: 'typing...',
  typingLabel: (name) => `${name} is typing`,
  placeholder: 'Type a message',
  send: 'Send',
  emojis: 'Insert emojis',
  stickers: 'Stickers and GIFs',
  stickerNote: 'Sample stickers',
  reply: 'Reply',
  cancelReply: 'Cancel reply',
  replyingTo: (name) => `Replying to ${name}`,
  you: 'You',
  yourself: 'yourself',
  search: 'Search in chat',
  searchBtn: 'Search',
  closeSearch: 'Close search',
  options: 'Chat options',
  mute: 'Mute',
  unmute: 'Unmute',
  markRead: 'Mark as read',
  timeline: 'Socket timeline',
  gate: 'Connection checked by authSocketMiddleware',
  idle: 'Send a message to watch the real events.',
  waiting: 'read_message waits until that window is the one on screen.',
  quick: 'Quick replies',
  noMatches: 'No messages match',
  chatNotFound: 'Chat not found',
  windowLabel: (name) => `${name}'s Chatify window`,
  stepEmit: 'Client emit',
  stepPersist: 'Turso',
  stepBroadcast: 'Broadcast',
  stepDelivered: 'Delivered',
  stepRead: 'Read',
  stepEdit: 'Client emit',
  stepUpdate: 'Broadcast',
  traceEmit: (name) => `${name} emits new_message`,
  traceTurso: 'Server inserts the row in Turso',
  traceBroadcast: 'Server broadcasts chat_message',
  traceDelivered: (name) => `${name} emits delivered_message`,
  traceRead: (name) => `${name} emits read_message`,
  traceEdit: (name) => `${name} emits edit_message`,
  traceTursoUpdate: 'Server updates reactions in Turso',
  traceUpdate: 'Server broadcasts update_message',
  reactWith: (emoji) => `React with ${emoji}`,
  messageActions: 'Message actions',
  openMenu: 'Show message actions',
  tickSent: 'Sent',
  tickDelivered: 'Delivered',
  tickRead: 'Read',
  seed: [
    { side: 'laura', body: 'Hey Frainer, did the socket auth land?' },
    {
      side: 'frainer',
      body: 'Yes. authSocketMiddleware checks the Auth0 JWT before any event.',
      reaction: '👍'
    },
    { side: 'laura', body: 'Nice. I have this chat open on my side.' }
  ],
  script: [
    { side: 'frainer', kind: 'text', body: 'Watch the ticks. This one leaves as new_message.' },
    { side: 'laura', kind: 'text', body: 'It landed. I am replying so the quote shows up.' },
    { side: 'frainer', kind: 'text', body: 'Blue checks mean read_message.', replyTo: 1 },
    { side: 'laura', kind: 'react', body: '🔥', target: 0 },
    { side: 'laura', kind: 'sticker', body: '🎉' }
  ],
  quickReplies: {
    frainer: ['On my way', 'Sounds good', 'Can you open the chat?'],
    laura: ['Opening it now', 'Looks great', 'Send me a sticker']
  }
}

const es: Copy = {
  sampleBadge: 'Datos de ejemplo',
  caption: 'Conversación de ejemplo. Simulación de la interfaz de Chatify hecha a partir del repositorio de código abierto.',
  replay: 'Repetir',
  replaying: 'Repitiendo',
  switchLabel: 'Elige qué pantalla ver',
  youPill: 'Tú',
  samplePill: 'Ejemplo',
  online: 'en línea',
  typing: 'escribiendo...',
  typingLabel: (name) => `${name} está escribiendo`,
  placeholder: 'Escribe un mensaje',
  send: 'Enviar',
  emojis: 'Insertar emojis',
  stickers: 'Stickers y GIFs',
  stickerNote: 'Stickers de ejemplo',
  reply: 'Responder',
  cancelReply: 'Cancelar respuesta',
  replyingTo: (name) => `Respondiendo a ${name}`,
  you: 'Tú',
  yourself: 'ti',
  search: 'Buscar en el chat',
  searchBtn: 'Buscar',
  closeSearch: 'Cerrar búsqueda',
  options: 'Opciones del chat',
  mute: 'Silenciar',
  unmute: 'Quitar silencio',
  markRead: 'Marcar como leído',
  timeline: 'Línea de tiempo del socket',
  gate: 'Conexión revisada por authSocketMiddleware',
  idle: 'Envía un mensaje para ver los eventos reales.',
  waiting: 'read_message espera a que esa ventana sea la que está en pantalla.',
  quick: 'Respuestas rápidas',
  noMatches: 'Ningún mensaje coincide',
  chatNotFound: 'Chat no encontrado',
  windowLabel: (name) => `Ventana de Chatify de ${name}`,
  stepEmit: 'Emite el cliente',
  stepPersist: 'Turso',
  stepBroadcast: 'Difunde',
  stepDelivered: 'Entregado',
  stepRead: 'Leído',
  stepEdit: 'Emite el cliente',
  stepUpdate: 'Difunde',
  traceEmit: (name) => `${name} emite new_message`,
  traceTurso: 'El servidor inserta la fila en Turso',
  traceBroadcast: 'El servidor difunde chat_message',
  traceDelivered: (name) => `${name} emite delivered_message`,
  traceRead: (name) => `${name} emite read_message`,
  traceEdit: (name) => `${name} emite edit_message`,
  traceTursoUpdate: 'El servidor actualiza las reacciones en Turso',
  traceUpdate: 'El servidor difunde update_message',
  reactWith: (emoji) => `Reaccionar con ${emoji}`,
  messageActions: 'Acciones del mensaje',
  openMenu: 'Mostrar acciones del mensaje',
  tickSent: 'Enviado',
  tickDelivered: 'Entregado',
  tickRead: 'Leído',
  seed: [
    { side: 'laura', body: 'Hola Frainer, ¿ya quedó la autenticación del socket?' },
    {
      side: 'frainer',
      body: 'Sí. authSocketMiddleware revisa el JWT de Auth0 antes de cualquier evento.',
      reaction: '👍'
    },
    { side: 'laura', body: 'Bien. Tengo este chat abierto de mi lado.' }
  ],
  script: [
    { side: 'frainer', kind: 'text', body: 'Mira los ticks. Este sale como new_message.' },
    { side: 'laura', kind: 'text', body: 'Ya llegó. Te respondo para que se vea la cita.' },
    { side: 'frainer', kind: 'text', body: 'Los checks azules son read_message.', replyTo: 1 },
    { side: 'laura', kind: 'react', body: '🔥', target: 0 },
    { side: 'laura', kind: 'sticker', body: '🎉' }
  ],
  quickReplies: {
    frainer: ['Ya voy', 'Me parece bien', '¿Puedes abrir el chat?'],
    laura: ['Lo estoy abriendo', 'Se ve muy bien', 'Mándame un sticker']
  }
}

export const COPY: Record<Lang, Copy> = { en, es }

export const NAMES: Record<Side, string> = { frainer: 'Frainer Encarnación', laura: 'Laura' }
