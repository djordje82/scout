# Best Agent Wallet Application with Circle Agent Wallet

## Goal

Build an application where an AI agent uses a Circle Agent Wallet to complete a real workflow that requires payments, balances, service discovery, or transaction execution.

Projects should show how agents can hold a wallet, manage a budget, pay for services, and return receipts or transaction logs as part of the work they perform.

Builders should use the Agent Stack starter kits to integrate Agent Wallet into their agent framework of choice, such as OpenAI Agents SDK, Claude Agent SDK, LangChain, Mastra, Vercel AI SDK, or Google ADK.

The best projects will go beyond "an agent sends USDC once." They should show a repeatable workflow where the wallet is part of the agent's job: buying data, accessing APIs, paying another agent, funding compute, triggering actions, or coordinating with other services.

---

## What We're Looking For

- AI agents that use a wallet to pay for API calls, data, inference, compute, or services
- Agents that discover paid services, inspect pricing, pay, and return a receipt or spend ledger
- Agent workflows with budgets, spend caps, approvals, or policy-based payment behavior
- Multi-agent systems where agents pay each other for specialized work
- Agent marketplaces where agents can buy or sell capabilities
- Pay-per-query knowledge bases, RAG systems, research tools, or data agents
- Autonomous business workflows, such as research agents, content agents, sales agents, support agents, or trading/research agents that use USDC payments as part of the workflow
- Clear usage of Circle Agent Wallet as the agent's payment identity and operating budget

---

## Suggested Project Ideas

- **Research Agent with a Budget** — An agent researches a topic, pays for premium data only when useful, and returns a paid-call ledger.
- **Agent-to-Agent Marketplace** — A primary agent hires a research agent, design agent, or analysis agent and pays each one in USDC after completion.
- **Paid RAG / Knowledge Agent** — A knowledge base charges agents per query, per document, or per answer.
- **Autonomous Media Workflow** — An agent finds a trend, pays for social intelligence, drafts content, and returns sources and receipts.
- **Developer API Monetization Agent** — Turn an API into a paid service that other agents can call using USDC.
- **Onchain or Market Intelligence Agent** — An agent pays for market, prediction, or onchain data and produces a decision-ready brief.
- **Agent Expense Manager** — An agent tracks spending, enforces budget limits, and explains why each payment was made.

---

## Required Technical Elements

Projects should include:

- A Circle Agent Wallet
- At least one wallet action, such as balance check, payment, transfer, funding flow, or service payment
- Use of the agent framework starter kit
- A clear agent workflow, not just a standalone payment script
- A receipt, transaction hash, payment log, or spend ledger
- A short explanation of what the agent paid for and why
- Clear proof of how Circle Agent Stack tools are used in the project, including any relevant use of:
  - Circle CLI
  - Circle Skills
  - Circle Agent Wallet
  - Circle Agent Marketplace
  - Agent Nanopayments
  - Agent Stack starter kits

---

## Recommended Starting Point

Builders should start from the Agent Stack ecosystem starter kits, which provide framework-specific examples for using Circle Agent Wallet and Circle services inside agent applications.

The starter kits help builders:

- Create or list an agent wallet
- Check balances
- Discover paid services
- Inspect service schemas and pricing
- Make USDC payments
- Handle approval before spend
- Return payment results to the agent

---

## Judging Criteria

| Criterion | Description |
|---|---|
| **Agentic usefulness** | Does the agent complete a real workflow? |
| **Wallet integration** | Is the wallet meaningfully part of the agent's operation? |
| **Payment design** | Are payments clear, justified, and logged? |
| **Technical execution** | Does the project work end to end? |
| **User experience** | Can someone understand what the agent did, what it paid for, and why? |
| **Originality** | Does the project show a new kind of agent-powered commerce or workflow? |

---

## Resources

- [Circle Agent Stack Docs](https://developers.circle.com/agent-stack)
- [Circle on X](https://x.com/circle/status/2067038222027468931?s=20)
- [Agent Stack Ecosystem Kits on GitHub](https://github.com/akelani-circle/agent-stack-ecosystem-kits/tree/main)
