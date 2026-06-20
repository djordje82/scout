'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ScoutResponse, ResearchCategory } from '@/lib/types'

type Props = {
  result: ScoutResponse | null
  isLoading: boolean
}

const CATEGORY_META: Record<ResearchCategory, { label: string; classes: string }> = {
  competitors: { label: 'Competitors',  classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  recentMoves: { label: 'Recent Moves', classes: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  sentiment:   { label: 'Sentiment',    classes: 'bg-green-500/10 text-green-400 border-green-500/20' },
  pricing:     { label: 'Pricing',      classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  techSignals: { label: 'Tech Signals', classes: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
}

export function SpendLedger({ result, isLoading }: Props) {
  const budgetPct = result
    ? Math.max(0, Math.min(100, (result.remainingBudget / result.budget) * 100))
    : 100

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-neutral-600">
          Spend Ledger
        </h3>
        <span className="text-[10px] text-neutral-600 font-mono">Powered by Circle</span>
      </div>

      {isLoading || !result ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20 bg-neutral-800 rounded-md" />
                <Skeleton className="h-4 w-14 bg-neutral-800 rounded-md" />
              </div>
              <Skeleton className="h-3 w-5/6 bg-neutral-800" />
              <Skeleton className="h-3 w-1/3 bg-neutral-800" />
            </div>
          ))}
          <div className="border-t border-neutral-800 pt-3 space-y-2">
            <Skeleton className="h-3 w-full bg-neutral-800" />
            <Skeleton className="h-2 w-full bg-neutral-800 rounded-full" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {result.spendLedger.map((entry, i) => {
            const meta = CATEGORY_META[entry.category]
            const receiptShort = `${entry.receipt.slice(0, 10)}…${entry.receipt.slice(-6)}`
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      'shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-medium',
                      meta.classes
                    )}
                  >
                    {meta.label}
                  </span>
                  <span className="text-xs font-mono text-white tabular-nums">
                    ${entry.cost.toFixed(3)} USDC
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">{entry.reason}</p>
                <a
                  href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER ?? 'https://basescan.org'}/tx/${entry.receipt}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[10px] text-neutral-700 hover:text-neutral-400 transition-colors"
                >
                  {receiptShort} <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            )
          })}

          <div className="border-t border-neutral-800 pt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Total spent</span>
              <span className="font-mono text-white">${result.totalSpent.toFixed(4)} USDC</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Remaining</span>
              <span className="font-mono text-green-400">${result.remainingBudget.toFixed(3)} USDC</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden mt-1">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-700"
                style={{ width: `${budgetPct}%` }}
              />
            </div>
            <p className="text-[10px] text-neutral-600 text-right">
              {budgetPct.toFixed(1)}% of ${result.budget} USDC remaining
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
