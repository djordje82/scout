import Link from 'next/link'
import { Target, Search, Brain, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react'

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Target,
    title: 'Name your target',
    desc: 'Enter a company and optional research focus. Set a USDC budget — Scout never spends more than you authorise.',
  },
  {
    step: '02',
    icon: Wallet,
    title: 'Agent buys intelligence',
    desc: 'Scout\'s Circle Agent Wallet pays $0.001 USDC per query via x402 nanopayments — one purchase per research category.',
  },
  {
    step: '03',
    icon: Search,
    title: 'Tavily searches five angles',
    desc: 'Competitors, recent moves, customer sentiment, pricing, and tech signals — each a paid, targeted Tavily search.',
  },
  {
    step: '04',
    icon: Brain,
    title: 'Nebius synthesises a brief',
    desc: 'Qwen3-30B reads all five result sets and returns a structured JSON competitive brief ready for humans or downstream AI.',
  },
]

const FEATURES = [
  'Five research categories per session',
  'Hard budget cap — never overspends',
  'On-chain receipt for every search',
  'Structured JSON + Markdown + PDF export',
  'Works in mock mode — no wallet required',
]

const STACK = [
  { name: 'Circle', role: 'Agent Wallet + x402 nanopayments', color: 'text-green-400 border-green-400/20 bg-green-400/5' },
  { name: 'Tavily', role: 'Agentic search', color: 'text-blue-400 border-blue-400/20 bg-blue-400/5' },
  { name: 'Nebius', role: 'Token Factory LLM', color: 'text-purple-400 border-purple-400/20 bg-purple-400/5' },
  { name: 'x402',   role: 'HTTP nanopayments', color: 'text-orange-400 border-orange-400/20 bg-orange-400/5' },
]

export default function Landing() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Nav */}
      <nav className="border-b border-neutral-900 px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-[#eab308]" />
            <span className="font-bold tracking-tight">Scout</span>
          </div>
          <Link
            href="/research"
            className="flex items-center gap-1.5 rounded-lg bg-[#eab308] px-4 py-2 text-sm font-medium text-black hover:bg-[#ca8a04] transition-colors"
          >
            Launch app <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6">

        {/* Hero */}
        <section className="py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-400 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            Autonomous agent · pays per insight · on-chain receipts
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
            Competitive intelligence
            <br />
            <span className="text-[#eab308]">paid per insight</span>
          </h1>

          <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Scout is an autonomous AI agent. Give it a company name and a USDC budget.
            It researches five angles, pays for each search individually, and returns
            a structured brief with on-chain receipts — no subscriptions, no overage.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/research"
              className="flex items-center gap-2 rounded-xl bg-[#eab308] px-7 py-3.5 text-base font-semibold text-black hover:bg-[#ca8a04] transition-colors"
            >
              Start researching <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-sm text-neutral-600">
              Try mock mode — no wallet or API keys needed
            </span>
          </div>
        </section>

        {/* Cost callout */}
        <section className="mb-20">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-8 grid grid-cols-3 divide-x divide-neutral-800 text-center">
            <div className="px-4">
              <p className="text-3xl font-bold text-white mb-1">$0.001</p>
              <p className="text-sm text-neutral-500">per search query</p>
            </div>
            <div className="px-4">
              <p className="text-3xl font-bold text-white mb-1">5</p>
              <p className="text-sm text-neutral-500">research categories</p>
            </div>
            <div className="px-4">
              <p className="text-3xl font-bold text-white mb-1">$0.005</p>
              <p className="text-sm text-neutral-500">full brief, total cost</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-2">How it works</h2>
          <p className="text-neutral-500 text-sm mb-10">Four steps. Fully automated. Every cent accounted for.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
              <div
                key={step}
                className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-[#eab308]/10 border border-[#eab308]/20">
                    <Icon className="h-5 w-5 text-[#eab308]" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[10px] font-mono text-neutral-600">{step}</span>
                      <h3 className="text-sm font-semibold text-white">{title}</h3>
                    </div>
                    <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Spend ledger preview */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-2">Every cent is on-chain</h2>
          <p className="text-neutral-500 text-sm mb-8">Scout returns a spend ledger with a Base transaction receipt for each search.</p>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden font-mono text-xs">
            <div className="border-b border-neutral-800 px-4 py-2 flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
              <span className="ml-2 text-neutral-600">spend ledger — Stripe</span>
            </div>
            <div className="p-4 space-y-2.5">
              {[
                { cat: 'competitors',  reason: 'Map the competitive landscape',         tx: '0x3f8a…c2d1' },
                { cat: 'recentMoves', reason: 'Track recent product moves',             tx: '0xa14b…9e72' },
                { cat: 'sentiment',   reason: 'Gauge customer sentiment',               tx: '0x72fc…4a0b' },
                { cat: 'pricing',     reason: 'Benchmark pricing and packaging',        tx: '0xc9d3…7f3e' },
                { cat: 'techSignals', reason: 'Identify engineering direction',         tx: '0x1e2a…8c91' },
              ].map(({ cat, reason, tx }) => (
                <div key={cat} className="flex items-center gap-3 text-[11px]">
                  <span className="text-green-400 w-3">✓</span>
                  <span className="text-neutral-300 w-28 shrink-0">{cat}</span>
                  <span className="text-neutral-600 flex-1 truncate">{reason}</span>
                  <span className="text-neutral-500 shrink-0">0.001 USDC</span>
                  <span className="text-[#eab308] shrink-0">{tx}</span>
                </div>
              ))}
              <div className="border-t border-neutral-800 pt-2 flex justify-between text-[11px]">
                <span className="text-neutral-600">Total</span>
                <span className="text-white font-semibold">0.005 USDC</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-20 grid grid-cols-1 sm:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Built for agentic workflows</h2>
            <p className="text-neutral-500 text-sm mb-8">
              Scout is a template for what AI agents can buy on the internet — intelligence, data,
              compute — paid with micropayments, without subscriptions or API key sprawl.
            </p>
            <ul className="space-y-3">
              {FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-neutral-300">
                  <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium text-neutral-600 uppercase tracking-wider mb-4">Powered by</p>
            {STACK.map(({ name, role, color }) => (
              <div
                key={name}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${color}`}
              >
                <span className="font-bold text-sm w-16">{name}</span>
                <span className="text-xs opacity-70">{role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-20 text-center rounded-2xl border border-neutral-800 bg-neutral-950 py-16 px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to scout a competitor?</h2>
          <p className="text-neutral-500 text-sm mb-8 max-w-md mx-auto">
            Run in mock mode for free, or connect a Circle Agent Wallet and spend $0.005 on a real brief.
          </p>
          <Link
            href="/research"
            className="inline-flex items-center gap-2 rounded-xl bg-[#eab308] px-8 py-4 text-base font-semibold text-black hover:bg-[#ca8a04] transition-colors"
          >
            Launch Scout <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-900 px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-[#eab308]" />
            <span className="text-sm font-medium">Scout</span>
            <span className="text-xs text-neutral-600">— autonomous competitive intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-700">
            <span>Circle · Tavily · Nebius · x402</span>
          </div>
        </div>
      </footer>

    </main>
  )
}
