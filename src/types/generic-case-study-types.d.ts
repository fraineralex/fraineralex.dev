export interface GenericStep { title: string; body: string }
export interface GenericOption { id: string; label: string; title: string; body: string; bullets?: string[]; tone?: 'red' | 'amber' | 'green' | 'teal' }
export interface GenericArchNode { id: string; label: string; detail: string; layer: number }

export type GenericInteractive =
  | { kind: 'stepper'; title: string; description: string; steps: GenericStep[]; prevLabel: string; nextLabel: string; stepLabel: string; sampleNote?: string }
  | { kind: 'options'; title: string; description: string; options: GenericOption[]; sampleNote?: string }
  | { kind: 'architecture'; title: string; description: string; layers: string[]; nodes: GenericArchNode[]; hint: string }
  | { kind: 'minimax'; title: string; description: string; pruningOn: string; pruningOff: string; visitedLabel: string; prunedLabel: string; bestLabel: string; prevLabel: string; nextLabel: string; resetLabel: string; stepLabel: string; maxLabel: string; minLabel: string }
  | { kind: 'heuristics'; title: string; description: string; piecesLabel: string; squaresLabel: string; pieces: { name: string; value: number }[]; squareNote: string }

export interface GenericSection { title: string; paragraphs: string[]; bullets?: string[]; interactive?: GenericInteractive }

export interface GenericCaseStudyContent {
  slug: string
  meta: { title: string; description: string; role: string; year: string; readTime: string }
  backLink: { label: string; url: string }
  hero: { summary: string; technologies: string[] }
  sections: GenericSection[]
  tradeOffs: { title: string; items: { decision: string; rationale: string }[] }
  proof: { title: string; note: string; links: { label: string; url: string }[] }
}
