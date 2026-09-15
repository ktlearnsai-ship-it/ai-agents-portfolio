"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Mail } from "lucide-react";

const TIMELINE = [
  {
    year: "2018–20",
    role: "Specialist",
    org: "BCG",
    short: "GTM, pricing, and sales strategy across sectors.",
    logo: "/logos/bcg.png",
    logoBg: "bg-white",
    current: false,
  },
  {
    year: "2020–22",
    role: "Consultant",
    org: "Samagra Governance",
    short: "Large-scale, tech-led transformations in education, agriculture, and health.",
    logo: "/logos/samagra.png",
    logoBg: "bg-white",
    current: false,
  },
  {
    year: "2022–24",
    role: "Consultant",
    org: "BCG",
    short: "Product and GTM for India's first Virtual Public School.",
    logo: "/logos/bcg.png",
    logoBg: "bg-white",
    current: false,
  },
  {
    year: "2024–26",
    role: "MBA (STEM)",
    org: "The Wharton School",
    short: "AI & Tech, Consulting, VP (DEI), Digital Health clubs.",
    logo: "/logos/wharton.png",
    logoBg: "bg-white",
    current: false,
  },
  {
    year: "2026",
    role: "Co-founder",
    org: "Slowpost.ai",
    short: "Agentic AI marketing distribution for early-stage SaaS teams.",
    logo: "/logos/slowpost.png",
    logoBg: "bg-white",
    current: false,
  },
  {
    year: "Now",
    org: "Independent",
    short: "Building agents that do the strategy work — autonomously.",
    logo: null,
    logoBg: "bg-gradient-to-br from-sky-500 to-orange-400",
    logoText: "AI",
    current: true,
  },
];



const TECH = [
  { cat: "AI & Agents", items: ["Claude (Anthropic)", "OpenAI", "LangChain", "n8n"] },
  { cat: "Frontend", items: ["Next.js", "React", "Tailwind CSS", "Vercel"] },
  { cat: "Data", items: ["Airtable", "PostgreSQL", "Python", "TypeScript"] },
  { cat: "Infra", items: ["Docker", "GitHub Actions", "Node.js", "REST APIs"] },
];

export default function PortfolioHome() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "https://krittika-takiar.vercel.app";
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };
 

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-8 h-14 flex items-center justify-between">
                     <span className="text-2xl font-bold tracking-tight text-sky-600">Krittika Takiar</span>
          <div className="flex items-center gap-8 text-sm text-gray-500">
            <a href="#about" className="hover:text-gray-900 transition-colors">About</a>
            <a href="#work" className="hover:text-gray-900 transition-colors">Work</a>
            <a href="https://substack.com/@krittikatakiar" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">My Learnings</a>
            <a href="https://github.com/ktlearnsai-ship-it/ai-agents-portfolio" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">GitHub</a>
          </div>
        </div>
      </nav>

           {/* Hero */}
      <section id="about" className="pt-28 pb-16 px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-10 items-center">

          {/* Left: photo on colored panel */}
          <div className="md:col-span-4">
            <div className="rounded-3xl p-6 shadow-sm" style={{ background: "linear-gradient(135deg, #ecfeff 0%, #f0f9ff 50%, #fff7ed 100%)" }}>
              <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/krittika.jpg"
                  alt="Krittika Takiar"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              {/* Icons tight under photo */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=krittika.takiar@gmail.com" title="Email" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-sky-600 hover:shadow-md transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/krittika-takiar/" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-sky-600 hover:shadow-md transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
                <button onClick={() => navigator.clipboard.writeText("https://krittika-takiar.vercel.app")} title="Copy link" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-sky-600 hover:shadow-md transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right: tight text column */}
          <div className="md:col-span-8">
            <p className="text-[11px] font-bold text-sky-600 uppercase tracking-widest mb-4">
              AI Agent Builder · Wharton MBA · Ex-BCG
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-[1.05] tracking-tight mb-6" style={{ maxWidth: "500px" }}>
              Rebuilding how{" "}
              <span style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #f97316 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                businesses operate.
              </span>
            </h1>

            <p className="text-lg text-gray-700 leading-relaxed mb-4 font-medium" style={{ maxWidth: "480px" }}>
              I combine consulting frameworks with production-grade AI to build agents that turn business questions into clear recommendations.
            </p>

            <p className="text-base text-gray-500 leading-relaxed" style={{ maxWidth: "480px" }}>
              Previously at BCG — GTM strategy, AI-driven marketing effectiveness, and large-scale operational transformation for clients across India and the US. Now shipping the working systems, not the slides.
            </p>
          </div>
        </div>

        {/* Substack strip - full width below hero */}
                <div className="mt-12 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-sky-50/50 border border-sky-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0284c7">
                <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
              </svg>
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-base leading-tight">Follow the build</p>
              <p className="text-gray-500 text-sm">Weekly notes from a consultant learning to ship AI agents.</p>
            </div>
          </div>
          <a
            href="https://substack.com/@krittikatakiar"
            target="_blank"
            rel="noopener noreferrer"

            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 hover:text-sky-800 transition-colors shrink-0"
          >
            Subscribe on Substack <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

           {/* Timeline */}
      <section className="border-t border-gray-100 bg-white py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-m font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Professional Experience
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-16 max-w-5xl leading-tight">
           Strategy consulting, tech-led transformation, {" "}<span style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #f97316 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              now agentic AI.
            </span>
          </h2>

          <div className="relative">
            {/* Progress line */}
            <div className="hidden md:block absolute top-9 left-0 right-0 h-px bg-gradient-to-r from-gray-200 via-sky-300 to-orange-300" style={{ marginLeft: "36px", marginRight: "36px" }} />

            {/* Timeline items */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-4">
              {TIMELINE.map((item, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  {/* Logo */}
                  <div className="relative z-10 mb-5">
                    <div className={`w-[88px] h-[88px] rounded-full ${item.logoBg} flex items-center justify-center shadow-md ring-1 ring-gray-100 overflow-hidden`}>
                      {item.logo ? (
                        <img
                          src={item.logo}
                          alt={item.org}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-2xl font-bold tracking-tight">
                          {item.logoText}
                        </span>
                      )}
                    </div>
                    {item.current && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center">
                        <span className="absolute w-4 h-4 rounded-full bg-green-500 animate-ping opacity-60" />
                        <span className="relative w-3 h-3 rounded-full bg-green-500 ring-2 ring-white" />
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="text-center w-full px-1">
                    <p className="text-[11px] font-medium text-gray-400 tracking-wide mb-1.5 uppercase">
                      {item.year}
                    </p>
                    <p className="text-[15px] font-bold text-gray-900 leading-tight mb-1">
                      {item.role}
                    </p>
                    <p className="text-xs font-semibold text-sky-600 mb-3">
                      {item.org}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {item.short}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
            {/* Work */}
      <section id="work" className="py-24 px-8 max-w-6xl mx-auto">
        <p className="text-m font-semibold text-gray-400 uppercase tracking-widest mb-2">What I have been building</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-12 max-w-3xl">
          Agents that amplify human judgment{" "}
          <span style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #f97316 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            with machine rigor.
          </span>
        </h2>
                    {/* Fleet strip - quick nav */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              {
                id: "scout",
                name: "Scout",
                tagline: "Growth Intelligence",
                status: "live",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                ),
              },
              {
                id: "strategist",
                name: "Strategist",
                tagline: "Competitive Teardowns",
                status: "dev",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M3 3v18h18"/>
                    <path d="m19 9-5 5-4-4-3 3"/>
                  </svg>
                ),
              },
              {
                id: "ops",
                name: "Ops Agent",
                tagline: "Self-healing Workflows",
                status: "planned",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
                  </svg>
                ),
              },
            ].map((agent) => {
              const isLive = agent.status === "live";
              return (
                   <a
                  key={agent.id}
                  href={`#${agent.id}`}
                  className={`group rounded-2xl border p-5 transition-all ${
                    isLive
                      ? "border-sky-200 bg-white hover:border-sky-400 hover:shadow-lg cursor-pointer"
                      : "border-gray-100 bg-gray-50/50 cursor-default"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isLive ? "shadow-sm" : ""
                      }`}
                      style={
                        isLive
                          ? { background: "linear-gradient(135deg, #0ea5e9, #0284c7)" }
                          : { backgroundColor: "#e5e7eb", color: "#9ca3af" }
                      }
                    >
                      {agent.icon}
                    </div>
                    {isLive && (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                        style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                      >
                        <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                        LIVE
                      </span>
                    )}
                    {agent.status === "dev" && (
                      <span className="text-[10px] font-semibold text-gray-500">
                        Building
                      </span>
                    )}
                    {agent.status === "planned" && (
                      <span className="text-[10px] font-semibold text-gray-400">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-base font-bold leading-tight ${
                      isLive ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {agent.name}
                  </p>
                  <p
                    className={`text-xs mb-3 ${
                      isLive ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {agent.tagline}
                  </p>
                  {isLive ? (
                    <div className="flex items-center gap-1 text-xs font-semibold text-sky-600 group-hover:gap-2 transition-all">
                      Explore
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">
                      {agent.status === "dev" ? "Case study coming soon" : "On the roadmap"}
                    </div>
                  )}
                </a>
              );
            })}
          </div>
        <div className="space-y-8">
                                        {/* Scout */}
          <div id="scout" className="rounded-3xl overflow-hidden p-8 md:p-14 relative scroll-mt-20" style={{ background: "linear-gradient(135deg, #ecfeff 0%, #f0f9ff 50%, #fff7ed 100%)" }}>
            
            {/* Header */}
            <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight leading-none">Scout</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Growth Intelligence</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white px-3 py-1.5 rounded-full shadow-sm" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                LIVE
              </span>
            </div>

            {/* Headline */}
            <h3 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6 leading-[1.02] max-w-3xl">
              Deep rigor.{" "}
              <span style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Bolder bets.
              </span>
            </h3>

            {/* Positioning */}
            <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-3xl">
              Growth teams spend days pulling competitor moves, mapping adjacencies, sizing opportunities, and stress-testing hypotheses. Scout does all of that overnight and hands you a ranked brief with best-case scenario models. Scout helps you convert data-driven insights to bold, strategic bets.
            </p>

            {/* Five roles */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
              {[
                { num: "01", role: "Researcher", desc: "Gathers signals across markets and competitors.", grad: "#0ea5e9, #0284c7" },
                { num: "02", role: "Interpreter", desc: "Maps growth adjacencies. Flags trends as rising or fading.", grad: "#0284c7, #7c3aed" },
                { num: "03", role: "Thought Partner", desc: "Pressure-tests thesis against strategy frameworks.", grad: "#7c3aed, #f97316" },
                { num: "04", role: "Simulator", desc: "Models scenarios with adjustable levers.", grad: "#f97316, #ea580c" },
                { num: "05", role: "Communicator", desc: "Delivers a ranked, decision-ready brief.", grad: "#ea580c, #0ea5e9" },
              ].map((r) => (
                <div key={r.num} className="bg-white/70 backdrop-blur rounded-2xl p-4 border border-white shadow-sm">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm mb-3" style={{ background: `linear-gradient(135deg, ${r.grad})` }}>
                    <span className="text-[10px] font-bold text-white">{r.num}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-1">{r.role}</p>
                  <p className="text-xs text-gray-500 leading-snug">{r.desc}</p>
                </div>
              ))}
            </div>

            {/* Screenshot */}
            <div className="rounded-2xl overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 mb-10">
              <div className="bg-gray-50 px-5 py-3 flex items-center gap-2 border-b border-gray-100">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-300" />
                  <span className="w-3 h-3 rounded-full bg-amber-300" />
                  <span className="w-3 h-3 rounded-full bg-green-300" />
                </div>
                <span className="text-xs text-gray-400 ml-2">krittika-takiar.vercel.app/agents/scout</span>
              </div>
              <div className="p-8 bg-white">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-600 border border-blue-100">Expand</span>
                      <span className="text-xs text-gray-400">Urgency 9/10 · High confidence</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 leading-snug mb-2">
                      &ldquo;Ant&apos;s AMP protocol commoditizes GrabPay — Grab should become the first wallet-agnostic superapp.&rdquo;
                    </p>
                    <p className="text-xs text-gray-400">Sep 12, 2026 · 14 signals · 8 markets · 31 competitors</p>
                  </div>
                  <div className="bg-sky-50 rounded-xl p-5 flex flex-col justify-center">
                    <p className="text-3xl font-bold text-sky-700">$134M</p>
                    <p className="text-xs text-sky-600 mt-1">quarterly revenue at inflection</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mb-5">
                  {["Thesis", "Counter-arguments", "Scenario model", "Options", "Next steps", "Signals"].map((tab, i) => (
                    <span key={tab} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${i === 0 ? "text-white shadow-sm" : "bg-gray-100 text-gray-600"}`} style={i === 0 ? { background: "linear-gradient(135deg, #0ea5e9, #0284c7)" } : {}}>{tab}</span>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    GrabPay is #2-3 in Malaysia, #3-4 in Philippines. Defending these positions costs capital that could fund lending in Indonesia, where Grab has a bank license and a $2.3B loan portfolio tripling year over year...
                  </p>
                </div>
              </div>
            </div>

            {/* Tech stack with SVG logos */}
            <div className="mb-10">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Built with</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                {[
                  { name: "Claude", icon: "anthropic" },
                  { name: "n8n", icon: "n8n" },
                  { name: "Airtable", icon: "airtable" },
                  { name: "Next.js", icon: "nextdotjs" },
                  { name: "Vercel", icon: "vercel" },
                  { name: "TypeScript", icon: "typescript" },
                  { name: "Tailwind", icon: "tailwindcss" },
                  { name: "GitHub", icon: "github" },
                ].map((t) => (
                  <div key={t.name} className="flex items-center gap-1.5">
                    <img src={`https://cdn.simpleicons.org/${t.icon}/6b7280`} alt={t.name} width="16" height="16" className="opacity-70" />
                    <span className="text-sm text-gray-600 font-medium">{t.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/agents/scout" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm tracking-wider transition-all hover:opacity-90 shadow-md" style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)" }}>
                TRY LIVE <ArrowUpRight className="w-4 h-4" />
              </Link>
              <a href="https://github.com/ktlearnsai-ship-it/ai-agents-portfolio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-gray-900 text-gray-900 font-bold text-sm tracking-wider hover:bg-gray-900 hover:text-white transition-colors">
                VIEW CASE STUDY
              </a>
            </div>
          </div>
                    {/* Strategist */}
          <div id="strategist" className="rounded-3xl overflow-hidden p-8 md:p-12 scroll-mt-20" style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #ffedd5 100%)" }}>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">In development</p>
                  <span className="text-[11px] font-bold text-white px-3 py-1 rounded-full" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                    BUILDING
                  </span>
                </div>

                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4 leading-[1.05]">
                  Competitor teardowns<br />
                  <span style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    in minutes.
                  </span>
                </h3>

                <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-md">
                  Pulls quarterly earnings, app store reviews, and news. Turns it into a structured brief with financial health, positioning shifts, and strategic implications.
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {["Alpha Vantage", "Claude", "n8n"].map((t) => (
                    <span key={t} className="text-xs font-medium text-gray-600 bg-white/70 backdrop-blur px-3 py-1.5 rounded-full">{t}</span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8 max-w-xs">
                  <div><p className="text-3xl font-bold text-gray-900">5</p><p className="text-[11px] text-gray-500 mt-1">companies</p></div>
                  <div><p className="text-3xl font-bold text-gray-900">Q2 2026</p><p className="text-[11px] text-gray-500 mt-1">latest data</p></div>
                </div>

                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-300 text-gray-500 font-bold text-xs tracking-wider">
                  CASE STUDY COMING SOON
                </span>
              </div>

              <div className="relative">
                <div className="rounded-2xl overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 aspect-[4/3] flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <path d="M9 9h6M9 13h6M9 17h4"/>
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Live preview coming soon</p>
                    <p className="text-xs text-gray-400">Data pipelines running, UI in progress.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ops */}
          <div id="ops" className="rounded-3xl overflow-hidden p-8 md:p-12 scroll-mt-20" style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0f2fe 100%)" }}>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">Planned</p>
                  <span className="text-[11px] font-bold text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                    COMING SOON
                  </span>
                </div>

                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4 leading-[1.05]">
                  Workflows that<br />
                  <span style={{ background: "linear-gradient(135deg, #7c3aed, #0284c7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    fix themselves.
                  </span>
                </h3>

                <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-md">
                  An n8n meta-agent that watches other agent workflows, catches failures, retries with adjusted parameters, and posts a Slack summary. On-call for your automation stack.
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {["n8n", "Slack API", "Node.js"].map((t) => (
                    <span key={t} className="text-xs font-medium text-gray-600 bg-white/70 backdrop-blur px-3 py-1.5 rounded-full">{t}</span>
                  ))}
                </div>

                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-300 text-gray-500 font-bold text-xs tracking-wider">
                  ON THE ROADMAP
                </span>
              </div>

              <div className="relative">
                <div className="rounded-2xl overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 aspect-[4/3] flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Design in progress</p>
                    <p className="text-xs text-gray-400">Coming after Strategist ships.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Tech Stack */}
      <section id="stack" className="py-24 px-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-10">Tools</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TECH.map((cat) => (
              <div key={cat.cat}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{cat.cat}</p>
                <div className="space-y-2">
                  {cat.items.map((t) => <p key={t} className="text-sm text-gray-600">{t}</p>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-gray-400">
          <span>Krittika Takiar · Wharton MBA 2026 · Ex-BCG</span>
          <span>Consultant → AI Strategist</span>
        </div>
      </footer>
    </div>
  );
}
