'use client'

import { useEffect, useState } from 'react'
import { colorOf, makeMove, moveLabel, searchBestMove, sqName, startPosition } from './engine'
import { useSceneTimeline } from '../kit/scene'
import { SceneFrame } from './scene-frame'

type Lang = 'en' | 'es'
const INITIAL = startPosition()
const OPENING = { from: 12, to: 28 }
const AFTER_OPENING = makeMove(INITIAL, OPENING)
const GLYPH: Record<string, string> = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟', k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
const COPY = {
 en: { title: 'Watch the engine choose a reply', opening: 'White plays e4 automatically. The engine searches for Black’s reply.', thinking: 'Searching at depth 2…', chosen: 'Chosen move', nodes: 'Nodes visited', pruned: 'Branches pruned', evaluation: 'Evaluation', board: 'Chess board', note: 'Original minimax.py search, depth 2, with a 3 second time budget. Positive evaluation favors Black.', ready: 'Opening: e4', timeout: 'Time budget reached. Best move found so far.' },
 es: { title: 'Mira cómo el motor elige una respuesta', opening: 'Las blancas juegan e4 automáticamente. El motor busca la respuesta de las negras.', thinking: 'Buscando a profundidad 2…', chosen: 'Jugada elegida', nodes: 'Nodos visitados', pruned: 'Ramas podadas', evaluation: 'Evaluación', board: 'Tablero de ajedrez', note: 'Búsqueda original de minimax.py, profundidad 2, con 3 segundos de límite. La evaluación positiva favorece a las negras.', ready: 'Apertura: e4', timeout: 'Se agotó el tiempo. Mejor jugada encontrada.' },
} as const

export default function ChessLab({ lang }: { lang: Lang }) {
 const t = COPY[lang]
 const timeline = useSceneTimeline(6500)
 const [reply, setReply] = useState<Awaited<ReturnType<typeof searchBestMove>> | null>(null)
 useEffect(() => {
  let cancelled = false
  searchBestMove(AFTER_OPENING, 2, { limitMs: 3000, textbook: false }).then((result) => {
   if (!cancelled) setReply(result)
  })
  return () => { cancelled = true }
 }, [])
 const opened = timeline.elapsed >= 1000
 const finished = timeline.elapsed >= 5000 && !!reply?.move
 const position = finished && reply?.move ? makeMove(AFTER_OPENING, reply.move) : opened ? AFTER_OPENING : INITIAL
 const last = finished ? reply?.move : opened ? OPENING : null
 const chosen = finished && reply?.move ? moveLabel(AFTER_OPENING, reply.move, lang) : null
 const score = reply?.score ?? 0
 return (
  <SceneFrame timeline={timeline} kicker='minimax.py' title={t.title} caption={t.note}>
   <div className='grid gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]'>
    <div className='mx-auto grid aspect-square w-full max-w-[480px] grid-cols-8 grid-rows-8 overflow-hidden rounded-lg' role='img' aria-label={`${t.board}. ${chosen ? `${t.chosen}: ${chosen}` : t.ready}`}>
     {Array.from({ length: 64 }, (_, i) => {
      const s = (7 - Math.floor(i / 8)) * 8 + i % 8
      const dark = (Math.floor(s / 8) + s % 8) % 2 === 0
      const piece = position.board[s]
      const traced = last && (last.from === s || last.to === s)
      const capture = finished && last?.to === s && !!AFTER_OPENING.board[s]
      return <div key={s} className='relative flex items-center justify-center' style={{ backgroundColor: capture ? dark ? '#C84646' : '#C86464' : traced ? dark ? '#ACC333' : '#F4F774' : dark ? '#779A58' : '#EAEBC8' }}>
       {(s < 8 || s % 8 === 0) && <span className='absolute bottom-0.5 right-1 text-[9px] font-semibold' style={{ color: dark ? '#EAEBC8' : '#779A58' }}>{s < 8 && s % 8 === 0 ? 'a1' : s < 8 ? sqName(s)[0] : sqName(s)[1]}</span>}
       {piece && <span className='relative select-none text-[clamp(1.5rem,7vw,3rem)] leading-none' style={colorOf(piece) === 'w' ? { color: '#fff', textShadow: '0 1px 1px #1c1917, 1px 0 1px #1c1917, -1px 0 1px #1c1917, 0 -1px 1px #1c1917' } : { color: '#1c1917' }}>{GLYPH[piece]}</span>}
      </div>
     })}
    </div>
    <aside className='min-w-0 rounded-lg border border-[#e7e5e4] bg-[#f7f6f2] p-4'>
     <p className='min-h-[4.5rem] text-sm leading-relaxed'>{t.opening}</p>
     <p className='mt-3 min-h-[3rem] font-mono text-sm font-semibold text-[#486333]'>{chosen ? `${t.chosen}: ${chosen}` : opened ? t.thinking : t.ready}</p>
     <dl className='mt-4 grid grid-cols-[1fr_auto] gap-x-3 gap-y-3 text-sm'>
      <dt>{t.nodes}</dt><dd className='min-w-[8ch] text-right font-mono tabular-nums'>{reply?.stats.nodes.toLocaleString(lang) ?? '…'}</dd>
      <dt>{t.pruned}</dt><dd className='text-right font-mono tabular-nums'>{reply?.stats.pruned.toLocaleString(lang) ?? '…'}</dd>
      <dt>{t.evaluation}</dt><dd className='text-right font-mono tabular-nums'>{reply ? Number.isFinite(score) ? `${score > 0 ? '+' : ''}${score.toFixed(1)}` : score > 0 ? '+∞' : '−∞' : '…'}</dd>
     </dl>
     <p className='mt-4 min-h-[3rem] text-xs leading-relaxed text-stone-600'>{reply?.timedOut ? t.timeout : t.note}</p>
    </aside>
   </div>
  </SceneFrame>
 )
}
