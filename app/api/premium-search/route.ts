import { NextRequest, NextResponse } from 'next/server'
import { withX402, x402ResourceServer } from '@x402/next'
import { HTTPFacilitatorClient } from '@x402/core/http'
import { facilitator } from '@coinbase/x402'
import { ExactEvmScheme } from '@x402/evm/exact/server'
import { searchCategory } from '@/lib/tavily'
import type { ResearchCategory } from '@/lib/types'

const AGENT_WALLET = process.env.AGENT_WALLET_ADDRESS ?? '0xdf907eaaca1a7996ee248dd7f51dd240cba08ec9'
const FACILITATOR_URL = process.env.X402_FACILITATOR_URL ?? 'https://x402.org/facilitator'

const facilitatorClient = new HTTPFacilitatorClient({
  ...facilitator,
  url: FACILITATOR_URL,
})

const server = new x402ResourceServer(facilitatorClient)
  .register('eip155:8453', new ExactEvmScheme())

async function handler(request: NextRequest): Promise<NextResponse> {
  const body = await request.json() as { query: string; category: ResearchCategory }

  if (!body.query || !body.category) {
    return NextResponse.json({ error: 'query and category are required' }, { status: 400 })
  }

  const results = await searchCategory({
    company: body.query,
    category: body.category,
  })

  return NextResponse.json(results)
}

export const POST = withX402(
  handler,
  {
    accepts: {
      scheme: 'exact',
      payTo: AGENT_WALLET,
      price: '$0.001',
      network: 'eip155:8453',
    },
    description: 'Competitive intelligence search — 0.001 USDC per query',
  },
  server
)
