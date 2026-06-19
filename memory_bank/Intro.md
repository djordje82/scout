Prize structure totaling over **$4,000** in cash, plus tech credits and post-event support.

Instead of one massive grand prize, they've broken it down into specific **Track Prizes** and **Bonus Prizes**, meaning your chances of winning *something* are actually quite high if you target the right sponsor tech.

Here is how the money is split up:

### Track Prizes ($3,000+ total)

* **Agentic Commerce:** $1,000 (First place by Circle) + $500 (Best use of Tavily).
* **Nebius Infrastructure:** $1,000 total (Split into two $500 prizes for the best use of TokenFactory).
* **OOBE Protocol Infrastructure:** Three tiered cash prizes ($500 / $300 / $200) plus months of free Synapse RPC Advanced/Starter developer access.

### Bonus Prizes

* **Social Impact:** $500 cash by Blockchain for Good.
* **Guaranteed Dev Credits:** $100 in free open-source AI model credits for *every single participant* (via Nebius TokenFactory).
* **Incubation:** The top teams get access to Softstack’s deals platform and free consulting after the weekend is over to help actually launch the project.

> **Winning Strategy:** The smartest move here is to "stack" your targets. If you build a project that uses **Circle USDC** for payments, searches using **Tavily**, and has a **social impact** angle, you are suddenly eligible for three different prizes simultaneously with a single project.

## Example projects

Looking closely at the focus tracks and sponsors of this specific hackathon, there is a clear theme: **They don't want wrapper chatbots.** They are looking for independent, machine-to-machine economic tools that can handle identity and instant, automated payments.

Because it's a 48-hour crunch, you want to build a highly targeted prototype that leverages the exact tools the sponsors are paying for. Here are three high-potential ideas tailored directly to the track requirements:

---

### 1. The Autonomous "Pay-Per-Query" Research Agent

* **The Track:** Agentic Commerce ($1,000 Circle prize / $500 Tavily prize)
* **The Concept:** Traditional AI research agents get stuck behind API keys and SaaS paywalls. Build a specialized market research agent that executes micro-transactions on demand.
* **How it works:** A user gives the agent a complex research prompt (e.g., *"Analyze the last 24 hours of on-chain activity for this token"*). The agent uses **Tavily** to search the web, but encounters premium data providers. It uses **x402 (HTTP 402 Payment Required)** to instantly purchase individual data points or API reads using **Circle USDC**, merges the data, and delivers a clean report to the user—charging the user a small dynamic fee for the service.
* **Why it wins:** It directly integrates the core sponsors (Circle + Tavily) and showcases a real-world use case for x402 micropayments.

### 2. The On-Chain "Resumè" & Service Router

* **The Track:** Agent Infrastructure (Nebius TokenFactory / OOBE Protocol / ERC-8004)
* **The Concept:** An orchestrator agent that hires *other* specialized sub-agents based purely on their on-chain track record.
* **How it works:** Use the **ERC-8004 standard** to build an agent marketplace. When a main agent needs a specialized task done (like spinning up an LLM or generating an asset via Nebius TokenFactory), it doesn't look at a Web2 directory. It queries the ERC-8004 Identity and Reputation registries to find a sub-agent with a high "validation score" and low error rates, triggers the job via an MCP (Model Context Protocol) endpoint, and logs the encrypted verification proof back onto the registry.
* **Why it wins:** ERC-8004 is highly technical and specific. Building an actual implementation of this registry system will immediately set you apart from teams just building simple front-ends.

### 3. The "Good Governance" Auditing Agent

* **The Track:** Bonus Prize ($500 Blockchain for Good for social impact)
* **The Concept:** A public good agent that monitors DAO treasuries or impact funds and flags automated anomalies or suspicious transactions.
* **How it works:** The agent acts as an autonomous, 24/7 financial auditor. It parses public blockchain transaction logs, uses decentralized compute to run anomaly detection models, and outputs a public "Trust Score" ledger. If an impact project isn't using funds as proposed, the agent programmatically lowers its reputation score on a public registry or triggers a temporary pause on streaming payments.
* **Why it wins:** It checks the technical boxes of monitoring and verifiable logs while gunning for the dedicated social impact pool.

---

> **Hackathon Strategy Tip:** Since they require a clean repo starting at 6:00 PM tonight, don't write code yet. Instead, spend the next two hours sketching out the architecture diagram and reading the API docs for **x402 headers** and **ERC-8004 specification**—most teams will lose hours just trying to figure out how those protocols function under the hood.

