import dynamic from 'next/dynamic'
import { BackLink, Chapter, Decisions, Hero, Outro, P, Shell, Stage, Statement } from '../kit/layout'
import { StageCaption } from '../kit/blocks'
import AlphaBetaScene from '../chess/alphabeta-scene'
import EvalScene from '../chess/eval-scene'
import { backLink, type Lang } from './shared'

const ChessLab = dynamic(() => import('../chess/chess-lab'), {
	loading: () => <div className='h-[720px] animate-pulse rounded-xl border border-slate-700/60 bg-slate-900/50 motion-reduce:animate-none lg:h-[560px]' aria-hidden />,
})

const PIECES = [
	{ glyph: '♙', value: 10 },
	{ glyph: '♘', value: 30 },
	{ glyph: '♗', value: 30 },
	{ glyph: '♖', value: 50 },
	{ glyph: '♕', value: 90 },
]


const COPY = {
	en: {
		lede: 'A desktop chess game where you play against an engine I wrote in Python. It searches with minimax and alpha-beta pruning under a time limit, and scores positions with material, piece square tables and a few extra heuristics. Below, a browser port plays an opening in a loop, compares both search modes, and lets you take over as White.',
		facts: [
			{ label: 'Role', value: 'Solo developer' },
			{ label: 'Year', value: '2022' },
			{ label: 'Stack', value: 'Python, python-chess, Pygame' },
			{ label: 'Search', value: 'Minimax + alpha-beta' },
		],
		links: [
			{ label: 'Source on GitHub', url: 'https://github.com/fraineralex/ChessAI' },
			{ label: 'Demo video', url: 'https://user-images.githubusercontent.com/89224196/216224624-7c3c1718-6f93-4592-8720-afc9e4b2dc11.mp4' },
		],
		caption: 'A TypeScript port of the evaluation and search from minimax.py, running in your browser. The original is a Pygame desktop app that uses python-chess for the rules; here the move generator is written from scratch for the port and checked against standard perft counts.',
		c1: {
			title: 'Learning adversarial search by building it',
			body: ['I wanted to understand adversarial search by building it, not just reading about it. python-chess handles the rules and legal moves, Pygame draws the board, and the decision making is mine.'],
		},
		c2: {
			title: 'Look ahead, assume the best reply',
			body: [
				'The engine looks a fixed number of moves ahead and assumes the opponent always plays its best reply. Alpha-beta pruning skips branches that cannot change the final decision, so the same depth costs fewer evaluations.',
				'The search also watches the clock. When the time limit runs out, it returns the best move found so far instead of freezing the game. The readout next to the board shows nodes visited and branches pruned for every move.',
				'Porting it to TypeScript, I noticed the minimizing branch never updates beta, so the original code almost never prunes. The lab alternates between the original and the beta update: a completed search picks the same move with fewer nodes. Touch the board to play White, or use the toggle to compare the work yourself.',
			],
		},
		steps: [
			{ title: 'List legal moves', body: 'At the root, every legal move for the engine is a candidate.', tag: 'minimaxRoot' },
			{ title: 'Go deeper', body: 'For each candidate, the search alternates between the best move for one side and the best reply for the other.', tag: 'minimax' },
			{ title: 'Prune', body: 'As soon as a branch is proven worse than one already found (beta ≤ alpha), the rest of it is skipped.' },
			{ title: 'Score the leaves', body: 'At depth zero or when time is up, the position is scored with the evaluation function.', tag: 'evaluate' },
			{ title: 'Pick the best', body: 'The root keeps the move with the highest value and plays it.' },
		],
		flowNote: 'Function names from minimax.py.',
		c3: {
			title: 'What a position is worth',
			body: ['At the leaves the engine adds up material plus a per square bonus for each piece, 10 for giving check, infinity for checkmate, and a small reward for each legal move that lands on a central square.'],
		},
		piecesTitle: 'Base piece values',
		kingNote: 'The king is worth 9000, so losing it outweighs everything else.',
		squaresTitle: 'Good squares bonus',
		squaresNote: 'Bonus per legal move landing on each square: 1 for the four center squares, 0.5 for the ring around them.',
		statement: 'Pure Python is slow, so the design is about spending a small search budget well.',
		decisionsTitle: 'Trade-offs',
		decisions: [
			{ decision: 'Shallow search with a time budget', rationale: 'I kept the depth low and added a time limit so the game stays responsive. The README documents depth 2 with a 10 second limit; the current code searches at depth 3.' },
			{ decision: 'Hand written heuristics', rationale: 'Simple tables and rules are easy to read and tune, at the cost of strength compared to modern engines.' },
			{ decision: 'A library for the rules', rationale: 'python-chess takes care of legal moves, check and mate, so the project could focus on search and evaluation.' },
		],
		outro: { title: 'See it play', note: 'There is a demo video and the full source on GitHub. The board above plays automatically. Take over to play White, compare the search modes, then resume autoplay.' },
	},
	es: {
		lede: 'Un juego de ajedrez de escritorio donde juegas contra un motor que escribí en Python. Busca con minimax y poda alfa-beta con límite de tiempo, y evalúa las posiciones con material, tablas por casilla y algunas heurísticas extra. Abajo, una versión para el navegador repite una apertura, compara ambos modos de búsqueda y te deja tomar el control con blancas.',
		facts: [
			{ label: 'Rol', value: 'Desarrollador único' },
			{ label: 'Año', value: '2022' },
			{ label: 'Stack', value: 'Python, python-chess, Pygame' },
			{ label: 'Búsqueda', value: 'Minimax + alfa-beta' },
		],
		links: [
			{ label: 'Código en GitHub', url: 'https://github.com/fraineralex/ChessAI' },
			{ label: 'Video demo', url: 'https://user-images.githubusercontent.com/89224196/216224624-7c3c1718-6f93-4592-8720-afc9e4b2dc11.mp4' },
		],
		caption: 'Una versión en TypeScript de la evaluación y la búsqueda de minimax.py, corriendo en tu navegador. El original es una app de escritorio con Pygame que usa python-chess para las reglas; aquí el generador de jugadas está escrito desde cero para esta versión y verificado con los conteos perft estándar.',
		c1: {
			title: 'Aprender búsqueda adversaria construyéndola',
			body: ['Quería entender la búsqueda adversaria construyéndola, no solo leyendo sobre ella. python-chess se encarga de las reglas y las jugadas legales, Pygame dibuja el tablero y la toma de decisiones es mía.'],
		},
		c2: {
			title: 'Mirar adelante y suponer la mejor respuesta',
			body: [
				'El motor mira un número fijo de jugadas hacia adelante y supone que el rival siempre responde con su mejor jugada. La poda alfa-beta descarta ramas que no pueden cambiar la decisión final, así la misma profundidad cuesta menos evaluaciones.',
				'La búsqueda también vigila el reloj. Cuando se acaba el tiempo, devuelve la mejor jugada encontrada hasta ese momento en vez de congelar el juego. El panel junto al tablero muestra los nodos visitados y las ramas podadas en cada jugada.',
				'Al portarlo a TypeScript me di cuenta de que la rama minimizadora nunca actualiza beta, así que el código original casi nunca poda. El tablero alterna entre el original y la actualización de beta: una búsqueda completa elige la misma jugada con menos nodos. Toca el tablero para jugar con blancas o usa el selector para comparar el trabajo.',
			],
		},
		steps: [
			{ title: 'Listar jugadas legales', body: 'En la raíz, cada jugada legal del motor es una candidata.', tag: 'minimaxRoot' },
			{ title: 'Bajar un nivel', body: 'Para cada candidata, la búsqueda alterna entre la mejor jugada de un lado y la mejor respuesta del otro.', tag: 'minimax' },
			{ title: 'Podar', body: 'En cuanto una rama resulta peor que otra ya encontrada (beta ≤ alfa), se salta el resto.' },
			{ title: 'Evaluar las hojas', body: 'En profundidad cero o cuando se acaba el tiempo, la posición se puntúa con la función de evaluación.', tag: 'evaluate' },
			{ title: 'Elegir la mejor', body: 'La raíz se queda con la jugada de mayor valor y la juega.' },
		],
		flowNote: 'Nombres de funciones de minimax.py.',
		c3: {
			title: 'Cuánto vale una posición',
			body: ['En las hojas el motor suma el material más un bono por casilla para cada pieza, 10 por dar jaque, infinito por jaque mate y una pequeña recompensa por cada jugada legal que cae en una casilla central.'],
		},
		piecesTitle: 'Valor base de las piezas',
		kingNote: 'El rey vale 9000, así que perderlo pesa más que todo lo demás.',
		squaresTitle: 'Bono de casillas buenas',
		squaresNote: 'Bono por cada jugada legal que cae en la casilla: 1 en las cuatro casillas centrales y 0.5 en el anillo que las rodea.',
		statement: 'Python puro es lento, así que el diseño gira en torno a gastar bien un presupuesto de búsqueda pequeño.',
		decisionsTitle: 'Decisiones',
		decisions: [
			{ decision: 'Búsqueda corta con presupuesto de tiempo', rationale: 'Mantuve la profundidad baja y agregué un límite de tiempo para que el juego responda rápido. El README indica profundidad 2 con un límite de 10 segundos; el código actual busca a profundidad 3.' },
			{ decision: 'Heurísticas escritas a mano', rationale: 'Las tablas y reglas simples son fáciles de leer y ajustar, a cambio de menos fuerza que los motores modernos.' },
			{ decision: 'Una librería para las reglas', rationale: 'python-chess se encarga de las jugadas legales, el jaque y el mate, así el proyecto se pudo enfocar en la búsqueda y la evaluación.' },
		],
		outro: { title: 'Míralo jugar', note: 'Hay un video demo y el código completo en GitHub. El tablero de arriba juega automáticamente. Toma el control con blancas, compara los modos de búsqueda y vuelve al autoplay cuando quieras.' },
	},
} as const

export default function ChessCaseStudy({ lang }: { lang: Lang }) {
	const t = COPY[lang]
	const back = backLink(lang)
	return (
		<Shell>
			<BackLink href={back.href} label={back.label} />
			<Hero title='Chess AI' lede={t.lede} facts={[...t.facts]} links={[...t.links]}>
				<ChessLab lang={lang} />
				<StageCaption>{t.caption}</StageCaption>
			</Hero>

			<Chapter n='01' title={t.c1.title}>
				{t.c1.body.map((p) => (
					<P key={p}>{p}</P>
				))}
			</Chapter>

			<Chapter n='02' title={t.c2.title}>
				{t.c2.body.map((p) => (
					<P key={p}>{p}</P>
				))}
			</Chapter>
			<Stage>
				<AlphaBetaScene lang={lang} />
			</Stage>

			<Statement>{t.statement}</Statement>

			<Chapter n='03' title={t.c3.title}>
				{t.c3.body.map((p) => (
					<P key={p}>{p}</P>
				))}
			</Chapter>
			<Stage>
				<EvalScene lang={lang} pieces={PIECES} piecesTitle={t.piecesTitle} kingNote={t.kingNote} squaresTitle={t.squaresTitle} squaresNote={t.squaresNote} />
			</Stage>

			<Decisions title={t.decisionsTitle} items={[...t.decisions]} />
			<Outro title={t.outro.title} note={t.outro.note} links={[...t.links]} />
		</Shell>
	)
}
