import type { ResearchCategory, ScoutResponse, SpendEntry } from '@/lib/types'
import { searchCategory, buildQuery } from '@/lib/tavily'
import type { TavilyResult } from '@/lib/tavily'
import { synthesizeBrief } from '@/lib/nebius'
import { payForService } from '@/lib/circle'

const CATEGORIES: ResearchCategory[] = [
  'competitors',
  'recentMoves',
  'sentiment',
  'pricing',
  'techSignals',
]

const CATEGORY_REASONS: Record<ResearchCategory, string> = {
  competitors:  'Map the competitive landscape',
  recentMoves:  'Track recent product and strategic moves',
  sentiment:    'Gauge customer and market sentiment',
  pricing:      'Benchmark pricing and packaging',
  techSignals:  'Identify engineering and infrastructure direction',
}

const COST_PER_SEARCH = 0.001

export type RunScoutOptions = {
  company: string
  focus?: string
  budgetUSDC: number
}

type CategoryResults = {
  competitors: TavilyResult[]
  recentMoves: TavilyResult[]
  sentiment: TavilyResult[]
  pricing: TavilyResult[]
  techSignals: TavilyResult[]
}

export async function runScout({
  company,
  focus,
  budgetUSDC,
}: RunScoutOptions): Promise<ScoutResponse> {
  const categoryResults: CategoryResults = {
    competitors: [],
    recentMoves: [],
    sentiment: [],
    pricing: [],
    techSignals: [],
  }

  const spendLedger: SpendEntry[] = []
  let totalSpent = 0

  const premiumSearchUrl =
    process.env.PREMIUM_SEARCH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/premium-search` : null) ??
    `http://localhost:${process.env.PORT ?? 3000}/api/premium-search`

  for (const category of CATEGORIES) {
    if (totalSpent + COST_PER_SEARCH > budgetUSDC) {
      break
    }

    const query = buildQuery(company, category, focus)
    let results: TavilyResult[]

    if (process.env.USE_MOCK === 'true') {
      results = await searchCategory({ company, category, focus })
      await delay(700)
      spendLedger.push({
        query,
        category,
        cost: COST_PER_SEARCH,
        reason: CATEGORY_REASONS[category],
        receipt: fakeReceipt(),
      })
    } else {
      const paid = await payForService(premiumSearchUrl, { query: company, category })
      results = JSON.parse(paid.data) as TavilyResult[]
      spendLedger.push({
        query,
        category,
        cost: COST_PER_SEARCH,
        reason: CATEGORY_REASONS[category],
        receipt: paid.receipt,
      })
    }

    categoryResults[category] = results
    totalSpent = Math.round((totalSpent + COST_PER_SEARCH) * 1000) / 1000
  }

  if (process.env.USE_MOCK === 'true') await delay(1000)

  const { brief } = await synthesizeBrief(company, categoryResults, focus)

  return {
    company,
    researchFocus: focus ?? 'General competitive intelligence',
    budget: budgetUSDC,
    brief,
    spendLedger,
    totalSpent,
    remainingBudget: Math.round((budgetUSDC - totalSpent) * 1000) / 1000,
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

function fakeReceipt(): string {
  return `0x${Array.from(
    { length: 64 },
    () => Math.floor(Math.random() * 16).toString(16),
  ).join('')}`
}
