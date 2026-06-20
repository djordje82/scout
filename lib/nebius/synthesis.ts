import type { CompetitiveBriefData } from '@/lib/types'
import type { TavilyResult } from '@/lib/tavily'
import mockBrief from '@/data/mock_brief.json'

export type SynthesisResult = {
  brief: CompetitiveBriefData
  model: string
}

type CategoryResults = {
  competitors: TavilyResult[]
  recentMoves: TavilyResult[]
  sentiment: TavilyResult[]
  pricing: TavilyResult[]
  techSignals: TavilyResult[]
}

const NEBIUS_BASE_URL = process.env.NEBIUS_BASE_URL ?? 'https://api.tokenfactory.nebius.com/v1'
const DEFAULT_MODEL = 'Qwen/Qwen3-30B-A3B-Instruct-2507'

function formatResults(results: CategoryResults): string {
  const sections = [
    ['COMPETITORS', results.competitors],
    ['RECENT MOVES', results.recentMoves],
    ['CUSTOMER SENTIMENT', results.sentiment],
    ['PRICING', results.pricing],
    ['TECH SIGNALS', results.techSignals],
  ] as const

  return sections
    .map(([label, items]) => {
      const content = items
        .map(r => `- ${r.title}\n  ${r.content}`)
        .join('\n')
      return `## ${label}\n${content}`
    })
    .join('\n\n')
}

const SYSTEM_PROMPT = `You are a competitive intelligence analyst. Given research results, produce a structured JSON competitive brief.
Return ONLY valid JSON matching this exact schema, no markdown fences, no extra text:
{
  "overview": "2-3 sentence executive summary",
  "competitors": [{ "name": string, "summary": string }],
  "recentMoves": [{ "date": "YYYY-MM-DD", "event": string, "source": string }],
  "sentiment": { "score": number (0-100), "summary": string },
  "pricing": { "summary": string, "tiers": [string] },
  "techSignals": { "summary": string, "signals": [string] }
}`

export async function synthesizeBrief(
  company: string,
  results: CategoryResults,
  focus?: string
): Promise<SynthesisResult> {
  if (process.env.USE_MOCK === 'true') {
    return { brief: mockBrief.brief as CompetitiveBriefData, model: 'mock' }
  }

  const apiKey = process.env.NEBIUS_API_KEY
  if (!apiKey) throw new Error('NEBIUS_API_KEY is not set')

  const model = process.env.NEBIUS_MODEL ?? DEFAULT_MODEL

  const userPrompt = [
    `Company: ${company}`,
    focus ? `Research focus: ${focus}` : '',
    '',
    formatResults(results),
  ]
    .filter(Boolean)
    .join('\n')

  const res = await fetch(`${NEBIUS_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 2048,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Nebius synthesis failed (${res.status}): ${text}`)
  }

  const data = await res.json() as {
    choices: { message: { content: string } }[]
    model: string
  }

  const raw = data.choices[0]?.message?.content?.trim()
  if (!raw) throw new Error('Nebius returned empty response')

  let brief: CompetitiveBriefData
  try {
    brief = JSON.parse(raw) as CompetitiveBriefData
  } catch {
    throw new Error(`Nebius response was not valid JSON: ${raw.slice(0, 200)}`)
  }

  return { brief, model: data.model ?? model }
}
