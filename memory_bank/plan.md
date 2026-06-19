# Scout — Project Plan

## Overview
**Scout** is an autonomous competitive intelligence agent. The user enters a company name and a research budget. The Claude Agent SDK agent breaks the research into strategic sub-queries across five categories, pays for each Tavily search individually via a Circle Agent Wallet (x402 Nanopayments), synthesizes a structured competitive brief with Nebius Token Factory, and returns the brief with a spend ledger showing what each insight cost and why it was worth buying.

**Solo project. AI-agent-assisted build.**

## Prize Targets
| Prize | Track | Requirement |
|---|---|---|
| $1,000 | Circle — Best Agent Wallet App | Circle Agent Wallet + Nanopayments (x402), budget/spend cap, spend ledger w/ receipts, Agent Stack starter kit |
| $500 | Tavily — Agentic Search | Tavily API — competitive search queries per category |
| $1,000 | Nebius — TokenFactory | Direct Nebius Token Factory LLM — competitive brief synthesis |
| $500 + RPC | OOBE Protocol — Agent Infra | Synapse RPC (x402) + ERC-8004 agent identity + MCP endpoint |

## Key Decisions
- **Chain:** Base mainnet (Circle Nanopayments is mainnet-only; nanopayments are gasless/sub-cent)
- **Circle auth:** Circle CLI (email + OTP, creds in `~/.circle`) — NO API key. One-time host setup: task #27.
- **Agent framework:** Claude Agent SDK. API-key auth only (`ANTHROPIC_API_KEY`) — the SDK spawns a Claude Code subprocess; OAuth path can hang.
- **x402:** Official Coinbase x402 SDK (`@x402/next` for the paid search endpoint, `@coinbase/x402` facilitator) — protocol v2.
- **Nebius:** Nebius Token Factory directly (OpenAI-compatible API, "Fast" tier). NOT via OpenRouter.
- **circle-tools:** Vendor `packages/circle-tools` from the Agent Stack ecosystem kit into `/lib/circle`. It shells out to the Circle CLI (no runtime npm deps) → npm-compatible, no Bun.
- **Stack:** Next.js 16 + TypeScript + Tailwind v4 + Shadcn UI + Recharts (if needed)
- **Demo safety:** `USE_MOCK=true` in `.env.local` bypasses all live API/payment calls → uses `data/mock_brief.json`. The demo never breaks.

## Research Categories (the five paid queries)
The Scout agent buys one Tavily search per category:
1. **competitors** — who are the rivals?
2. **recentMoves** — what did they ship or announce in the last 30 days?
3. **sentiment** — what are customers saying?
4. **pricing** — what do they charge?
5. **techSignals** — what is their tech stack / engineering direction?

Each is a separate x402-paid call → each appears as a line item in the spend ledger.

## Architecture
```
/app                        → Next.js pages and layouts
/app/api/premium-search     → x402-gated search endpoint (via @x402/next)
/app/api/scout              → Main orchestration endpoint (invokes the agent)
/lib/agent                  → Claude Agent SDK Scout agent (adapted from ecosystem kit)
/lib/circle                 → Circle Agent Wallet + Nanopayments (vendored circle-tools)
/lib/tavily                 → Competitive search queries (5 categories)
/lib/nebius                 → Competitive brief synthesis (Token Factory)
/lib/oobe                   → Synapse RPC x402 data source
/lib/erc8004                → ERC-8004 agent identity + reputation
/lib/mcp                    → MCP server exposing scout-analysis tool
/components                 → UI components
/data                       → mock_brief.json (demo fallback)
```

## Agent Wallet Setup (one-time, before tasks #7/#8/#25 can run)
See task #27. Requires:
- Circle CLI installed globally
- Circle Agent Skill installed
- Email + OTP login; accept ToU
- Agent wallet created on Base mainnet and funded with small USDC

## API Endpoint Keys
- Tavily API key: from https://tavily.com
- Nebius Token Factory API key: from https://tokenfactory.nebius.com
- BaseScan API key: not needed (no on-chain data fetching in Scout)
- Anthropic API key: from https://console.anthropic.com/settings/keys

## Key References
- Circle Agent Stack: https://developers.circle.com/agent-stack
- Ecosystem kit (local): `~/Downloads/agent-stack-ecosystem-kits-main`
  - Vendor: `packages/circle-tools` → `/lib/circle`
  - Adapt: `kits/claude-agent-sdk/src/*` → `/lib/agent`
- x402 SDK: https://github.com/coinbase/x402
- Nebius Token Factory docs: https://docs.tokenfactory.nebius.com/ai-models-inference/overview
- OOBE Synapse RPC: https://synapse.oobeprotocol.ai/
- ERC-8004 contracts: https://github.com/erc-8004/erc-8004-contracts

## Tasks

### Setup
- `#1` ✅ DONE — Scaffold Next.js project (Next 16 + TypeScript + Tailwind v4 + Shadcn)
- `#2` ✅ DONE — Configure environment variables

### Stream A — Scout Agent Core
- `#5` ✅ DONE — Pre-bake `data/mock_brief.json` demo fallback

### Stream B — Circle Agentic Commerce
- `#27` ✅ DONE — Circle CLI + Agent Skill host setup (CLI installed, logged in, wallet provisioned on Base mainnet — funding deferred)
- `#6` ✅ DONE — Build x402-gated premium search endpoint (`@x402/next`, v2)
- `#7` ✅ DONE — Integrate Circle Agent Wallet + Nanopayments (vendor circle-tools)
- `#8` — End-to-end Circle Agent Wallet payment test (Base mainnet) — blocked on wallet funding
- `#25` — Build Scout agent (Claude Agent SDK): 5 category tools, budget, spend ledger
- `#26` — (Optional) List & discover service via Circle Agent Marketplace

### Stream C — Tavily + Nebius
- `#9` ✅ DONE — Integrate Tavily: competitive search queries (5 categories)
- `#10` ✅ DONE — Integrate Nebius Token Factory: competitive brief synthesis
- `#11` — Build Scout orchestration API endpoint (`/app/api/scout`) — blocked on #25

### Stream D — Frontend
- `#12` ✅ DONE — Build Scout dashboard scaffold (company input, budget input, research button)
- `#13` ✅ DONE — Build competitive brief display (6 sections: overview, competitors, moves, sentiment, pricing, tech)
- `#14` ✅ DONE — Build research queries panel (what agent searched + cost per query)
- `#15` ✅ DONE — Build spend ledger panel (line items: query, category, cost, reason, receipt)
- `#16` ✅ DONE — Build "Start Research" button + progress animation + budget display

### Stream E — Pitch, Demo & Deploy
- `#17` — Write README with prize track documentation
- `#18` — Create pitch deck (4 slides)
- `#19` — Verify USE_MOCK demo path end-to-end
- `#20` — Record video walkthrough
- `#21` — Deploy to Vercel (USE_MOCK=true public instance)

### Stream F — OOBE / Agent Infrastructure
- `#22` — Integrate OOBE Synapse RPC as an additional x402 data source
- `#23` — Register Scout as an ERC-8004 trustless agent on Base
- `#24` — Expose scout-analysis as an MCP endpoint

> **Critical path:** #2 → #27 → #6 → #7 → #25 → #11 → #19
> **Start immediately (no blockers):** #5, #9, #10, #12, #17, #18
> **Integration checkpoint:** #25 + #11 + #19 must be green well before submission
