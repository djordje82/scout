'use client'

import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CompetitiveBriefData } from '@/lib/types'

type Props = {
  company: string
  brief: CompetitiveBriefData | null
  isLoading: boolean
}

export function CompetitiveBrief({ company, brief, isLoading }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!brief) {
      const t = setTimeout(() => setVisible(false), 0)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [brief])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Shell title="Overview">
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-full bg-neutral-800" />
            <Skeleton className="h-3.5 w-5/6 bg-neutral-800" />
            <Skeleton className="h-3.5 w-4/6 bg-neutral-800" />
          </div>
        </Shell>
        <Shell title="Top Competitors">
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg border border-neutral-800 p-3 space-y-2">
                <Skeleton className="h-3.5 w-1/3 bg-neutral-800" />
                <Skeleton className="h-3 w-full bg-neutral-800" />
                <Skeleton className="h-3 w-5/6 bg-neutral-800" />
              </div>
            ))}
          </div>
        </Shell>
        <Shell title="Recent Moves">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-2 w-2 rounded-full mt-1.5 bg-neutral-800 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-1/4 bg-neutral-800" />
                  <Skeleton className="h-3 w-full bg-neutral-800" />
                  <Skeleton className="h-3 w-3/4 bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        </Shell>
        <Shell title="Customer Sentiment">
          <Skeleton className="h-2 w-full bg-neutral-800 rounded-full mb-4" />
          <Skeleton className="h-3.5 w-full bg-neutral-800" />
          <Skeleton className="h-3.5 w-5/6 bg-neutral-800 mt-2" />
        </Shell>
        <Shell title="Pricing Intel">
          <Skeleton className="h-3.5 w-full bg-neutral-800 mb-3" />
          <div className="space-y-1.5">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-3 w-5/6 bg-neutral-800" />
            ))}
          </div>
        </Shell>
        <Shell title="Tech Signals">
          <Skeleton className="h-3.5 w-full bg-neutral-800 mb-3" />
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-24 bg-neutral-800 rounded-md" />
            ))}
          </div>
        </Shell>
      </div>
    )
  }

  if (!brief) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950">
        <p className="text-sm text-neutral-600">
          Enter a company name above to start research.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Section title="Overview" delay={0} visible={visible}>
        <p className="text-sm text-neutral-300 leading-relaxed">{brief.overview}</p>
      </Section>

      <Section title={`Top Competitors — ${company}`} delay={1} visible={visible}>
        <div className="grid grid-cols-2 gap-3">
          {brief.competitors.map((c, i) => (
            <div key={i} className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-3">
              <p className="text-sm font-semibold text-white mb-1">{c.name}</p>
              <p className="text-xs text-neutral-400 leading-relaxed">{c.summary}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Recent Moves" delay={2} visible={visible}>
        <div>
          {brief.recentMoves.map((m, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center shrink-0">
                <div className="h-2 w-2 rounded-full bg-[#3b82f6] mt-1.5" />
                {i < brief.recentMoves.length - 1 && (
                  <div className="w-px flex-1 bg-neutral-800 min-h-[1.5rem]" />
                )}
              </div>
              <div className="pb-4">
                <p className="text-[11px] text-neutral-500 mb-0.5 font-mono">{m.date}</p>
                <p className="text-sm text-neutral-300 leading-relaxed">{m.event}</p>
                <a
                  href={m.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#3b82f6] hover:text-blue-300 mt-1"
                >
                  Source <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Customer Sentiment" delay={3} visible={visible}>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-2 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-1000',
                brief.sentiment.score >= 70 ? 'bg-green-500' :
                brief.sentiment.score >= 40 ? 'bg-yellow-500' :
                'bg-red-500'
              )}
              style={{ width: visible ? `${brief.sentiment.score}%` : '0%' }}
            />
          </div>
          <span className="text-sm font-mono text-white tabular-nums w-16 text-right shrink-0">
            {brief.sentiment.score} / 100
          </span>
        </div>
        <p className="text-sm text-neutral-300 leading-relaxed">{brief.sentiment.summary}</p>
      </Section>

      <Section title="Pricing Intel" delay={4} visible={visible}>
        <p className="text-sm text-neutral-300 leading-relaxed mb-3">{brief.pricing.summary}</p>
        <div className="space-y-1.5">
          {brief.pricing.tiers.map((tier, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[#3b82f6] shrink-0 mt-0.5 select-none">·</span>
              <span className="text-xs text-neutral-400 leading-relaxed">{tier}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Tech Signals" delay={5} visible={visible}>
        <p className="text-sm text-neutral-300 leading-relaxed mb-3">{brief.techSignals.summary}</p>
        <div className="flex flex-wrap gap-2">
          {brief.techSignals.signals.map((signal, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-md border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-300"
            >
              {signal}
            </span>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
      <h3 className="text-[10px] font-semibold uppercase tracking-widest text-neutral-600 mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}

function Section({
  title,
  children,
  delay,
  visible,
}: {
  title: string
  children: React.ReactNode
  delay: number
  visible: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-800 bg-neutral-950 p-4 transition-all duration-500',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
      style={{ transitionDelay: `${delay * 100}ms` }}
    >
      <h3 className="text-[10px] font-semibold uppercase tracking-widest text-neutral-600 mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}
