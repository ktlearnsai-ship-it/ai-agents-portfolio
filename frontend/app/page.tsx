"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Activity,
  Cpu,
  Database,
  ShieldCheck,
  Layers,
  ExternalLink,
  CheckCircle2,
  Clock,
  Github,
  Linkedin,
  FileText,
  ChevronRight,
  BarChart3,
  Globe,
  Zap,
  Brain,
  Target,
  TrendingUp,
} from "lucide-react";

// ─── AGENT DATA ────────────────────────────────────────────
const AGENTS = [
  {
    id: "scout",
    name: "Scout Growth Engine",
    tagline: "Autonomous Growth Hypothesis Generation",
    status: "PRODUCTION",
    statusColor: "emerald",
    description:
      "An AI agent that monitors 31 competitors across 8 Southeast Asian markets, reasons like a BCG partner, and produces ranked strategic growth hypotheses — autonomously, every week.",
    value:
      "Replaces 80% of a growth team's weekly analysis cycle. Each hypothesis includes sizing, trade-offs, scenario modeling, and 30/60/90 day governance.",
    capabilities: [
      "Real-time competitive signal monitoring across SEA",
      "BCG/Porter/Ansoff framework application",
      "Interactive scenario modeling with adjustable levers",
      "Automated hypothesis ranking with kill criteria",
      "Multi-market cross-vertical pattern detection",
    ],
    stack: ["Claude Sonnet", "n8n", "Airtable", "Next.js", "NewsData.io"],
    link: "/agents/scout",
    featured: true,
  },
  {
    id: "strategist",
    name: "Strategy Co-Pilot",
    tagline: "Competitive Intelligence & Market Teardowns",
    status: "DEVELOPMENT",
    statusColor: "amber",
    description:
      "Automated teardowns of competitor strategies, market positioning, and financial performance across Southeast Asian digital economies.",
    value:
      "Transforms quarterly earnings, app store data, and news signals into structured competitive briefs with actionable implications.",
    capabilities: [
      "Quarterly earnings analysis with YoY comparison",
      "Competitor strategy reverse-engineering",
      "Market share tracking across 8 countries",
      "Financial health scoring and trend detection",
    ],
    stack: ["Claude Sonnet", "Alpha Vantage", "n8n", "Airtable"],
    link: "#",
    featured: false,
  },
  {
    id: "orchestrator",
    name: "Operations Automator",
    tagline: "Self-Healing Workflow Orchestration",
    status: "DEVELOPMENT",
    statusColor: "amber",
    description:
      "An n8n-native orchestrator that manages asynchronous task routing, error recovery, and pipeline health monitoring across all agent workflows.",
    value:
      "Ensures 24/7 agent reliability with automatic retry logic, anomaly detection, and Slack-based alerting for pipeline failures.",
    capabilities: [
      "Multi-pipeline health monitoring",
      "Automatic error recovery and retry",
      "Data quality validation gates",
      "Slack alerting for critical failures",
    ],
    stack: ["n8n", "Airtable", "Slack API", "Node.js"],
    link: "#",
    featured: false,
  },
  {
    id: "sandbox",
    name: "Custom Agent Sandbox",
    tagline: "Rapid Agent Prototyping Environment",
    status: "PLANNED",
    statusColor: "slate",
    description:
      "A modular framework for spinning up new domain-specific agents in hours, not weeks — with pre-built connectors, evaluation harnesses, and deployment templates.",
    value:
      "Reserved for incoming custom deployments. Designed to demonstrate rapid agent development for any business domain.",
    capabilities: [
      "Plug-and-play data source connectors",
      "Pre-built evaluation framework",
      "One-click deployment pipeline",
      "Domain-agnostic agent templates",
    ],
    stack: ["n8n", "Claude", "Vercel", "GitHub Actions"],
    link: "#",
    featured: false,
  },
];

const STATS = [
  { label: "Active Agents", value: "3+", prefix: "01" },
  { label: "Markets Monitored", value: "8 SEA", prefix: "02" },
  { label: "Pipeline", value: "n8n + LLM", prefix: "03" },
];

const TECH_STACK = [
  "Next.js 16",
  "TypeScript",
  "Tailwind CSS",
  "n8n",
  "Claude AI",
  "Airtable",
  "Vercel",
  "Python",
  "NewsData.io",
  "Alpha Vantage",
];

// ─── ANIMATION VARIANTS ────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

// ─── STATUS BADGE ──────────────────────────────────────────
function StatusBadge({ status, color }: { status: string; color: string }) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    slate: "bg-slate-500/15 text-slate-400 border-slate-500/25",
  };
  const dotColors: Record<string, string> = {
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    slate: "bg-slate-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase rounded-full border ${colors[color]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[color]} ${color === "emerald" ? "animate-pulse" : ""}`} />
      {status}
    </span>
  );
}

// ─── AGENT CARD ────────────────────────────────────────────
function AgentCard({ agent, index }: { agent: (typeof AGENTS)[0]; index: number }) {
  const isLive = agent.status === "PRODUCTION";

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={`group relative rounded-2xl border backdrop-blur-md transition-all duration-300 ${
        agent.featured
          ? "col-span-1 md:col-span-2 border-emerald-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-emerald-950/30 hover:border-emerald-500/40"
          : "border-slate-800/60 bg-slate-900/50 hover:border-slate-700/80"
      } hover:shadow-2xl hover:shadow-emerald-500/5`}
    >
      {agent.featured && (
        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      )}

      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between mb-5">
          <StatusBadge status={agent.status} color={agent.statusColor} />
          {isLive && (
            <span className="text-[10px] text-slate-500 font-mono tracking-wider">
              ID: {agent.id.toUpperCase()}-001
            </span>
          )}
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white mb-1 tracking-tight">
          {agent.name}
        </h3>
        <p className="text-sm text-emerald-400/80 font-medium mb-4 tracking-wide">
          {agent.tagline}
        </p>

        <div className={`${agent.featured ? "md:grid md:grid-cols-2 md:gap-8" : ""}`}>
          <div>
            <p className="text-sm text-slate-400 leading-relaxed mb-2">
              {agent.description}
            </p>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              {agent.value}
            </p>
          </div>

          <div>
            <div className="mb-6">
              {agent.capabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/70 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-400 leading-snug">{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-5 border-t border-slate-800/50">
          <div className="flex flex-wrap gap-1.5">
            {agent.stack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-800/60 rounded border border-slate-700/40"
              >
                {tech}
              </span>
            ))}
          </div>

          {isLive ? (
            <a
              href={agent.link}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all group/btn"
            >
              Launch Dashboard
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-500 bg-slate-800/40 rounded-lg border border-slate-700/30">
              <Clock className="w-3 h-3" />
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────
export default function PortfolioHome() {
  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-bold tracking-[0.15em] text-slate-200">
              AI AGENTS
            </span>
            <span className="text-sm font-light tracking-[0.15em] text-slate-500">
              // PORTFOLIO
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/ktlearnsai-ship-it/ai-agents-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 border border-slate-700/50 rounded-lg hover:text-white hover:border-slate-600 transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/krittikatakiar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 border border-slate-700/50 rounded-lg hover:text-white hover:border-slate-600 transition-all"
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 border border-slate-700/50 rounded-lg hover:text-white hover:border-slate-600 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              Resume
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] font-semibold tracking-[0.25em] text-emerald-400/70 uppercase mb-6">
            Strategic AI Architecture & Automation
          </p>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Autonomous Systems.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-emerald-200 to-slate-400">
              Quantifiable Impact.
            </span>
          </h1>

          <p className="max-w-2xl text-lg text-slate-400 leading-relaxed mb-12">
            I build AI agents that do the work of growth teams, strategy analysts, and
            operations managers — autonomously, continuously, at a fraction of the cost. Each
            agent combines{" "}
            <span className="text-slate-300">Wharton-trained business strategy</span> with{" "}
            <span className="text-slate-300">BCG consulting frameworks</span> and{" "}
            <span className="text-slate-300">production-grade agentic AI systems</span>.
          </p>
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          className="grid grid-cols-3 gap-4 max-w-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {STATS.map((stat) => (
            <div
              key={stat.prefix}
              className="border border-slate-800/60 rounded-xl px-5 py-4 bg-slate-900/30"
            >
              <span className="text-[10px] font-mono text-slate-600 tracking-wider">
                {stat.prefix}
              </span>
              <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── THESIS + STACK ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-800/40">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-emerald-500/60" />
              <h2 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                The Thesis
              </h2>
            </div>
            <p className="text-base text-slate-300 leading-relaxed mb-4">
              The next layer of business leverage isn&apos;t more dashboards or more analysts.
              It&apos;s autonomous systems that continuously monitor, reason, and recommend — so
              human decision-makers focus on judgment, not data gathering.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Every agent in this portfolio is built to replace a specific, expensive analytical
              workflow with an always-on system that improves with each cycle. They&apos;re not
              chatbots. They&apos;re autonomous workers with tools, memory, and strategic
              reasoning.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-emerald-500/60" />
              <h2 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                Technical Stack
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/50 border border-slate-700/40 rounded-lg hover:border-emerald-500/30 hover:text-emerald-300 transition-all cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-6 p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl">
              <p className="text-xs text-slate-500 leading-relaxed">
                <span className="text-slate-400 font-medium">Architecture:</span> Each agent
                runs as an autonomous n8n workflow with scheduled triggers, real-time data
                pipelines, LLM-powered reasoning, and structured output to Airtable. The
                frontend reads from Airtable&apos;s API and renders interactive dashboards on
                Vercel.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── AGENT SHOWCASE ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-800/40">
        <motion.div
          className="flex items-center gap-2 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Target className="w-4 h-4 text-emerald-500/60" />
          <h2 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
            Agent Showcase
          </h2>
          <div className="flex-1 h-px bg-slate-800/60 ml-4" />
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-4"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {AGENTS.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
        </motion.div>
      </section>

      {/* ── ABOUT ───────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-800/40">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-emerald-500/60" />
            <h2 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
              About
            </h2>
          </div>
          <p className="text-base text-slate-300 leading-relaxed mb-4">
            <span className="text-white font-semibold">Krittika Takiar</span> — Wharton MBA
            (Class of 2026), ex-BCG (Marketing, Sales & Pricing practice), with prior
            experience in public sector strategy and education technology.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            I build at the intersection of strategic consulting and AI engineering. My agents
            aren&apos;t academic exercises — they&apos;re built to solve the exact problems I&apos;d face in
            the roles I&apos;m targeting: growth strategy, competitive intelligence, and operational
            planning across Southeast Asian markets.
          </p>
          <div className="flex gap-3">
            <a
              href="https://www.linkedin.com/in/krittikatakiar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-500/15 border border-emerald-500/25 rounded-lg hover:bg-emerald-500/25 transition-all"
            >
              <Linkedin className="w-3.5 h-3.5" />
              Connect on LinkedIn
            </a>
            <a
              href="https://github.com/ktlearnsai-ship-it/ai-agents-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-300 border border-slate-700/50 rounded-lg hover:text-white hover:border-slate-600 transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              View Source Code
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="border-t border-slate-800/40 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <p className="text-xs text-slate-600">
            Designed & Engineered for Scalable Agent Deployments.
          </p>
          <p className="text-xs text-slate-700">
            &copy; {new Date().getFullYear()} Krittika Takiar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
