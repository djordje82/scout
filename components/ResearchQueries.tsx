'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { SpendEntry, ResearchCategory } from '@/lib/types'

type Props = {
  spendLedger: SpendEntry[] | null
  isLoading: boolean
}

const CATEGORY_META: Record<ResearchCategory, { label: string; classes: string }> = {
  competitors: { label: 'Competitors',  classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  recentMoves: { label: 'Recent Moves', classes: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  sentiment:   { label: 'Sentiment',    classes: 'bg-green-500/10 text-green-400 border-green-500/20' },
  pricing:     { label: 'Pricing',      classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  techSignals: { label: 'Tech Signals', classes: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
}

export function ResearchQueries({ spendLedger, isLoading }: Props) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-neutral-600">
          Research Queries
        </h3>
        <span className="text-[10px] text-neutral-600 font-mono">Powered by Tavily</span>
      </div>

      <div className="space-y-2.5">
        {isLoading || !spendLedger ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <Skeleton className="h-5 w-20 bg-neutral-800 rounded-md shrink-0" />
              <Skeleton className="h-5 flex-1 bg-neutral-800 rounded-md" />
            </div>
          ))
        ) : (
          spendLedger.map((entry, i) => {
            const meta = CATEGORY_META[entry.category]
            return (
              <div key={i} className="flex items-start gap-2.5">
                <span
                  className={cn(
                    'shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-medium',
                    meta.classes
                  )}
                >
                  {meta.label}
                </span>
                <p className="text-xs text-neutral-400 leading-relaxed pt-0.5">{entry.query}</p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
