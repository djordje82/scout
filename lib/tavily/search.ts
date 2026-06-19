import type { ResearchCategory } from '@/lib/types'

export type TavilyResult = {
  title: string
  url: string
  content: string
  score: number
  published_date: string | null
}

type SearchParams = {
  company: string
  category: ResearchCategory
  focus?: string
}

const QUERY_TEMPLATES: Record<ResearchCategory, (company: string, focus?: string) => string> = {
  competitors:  (c, f) => `"${c}" competitors alternatives 2026${f ? ` ${f}` : ''}`,
  recentMoves:  (c, f) => `"${c}" product launch announcement news last 30 days${f ? ` ${f}` : ''}`,
  sentiment:    (c, f) => `"${c}" user reviews complaints praise Reddit${f ? ` ${f}` : ''}`,
  pricing:      (c, f) => `"${c}" pricing plans cost tiers 2026${f ? ` ${f}` : ''}`,
  techSignals:  (c, f) => `"${c}" tech stack engineering blog infrastructure${f ? ` ${f}` : ''}`,
}

const MOCK_RESULTS: Record<ResearchCategory, TavilyResult[]> = {
  competitors: [
    { title: 'Best Notion Competitors & Alternatives 2026', url: 'https://example.com/notion-competitors-2026', content: 'Coda, Confluence, and Microsoft Loop are Notion\'s main rivals heading into 2026. Coda AI has deepened formula integrations, while Microsoft Loop benefits from free bundling with M365.', score: 0.92, published_date: '2026-05-01' },
    { title: 'Notion vs Coda vs Confluence — Which Wins?', url: 'https://example.com/notion-vs-coda', content: 'In head-to-head tests, Notion leads on flexibility and templates; Coda leads on automation depth; Confluence leads on enterprise compliance.', score: 0.88, published_date: '2026-04-15' },
    { title: 'Why Teams Are Switching from Notion to Linear', url: 'https://example.com/linear-docs', content: 'Engineering teams increasingly prefer Linear Docs for keeping specs and issues co-located, reducing context switching away from Notion.', score: 0.84, published_date: '2026-03-22' },
  ],
  recentMoves: [
    { title: 'Notion Launches Notion Mail — AI-Native Email Client', url: 'https://notion.so/blog/notion-mail', content: 'Notion announced Notion Mail, an AI-native email client that pulls context from your workspace to draft replies automatically.', score: 0.95, published_date: '2026-05-14' },
    { title: 'Notion AI Now Reasons Across Your Entire Workspace', url: 'https://notion.so/blog/ai-updates-april-2026', content: 'Notion AI upgraded to support multi-page reasoning — can now synthesise across an entire workspace to answer questions.', score: 0.91, published_date: '2026-04-29' },
    { title: 'Notion Acquires Skiff IP Assets', url: 'https://techcrunch.com/2026/04/08/notion-skiff-ip', content: 'Following Skiff\'s shutdown, Notion acquired remaining IP assets suggesting a future privacy/encryption tier for enterprise.', score: 0.87, published_date: '2026-04-08' },
  ],
  sentiment: [
    { title: 'r/Notion — What do you hate about Notion?', url: 'https://reddit.com/r/Notion/complaints2026', content: 'Top complaints in 2026: slow load times on large databases, no true offline mode, AI features feel bolted-on. Price increase anger is visible among SMB users.', score: 0.87, published_date: '2026-05-20' },
    { title: 'Notion Reviews 2026 — G2', url: 'https://g2.com/products/notion/reviews', content: 'Overall 4.7/5 stars. Positive: template depth, flexibility, cross-platform. Negative: performance at scale, offline support, enterprise SSO gating.', score: 0.83, published_date: '2026-05-10' },
  ],
  pricing: [
    { title: 'Notion Pricing 2026 — Plans & Tiers', url: 'https://notion.so/pricing', content: 'Notion raised prices ~20% in Q2 2026. Plus: $12/user/month. Business: $18/user/month. AI add-on $10/user/month on paid plans. Enterprise custom pricing.', score: 0.94, published_date: '2026-04-01' },
    { title: 'Notion Price Increase Backlash — Reddit', url: 'https://reddit.com/r/Notion/pricing2026', content: 'Significant backlash from SMB users following the Q2 2026 price increase. Many comparing to Confluence and Microsoft Loop pricing.', score: 0.89, published_date: '2026-03-20' },
  ],
  techSignals: [
    { title: 'Notion Engineering — Rust Sync Engine at Scale', url: 'https://notion.so/engineering/rust-sync', content: 'Notion\'s Rust-based CRDT sync engine now serving 100% of users as of Q1 2026. Significant latency improvements on large workspaces.', score: 0.90, published_date: '2026-05-05' },
    { title: 'How Notion Built In-House Vector Search', url: 'https://notion.so/engineering/vector-search', content: 'Notion replaced Pinecone with an in-house vector search engine for Notion AI semantic search. Built on top of their existing Go microservices.', score: 0.86, published_date: '2026-04-20' },
  ],
}

export async function searchCategory({ company, category, focus }: SearchParams): Promise<TavilyResult[]> {
  if (process.env.USE_MOCK === 'true') {
    return MOCK_RESULTS[category]
  }

  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) throw new Error('TAVILY_API_KEY is not set')

  const query = QUERY_TEMPLATES[category](company, focus)

  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      search_depth: 'advanced',
      max_results: 5,
      include_answer: false,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Tavily search failed (${res.status}): ${text}`)
  }

  const data = await res.json() as { results: TavilyResult[] }
  return data.results
}

export function buildQuery(company: string, category: ResearchCategory, focus?: string): string {
  return QUERY_TEMPLATES[category](company, focus)
}
