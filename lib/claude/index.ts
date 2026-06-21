import Anthropic from '@anthropic-ai/sdk'
import type { ResearchCategory, SpendEntry } from '@/lib/types'
import type { TavilyResult } from '@/lib/tavily/search'
import { payForService } from '@/lib/circle'
import { searchCategory, buildQuery } from '@/lib/tavily'

const COST_PER_SEARCH = 0.01

const CATEGORY_REASONS: Record<ResearchCategory, string> = {
  competitors: 'Map the competitive landscape',
  recentMoves: 'Track recent product and strategic moves',
  sentiment:   'Gauge customer and market sentiment',
  pricing:     'Benchmark pricing and packaging',
  techSignals: 'Identify engineering and infrastructure direction',
}

const SEARCH_TOOL: Anthropic.Tool = {
  name: 'search_category',
  description:
    `Search the web for competitive intelligence about a company in one research category. ` +
    `Each call costs ${COST_PER_SEARCH} USDC from the agent's budget. ` +
    `Call once per category; do not repeat a category.`,
  input_schema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        enum: ['competitors', 'recentMoves', 'sentiment', 'pricing', 'techSignals'],
        description:
          'competitors=competitive landscape, recentMoves=recent activity, ' +
          'sentiment=customer feedback, pricing=pricing tiers, techSignals=tech stack',
      },
    },
    required: ['category'],
  },
}

export type SearchRecord = {
  category: ResearchCategory
  results: TavilyResult[]
  query: string
  receipt: string
}

export type OrchestratorResult = {
  searches: SearchRecord[]
  spendLedger: SpendEntry[]
  totalSpent: number
}

export async function orchestrateResearch(params: {
  company: string
  focus?: string
  budgetUSDC: number
  premiumSearchUrl: string
}): Promise<OrchestratorResult> {
  const { company, focus, budgetUSDC, premiumSearchUrl } = params
  const useMock = process.env.USE_MOCK === 'true'

  const searches: SearchRecord[] = []
  const spendLedger: SpendEntry[] = []
  let totalSpent = 0

  const client = new Anthropic()

  const messages: Anthropic.MessageParam[] = [
    {
      role: 'user',
      content:
        `Research "${company}"${focus ? ` (focus: ${focus})` : ''}. ` +
        `Budget: ${budgetUSDC} USDC — each search_category call costs ${COST_PER_SEARCH} USDC. ` +
        `Call search_category for all 5 categories: competitors, recentMoves, sentiment, pricing, techSignals. ` +
        `Stop if budget runs out. Never search the same category twice.`,
    },
  ]

  while (true) {
    const budgetRemaining = Math.round((budgetUSDC - totalSpent) * 1000) / 1000
    const categoriesDone = searches.map(s => s.category)
    const canSearch = budgetRemaining >= COST_PER_SEARCH && categoriesDone.length < 5

    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      thinking: { type: 'adaptive' },
      system:
        `You are Scout's research orchestrator. ` +
        `Budget remaining: ${budgetRemaining} USDC. ` +
        `Categories searched: [${categoriesDone.join(', ') || 'none'}]. ` +
        (canSearch
          ? 'Call search_category for the next uncovered category.'
          : 'Research complete. Confirm done briefly.'),
      tools: canSearch ? [SEARCH_TOOL] : [],
      messages,
    })

    messages.push({ role: 'assistant', content: response.content })

    if (response.stop_reason === 'end_turn') break
    if (response.stop_reason !== 'tool_use') break

    const toolUseBlocks = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
    )
    if (toolUseBlocks.length === 0) break

    const toolResults: Anthropic.ToolResultBlockParam[] = []

    for (const block of toolUseBlocks) {
      if (block.name !== 'search_category') continue

      const { category } = block.input as { category: ResearchCategory }

      if (totalSpent + COST_PER_SEARCH > budgetUSDC) {
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: JSON.stringify({ error: 'Budget exhausted' }),
        })
        continue
      }

      if (searches.some(s => s.category === category)) {
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: JSON.stringify({ error: `Category "${category}" already searched` }),
        })
        continue
      }

      const query = buildQuery(company, category, focus)
      let results: TavilyResult[]
      let receipt: string

      if (useMock) {
        results = await searchCategory({ company, category, focus })
        await delay(700)
        receipt = fakeReceipt()
      } else {
        const paid = await payForService(premiumSearchUrl, { query: company, category, focus })
        results = JSON.parse(paid.data) as TavilyResult[]
        receipt = paid.receipt
      }

      totalSpent = Math.round((totalSpent + COST_PER_SEARCH) * 1000) / 1000
      searches.push({ category, results, query, receipt })
      spendLedger.push({
        query,
        category,
        cost: COST_PER_SEARCH,
        reason: CATEGORY_REASONS[category],
        receipt,
      })

      toolResults.push({
        type: 'tool_result',
        tool_use_id: block.id,
        content: JSON.stringify({
          resultsCount: results.length,
          totalSpent,
          budgetRemaining: Math.round((budgetUSDC - totalSpent) * 1000) / 1000,
        }),
      })
    }

    messages.push({ role: 'user', content: toolResults })
  }

  return { searches, spendLedger, totalSpent }
}

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

function fakeReceipt(): string {
  return `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
}
