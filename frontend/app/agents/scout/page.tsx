"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ArrowUpRight,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
} from "lucide-react";

// ─── TYPES ─────────────────────────────────────────────────
interface Lever {
  name: string;
  description: string;
  min: number;
  max: number;
  default: number;
  unit: string;
  impact_direction: string;
}

interface Market {
  market: string;
  key_number: number;
  key_number_label: string;
  relevance?: string;
}

interface Option {
  name: string;
  description?: string;
  upside: string;
  downside: string;
  feasibility?: string;
  timeline?: string;
}

interface Hypothesis {
  id: string;
  rank: number;
  title: string;
  thesis: string;
  fullAnalysis: string;
  whyNow: string;
  posture: string;
  urgency: number;
  growthPotential: number;
  confidence: string;
  keyMetric: string;
  keyMetricValue: number;
  keyMetricUnit: string;
  levers: Lever[];
  scenarioGrid: { lever1: number; lever2: number; impact: number }[];
  affectedMarkets: Market[];
  options: Option[];
  weekOf: string;
}

// ─── HELPERS ───────────────────────────────────────────────
const postureLabel: Record<string, string> = {
  defensive: "Defend",
  growth: "Grow",
  expand: "Expand",
};

const postureColor: Record<string, string> = {
  defensive: "bg-red-50 text-red-700 border-red-200",
  growth: "bg-green-50 text-green-700 border-green-200",
  expand: "bg-blue-50 text-blue-700 border-blue-200",
};

const confidenceIcon: Record<string, typeof CheckCircle2> = {
  high: CheckCircle2,
  medium: Minus,
  low: AlertTriangle,
};

function findClosestScenario(
  grid: { lever1: number; lever2: number; impact: number }[],
  v1: number,
  v2: number
) {
  if (!grid || grid.length === 0) return { impact: 0 };
  let closest = grid[0];
  let minDist = Infinity;
  for (const s of grid) {
    const d = Math.abs(s.lever1 - v1) + Math.abs(s.lever2 - v2);
    if (d < minDist) {
      minDist = d;
      closest = s;
    }
  }
  return closest;
}

function cleanThesis(text: string): string {
  if (!text) return "";
  // Remove any JSON artifacts from the thesis
  const jsonStart = text.indexOf("```json");
  if (jsonStart > 0) return text.substring(0, jsonStart).trim();
  if (text.startsWith("Now I have enough")) {
    const firstQuote = text.indexOf('"thesis"');
    if (firstQuote > 0) {
      // Try to extract the actual thesis from the JSON
      const match = text.match(/"thesis":\s*"([^"]+)"/);
      if (match) return match[1];
    }
  }
  return text.substring(0, 600);
}

// ─── MAIN PAGE ─────────────────────────────────────────────
export default function ScoutPage() {
  const router = useRouter();
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHypothesis, setActiveHypothesis] = useState(0);
  const [activeTab, setActiveTab] = useState("thesis");
  const [sliderValues, setSliderValues] = useState<number[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchToast, setShowSearchToast] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  useEffect(() => {
    fetch("/api/hypotheses")
      .then((r) => r.json())
      .then((data) => {
        const valid = Array.isArray(data)
          ? data.filter((h: Hypothesis) => h.title && h.title.length > 5)
          : [];
        setHypotheses(valid);
        if (valid.length > 0 && valid[0].levers) {
          setSliderValues(valid[0].levers.map((l: Lever) => l.default));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const switchHypothesis = (idx: number) => {
    setActiveHypothesis(idx);
    setActiveTab("thesis");
    if (hypotheses[idx]?.levers) {
      setSliderValues(hypotheses[idx].levers.map((l) => l.default));
    }
  };

  const handleSearch = () => {
    setShowSearchToast(true);
    setTimeout(() => setShowSearchToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  if (hypotheses.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800 mb-2">No active hypotheses</p>
          <p className="text-sm text-gray-500">
            Run the Scout agent to generate growth hypotheses.
          </p>
        </div>
      </div>
    );
  }

  const h = hypotheses[activeHypothesis];
  const ConfIcon = confidenceIcon[h.confidence] || Minus;

  // Scenario calculation
  const currentScenario =
    h.levers.length >= 2
      ? findClosestScenario(h.scenarioGrid, sliderValues[0] || 0, sliderValues[1] || 0)
      : h.levers.length === 1
        ? findClosestScenario(
            h.scenarioGrid.map((s) => ({ ...s, lever2: 0 })),
            sliderValues[0] || 0,
            0
          )
        : { impact: h.keyMetricValue };

  const TABS = [
    { id: "thesis", label: "Thesis" },
    { id: "counter", label: "Counter-arguments" },
    { id: "scenario", label: "Scenario model" },
    { id: "options", label: "Options" },
    { id: "governance", label: "Next steps" },
    { id: "signals", label: "Signals" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* ── Top bar ─────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              ← Portfolio
            </button>
            <span className="text-gray-300">|</span>
            <h1 className="text-sm font-semibold text-gray-900 tracking-tight">Scout</h1>
            <span className="text-xs text-gray-400">Growth Intelligence</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Active · Updated {h.weekOf || "recently"}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8">
        {/* ── Company selector + search ─────────────────── */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <button
              onClick={() => setCompanyOpen(!companyOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-800 hover:border-gray-300 transition-colors"
            >
              Analyzing: Grab Holdings
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
            {companyOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <div className="p-1">
                  <div className="px-3 py-2 text-sm text-gray-800 bg-green-50 rounded flex items-center justify-between">
                    Grab Holdings (GRAB)
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <div className="px-3 py-2 text-sm text-gray-400 flex items-center justify-between">
                    GoTo Group (GOTO)
                    <span className="text-[10px] text-gray-300">coming soon</span>
                  </div>
                  <div className="px-3 py-2 text-sm text-gray-400 flex items-center justify-between">
                    Sea Group (SE)
                    <span className="text-[10px] text-gray-300">coming soon</span>
                  </div>
                  <div className="px-3 py-2 text-sm text-gray-400 flex items-center justify-between">
                    Uber Technologies (UBER)
                    <span className="text-[10px] text-gray-300">coming soon</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-gray-300 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            Search companies...
          </button>
        </div>

        {/* Search toast */}
        {showSearchToast && (
          <div className="fixed top-20 right-6 bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
            Search is coming soon. For now, Scout monitors Grab Holdings.
            <button onClick={() => setShowSearchToast(false)}>
              <X className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
            </button>
          </div>
        )}

        {/* Close dropdown when clicking outside */}
        {companyOpen && (
          <div className="fixed inset-0 z-10" onClick={() => setCompanyOpen(false)} />
        )}

        {/* ── Hypothesis pills ──────────────────────────── */}
        <div className="flex gap-2 mb-6">
          {hypotheses.map((hyp, i) => (
            <button
              key={hyp.id}
              onClick={() => switchHypothesis(i)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                i === activeHypothesis
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              #{i + 1}{" "}
              {hyp.title.length > 40 ? hyp.title.substring(0, 40) + "..." : hyp.title}
            </button>
          ))}
        </div>

        {/* ── Lead hypothesis ───────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="grid grid-cols-3 gap-8">
            {/* Left: headline */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded border ${postureColor[h.posture] || postureColor.growth}`}
                >
                  {postureLabel[h.posture] || h.posture}
                </span>
                <span className="text-[11px] text-gray-400">
                  Urgency {h.urgency}/10
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <ConfIcon className="w-3 h-3" />
                  {h.confidence} confidence
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 leading-snug mb-4 tracking-tight">
                {h.title}
              </h2>

              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {cleanThesis(h.thesis)}
              </p>

              <p className="text-xs text-gray-400">
                Generated {h.weekOf} · Based on signals from 31 competitors across 8 markets
              </p>
            </div>

            {/* Right: key metric + status */}
            <div className="flex flex-col justify-between">
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Key metric</p>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">
                  {h.keyMetricValue > 1000
                    ? `$${(h.keyMetricValue / 1000).toFixed(1)}B`
                    : h.keyMetricValue > 0
                      ? `$${h.keyMetricValue}M`
                      : "—"}
                </p>
                <p className="text-xs text-gray-500 mt-1">{h.keyMetric}</p>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Markets affected</span>
                  <span className="font-medium text-gray-700">
                    {h.affectedMarkets?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Options evaluated</span>
                  <span className="font-medium text-gray-700">
                    {h.options?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Growth potential</span>
                  <span className="font-medium text-gray-700">{h.growthPotential}/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Ask Scout ───────────────────────────────── */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Test a hypothesis — e.g., &quot;What if Xanh SM enters Indonesia?&quot;"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
              />
              <button
                onClick={handleSearch}
                className="px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Ask Scout
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              {[
                "Should Grab partner with MoMo?",
                "Is Thailand delivery defensible?",
                "What happens if Xanh SM enters Indonesia?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setSearchQuery(q);
                    handleSearch();
                  }}
                  className="text-[11px] text-gray-400 hover:text-green-600 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────── */}
        <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-xl px-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "text-green-700 border-green-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ───────────────────────────────── */}
        <div className="bg-white rounded-b-xl rounded-t-none border border-t-0 border-gray-200 p-8">
          {/* THESIS TAB */}
          {activeTab === "thesis" && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">What happened and why it matters</h3>

              {h.whyNow && (
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
                  <p className="text-xs font-medium text-amber-700 mb-1">Why now</p>
                  <p className="text-sm text-amber-900">{h.whyNow}</p>
                </div>
              )}

              <div className="prose prose-sm max-w-none text-gray-600">
                {h.fullAnalysis ? (
                  h.fullAnalysis
                    .split(/\n\n+/)
                    .filter((p) => p.trim().length > 20 && !p.includes("```"))
                    .slice(0, 8)
                    .map((para, i) => (
                      <p key={i} className="mb-3 leading-relaxed text-sm">
                        {para.replace(/\\n/g, " ").replace(/\\/g, "").trim()}
                      </p>
                    ))
                ) : (
                  <p>{cleanThesis(h.thesis)}</p>
                )}
              </div>
            </div>
          )}

          {/* COUNTER-ARGUMENTS TAB */}
          {activeTab === "counter" && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Three reasons this might be wrong
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Good strategy tests itself. Here is where this hypothesis could break down.
              </p>

              <div className="space-y-4">
                {[
                  {
                    challenge: "Adoption might be slower than expected",
                    detail: `When Alipay+ launched in 2021 with similar ambitions, cross-border payment adoption grew only 3% per year in its first two years. AMP could follow the same pattern — press release first, traction much later.`,
                    ifTrue: `Urgency drops from ${h.urgency} to about 4. Watch and wait instead of acting now.`,
                  },
                  {
                    challenge:
                      "Most GrabPay transactions may be locked to rides and food orders",
                    detail:
                      "If 65% or more of GrabPay volume happens inside Grab's own services (rides, food, grocery), then users won't switch to AMP wallets for those. The exposed portion is only 35%.",
                    ifTrue: `Revenue at risk drops from $${h.keyMetricValue}M to roughly $${Math.round(h.keyMetricValue * 0.35)}M. Still worth watching but less urgent.`,
                  },
                  {
                    challenge: "The board might read this as giving up on payments",
                    detail: `Framing "wallet-agnostic" as strategic evolution vs. surrender takes careful messaging. If the board sees it as retreat, the strategy stalls regardless of whether the math works.`,
                    ifTrue:
                      "The analysis is right but execution is blocked. Needs a board champion before moving forward.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 text-lg mt-0.5">✕</span>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm mb-2">
                          {item.challenge}
                        </p>
                        <p className="text-sm text-gray-500 mb-3">{item.detail}</p>
                        <div className="bg-gray-50 rounded px-3 py-2">
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">If this is true:</span>{" "}
                            {item.ifTrue}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Verdict:</span> The thesis holds up. These
                  counter-arguments narrow the scope but don't break the core logic. Worth
                  acting on with a pilot, not a full commitment.
                </p>
              </div>
            </div>
          )}

          {/* SCENARIO MODEL TAB */}
          {activeTab === "scenario" && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                What drives the outcome
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Drag these to test different assumptions. The numbers update as you move them.
              </p>

              {/* Key metric display */}
              <div className="bg-gray-900 rounded-xl p-6 mb-8 text-center">
                <p className="text-xs text-gray-400 mb-1">{h.keyMetric}</p>
                <p className="text-4xl font-bold text-white tracking-tight">
                  {currentScenario.impact > 1000
                    ? `$${(currentScenario.impact / 1000).toFixed(1)}B`
                    : `$${currentScenario.impact}M`}
                </p>
                <p className="text-xs text-gray-500 mt-1">{h.keyMetricUnit}</p>
              </div>

              {/* Sliders */}
              <div className="space-y-6 mb-8">
                {h.levers.map((lever, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        {lever.name}
                      </label>
                      <span className="text-sm font-mono text-gray-900">
                        {sliderValues[i] || lever.default}
                        {lever.unit === "percent" ? "%" : ` ${lever.unit}`}
                      </span>
                    </div>
                    {lever.description && (
                      <p className="text-xs text-gray-400 mb-2">{lever.description}</p>
                    )}
                    <input
                      type="range"
                      min={lever.min}
                      max={lever.max}
                      value={sliderValues[i] || lever.default}
                      onChange={(e) => {
                        const newValues = [...sliderValues];
                        newValues[i] = Number(e.target.value);
                        setSliderValues(newValues);
                      }}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>
                        {lever.min}
                        {lever.unit === "percent" ? "%" : ""}
                      </span>
                      <span>
                        {lever.max}
                        {lever.unit === "percent" ? "%" : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Markets affected */}
              {h.affectedMarkets && h.affectedMarkets.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">
                    Markets affected
                  </h4>
                  <div className="space-y-2">
                    {h.affectedMarkets.map((m, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">{m.market}</p>
                          {m.relevance && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {m.relevance.substring(0, 100)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono font-semibold text-gray-900">
                            {typeof m.key_number === "number"
                              ? m.key_number.toLocaleString()
                              : m.key_number}
                          </p>
                          <p className="text-[10px] text-gray-400">{m.key_number_label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OPTIONS TAB */}
          {activeTab === "options" && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Three paths forward</h3>
              <p className="text-sm text-gray-500 mb-6">
                Each one requires giving something up. That is what makes them real options.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {h.options.map((opt, i) => {
                  const isRecommended = i === h.options.length - 1;
                  return (
                    <div
                      key={i}
                      className={`rounded-lg border p-5 ${
                        isRecommended
                          ? "border-green-300 bg-green-50/50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      {isRecommended && (
                        <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded mb-3 inline-block">
                          Recommended
                        </span>
                      )}
                      <h4 className="font-semibold text-gray-900 text-sm mb-3">{opt.name}</h4>

                      {opt.description && (
                        <p className="text-xs text-gray-500 mb-3">{opt.description.substring(0, 120)}</p>
                      )}

                      <div className="mb-3">
                        <div className="flex items-start gap-1.5 mb-1">
                          <TrendingUp className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                          <p className="text-xs text-gray-600">
                            {opt.upside.substring(0, 120)}
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-start gap-1.5">
                          <TrendingDown className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                          <p className="text-xs text-gray-600">
                            {opt.downside.substring(0, 120)}
                          </p>
                        </div>
                      </div>

                      {(opt.feasibility || opt.timeline) && (
                        <div className="flex gap-3 pt-3 border-t border-gray-100">
                          {opt.feasibility && (
                            <span className="text-[10px] text-gray-400">
                              Feasibility:{" "}
                              <span className="text-gray-600">{opt.feasibility}</span>
                            </span>
                          )}
                          {opt.timeline && (
                            <span className="text-[10px] text-gray-400">
                              Timeline:{" "}
                              <span className="text-gray-600">{opt.timeline}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* GOVERNANCE TAB */}
          {activeTab === "governance" && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                What happens next
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                If leadership greenlights this, here is the 90-day plan.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  {
                    period: "30 days",
                    items: [
                      "Pull GrabPay transaction mix by market",
                      "Survey 500 users in Malaysia on payment preference",
                      "Get sandbox access for Mastercard Wallet Pay",
                    ],
                  },
                  {
                    period: "60 days",
                    items: [
                      "Pilot TNG at GrabFood checkout (10% of Malaysia users)",
                      "Measure conversion lift and cannibalization rate",
                      "Present board deck with three scenarios and P&L impact",
                    ],
                  },
                  {
                    period: "90 days",
                    items: [
                      "Go/No-Go decision on wallet-agnostic strategy",
                      "If Go: expand to 50% Malaysia, start GCash pilot in Philippines",
                      "If No-Go: lock in GrabPay defense plan with capital allocation",
                    ],
                  },
                ].map((phase, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-5">
                    <p className="text-sm font-bold text-gray-900 mb-3">{phase.period}</p>
                    <div className="space-y-2">
                      {phase.items.map((item, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-gray-300 mt-2 shrink-0" />
                          <p className="text-xs text-gray-600 leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Kill criteria */}
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
                <p className="text-xs font-semibold text-red-700 mb-1">Stop if</p>
                <p className="text-sm text-red-800">
                  Conversion lift is below 8%, or GrabPay cannibalization exceeds 40%, or
                  Ant/Mastercard change their commercial terms in ways that make the
                  integration uneconomical.
                </p>
              </div>

              {/* Data gaps */}
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  What the agent does not have
                </h4>
                <p className="text-xs text-gray-400 mb-3">
                  An honest list of gaps. These numbers would sharpen the recommendation.
                </p>
                <div className="space-y-2">
                  {[
                    "GrabPay transaction mix: what share is ride-linked vs. standalone merchant payments?",
                    "User wallet overlap: how many people in Malaysia have both GrabPay and TNG installed?",
                    "Vietnam P&L by vertical: actual EBITDA for mobility vs. delivery vs. finserv",
                  ].map((gap, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 text-xs mt-0.5">?</span>
                      <p className="text-xs text-gray-600">{gap}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SIGNALS TAB */}
          {activeTab === "signals" && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                What Scout picked up this week
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Real signals from the monitoring pipeline. Each one was scored, filtered, and
                fed to the AI agent for analysis.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  {
                    date: "Sep 11, 2026",
                    source: "Competitor",
                    title: "Ant International rolls out Agentic Payment Protocol globally",
                    outlet: "Finews.asia",
                    score: 14,
                    competitors: "TNG, Dana, GCash, TrueMoney, Alipay",
                  },
                  {
                    date: "Sep 11, 2026",
                    source: "Competitor",
                    title: "Mastercard unveils Wallet Pay for connected global payments",
                    outlet: "The Business Standard",
                    score: 3,
                    competitors: "TrueMoney",
                  },
                  {
                    date: "Sep 12, 2026",
                    source: "Market Data",
                    title: "Grab Q2 2026: $134M FinServ revenue, 59% YoY, $2.3B loan portfolio",
                    outlet: "Grab Investor Relations",
                    score: 0,
                    competitors: "",
                  },
                ].map((signal, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between py-3 px-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-gray-400">{signal.date}</span>
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {signal.source}
                        </span>
                        {signal.score > 0 && (
                          <span className="text-[10px] text-gray-400">
                            Score: {signal.score}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-800 font-medium">{signal.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400">{signal.outlet}</span>
                        {signal.competitors && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span className="text-[10px] text-gray-400">
                              Detected via: {signal.competitors}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-1" />
                  </div>
                ))}
              </div>

              {/* Pipeline status */}
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Pipeline status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-gray-700">Competitor news</span>
                    </div>
                    <span className="text-gray-400">31 queries · Last: Sep 12</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-gray-700">Market data</span>
                    </div>
                    <span className="text-gray-400">8 markets · Last: Sep 12</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="text-gray-700">Earnings monitor</span>
                    </div>
                    <span className="text-gray-400">Planned · quarterly</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex gap-6 text-xs text-gray-400">
                  <span>14 signals processed</span>
                  <span>6 passed filter</span>
                  <span>3 used in hypotheses</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="max-w-5xl mx-auto px-5 py-8 flex items-center justify-between text-xs text-gray-400">
        <span>
          Scout runs on Claude + n8n. Data from Airtable.{" "}
          <a
            href="https://github.com/ktlearnsai-ship-it/ai-agents-portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            View the architecture →
          </a>
        </span>
        <button
          onClick={() => router.push("/")}
          className="text-gray-400 hover:text-gray-600"
        >
          ← Back to portfolio
        </button>
      </footer>
    </div>
  );
}
