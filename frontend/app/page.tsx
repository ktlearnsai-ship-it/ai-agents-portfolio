"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  MapPin,
} from "lucide-react";

// ─── DATA ──────────────────────────────────────────────────
const AGENTS = [
  {
    id: "scout",
    company: "Built for Grab",
    title: "An AI agent that writes the Monday growth brief — before anyone gets to the office",
    description:
      "Scout watches 31 competitors across 8 Southeast Asian markets. Every week, it reads the signals, checks the market data, applies consulting frameworks, and produces 2-3 ranked growth hypotheses with scenario models a manager can actually use.",
    tags: ["AI Agent", "n8n", "Claude", "Airtable", "Live"],
    stats: [
      { value: "31", label: "competitors tracked" },
      { value: "8", label: "SEA markets" },
      { value: "3", label: "hypotheses/week" },
    ],
    href: "/agents/scout",
    liveHref: "/agents/scout",
    color: "bg-green-50 border-green-100",
    status: "Live — try it",
    featured: true,
  },
  {
    id: "strategist",
    company: "In progress",
    title: "Competitor teardowns that used to take a week, done in minutes",
    description:
      "Pulls quarterly earnings, app store data, and news coverage for any public company and turns it into a structured competitive brief. Still in development — the data pipelines work, the output formatting needs polish.",
    tags: ["Earnings API", "Alpha Vantage", "Claude"],
    stats: [
      { value: "5", label: "companies monitored" },
      { value: "Q2 2026", label: "latest data" },
    ],
    href: "#",
    liveHref: null,
    color: "bg-gray-50 border-gray-100",
    status: "In development",
    featured: false,
  },
  {
    id: "ops",
    company: "Planned",
    title: "A workflow orchestrator that fixes itself when pipelines break",
    description:
      "The idea: an n8n meta-agent that monitors all other agent workflows, catches failures, retries with adjusted parameters, and sends a Slack summary. Basically on-call for your automation stack.",
    tags: ["n8n", "Slack", "Self-healing"],
    stats: [],
    href: "#",
    liveHref: null,
    color: "bg-gray-50 border-gray-100",
    status: "Planned",
    featured: false,
  },
];

const TIMELINE = [
  {
    period: "2026",
    role: "Building AI agents",
    detail: "Took a bet on agentic AI. Started building systems that do real analytical work — not chatbots, not demos.",
  },
  {
    period: "2024–26",
    role: "MBA, Wharton",
    detail: "Finance and strategy. Spent most of my time figuring out where AI fits into how companies actually make decisions.",
  },
  {
    period: "2024",
    role: "Summer Associate, BCG",
    detail: "Marketing, Sales & Pricing practice. Growth strategy for consumer and tech companies across Asia.",
  },
  {
    period: "2021–24",
    role: "Samagra Governance",
    detail: "Public sector strategy in India. Worked on programs reaching millions of people — taught me to think about scale differently.",
  },
  {
    period: "2019–21",
    role: "Education technology",
    detail: "Early career in ed-tech. Built products for students who had never used a computer before. That changes how you think about UX.",
  },
];

// ─── PAGE ──────────────────────────────────────────────────
export default function PortfolioHome() {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Krittika Takiar</span>
          <div className="flex items-center gap-6">
            <a href="#work" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Work
            </a>
            <a href="#about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              About
            </a>
            <a
              href="https://www.linkedin.com/in/krittikatakiar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/ktlearnsai-ship-it/ai-agents-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-16">
        <div className="flex items-start gap-10">
          {/* Photo */}
          <div className="shrink-0 hidden md:block">
            <div className="w-36 h-36 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <Image
                src="/krittika.jpg"
                alt="Krittika Takiar"
                width={144}
                height={144}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>

          {/* Intro */}
          <div>
            <p className="text-sm text-gray-400 mb-3">Hi, I'm Krittika</p>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug tracking-tight mb-5 max-w-2xl">
              I build AI agents that do the analytical work
              growth teams spend their Mondays on.
            </h1>

            <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-3">
              Wharton MBA. Ex-BCG. I got curious about what happens when you give an
              LLM real market data, consulting frameworks, and room to investigate — then
              ask it to form an opinion, not just summarize.
            </p>

            <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-6">
              These agents are what came out of that. Each one replaces a specific,
              expensive workflow with a system that runs every week, improves over time,
              and costs less than a coffee.
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Delhi → Singapore
              </span>
              <span>·</span>
              <a
                href="mailto:krittikatakiar@gmail.com"
                className="flex items-center gap-1.5 hover:text-gray-600 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Work ────────────────────────────────────────── */}
      <section id="work" className="max-w-4xl mx-auto px-6 pb-20">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-8">
          What I have been building
        </p>

        <div className="space-y-6">
          {AGENTS.map((agent) => (
            <div
              key={agent.id}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
              className={`rounded-2xl border p-8 transition-all duration-200 ${agent.color} ${
                agent.liveHref
                  ? "hover:shadow-md hover:border-green-200 cursor-pointer"
                  : ""
              }`}
            >
              {/* Company + status */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-gray-500">{agent.company}</span>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    agent.status.includes("Live")
                      ? "bg-green-100 text-green-700"
                      : agent.status.includes("development")
                        ? "bg-amber-50 text-amber-600"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {agent.status.includes("Live") && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                  )}
                  {agent.status}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-3 max-w-2xl">
                {agent.title}
              </h2>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-2xl">
                {agent.description}
              </p>

              {/* Screenshot mockup for Scout */}
              {agent.featured && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-5">
                  <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                    </div>
                    <span className="text-[10px] text-gray-400 ml-2">
                      krittika-takiar.vercel.app/agents/scout
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                            Expand
                          </span>
                          <span className="text-[10px] text-gray-400">Urgency 9/10</span>
                          <span className="text-[10px] text-gray-400">· High confidence</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 max-w-md">
                          &ldquo;Ant&apos;s AMP protocol commoditizes GrabPay — Grab should become
                          the first wallet-agnostic superapp&rdquo;
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Generated Sep 12, 2026 · Based on 14 signals across 8 markets
                        </p>
                      </div>
                      <div className="text-right bg-gray-50 rounded-lg px-4 py-3">
                        <p className="text-lg font-bold text-gray-900">$134M</p>
                        <p className="text-[10px] text-gray-400">quarterly revenue</p>
                        <p className="text-[10px] text-gray-400">at inflection</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-4">
                      {["Thesis", "Counter-arguments", "Scenario model", "Options", "Next steps", "Signals"].map(
                        (tab, i) => (
                          <span
                            key={tab}
                            className={`text-[10px] px-2.5 py-1 rounded ${
                              i === 0
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {tab}
                          </span>
                        )
                      )}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        GrabPay is #2-3 in Malaysia, #3-4 in Philippines, #3 in Vietnam.
                        Defending these costs capital that could fund lending in Indonesia,
                        where Grab has a bank license and a $2.3B loan portfolio growing 3x
                        year over year. The move: adopt AMP, let users pay however they want,
                        keep the merchant relationship and the data...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {agent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats + CTA */}
              <div className="flex items-end justify-between">
                {agent.stats.length > 0 && (
                  <div className="flex gap-8">
                    {agent.stats.map((stat, i) => (
                      <div key={i}>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {agent.liveHref ? (
                  <Link
                    href={agent.liveHref}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800 transition-colors group"
                  >
                    Try it live
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        hoveredAgent === agent.id ? "translate-x-1" : ""
                      }`}
                    />
                  </Link>
                ) : (
                  <span className="text-xs text-gray-400">
                    {agent.status === "Planned" ? "Coming this week" : "In progress"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ───────────────────────────────────────── */}
      <section id="about" className="border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-5 gap-12">
            {/* Left: story */}
            <div className="md:col-span-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-6">
                The short version
              </p>

              <p className="text-base text-gray-700 leading-relaxed mb-4">
                I have spent the last seven years working on problems where the answer is
                never obvious — public sector programs that need to reach 50 million people,
                growth strategy for tech companies fighting for market share, and education
                products for students who had never touched a laptop.
              </p>

              <p className="text-base text-gray-700 leading-relaxed mb-4">
                BCG taught me frameworks. Wharton taught me finance. But the thing that
                changed how I work was realizing that most of the &ldquo;analysis&rdquo; smart
                people spend their weeks on — pulling data, scanning competitors, sizing
                markets, building scenarios — is work a well-designed agent can do in minutes.
                Not perfectly. But well enough to free up the human for the part that actually
                matters: judgment.
              </p>

              <p className="text-base text-gray-700 leading-relaxed mb-8">
                So I started building. These agents are not academic projects — they are built
                to do the exact work I would do on day one of the roles I am targeting.
              </p>

              {/* Timeline */}
              <div className="space-y-0">
                {TIMELINE.map((item, i) => (
                  <div key={i} className="flex gap-4 py-3 border-t border-gray-100 first:border-t-0">
                    <span className="text-xs font-medium text-gray-400 w-16 shrink-0 pt-0.5">
                      {item.period}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.role}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: how it works */}
            <div className="md:col-span-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-6">
                How these agents work
              </p>

              <div className="space-y-4">
                {[
                  {
                    label: "Orchestration",
                    detail: "n8n workflows — scheduled triggers, loops, error handling. Runs on Docker locally, deployable to Railway.",
                  },
                  {
                    label: "Reasoning",
                    detail:
                      "Claude Sonnet as the AI Agent with 9 tools. Multi-step investigation: read signals, pull market data, war-game competitors, apply frameworks, stress-test the thesis.",
                  },
                  {
                    label: "Formatting",
                    detail: "Claude Haiku takes the free-form analysis and packs it into structured JSON the frontend can render.",
                  },
                  {
                    label: "Data layer",
                    detail: "Airtable — signals, market profiles (58 fields × 8 countries), competitor registry (31 entries), hypothesis output.",
                  },
                  {
                    label: "Signals",
                    detail:
                      "NewsData.io pulls competitor news. Code-based keyword scoring filters noise. Deduplication catches the same story across multiple competitors.",
                  },
                  {
                    label: "Frontend",
                    detail: "Next.js on Vercel. Reads from Airtable API. Interactive sliders for scenario modeling.",
                  },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold text-gray-700 mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <a
                  href="https://github.com/ktlearnsai-ship-it/ai-agents-portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-green-700 hover:text-green-800 transition-colors"
                >
                  See the full code and architecture on GitHub
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="text-xs text-gray-400">
            <p>Krittika Takiar · Wharton MBA 2026 · Ex-BCG</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <a
              href="https://www.linkedin.com/in/krittikatakiar/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/ktlearnsai-ship-it/ai-agents-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              GitHub
            </a>
            <a
              href="mailto:krittikatakiar@gmail.com"
              className="hover:text-gray-600 transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
