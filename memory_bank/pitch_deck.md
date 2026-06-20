# Scout — Pitch Deck

---

## Slide 1 — Problem

### Competitive research is not broken. But it's annoying!

You need to know what your rivals are doing. So you spend **hours** Googling, reading, tab-switching, coppying text blocks, adding links — and you end up with a mess, not a brief. Writing the brief takes additional **hours**.

Existing tools either:
- Give you raw search results (still your job to synthesise)
- Generate reports that contain imainary data
- Lock the good stuff behind expensive SaaS subscriptions

**The real problem:** There is no autonomous agent that can *go pay for the research itself*, synthesise it, and hand you a structured brief — with receipts (both fiscal and for resources).

---

## Slide 2 — Solution

### Meet Scout.

> Enter a company name and a budget. Scout does the rest.

1. **Scout plans** — breaks research into 5 strategic categories: competitors, recent moves, customer sentiment, pricing, tech signals
2. **Scout pays** — uses a Circle Agent Wallet to make x402 nanopayments for each search query (0.01 USDC per query)
3. **Scout searches** — Tavily advanced search, one paid query per category
4. **Scout synthesises** — Nebius Token Factory turns raw results into a structured competitive brief
5. **Scout reports** — returns the full brief + a spend ledger showing exactly what each insight cost and why it was worth buying

**From blank input to structured competitive brief in under 30 seconds.**

---

## Slide 3 — Tech Stack

### Built on the right primitives.

| Layer | Technology | What it does |
|---|---|---|
| 💳 Payments | **Circle Agent Wallet + x402 Nanopayments** | Agent pays 0.01 USDC per search via EIP-3009 signed transfers on Base. Spend ledger with BaseScan receipts. Budget cap enforced. |
| 🔍 Search | **Tavily Agentic Search** | 5-category advanced search — competitors, moves, sentiment, pricing, tech signals. Real-time web results, not a static dataset. |
| 🧠 Synthesis | **Nebius Token Factory** | Direct Token Factory API (Fast tier, `Qwen/Qwen3-30B-A3B-Instruct-2507`). Turns raw search results into a structured JSON brief. |
| 🔗 Chain | **Base (mainnet / Sepolia)** | Gasless USDC nanopayments. Every payment verifiable on BaseScan. |
| 🌐 Agent Infra | **OOBE Synapse RPC + ERC-8004** | x402-gated data layer + on-chain agent identity and reputation registry. |
| 🤖 Agent SDK | **Claude Agent SDK** | Orchestrates the full 5-step research loop with budget management. |

**Every line item in the spend ledger is a real on-chain payment.**

---

## Slide 4 — Live Demo

### Watch it pay for its own research.

**Demo:** `scout-two-mocha.vercel.app`

Input:
```
Company:  Stripe
Budget:   $1.00 USDC
```

What you'll see:

- ⏱ **< 30 seconds** — full research cycle completes
- 🔍 **5 Tavily queries** run in sequence, one per category
- 💳 **5 x402 payments** — 0.01 USDC each, paid from Circle Agent Wallet
- 📄 **Competitive brief** — overview, competitors, recent moves, sentiment, pricing, tech signals
- 🧾 **Spend ledger** — category, cost, reason the agent decided to buy it, BaseScan receipt link
- 💰 **Total spent: 0.05 USDC** — remaining budget displayed

> "Scout doesn't just search the web. It pays for the search, synthesises the results, and shows you the receipt."

---

## Prize Tracks

| Prize | Amount | How Scout qualifies |
|---|---|---|
| Circle — Best Agent Wallet App | **$1,000** | Circle Agent Wallet, x402 nanopayments, budget cap, spend ledger with receipts, Claude Agent SDK |
| Tavily — Agentic Search | **$500** | 5-category advanced search, agentic query planning per run |
| Nebius — TokenFactory | **$1,000** | Direct Token Factory API (not OpenRouter), Fast tier, structured output |
| OOBE — Agent Infra | **$500** | Synapse RPC (x402 data layer), ERC-8004 agent identity, MCP endpoint |
| **Total target** | **$3,000** | |

---

*Scout — Autonomous Competitive Intelligence. Pay per query. Receipt included.*
