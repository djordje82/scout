import { NextResponse } from 'next/server'
import mockBrief from '@/data/mock_brief.json'

export async function POST(request: Request) {
  const body = await request.json() as {
    company?: string
    focus?: string
    budgetUSDC?: number
  }

  if (process.env.USE_MOCK === 'true') {
    await new Promise(r => setTimeout(r, 5000))
    const budget = body.budgetUSDC ?? mockBrief.budget
    return NextResponse.json({
      ...mockBrief,
      company: body.company || mockBrief.company,
      researchFocus: body.focus || mockBrief.researchFocus,
      budget,
      remainingBudget: budget - mockBrief.totalSpent,
    })
  }

  return NextResponse.json(
    { error: 'Live mode not yet implemented. Set USE_MOCK=true in .env.local.' },
    { status: 501 }
  )
}
