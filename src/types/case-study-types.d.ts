export interface CaseStudySection {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export interface CaseStudyTradeOff {
  decision: string
  rationale: string
}

export interface CaseStudyRelatedLink {
  label: string
  url: string
}

export interface CaseStudyProof {
  demoLabel: string
  appLabel: string
  appDescription: string
  demoUrl: string
  screenshotAlt: string
  note: string
  relatedLinks?: CaseStudyRelatedLink[]
}

export interface ViolletControlsCopy {
  play: string
  pause: string
  previous: string
  next: string
  replay: string
  step: string
  of: string
}

export interface ViolletAppCopy {
  frameLabel: string
  url: string
  simulationNote: string
  signedIn: string
  userName: string
  userEmail: string
  userAlt: string
  navLabel: string
  overview: string
  tracking: string
  product: string
  version: string
  tabs: {
    dashboard: string
    expenses: string
    budgets: string
    inbox: string
  }
  period: string
  income: string
  expenses: string
  net: string
  vsLast: string
  categories: string
  recent: string
  budgetsTitle: string
  inboxTitle: string
  over: string
  remaining: string
  filterLabel: string
  allCategories: string
  parsed: string
  ignored: string
  closeDetail: string
  merchant: string
  amount: string
  category: string
  account: string
  origin: string
  originEmail: string
  emptyFilter: string
  categoryNames: {
    housing: string
    supermarkets: string
    bills: string
    transportation: string
    food: string
    subscriptions: string
    shopping: string
    education: string
    services: string
  }
  budgetNames: {
    transportation: string
    bills: string
    subscriptions: string
    shopping: string
    education: string
  }
  mail: {
    bravoSubject: string
    bravoSnippet: string
    uberSubject: string
    uberSnippet: string
    claroSubject: string
    claroSnippet: string
    noiseFrom: string
    noiseEmail: string
    noiseSubject: string
    noiseSnippet: string
    noiseReason: string
  }
}

export interface ViolletInboxMessage {
  id: string
  from: string
  email: string
  subject: string
  snippet: string
  kind: string
  verdict: string
  detail: string
}

export interface ViolletInboxCopy {
  title: string
  description: string
  listLabel: string
  alert: string
  noise: string
  prompt: string
  messages: ViolletInboxMessage[]
}

export interface ViolletAccessCopy {
  title: string
  description: string
  authorized: string
  confirmed: string
  listed: string
  passwordLabel: string
  passwordNote: string
  scope: string
  scopeDetail: string
  review: string
  bankLogin: string
  bankRefusal: string
  grantReady: string
  noneSelected: string
  summaryLabel: string
}

export interface ViolletOwnershipItem {
  id: string
  title: string
  summary: string
  owned: string
  deferred: string
}

export interface ViolletOwnershipCopy {
  title: string
  description: string
  listLabel: string
  ownedLabel: string
  deferredLabel: string
  prompt: string
  items: ViolletOwnershipItem[]
}

export interface ViolletArchitectureNode {
  id: string
  kicker: string
  name: string
  summary: string
}

export interface ViolletArchitectureCopy {
  title: string
  description: string
  diagramLabel: string
  talksTo: string
  pinned: string
  nodes: ViolletArchitectureNode[]
}

export interface ViolletParseStep {
  id: string
  title: string
  body: string
}

export interface ViolletParseCopy {
  title: string
  description: string
  fromLabel: string
  subjectLabel: string
  cleanedLabel: string
  rawLabel: string
  disclaimer: string
  ledgerLabel: string
  waiting: string
  merchant: string
  amount: string
  account: string
  typeLabel: string
  typeValue: string
  category: string
  categoryValue: string
  confidence: string
  confidenceValue: string
  source: string
  sourceValue: string
  stored: string
  steps: ViolletParseStep[]
}

export interface ViolletBanksCopy {
  title: string
  description: string
  searchLabel: string
  searchPlaceholder: string
  filtersLabel: string
  all: string
  confirmed: string
  listed: string
  empty: string
  sender: string
  tracksCards: string
  tracksAccounts: string
  transfers: string
  yes: string
  confirmedHelp: string
  listedHelp: string
  prompt: string
}

export interface ViolletChatAnswer {
  id: string
  prompt: string
  keywords: string[]
  tool: string
  args: string
  result: string
  reply: string
}

export interface ViolletChatCopy {
  title: string
  description: string
  suggestionsLabel: string
  transcriptLabel: string
  placeholder: string
  send: string
  you: string
  assistant: string
  tool: string
  result: string
  unknown: string
  thinking: string
  answers: ViolletChatAnswer[]
}

export interface ViolletSyncCopy {
  title: string
  description: string
  actionsLabel: string
  connect: string
  watch: string
  push: string
  replay: string
  reset: string
  logLabel: string
  stateLabel: string
  states: {
    idle: string
    connected: string
    watching: string
    ingested: string
    deduped: string
  }
  lines: {
    connect: string[]
    watch: string[]
    push: string[]
    replay: string[]
  }
}

export interface ViolletInteractives {
  controls: ViolletControlsCopy
  app: ViolletAppCopy
  inbox: ViolletInboxCopy
  access: ViolletAccessCopy
  ownership: ViolletOwnershipCopy
  architecture: ViolletArchitectureCopy
  parse: ViolletParseCopy
  banks: ViolletBanksCopy
  chat: ViolletChatCopy
  sync: ViolletSyncCopy
}

export interface CaseStudyContent {
  meta: {
    title: string
    description: string
    role: string
    year: string
    readTime: string
  }
  backLink: {
    label: string
    url: string
  }
  hero: {
    eyebrow: string
    summary: string
    technologies: string[]
  }
  sections: {
    context: CaseStudySection
    constraints: CaseStudySection
    responsibility: CaseStudySection
    architecture: CaseStudySection & {
      diagramCaption: string
    }
    tradeOffs: {
      title: string
      items: CaseStudyTradeOff[]
    }
    impact: CaseStudySection
    assistant: CaseStudySection
    operationalQuality: CaseStudySection
    proof: CaseStudyProof
  }
  interactives: ViolletInteractives
}

export interface CaseStudiesDictionary {
  viollet: CaseStudyContent
}
