import { NextResponse } from 'next/server'
import { runScout } from '@/lib/agent'

export async function POST(request: Request) {
  const body = await request.json() as {
    company?: string
    focus?: string
    budgetUSDC?: number
  }

  const company = (body.company ?? '').trim() || 'Unnamed Company'
  const focus = body.focus?.trim() || undefined
  const budgetUSDC = body.budgetUSDC ?? 1

  try {
    const result = await runScout({ company, focus, budgetUSDC })
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
