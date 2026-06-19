export type ResearchCategory =
  | 'competitors'
  | 'recentMoves'
  | 'sentiment'
  | 'pricing'
  | 'techSignals'

export type Competitor = {
  name: string
  summary: string
}

export type RecentMove = {
  date: string
  event: string
  source: string
}

export type Sentiment = {
  score: number
  summary: string
}

export type Pricing = {
  summary: string
  tiers: string[]
}

export type TechSignals = {
  summary: string
  signals: string[]
}

export type CompetitiveBriefData = {
  overview: string
  competitors: Competitor[]
  recentMoves: RecentMove[]
  sentiment: Sentiment
  pricing: Pricing
  techSignals: TechSignals
}

export type SpendEntry = {
  query: string
  category: ResearchCategory
  cost: number
  reason: string
  receipt: string
}

export type ScoutResponse = {
  company: string
  researchFocus: string
  budget: number
  brief: CompetitiveBriefData
  spendLedger: SpendEntry[]
  totalSpent: number
  remainingBudget: number
}
