'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CompetitiveBrief } from '@/components/CompetitiveBrief'
import { ResearchQueries } from '@/components/ResearchQueries'
import { SpendLedger } from '@/components/SpendLedger'
import { cn } from '@/lib/utils'
import { Target, Download } from 'lucide-react'
import type { ScoutResponse } from '@/lib/types'
import { exportJson, exportMarkdown, exportPdf } from '@/lib/export'

const FOCUS_PRESETS = [
  { value: '',                              label: 'General competitive overview' },
  { value: 'enterprise pricing strategy',   label: 'Enterprise pricing strategy'  },
  { value: 'AI and product roadmap',        label: 'AI and product roadmap'       },
  { value: 'go-to-market positioning',      label: 'Go-to-market positioning'     },
  { value: 'engineering and tech stack',    label: 'Engineering and tech stack'   },
  { value: 'customer sentiment and reviews',label: 'Customer sentiment and reviews'},
  { value: 'funding and growth trajectory', label: 'Funding and growth trajectory'},
]

const STEPS = [
  { label: 'Searching competitors',          cost: 0.001 },
  { label: 'Searching recent moves',         cost: 0.001 },
  { label: 'Searching customer sentiment',   cost: 0.001 },
  { label: 'Searching pricing intelligence', cost: 0.001 },
  { label: 'Searching tech signals',         cost: 0.001 },
  { label: 'Synthesizing brief with Nebius', cost: 0     },
]

const PRIZE_TRACKS = [
  { name: 'Circle',  desc: 'Agent Wallet + Nanopayments' },
  { name: 'Tavily',  desc: 'Agentic Search'              },
  { name: 'Nebius',  desc: 'Token Factory'               },
  { name: 'OOBE',    desc: 'Agent Infra'                 },
]

type Status = 'idle' | 'loading' | 'done' | 'error'

export default function Home() {
  const [company, setCompany]         = useState('')
  const [focusPreset, setFocusPreset] = useState('')
  const [focusCustom, setFocusCustom] = useState('')
  const [budget, setBudget]           = useState(5)
  const [status, setStatus]         = useState<Status>('idle')
  const [result, setResult]         = useState<ScoutResponse | null>(null)
  const [error, setError]           = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(-1)

  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status !== 'loading') {
      const timer = setTimeout(() => setCurrentStep(-1), 0)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => setCurrentStep(0), 0)
    let step = 0
    const id = setInterval(() => {
      step++
      if (step < STEPS.length) {
        setCurrentStep(step)
      } else {
        clearInterval(id)
      }
    }, 750)

    return () => {
      clearTimeout(timer)
      clearInterval(id)
    }
  }, [status])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!company.trim() || status === 'loading') return

    setStatus('loading')
    setResult(null)
    setError(null)

    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)

    try {
      const res = await fetch('/api/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: company.trim(),
          focus: (focusPreset === 'other' ? focusCustom : focusPreset).trim() || undefined,
          budgetUSDC: budget,
        }),
      })

      if (!res.ok) {
        const err = await res.json() as { error?: string }
        throw new Error(err.error ?? 'Research failed')
      }

      const data = await res.json() as ScoutResponse
      setResult(data)
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  const showResults = status === 'loading' || status === 'done'

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-5 w-5 text-[#3b82f6]" />
            <h1 className="text-xl font-bold tracking-tight">Scout</h1>
          </div>
          <p className="text-sm text-neutral-500">
            Autonomous competitive intelligence — powered by Circle, Tavily, and Nebius
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex flex-col gap-4 max-w-3xl">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. Notion, Linear, Figma"
                  disabled={status === 'loading'}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] disabled:opacity-50"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Focus <span className="text-neutral-600">(optional)</span>
                </label>
                <select
                  value={focusPreset}
                  onChange={e => { setFocusPreset(e.target.value); setFocusCustom('') }}
                  disabled={status === 'loading'}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-sm text-white focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] disabled:opacity-50"
                >
                  {FOCUS_PRESETS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                  <option value="other">Other (type your own)</option>
                </select>
                {focusPreset === 'other' && (
                  <input
                    type="text"
                    value={focusCustom}
                    onChange={e => setFocusCustom(e.target.value)}
                    placeholder="e.g. APAC expansion strategy"
                    disabled={status === 'loading'}
                    autoFocus
                    className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] disabled:opacity-50"
                  />
                )}
              </div>
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Budget —{' '}
                  <span className="font-mono text-white">${budget.toFixed(1)} USDC</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={0.5}
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  disabled={status === 'loading'}
                  className="w-full accent-[#3b82f6] disabled:opacity-50 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-neutral-700 mt-0.5">
                  <span>$1</span>
                  <span>$10</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!company.trim() || status === 'loading'}
                className="h-10 px-6 bg-[#3b82f6] hover:bg-[#2563eb] text-white shrink-0 mb-5 disabled:opacity-40"
              >
                {status === 'loading' ? 'Researching…' : 'Start Research'}
              </Button>
            </div>

            {/* Progress feed */}
            {status === 'loading' && (
              <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3 font-mono text-xs space-y-1.5">
                {STEPS.map((step, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center gap-2 transition-colors duration-300',
                      i < currentStep  ? 'text-green-400'  :
                      i === currentStep ? 'text-[#3b82f6]' :
                      'text-neutral-700'
                    )}
                  >
                    <span className="w-3 shrink-0 text-center select-none">
                      {i < currentStep ? '✓' : i === currentStep ? '›' : '·'}
                    </span>
                    <span>
                      {step.label}
                      {i < currentStep && step.cost > 0 && (
                        <span className="text-neutral-600 ml-1">({step.cost} USDC paid)</span>
                      )}
                      {i === currentStep && <span className="animate-pulse">…</span>}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {status === 'error' && error && (
              <div className="rounded-lg border border-red-900 bg-red-950/30 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
          </div>
        </form>

        {/* Results */}
        {showResults && (
          <div ref={resultsRef} className="grid grid-cols-5 gap-6 mb-12">
            <div className="col-span-3">
              <CompetitiveBrief
                company={result?.company ?? company}
                brief={result?.brief ?? null}
                isLoading={status === 'loading'}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-4">
              <ResearchQueries
                spendLedger={result?.spendLedger ?? null}
                isLoading={status === 'loading'}
              />
              <SpendLedger
                result={result}
                isLoading={status === 'loading'}
              />
            </div>
          </div>
        )}

        {/* Export bar */}
        {status === 'done' && result && (
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-4 mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20">
                <Download className="h-4 w-4 text-[#3b82f6]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Export report</p>
                <p className="text-[11px] text-neutral-500">Download for humans or AI ingestion</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
              {([
                { label: 'JSON',     desc: 'AI / API',  action: () => exportJson(result)     },
                { label: 'Markdown', desc: 'LLM-ready', action: () => exportMarkdown(result) },
                { label: 'PDF',      desc: 'Human',     action: () => exportPdf(result)      },
              ] as const).map(({ label, desc, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-white hover:border-[#3b82f6] hover:bg-[#3b82f6]/10 hover:text-[#3b82f6] transition-colors"
                >
                  <span className="font-medium">{label}</span>
                  <span className="text-[10px] text-neutral-500">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-neutral-900 pt-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-xs text-neutral-700">Prize tracks:</span>
            {PRIZE_TRACKS.map(track => (
              <div key={track.name} className="flex items-center gap-1.5">
                <Badge
                  variant="secondary"
                  className="bg-neutral-900 text-neutral-400 border border-neutral-800 text-[10px] px-2 py-0.5"
                >
                  {track.name}
                </Badge>
                <span className="text-[11px] text-neutral-600">{track.desc}</span>
              </div>
            ))}
          </div>
        </footer>

      </div>
    </main>
  )
}
