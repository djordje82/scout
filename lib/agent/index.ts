import type { ResearchCategory, ScoutResponse } from '@/lib/types'
import type { TavilyResult } from '@/lib/tavily'
import { synthesizeBrief } from '@/lib/nebius'
import { orchestrateResearch } from '@/lib/claude'

export type RunScoutOptions = {
  company: string
  focus?: string
  budgetUSDC: number
}

type CategoryResults = Record<ResearchCategory, TavilyResult[]>

export async function runScout({
  company,
  focus,
  budgetUSDC,
}: RunScoutOptions): Promise<ScoutResponse> {
  const premiumSearchUrl =
    process.env.PREMIUM_SEARCH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/premium-search` : null) ??
    `http://localhost:${process.env.PORT ?? 3000}/api/premium-search`

  const { searches, spendLedger, totalSpent } = await orchestrateResearch({
    company,
    focus,
    budgetUSDC,
    premiumSearchUrl,
  })

  const categoryResults: CategoryResults = {
    competitors: [],
    recentMoves: [],
    sentiment:   [],
    pricing:     [],
    techSignals: [],
  }

  for (const { category, results } of searches) {
    categoryResults[category] = results
  }

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
