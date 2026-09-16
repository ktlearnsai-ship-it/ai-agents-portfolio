"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";

// ─── TIMELINE ──────────────────────────────────────────────
const TIMELINE = [
  {
    year: "2026",
    role: "AI Agent Builder",
    org: "Independent",
    short: "Building agents that do the strategy work — autonomously.",
    logoBg: "#0ea5e9",
    logoText: "AI",
    current: true,
  },
  {
    year: "2024–26",
    role: "MBA",
    org: "Wharton",
    short: "Finance & strategy. Co-founded Slowpost.ai.",
    logoBg: "#9B1C1C",
    logoText: "W",
    current: false,
  },
  {
    year: "Jun–Aug 2025",
    role: "Summer Consultant",
    org: "BCG",
    short: "AI-driven marketing for a 17M-member US health insurer.",
    logoBg: "#14532d",
    logoText: "BCG",
    current: false,
  },
  {
    year: "2022–24",
    role: "Consultant",
    org: "BCG",
    short: "India's 1st Virtual Public School. 2M+ students.",
    logoBg: "#14532d",
    logoText: "BCG",
    current: false,
  },
  {
    year: "2018–22",
    role: "Specialist",
    org: "BCG",
    short: "GTM, pricing & sales strategy across sectors.",
    logoBg: "#14532d",
    logoText: "BCG",
    current: false,
  },
  {
    year: "2020–22",
    role: "Senior Associate",
    org: "Samagra",
    short: "8 lakh students. 15,000 government schools. HP.",
    logoBg: "#1e3a5f",
    logoText: "SG",
    current: false,
  },
];

// ─── PROJECTS ──────────────────────────────────────────────
const PROJECTS = [
  {
    id: "scout",
    label: "Scout",
    oneLiner: "Growth hypothesis engine for SEA superapps",
    company: "Built for Grab Holdings",
    status: "live",
    title: "The Monday growth brief — written before anyone walks in",
    description:
      "Scout watches 31 competitors across 8 Southeast Asian markets. Every week it reads signals, applies BCG frameworks, war-games competitors, and produces ranked growth hypotheses with interactive scenario models. It runs without a consultant in the room.",
    tags: ["Claude Sonnet", "n8n", "Airtable", "Next.js", "NewsData.io"],
    stats: [
      { value: "31", label: "competitors" },
      { value: "8", label: "SEA markets" },
      { value: "~$2", label: "per weekly run" },
    ],
    href: "/agents/scout",
  },
  {
    id: "strategist",
    label: "Strategist",
    oneLiner: "Competitive briefs in minutes, not a week",
    company: "In development",
    status: "dev",
    title: "Competitor teardowns that used to take a week",
    description:
      "Pulls quarterly earnings, app store reviews, and news. Turns it into a structured brief: financial health, positioning shifts, strategic implications. Same work a BCG deck would charge $80K for.",
    tags: ["Alpha Vantage", "Claude", "n8n"],
    stats: [
      { value: "5", label: "companies" },
      { value: "Q2 2026", label: "latest data" },
    ],
    href: "#",
  },
  {
    id: "ops",
    label: "Ops Agent",
    oneLiner: "Self-healing workflow orchestration",
    company: "Planned",
    status: "planned",
    title: "A workflow orchestrator that fixes itself when things break",
    description:
      "An n8n meta-agent that watches other agent workflows, catches failures, retries with adjusted parameters, and posts a Slack summary. On-call for your automation stack.",
    tags: ["n8n", "Slack", "Node.js"],
    stats: [],
    href: "#",
  },
];

const TECH = [
  { cat: "AI & Agents", items: ["Claude (Anthropic)", "OpenAI", "LangChain", "n8n"] },
  { cat: "Frontend", items: ["Next.js", "React", "Tailwind CSS", "Vercel"] },
  { cat: "Data", items: ["Airtable", "PostgreSQL", "Python", "TypeScript"] },
  { cat: "Infra", items: ["Docker", "GitHub Actions", "Node.js", "REST APIs"] },
];

// ─── PAGE ──────────────────────────────────────────────────
export default function PortfolioHome() {
  const [activeProject, setActiveProject] = useState("scout");
  const active = PROJECTS.find((p) => p.id === activeProject)!;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-8 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-gray-900">Krittika Takiar</span>
          <div className="flex items-center gap-8 text-sm text-gray-500">
            <a href="#about" className="hover:text-gray-900 transition-colors">About</a>
            <a href="#work" className="hover:text-gray-900 transition-colors">Work</a>
            <a href="#stack" className="hover:text-gray-900 transition-colors">Stack</a>
            <a
              href="mailto:krittikatakiar@gmail.com"
              className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:border-gray-400 transition-colors text-sm"
            >
              Get in touch
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section id="about" className="pt-32 pb-24 px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 items-start">

          {/* Photo */}
          <div className="md:col-span-3 flex justify-center md:justify-start">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-md">
              <Image
                src="/krittika.jpg"
                alt="Krittika Takiar"
                width={224}
                height={224}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>

          {/* Text */}
          <div className="md:col-span-9">
            <p className="text-sm font-medium text-sky-600 mb-4 tracking-wide">
              Consultant → AI Strategist
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
              Strategy that runs{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #f97316 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                without you
              </span>{" "}
              in the room.
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed mb-4 max-w-2xl">
              Previously a management consultant at BCG — GTM strategy, AI-driven marketing
              effectiveness, and large-scale operational transformation for clients across
              India, the US, and Southeast Asia. I have spent years turning messy, high-stakes
              problems into decisions that actually move.
            </p>

            <p className="text-lg text-gray-500 leading-relaxed mb-6 max-w-2xl">
              Now I build AI agents that do that work autonomously. Not chatbots. Systems
              that monitor markets, apply frameworks, stress-test their own conclusions, and
              hand you a recommendation — every week, without a $500K engagement fee.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <a
                href="mailto:krittikatakiar@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)" }}
              >
                <Mail className="w-4 h-4" />
                krittikatakiar@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/krittikatakiar/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-gray-400 transition-colors"
              >
                LinkedIn <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://substack.com/@krittikatakiar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-orange-200 text-orange-600 font-medium hover:border-orange-400 transition-colors"
              >
                Follow the build on Substack <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50/50 py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-10">
            Career path
          </p>

          {/* Horizontal scrollable timeline */}
          <div className="overflow-x-auto pb-4">
            <div className="flex items-start gap-0 min-w-max relative">
              {/* Connecting line */}
              <div className="absolute top-6 left-6 right-6 h-px bg-gray-200" style={{ width: "calc(100% - 48px)" }} />

              {TIMELINE.map((item, i) => (
                <div key={i} className="flex flex-col items-center relative" style={{ minWidth: "180px", paddingRight: "0" }}>
                  {/* Dot / Logo */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold z-10 shadow-sm mb-3 shrink-0"
                    style={{ backgroundColor: item.logoBg }}
                  >
                    {item.logoText}
                  </div>

                  {/* Content */}
                  <div className="text-center px-3">
                    <p className="text-[10px] text-gray-400 mb-0.5">{item.year}</p>
                    <p className="text-sm font-semibold text-gray-900 leading-tight mb-0.5">
                      {item.role}
                    </p>
                    <p className="text-xs font-medium text-sky-600 mb-1">{item.org}</p>
                    <p className="text-xs text-gray-500 leading-snug max-w-[140px] mx-auto">
                      {item.short}
                    </p>
                    {item.current && (
                      <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Now
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Work ──────────────────────────────────────────── */}
      <section id="work" className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            What I have been building
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-12 max-w-xl">
            Consulting deliverables that run themselves.
          </h2>

          <div className="grid md:grid-cols-12 gap-8">
            {/* Project selector */}
            <div className="md:col-span-4 space-y-2">
              {PROJECTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveProject(p.id)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                    activeProject === p.id
                      ? "border-sky-200 bg-sky-50/80 shadow-sm"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900">{p.label}</span>
                    {p.status === "live" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Live
                      </span>
                    )}
                    {p.status === "dev" && (
                      <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                        Building
                      </span>
                    )}
                    {p.status === "planned" && (
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                        Planned
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{p.oneLiner}</p>
                </button>
              ))}
            </div>

            {/* Project detail */}
            <div className="md:col-span-8 rounded-2xl border border-gray-200 overflow-hidden bg-white">
              {/* Browser mockup for Scout */}
              {active.status === "live" && (
                <div className="border-b border-gray-100">
                  <div className="bg-gray-50 px-4 py-2.5 flex items-center gap-2 border-b border-gray-100">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
                    </div>
                    <span className="text-[10px] text-gray-400 ml-1">
                      krittika-takiar.vercel.app/agents/scout
                    </span>
                  </div>
                  <div className="p-5 bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                            Expand
                          </span>
                          <span className="text-[10px] text-gray-400">Urgency 9/10 · High confidence</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 leading-snug">
                          &ldquo;Ant&apos;s AMP protocol commoditizes GrabPay — Grab should become
                          the first wallet-agnostic superapp&rdquo;
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Sep 12, 2026 · 14 signals · 8 markets · 31 competitors
                        </p>
                      </div>
                      <div className="text-right bg-sky-50 rounded-lg px-3 py-2 shrink-0">
                        <p className="text-lg font-bold text-sky-700">$134M</p>
                        <p className="text-[9px] text-sky-500">at inflection</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {["Thesis", "Counter-arguments", "Scenario model", "Options", "Next steps", "Signals"].map(
                        (tab, i) => (
                          <span key={tab} className={`text-[9px] px-2 py-0.5 rounded ${i === 0 ? "text-white font-medium" : "bg-gray-100 text-gray-500"}`}
                            style={i === 0 ? { background: "linear-gradient(135deg, #0ea5e9, #0284c7)" } : {}}>
                            {tab}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-7">
                <p className="text-xs text-gray-400 mb-2">{active.company}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
                  {active.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  {active.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {active.tags.map((t) => (
                    <span key={t} className="text-[10px] text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-end justify-between">
                  {active.stats.length > 0 && (
                    <div className="flex gap-8">
                      {active.stats.map((s, i) => (
                        <div key={i}>
                          <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                          <p className="text-[10px] text-gray-400">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {active.status === "live" && (
                    <Link
                      href={active.href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                    >
                      Try it live <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why agents ───────────────────────────────────── */}
      <section
        className="py-24 px-8"
        style={{ background: "linear-gradient(135deg, #0c1a2e 0%, #0f2744 50%, #0c1a2e 100%)" }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold text-sky-400 uppercase tracking-widest mb-4">
            Why this matters
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6 max-w-2xl leading-tight">
            The next layer of consulting isn&apos;t more consultants.
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-12">
            McKinsey&apos;s research shows that 70% of the work in a typical strategy engagement —
            market scanning, competitor analysis, scenario modeling, signal monitoring — can
            be automated with well-designed AI systems. What remains is judgment: the 30%
            that requires a human to make the call. Agents handle the 70%. I help you keep
            the 30% that matters.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                accent: "#0ea5e9",
                title: "From weeks to minutes",
                body: "A BCG team takes 3 weeks to complete a competitive landscape. A well-built agent does it weekly, continuously, for the cost of a coffee run.",
              },
              {
                accent: "#f97316",
                title: "Frameworks that run on data",
                body: "Porter, Ansoff, BCG Matrix — these frameworks work. The problem is applying them at speed across 8 markets and 31 competitors. Agents don't get tired.",
              },
              {
                accent: "#0ea5e9",
                title: "Strategy without the slide deck",
                body: "The value was never the PowerPoint. It was the thinking. Agents surface the thinking, leave the judgment to the human, and skip the 200 hours of formatting.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border"
                style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                <div
                  className="w-1 h-8 rounded-full mb-4"
                  style={{ backgroundColor: card.accent }}
                />
                <h3 className="text-base font-bold text-white mb-2">{card.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────── */}
      <section id="stack" className="py-24 px-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-10">
            Tools
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TECH.map((cat) => (
              <div key={cat.cat}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {cat.cat}
                </p>
                <div className="space-y-2">
                  {cat.items.map((t) => (
                    <p key={t} className="text-sm text-gray-600">{t}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-8 border-t border-gray-100 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Let&apos;s talk.
          </h2>
          <p className="text-base text-gray-500 mb-8">
            I am looking for roles at the intersection of strategy and AI — growth, product,
            or AI strategy. If you are building something interesting, I would love to hear
            about it.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:krittikatakiar@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-all hover:opacity-90 text-sm"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)" }}
            >
              <Mail className="w-4 h-4" />
              krittikatakiar@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/krittikatakiar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-gray-400 transition-colors text-sm"
            >
              LinkedIn <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://github.com/ktlearnsai-ship-it/ai-agents-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-gray-400 transition-colors text-sm"
            >
              GitHub <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-6 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-gray-400">
          <span>Krittika Takiar · Wharton MBA 2026 · Ex-BCG</span>
          <span>Consultant → AI Strategist</span>
        </div>
      </footer>
    </div>
  );
}
