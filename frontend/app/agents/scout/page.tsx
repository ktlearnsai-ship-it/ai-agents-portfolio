// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, TrendingUp, Sliders, ChevronDown, ChevronUp,
  AlertCircle, CheckCircle2, MinusCircle, Download,
  Zap, Target, Loader2, Radar,
  Plus, Star, X, Sparkles, BookmarkPlus, Trash2, Eye,
  Newspaper, Shield, BarChart3, ClipboardCheck,
  Trophy, ArrowRight, RefreshCw, Building2, Tag, MapPin,
  Calendar, Filter, Check, Lightbulb, SortDesc,
} from "lucide-react";
export const dynamic = "force-dynamic";

/* ═══ TOKENS ═══ */
const C = {
  scout: "#D85A30", scoutLight: "#FAECE7",
  grab: "#00b14f", grabDark: "#008a3d", grabDarker: "#005a28", grabLight: "#e6f7ed", grabXLight: "#f0faf4",
  bg: "#FAFAF7", card: "#FFFFFF", cardAlt: "#F8F7F3", border: "#E8E6E0",
  text: "#2C2C2A", sub: "#6B6B65", muted: "#9E9E96",
  redEdge: "#E24B4A", redBg: "#FEF0EE", redText: "#A32D2D",
  amberEdge: "#EF9F27", amberBg: "#FEF6E6", amberText: "#854F0B",
  tealEdge: "#1D9E75", tealBg: "#E1F5EE", tealText: "#085041",
};

const STAGES = [
  { id: "researcher", label: "Signals", icon: Search, desc: "Find competitive signals" },
  { id: "interpreter", label: "Patterns", icon: BarChart3, desc: "Spot growth adjacencies" },
  { id: "thought", label: "Stress test", icon: Shield, desc: "Validate assumptions" },
  { id: "simulator", label: "Simulate", icon: Sliders, desc: "Model what-if scenarios" },
  { id: "communicator", label: "Test plan", icon: ClipboardCheck, desc: "Ship the experiment" },
];

const SECTORS = ["All", "Payments", "Mobility", "FinServ", "Food Delivery", "Logistics", "Regulatory", "AI / Technology"];
const MARKETS_LIST = ["All", "Malaysia", "Singapore", "Indonesia", "Philippines", "Thailand", "Vietnam", "Cambodia", "Myanmar"];
const TIME_RANGES = ["All", "Last week", "Last month", "Last 3 months", "Last 6 months"];
const COMP_MAP = {
  All: ["Ant Group", "Sea Group", "GoTo / Gojek", "GCash", "Touch n Go", "Dana", "TrueMoney", "Mastercard", "Visa", "Maxim", "inDrive"],
  Payments: ["Ant Group", "GCash", "Touch n Go", "Dana", "TrueMoney", "Mastercard", "Visa"],
  Mobility: ["GoTo / Gojek", "Maxim", "inDrive"],
  FinServ: ["Ant Group", "Sea Group", "GCash", "Dana", "Mastercard", "Visa"],
  "Food Delivery": ["GoTo / Gojek", "Sea Group", "Foodpanda"],
  Logistics: ["Sea Group", "GoTo / Gojek", "J&T Express"],
  Regulatory: [], "AI / Technology": ["Sea Group", "GoTo / Gojek"],
};

/* ═══ HELPERS ═══ */
function fmt(d) { if (!d) return ""; try { const dt = new Date(d); return isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); } catch { return d; } }
function clean(s) { return (s || "").replace(/\u2014/g, "-").replace(/\u2013/g, "-"); }

const COUNTRY_CODES = { Malaysia: "MY", Singapore: "SG", Indonesia: "ID", Philippines: "PH", Thailand: "TH", Vietnam: "VN", Cambodia: "KH", Myanmar: "MM" };
function toCode(m) { if (!m) return m; if (m.length <= 3) return m; return COUNTRY_CODES[m] || m; }
function marketCodes(arr) { return (arr || []).map(m => typeof m === "string" ? toCode(m) : toCode(m.market)); }

const COMP_SECTOR = {
  "Maxim": "Mobility", "inDrive": "Mobility", "GoTo / Gojek": "Mobility", "GoTo": "Mobility", "Gojek": "Mobility",
  "Ant Group": "Payments", "GCash": "Payments", "Dana": "Payments", "Touch n Go": "Payments", "TrueMoney": "Payments", "Mastercard": "Payments", "Visa": "Payments",
  "Sea Group": "Deliveries", "Shopee": "Deliveries", "Foodpanda": "Food Delivery", "J&T Express": "Logistics",
};
function inferSector(s) {
  if (s.sector && s.sector !== "General") return s.sector;
  if (s.competitor && COMP_SECTOR[s.competitor]) return COMP_SECTOR[s.competitor];
  const text = ((s.title || "") + " " + (s.impact || "") + " " + (s.hypothesis_statement || "")).toLowerCase();
  if (text.includes("ride") || text.includes("driver") || text.includes("mobility") || text.includes("commission cap")) return "Mobility";
  if (text.includes("payment") || text.includes("wallet") || text.includes("grabpay") || text.includes("amp") || text.includes("fintech")) return "Payments";
  if (text.includes("deliver") || text.includes("food")) return "Deliveries";
  if (text.includes("logistic") || text.includes("shipping")) return "Logistics";
  return "General";
}

function shortName(h) {
  if (h.hypothesis_name && h.hypothesis_name !== "Hypothesis") return clean(h.hypothesis_name);
  const stmt = clean(h.hypothesis_statement || "");
  // Extract "If Grab [action] within..." → imperative title
  const m = stmt.match(/^If Grab\s+(.+?)(?:\s+within\b|\s+in\s+\d|\s+over\s+the\s+next|,)/i);
  if (m) {
    let action = m[1].trim();
    // "builds X" → "Build X", "launches X" → "Launch X"
    action = action.replace(/^(\w+?)s\b/i, (_, v) => v.charAt(0).toUpperCase() + v.slice(1));
    // Capitalize first letter if not already
    action = action.charAt(0).toUpperCase() + action.slice(1);
    return action;
  }
  // Fallback: first sentence up to comma
  const fallback = stmt.split(/[,.]/).filter(Boolean)[0] || stmt;
  return fallback.substring(0, 50);
}

/* ═══ SMALL COMPONENTS ═══ */
function ConfPill({ level }) {
  const m = { high: { bg: C.tealBg, c: C.tealText, I: CheckCircle2 }, medium: { bg: C.amberBg, c: C.amberText, I: MinusCircle }, low: { bg: C.redBg, c: C.redText, I: AlertCircle } };
  const s = m[level] || m.medium;
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", padding: "3px 9px", borderRadius: 99, background: s.bg, color: s.c }}><s.I style={{ width: 11, height: 11 }} />{level}</span>;
}

function Toast({ msg, onClose }) { useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, [onClose]); return <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 999, display: "flex", alignItems: "center", gap: 8, background: C.grab, color: "white", padding: "12px 24px", borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", fontSize: 14, fontWeight: 600 }}><CheckCircle2 style={{ width: 16, height: 16 }} />{msg}</div>; }

function CompanyDD() {
  const [o, setO] = useState(false);
  return <div style={{ position: "relative" }}>
    <button onClick={() => setO(!o)} style={{ border: `1px solid ${C.border}`, borderRadius: 99, padding: "6px 16px", display: "flex", alignItems: "center", gap: 8, fontSize: 13, background: C.card, cursor: "pointer" }}><span style={{ color: C.muted }}>Analyzing</span><span style={{ fontWeight: 600, color: C.text }}>Grab</span><ChevronDown style={{ width: 14, height: 14, color: C.muted }} /></button>
    {o && <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 240, background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", zIndex: 50 }}><div style={{ padding: 8 }}><div style={{ padding: "8px 12px", borderRadius: 8, background: C.grabXLight, display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 13, fontWeight: 600 }}>Grab Holdings</span><CheckCircle2 style={{ width: 14, height: 14, color: C.grab }} /></div>{["GoTo Group", "Sea Group"].map(c => <div key={c} style={{ padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.45 }}><span style={{ fontSize: 13, color: C.sub }}>{c}</span><span style={{ fontSize: 10, fontWeight: 600, color: C.muted, background: C.cardAlt, padding: "2px 8px", borderRadius: 99 }}>SOON</span></div>)}</div></div>}
  </div>;
}

/* Hypothesis context banner for stages 2-5 */
function HypContext({ h }) {
  const mkts = marketCodes(h.primary_markets || h.affected_markets || []);
  const sector = inferSector(h);
  return (
    <div style={{ background: C.grabXLight, border: `1px solid ${C.grab}`, borderRadius: 14, padding: "16px 22px", marginBottom: 28, borderLeft: `4px solid ${C.grab}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.grabDarker, background: "rgba(255,255,255,0.7)", padding: "3px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 3 }}><Tag style={{ width: 10, height: 10 }} />{sector}</span>
        {mkts.map(m => <span key={m} style={{ fontSize: 11, fontWeight: 600, color: C.sub, background: "rgba(255,255,255,0.7)", padding: "2px 8px", borderRadius: 6 }}>{m}</span>)}
        <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(255,255,255,0.7)", padding: "3px 9px", borderRadius: 99 }}>Urgency {h.urgency}/10</span>
        <ConfPill level={(h.confidence || "medium").toLowerCase()} />
      </div>
      <p style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>{clean(h.hypothesis_statement)}</p>
    </div>
  );
}

/* Next stage button */
function NextStage({ current, setTab }) {
  const idx = STAGES.findIndex(s => s.id === current);
  if (idx >= STAGES.length - 1) return null;
  const next = STAGES[idx + 1];
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
      <button onClick={() => setTab(next.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 12, border: "none", background: C.grab, color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
        Next: {next.label}<ArrowRight style={{ width: 16, height: 16 }} />
      </button>
    </div>
  );
}

/* ═══ MAIN ═══ */
export default function ScoutPage() {
  const [activeTab, setActiveTab] = useState("researcher");
  const [hypothesis, setHypothesis] = useState(null);
  const [leverValues, setLeverValues] = useState({});
  const [researchMode, setResearchMode] = useState(null);
  const [showModes, setShowModes] = useState(false);

  const [newsOpenSignal, setNewsOpenSignal] = useState(null);
  const [investigatingSignal, setInvestigatingSignal] = useState(null);
  const [investigationResults, setInvestigationResults] = useState({});

  const [searchMarket, setSearchMarket] = useState("All");
  const [searchSector, setSearchSector] = useState("All");
  const [searchCompetitor, setSearchCompetitor] = useState("All");
  const [searchTime, setSearchTime] = useState("Last 3 months");
  const [targetedResults, setTargetedResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchAbort, setSearchAbort] = useState(null);

  const [filterMarket, setFilterMarket] = useState("All");
  const [filterSector, setFilterSector] = useState("All");
  const [filterCompany, setFilterCompany] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [selectedSignals, setSelectedSignals] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStatus, setGenStatus] = useState("");
  const [genAbort, setGenAbort] = useState(null);
  const [generatedHyp, setGeneratedHyp] = useState(null);
  const [rhsExpanded, setRhsExpanded] = useState(false);
  const [top3, setTop3] = useState([null, null, null]);
  const [activeSlot, setActiveSlot] = useState(0);
  const [savedHyps, setSavedHyps] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [toast, setToast] = useState(null);

  // localStorage persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem("scout_state");
      if (saved) {
        const s = JSON.parse(saved);
        if (s.top3) setTop3(s.top3);
        if (s.activeSlot !== undefined) setActiveSlot(s.activeSlot);
        if (s.savedHyps) setSavedHyps(s.savedHyps);
        if (s.generatedHyp) setGeneratedHyp(s.generatedHyp);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("scout_state", JSON.stringify({ top3, activeSlot, savedHyps, generatedHyp }));
    } catch {}
  }, [top3, activeSlot, savedHyps, generatedHyp]);

  useEffect(() => {
    fetch("/api/hypotheses").then(r => r.json()).then(d => {
      if (d?.length > 0) {
        setHypothesis(d[0]);
        if (d[0].levers) setLeverValues(Object.fromEntries(d[0].levers.map(l => [l.id, l.default])));
        // Only set top3 from pipeline if no localStorage data
        try { const saved = localStorage.getItem("scout_state"); if (!saved || !JSON.parse(saved).top3?.[0]) {
          const mapped = d.map(h => ({ ...h, source_label: "Weekly scan", created: fmt(h.generated_date) }));
          setTop3([mapped[0], mapped[1] || null, mapped[2] || null]);
          setSavedHyps(mapped);
        }} catch { const mapped = d.map(h => ({ ...h, source_label: "Weekly scan", created: fmt(h.generated_date) })); setTop3([mapped[0], mapped[1] || null, mapped[2] || null]); setSavedHyps(mapped); }
      }
    }).catch(e => console.log("FETCH ERROR:", e));
  }, []);

  if (!hypothesis) return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', system-ui, sans-serif" }}><div style={{ textAlign: "center" }}><div style={{ width: 48, height: 48, borderRadius: 14, background: C.scout, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Search style={{ width: 24, height: 24, color: "white" }} /></div><p style={{ fontSize: 14, color: C.muted }}>Loading Scout...</p></div></div>;

  const h = top3[activeSlot] || hypothesis || {};

  /* ─── API ─── */
  async function investigateSignal(sig) {
    try {
      const r = await fetch("/api/research", { method: "POST", body: JSON.stringify({ max_tokens: 2000, tools: [{ type: "web_search_20250305", name: "web_search" }], messages: [{ role: "user", content: `You are Scout's Research Agent for Grab Holdings.\n\nSIGNAL: ${sig.title}\nDate: ${sig.date}\nCompetitor: ${sig.competitor}\nMarkets: ${(sig.markets || []).join(", ")}\nImpact: ${sig.impact}\n\nSearch for latest developments from the last 6 months. Return ONLY a JSON array (max 5). No prose. Each: { "date": "Mon DD, YYYY", "title": "headline", "implication": "one sentence" }. Sort newest first. Real events only. No em dashes.` }] }) });
      const d = await r.json(); if (!d.content) return [];
      const t = d.content.filter(i => i.type === "text").map(i => i.text).join("\n").replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const m = t.match(/\[[\s\S]*\]/); return m ? JSON.parse(m[0]) : [];
    } catch { return []; }
  }

  async function runSearch(query, controller) {
    try {
      const r = await fetch("/api/research", { signal: controller?.signal, method: "POST", body: JSON.stringify({ max_tokens: 3000, tools: [{ type: "web_search_20250305", name: "web_search" }], messages: [{ role: "user", content: `You are Scout's Research Agent for Grab Holdings.\n\nQUERY: ${query}\n\nReturn ONLY a JSON array. Each: { "id": "r1", "date": "Mon DD, YYYY", "title": "headline", "competitor": "company", "sector": "Payments/Mobility/FinServ/Food Delivery/Logistics", "markets": ["XX"], "impact": "2-3 sentences", "tag": "THREAT/OPPORTUNITY/SHIFT" }. 5-8 signals, date desc. Real events only. No em dashes.` }] }) });
      const d = await r.json(); if (!d.content) return [];
      const t = d.content.filter(i => i.type === "text").map(i => i.text).join("\n").replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const m = t.match(/\[[\s\S]*\]/); return m ? JSON.parse(m[0]) : [];
    } catch (e) { if (e.name === "AbortError") return []; throw e; }
  }

  async function generateHyp(signals, controller) {
    setIsGenerating(true); setGenStatus("Analyzing signal patterns...");
    try {
      setTimeout(() => setGenStatus("Building assumptions..."), 3000);
      setTimeout(() => setGenStatus("Constructing test plan..."), 6000);
      const desc = signals.map((s, i) => `Signal ${i + 1}: ${s.title} (${s.date}, ${s.competitor}, ${inferSector(s)}, Markets: ${(s.markets || []).join(", ")}). Impact: ${s.impact}`).join("\n");
      const r = await fetch("/api/research", { signal: controller?.signal, method: "POST", body: JSON.stringify({ max_tokens: 8000, messages: [{ role: "user", content: `You are Scout, a growth strategy agent for Grab Holdings in Southeast Asia.\n\nGenerate ONE hypothesis from these signals.\n\nSIGNALS:\n${desc}\n\nReturn ONLY valid JSON. No markdown, no backticks:\n{\n  "hypothesis_name": "2-4 word verb-style title like 'Launch AMP interop' or 'Defend driver supply'",\n  "hypothesis_statement": "If [action] within [timeframe], [metric] will [change] by [amount], because [reasoning].",\n  "posture": "defensive/expand/growth",\n  "urgency": 7,\n  "confidence": "high/medium/low",\n  "test_window": "90 days",\n  "suggested_owner": "role name",\n  "sector": "primary sector",\n  "primary_markets": ["XX"],\n  "assumptions": [{"id": "a1", "statement": "text", "confidence": "high/medium/low", "basis": "text", "pressure_test": "text", "linked_signals": ["s1"]}],\n  "kill_criteria": ["threshold"],\n  "levers": [{"id": "l1", "name": "name", "linked_assumption": "a1", "min": 0, "max": 100, "default": 50, "unit": "%"}],\n  "test_plan": {"what_to_test": ["test"], "data_scout_provides": ["item"], "data_team_gathers": ["item"], "success_criteria": ["metric >= threshold"], "timeline": [{"weeks": "Week 1-2", "task": "task", "owner": "team"}]}\n}\n\n4 assumptions, 3 kill criteria, 3 levers, 4 timeline entries. Concise. No em dashes.` }] }) });
      const d = await r.json(); if (!d.content) return;
      const t = d.content.filter(i => i.type === "text").map(i => i.text).join("\n").replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const m = t.match(/\{[\s\S]*\}/);
      if (m) {
        let j = m[0].replace(/,\s*}/g, "}").replace(/,\s*]/g, "]").replace(/\/\/[^\n]*/g, "").replace(/\u2014/g, "-").replace(/\u2013/g, "-");
        const p = JSON.parse(j);
        p.signals = signals.map((s, i) => ({ ...s, id: s.id || "s" + (i + 1) }));
        p.id = "gen_" + Date.now(); p.source_label = "Generated"; p.created = fmt(new Date().toISOString()); p.generated_date = p.created;
        setGeneratedHyp(p); setRhsExpanded(false);
      }
    } catch (e) { if (e.name !== "AbortError") console.error("Gen error:", e); }
    finally { setIsGenerating(false); setGenAbort(null); }
  }

  /* ─── Helpers ─── */
  function toggleSig(s) { setSelectedSignals(p => { const k = s.id || s.title; return p.find(x => (x.id || x.title) === k) ? p.filter(x => (x.id || x.title) !== k) : p.length >= 5 ? p : [...p, s]; }); }
  function isSel(s) { return selectedSignals.some(x => (x.id || x.title) === (s.id || s.title)); }
  function addTop3(hyp) { const i = top3.findIndex(s => s === null); if (i !== -1) { const n = [...top3]; n[i] = hyp; setTop3(n); setToast("Added to top 3"); } }
  function rmTop3(i) { const n = [...top3]; n[i] = null; setTop3(n); if (activeSlot === i) { const next = n.findIndex(s => s !== null); if (next !== -1) setActiveSlot(next); } }
  function saveHyp(hyp) { setSavedHyps(p => p.find(h => h.id === hyp.id) ? p : [hyp, ...p]); setToast("Saved to hypotheses"); }
  function openGenFlow() { setShowModes(true); setResearchMode("found"); }

  const rec = (() => {
    const v1 = leverValues["l1"] ?? 65, v2 = leverValues["l2"] ?? 150, v3 = leverValues["l3"] ?? 15;
    if (v1 < 45 || v3 > 30) return { label: "HYPOTHESIS AT RISK", color: "red", msg: "Key assumptions are breaking. Recommend delaying test and running further validation." };
    if (v1 < 60 || v2 < 75) return { label: "TEST SMALLER FIRST", color: "amber", msg: "Marginal case. Recommend a limited pilot in one market before regional rollout." };
    return { label: "GREEN LIGHT", color: "green", msg: "Assumption stack holds. Launch phased pilot. Expected conversion lift 4-7%." };
  })();

  // Filter + sort
  let signals = [...(h.signals || [])].map(s => ({ ...s, sector: inferSector(s), markets: (s.markets || []).map(toCode) }));
  if (filterMarket !== "All") signals = signals.filter(s => s.markets.some(m => m === toCode(filterMarket)));
  if (filterSector !== "All") signals = signals.filter(s => s.sector.toLowerCase().includes(filterSector.toLowerCase()));
  if (filterCompany !== "All") signals = signals.filter(s => (s.competitor || "").toLowerCase().includes(filterCompany.toLowerCase()));
  signals.sort((a, b) => sortBy === "newest" ? new Date(b.date).getTime() - new Date(a.date).getTime() : new Date(a.date).getTime() - new Date(b.date).getTime());

  const targetedSorted = [...targetedResults].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const curSignals = researchMode === "targeted" ? targetedSorted : signals;
  const availComps = COMP_MAP[searchSector] || COMP_MAP["All"];
  const allCompanies = [...new Set((h.signals || []).map(s => s.competitor).filter(Boolean))];

  /* ─── Signal Card ─── */
  const SigCard = ({ s, idx }) => {
    const sel = isSel(s);
    const sk = s.id || s.title;
    const newsOpen = newsOpenSignal === sk;
    const inv = investigatingSignal === sk;
    const findings = investigationResults[sk] || [];
    const edge = s.tag === "THREAT" ? C.redEdge : s.tag === "OPPORTUNITY" ? C.tealEdge : C.amberEdge;
    const tagS = s.tag === "THREAT" ? { bg: C.redBg, c: C.redText } : s.tag === "OPPORTUNITY" ? { bg: C.tealBg, c: C.tealText } : { bg: C.amberBg, c: C.amberText };

    return (
      <div style={{ borderRadius: 16, overflow: "hidden", border: sel ? `2px solid ${C.grab}` : `1px solid ${C.border}`, background: sel ? C.grabXLight : C.card }}>
        <div style={{ display: "flex" }}>
          <div style={{ width: 5, flexShrink: 0, background: edge }} />
          <div style={{ flex: 1, padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              {s.competitor && <span style={{ fontSize: 12, fontWeight: 600, color: C.text, background: sel ? "rgba(255,255,255,0.7)" : C.cardAlt, padding: "4px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 4 }}><Building2 style={{ width: 12, height: 12, color: C.muted }} />{s.competitor}</span>}
              <span style={{ fontSize: 12, fontWeight: 600, color: C.grabDarker, background: C.grabLight, padding: "4px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 4 }}><Tag style={{ width: 12, height: 12 }} />{s.sector}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}><Calendar style={{ width: 12, height: 12 }} />{fmt(s.date)}</span>
                <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 99, background: tagS.bg, color: tagS.c }}>{s.tag || "SHIFT"}</span>
              </div>
              <button onClick={() => toggleSig(s)} style={{ width: 24, height: 24, borderRadius: 8, border: sel ? "none" : `2px solid ${C.border}`, background: sel ? C.grab : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                {sel && <Check style={{ width: 14, height: 14, color: "white", strokeWidth: 3 }} />}
              </button>
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.45, marginBottom: 8 }}>{clean(s.title)}</p>
            <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, marginBottom: 14 }}>{clean(s.impact)}</p>
            {(s.markets || []).length > 0 && (
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: C.muted }}>Markets impacted</span>
                {s.markets.map(m => <span key={m} style={{ fontSize: 11, fontWeight: 600, color: C.sub, background: sel ? "rgba(255,255,255,0.7)" : C.cardAlt, padding: "3px 8px", borderRadius: 6, border: `1px solid ${C.border}` }}>{m}</span>)}
              </div>
            )}
            <button onClick={async () => { if (newsOpen) { setNewsOpenSignal(null); return; } setNewsOpenSignal(sk); if (!findings.length && !inv) { setInvestigatingSignal(sk); const res = await investigateSignal(s); setInvestigationResults(p => ({ ...p, [sk]: res })); setInvestigatingSignal(null); } }} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: C.grabDark, background: C.grabLight, border: "none", padding: "7px 14px", borderRadius: 10, cursor: "pointer" }}>
              <Newspaper style={{ width: 14, height: 14 }} />Latest news {newsOpen ? "▴" : "▾"}
            </button>
            {newsOpen && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                {inv ? <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.grab, fontSize: 13 }}><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />Searching...</div>
                : findings.length > 0 ? <div>{findings.slice(0, 5).map((f, i) => <div key={i} style={{ borderRadius: 12, background: C.cardAlt, padding: "12px 14px", border: `1px solid ${C.border}`, marginBottom: 8 }}><span style={{ fontSize: 11, color: C.muted }}>{fmt(f.date)}</span><p style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{clean(f.title)}</p><p style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>{clean(f.implication)}</p></div>)}</div>
                : <p style={{ fontSize: 12, color: C.muted }}>No recent articles found.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ═══ RENDER ═══ */
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter', system-ui, sans-serif", color: C.text }}>
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <header style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: C.scout, display: "flex", alignItems: "center", justifyContent: "center" }}><Search style={{ width: 18, height: 18, color: "white" }} strokeWidth={2.5} /></div>
            <span style={{ fontSize: 24, fontWeight: 800 }}>Scout</span>
            <span style={{ color: C.border, fontSize: 20 }}>&#183;</span>
            <span style={{ fontSize: 15, color: C.sub }}>Brings AI-powered rigor to help you make bolder strategic bets</span>
          </div>
          <CompanyDD />
        </div>
      </header>

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 28px" }}>
        {/* Stage Bar with descriptions */}
        <div style={{ display: "flex", background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 32 }}>
          {STAGES.map((st, i) => { const act = activeTab === st.id; const Icon = st.icon; return (
            <button key={st.id} onClick={() => setActiveTab(st.id)} style={{ flex: 1, padding: "16px 8px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, background: act ? C.grabXLight : "transparent", border: "none", borderBottom: act ? `3px solid ${C.grab}` : "3px solid transparent", cursor: "pointer", position: "relative" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: act ? C.grab : "#F1EFE8", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon style={{ width: 16, height: 16, color: act ? "white" : C.muted }} /></div>
              <span style={{ fontSize: 13, fontWeight: 600, color: act ? C.grabDarker : C.muted }}>{st.label}</span>
              <span style={{ fontSize: 10, color: act ? C.grabDark : C.muted }}>{st.desc}</span>
              {i < STAGES.length - 1 && <div style={{ position: "absolute", right: 0, top: "20%", bottom: "20%", width: 1, background: C.border }} />}
            </button>
          ); })}
        </div>

        {/* ═══ SIGNALS TAB ═══ */}
        {activeTab === "researcher" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Trophy style={{ width: 20, height: 20, color: C.scout }} />
                <span style={{ fontSize: 18, fontWeight: 600 }}>Your Top 3 Hypotheses</span>
              </div>
              {/* 3-card grid */}
              <div style={{ display: "flex", gap: 14, marginBottom: 4 }}>
                {top3.map((slot, idx) => {
                  const mkts = slot ? marketCodes(slot.primary_markets || slot.affected_markets || []) : [];
                  const sector = slot ? inferSector(slot) : "";
                  const name = slot ? shortName(slot) : "";
                  return (
                    <div key={idx} style={{ flex: 1 }}>
                      {slot ? (
                        <div style={{ background: activeSlot === idx ? C.grabXLight : C.card, border: activeSlot === idx ? `2px solid ${C.grab}` : `1px solid ${C.border}`, borderRadius: 16, padding: "16px 18px", minHeight: 150, display: "flex", flexDirection: "column", position: "relative" }}>

                         <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
                          {activeSlot === idx ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: C.grab, color: "white", fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 99 }}><Star style={{ width: 9, height: 9 }} />Active</span>
                          : <button onClick={() => { setActiveSlot(idx); if (slot.levers) setLeverValues(Object.fromEntries(slot.levers.map(l => [l.id, l.default]))); }} style={{ fontSize: 9, fontWeight: 600, color: C.sub, background: C.cardAlt, padding: "2px 8px", borderRadius: 99, border: "none", cursor: "pointer" }}>Make active</button>}
                          <span style={{ fontSize: 9, fontWeight: 600, color: C.grabDarker, background: activeSlot === idx ? "rgba(255,255,255,0.7)" : C.grabLight, padding: "2px 7px", borderRadius: 5, display: "flex", alignItems: "center", gap: 2 }}><Tag style={{ width: 8, height: 8 }} />{sector}</span>
                          {mkts.slice(0, 3).map(m => <span key={m} style={{ fontSize: 9, fontWeight: 600, color: C.sub, background: activeSlot === idx ? "rgba(255,255,255,0.7)" : C.cardAlt, padding: "2px 6px", borderRadius: 4 }}>{m}</span>)}
                          <button onClick={() => rmTop3(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 0, marginLeft: "auto" }}><X style={{ width: 12, height: 12 }} /></button>
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.5, marginTop: "auto", marginBottom: 8 }}>{name}</p>
                          <button onClick={() => setExpandedCard(expandedCard === idx ? null : idx)} style={{ alignSelf: "flex-end", fontSize: 11, color: C.grabDark, background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 2 }}>
                            {expandedCard === idx ? <ChevronUp style={{ width: 14, height: 14 }} /> : <ChevronDown style={{ width: 14, height: 14 }} />}
                          </button>
                        </div>
                      ) : (
                        <div onClick={openGenFlow} style={{ background: C.cardAlt, border: `2px dashed ${C.border}`, borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 150, cursor: "pointer" }}>
                          <Plus style={{ width: 22, height: 22, color: C.muted }} />
                          <p style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>Generate new</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Full-width expanded card */}
              {expandedCard !== null && top3[expandedCard] && (() => {
                const slot = top3[expandedCard];
                const mkts = marketCodes(slot.primary_markets || slot.affected_markets || []);
                const sector = inferSector(slot);
                return (
                  <div style={{ borderRadius: 16, background: C.grabXLight, border: `2px solid ${C.grab}`, padding: "24px 28px", marginTop: 10, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <p style={{ fontSize: 18, fontWeight: 700, color: C.grabDarker }}>{shortName(slot)}</p>
                        <span style={{ fontSize: 11, fontWeight: 600, color: C.grabDarker, background: "rgba(255,255,255,0.7)", padding: "3px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 3 }}><Tag style={{ width: 10, height: 10 }} />{sector}</span>
                        {mkts.map(m => <span key={m} style={{ fontSize: 11, fontWeight: 600, color: C.sub, background: "rgba(255,255,255,0.7)", padding: "2px 8px", borderRadius: 6 }}>{m}</span>)}
                      </div>
                      <button onClick={() => setExpandedCard(null)} style={{ fontSize: 12, fontWeight: 600, color: C.grabDark, background: "rgba(255,255,255,0.7)", border: "none", padding: "5px 12px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}><ChevronUp style={{ width: 13, height: 13 }} />Collapse</button>
                    </div>
                    <p style={{ fontSize: 15, color: C.text, lineHeight: 1.6, marginBottom: 14 }}>{clean(slot.hypothesis_statement)}</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.7)", padding: "4px 12px", borderRadius: 99 }}>Urgency {slot.urgency}/10</span>
                      <ConfPill level={(slot.confidence || "medium").toLowerCase()} />
                      <span style={{ fontSize: 12, color: C.sub }}>{slot.test_window} - {clean(slot.suggested_owner)}</span>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                      {[{ l: "Assumptions", v: (slot.assumptions || []).length }, { l: "Kill criteria", v: (slot.kill_criteria || []).length }, { l: "Test plan", v: `${(slot.test_plan?.timeline || []).length} steps` }].map(m => (
                        <div key={m.l} style={{ flex: 1, background: "rgba(255,255,255,0.7)", borderRadius: 12, padding: "12px 14px" }}><p style={{ fontSize: 10, color: C.muted, textTransform: "uppercase" }}>{m.l}</p><p style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{m.v}</p></div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[{ l: "Patterns", i: BarChart3, t: "interpreter" }, { l: "Stress test", i: Shield, t: "thought" }, { l: "Simulate", i: Sliders, t: "simulator" }, { l: "Test plan", i: ClipboardCheck, t: "communicator" }].map(b => (
                        <button key={b.t} onClick={() => { setActiveTab(b.t); setExpandedCard(null); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13, fontWeight: 600, color: C.text, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 0", cursor: "pointer" }}><b.i style={{ width: 15, height: 15, color: C.sub }} />{b.l}</button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button onClick={() => { if (showModes) { setShowModes(false); setResearchMode(null); } else openGenFlow(); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                  <Sparkles style={{ width: 18, height: 18, color: C.scout }} />{showModes ? "Close" : "Generate new hypothesis"}
                </button>
                <button onClick={() => { setShowModes(true); setResearchMode("saved"); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                  <BookmarkPlus style={{ width: 18, height: 18, color: C.sub }} />Saved hypotheses
                </button>
                <button onClick={() => setActiveTab("interpreter")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 12, border: "none", background: C.grab, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "white" }}>
                  Next stage<ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>

            {/* Modes */}
            {showModes && researchMode !== "saved" && (
              <div>
                <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                  {[{ id: "found", icon: Radar, label: "Weekly scan", desc: "Signals from Scout's latest automated scan of 31 competitors across 8 markets." },
                    { id: "targeted", icon: Target, label: "Targeted search", desc: "Search for signals by market, sector, and competitor. Real-time web search." }
                  ].map(mode => (
                    <button key={mode.id} onClick={() => setResearchMode(mode.id)} style={{ flex: 1, padding: "16px 18px", borderRadius: 14, border: researchMode === mode.id ? `2px solid ${C.grab}` : `1px solid ${C.border}`, background: researchMode === mode.id ? C.grabXLight : C.card, cursor: "pointer", textAlign: "left" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: researchMode === mode.id ? C.grab : "#F1EFE8", display: "flex", alignItems: "center", justifyContent: "center" }}><mode.icon style={{ width: 16, height: 16, color: researchMode === mode.id ? "white" : C.muted }} /></div>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{mode.label}</span>
                      </div>
                      <p style={{ fontSize: 12, color: C.sub, lineHeight: 1.5 }}>{mode.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Filter bar for weekly scan */}
                {researchMode === "found" && (
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
                    <Filter style={{ width: 14, height: 14, color: C.muted }} />
                    {[{ l: "Market", v: filterMarket, set: setFilterMarket, opts: ["All", ...new Set(signals.flatMap(s => s.markets))] },
                      { l: "Sector", v: filterSector, set: setFilterSector, opts: ["All", ...new Set(signals.map(s => s.sector).filter(Boolean))] },
                      { l: "Company", v: filterCompany, set: setFilterCompany, opts: ["All", ...allCompanies] },
                    ].map(f => <select key={f.l} value={f.v} onChange={e => f.set(e.target.value)} style={{ fontSize: 12, padding: "6px 10px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontWeight: 500 }}>{f.opts.map(o => <option key={o} value={o}>{f.l}: {o}</option>)}</select>)}
                    <button onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")} style={{ fontSize: 12, padding: "6px 10px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
                      <SortDesc style={{ width: 12, height: 12 }} />{sortBy === "newest" ? "Newest first" : "Oldest first"}
                    </button>
                  </div>
                )}

                {/* Targeted search */}
                {researchMode === "targeted" && (
                  <div style={{ background: C.card, borderRadius: 16, padding: 22, border: `1px solid ${C.border}`, marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><Filter style={{ width: 16, height: 16, color: C.sub }} />Search filters</p>
                      <button onClick={() => { setSearchMarket("All"); setSearchSector("All"); setSearchCompetitor("All"); setSearchTime("Last 3 months"); setTargetedResults([]); }} style={{ fontSize: 12, color: C.muted, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><RefreshCw style={{ width: 12, height: 12 }} />Reset</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                      {[{ l: "Market", i: MapPin, v: searchMarket, set: setSearchMarket, opts: MARKETS_LIST },
                        { l: "Sector", i: Tag, v: searchSector, set: v => { setSearchSector(v); setSearchCompetitor("All"); }, opts: SECTORS },
                        { l: "Competitor", i: Building2, v: searchCompetitor, set: setSearchCompetitor, opts: ["All", ...availComps] },
                        { l: "Time range", i: Calendar, v: searchTime, set: setSearchTime, opts: TIME_RANGES },
                      ].map(f => <div key={f.l}><label style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}><f.i style={{ width: 12, height: 12, color: C.muted }} />{f.l}</label><select value={f.v} onChange={e => f.set(e.target.value)} style={{ width: "100%", fontSize: 13, borderRadius: 10, border: `1px solid ${C.border}`, padding: "10px 12px", background: C.card, color: C.text, fontWeight: 500 }}>{f.opts.map(o => <option key={o}>{o}</option>)}</select></div>)}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={async () => { const ctrl = new AbortController(); setSearchAbort(ctrl); setIsSearching(true); const q = `${searchCompetitor !== "All" ? searchCompetitor : "Grab competitors"} ${searchSector !== "All" ? searchSector : ""} ${searchMarket !== "All" ? "in " + searchMarket : "in Southeast Asia"} ${searchTime}`; const res = await runSearch(q, ctrl); setTargetedResults(res); setIsSearching(false); setSearchAbort(null); }} disabled={isSearching} style={{ flex: 1, padding: "12px 0", borderRadius: 12, background: C.text, color: "white", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: isSearching ? 0.7 : 1 }}>
                        {isSearching ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />Searching...</> : <><Search style={{ width: 16, height: 16 }} />Search</>}
                      </button>
                      {isSearching && <button onClick={() => { searchAbort?.abort(); setIsSearching(false); setSearchAbort(null); }} style={{ padding: "12px 20px", borderRadius: 12, background: C.redBg, color: C.redText, border: `1px solid ${C.redEdge}`, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Stop</button>}
                    </div>
                  </div>
                )}

                {/* Two column: signals + RHS */}
                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{curSignals.length} signals{selectedSignals.length > 0 ? ` - ${selectedSignals.length} selected` : ""}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {curSignals.map((s, i) => <SigCard key={s.id || i} s={s} idx={i} />)}
                      {researchMode === "targeted" && !isSearching && !targetedResults.length && (
                        <div style={{ borderRadius: 16, background: C.cardAlt, border: `1px solid ${C.border}`, padding: "40px 0", textAlign: "center" }}><Target style={{ width: 28, height: 28, color: C.muted, margin: "0 auto 8px" }} /><p style={{ fontSize: 13, color: C.muted }}>Set filters and search</p></div>
                      )}
                    </div>
                  </div>

                  {/* RHS */}
                  <div style={{ width: 280, flexShrink: 0 }}>
                    {generatedHyp ? (
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}><Sparkles style={{ width: 12, height: 12, color: C.scout }} />Generated hypothesis</p>
                        <div style={{ borderRadius: 16, border: `2px solid ${C.grab}`, background: C.grabXLight, padding: "18px 16px" }}>
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
                            {generatedHyp.sector && <span style={{ fontSize: 11, fontWeight: 500, color: C.grabDarker, background: "rgba(255,255,255,0.7)", padding: "3px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 3 }}><Tag style={{ width: 10, height: 10 }} />{generatedHyp.sector}</span>}
                            {(generatedHyp.primary_markets || []).map(m => <span key={m} style={{ fontSize: 11, fontWeight: 600, color: C.sub, background: "rgba(255,255,255,0.7)", padding: "2px 8px", borderRadius: 6 }}>{m}</span>)}
                          </div>
                          <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5, marginBottom: 10 }}>{shortName(generatedHyp)}</p>
                          <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(255,255,255,0.7)", padding: "3px 9px", borderRadius: 99 }}>U:{generatedHyp.urgency}</span>
                            <ConfPill level={(generatedHyp.confidence || "medium").toLowerCase()} />
                          </div>
                          <button onClick={() => setRhsExpanded(!rhsExpanded)} style={{ width: "100%", padding: "8px 0", borderRadius: 10, fontSize: 12, fontWeight: 600, color: C.grabDark, background: C.card, border: `1px solid ${C.grab}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 12 }}>
                            <Eye style={{ width: 13, height: 13 }} />{rhsExpanded ? "Collapse" : "Read more"}
                          </button>
                          {rhsExpanded && (
                            <div style={{ marginBottom: 12 }}>
                              <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6, marginBottom: 12 }}>"{clean(generatedHyp.hypothesis_statement)}"</p>
                              {[{ l: "Assumptions", v: `${(generatedHyp.assumptions || []).length} - ${(generatedHyp.assumptions || []).filter(a => a.confidence === "low").length} low` },
                                { l: "Kill criteria", v: (generatedHyp.kill_criteria || []).length },
                                { l: "Test plan", v: `${(generatedHyp.test_plan?.timeline || []).length} steps` },
                                { l: "Owner", v: clean(generatedHyp.suggested_owner) },
                                { l: "Window", v: generatedHyp.test_window },
                              ].map(r => <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "rgba(255,255,255,0.7)", borderRadius: 8, marginBottom: 4, fontSize: 12 }}><span style={{ color: C.muted }}>{r.l}</span><span style={{ fontWeight: 600 }}>{r.v}</span></div>)}
                            </div>
                          )}
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => { addTop3(generatedHyp); saveHyp(generatedHyp); setGeneratedHyp(null); setSelectedSignals([]); }} disabled={!top3.includes(null)} style={{ flex: 1, padding: "9px 0", borderRadius: 10, fontSize: 12, fontWeight: 700, color: "white", background: C.grab, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, opacity: top3.includes(null) ? 1 : 0.5 }}><Star style={{ width: 13, height: 13 }} />Top 3</button>
                            <button onClick={() => { saveHyp(generatedHyp); setGeneratedHyp(null); setSelectedSignals([]); }} style={{ padding: "9px 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.card, cursor: "pointer" }}><BookmarkPlus style={{ width: 14, height: 14, color: C.sub }} /></button>
                            <button onClick={() => { setGeneratedHyp(null); setSelectedSignals([]); }} style={{ padding: "9px 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.card, cursor: "pointer" }}><Trash2 style={{ width: 14, height: 14, color: C.muted }} /></button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}><Sparkles style={{ width: 12, height: 12, color: C.muted }} />Hypothesis preview</p>
                        {/* Scout suggests when signals are loaded but nothing generated yet */}
                        {curSignals.length >= 3 && selectedSignals.length === 0 ? (
                          <div>
                            <div style={{ borderRadius: 16, background: C.amberBg, border: `1px solid ${C.amberEdge}`, padding: "16px" }}>
                              <p style={{ fontSize: 12, fontWeight: 600, color: C.amberText, marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}><Lightbulb style={{ width: 13, height: 13 }} />Scout suggests these combinations</p>
                              {curSignals.length >= 2 && (
                                <div style={{ marginBottom: 8 }}>
                                  <p style={{ fontSize: 12, color: C.sub, lineHeight: 1.4, marginBottom: 8 }}>Signals {curSignals.slice(0, 2).map(s => `"${(s.title || "").substring(0, 25)}..."`).join(" + ")} form a <span style={{ fontWeight: 600, color: C.text }}>{inferSector(curSignals[0])}</span> pattern</p>
                                  <button onClick={() => { setSelectedSignals(curSignals.slice(0, 2)); }} style={{ width: "100%", fontSize: 11, fontWeight: 600, color: C.amberText, background: "rgba(255,255,255,0.7)", border: `1px solid ${C.amberEdge}`, padding: "6px 10px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}><Check style={{ width: 12, height: 12 }} />Select these 2</button>
                                </div>
                              )}
                              {curSignals.length >= 4 && (
                                <div>
                                  <p style={{ fontSize: 12, color: C.sub, lineHeight: 1.4, marginBottom: 8 }}>Signals {curSignals.slice(2, 4).map(s => `"${(s.title || "").substring(0, 25)}..."`).join(" + ")} show a <span style={{ fontWeight: 600, color: C.text }}>{inferSector(curSignals[2])}</span> shift</p>
                                  <button onClick={() => { setSelectedSignals(curSignals.slice(2, 4)); }} style={{ width: "100%", fontSize: 11, fontWeight: 600, color: C.amberText, background: "rgba(255,255,255,0.7)", border: `1px solid ${C.amberEdge}`, padding: "6px 10px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}><Check style={{ width: 12, height: 12 }} />Select these 2</button>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div style={{ borderRadius: 16, border: `2px dashed ${C.border}`, background: C.cardAlt, padding: "40px 16px", textAlign: "center" }}>
                            <Sparkles style={{ width: 28, height: 28, color: C.muted, margin: "0 auto 8px" }} />
                            <p style={{ fontSize: 13, color: C.muted }}>Select signals and generate</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Floating bar */}
                {selectedSignals.length > 0 && (
                  <div style={{ position: "sticky", bottom: 24, marginTop: 20, borderRadius: 16, background: C.text, color: "white", padding: "14px 22px", boxShadow: "0 8px 32px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 10, background: C.grab, display: "flex", alignItems: "center", justifyContent: "center" }}><Check style={{ width: 16, height: 16 }} /></div>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{selectedSignals.length} signal{selectedSignals.length > 1 ? "s" : ""}</span>
                      <button onClick={() => setSelectedSignals([])} style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer" }}>Clear</button>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => { const ctrl = new AbortController(); setGenAbort(ctrl); generateHyp(selectedSignals, ctrl); }} disabled={isGenerating} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 12, background: C.card, color: C.text, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", opacity: isGenerating ? 0.7 : 1 }}>
                        {isGenerating ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />{genStatus}</> : <><Sparkles style={{ width: 16, height: 16, color: C.scout }} />Generate</>}
                      </button>
                      {isGenerating && <button onClick={() => { genAbort?.abort(); setIsGenerating(false); setGenAbort(null); }} style={{ padding: "10px 16px", borderRadius: 12, background: "rgba(255,255,255,0.15)", color: "white", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Stop</button>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Saved */}
            {showModes && researchMode === "saved" && (
              <div>
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{savedHyps.length} hypotheses saved</p>
                {!savedHyps.length ? <div style={{ borderRadius: 16, border: `2px dashed ${C.border}`, padding: "48px 0", textAlign: "center", background: C.card }}><BookmarkPlus style={{ width: 28, height: 28, color: C.muted, margin: "0 auto 8px" }} /><p style={{ fontSize: 14, color: C.muted }}>No saved hypotheses yet</p></div>
                : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {savedHyps.map((sh, idx) => {
                    const inT3 = top3.some(t => t && t.id === sh.id);
                    const mkts = marketCodes(sh.primary_markets || sh.affected_markets || []);
                    return (
                      <div key={sh.id || idx} style={{ borderRadius: 16, background: C.card, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                              <span style={{ fontSize: 11, fontWeight: 500, color: C.grabDarker, background: C.grabLight, padding: "3px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 3 }}><Tag style={{ width: 10, height: 10 }} />{inferSector(sh)}</span>
                              {mkts.slice(0, 4).map(m => <span key={m} style={{ fontSize: 11, fontWeight: 600, color: C.sub, background: C.cardAlt, padding: "2px 8px", borderRadius: 6 }}>{m}</span>)}
                              <span style={{ fontSize: 10, fontWeight: 700, background: C.cardAlt, padding: "3px 9px", borderRadius: 99 }}>U:{sh.urgency}</span>
                              <ConfPill level={(sh.confidence || "medium").toLowerCase()} />
                            </div>
                            <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5 }}>{shortName(sh)}</p>
                            <p style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{sh.source_label} - {sh.created}</p>
                          </div>
                          {inT3 ? <span style={{ fontSize: 11, fontWeight: 600, color: C.grab, background: C.grabLight, padding: "6px 14px", borderRadius: 99, flexShrink: 0 }}>In top 3</span>
                          : <button onClick={() => addTop3(sh)} disabled={!top3.includes(null)} style={{ fontSize: 11, fontWeight: 600, color: C.grab, background: C.grabLight, padding: "6px 14px", borderRadius: 99, border: "none", cursor: "pointer", flexShrink: 0, opacity: top3.includes(null) ? 1 : 0.5 }}>Add to top 3</button>}
                        </div>
                      </div>
                    );
                  })}
                </div>}
              </div>
            )}
          </div>
        )}

        {/* ═══ PATTERNS ═══ */}
        {activeTab === "interpreter" && (
          <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, padding: "36px 40px" }}>
            <HypContext h={h} />
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}><BarChart3 style={{ width: 22, height: 22, color: C.scout }} />Growth patterns</h3>
            <p style={{ fontSize: 14, color: C.sub, marginBottom: 28 }}>Adjacencies scored on fit, and trends classified by trajectory.</p>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Adjacency map</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
              {(h.adjacencies || []).map(a => (
                <div key={a.name} style={{ borderRadius: 14, padding: 22, border: a.fit === "high" ? `2px solid ${C.grab}` : `1px solid ${C.border}`, background: a.fit === "high" ? C.grabXLight : C.card }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}><p style={{ fontWeight: 700 }}>{a.name}</p><span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "3px 9px", borderRadius: 99, background: a.fit === "high" ? C.grabLight : C.cardAlt, color: a.fit === "high" ? C.grabDarker : C.sub }}>{a.fit} fit</span></div>
                  {[{ l: "Market size", v: a.marketSize, c: C.grab }, { l: "Right to win", v: a.rightToWin, c: C.grab }, { l: "Competition", v: a.competitive, c: C.scout }].map(b => (
                    <div key={b.l} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}><span style={{ fontSize: 11, color: C.muted, width: 90 }}>{b.l}</span><div style={{ flex: 1, height: 6, background: C.cardAlt, borderRadius: 99, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 99, background: b.c, width: `${b.v * 10}%` }} /></div><span style={{ fontSize: 11, fontWeight: 700, width: 16 }}>{b.v}</span></div>
                  ))}
                </div>
              ))}
            </div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Trend watch</h4>
            {[{ l: "Accelerating", d: h.trends?.accelerating, bg: C.tealBg, c: C.tealText, b: C.tealEdge },
              { l: "Maturing", d: h.trends?.maturing, bg: C.amberBg, c: C.amberText, b: C.amberEdge },
              { l: "Subsiding", d: h.trends?.subsiding, bg: C.cardAlt, c: C.muted, b: C.border },
            ].map(t => (
              <div key={t.l} style={{ borderRadius: 14, border: `1px solid ${t.b}`, background: t.bg, padding: "14px 18px", marginBottom: 10 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: t.c, marginBottom: 8 }}>{t.l}</p>
                {(t.d || []).map(item => <p key={item} style={{ fontSize: 14, marginBottom: 4 }}>- {clean(item)}</p>)}
              </div>
            ))}
            <NextStage current="interpreter" setTab={setActiveTab} />
          </div>
        )}

        {/* ═══ STRESS TEST ═══ */}
        {activeTab === "thought" && (
          <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, padding: "36px 40px" }}>
            <HypContext h={h} />
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}><Shield style={{ width: 22, height: 22, color: C.scout }} />Stress testing assumptions</h3>
            <p style={{ fontSize: 14, color: C.sub, marginBottom: 28 }}>This hypothesis rests on {(h.assumptions || []).length} assumptions.</p>
            {h.framework_applied && (
              <div style={{ borderRadius: 14, border: `1px solid ${C.border}`, background: C.cardAlt, padding: "18px 22px", marginBottom: 28 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", marginBottom: 14 }}>{h.framework_applied}</p>
                {(h.framework_analysis || []).map(f => (
                  <div key={f.force} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, width: 180, flexShrink: 0 }}>{f.force}</span>
                    <div style={{ display: "flex", gap: 3 }}>{[1,2,3,4,5].map(n => <div key={n} style={{ width: 14, height: 14, borderRadius: 99, background: n <= f.rating ? f.rating >= 4 ? C.redEdge : f.rating === 3 ? C.amberEdge : C.tealEdge : C.cardAlt }} />)}</div>
                    <span style={{ fontSize: 12, color: C.sub, flex: 1 }}>{clean(f.note)}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {(h.assumptions || []).map((a, i) => (
                <div key={a.id} style={{ borderRadius: 14, border: a.confidence === "low" ? `2px solid ${C.redEdge}` : `1px solid ${C.border}`, background: a.confidence === "low" ? C.redBg : C.card, padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 10 }}><span style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span><p style={{ fontSize: 15, fontWeight: 600 }}>{clean(a.statement)}</p></div>
                    <ConfPill level={a.confidence} />
                  </div>
                  <div style={{ marginLeft: 30, fontSize: 14 }}>
                    <p style={{ marginBottom: 4 }}><span style={{ color: C.muted }}>Based on:</span> {clean(a.basis)}</p>
                    <p><span style={{ color: C.muted }}>Pressure-test:</span> {clean(a.pressure_test)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderRadius: 14, border: `2px solid ${C.redEdge}`, background: C.redBg, padding: "18px 22px" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.redText, textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><AlertCircle style={{ width: 14, height: 14 }} />Kill criteria</p>
              {(h.kill_criteria || []).map((k, i) => <p key={i} style={{ fontSize: 14, marginBottom: 6 }}>- {clean(k)}</p>)}
            </div>
            <NextStage current="thought" setTab={setActiveTab} />
          </div>
        )}

        {/* ═══ SIMULATE ═══ */}
        {activeTab === "simulator" && (
          <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, padding: "36px 40px" }}>
            <HypContext h={h} />
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}><Sliders style={{ width: 22, height: 22, color: C.scout }} />Sensitivity model</h3>
            <p style={{ fontSize: 14, color: C.sub, marginBottom: 28 }}>Drag sliders to test what happens if assumptions are wrong.</p>
            {(h.levers || []).map(lever => {
              const val = leverValues[lever.id] ?? lever.default;
              const asn = (h.assumptions || []).find(a => a.id === lever.linked_assumption);
              return (
                <div key={lever.id} style={{ background: C.cardAlt, borderRadius: 16, padding: "22px 24px", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <div><p style={{ fontSize: 14, fontWeight: 700 }}>{lever.name}</p>{asn && <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Tests: {clean(asn.statement).substring(0, 60)}...</p>}</div>
                    <div style={{ textAlign: "right" }}><p style={{ fontSize: 28, fontWeight: 700 }}>{val}{lever.unit === "%" ? "%" : lever.unit}</p><p style={{ fontSize: 11, color: C.muted }}>Default: {lever.default}{lever.unit === "%" ? "%" : lever.unit}</p></div>
                  </div>
                  <input type="range" min={lever.min} max={lever.max} value={val} onChange={e => setLeverValues({ ...leverValues, [lever.id]: Number(e.target.value) })} style={{ width: "100%", height: 6, borderRadius: 99, accentColor: C.grab }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginTop: 4 }}><span>{lever.min}{lever.unit === "%" ? "%" : lever.unit}</span><span>{lever.max}{lever.unit === "%" ? "%" : lever.unit}</span></div>
                </div>
              );
            })}
            <div style={{ borderRadius: 20, padding: "28px 32px", background: rec.color === "red" ? C.redBg : rec.color === "amber" ? C.amberBg : C.grabXLight, border: `2px solid ${rec.color === "red" ? C.redEdge : rec.color === "amber" ? C.amberEdge : C.grab}`, marginTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}><Zap style={{ width: 24, height: 24, color: rec.color === "red" ? C.redEdge : rec.color === "amber" ? C.amberEdge : C.grab }} /><p style={{ fontSize: 22, fontWeight: 700 }}>{rec.label}</p></div>
              <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6 }}>{rec.msg}</p>
            </div>
            <NextStage current="simulator" setTab={setActiveTab} />
          </div>
        )}

        {/* ═══ TEST PLAN ═══ */}
        {activeTab === "communicator" && (
          <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, padding: "36px 40px" }}>
            <HypContext h={h} />
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}><ClipboardCheck style={{ width: 22, height: 22, color: C.scout }} />Test plan</h3>
            <p style={{ fontSize: 14, color: C.sub, marginBottom: 28 }}>A complete plan a growth manager could take to leadership.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, borderRadius: 14, background: C.cardAlt, padding: "18px 22px", marginBottom: 24 }}>
              {[{ l: "Date", v: fmt(h.generated_date) }, { l: "Prepared by", v: "Scout" }, { l: "For", v: "Head of Growth" }, { l: "Owner", v: clean(h.suggested_owner) }].map(f => <div key={f.l}><p style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>{f.l}</p><p style={{ fontSize: 14, fontWeight: 600 }}>{f.v}</p></div>)}
            </div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", marginBottom: 12 }}>What to test</p>
              {(h.test_plan?.what_to_test || []).map((item, i) => <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8 }}><span style={{ width: 26, height: 26, borderRadius: 99, background: C.grabLight, color: C.grabDarker, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span><p style={{ fontSize: 14, lineHeight: 1.5 }}>{clean(item)}</p></div>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
              <div style={{ borderRadius: 14, border: `1px solid ${C.border}`, padding: "18px 22px" }}><p style={{ fontSize: 11, fontWeight: 700, color: C.tealText, textTransform: "uppercase", marginBottom: 12 }}>Data Scout provides</p>{(h.test_plan?.data_scout_provides || []).map((d, i) => <p key={i} style={{ fontSize: 14, marginBottom: 6, display: "flex", gap: 8 }}><CheckCircle2 style={{ width: 16, height: 16, color: C.tealEdge, flexShrink: 0, marginTop: 2 }} />{clean(d)}</p>)}</div>
              <div style={{ borderRadius: 14, border: `1px solid ${C.border}`, padding: "18px 22px" }}><p style={{ fontSize: 11, fontWeight: 700, color: C.amberText, textTransform: "uppercase", marginBottom: 12 }}>Team needs to gather</p>{(h.test_plan?.data_team_gathers || []).map((d, i) => <p key={i} style={{ fontSize: 14, marginBottom: 6, display: "flex", gap: 8 }}><AlertCircle style={{ width: 16, height: 16, color: C.amberEdge, flexShrink: 0, marginTop: 2 }} />{clean(d)}</p>)}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
              <div style={{ borderRadius: 14, border: `2px solid ${C.tealEdge}`, background: C.tealBg, padding: "18px 22px" }}><p style={{ fontSize: 11, fontWeight: 700, color: C.tealText, textTransform: "uppercase", marginBottom: 10 }}>Success criteria</p>{(h.test_plan?.success_criteria || []).map((s, i) => <p key={i} style={{ fontSize: 14, marginBottom: 4 }}>- {clean(s)}</p>)}</div>
              <div style={{ borderRadius: 14, border: `2px solid ${C.redEdge}`, background: C.redBg, padding: "18px 22px" }}><p style={{ fontSize: 11, fontWeight: 700, color: C.redText, textTransform: "uppercase", marginBottom: 10 }}>Kill criteria</p>{(h.kill_criteria || []).slice(0, 3).map((k, i) => <p key={i} style={{ fontSize: 14, marginBottom: 4 }}>- {clean(k)}</p>)}</div>
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", marginBottom: 12 }}>Timeline</p>
            {(h.test_plan?.timeline || []).map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: i < (h.test_plan?.timeline || []).length - 1 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, width: 80, flexShrink: 0 }}>{t.weeks}</span>
                <span style={{ fontSize: 14, flex: 1 }}>{clean(t.task)}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.grabDarker, background: C.grabLight, padding: "4px 14px", borderRadius: 99 }}>{t.owner}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
          <Link href="/" style={{ fontSize: 12, color: C.muted, textDecoration: "none" }}>Back to portfolio</Link>
        </div>
      </main>
    </div>
  );
}
