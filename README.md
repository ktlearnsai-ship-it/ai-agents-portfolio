# AI Agents Portfolio

Building agents that amplify human judgment with machine rigor.

**Live:** [krittika-takiar.vercel.app](https://krittika-takiar.vercel.app)

---

## What's in here

Production Next.js app hosting a portfolio of AI agents for growth and strategy work. Each agent maps to a role a strategist plays inside a company.

### Live agents

**Scout — Growth Intelligence** `LIVE`
A workbench that reads competitive signals, sizes the prize in a company's own arithmetic, and hands over a portfolio of bets ready to test. Built end-to-end against a Grab case: 87 real Q2 2026 signals, 30 driver library, 7 stated goals, two fully worked hypotheses (AMP + Atome Convergence, Priority Deliveries Ads Flywheel).

- **Try it:** [krittika-takiar.vercel.app/agents/scout](https://krittika-takiar.vercel.app/agents/scout)
- **Read the guide:** [krittika-takiar.vercel.app/scout-guide.html](https://krittika-takiar.vercel.app/scout-guide.html)

### In design

- **Modeler** — scenario simulation over Scout's hypotheses
- **Allocator** — portfolio optimization across active hypotheses
- **Compass** — performance tracking against decision rules
- **Critic** — adversarial pressure-tester across all phases

---

## Scout in one paragraph

Growth teams spend the day gathering context. The bottleneck is not analysis, it's the hours between a competitor headline landing in a group chat and a testable hypothesis arriving in the planning doc. Scout compresses that translation. It plays four narrow roles in sequence — Researcher (signal reader), Interpreter (prize sizer in the company's arithmetic), Thought Partner (framer and critic), and Communicator (bets and pilot writer) — and outputs a hypothesis card with impact sizing, ranked bets, and a designed pilot with a real kill threshold.

The four roles map to McKinsey's Feb 2025 framework on AI in strategy development. Scout covers four of the five; Modeler will cover the fifth (Simulator).

---

## Stack

- **Next.js 16** on Vercel
- **Anthropic Claude** for reasoning (streaming across 4 pipeline steps)
- **Airtable** as the data layer (signals, drivers, goals, competitors, hypotheses)
- **TypeScript** throughout
- **Tailwind** for styling

Deterministic guardrails wrap every LLM call: curated competitor registry, hardcoded driver library sourced from Q1 and Q2 2026 earnings, typed bet schema (financial vs execution), pilot template that enforces a decision rule with ambiguous zone and kill threshold.

---

## Repo layout

```
frontend/
├── app/
│   ├── page.tsx                            # Portfolio home
│   ├── agents/
│   │   └── scout/
│   │       └── page.tsx                    # Scout app
│   └── api/
│       ├── scout/                          # Signals, filters, competitor resolver
│       ├── framer/                         # 4-step reasoning pipeline
│       └── save-generated-hypothesis/      # Persist to Airtable
└── public/
    ├── scout-guide.html                    # Full case study
    └── scout-landing.jpg                   # Pipeline diagram
```

---

## About

Built by [Krittika Takiar](https://www.linkedin.com/in/krittika-takiar/). Wharton MBA 2026, ex-BCG. Now building agents that do the strategy work, autonomously.

**Weekly build notes:** [Substack](https://substack.com/@shipandlearn2026)
