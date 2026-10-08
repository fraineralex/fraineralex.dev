import type { GenericCaseStudyContent } from '@/types/generic-case-study-types'

const back = { label: 'Volver a proyectos', url: '/es/projects' }
const nav = { prevLabel: 'Anterior', nextLabel: 'Siguiente', stepLabel: 'Paso' }

export const es: Record<string, GenericCaseStudyContent> = {
  tracky: {
    slug: 'tracky',
    meta: {
      title: 'Tracky',
      description: 'Cómo construí un tracker fitness minimalista donde registras comidas y ejercicios conversando con un asistente de IA.',
      role: 'Desarrollador único, del diseño al despliegue',
      year: '2024',
      readTime: '5 min de lectura'
    },
    backLink: back,
    hero: {
      summary: 'Tracky es una app web de seguimiento fitness que diseñé y construí por mi cuenta. Se queda con lo esencial (comidas, ejercicios, progreso y metas) y suma un chat con IA que convierte una frase normal en entradas del diario. Es open source, está en tracky.fit y ha tenido más de 100 usuarios activos.',
      technologies: ['TypeScript', 'Next.js 15', 'React 19', 'Server Actions', 'Clerk', 'Drizzle', 'Neon Postgres', 'OpenAI API', 'Vercel AI SDK', 'Cloudflare R2', 'Tailwind', 'shadcn/ui']
    },
    sections: [
      {
        title: '1. El problema',
        paragraphs: [
          'La mayoría de las apps fitness esconden lo básico, registrar una comida o un entrenamiento, debajo de un montón de funciones. Anotar un desayuno no debería costar diez toques entre menús.',
          'Yo quería un tracker que no estorbe: anotas lo que comiste o entrenaste, ves tu avance contra tu meta y sigues con tu día.'
        ]
      },
      {
        title: '2. Registrar conversando',
        paragraphs: [
          'La idea central es el chat con IA en las páginas de Comida y Ejercicio. Describes lo que hiciste con tus palabras, el modelo (vía Vercel AI SDK) lo estructura y la entrada cae en tu diario. El mismo chat también sugiere comidas y rutinas.'
        ],
        interactive: {
          kind: 'stepper',
          title: 'De una frase a una entrada del diario',
          description: 'Recorre cómo un mensaje del chat se convierte en una comida registrada.',
          ...nav,
          steps: [
            { title: 'Escribes', body: 'En el chat de Comida escribes algo como "dos huevos y un guineo de desayuno".' },
            { title: 'Llamada al modelo', body: 'Desde el servidor, el Vercel AI SDK envía el mensaje a la API de OpenAI y pide una salida estructurada.' },
            { title: 'Entrada estructurada', body: 'La respuesta se mapea a los alimentos que Tracky entiende, con sus valores nutricionales.' },
            { title: 'Guardado', body: 'Una Server Action guarda las entradas en Postgres con Drizzle, asociadas al usuario de Clerk.' },
            { title: 'Diario y dashboard', body: 'El diario y las estadísticas se actualizan, y el progreso hacia la meta diaria cambia al momento.' }
          ],
          sampleNote: 'Flujo ilustrativo basado en el README del proyecto. La frase es un ejemplo.'
        }
      },
      {
        title: '3. La app, página por página',
        paragraphs: ['Mantuve la app pequeña a propósito. Cada página tiene un solo trabajo.'],
        interactive: {
          kind: 'options',
          title: 'Páginas de Tracky',
          description: 'Elige una página para ver qué hace. Usa las flechas para moverte entre pestañas.',
          options: [
            { id: 'onboarding', label: 'Onboarding', title: 'Onboarding', body: 'Una configuración paso a paso de metas, preferencias y perfil, para que el dashboard tenga objetivos desde el primer día.' },
            { id: 'dashboard', label: 'Dashboard', title: 'Dashboard', body: 'Un resumen del progreso, estadísticas personales y acceso rápido a lo principal, con gráficas de tendencia.' },
            { id: 'food', label: 'Comida', title: 'Comida', body: 'Registra lo que comes y tus macros, o anota comidas rápido con el chat de IA.' },
            { id: 'exercise', label: 'Ejercicio', title: 'Ejercicio', body: 'Registra entrenamientos con tipo, duración e intensidad, o deja que el chat los agregue.' },
            { id: 'diary', label: 'Diario', title: 'Diario', body: 'Un registro diario de comidas, ejercicios y progreso que puedes buscar y filtrar.' }
          ]
        }
      },
      {
        title: '4. Arquitectura',
        paragraphs: [
          'Arranqué con create-t3-app y pasé al App Router de Next.js 15 con React 19. Las mutaciones van por Server Actions, y Partial Prerendering permite mostrar el esqueleto estático al instante mientras llegan los datos del usuario.'
        ],
        interactive: {
          kind: 'architecture',
          title: 'Cómo se conectan las piezas',
          description: 'Selecciona un nodo para leer su función.',
          hint: 'Basado en el stack que aparece en el README del repositorio.',
          layers: ['Cliente', 'Servidor de la app', 'Servicios y datos'],
          nodes: [
            { id: 'ui', label: 'React 19 + shadcn/ui', layer: 0, detail: 'Tailwind, shadcn/ui y Radix para una interfaz mínima y accesible, con Framer Motion para transiciones pequeñas.' },
            { id: 'next', label: 'Next.js 15 App Router', layer: 1, detail: 'Rutas, Partial Prerendering y Server Actions. Las mutaciones corren en el servidor, sin una API aparte que mantener.' },
            { id: 'ai', label: 'Vercel AI SDK', layer: 1, detail: 'Envuelve las llamadas a la API de OpenAI que mueven el chat de registro y las sugerencias.' },
            { id: 'clerk', label: 'Clerk', layer: 2, detail: 'Autenticación y gestión de usuarios.' },
            { id: 'db', label: 'Drizzle + Neon Postgres', layer: 2, detail: 'Esquema y consultas tipadas con Drizzle sobre Postgres serverless. El repo trae scripts de generate, push y seed.' },
            { id: 'r2', label: 'Cloudflare R2', layer: 2, detail: 'Almacenamiento de objetos para media y archivos estáticos.' }
          ]
        }
      },
      {
        title: '5. Mi responsabilidad',
        paragraphs: [
          'Construí Tracky solo: alcance del producto, UI, modelo de datos, integración con IA, autenticación, CI y despliegue. El repositorio corre un workflow de CI en GitHub Actions y tiene licencia MIT, así que cualquiera puede leer o reutilizar el código.'
        ]
      }
    ],
    tradeOffs: {
      title: 'Decisiones y compromisos',
      items: [
        { decision: 'Server Actions en vez de una API aparte', rationale: 'Tener las mutaciones junto a la UI me ahorró mucho código siendo un proyecto de una persona. El costo es que la lógica queda atada a Next.js.' },
        { decision: 'El chat es un atajo, no la única forma', rationale: 'El chat acelera el registro, pero los formularios siguen ahí para cuando quieres valores exactos.' },
        { decision: 'Menos funciones a propósito', rationale: 'Dejé fuera feeds sociales y gamificación para que la app se enfoque en registrar y ver progreso.' }
      ]
    },
    proof: {
      title: 'Míralo en vivo',
      note: 'Tracky está en beta en tracky.fit y el código completo está en GitHub.',
      links: [{ label: 'tracky.fit', url: 'https://www.tracky.fit' }, { label: 'Repositorio en GitHub', url: 'https://github.com/fraineralex/tracky' }]
    }
  },
  chatify: {
    slug: 'chatify',
    meta: {
      title: 'Chatify',
      description: 'Cómo construí un chat en tiempo real con Socket.io, Auth0 y Turso, con archivos, reacciones y confirmaciones de lectura.',
      role: 'Desarrollador full stack único',
      year: '2024',
      readTime: '5 min de lectura'
    },
    backLink: back,
    hero: {
      summary: 'Chatify es una app de mensajería en tiempo real que construí como proyecto full stack en TypeScript. Soporta chats uno a uno con texto, archivos, imágenes, videos, stickers, GIFs, emojis, reacciones y estado de entrega y lectura. Tiene más de 200 registros.',
      technologies: ['TypeScript', 'React', 'Vite', 'Zustand', 'Dexie', 'Auth0', 'Node.js', 'Express', 'Socket.io', 'Turso', 'AWS EC2', 'S3', 'CloudFront', 'Cloudflare Pages', 'GitHub Actions']
    },
    sections: [
      {
        title: '1. El objetivo',
        paragraphs: [
          'Quería entender qué hace falta para construir una app de mensajería que se sienta como las que usamos todos los días: entrega instantánea, media, confirmaciones de lectura y esas acciones pequeñas que uno espera en un chat.'
        ]
      },
      {
        title: '2. El camino en tiempo real',
        paragraphs: [
          'REST se encarga de cosas como cargar los chats, y Socket.io de la entrega en vivo. Ambos lados se protegen con el mismo JWT de Auth0: express-oauth2-jwt-bearer en las rutas REST y un authSocketMiddleware en las conexiones de socket.'
        ],
        interactive: {
          kind: 'stepper',
          title: 'Sigue un mensaje',
          description: 'Recorre lo que pasa cuando le das a enviar.',
          ...nav,
          steps: [
            { title: 'Auth del socket', body: 'Cuando el cliente se conecta, authSocketMiddleware valida el JWT de Auth0 antes de aceptar cualquier evento.' },
            { title: 'Emite new_message', body: 'El cliente de quien envía emite un evento new_message por Socket.io.' },
            { title: 'Persistencia', body: 'El servidor guarda el mensaje en Turso (libSQL).' },
            { title: 'Difunde chat_message', body: 'El servidor emite chat_message a los clientes conectados de esa conversación.' },
            { title: 'Entregado y leído', body: 'El cliente de quien recibe pinta el mensaje, y el estado de entrega y lectura vuelve para que quien envió vea los checks cambiar.' }
          ],
          sampleNote: 'Los nombres de eventos vienen del README del proyecto.'
        }
      },
      {
        title: '3. Funciones del chat',
        paragraphs: ['Más allá de enviar texto, la mayor parte del trabajo estuvo en los detalles que hacen que un chat se sienta completo.'],
        interactive: {
          kind: 'options',
          title: 'Lo que puedes hacer en un chat',
          description: 'Elige un grupo de funciones. Usa las flechas para moverte entre pestañas.',
          options: [
            { id: 'messages', label: 'Mensajes', title: 'Mensajes completos', body: 'Todo lo que esperas poder compartir.', bullets: ['Texto con enlaces clicables automáticos', 'Imágenes, videos y cualquier tipo de archivo, con vista previa', 'Stickers y GIFs con un selector de Tenor', 'Selector de emojis'] },
            { id: 'context', label: 'Contexto', title: 'Contexto de la conversación', body: 'Formas de mantener clara una conversación.', bullets: ['Responder a un mensaje específico', 'Reaccionar con emojis', 'Estado de lectura y avisos de mensajes sin ver', 'Borrar un mensaje dejando una nota de que se eliminó'] },
            { id: 'actions', label: 'Acciones', title: 'Acciones de chat', body: 'Controles por chat en la barra lateral.', bullets: ['Fijar o desfijar', 'Ocultar o mostrar', 'Silenciar o activar', 'Marcar como leído o no leído', 'Bloquear o desbloquear', 'Vaciar o eliminar'] },
            { id: 'search', label: 'Búsqueda', title: 'Búsqueda y filtros', body: 'Encuentra chats y mensajes con la barra de búsqueda, y ordena lo compartido por archivos, media y más.' }
          ]
        }
      },
      {
        title: '4. Arquitectura e infraestructura',
        paragraphs: [
          'El repo es un workspace de pnpm con un cliente React y una API en Node.js. El cliente está en Cloudflare Pages y la API corre en AWS EC2 con PM2, desplegada por un pipeline de GitHub Actions.'
        ],
        interactive: {
          kind: 'architecture',
          title: 'Arquitectura de Chatify',
          description: 'Selecciona un nodo para leer su función.',
          hint: 'Basado en la sección de arquitectura del README del repositorio.',
          layers: ['Cliente', 'API', 'Datos e infraestructura'],
          nodes: [
            { id: 'client', label: 'React + Vite', layer: 0, detail: 'La SPA, con Zustand para el estado y Dexie para almacenamiento local en el navegador. Alojada en Cloudflare Pages.' },
            { id: 'auth0', label: 'Auth0', layer: 0, detail: 'Inicio de sesión con Google, GitHub o correo y contraseña. El JWT protege tanto REST como sockets.' },
            { id: 'express', label: 'API REST con Express', layer: 1, detail: 'Rutas protegidas con express-oauth2-jwt-bearer.' },
            { id: 'socket', label: 'Socket.io', layer: 1, detail: 'Eventos en tiempo real (entra new_message, sale chat_message), autenticados con authSocketMiddleware.' },
            { id: 'turso', label: 'Turso (libSQL)', layer: 2, detail: 'Guarda usuarios, chats y mensajes.' },
            { id: 's3', label: 'S3 + CloudFront', layer: 2, detail: 'Los archivos pasan por la API hacia S3, con URLs firmadas de CloudFront opcionales para servirlos.' },
            { id: 'ec2', label: 'EC2 + PM2', layer: 2, detail: 'Corre la API. Un pipeline de GitHub Actions la despliega, y un workflow de CI corre lint, typecheck y tests.' }
          ]
        }
      },
      {
        title: '5. Mi responsabilidad',
        paragraphs: [
          'Lo construí completo: cliente, API, capa en tiempo real, modelo de datos, manejo de archivos, CI y el pipeline de despliegue a EC2. El repo incluye tests del límite de autenticación, del manejador de mensajes y de utilidades del cliente.'
        ]
      }
    ],
    tradeOffs: {
      title: 'Decisiones y compromisos',
      items: [
        { decision: 'Socket.io en un servidor siempre encendido', rationale: 'Las conexiones en tiempo real necesitan un proceso que se mantenga arriba, por eso la API corre en EC2 con PM2 y no en funciones serverless.' },
        { decision: 'Archivos en S3 y no en la base de datos', rationale: 'Los archivos van a almacenamiento de objetos y en Turso solo quedan las referencias, así la base de datos se mantiene liviana.' },
        { decision: 'Un solo modelo de auth para REST y sockets', rationale: 'Reusar el JWT de Auth0 en ambos caminos deja un solo lugar para decidir quién puede hacer qué.' }
      ]
    },
    proof: {
      title: 'Pruébalo',
      note: 'Chatify está en vivo y el código está en GitHub con licencia MIT.',
      links: [{ label: 'chatify.fraineralex.dev', url: 'https://chatify.fraineralex.dev' }, { label: 'Repositorio en GitHub', url: 'https://github.com/fraineralex/chatify' }]
    }
  },
  'chess-ai': {
    slug: 'chess-ai',
    meta: {
      title: 'Chess AI',
      description: 'Cómo construí un motor de ajedrez en Python con minimax, poda alfa-beta y heurísticas propias.',
      role: 'Desarrollador único',
      year: '2022',
      readTime: '4 min de lectura'
    },
    backLink: back,
    hero: {
      summary: 'Chess AI es un juego de ajedrez de escritorio donde juegas contra un motor que escribí en Python. Busca con minimax y poda alfa-beta bajo un límite de tiempo, y evalúa posiciones con material, tablas por casilla y algunas heurísticas extra.',
      technologies: ['Python', 'python-chess', 'NumPy', 'Pygame']
    },
    sections: [
      {
        title: '1. La idea',
        paragraphs: [
          'Quería entender la búsqueda adversarial construyéndola, no solo leyendo sobre ella. python-chess se encarga de las reglas y los movimientos legales, Pygame dibuja el tablero y la toma de decisiones es mía.'
        ]
      },
      {
        title: '2. Buscar con minimax y alfa-beta',
        paragraphs: [
          'El motor mira un número fijo de jugadas hacia adelante y asume que el rival siempre responde con su mejor jugada. La poda alfa-beta se salta ramas que no pueden cambiar la decisión final, así la misma profundidad cuesta menos evaluaciones.',
          'La búsqueda también vigila el reloj. Si se acaba el tiempo, devuelve la mejor jugada encontrada hasta ese momento en vez de congelar el juego. El README documenta una profundidad por defecto de 2 con un límite de 10 segundos.'
        ],
        interactive: {
          kind: 'minimax',
          title: 'Alfa-beta en un árbol pequeño',
          description: 'Un árbol de juguete de dos niveles, no una posición real. Recorre la búsqueda y compara cuántas hojas se evalúan con y sin poda.',
          pruningOn: 'Con poda',
          pruningOff: 'Sin poda',
          visitedLabel: 'Hojas evaluadas',
          prunedLabel: 'Podadas',
          bestLabel: 'Mejor valor',
          prevLabel: 'Anterior',
          nextLabel: 'Siguiente',
          resetLabel: 'Reiniciar',
          stepLabel: 'Paso',
          maxLabel: 'MAX',
          minLabel: 'MIN'
        }
      },
      {
        title: '3. Evaluar una posición',
        paragraphs: [
          'En las hojas, el motor suma varias señales: material con un bono por casilla para cada tipo de pieza, un bono o penalización por dar jaque, puntuación infinita para el jaque mate y una pequeña recompensa por movimientos legales que caen en casillas centrales.'
        ],
        interactive: {
          kind: 'heuristics',
          title: 'Los números reales del código',
          description: 'Valores base de minimax.py y el mapa de bonos por casillas centrales. Selecciona una casilla para leer su bono.',
          piecesLabel: 'Valor base por pieza',
          squaresLabel: 'Bono por casillas buenas',
          pieces: [
            { name: 'Peón', value: 10 },
            { name: 'Caballo', value: 30 },
            { name: 'Alfil', value: 30 },
            { name: 'Torre', value: 50 },
            { name: 'Dama', value: 90 },
            { name: 'Rey', value: 9000 }
          ],
          squareNote: 'Cada pieza también recibe un bono de su tabla por casilla entre -5 y +6. Dar jaque suma 10 y el jaque mate vale infinito.'
        }
      },
      {
        title: '4. Mi responsabilidad',
        paragraphs: [
          'Escribí la búsqueda, la evaluación y el bucle del juego. Puedes presionar t para cambiar el tema del tablero (verde, marrón, azul, gris) y r para reiniciar.'
        ]
      }
    ],
    tradeOffs: {
      title: 'Decisiones y compromisos',
      items: [
        { decision: 'Búsqueda poco profunda con presupuesto de tiempo', rationale: 'Python puro es lento, así que mantuve la profundidad baja y agregué un límite de tiempo para que el juego responda rápido.' },
        { decision: 'Heurísticas escritas a mano', rationale: 'Tablas y reglas simples son fáciles de leer y ajustar, a costa de fuerza frente a motores modernos.' }
      ]
    },
    proof: {
      title: 'Míralo jugar',
      note: 'Hay un video de demo y el código completo en GitHub.',
      links: [
        { label: 'Video de demo', url: 'https://user-images.githubusercontent.com/89224196/216224624-7c3c1718-6f93-4592-8720-afc9e4b2dc11.mp4' },
        { label: 'Repositorio en GitHub', url: 'https://github.com/fraineralex/ChessAI' }
      ]
    }
  },
  sargotech: {
    slug: 'sargotech',
    meta: {
      title: 'SargoTech',
      description: 'Un proyecto en equipo para anticipar el sargazo en las playas del Caribe con datos satelitales y operación local. Soy el CTO y desarrollador principal.',
      role: 'CTO y Lead Developer, equipo de 4 cofundadores',
      year: '2026',
      readTime: '4 min de lectura'
    },
    backLink: back,
    hero: {
      summary: 'SargoTech es tecnología costera liderada desde República Dominicana para enfrentar el sargazo en el Caribe. Conecta la observación del mar con las personas que pueden actuar: hoteles, municipios y equipos de campo. Somos cuatro cofundadores y yo lidero la parte tecnológica como CTO y desarrollador principal.',
      technologies: ['React', 'TypeScript', 'MapLibre GL', 'Node.js']
    },
    sections: [
      {
        title: '1. Contexto',
        paragraphs: [
          'Cuando ves el sargazo en la arena, el impacto ya llegó. La respuesta tiene que empezar antes, mar adentro, con tiempo suficiente para contenerlo, recolectarlo y disponer de él como se debe.',
          'La visión es convertir datos satelitales, logística local y trazabilidad ambiental en playas más limpias y un turismo más resiliente.'
        ]
      },
      {
        title: '2. El semáforo costero',
        paragraphs: [
          'El sitio público incluye un mapa interactivo de playas dominicanas donde cada playa tiene un estado de semáforo.'
        ],
        interactive: {
          kind: 'options',
          title: 'Qué significa cada estado',
          description: 'Elige un estado. Usa las flechas para moverte entre pestañas.',
          options: [
            { id: 'red', label: 'Rojo', tone: 'red', title: 'Impacto probable', body: 'Se espera que el sargazo llegue a esta playa. Toca activar contención y recolección.' },
            { id: 'amber', label: 'Amarillo', tone: 'amber', title: 'Sargazo próximo', body: 'El sargazo se acerca. Buen momento para planificar y verificar en campo.' },
            { id: 'green', label: 'Verde', tone: 'green', title: 'Sin alerta cercana', body: 'Ahora mismo no hay alerta de sargazo cerca de esta playa.' }
          ],
          sampleNote: 'Etiquetas tomadas del mapa público de sargotech.com. Los conteos en vivo cambian con los datos, por eso no los cito aquí.'
        }
      },
      {
        title: '3. Del pronóstico al destino final',
        paragraphs: ['SargoTech organiza el trabajo en cuatro pasos, y la plataforma busca conectarlos todos.'],
        interactive: {
          kind: 'stepper',
          title: 'Los cuatro pasos',
          description: 'Recorre el flujo que describe el sitio.',
          ...nav,
          steps: [
            { title: 'Predecir', body: 'Estimar la trayectoria y la ventana de llegada a partir de la lectura satelital y las condiciones del mar.' },
            { title: 'Contener', body: 'Barreras antisargazo, con inspecciones para revisar la contención.' },
            { title: 'Recolectar', body: 'Coordinar la recolección en la playa, con validación en campo.' },
            { title: 'Gestionar la disposición', body: 'Traslado coordinado hasta el destino final, con trazabilidad.' }
          ],
          sampleNote: 'El sitio presenta esto como un flujo ilustrativo.'
        }
      },
      {
        title: '4. Para quién es',
        paragraphs: ['La misma información sirve a personas distintas, cada una con un trabajo diferente.'],
        interactive: {
          kind: 'options',
          title: 'Audiencias',
          description: 'Elige una audiencia.',
          options: [
            { id: 'hotels', label: 'Hoteles y resorts', title: 'Anticipar y planificar', body: 'Saber con tiempo lo que viene hacia su frente de playa y planificar la respuesta.' },
            { id: 'municipalities', label: 'Municipios', title: 'Priorizar y coordinar', body: 'Decidir qué playas necesitan atención primero y coordinar recursos.' },
            { id: 'scouts', label: 'Scouts y proveedores', title: 'Verificar y responder', body: 'Validar las condiciones en campo y ejecutar el servicio.' }
          ]
        }
      },
      {
        title: '5. Mi parte',
        paragraphs: [
          'SargoTech es un trabajo en equipo. Enmanuel Santos es CEO y Product Lead, Christopher Marrero es ingeniero de software, Martha Espinal lleva operaciones y alianzas, y yo soy el CTO y desarrollador principal, a cargo de la tecnología y de liderar el desarrollo de la plataforma.',
          'El producto sigue evolucionando, así que en esta página me limito a lo que ya es público en el sitio.'
        ]
      }
    ],
    tradeOffs: {
      title: 'Decisiones hasta ahora',
      items: [
      ]
    },
    proof: {
      title: 'Visita SargoTech',
      note: 'El sitio incluye el mapa costero en vivo.',
      links: [{ label: 'sargotech.com', url: 'https://sargotech.com' }]
    }
  }
}
