export interface CaseStudySection {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export interface CaseStudyTradeOff {
  decision: string
  rationale: string
}

export interface CaseStudyProof {
  demoLabel: string
  videoLabel: string
  videoDescription: string
  videoSrc: string
  videoPoster: string
  demoUrl: string
  screenshotAlt: string
  note: string
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
    operationalQuality: CaseStudySection
    proof: CaseStudyProof
  }
}

export interface CaseStudiesDictionary {
  viollet: CaseStudyContent
}
