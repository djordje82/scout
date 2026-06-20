# Scout — Autonomous Competitive Intelligence Agent

Scout is an autonomous AI agent that maps a competitive landscape on demand. Enter a company name and a USDC budget; Scout breaks the research into five paid sub-queries, buys each Tavily search individually via x402 nanopayments from a Circle Agent Wallet, synthesizes a structured brief with a Nebius Token Factory LLM, and returns every insight with a spend ledger showing what each piece of intelligence cost and why it was worth buying.

**Live demo:** https://scout-demo.vercel.app (mock mode — no wallet required)

---

## Prize Tracks

| Prize | Sponsor | Requirement | How Scout qualifies |
|---|---|---|---|
| $1,000 | Circle — Best Agent Wallet App | Circle Agent Wallet + x402 nanopayments, budget cap, spend ledger with receipts | Agent wallet pays per search; ledger shows USDC spent per category with Base tx receipt links |
| $500 | Tavily — Agentic Search | Tavily API for agentic, multi-step search | 5 strategic search queries per research session (competitors, recent moves, sentiment, pricing, tech signals), each paid via x402 |
| $1,000 | Nebius — Token Factory | Direct Nebius Token Factory LLM inference | Qwen3-30B synthesises raw search results into a structured competitive brief (JSON schema) |
| $500 + RPC | OOBE Protocol — Agent Infra | Synapse RPC + ERC-8004 agent identity + MCP endpoint | *(stretch)* Synapse x402 data source, ERC-8004 identity registry, scout_analysis MCP tool |

---

## How It Works

```
User: "Research Stripe, budget $0.01"
     │
     ▼
/api/scout  →  runScout()
     │
     ├─ for each of 5 categories:
     │     ├─ buildQuery(company, category, focus)
     │     ├─ Circle Agent Wallet signs x402 payment (0.001 USDC)
     │     ├─ POST /api/premium-search  (x402-gated, ExactEvmScheme)
     │     ├─ Tavily search runs → results
     │     └─ spendLedger.push({ category, cost, txHash })
     │
     └─ synthesizeBrief(company, allResults, focus)
           └─ Nebius Qwen3-30B → CompetitiveBriefData (JSON)
```

Each Tavily search costs $0.001 USDC and is paid as an x402 nanopayment on Base (or Base Sepolia in testnet mode). The Circle Agent Wallet signs the EIP-3009 authorization; the x402.org facilitator settles on-chain. No gas required from the caller.

---

## Architecture

```
app/
  page.tsx                  — dashboard UI (company input, budget, results)
  api/
    scout/route.ts          — orchestration endpoint → runScout()
    premium-search/route.ts — x402-gated Tavily search (0.001 USDC/call)

lib/
  agent/index.ts            — runScout(): 5-category loop, budget cap, spend ledger
  tavily/                   — searchCategory(), buildQuery(), 5 query templates
  nebius/                   — synthesizeBrief() via Token Factory API
  circle/                   — Agent Wallet CLI wrapper: payForService(), getWalletBalance()
  network.ts                — NETWORK env var → Base mainnet or Base Sepolia config

components/
  CompetitiveBrief.tsx      — 6-section brief with skeleton loaders
  SpendLedger.tsx           — per-entry USDC cost + BaseScan receipt links
  ResearchQueries.tsx       — what Scout searched and why

data/
  mock_brief.json           — realistic demo fallback (USE_MOCK=true)
```

---

## Setup

### Prerequisites

- Node.js 20+
- [Circle CLI](https://developers.circle.com/agent-stack/docs/circle-cli) installed globally:
  ```bash
  npm install -g @circle-fin/cli
  circle terms accept
  circle wallet login <your-email>
  ```
- API keys for Tavily and Nebius (see below)

### Install & run

```bash
git clone https://github.com/djordje82/scout
cd scout
npm install
cp .env.example .env.local
# Edit .env.local — at minimum set USE_MOCK=true for the demo
npm run dev
```

Open http://localhost:3000

### Running in mock mode (no wallet required)

Set `USE_MOCK=true` in `.env.local`. The agent runs a pre-baked Notion competitive brief through a 4.5-second animation — no API keys or wallet needed. Ideal for demos.

### Running live (real USDC payments)

1. Set `USE_MOCK=false` in `.env.local`
2. Log in to the Circle CLI:
   ```bash
   # Testnet (free faucet USDC at https://faucet.circle.com):
   circle wallet login <email> --testnet
   NETWORK=testnet

   # Mainnet:
   circle wallet login <email>
   NETWORK=mainnet
   ```
3. Fund your agent wallet with USDC (0.005 USDC covers a full 5-category run)
4. Set `AGENT_WALLET_ADDRESS` to your wallet address
5. Set your Tavily and Nebius API keys
6. Run `npm run dev` and click "Start Research"

Each research session costs $0.005 USDC (5 searches × $0.001).

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
# Demo mode — set true to skip all API calls and payments
USE_MOCK=true

# Network — mainnet (default) or testnet (free faucet USDC)
NETWORK=mainnet
NEXT_PUBLIC_BLOCK_EXPLORER=https://basescan.org

# Circle Agent Wallet
AGENT_WALLET_ADDRESS=0x...        # your Circle agent wallet address
AGENT_SPEND_BUDGET_USDC=1        # hard cap (per session limit is set per request)

# x402 facilitator + search endpoint (match the port your dev server runs on)
X402_FACILITATOR_URL=https://x402.org/facilitator
PREMIUM_SEARCH_URL=http://localhost:3000/api/premium-search

# Tavily — get a key at https://tavily.com
TAVILY_API_KEY=tvly-...

# Nebius Token Factory — get a key at https://tokenfactory.nebius.com
NEBIUS_BASE_URL=https://api.tokenfactory.nebius.com/v1
NEBIUS_API_KEY=v1....
NEBIUS_MODEL=Qwen/Qwen3-30B-A3B-Instruct-2507   # optional override

# Anthropic (optional — not required for current Scout implementation)
ANTHROPIC_API_KEY=
```

---

## Key Technology Choices

| Component | Choice | Why |
|---|---|---|
| Agent wallet | Circle Agent Wallet + CLI | Smart contract wallet on Base; EIP-3009 signing; x402-native |
| Payment protocol | x402 nanopayments (`@x402/next`) | Per-call micropayments with no gas for the payer; ExactEvmScheme on Base/Base Sepolia |
| Search | Tavily (`search_depth: advanced`) | Purpose-built for agentic retrieval; 5 strategic query templates |
| Synthesis | Nebius Token Factory (Qwen3-30B) | High-quality instruction-following at MoE efficiency; OpenAI-compatible API |
| Framework | Next.js 16 App Router | API routes co-located with UI; server components for data fetching |
| UI | Tailwind v4 + Shadcn | Dark dashboard; skeleton loaders; stagger animations |

---

## Spend Ledger

Every Scout run returns a `spendLedger` array showing:

```json
[
  {
    "category": "competitors",
    "query": "Stripe competitors payments platforms",
    "cost": 0.001,
    "reason": "Map the competitive landscape",
    "receipt": "0xabc123..."
  },
  ...
]
```

Each `receipt` links to the settlement transaction on Base (or Base Sepolia). The UI renders these as clickable BaseScan links.

---

## Export

Research results can be exported as:
- **JSON** — machine-readable, suitable for AI pipelines
- **Markdown** — LLM-ready format for further analysis
- **PDF** — human-readable via browser print

---

## Running Tests

```bash
# Mock flow end-to-end (no API keys needed)
USE_MOCK=true npm run dev
curl -s -X POST http://localhost:3000/api/scout \
  -H "Content-Type: application/json" \
  -d '{"company":"Notion","budgetUSDC":1}' | jq .totalSpent

# Live payment smoke test (testnet)
NETWORK=testnet USE_MOCK=false \
circle services pay http://localhost:3000/api/premium-search \
  --address 0x... --chain BASE-SEPOLIA \
  -X POST -d '{"query":"Stripe","category":"competitors"}' --estimate
```

---

## License

MIT
