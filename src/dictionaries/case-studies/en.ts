import type { GenericCaseStudyContent } from '@/types/generic-case-study-types'

const back = { label: 'Back to projects', url: '/projects' }
const nav = { prevLabel: 'Previous', nextLabel: 'Next', stepLabel: 'Step' }

export const en: Record<string, GenericCaseStudyContent> = {
  tracky: {
    slug: 'tracky',
    meta: {
      title: 'Tracky',
      description: 'How I built a minimalist fitness tracker where meals and workouts can be logged by chatting with an AI assistant.',
      role: 'Solo developer, design to deployment',
      year: '2024',
      readTime: '5 min read'
    },
    backLink: back,
    hero: {
      summary: 'Tracky is a fitness tracking web app I designed and built on my own. It keeps the essentials (meals, workouts, progress and goals) and adds an AI chat that turns a plain sentence into diary entries. It is open source and live at tracky.fit, where it has served 100+ active users.',
      technologies: ['TypeScript', 'Next.js 15', 'React 19', 'Server Actions', 'Clerk', 'Drizzle', 'Neon Postgres', 'OpenAI API', 'Vercel AI SDK', 'Cloudflare R2', 'Tailwind', 'shadcn/ui']
    },
    sections: [
      {
        title: '1. The problem',
        paragraphs: [
          'Most fitness apps bury simple meal and workout logging under feature bloat. Logging a breakfast should not take ten taps through menus.',
          'I wanted a tracker that stays out of the way: log what you ate or trained, see your progress against your goal, and move on.'
        ]
      },
      {
        title: '2. Logging by chat',
        paragraphs: [
          'The core idea is the AI chat on the Food and Exercise pages. You describe what you did in your own words, the model, called through the Vercel AI SDK, structures it, and the entry lands in your diary. The same chat can also suggest meals and workouts.'
        ],
        interactive: {
          kind: 'stepper',
          title: 'From a sentence to a diary entry',
          description: 'Step through how a chat message becomes a logged meal.',
          ...nav,
          steps: [
            { title: 'You type', body: 'In the Food page chat you write something like "two eggs and a banana for breakfast".' },
            { title: 'Model call', body: 'A server side call through the Vercel AI SDK sends the message to the OpenAI API and asks for structured output.' },
            { title: 'Structured entry', body: 'The reply is mapped to the food entries Tracky understands, with their nutrition values.' },
            { title: 'Saved', body: 'A Server Action writes the entries to Postgres through Drizzle, scoped to the signed in Clerk user.' },
            { title: 'Diary and dashboard', body: 'The diary and the dashboard stats refresh, so progress toward the daily goal updates right away.' }
          ],
          sampleNote: 'Illustrative flow based on the project README. The example phrase is a sample.'
        }
      },
      {
        title: '3. The app, page by page',
        paragraphs: ['I kept the surface small on purpose. Each page has one job.'],
        interactive: {
          kind: 'options',
          title: 'Tracky pages',
          description: 'Pick a page to see what it does. Use the arrow keys to move between tabs.',
          options: [
            { id: 'onboarding', label: 'Onboarding', title: 'Onboarding', body: 'A step by step setup for fitness goals, preferences and profile, so the dashboard has targets from day one.' },
            { id: 'dashboard', label: 'Dashboard', title: 'Dashboard', body: 'An overview of progress, personal stats and quick access to the main actions, with charts for trends.' },
            { id: 'food', label: 'Food', title: 'Food', body: 'Track food intake and macros, and log meals quickly through the AI chat.' },
            { id: 'exercise', label: 'Exercise', title: 'Exercise', body: 'Log workouts with type, duration and intensity, or let the chat add them for you.' },
            { id: 'diary', label: 'Diary', title: 'Diary', body: 'A daily log of meals, exercises and progress you can search and filter, to keep yourself accountable.' }
          ]
        }
      },
      {
        title: '4. Architecture',
        paragraphs: [
          'I started from create-t3-app and moved to the Next.js 15 App Router with React 19. Mutations go through Server Actions, and Partial Prerendering lets static shells render instantly while user data streams in.'
        ],
        interactive: {
          kind: 'architecture',
          title: 'How the pieces connect',
          description: 'Select a node to read its role.',
          hint: 'Based on the stack listed in the repository README.',
          layers: ['Client', 'App server', 'Services and data'],
          nodes: [
            { id: 'ui', label: 'React 19 + shadcn/ui', layer: 0, detail: 'Tailwind, shadcn/ui and Radix primitives for a minimal, accessible interface, with Framer Motion for small transitions.' },
            { id: 'next', label: 'Next.js 15 App Router', layer: 1, detail: 'Routes, Partial Prerendering and Server Actions. Mutations run on the server, so there is no separate API to maintain.' },
            { id: 'ai', label: 'Vercel AI SDK', layer: 1, detail: 'Wraps the OpenAI API calls that power the logging chat and the suggestions.' },
            { id: 'clerk', label: 'Clerk', layer: 2, detail: 'Authentication and user management.' },
            { id: 'db', label: 'Drizzle + Neon Postgres', layer: 2, detail: 'Typed schema and queries with Drizzle on serverless Postgres. The repo includes generate, push and seed scripts.' },
            { id: 'r2', label: 'Cloudflare R2', layer: 2, detail: 'Object storage for media and static assets.' }
          ]
        }
      },
      {
        title: '5. My responsibility',
        paragraphs: [
          'I built Tracky alone: product scope, UI, data model, AI integration, auth, CI and deployment. The repository runs a CI workflow on GitHub Actions and the project is MIT licensed, so anyone can read or reuse the code.'
        ]
      }
    ],
    tradeOffs: {
      title: 'Trade-offs',
      items: [
        { decision: 'Server Actions instead of a separate API', rationale: 'Keeping mutations next to the UI cut boilerplate for a solo project. The cost is that the logic is tied to Next.js.' },
        { decision: 'Chat as a shortcut, not the only input', rationale: 'The AI chat speeds up logging, but regular forms are still there for when you want exact values.' },
        { decision: 'Fewer features on purpose', rationale: 'I left out social feeds and gamification to keep the app focused on logging and progress.' }
      ]
    },
    proof: {
      title: 'See it live',
      note: 'Tracky is in beta at tracky.fit and the full source is on GitHub.',
      links: [{ label: 'tracky.fit', url: 'https://www.tracky.fit' }, { label: 'GitHub repository', url: 'https://github.com/fraineralex/tracky' }]
    }
  },
  chatify: {
    slug: 'chatify',
    meta: {
      title: 'Chatify',
      description: 'How I built a realtime chat app with Socket.io, Auth0 and Turso, with media sharing, reactions and read receipts.',
      role: 'Solo full stack developer',
      year: '2024',
      readTime: '5 min read'
    },
    backLink: back,
    hero: {
      summary: 'Chatify is a realtime messaging app I built as a full stack TypeScript project. It supports one to one chats with text, files, images, videos, stickers, GIFs, emojis, reactions and read or delivery status. It has 200+ sign ups.',
      technologies: ['TypeScript', 'React', 'Vite', 'Zustand', 'Dexie', 'Auth0', 'Node.js', 'Express', 'Socket.io', 'Turso', 'AWS EC2', 'S3', 'CloudFront', 'Cloudflare Pages', 'GitHub Actions']
    },
    sections: [
      {
        title: '1. Goal',
        paragraphs: [
          'I wanted to understand what it takes to build a messaging product that feels like the ones people use every day: instant delivery, rich media, read receipts and the small chat actions you expect.'
        ]
      },
      {
        title: '2. The realtime path',
        paragraphs: [
          'REST handles things like loading chats, and Socket.io handles live delivery. Both sides are protected by the same Auth0 JWT: express-oauth2-jwt-bearer on REST routes and an authSocketMiddleware on socket connections.'
        ],
        interactive: {
          kind: 'stepper',
          title: 'Follow one message',
          description: 'Step through what happens when you hit send.',
          ...nav,
          steps: [
            { title: 'Socket auth', body: 'When the client connects, authSocketMiddleware validates the Auth0 JWT before any event is accepted.' },
            { title: 'Emit new_message', body: 'The sender\'s client emits a new_message event over Socket.io.' },
            { title: 'Persist', body: 'The server stores the message in Turso (libSQL).' },
            { title: 'Broadcast chat_message', body: 'The server broadcasts a chat_message event to the connected clients in that conversation.' },
            { title: 'Delivered and read', body: 'The recipient\'s client renders the message, and delivery and read status flow back so the sender sees the ticks change.' }
          ],
          sampleNote: 'Event names come from the project README.'
        }
      },
      {
        title: '3. Chat features',
        paragraphs: ['Beyond sending text, most of the work went into the details that make a chat app feel complete.'],
        interactive: {
          kind: 'options',
          title: 'What you can do in a chat',
          description: 'Pick a group of features. Use the arrow keys to move between tabs.',
          options: [
            { id: 'messages', label: 'Messages', title: 'Rich messages', body: 'Everything you would expect to share.', bullets: ['Text with automatic clickable links', 'Images, videos and any file type, with in chat previews', 'Stickers and GIFs through a Tenor powered picker', 'Emoji picker'] },
            { id: 'context', label: 'Context', title: 'Conversation context', body: 'Ways to keep a conversation clear.', bullets: ['Reply to a specific message', 'React to messages with emojis', 'Read status and notifications for unseen messages', 'Delete a message, leaving a note that it was removed'] },
            { id: 'actions', label: 'Chat actions', title: 'Chat actions', body: 'Per chat controls in the sidebar.', bullets: ['Pin or unpin', 'Hide or unhide', 'Mute or unmute', 'Mark as read or unread', 'Block or unblock', 'Clear or delete'] },
            { id: 'search', label: 'Search', title: 'Search and filters', body: 'Find chats and messages with the search bar, and sort shared content by files, media and more.' }
          ]
        }
      },
      {
        title: '4. Architecture and infrastructure',
        paragraphs: [
          'The repo is a pnpm workspace with a React client and a Node.js API. The client is deployed on Cloudflare Pages and the API runs on AWS EC2 with PM2, deployed by a GitHub Actions pipeline.'
        ],
        interactive: {
          kind: 'architecture',
          title: 'Chatify architecture',
          description: 'Select a node to read its role.',
          hint: 'Based on the architecture section of the repository README.',
          layers: ['Client', 'API', 'Data and infrastructure'],
          nodes: [
            { id: 'client', label: 'React + Vite', layer: 0, detail: 'The SPA, with Zustand for state and Dexie for local browser storage. Hosted on Cloudflare Pages.' },
            { id: 'auth0', label: 'Auth0', layer: 0, detail: 'Sign in with Google, GitHub or email and password. The issued JWT protects both REST and sockets.' },
            { id: 'express', label: 'Express REST API', layer: 1, detail: 'Routes guarded with express-oauth2-jwt-bearer.' },
            { id: 'socket', label: 'Socket.io', layer: 1, detail: 'Realtime events (new_message in, chat_message out), authenticated by authSocketMiddleware.' },
            { id: 'turso', label: 'Turso (libSQL)', layer: 2, detail: 'Stores users, chats and messages.' },
            { id: 's3', label: 'S3 + CloudFront', layer: 2, detail: 'Media uploads go through the API to S3, with optional CloudFront signed URLs for delivery.' },
            { id: 'ec2', label: 'EC2 + PM2', layer: 2, detail: 'Runs the API. A GitHub Actions pipeline deploys it, and a CI workflow runs lint, typecheck and tests.' }
          ]
        }
      },
      {
        title: '5. My responsibility',
        paragraphs: [
          'I built the whole thing: client, API, realtime layer, data model, media pipeline, CI and the EC2 deployment pipeline. The repo includes tests for the auth boundary, the message handler and client utilities.'
        ]
      }
    ],
    tradeOffs: {
      title: 'Trade-offs',
      items: [
        { decision: 'Socket.io on a long running server', rationale: 'Realtime connections need a process that stays up, so the API runs on EC2 with PM2 instead of serverless functions.' },
        { decision: 'Media through S3 instead of the database', rationale: 'Files go to object storage and only references live in Turso, which keeps the database small.' },
        { decision: 'One auth model for REST and sockets', rationale: 'Reusing the Auth0 JWT on both paths means one place to reason about who is allowed to do what.' }
      ]
    },
    proof: {
      title: 'Try it',
      note: 'Chatify is live and the source is on GitHub under the MIT license.',
      links: [{ label: 'chatify.fraineralex.dev', url: 'https://chatify.fraineralex.dev' }, { label: 'GitHub repository', url: 'https://github.com/fraineralex/chatify' }]
    }
  },
  'chess-ai': {
    slug: 'chess-ai',
    meta: {
      title: 'Chess AI',
      description: 'How I built a chess engine in Python with minimax, alpha-beta pruning and hand written heuristics.',
      role: 'Solo developer',
      year: '2022',
      readTime: '4 min read'
    },
    backLink: back,
    hero: {
      summary: 'Chess AI is a desktop chess game where you play against an engine I wrote in Python. It searches with minimax and alpha-beta pruning under a time limit, and scores positions with material, piece square tables and a few extra heuristics.',
      technologies: ['Python', 'python-chess', 'NumPy', 'Pygame']
    },
    sections: [
      {
        title: '1. The idea',
        paragraphs: [
          'I wanted to understand adversarial search by building it, not just reading about it. python-chess handles the rules and legal moves, Pygame draws the board, and the decision making is mine.'
        ]
      },
      {
        title: '2. Searching with minimax and alpha-beta',
        paragraphs: [
          'The engine looks a fixed number of moves ahead and assumes the opponent always plays its best reply. Alpha-beta pruning skips branches that cannot change the final decision, so the same depth costs fewer evaluations.',
          'The search also checks the clock. When the time limit runs out, it returns the best move found so far instead of freezing the game. The README documents a default depth of 2 with a 10 second limit.'
        ],
        interactive: {
          kind: 'minimax',
          title: 'Alpha-beta on a tiny tree',
          description: 'A toy two level tree, not a real position. Step through the search and compare how many leaves get evaluated with and without pruning.',
          pruningOn: 'Pruning on',
          pruningOff: 'Pruning off',
          visitedLabel: 'Leaves evaluated',
          prunedLabel: 'Pruned',
          bestLabel: 'Best value',
          prevLabel: 'Previous',
          nextLabel: 'Next',
          resetLabel: 'Reset',
          stepLabel: 'Step',
          maxLabel: 'MAX',
          minLabel: 'MIN'
        }
      },
      {
        title: '3. Scoring a position',
        paragraphs: [
          'At the leaves, the engine adds up several signals: material with a per square bonus for each piece type, a bonus or penalty for giving check, infinite scores for checkmate, and a small reward for legal moves that land on central squares.'
        ],
        interactive: {
          kind: 'heuristics',
          title: 'The real numbers from the code',
          description: 'Base values from minimax.py, plus the central squares bonus map. Select a square to read its bonus.',
          piecesLabel: 'Base piece values',
          squaresLabel: 'Good squares bonus',
          pieces: [
            { name: 'Pawn', value: 10 },
            { name: 'Knight', value: 30 },
            { name: 'Bishop', value: 30 },
            { name: 'Rook', value: 50 },
            { name: 'Queen', value: 90 },
            { name: 'King', value: 9000 }
          ],
          squareNote: 'Each piece also gets a piece square table bonus between -5 and +6. Giving check adds 10 and checkmate is scored as infinity.'
        }
      },
      {
        title: '4. My responsibility',
        paragraphs: [
          'I wrote the search, the evaluation and the game loop. You can press t to switch board themes (green, brown, blue, gray) and r to restart.'
        ]
      }
    ],
    tradeOffs: {
      title: 'Trade-offs',
      items: [
        { decision: 'Shallow search with a time budget', rationale: 'Pure Python is slow, so I kept the depth low and added a time limit to keep the game responsive.' },
        { decision: 'Hand written heuristics', rationale: 'Simple tables and rules are easy to read and tune, at the cost of strength compared to modern engines.' }
      ]
    },
    proof: {
      title: 'See it play',
      note: 'There is a demo video and the full source on GitHub.',
      links: [
        { label: 'Demo video', url: 'https://user-images.githubusercontent.com/89224196/216224624-7c3c1718-6f93-4592-8720-afc9e4b2dc11.mp4' },
        { label: 'GitHub repository', url: 'https://github.com/fraineralex/ChessAI' }
      ]
    }
  },
  sargotech: {
    slug: 'sargotech',
    meta: {
      title: 'SargoTech',
      description: 'A team project to anticipate sargassum on Caribbean beaches with satellite data and local operations. I am the CTO and lead developer.',
      role: 'CTO & Lead Developer, team of 4 co-founders',
      year: '2026',
      readTime: '4 min read'
    },
    backLink: back,
    hero: {
      summary: 'SargoTech is coastal technology led from the Dominican Republic to fight sargassum in the Caribbean. It connects ocean observation with the people who can act: hotels, municipalities and field teams. We are four co-founders, and I lead the technology as CTO and lead developer.',
      technologies: ['React', 'TypeScript', 'MapLibre GL', 'Node.js']
    },
    sections: [
      {
        title: '1. Context',
        paragraphs: [
          'When you see sargassum on the sand, the impact has already arrived. The response has to start earlier, out at sea, with enough notice to contain it, collect it and dispose of it properly.',
          'The vision is to turn satellite data, local logistics and environmental traceability into cleaner beaches and more resilient tourism.'
        ]
      },
      {
        title: '2. The coastal traffic light',
        paragraphs: [
          'The public site includes an interactive map of Dominican beaches where each beach gets a traffic light status.'
        ],
        interactive: {
          kind: 'options',
          title: 'What each status means',
          description: 'Pick a status. Use the arrow keys to move between tabs.',
          options: [
            { id: 'red', label: 'Red', tone: 'red', title: 'Likely impact', body: 'Sargassum is expected to reach this beach. Time to activate containment and collection.' },
            { id: 'amber', label: 'Yellow', tone: 'amber', title: 'Sargassum nearby', body: 'Sargassum is approaching. A good moment to plan and verify in the field.' },
            { id: 'green', label: 'Green', tone: 'green', title: 'No nearby alert', body: 'No sargassum alert close to this beach right now.' }
          ],
          sampleNote: 'Labels from the public map on sargotech.com. Live counts change with the data, so I do not quote them here.'
        }
      },
      {
        title: '3. From forecast to final destination',
        paragraphs: ['SargoTech frames the work as four steps, and the platform is meant to connect all of them.'],
        interactive: {
          kind: 'stepper',
          title: 'The four steps',
          description: 'Step through the flow described on the site.',
          ...nav,
          steps: [
            { title: 'Predict', body: 'Estimate the trajectory and the arrival window from satellite readings and sea conditions.' },
            { title: 'Contain', body: 'Anti sargassum barriers, with inspections to check the containment.' },
            { title: 'Collect', body: 'Coordinate collection on the beach, with validation in the field.' },
            { title: 'Manage disposal', body: 'Coordinated transport to the final destination, with traceability.' }
          ],
          sampleNote: 'The site labels this as an illustrative flow.'
        }
      },
      {
        title: '4. Who it is for',
        paragraphs: ['The same information serves different people, each with a different job to do.'],
        interactive: {
          kind: 'options',
          title: 'Audiences',
          description: 'Pick an audience.',
          options: [
            { id: 'hotels', label: 'Hotels & resorts', title: 'Anticipate and plan', body: 'Know ahead of time what is coming to the beachfront and plan the response.' },
            { id: 'municipalities', label: 'Municipalities', title: 'Prioritize and coordinate', body: 'Decide which beaches need attention first and coordinate resources.' },
            { id: 'scouts', label: 'Scouts & providers', title: 'Verify and respond', body: 'Validate conditions in the field and carry out the service.' }
          ]
        }
      },
      {
        title: '5. My part',
        paragraphs: [
          'SargoTech is a team effort. Enmanuel Santos is CEO and product lead, Christopher Marrero is a software engineer, Martha Espinal leads operations and partnerships, and I am the CTO and lead developer, responsible for the technology and leading development of the platform.',
          'The product is still evolving, so I am keeping this page to what is public on the site.'
        ]
      }
    ],
    tradeOffs: {
      title: 'Decisions so far',
      items: [
      ]
    },
    proof: {
      title: 'Visit SargoTech',
      note: 'The site is in Spanish and includes the live coastal map.',
      links: [{ label: 'sargotech.com', url: 'https://sargotech.com' }]
    }
  }
}
