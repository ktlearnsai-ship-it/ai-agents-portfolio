"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  TrendingUp,
  Swords,
  Sliders,
  FileText,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  MinusCircle,
  ExternalLink,
  Download,
  Zap,
  Target,
  Activity,
} from "lucide-react";

const HYPOTHESIS = {
  posture: "Expand",
  urgency: 9,
  confidence: "HIGH",
  hypothesis_statement:
    "If Grab launches a wallet-agnostic checkout in Malaysia and the Philippines within 90 days, GMV will grow by 4-7%, because merchants will accept lower payment margins in exchange for AMP-enabled cross-border volume.",
  test_window: "90 days",
  suggested_owner: "Regional Growth Lead (MY/PH)",
  generated_date: "Sep 12, 2026",
  signals_processed: 47,
  markets_analyzed: 8,
  competitors_tracked: 31,

  signals: [
    { id: "s142", date: "Sep 11, 2026", title: "Ant International launches Agentic Payment Protocol (AMP)", score: 92, competitor: "Alipay", markets: ["ID", "PH", "VN", "TH"], impact: "Threatens payment moat across SEA", source: "TechCrunch", url: "#" },
    { id: "s138", date: "Sep 10, 2026", title: "Sea Group Q2 earnings — Shopee GMV +34% YoY", score: 78, competitor: "Sea Group", markets: ["All SEA"], impact: "E-commerce compounding, ads revenue pressure", source: "Sea Group IR", url: "#" },
    { id: "s135", date: "Sep 9, 2026", title: "Mastercard unveils Wallet Pay for connected global payments", score: 71, competitor: "Mastercard", markets: ["Global"], impact: "Cross-border wallet interop accelerating", source: "The Business Standard", url: "#" },
    { id: "s131", date: "Sep 8, 2026", title: "Grab Q2 2026 earnings — FinServ revenue $134M, +59% YoY", score: 68, competitor: "Grab", markets: ["All SEA"], impact: "Lending portfolio 3x YoY, $2.3B outstanding", source: "Grab Investor Relations", url: "#" },
    { id: "s128", date: "Sep 7, 2026", title: "GCash surpasses 94M active users in Philippines", score: 65, competitor: "GCash", markets: ["PH"], impact: "Payment dominance in PH near-total", source: "Rappler", url: "#" },
  ],

  adjacencies: [
    { name: "Cross-border remittance", marketSize: 9, rightToWin: 8, competitive: 4, fit: "high" },
    { name: "SME banking", marketSize: 7, rightToWin: 8, competitive: 5, fit: "high" },
    { name: "B2B logistics", marketSize: 8, rightToWin: 5, competitive: 7, fit: "medium" },
    { name: "Lending expansion", marketSize: 8, rightToWin: 7, competitive: 6, fit: "high" },
    { name: "Grocery vertical", marketSize: 6, rightToWin: 4, competitive: 8, fit: "low" },
    { name: "Insurance products", marketSize: 5, rightToWin: 5, competitive: 6, fit: "low" },
  ],

  trends: {
    accelerating: ["Agentic payments (Ant AMP, Mastercard Wallet Pay)", "Cross-border wallet interoperability", "AI-powered merchant tools"],
    maturing: ["Food delivery consolidation", "Digital bank licensing in SEA"],
    subsiding: ["Standalone ride-hail pricing wars", "Feature-phone-first SEA products"],
  },

  framework_applied: "Porter's 5 Forces",
  framework_analysis: [
    { force: "Threat of new entrants", rating: 4, note: "Ant, Meta, Sea entering payments" },
    { force: "Bargaining power of buyers", rating: 3, note: "Merchant lock-in weakening" },
    { force: "Bargaining power of suppliers", rating: 2, note: "Grab owns most infrastructure" },
    { force: "Threat of substitutes", rating: 5, note: "AMP protocol is a direct substitute" },
    { force: "Competitive rivalry", rating: 4, note: "Sea, GoTo, inDrive all pressing" },
  ],

  assumptions: [
    { id: "a1", statement: "Ant AMP will hit >100K merchants in SEA by Q2 2027", confidence: "medium", basis: "Ant AMP launch signals + Alipay+ trajectory data", pressure_test: "Get merchant sign-up data from Ant's public disclosures monthly.", linked_signals: ["s142", "s135"] },
    { id: "a2", statement: "MY and PH merchants accept 30-50bps lower payment margins in exchange for cross-border volume", confidence: "low", basis: "TNG+ historical margin data (proxy only, not direct)", pressure_test: "Survey 200 merchants across both markets. Owner: Growth Ops.", linked_signals: [] },
    { id: "a3", statement: "GrabPay share loss will not exceed 15% during pilot", confidence: "medium", basis: "GrabPay-only checkout conversion data + cohort analysis", pressure_test: "Run 4-week A/B in Klang Valley before regional rollout.", linked_signals: ["s131"] },
    { id: "a4", statement: "Regulatory approval in Indonesia takes less than 9 months", confidence: "low", basis: "Recent OJK precedent (limited sample size)", pressure_test: "Legal team pre-consult with OJK before committing to PH pilot expansion.", linked_signals: [] },
    { id: "a5", statement: "Merchant lock-in from wallet-agnostic is durable (>12 months) once established", confidence: "medium", basis: "Adyen and Stripe cohort retention data (analogous market)", pressure_test: "Model cohort retention curves with regional growth team.", linked_signals: [] },
  ],

  kill_criteria: [
    "Merchant survey shows <60% willing to accept lower payment margins",
    "GrabPay share loss exceeds 25% in first 4 weeks of pilot",
    "Ant AMP merchant count stalls below 30K by Q1 2027",
    "OJK regulatory pre-consult surfaces major structural risk",
  ],

  levers: [
    { id: "l1", name: "Merchant margin acceptance rate", linked_assumption: "a2", min: 20, max: 100, default: 65, unit: "%" },
    { id: "l2", name: "AMP merchant reach by Q2 2027", linked_assumption: "a1", min: 30, max: 500, default: 150, unit: "K" },
    { id: "l3", name: "GrabPay share loss during pilot", linked_assumption: "a3", min: 0, max: 40, default: 15, unit: "%" },
  ],

  test_plan: {
    what_to_test: [
      "Merchant willingness (survey): 200 merchants across MY + PH",
      "Conversion impact (A/B test): 5% traffic in Klang Valley",
      "GrabPay cannibalization: track share by cohort in test group",
    ],
    data_scout_provides: [
      "Competitor signal timeline with source URLs",
      "Adjacency scoring across 6 growth spaces",
      "Framework analysis (Porter's 5 Forces)",
      "Trend classification (accelerating vs subsiding)",
    ],
    data_team_gathers: [
      "Merchant survey responses (200 in 3 weeks)",
      "GrabPay checkout conversion data by market",
      "Ant AMP monthly merchant count (public disclosures)",
      "OJK regulatory precedent research (legal team)",
    ],
    success_criteria: [
      "Conversion lift ≥ 3% in test cohort",
      "GrabPay share loss ≤ 15%",
      "Merchant survey: >60% willingness to accept lower margin",
    ],
    timeline: [
      { weeks: "Week 1-3", task: "Merchant survey across MY + PH", owner: "Growth Ops" },
      { weeks: "Week 2-3", task: "Regulatory pre-consult with OJK", owner: "Legal" },
      { weeks: "Week 3", task: "Go/No-Go decision on A/B pilot", owner: "Regional Growth Lead" },
      { weeks: "Week 4-8", task: "A/B pilot in Klang Valley (5% traffic)", owner: "Product + Growth" },
      { weeks: "Week 9", task: "Read results, decide expansion", owner: "Regional Growth Lead" },
    ],
  },
};

const TABS = [
  { id: "researcher", label: "Researcher", icon: Search, subtitle: "Signals gathered" },
  { id: "interpreter", label: "Interpreter", icon: TrendingUp, subtitle: "Patterns seen" },
  { id: "thought", label: "Thought Partner", icon: Swords, subtitle: "Assumptions tested" },
  { id: "simulator", label: "Simulator", icon: Sliders, subtitle: "Sensitivity model" },
  { id: "communicator", label: "Communicator", icon: FileText, subtitle: "Test plan" },
];

function CompanyDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-800 hover:border-gray-400 transition-colors">
        <span className="text-gray-500 font-normal">Analyzing:</span> Grab
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
      {open && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="p-2">
            <div className="px-3 py-2 rounded-lg bg-sky-50 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Grab Holdings</span>
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
            </div>
            {["GoTo Group", "Sea Group", "Uber Technologies"].map((c) => (
              <div key={c} className="px-3 py-2 flex items-center justify-between opacity-50">
                <span className="text-sm text-gray-600">{c}</span>
                <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">SOON</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
            <p className="text-[11px] text-gray-500">Scout&apos;s framework works for any consumer platform. This MVP demos Grab.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfidencePill({ level }: { level: string }) {
  const styles: Record<string, { bg: string; text: string; ring: string; icon: typeof CheckCircle2 }> = {
    high: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", icon: CheckCircle2 },
    medium: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", icon: MinusCircle },
    low: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200", icon: AlertCircle },
  };
  const s = styles[level] || styles.medium;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${s.bg} ${s.text} ring-1 ${s.ring}`}>
      <Icon className="w-3 h-3" />
      {level}
    </span>
  );
}

export default function ScoutPage() {
  const [activeTab, setActiveTab] = useState("thought");
  const [leverValues, setLeverValues] = useState<Record<string, number>>(Object.fromEntries(HYPOTHESIS.levers.map((l) => [l.id, l.default])));

  const h = HYPOTHESIS;

  const computeRecommendation = () => {
    const marginAcceptance = leverValues.l1;
    const grabPayLoss = leverValues.l3;
    const ampReach = leverValues.l2;
    if (marginAcceptance < 45 || grabPayLoss > 30) {
      return { label: "HYPOTHESIS AT RISK", color: "red", message: "If margin acceptance drops below 45% or GrabPay loss exceeds 30%, cross-border volume gains do not offset cannibalization. Recommend delaying test and running Assumption 2 survey before committing pilot resources." };
    }
    if (marginAcceptance < 60 || ampReach < 75) {
      return { label: "TEST SMALLER FIRST", color: "amber", message: "Marginal case. Recommend a limited pilot in one market (MY only) before regional rollout. Focus on gathering Assumption 1 and 2 data before scaling." };
    }
    return { label: "GREEN LIGHT", color: "emerald", message: "Assumption stack holds. Launch phased pilot in MY and PH simultaneously. Target 5% traffic allocation in Klang Valley. Expected conversion lift 4-7% based on scenario grid." };
  };

  const rec = computeRecommendation();

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <span>←</span> Portfolio
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)" }}>
              <Search className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-base font-bold text-gray-900 leading-none">Scout</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Growth Intelligence</p>
            </div>
          </div>
          <CompanyDropdown />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-emerald-500" /><span className="font-medium text-gray-700">Last run:</span> 4h ago</span>
          <span><span className="font-medium text-gray-700">{h.signals_processed}</span> signals processed</span>
          <span><span className="font-medium text-gray-700">{h.markets_analyzed}</span> markets analyzed</span>
          <span><span className="font-medium text-gray-700">{h.competitors_tracked}</span> competitors tracked</span>
          <span className="text-gray-400">Next scan: Sunday 6pm</span>
        </div>

        <div className="rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100 mb-10">
          <div className="p-8 md:p-10" style={{ background: "linear-gradient(135deg, #ecfeff 0%, #f0f9ff 50%, #fff7ed 100%)" }}>
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white px-3 py-1.5 rounded-full" style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)" }}>
                <TrendingUp className="w-3 h-3" />{h.posture.toUpperCase()}
              </span>
              <span className="text-[11px] font-bold text-gray-600 bg-white px-3 py-1.5 rounded-full">Urgency {h.urgency}/10</span>
              <ConfidencePill level={h.confidence.toLowerCase()} />
              <span className="text-[11px] text-gray-500 ml-auto">Generated {h.generated_date}</span>
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">This week&apos;s hypothesis to test</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-[1.25] mb-6">&ldquo;{h.hypothesis_statement}&rdquo;</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-6">
              <span><span className="font-semibold text-gray-800">Test window:</span> {h.test_window}</span>
              <span><span className="font-semibold text-gray-800">Owner:</span> {h.suggested_owner}</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold"><CheckCircle2 className="w-4 h-4" />Ready to assign</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setActiveTab("thought")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                <Swords className="w-4 h-4" />Show me the assumptions
              </button>
              <button onClick={() => setActiveTab("communicator")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-gray-300 text-gray-900 text-sm font-semibold hover:border-gray-400 transition-colors">
                <FileText className="w-4 h-4" />Show me the test plan
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive ? "bg-white shadow-sm text-gray-900 ring-1 ring-gray-200" : "text-gray-500 hover:text-gray-800 hover:bg-white/50"}`}>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isActive ? "" : "opacity-60"}`} style={isActive ? { background: "linear-gradient(135deg, #0ea5e9, #0284c7)" } : { background: "#f3f4f6" }}>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-gray-600"}`} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <p className="leading-none">{tab.label}</p>
                    <p className={`text-[10px] font-normal mt-0.5 ${isActive ? "text-gray-500" : "text-gray-400"}`}>{tab.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-8 md:p-10">

          {activeTab === "researcher" && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">What Scout gathered this week</h3>
                <p className="text-sm text-gray-500">{h.signals_processed} signals processed · {h.signals.length} flagged as strategic · 3 shaped this week&apos;s hypothesis</p>
              </div>
              <div className="space-y-3">
                {h.signals.map((s) => (
                  <div key={s.id} className="rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-gray-500 font-medium">{s.date}</span>
                        <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">SCORE {s.score}</span>
                        <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{s.competitor}</span>
                        {s.markets.map((m) => <span key={m} className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">{m}</span>)}
                      </div>
                      <a href={s.url} className="text-gray-400 hover:text-sky-600 transition-colors shrink-0"><ExternalLink className="w-4 h-4" /></a>
                    </div>
                    <p className="text-base font-semibold text-gray-900 mb-1">{s.title}</p>
                    <p className="text-sm text-gray-600">{s.impact}</p>
                    <p className="text-xs text-gray-400 mt-2">Source: {s.source}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "interpreter" && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">What Scout saw</h3>
                <p className="text-sm text-gray-500">Two views: growth adjacencies scored on fit, and trends classified by trajectory.</p>
              </div>
              <div className="mb-10">
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Adjacency map</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {h.adjacencies.map((a) => (
                    <div key={a.name} className={`rounded-2xl p-5 border-2 ${a.fit === "high" ? "border-sky-200 bg-sky-50/50" : a.fit === "medium" ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50/50"}`}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-bold text-gray-900">{a.name}</p>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${a.fit === "high" ? "bg-sky-100 text-sky-700" : a.fit === "medium" ? "bg-gray-100 text-gray-600" : "bg-gray-100 text-gray-400"}`}>{a.fit} fit</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3"><span className="text-[10px] text-gray-500 w-24">Market size</span><div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${a.marketSize * 10}%`, background: "linear-gradient(90deg, #0ea5e9, #0284c7)" }} /></div><span className="text-[10px] font-bold text-gray-700 w-4">{a.marketSize}</span></div>
                        <div className="flex items-center gap-3"><span className="text-[10px] text-gray-500 w-24">Right to win</span><div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${a.rightToWin * 10}%`, background: "linear-gradient(90deg, #0ea5e9, #0284c7)" }} /></div><span className="text-[10px] font-bold text-gray-700 w-4">{a.rightToWin}</span></div>
                        <div className="flex items-center gap-3"><span className="text-[10px] text-gray-500 w-24">Competition</span><div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${a.competitive * 10}%`, background: "linear-gradient(90deg, #f97316, #ea580c)" }} /></div><span className="text-[10px] font-bold text-gray-700 w-4">{a.competitive}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl bg-sky-50 border border-sky-100 p-4">
                  <p className="text-sm"><span className="font-bold text-sky-700">Top pick: Cross-border remittance.</span> <span className="text-sky-800">$47B market · Grab has payment license in 4 markets · Only Wise and Ant compete seriously.</span></p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Trend watch</h4>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">▲ Accelerating — act now</p>
                    <ul className="space-y-1">{h.trends.accelerating.map((t) => <li key={t} className="text-sm text-gray-700">· {t}</li>)}</ul>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-4">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">→ Maturing — defend position</p>
                    <ul className="space-y-1">{h.trends.maturing.map((t) => <li key={t} className="text-sm text-gray-700">· {t}</li>)}</ul>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">▼ Subsiding — deprioritize</p>
                    <ul className="space-y-1">{h.trends.subsiding.map((t) => <li key={t} className="text-sm text-gray-500">· {t}</li>)}</ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "thought" && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Assumptions Scout is making</h3>
                <p className="text-sm text-gray-500">This hypothesis rests on {h.assumptions.length} assumptions. The ones in red need pressure-testing before you commit.</p>
              </div>
              <div className="mb-10 rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4"><Target className="w-4 h-4 text-gray-500" /><p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Framework applied: {h.framework_applied}</p></div>
                <div className="space-y-2">
                  {h.framework_analysis.map((f) => (
                    <div key={f.force} className="flex items-center gap-4">
                      <span className="text-sm text-gray-700 w-56 shrink-0">{f.force}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => <div key={n} className={`w-4 h-4 rounded-full ${n <= f.rating ? f.rating >= 4 ? "bg-red-400" : f.rating === 3 ? "bg-amber-400" : "bg-emerald-400" : "bg-gray-200"}`} />)}
                      </div>
                      <span className="text-xs text-gray-500 flex-1">{f.note}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3 mb-8">
                {h.assumptions.map((a, i) => (
                  <div key={a.id} className={`rounded-2xl border-2 p-5 ${a.confidence === "low" ? "border-red-200 bg-red-50/30" : "border-gray-100"}`}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3">
                        <span className="text-[11px] font-bold text-gray-400 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                        <p className="font-semibold text-gray-900">{a.statement}</p>
                      </div>
                      <ConfidencePill level={a.confidence} />
                    </div>
                    <div className="ml-8 space-y-2 text-sm">
                      <p><span className="text-gray-500">Based on:</span> <span className="text-gray-700">{a.basis}</span></p>
                      <p><span className="text-gray-500">How to pressure-test:</span> <span className="text-gray-700">{a.pressure_test}</span></p>
                      {a.linked_signals.length > 0 && <p className="text-xs text-sky-600">Linked signals: {a.linked_signals.join(", ")}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border-2 border-red-100 bg-red-50/30 p-5">
                <div className="flex items-center gap-2 mb-3"><AlertCircle className="w-4 h-4 text-red-600" /><p className="text-xs font-bold text-red-700 uppercase tracking-wider">What would kill this hypothesis</p></div>
                <ul className="space-y-2">{h.kill_criteria.map((k, i) => <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-red-400 shrink-0">·</span>{k}</li>)}</ul>
              </div>
            </div>
          )}

          {activeTab === "simulator" && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sensitivity model</h3>
                <p className="text-sm text-gray-500">These sliders test what happens if Scout&apos;s assumptions are wrong. Drag to see how the hypothesis changes.</p>
              </div>
              <div className="space-y-6 mb-8">
                {h.levers.map((lever) => {
                  const value = leverValues[lever.id];
                  const assumption = h.assumptions.find((a) => a.id === lever.linked_assumption);
                  return (
                    <div key={lever.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{lever.name}</p>
                          {assumption && <p className="text-[11px] text-gray-500 mt-0.5">Tests Assumption: {assumption.statement.substring(0, 60)}...</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{value}{lever.unit === "%" ? "%" : lever.unit}</p>
                          <p className="text-[10px] text-gray-400">Scout assumed: {lever.default}{lever.unit === "%" ? "%" : lever.unit}</p>
                        </div>
                      </div>
                      <input type="range" min={lever.min} max={lever.max} value={value} onChange={(e) => setLeverValues({ ...leverValues, [lever.id]: Number(e.target.value) })} className="w-full h-2 rounded-full appearance-none cursor-pointer accent-sky-500" />
                      <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>{lever.min}{lever.unit === "%" ? "%" : lever.unit}</span><span>{lever.max}{lever.unit === "%" ? "%" : lever.unit}</span></div>
                    </div>
                  );
                })}
              </div>
              <div className={`rounded-3xl p-6 md:p-8 ${rec.color === "red" ? "bg-red-50 border-2 border-red-200" : rec.color === "amber" ? "bg-amber-50 border-2 border-amber-200" : "bg-emerald-50 border-2 border-emerald-200"}`}>
                <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${rec.color === "red" ? "text-red-600" : rec.color === "amber" ? "text-amber-600" : "text-emerald-600"}`}>Scout&apos;s updated view</p>
                <div className="flex items-center gap-3 mb-4">
                  <Zap className={`w-6 h-6 ${rec.color === "red" ? "text-red-600" : rec.color === "amber" ? "text-amber-600" : "text-emerald-600"}`} />
                  <p className="text-2xl font-bold text-gray-900">{rec.label}</p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{rec.message}</p>
              </div>
              <div className="mt-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Try preset scenarios</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Scout's base case", vals: { l1: 65, l2: 150, l3: 15 } },
                    { name: "Optimistic", vals: { l1: 85, l2: 300, l3: 8 } },
                    { name: "Pessimistic", vals: { l1: 40, l2: 60, l3: 28 } },
                    { name: "Ant fails to scale", vals: { l1: 65, l2: 40, l3: 15 } },
                    { name: "GrabPay collapses", vals: { l1: 65, l2: 150, l3: 35 } },
                  ].map((preset) => (
                    <button key={preset.name} onClick={() => setLeverValues(preset.vals)} className="text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors">{preset.name}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "communicator" && (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Test plan — Wallet-Agnostic Checkout Pilot</h3>
                  <p className="text-sm text-gray-500">A complete plan a growth manager could take to leadership and get resourced.</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                  <Download className="w-4 h-4" />Download PDF
                </button>
              </div>
              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Date</p><p className="font-semibold text-gray-900">{h.generated_date}</p></div>
                <div><p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Prepared by</p><p className="font-semibold text-gray-900">Scout</p></div>
                <div><p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">For</p><p className="font-semibold text-gray-900">Head of Growth, Grab</p></div>
                <div><p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Owner</p><p className="font-semibold text-gray-900">{h.suggested_owner}</p></div>
              </div>
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hypothesis</p>
                <p className="text-base font-semibold text-gray-900 leading-relaxed">&ldquo;{h.hypothesis_statement}&rdquo;</p>
              </div>
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">What to test</p>
                <ol className="space-y-2">
                  {h.test_plan.what_to_test.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      {item}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">Data Scout provides</p>
                  <ul className="space-y-2">
                    {h.test_plan.data_scout_provides.map((d, i) => <li key={i} className="text-sm text-gray-700 flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{d}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">Data team needs to gather</p>
                  <ul className="space-y-2">
                    {h.test_plan.data_team_gathers.map((d, i) => <li key={i} className="text-sm text-gray-700 flex gap-2"><AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />{d}</li>)}
                  </ul>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-2xl border-2 border-emerald-100 bg-emerald-50/30 p-5">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">Success criteria</p>
                  <ul className="space-y-2">{h.test_plan.success_criteria.map((s, i) => <li key={i} className="text-sm text-gray-700">· {s}</li>)}</ul>
                </div>
                <div className="rounded-2xl border-2 border-red-100 bg-red-50/30 p-5">
                  <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-3">Kill criteria</p>
                  <ul className="space-y-2">{h.kill_criteria.slice(0, 3).map((k, i) => <li key={i} className="text-sm text-gray-700">· {k}</li>)}</ul>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Timeline</p>
                <div className="space-y-2">
                  {h.test_plan.timeline.map((t, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                      <span className="text-xs font-bold text-gray-500 w-20 shrink-0">{t.weeks}</span>
                      <span className="text-sm text-gray-900 flex-1">{t.task}</span>
                      <span className="text-xs text-sky-700 font-semibold bg-sky-50 px-3 py-1 rounded-full">{t.owner}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="mt-10 py-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>Scout is a portfolio project by Krittika Takiar. This is a demo running on real signals with a placeholder hypothesis.</span>
          <Link href="/" className="hover:text-gray-600">← Back to portfolio</Link>
        </div>
      </main>
    </div>
  );
}
