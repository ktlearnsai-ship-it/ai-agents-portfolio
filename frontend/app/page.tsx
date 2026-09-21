"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";

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
    short: "Building agents that do the strategy work, autonomously.",
    logo: null,
    logoBg: "bg-gradient-to-br from-sky-500 to-orange-400",
    logoText: "AI",
    current: true,
  },
];

// Icons for the fleet strip
const SearchIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);
const ChartIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M3 3v18h18"/>
    <polyline points="7 15 11 11 15 13 21 6"/>
  </svg>
);
const PieIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
    <path d="M22 12A10 10 0 0 0 12 2v10z"/>
  </svg>
);
const CompassIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);
const AlertIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const FLEET = [
  { id: "scout", name: "Scout", tagline: "Growth Intelligence", status: "live", icon: SearchIcon },
  { id: "modeler", name: "Modeler", tagline: "Scenario Simulation", status: "planned", icon: ChartIcon },
  { id: "allocator", name: "Allocator", tagline: "Portfolio Optimization", status: "planned", icon: PieIcon },
  { id: "compass", name: "Compass", tagline: "Performance Tracking", status: "planned", icon: CompassIcon },
  { id: "critic", name: "Critic", tagline: "Adversarial Testing", status: "planned", icon: AlertIcon },
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
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold tracking-tight text-sky-600 whitespace-nowrap hover:opacity-90 transition-opacity"
          >
            Krittika Takiar
          </Link>

          <div className="flex items-center gap-3 sm:gap-8 text-xs sm:text-sm text-gray-500 font-medium">
            <a href="#about" className="hover:text-gray-900 transition-colors">About</a>
            <a href="#work" className="hover:text-gray-900 transition-colors">Work</a>
            <a
              href="https://substack.com/@shipandlearn2026"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors hidden sm:inline"
            >
              Learnings
            </a>
            <a
              href="https://github.com/ktlearnsai-ship-it/ai-agents-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="about" className="pt-6 sm:pt-20 pb-8 sm:pb-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-center">

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
                <button onClick={handleCopy} title="Copy link" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-sky-600 hover:shadow-md transition-all">
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
              Ex-BCG consultant specializing in GTM strategy, AI marketing effectiveness, and operational transformation across India and the US.
            </p>

            <p className="text-base text-gray-500 leading-relaxed mb-4" style={{ maxWidth: "480px" }}>
              We're at an inflection point. AI isn't just optimizing businesses, it's rebuilding how they operate.
            </p>
            <p className="text-base text-gray-500 mb-6 leading-relaxed" style={{ maxWidth: "480px" }}>
              So, I'm building. Consulting frameworks meet production-grade AI to turn business questions into clear recommendations, helping leaders make bold, well-grounded moves.
            </p>
          </div>
        </div>

        {/* Substack strip */}
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
            href="https://substack.com/@shipandlearn2026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 hover:text-sky-800 transition-colors shrink-0"
          >
            Subscribe on Substack <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div
          className="rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #ecfeff 0%, #f0f9ff 50%, #fff7ed 100%)" }}
        >
          <p className="text-xs sm:text-sm font-bold text-sky-600 uppercase tracking-widest mb-3">
            Professional Experience
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-10 sm:mb-14 max-w-5xl leading-tight">
            Strategy consulting, tech-led transformation,{" "}
            <span style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #f97316 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              now agentic AI.
            </span>
          </h2>

          <div className="relative">
            <div
              className="hidden md:block absolute top-9 left-0 right-0 h-px bg-gradient-to-r from-gray-200 via-sky-300 to-orange-300"
              style={{ marginLeft: "36px", marginRight: "36px" }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-8 md:gap-4">
              {TIMELINE.map((item, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  <div className="relative z-10 mb-4 sm:mb-5">
                    <div className={`w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] rounded-full ${item.logoBg} flex items-center justify-center shadow-md ring-1 ring-gray-100 overflow-hidden`}>
                      {item.logo ? (
                        <img
                          src={item.logo}
                          alt={item.org}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-xl sm:text-2xl font-bold tracking-tight">
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

                  <div className="text-center w-full px-1">
                    <p className="text-[11px] font-medium text-gray-400 tracking-wide mb-1 uppercase">
                      {item.year}
                    </p>
                    <p className="text-sm sm:text-[15px] font-bold text-gray-900 leading-tight mb-0.5">
                      {item.role}
                    </p>
                    <p className="text-xs font-semibold text-sky-600 mb-2">
                      {item.org}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
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

        {/* Fleet strip — 5 agents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {FLEET.map((agent) => {
            const isLive = agent.status === "live";
            const cardBase = "group rounded-2xl border p-5 transition-all";
            const cardStyle = isLive
              ? "border-sky-200 bg-white hover:border-sky-400 hover:shadow-lg cursor-pointer"
              : "border-gray-100 bg-gray-50/50 cursor-default";

            const inner = (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${isLive ? "shadow-sm" : ""}`}
                    style={
                      isLive
                        ? { background: "linear-gradient(135deg, #0ea5e9, #0284c7)" }
                        : { backgroundColor: "#e5e7eb", color: "#9ca3af" }
                    }
                  >
                    {agent.icon}
                  </div>
                  {isLive ? (
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white px-2.5 py-1 rounded-full shadow-sm"
                      style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                      </span>
                      LIVE
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-gray-400">In design</span>
                  )}
                </div>
                <p className={`text-base font-bold leading-tight ${isLive ? "text-gray-900" : "text-gray-500"}`}>
                  {agent.name}
                </p>
                <p className={`text-xs mb-3 ${isLive ? "text-gray-500" : "text-gray-400"}`}>
                  {agent.tagline}
                </p>
                {isLive ? (
                  <div className="flex items-center gap-1 text-xs font-semibold text-sky-600 group-hover:gap-2 transition-all">
                    Explore
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">On the roadmap</div>
                )}
              </>
            );

            return isLive ? (
              <a key={agent.id} href={`#${agent.id}`} className={`${cardBase} ${cardStyle}`}>
                {inner}
              </a>
            ) : (
              <div key={agent.id} className={`${cardBase} ${cardStyle}`}>
                {inner}
              </div>
            );
          })}
        </div>

        <div className="space-y-8">

          {/* Scout */}
          <div id="scout" className="rounded-3xl overflow-hidden p-8 md:p-14 relative scroll-mt-20" style={{ background: "linear-gradient(135deg, #FBF4F1 0%, #FEFCF9 50%, #F5EDDC 100%)" }}>

            {/* Header */}
            <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #C0533B, #9E3D2A)" }}>
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
              <span style={{ background: "linear-gradient(135deg, #C0533B, #B87A2E, #6B8E5A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Bolder bets.
              </span>
            </h3>

            {/* Positioning */}
            <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-3xl">
              Growth teams spend days pulling competitor moves, mapping adjacencies, sizing opportunities, and stress-testing hypotheses. Scout does all of that overnight and hands you a ranked brief with best-case scenario models. Scout helps you convert data-driven insights to bold, strategic bets.
            </p>

            {/* Four roles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              {[
                { num: "01", role: "Researcher", desc: "Gathers signals across markets and competitors.", grad: "#4A5A6B, #2F3A47" },
                { num: "02", role: "Interpreter", desc: "Sizes the prize in the company's own arithmetic.", grad: "#6B8E5A, #4E6B41" },
                { num: "03", role: "Thought Partner", desc: "Frames the hypothesis and pressure-tests it.", grad: "#B87A2E, #8F5C1F" },
                { num: "04", role: "Communicator", desc: "Delivers a ranked bet portfolio ready to pilot.", grad: "#C0533B, #9E3D2A" },
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

            {/* 4-stage workflow strip */}
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: "#9E3D2A" }}>Four tabs, one workflow</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { n: "01", name: "Signals", sub: "Find what matters", color: "#6B8E5A", bg: "#EAF0E4",
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h4l2-9 4 18 3-9 2 4h5"/></svg> },
                  { n: "02", name: "Impact", sub: "Size the prize", color: "#B87A2E", bg: "#F5EDDC",
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> },
                  { n: "03", name: "Bets", sub: "Ranked plays", color: "#C0533B", bg: "#F7EBE6",
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2"/></svg> },
                  { n: "04", name: "Pilot", sub: "Test design", color: "#4A5A6B", bg: "#E8ECF0",
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91-.79-.79-2.07-.8-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg> },
                ].map((s, i) => (
                  <div key={s.n} className="relative bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: s.bg, color: s.color }}>
                        {s.icon}
                      </div>
                      <span className="text-[10px] font-mono font-semibold tracking-wider" style={{ color: s.color }}>{s.n}</span>
                    </div>
                    <p className="text-base font-bold text-gray-900 leading-tight">{s.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.sub}</p>
                    {i < 3 && (
                      <div className="hidden md:block absolute top-1/2 -right-2 -translate-y-1/2 z-10" style={{ color: "#C0533B" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Real live screenshot */}
            <div className="rounded-2xl overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 mb-10">
              <div className="bg-gray-50 px-5 py-3 flex items-center gap-2 border-b border-gray-100">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-300" />
                  <span className="w-3 h-3 rounded-full bg-amber-300" />
                  <span className="w-3 h-3 rounded-full bg-green-300" />
                </div>
                <span className="text-xs text-gray-400 ml-2">krittika-takiar.vercel.app/agents/scout</span>
              </div>
              <img
                src="/scout-landing.jpg"
                alt="Scout live product — Signals tab with Top 3 workset"
                className="w-full h-auto block"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/agents/scout"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm tracking-wider transition-all hover:opacity-90 shadow-md"
                style={{ background: "linear-gradient(135deg, #C0533B, #9E3D2A)" }}
              >
                TRY LIVE <ArrowUpRight className="w-4 h-4" />
              </Link>

              <a
                href="/scout-guide.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-gray-900 text-gray-900 font-bold text-sm tracking-wider hover:bg-gray-900 hover:text-white transition-colors cursor-pointer"
              >
                SEE HOW SCOUT WORKS <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

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
