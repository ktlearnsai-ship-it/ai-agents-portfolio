"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  ShieldAlert,
  Clock
} from "lucide-react";
import clsx from "clsx";

interface Lever {
  name: string;
  min: number;
  max: number;
  default: number;
  unit: string;
  impact_direction?: string;
}

interface Scenario {
  lever1: number;
  lever2?: number;
  impact: number;
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

interface HypothesisDetail {
  id: string;
  rank: number;
  title: string;
  thesis: string;
  fullAnalysis: string;
  whyNow: string;
  posture: "defensive" | "growth" | "expand";
  urgency: number;
  growthPotential: number;
  confidence: "high" | "medium" | "low";
  keyMetric: string;
  keyMetricValue: number;
  keyMetricUnit: string;
  impactLogic: string;
  levers: Lever[];
  scenarioGrid: Scenario[];
  affectedMarkets: Market[];
  options: Option[];
  milestones30d: string;
  milestones60d: string;
  milestones90d: string;
  killCriteria: string;
}

export default function HypothesisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [hypothesis, setHypothesis] = useState<HypothesisDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Slider interactive state
  const [sliderValues, setSliderValues] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (!id) return;
    fetch("/api/hypotheses")
      .then((res) => res.json())
      .then((data: HypothesisDetail[]) => {
        const found = data.find((h) => h.id === id);
        if (found) {
          setHypothesis(found);
          // Initialize sliders with default values
          const initialVals: { [key: number]: number } = {};
          found.levers?.forEach((lever, idx) => {
            initialVals[idx] = lever.default ?? lever.min;
          });
          setSliderValues(initialVals);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching detail:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAFA]">
        <div className="animate-pulse text-sm font-medium text-gray-500">
          Loading Strategic Brief...
        </div>
      </div>
    );
  }

  if (!hypothesis) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#FAFAFA] text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Hypothesis Not Found</h2>
        <button 
          onClick={() => router.push("/")}
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </button>
      </div>
    );
  }

  // Handle slider changes
  const handleSliderChange = (index: number, val: number) => {
    setSliderValues((prev) => ({ ...prev, [index]: val }));
  };

  // Find closest scenario impact based on sliders
  const findCurrentImpact = () => {
    if (!hypothesis.scenarioGrid || hypothesis.scenarioGrid.length === 0) {
      return hypothesis.keyMetricValue;
    }

    const l1Val = sliderValues[0] ?? hypothesis.levers[0]?.default ?? 0;
    const l2Val = sliderValues[1] ?? hypothesis.levers[1]?.default ?? 0;

    let closest = hypothesis.scenarioGrid[0];
    let minDist = Infinity;

    for (const s of hypothesis.scenarioGrid) {
      const sL2 = s.lever2 ?? 0;
      const userL2 = l2Val ?? 0;
      const dist = Math.abs(s.lever1 - l1Val) + Math.abs(sL2 - userL2);
      if (dist < minDist) {
        minDist = dist;
        closest = s;
      }
    }

    return closest.impact;
  };

  const dynamicImpact = findCurrentImpact();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] pb-24">
      {/* HEADER NAV */}
      <header className="border-b border-gray-200 bg-white px-8 py-4 sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </button>
          <div className="flex items-center gap-3">
            <span className={clsx(
              "text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full",
              hypothesis.posture === 'defensive' && "bg-red-50 text-red-600 border border-red-100",
              hypothesis.posture === 'growth' && "bg-green-50 text-green-600 border border-green-100",
              hypothesis.posture === 'expand' && "bg-blue-50 text-blue-600 border border-blue-100"
            )}>
              {hypothesis.posture}
            </span>
            <span className="text-xs font-semibold px-3 py-1 bg-gray-100 rounded-full text-gray-700">
              Urgency: {hypothesis.urgency}/10
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-8 mt-10">
        {/* SECTION 1: RECOMMENDATION HEADER */}
        <section className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span>Rank #{hypothesis.rank} Priority</span>
            <span>•</span>
            <span>Confidence: <strong className="text-gray-900">{hypothesis.confidence}</strong></span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
            {hypothesis.title}
          </h1>

          {hypothesis.whyNow && (
            <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">Why Now (Trigger)</h3>
              <p className="text-sm text-amber-900 leading-relaxed">{hypothesis.whyNow}</p>
            </div>
          )}

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Strategic Thesis</h3>
            <p className="text-base text-gray-700 leading-relaxed font-normal whitespace-pre-line">
              {hypothesis.thesis}
            </p>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE SCENARIO MODEL */}
        <section className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Interactive Scenario Model</h2>
          </div>

          {/* Dynamic Metric Banner */}
          <div className="bg-gray-900 text-white rounded-lg p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-mono mb-1">
                Live Key Metric ({hypothesis.keyMetric})
              </p>
              <div className="text-3xl font-extrabold font-mono text-blue-400">
                {dynamicImpact} <span className="text-sm font-normal text-gray-300">{hypothesis.keyMetricUnit}</span>
              </div>
            </div>
            <div className="text-xs text-gray-400 max-w-xs leading-relaxed border-l border-gray-800 pl-4">
              {hypothesis.impactLogic || "Adjust sliders below to recalculate projected impact based on variable assumptions."}
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {hypothesis.levers?.map((lever, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-100 p-5 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-gray-800">{lever.name}</label>
                  <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {sliderValues[idx] ?? lever.default} {lever.unit}
                  </span>
                </div>
                <input 
                  type="range"
                  min={lever.min}
                  max={lever.max}
                  step={1}
                  value={sliderValues[idx] ?? lever.default}
                  onChange={(e) => handleSliderChange(idx, Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between items-center mt-2 text-[11px] text-gray-400 font-mono">
                  <span>Min: {lever.min}{lever.unit}</span>
                  <span>Default: {lever.default}{lever.unit}</span>
                  <span>Max: {lever.max}{lever.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Affected Markets */}
          {hypothesis.affectedMarkets && hypothesis.affectedMarkets.length > 0 && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Affected Markets</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {hypothesis.affectedMarkets.map((m, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <span className="text-xs font-bold text-gray-900 block mb-1">{m.market}</span>
                    <span className="text-lg font-mono font-bold text-blue-600 block">{m.key_number}</span>
                    <span className="text-[11px] text-gray-500 leading-tight block">{m.key_number_label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SECTION 3: STRATEGIC OPTIONS */}
        {hypothesis.options && hypothesis.options.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-gray-400" /> Strategic Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hypothesis.options.map((opt, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      Option {String.fromCharCode(65 + idx)}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-3 mb-2">{opt.name}</h3>
                    <p className="text-xs text-gray-600 mb-4 leading-relaxed">{opt.description}</p>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-gray-100 text-xs">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-green-800">
                      <strong className="block font-bold mb-0.5 text-green-900">Upside:</strong>
                      {opt.upside}
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-800">
                      <strong className="block font-bold mb-0.5 text-red-900">Downside:</strong>
                      {opt.downside}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: FULL ANALYSIS */}
        <section className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-400" /> Full Partner Analysis
          </h2>
          <div className="prose text-sm text-gray-700 leading-relaxed space-y-4 font-normal whitespace-pre-line">
            {hypothesis.fullAnalysis || hypothesis.thesis}
          </div>
        </section>

        {/* SECTION 5: GOVERNANCE */}
        {(hypothesis.milestones30d || hypothesis.killCriteria) && (
          <section className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" /> Governance & Execution Roadmap
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">30-Day Milestone</span>
                <p className="text-xs text-gray-700 leading-relaxed">{hypothesis.milestones30d || "Define team structure and initial pilot scope."}</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">60-Day Milestone</span>
                <p className="text-xs text-gray-700 leading-relaxed">{hypothesis.milestones60d || "Deploy prototype and gather early telemetry."}</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">90-Day Milestone</span>
                <p className="text-xs text-gray-700 leading-relaxed">{hypothesis.milestones90d || "Evaluate KPIs and decide on scale-up or pivot."}</p>
              </div>
            </div>

            {hypothesis.killCriteria && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2 text-red-800 font-bold text-sm">
                  <ShieldAlert className="w-5 h-5 text-red-600" /> Kill Criteria
                </div>
                <p className="text-xs text-red-900 leading-relaxed">{hypothesis.killCriteria}</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}