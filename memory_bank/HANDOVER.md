# Scout — Handover Document

Move this entire directory into a new repo and start from here.

---

## What Scout Is

An **autonomous competitive intelligence agent**. The user enters a company name and a research budget. The Claude Agent SDK agent breaks the research into paid sub-queries across five categories (competitors, recent moves, customer sentiment, pricing, tech signals), pays for each Tavily search via a Circle Agent Wallet (x402 nanopayments), synthesizes a structured competitive brief with Nebius Token Factory, and returns the brief with a spend ledger showing what each insight cost and why.

**Solo build. AI-agent-assisted.**

---

## What's Already Done

- **Next.js 16 scaffold** — App Router, TypeScript, Tailwind v4, Shadcn UI (button, card, badge, skeleton), `npm run dev` verified working
- **Folder structure** — `/lib/agent`, `/lib/circle`, `/lib/whale` (ignore), `/lib/tavily`, `/lib/nebius`, `/lib/oobe`, `/lib/erc8004`, `/lib/mcp`, `/components`, `/data` all created with placeholder `index.ts` files
- **Plan + task research** — all decisions documented in `memory_bank/plan.md`

---

## Prize Targets (~$3,000)

| Prize | Track | How we qualify |
|---|---|---|
| $1,000 | Circle — Best Agent Wallet App | Circle Agent Wallet + Nanopayments (x402), budget/spend cap, spend ledger with receipts, Claude Agent SDK + Agent Stack starter kit |
| $500 | Tavily — Agentic Search | Tavily API for competitive search (5 paid queries per run) |
| $1,000 | Nebius — TokenFactory | Nebius Token Factory directly (Fast tier) for brief synthesis |
| $500 + RPC | OOBE Protocol — Agent Infra | Synapse RPC (x402) + ERC-8004 agent identity + MCP endpoint |

---

## Key Technical Decisions (already settled)

| Decision | Choice | Why |
|---|---|---|
| Chain | Base mainnet | Circle Nanopayments is mainnet-only |
| Circle auth | Circle CLI (email + OTP) | No API key — creds in `~/.circle` |
| Agent framework | Claude Agent SDK | Required by Circle track; API-key auth only (keeps subprocess non-interactive) |
| x402 | `@x402/next` + `@coinbase/x402` facilitator, v2 | Official SDK, do not hand-roll |
| Nebius | Token Factory directly, "Fast" tier | NOT via OpenRouter — required for prize eligibility |
| circle-tools | Vendor from ecosystem kit | `packages/circle-tools` from `~/Downloads/agent-stack-ecosystem-kits-main` — shells out to Circle CLI, no runtime npm deps |
| Scout agent | Adapt from ecosystem kit | `kits/claude-agent-sdk/src/{agent,tools,config}.ts` — same scenario |
| Demo safety | `USE_MOCK=true` | Bypasses all live calls → `data/mock_brief.json`; demo never breaks |

---

## Architecture

```
/app/api/premium-search   → x402-gated search endpoint (@x402/next v2)
/app/api/scout            → Orchestration endpoint (invokes the agent)
/lib/agent                → Claude Agent SDK Scout agent
/lib/circle               → Circle Agent Wallet + Nanopayments (vendored circle-tools)
/lib/tavily               → Competitive search (5 categories)
/lib/nebius               → Brief synthesis (Nebius Token Factory)
/lib/oobe                 → Synapse RPC x402 data source
/lib/erc8004              → ERC-8004 agent identity
/lib/mcp                  → MCP server (scout-analysis tool)
/components               → UI panels
/data/mock_brief.json     → Demo fallback data
```

---

## Agent Flow

1. User enters: company name + optional focus + budget (USDC)
2. Scout agent plans 5 research queries (one per category)
3. For each query: pay via Circle Nanopayment → x402-gated endpoint → Tavily search → collect results
4. Budget check: refuse low-priority queries if near cap
5. Nebius synthesizes all results → structured competitive brief
6. Return: brief + spend ledger (query, category, cost, reason, receipt per line)

---

## Research Categories (the 5 paid queries)

| Category | Example Tavily query |
|---|---|
| competitors | `"{company} competitors alternatives 2026"` |
| recentMoves | `"{company} product launch announcement news last 30 days"` |
| sentiment | `"{company} user reviews complaints praise Reddit"` |
| pricing | `"{company} pricing plans cost tiers 2026"` |
| techSignals | `"{company} tech stack engineering blog infrastructure"` |

---

## Environment Variables

Create `.env.local` (never commit):

```bash
# Chain (Circle is Base mainnet only)
BASE_MAINNET_RPC_URL=
CHAIN_ID=8453

# USDC on Base mainnet
USDC_ADDRESS_MAINNET=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# Circle Agent Stack — auth is via Circle CLI (NO API key)
# Do the one-time setup in task #27 before running live Circle flows
# CIRCLE_CLI_HOME=            # optional: override ~/.circle
AGENT_SPEND_BUDGET_USDC=5    # operating budget / spend cap

# Anthropic — Claude Agent SDK (API key auth ONLY, not OAuth)
ANTHROPIC_API_KEY=
# LLM_MODEL=                  # optional, default: claude-sonnet-4-6

# x402 facilitator
X402_FACILITATOR_URL=https://x402.org/facilitator

# Nebius Token Factory — direct (NOT OpenRouter)
NEBIUS_BASE_URL=https://api.tokenfactory.nebius.com/v1
NEBIUS_API_KEY=

# Tavily
TAVILY_API_KEY=

# OOBE Synapse RPC
SYNAPSE_RPC_URL=

# Demo mode — set true to bypass all live API/payment calls
USE_MOCK=true
```

---

## One-Time Host Setup for Circle (task #27)

Do this before any live Circle flows (tasks #7, #8, #25):

```bash
npm i -g @circle-fin/cli        # or: bun add -g @circle-fin/cli
# Install Circle Agent Skill (follow CLI prompts)
# Log in with email + OTP and accept ToU
# Create agent wallet on Base mainnet
# Fund wallet with small USDC (a few dollars — nanopayments are sub-cent)
```

Credentials stored in `~/.circle`. The wallet that gets funded is the live demo wallet — decide which machine holds it before the hackathon.

---

## Ecosystem Kit (already cloned locally)

Location: `~/Downloads/agent-stack-ecosystem-kits-main`

Two things to pull from it:
- **`packages/circle-tools/`** → vendor entire `src/` folder into `/lib/circle/` (task #7). Framework-agnostic TS wrappers around the Circle CLI. No runtime npm deps.
- **`kits/claude-agent-sdk/src/`** → adapt `agent.ts`, `tools.ts`, `config.ts` for Scout (task #25). Same scenario: create wallet on Base, check balance, discover x402 service, pay via nanopayment.

Do NOT copy the Bun workspace setup — we stay on npm/Next.js.

---

## Issues to Create in New Repo

Copy these as GitHub issues. Labels to create first:
`setup`, `stream-a`, `stream-b`, `stream-c`, `stream-d`, `stream-e`, `stream-f`, `circle`, `x402`, `tavily`, `nebius`, `oobe`, `erc-8004`, `mcp`, `frontend`, `backend`, `testing`, `demo`, `docs`, `pitch`, `deployment`, `scout`

---

### #1 ✅ DONE — Scaffold Next.js project structure
`labels: setup`

Next.js 16, TypeScript, Tailwind v4, Shadcn UI initialized. All `/lib/*` and `/components` folders created with placeholder `index.ts`. `npm run dev` verified working.

---

### #2 — Configure environment variables
`labels: setup`

Create `.env.example` from the template in the Environment Variables section above. Add `.env.local` to `.gitignore`. Add README section explaining each variable. Document Circle CLI setup (#27) + budget var.

**Blocks:** #5, #6, #7, #8, #9, #10, #11, #25

---

### #5 — Pre-bake mock_brief.json demo fallback
`labels: stream-a, scout, demo`

Generate and commit `data/mock_brief.json` — realistic hardcoded Scout response for `USE_MOCK=true`. Use "Notion" as the example company. Must match this shape exactly:

```ts
type MockScoutResponse = {
  company: string
  researchFocus: string
  budget: number
  brief: {
    overview: string
    competitors: { name: string; summary: string }[]
    recentMoves: { date: string; event: string; source: string }[]
    sentiment: { score: number; summary: string }
    pricing: { summary: string; tiers: string[] }
    techSignals: { summary: string; signals: string[] }
  }
  spendLedger: {
    query: string; category: string; cost: number
    reason: string; receipt: string
  }[]
  totalSpent: number
  remainingBudget: number
}
```

Spend ledger needs 5 entries (one per category). Receipts should be realistic-looking (non-404) mock tx hashes.

**Blocks:** #19

---

### #6 — Build x402-gated premium search endpoint
`labels: stream-b, x402, circle`
**Blocked by:** #1, #2

Implement `/app/api/premium-search/route.ts` — x402-gated endpoint using `@x402/next` middleware (v2), verified by `@coinbase/x402` facilitator. Returns Tavily search results for a given query + category. No hand-rolled 402. Config: ~0.001 USDC per call, `payTo` = Circle agent wallet, Base mainnet.

- POST body: `{ query: string; category: ResearchCategory }`
- 402 when unpaid → 200 + TavilyResult[] when paid

**Blocks:** #7, #25, #26

---

### #7 — Integrate Circle Agent Wallet + Nanopayments payment layer
`labels: stream-b, circle`
**Blocked by:** #6, #27

Vendor `packages/circle-tools` from the ecosystem kit into `/lib/circle`. Implement `payForService(url)` → `{ data, receipt }` and `getWalletBalance()`. Gasless nanopayments on Base mainnet. Refuse spend when over budget. No raw private key — the Circle CLI handles signing.

**Blocks:** #8, #25

---

### #8 — End-to-end Circle Agent Wallet payment test (Base mainnet)
`labels: stream-b, x402, testing`
**Blocked by:** #7, #27

Integration test: fund wallet (#27) → `getWalletBalance` → `payForService('/api/premium-search')` → 402 → nanopayment → results + receipt → verify on BaseScan. Test budget enforcement and failure cases. Document steps in README.

**Blocks:** #19

---

### #9 — Integrate Tavily: competitive search queries
`labels: stream-c, tavily`
**Blocked by:** #1, #2

Implement `/lib/tavily/search.ts`. Function `searchCategory({ company, category, focus? })` → `TavilyResult[]`. Five category query templates. `search_depth: "advanced"`. Falls back to mock data when `USE_MOCK=true`.

**Blocks:** #25

---

### #10 — Integrate Nebius Token Factory: brief synthesis
`labels: stream-c, nebius`
**Blocked by:** #1, #2

Implement `/lib/nebius/synthesis.ts`. Function `synthesizeBrief({ company, results })` → `{ brief: CompetitiveBrief, model }`. Six-section structured output. Direct Token Factory API (NOT OpenRouter), "Fast" tier. Falls back to mock when `USE_MOCK=true`. Returns model name for judge verification.

**Blocks:** #25

---

### #11 — Build Scout orchestration API endpoint
`labels: stream-c, backend`
**Blocked by:** #25

Implement `/app/api/scout/route.ts`. POST `{ company, focus?, budgetUSDC }` → `ScoutResponse` (brief + spendLedger + totalSpent + remainingBudget). Invokes the Scout agent (#25). Mock mode < 5s. Stream progress updates if possible.

**Blocks:** #19

---

### #25 — Build Scout agent (Claude Agent SDK)
`labels: stream-b, circle, scout`
**Blocked by:** #6, #7, #9, #10, #27

Build `/lib/agent` — adapt from `kits/claude-agent-sdk/src/{agent,tools,config}.ts`. Claude Agent SDK agent with 5 tools (one per research category), each paid via Circle Agent Wallet (#7) through the x402 search endpoint (#6). Budget management: check balance before each call, refuse if over cap. Spend ledger records every call (query, category, cost, reason, receipt). API-key auth only (`ANTHROPIC_API_KEY`). Mock mode returns mock ledger without live spend.

**Blocks:** #11, #19

---

### #26 — (Optional) List service on Circle Agent Marketplace
`labels: stream-b, circle`
**Blocked by:** #6, #7

Stretch goal. List `/api/premium-search` on the Circle Agent Marketplace so the agent discovers it rather than calling a hardcoded URL. Document listing for judges.

---

### #27 — Circle CLI + Agent Skill host setup
`labels: stream-b, circle, setup`

One-time host prerequisite. Install Circle CLI globally, install Agent Skill, log in (email + OTP), accept ToU, create + fund agent wallet on Base mainnet. Document steps in README. Decide which machine holds the funded wallet before the hackathon.

**Blocks:** #7, #8, #25

---

### #12 — Build Scout dashboard scaffold
`labels: stream-d, frontend, scout`
**Blocked by:** #1

Implement `/app/page.tsx` — dark single-page UI. Header: Scout logo, company input, optional focus textarea, budget slider (1–10 USDC), "Start Research" button. Main: two-column — competitive brief left, research queries + spend ledger right. Footer: prize track badges (Circle, Tavily, Nebius, OOBE). Design: `#0a0a0a` bg, accent `#3b82f6`, monospace for receipts, 1280×800. Skeleton loaders for all panels.

**Blocks:** #13, #14, #15, #16

---

### #13 — Build competitive brief display
`labels: stream-d, frontend`
**Blocked by:** #12

Implement `/components/CompetitiveBrief.tsx`. Six accordion or tab sections: Overview, Top Competitors (cards), Recent Moves (timeline), Customer Sentiment (score + summary), Pricing Intel (tier table), Tech Signals (tag list). Animates in section by section as data arrives.

---

### #14 — Build research queries panel
`labels: stream-d, frontend, tavily`
**Blocked by:** #12

Implement `/components/ResearchQueries.tsx`. Shows each of the 5 category queries the agent ran: category badge, query text, top 2 sources returned. "Powered by Tavily" attribution. Loading skeleton while agent is running.

---

### #15 — Build spend ledger panel
`labels: stream-d, frontend, circle`
**Blocked by:** #12

Implement `/components/SpendLedger.tsx`. Line items: category, cost in USDC, reason the agent decided to buy it, receipt link to BaseScan. Running total at bottom. Remaining budget bar. "Powered by Circle Agent Wallet" badge.

---

### #16 — Build Start Research button + progress animation
`labels: stream-d, frontend, scout`
**Blocked by:** #12, #25

Implement `/components/ResearchButton.tsx`. When clicked: streams progress ("Searching competitors... (paid 0.001 USDC)" → "Searching recent moves..." → ... → "Synthesizing brief..."). Budget remaining updates live. Disable button while running. Error state if over budget or API fails.

---

### #17 — Write README with prize track documentation
`labels: stream-e, docs`

Sections: what Scout does; prize eligibility (Circle: Agent Wallet + Nanopayments + Claude Agent SDK + spend ledger; Tavily: 5-category search; Nebius: Token Factory brief synthesis; OOBE: Synapse + ERC-8004 + MCP); setup instructions (clone → .env.local → #27 → npm run dev); how to run live Circle payment test (#8); team & tools.

---

### #18 — Create pitch deck
`labels: stream-e, pitch`

4 slides, 3-minute pitch:
1. **Problem** — Competitive research takes hours; most tools give you a wall of links, not a brief
2. **Solution** — Scout: enter a company name + budget → agent pays for targeted research → structured brief + receipts in <30 seconds
3. **Tech stack** — Circle Agent Wallet + Nanopayments (x402), Tavily (5-category search), Nebius Token Factory, OOBE (Synapse + ERC-8004 + MCP), Base chain
4. **Live demo** — spend ledger + competitive brief + receipt

Export as PDF, commit to repo.

---

### #19 — Verify USE_MOCK demo path end-to-end
`labels: stream-e, demo, testing`
**Blocked by:** #5, #8, #11, #12, #13, #14, #15, #16, #22, #23, #24, #25

Full checklist with `USE_MOCK=true`:
- [ ] `npm run dev` starts cleanly
- [ ] Enter "Notion" → click Start Research
- [ ] All 5 category queries appear in Research Queries panel
- [ ] Competitive brief displays all 6 sections
- [ ] Spend ledger shows 5 entries with mock receipts + remaining budget
- [ ] No console errors; all BaseScan links are realistic (non-404)
- [ ] Full flow completes in under 10 seconds

**Blocks:** #20, #21

---

### #20 — Record video walkthrough
`labels: stream-e, demo`
**Blocked by:** #19

~60s screen capture: Enter "Notion" + $5 budget → Start Research → queries populate → brief builds out section by section → spend ledger with receipts. Narrate each prize track (Circle, Tavily, Nebius, OOBE). Link in README.

---

### #21 — Deploy to Vercel (live demo URL)
`labels: stream-e, deployment`
**Blocked by:** #1, #2, #19

Connect repo to Vercel. Set all env vars in Vercel dashboard with `USE_MOCK=true`. Public URL loads Scout with mock data end-to-end. Live URL in README and pitch deck. Note: live Circle payments stay on the local pitch machine (Circle CLI is host-bound).

---

### #22 — Integrate OOBE Synapse RPC as x402 data source
`labels: stream-f, oobe, x402`
**Blocked by:** #2, #7

Integrate OOBE Synapse RPC (x402-powered Solana data layer) as an additional paid data source, paid from the Circle wallet. Adds cross-chain signal to Scout briefs (e.g. on-chain activity or sentiment for crypto-native companies). Mock fallback when `USE_MOCK=true`. Document for OOBE judges.

---

### #23 — Register Scout as an ERC-8004 trustless agent
`labels: stream-f, erc-8004, oobe`
**Blocked by:** #1, #2

Register Scout in ERC-8004 Identity + Reputation + Validation registries on Base. Reference: https://github.com/erc-8004/erc-8004-contracts. Identity: ERC-721 with tokenURI → registration file (agent name, description, endpoint). Post a reputation signal after each research run. Surface on-chain identity in UI footer.

---

### #24 — Expose scout-analysis as MCP endpoint
`labels: stream-f, mcp, oobe`
**Blocked by:** #11

MCP server with a `scout_analysis` tool wrapping `/app/api/scout`. Input `{ company, focus?, budgetUSDC }` → `ScoutResponse`. Document connection (stdio and/or HTTP). Optional: x402-gate the tool so other agents pay to call Scout.

---

## Start Order

```
Immediately (no blockers):
  #2  env vars
  #5  mock data
  #9  Tavily
  #10 Nebius
  #12 dashboard scaffold
  #17 README
  #18 pitch deck
  #27 Circle CLI host setup (whenever you're at the venue machine)

After #2 + #27:
  #6  → #7 → #25 → #11   (critical path — Circle chain)
  #8                       (depends on #7 + #27)

After #12:
  #13, #14, #15, #16      (frontend panels, parallel)

After #1 + #2:
  #23 ERC-8004
  #22 Synapse (after #7)
  #24 MCP (after #11)

Last:
  #19 (full demo verify) → #20 (video) → #21 (Vercel)
```

## Critical Path

`#2 → #27 → #6 → #7 → #25 → #11 → #19`

The Circle chain (#27 → #6 → #7 → #25) is the spine. Start it the moment you're at your venue machine with the Circle CLI.
