# Scout — Documentation & Progress Tracking

_Last updated: 2026-06-20_

---

## Project Summary

Scout is an autonomous competitive intelligence agent. The user enters a company name and a research budget. A Claude Agent SDK agent breaks the research into five paid sub-queries (competitors, recent moves, sentiment, pricing, tech signals), pays for each Tavily search via a Circle Agent Wallet (x402 nanopayments), synthesizes a structured competitive brief with Nebius Token Factory, and returns the brief with a spend ledger showing what each insight cost and why.

**Target prizes: ~$3,000** across Circle ($1K), Tavily ($500), Nebius ($1K), OOBE ($500 + RPC).

---

## Task Status

### ✅ Completed

| # | Task | Notes |
|---|---|---|
| 1 | Scaffold Next.js project | Next.js 16.2.9, TypeScript, Tailwind v4, Shadcn UI (button, card, badge, skeleton), lucide-react. `npm run dev` verified. |
| 2 | Configure environment variables | `.env.example` created with all variables documented. `.env.local` created with `USE_MOCK=true` + Tavily key. `.gitignore` added (excludes node_modules, .next, .env.local). |
| 5 | Pre-bake `data/mock_brief.json` | Realistic Notion competitive brief — 5 competitors, 4 recent moves, sentiment score 62/100, pricing tiers, 6 tech signals, 5 spend ledger entries with mock Base tx hashes. |
| 6 | x402-gated premium search endpoint | `app/api/premium-search/route.ts` — `withX402` wrapping POST handler, `ExactEvmScheme` on eip155:8453, 0.001 USDC/call, Coinbase facilitator. Packages: `@x402/next@2.16.0`, `@coinbase/x402@2.1.0`, `@x402/evm@2.16.0`. |
| 7 | Circle Agent Wallet + Nanopayments | `lib/circle/` — 8 files vendored from ecosystem kit (`cli`, `types`, `chains`, `auth`, `wallet`, `gateway`, `services`, `browser`). `lib/circle/payment.ts` adds Scout-specific `payForService()`, `getWalletBalance()`, `getAgentWalletAddress()` with mock path. |
| 9 | Tavily search module | `lib/tavily/search.ts` — `searchCategory({ company, category, focus? })` → `TavilyResult[]`. 5 query templates per category (quoted company name), `search_depth: 'advanced'`, `Authorization: Bearer`. Mock fallback with realistic results. |
| 10 | Nebius synthesis module | `lib/nebius/synthesis.ts` — `synthesizeBrief(company, results, focus?)` → `{ brief: CompetitiveBriefData, model: string }`. OpenAI-compatible POST to Nebius Token Factory, model `Qwen/Qwen3-30B-A3B`, JSON-enforcing system prompt, temperature 0.2, max_tokens 2048. Mock returns `mockBrief.brief`. |
| 12 | Dashboard scaffold | `app/page.tsx` — dark UI (`bg-[#0a0a0a]`), company input, focus input, budget slider (1–10 USDC), two-column results layout, prize track footer. |
| 13 | Competitive brief display | `components/CompetitiveBrief.tsx` — 6 sections (overview, competitors grid, recent moves timeline, sentiment bar, pricing tiers, tech signal tags). Skeleton loaders + stagger fade-in animation on data arrival. |
| 14 | Research queries panel | `components/ResearchQueries.tsx` — 5 entries with color-coded category badges, query text, "Powered by Tavily" attribution. Skeleton loader. |
| 15 | Spend ledger panel | `components/SpendLedger.tsx` — per-entry category badge, cost (USDC), reason, receipt link to BaseScan. Running total + remaining budget bar. "Powered by Circle" badge. |
| 16 | Start Research button + progress | Progress feed in `app/page.tsx` — 6 steps tick through at 750ms intervals during loading. Completed steps show ✓ in green, current step pulses in blue. Error state handled. |
| 27 | Circle CLI host setup | Circle CLI installed globally, `circle terms accept`, email + OTP login, wallet provisioned on Base mainnet (`0xdf907eaaca1a7996ee248dd7f51dd240cba08ec9`). Funding deferred — USE_MOCK covers demo. |

### 🔲 Pending — Critical Path

These must all be green before submission. Order matters.

| # | Task | Blocked by | Notes |
|---|---|---|---|
| 25 | Scout agent (Claude Agent SDK) | 6, 7, 9, 10, 27 | Adapt `kits/claude-agent-sdk/src/{agent,tools,config}.ts`. 5 category tools, each paid via Circle wallet through x402 endpoint. Budget enforcement. Spend ledger accumulation. |
| 8 | End-to-end Circle payment test | 7, 27 | Fund wallet → `getWalletBalance` → `payForService` → verify on BaseScan. Blocked on wallet funding decision. |
| 11 | Scout orchestration API (`/api/scout`) | 25 | Replace mock-only route with real agent. POST → ScoutResponse. Mock-only scaffold already exists. |
| 19 | Verify USE_MOCK demo path end-to-end | 5, 11, 12–16 | Full checklist: npm run dev, enter "Notion", verify all panels render, <10s, no console errors. |

### 🔲 Pending — Stream E (Pitch, Demo, Deploy)

| # | Task | Notes |
|---|---|---|
| 17 | README | Prize eligibility per track, setup instructions, env vars, Circle CLI setup. |
| 18 | Pitch deck | 4 slides, 3-min pitch: problem, solution, tech stack, live demo. Export as PDF. |
| 20 | Video walkthrough | ~60s screen capture of full mock flow. |
| 21 | Vercel deploy | `USE_MOCK=true` public instance. All env vars set in Vercel dashboard. |

### 🔲 Pending — Stream F (OOBE / Agent Infra)

| # | Task | Notes |
|---|---|---|
| 22 | OOBE Synapse RPC | Integrate as additional x402 data source, paid from Circle wallet. |
| 23 | ERC-8004 agent identity | Register Scout in ERC-8004 Identity + Reputation + Validation registries on Base. |
| 24 | MCP endpoint | `scout_analysis` tool wrapping `/api/scout`. stdio + HTTP. |

### ⏭ Optional / Stretch

| # | Task |
|---|---|
| 26 | List `/api/premium-search` on Circle Agent Marketplace |

---

## What Exists Right Now

### Files created / modified

```
.env.example                          — all env vars documented
.env.local                            — USE_MOCK=true, TAVILY_API_KEY set (gitignored)
.gitignore                            — excludes node_modules, .next, .env.local
data/mock_brief.json                  — realistic Notion brief (demo fallback)
lib/types.ts                          — shared TypeScript types (ScoutResponse, SpendEntry, etc.)
lib/tavily/search.ts                  — searchCategory() with 5 templates, mock fallback
lib/tavily/index.ts                   — re-exports searchCategory, buildQuery, TavilyResult
lib/nebius/synthesis.ts               — synthesizeBrief() via Nebius Token Factory, mock fallback
lib/nebius/index.ts                   — re-exports synthesizeBrief, SynthesisResult
lib/circle/cli.ts                     — runCircle(), runCircleJson(), CircleCliError
lib/circle/types.ts                   — AgentWallet, TokenBalance, PaymentResult, etc.
lib/circle/chains.ts                  — Chain type, DEFAULT_CHAIN='BASE', helpers
lib/circle/auth.ts                    — ensureSession(), sessionStatus(), logout()
lib/circle/browser.ts                 — openInBrowser() for Transak URL
lib/circle/wallet.ts                  — createWallet(), listWallets(), getBalance(), etc.
lib/circle/gateway.ts                 — gatewayBalance(), gatewayDeposit()
lib/circle/services.ts                — searchServices(), payService(), fetchService(), etc.
lib/circle/payment.ts                 — payForService(), getWalletBalance(), getAgentWalletAddress()
lib/circle/index.ts                   — re-exports all of the above
app/api/scout/route.ts                — POST handler: returns mock data (5s delay) when USE_MOCK=true
app/api/premium-search/route.ts       — withX402 POST handler, ExactEvmScheme eip155:8453, 0.001 USDC
app/page.tsx                          — full dashboard UI
app/layout.tsx                        — metadata updated, dark class added
components/CompetitiveBrief.tsx       — 6-section brief with skeletons + stagger animation
components/ResearchQueries.tsx        — 5-query panel with category badges
components/SpendLedger.tsx            — spend entries, receipts, budget bar
```

### What the app does right now (USE_MOCK=true)

1. User enters a company name + optional focus + budget (1–10 USDC)
2. Clicks "Start Research"
3. Progress feed animates through 6 steps (search → synthesize)
4. After ~5s the mock Notion brief populates in the two-column layout
5. Competitive brief fades in section by section
6. Research queries panel shows the 5 category queries
7. Spend ledger shows 5 entries with mock BaseScan receipt links and budget bar

### What is NOT wired yet

- No Scout agent (`lib/agent/` is still a placeholder) — task #25
- `/api/scout` returns hardcoded mock — real agent invocation comes in #11 (needs #25 first)
- Circle wallet is provisioned but unfunded — live payments deferred, USE_MOCK covers demo
- Nebius API key not yet set in `.env.local` — waiting on promo code
- OOBE, ERC-8004, MCP not started

---

## Critical Path Reminder

```
#25 (Scout agent) → #11 (real /api/scout) → #19 (demo verify)
```

Prerequisites already done: #27 (Circle CLI), #6 (x402 endpoint), #7 (Circle tools), #9 (Tavily), #10 (Nebius).

**Ecosystem kit location:** `~/Downloads/agent-stack-ecosystem-kits-main`
- Adapt: `kits/claude-agent-sdk/src/{agent,tools,config}.ts` → `/lib/agent/`
