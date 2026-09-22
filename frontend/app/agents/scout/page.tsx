"use client";

import { useState, useMemo } from "react";
import { useScoutData } from "@/lib/useScoutData";



/* ============================================================
   MOCK DATA
   ============================================================ */

const MOCK_GRAB_GOALS = [
  {
    id: "finserv_ebitda",
    name: "FinServ Segment Adjusted EBITDA",
    short_name: "FinServ EBITDA",
    baseline_label: "Baseline · Q2 2026",
    baseline_value: "-$XXX M",
    baseline_note: "annualized run-rate",
    target_label: "Target · H2 2026",
    target_value: "$0",
    target_note: "breakeven commitment",
    source: "Q2 2026 earnings, Aug 4 2026",
    unit: "$M",
  },
  {
    id: "ondemand_gmv",
    name: "On-Demand GMV growth",
    short_name: "On-Demand GMV",
    baseline_label: "Baseline · Q2 2026",
    baseline_value: "$X.X B",
    baseline_note: "quarterly GMV",
    target_label: "Target · FY 2026",
    target_value: "Sequential growth",
    target_note: "each quarter through 2026",
    source: "Q2 2026 earnings",
    unit: "$B",
  },
  {
    id: "group_revenue",
    name: "Group Revenue",
    short_name: "Group Revenue",
    baseline_label: "Baseline · Q2 2026",
    baseline_value: "$XXX M",
    baseline_note: "quarterly revenue",
    target_label: "Target · FY 2026",
    target_value: "$X.XX-X.XX B",
    target_note: "22-23% growth guidance",
    source: "Q2 2026 earnings, guidance",
    unit: "$B",
  },
  {
    id: "group_ebitda",
    name: "Group Adjusted EBITDA",
    short_name: "Group Adj EBITDA",
    baseline_label: "Baseline · Q2 2026",
    baseline_value: "$XXX M",
    baseline_note: "quarterly EBITDA",
    target_label: "Target · FY 2026",
    target_value: "$XXX-XXX M",
    target_note: "44-48% growth guidance",
    source: "Q2 2026 earnings, guidance",
    unit: "$M",
  },
  {
    id: "ecosystem_mtu",
    name: "Ecosystem MTU growth",
    short_name: "Ecosystem MTU",
    baseline_label: "Baseline · Q2 2026",
    baseline_value: "XX M",
    baseline_note: "monthly transacting users",
    target_label: "Target · FY 2026",
    target_value: "Sustained growth",
    target_note: "YoY and QoQ",
    source: "Q2 2026 earnings",
    unit: "M",
  },
  {
    id: "deliveries_margin",
    name: "Deliveries margin expansion",
    short_name: "Deliveries margin",
    baseline_label: "Baseline · Q2 2026",
    baseline_value: "XX.X %",
    baseline_note: "adjusted EBITDA margin",
    target_label: "Target · FY 2026",
    target_value: "YoY expansion",
    target_note: "priority deliveries plus ads",
    source: "Q2 2026 earnings",
    unit: "%",
  },
  {
    id: "ai_margin_lever",
    name: "AI as margin lever",
    short_name: "AI margin lever",
    baseline_label: "Baseline · since Jun 2025",
    baseline_value: "-50 %",
    baseline_note: "cost per interaction",
    target_label: "Target · FY 2026",
    target_value: "Continued reduction",
    target_note: "unit economics improvement",
    source: "Q2 2026 earnings, AI commentary",
    unit: "%",
  },
];

const MOCK_HYPOTHESIS = {
  id: "hyp_001",
  name: "Build an AI agent orchestration SDK to defend FinServ revenue against AMP",
  short_name: "Build an AI agent orchestration SDK",
  sector: "Payments",
  markets: ["MY", "PH", "ID"],
  urgency: "high",
  confidence: "medium",

  // IMPACT tab data
  primary_goal_id: "finserv_ebitda",
  primary_contribution: {
    value: "~$XXX M",
    percent_of_gap: 35,
    gap_value: "$XXX M",
    remaining_value: "$XXX M",
    baseline_display: "-$XXX M",
    target_display: "$0",
  },
  arithmetic: [
    {
      label: "Grab GXS revenue run-rate (Q2 2026)",
      value: "~$XXX M",
      source: "Public disclosure",
      bet_id: null,
    },
    {
      label: "× AMP-at-risk share",
      value: "XX %",
      source: "Scout estimate",
      bet_id: 2,
    },
    {
      label: "× Defensive capture with SDK",
      value: "XXX %",
      source: "Scout estimate",
      bet_id: 3,
    },
  ],
  arithmetic_result: {
    label: "= Contribution to FinServ EBITDA gap",
    value: "~$XXX M",
  },
  secondary_goals: [
    {
      goal_id: "ecosystem_mtu",
      label: "Ecosystem MTU growth",
      metric_label: "Currently XX M",
      value: "+X.X M",
      value_unit: "MTUs added",
      bar_percent: 12,
      bar_note: "~12% of YoY growth target",
      bet_id: 4,
    },
    {
      goal_id: "ai_margin_lever",
      label: "AI as margin lever",
      metric_label: "Cost per interaction",
      value: "-XX %",
      value_unit: "further reduction",
      bar_percent: 36,
      bar_note: "Compounds on 50% since Jun 2025",
      bet_id: 5,
    },
  ],
  rollup: [
    {
      label: "This hypothesis",
      before: null,
      after: "+$XXX M",
      note: "FinServ contribution",
      is_source: true,
    },
    {
      label: "FinServ Segment",
      before: "-$XXX M",
      after: "-$XXX M",
      note: "35% of gap closed",
    },
    {
      label: "Group Adj EBITDA",
      before: "$XXX M",
      after: "$XXX M",
      note: "Top of guidance range",
    },
    {
      label: "Group Revenue",
      before: "$X.XX B",
      after: "$X.XX B",
      note: "Above midpoint of guidance",
    },
  ],
  bets: [
    { id: 1, statement: "SDK ships in 6 months", type: "execution" },
    { id: 2, statement: "AMP captures XX% of GXS segment", type: "financial" },
    { id: 3, statement: "SDK defends the at-risk revenue", type: "financial" },
    { id: 4, statement: "Merchant activation lifts X%", type: "financial" },
    { id: 5, statement: "Cost per interaction keeps falling", type: "execution" },
  ],
};

const MOCK_TOP_THREE = [
  {
    ...MOCK_HYPOTHESIS,
    is_active: true,
  },
  {
    id: "hyp_002",
    name: "Launch driver loyalty tier in Indonesia secondary cities to blunt Maxim",
    short_name: "Launch driver loyalty tier in Indonesia secondary cities",
    sector: "Mobility",
    markets: ["ID"],
    urgency: "medium",
    confidence: "medium",
    is_active: false,
  },
  null, // empty slot
];

const MOCK_SIGNALS = [
  {
    id: "sig_001",
    type: "THREAT",
    company: "Ant Group",
    sector: "Payments",
    date: "Sep 15, 2026",
    title: "Ant Group signs 3 major Malaysian banks for AMP cross-border rails",
    impact: "Threatens GrabPay merchant position in Malaysia. Cross-border volume could shift XX% in 6 months as banks route through AMP rather than GrabPay.",
    markets: ["MY", "SG"],
  },
  {
    id: "sig_002",
    type: "OPPORTUNITY",
    company: "Regulator ID",
    sector: "Mobility",
    date: "Sep 12, 2026",
    title: "Indonesia enforces X% commission cap on ride-hailing platforms",
    impact: "Maxim's structural cost advantage narrows. Grab can now compete on driver experience rather than take-rate alone.",
    markets: ["ID"],
  },
  {
    id: "sig_003",
    type: "SHIFT",
    company: "Mastercard",
    sector: "Payments",
    date: "Sep 8, 2026",
    title: "Mastercard launches wallet-agnostic checkout across 4 SEA markets",
    impact: "Normalizes multi-wallet usage at POS. Reduces GrabPay's lock-in advantage at merchant checkout.",
    markets: ["MY", "SG", "TH", "PH"],
  },
  {
    id: "sig_004",
    type: "OPPORTUNITY",
    company: "Foodpanda",
    sector: "Deliveries",
    date: "Sep 5, 2026",
    title: "Foodpanda exits Thailand market, redistributes assets across SEA",
    impact: "Opens ~XX% Deliveries share in Bangkok metro. Time-limited window before local players consolidate.",
    markets: ["TH"],
  },
  {
    id: "sig_005",
    type: "THREAT",
    company: "GoTo",
    sector: "FinServ",
    date: "Sep 2, 2026",
    title: "GoTo Financial announces $XXX M merchant lending expansion in Vietnam",
    impact: "Directly competes with GXS merchant loans. Vietnam is a target growth market for GXS in H2 2026.",
    markets: ["VN"],
  },
];

const MOCK_SUGGESTED_COMBINATIONS = [
  {
    signal_ids: ["sig_001", "sig_003"],
    label: "Payments disruption cluster",
    markets: "MY + SG",
  },
  {
    signal_ids: ["sig_002", "sig_004"],
    label: "SEA competitive vacuum",
    markets: "ID + TH",
  },
];

/* ============================================================
   COLOR / STYLE TOKENS
   ============================================================ */

const c = {
  scout: "#D85A30",
  scoutLight: "#FAECE7",
  scoutXLight: "#FDF5F2",
  scoutDark: "#993C1D",
  grab: "#00b14f",
  grabDark: "#005a28",
  grabLight: "#e6f7ed",
  grabXLight: "#f0faf4",
  bg: "#FAFAF7",
  card: "#FFFFFF",
  alt: "#F8F7F3",
  border: "#E8E6E0",
  text: "#2C2C2A",
  sub: "#4A4A46",
  muted: "#6B6B65",
  red: "#E24B4A",
  redBg: "#FEF0EE",
  redText: "#A32D2D",
  teal: "#1D9E75",
  tealBg: "#E1F5EE",
  tealText: "#085041",
  amber: "#EF9F27",
  amberBg: "#FEF6E6",
  amberText: "#854F0B",
};

const DRIVER_MAP: Record<string, string> = {
  FS_EBITDA_H2_26: "FinServ H2 26 EBITDA breakeven",
  FS_EBITDA: "FinServ EBITDA",
  FS_GLP_EOY_26: "FinServ GLP by end of 2026",
  FS_GLP: "FinServ GLP",
  FS_CREDIT_MODEL_DATA_RICHNESS: "transaction data feeding credit scoring",
  FS_CREDIT_MODEL: "credit model",
  DEL_MARGIN_FY26: "Deliveries FY26 EBITDA margin",
  DEL_MARGIN: "Deliveries margin",
  DEL_GMV: "Deliveries GMV",
  MTU_MOMENTUM: "MTU growth momentum",
  OD_MARGIN: "On-Demand margin",
  OD_GMV: "On-Demand GMV",
};

const PREFIX_MAP: Record<string, string> = {
  FS: "FinServ",
  DEL: "Deliveries",
  OD: "On-Demand",
  FIN: "Financial",
};

const humanizeDrivers = (text: string): string => {
  if (!text) return text;
  return text.replace(/\b[A-Z]{2,}[A-Z0-9]*(?:_[A-Z0-9]+)+\b/g, (match) => {
    if (DRIVER_MAP[match]) return DRIVER_MAP[match];
    const parts = match.split("_");
    const prefix = PREFIX_MAP[parts[0]] || parts[0];
    const rest = parts
      .slice(1)
      .map((p) => (/^\d+$/.test(p) ? p : p.toLowerCase()))
      .join(" ");
    return `${prefix} ${rest}`.trim();
  });
};

const clean = (s: string) => humanizeDrivers((s || "").replace(/[—–]/g, "-"));

/* ============================================================
   SHARED SHELL COMPONENTS
   ============================================================ */

function ScoutHeader({ stats }: { stats?: { totalCost: number; runsCount: number } }) {
  return (
    <div
      style={{
        background: c.card,
        borderRadius: 14,
        padding: "16px 22px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: `1px solid ${c.border}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: c.scout,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 18,
          }}
        >
          🔍
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 17, fontWeight: 500, color: c.text }}>Scout</span>
          <span style={{ color: c.border, fontSize: 18 }}>·</span>
          <span style={{ fontSize: 13, color: c.sub }}>
            AI-powered rigor for bolder strategic bets
          </span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {stats && stats.runsCount > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 99,
              background: c.grabXLight,
              border: `1px solid ${c.grab}`,
              fontSize: 12,
              color: c.grabDark,
            }}
          >
            <span style={{ fontSize: 10 }}>●</span>
            <span style={{ fontWeight: 500 }}>
              ${stats.totalCost.toFixed(3)} · {stats.runsCount} agent runs
            </span>
          </div>
        )}
        
        <a
          href="/scout-guide.html"
          target="_blank"
          rel="noopener noreferrer"
          title="Read the Scout guide"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 99,
            border: `1px solid ${c.border}`,
            fontSize: 13,
            color: c.text,
            textDecoration: "none",
            background: "transparent",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <span style={{ fontWeight: 500 }}>Guide</span>
        </a>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 99,
            border: `1px solid ${c.border}`,
            fontSize: 13,
            color: c.text,
          }}
        >
          <span style={{ color: c.muted }}>Analyzing</span>
          <span style={{ fontWeight: 500 }}>Grab</span>
          <span style={{ fontSize: 10, color: c.muted }}>▾</span>
        </div>
      </div>
    </div>
  );
}

type TabId = "signals" | "impact" | "bets" | "pilot";
type SignalsSubTab = "scouted" | "generate" | "saved";

function StageBar({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (t: TabId) => void;
}) {
  const tabs: {
  id: TabId;
  label: string;
  sub: string;
  icon: string;
  enabled: boolean;
}[] = [
  { id: "signals", label: "Signals", sub: "Find what matters", icon: "🔍", enabled: true },
  { id: "impact", label: "Impact", sub: "Size the prize", icon: "🎯", enabled: true },
  { id: "bets", label: "Bets", sub: "Ranked plays", icon: "⚡", enabled: true },
  { id: "pilot", label: "Pilot", sub: "Test design", icon: "📋", enabled: true },
];

  return (
    <div
      style={{
        display: "flex",
        background: c.card,
        borderRadius: 14,
        border: `1px solid ${c.border}`,
        overflow: "hidden",
        marginBottom: 24,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        const disabled = !tab.enabled;
        return (
          <button
            key={tab.id}
            onClick={() => tab.enabled && onChange(tab.id)}
            disabled={disabled}
            style={{
              flex: 1,
              padding: "14px 8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
              background: isActive ? c.grabXLight : "transparent",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              borderBottom: `3px solid ${isActive ? c.grab : "transparent"}`,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.55 : 1,
              transition: "background 0.15s",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: isActive ? c.grab : c.alt,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isActive ? "white" : c.muted,
                fontSize: 15,
              }}
            >
              {tab.icon}
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: isActive ? c.grabDark : disabled ? c.muted : c.text,
              }}
            >
              {tab.label}
            </span>
            <span
              style={{
                fontSize: 10,
                color: isActive ? c.grabDark : c.muted,
              }}
            >
              {tab.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ActiveHypothesisBanner({ hyp }: { hyp: typeof MOCK_HYPOTHESIS }) {
  return (
    <div
      style={{
        background: c.grabXLight,
        border: `1px solid ${c.grab}`,
        borderRadius: 12,
        padding: "14px 18px",
        marginBottom: 22,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: c.grab,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        ★
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 10,
            color: c.grabDark,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontWeight: 500,
            marginBottom: 2,
          }}
        >
          Active hypothesis
        </p>
        <p style={{ fontSize: 14, fontWeight: 500, color: c.text, lineHeight: 1.4 }}>
          {clean(hyp.name)}
        </p>
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <Tag>{hyp.sector}</Tag>
        {hyp.markets.map((m) => (
          <Tag key={m} muted>
            {m}
          </Tag>
        ))}
      </div>
    </div>
  );
}

function Tag({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span
      style={{
        fontSize: 10,
        padding: "2px 8px",
        borderRadius: 6,
        fontWeight: 500,
        color: muted ? c.sub : c.text,
        background: "white",
        border: `1px solid ${c.border}`,
      }}
    >
      {children}
    </span>
  );
}

/* ============================================================
   SIGNALS TAB
   ============================================================ */

function TopThreeBoard({
  top,
  onActivate,
  onGenerateClick,
}: {
  top: typeof MOCK_TOP_THREE;
  onActivate: (id: string) => void;
  onGenerateClick: () => void;
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ color: c.scout, fontSize: 18 }}>🏆</span>
        <span style={{ fontSize: 17, fontWeight: 500, color: c.text }}>
          Your top 3 hypotheses
        </span>
      </div>
      <p style={{ fontSize: 12, color: c.sub, marginBottom: 14 }}>
        Pick one to make it active. The rest of Scout (Impact, Bets, Pilot) works off the
        active hypothesis. Click Expand to see the full statement.
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        {top.map((h, i) => {
          if (!h) return <EmptySlot key={i} onClick={onGenerateClick} />;
          return h.is_active ? (
            <ActiveHypothesisCard key={h.id} h={h} />
          ) : (
            <InactiveHypothesisCard key={h.id} h={h} onActivate={onActivate} />
          );
        })}
      </div>
    </div>
  );
}

function ActiveHypothesisCard({ h }: { h: typeof MOCK_HYPOTHESIS & { is_active: boolean } }) {
  return (
    <div
      style={{
        flex: 1,
        background: c.grabXLight,
        border: `2px solid ${c.grab}`,
        borderRadius: 14,
        padding: "14px 16px",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            background: c.grab,
            color: "white",
            fontSize: 9,
            fontWeight: 500,
            padding: "2px 8px",
            borderRadius: 99,
          }}
        >
          ★ Active
        </span>
        <span
          style={{
            fontSize: 10,
            padding: "2px 8px",
            borderRadius: 6,
            fontWeight: 500,
            background: "white",
            color: c.grabDark,
          }}
        >
          {h.sector}
        </span>
        {h.markets.map((m) => (
          <span
            key={m}
            style={{
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 6,
              fontWeight: 500,
              background: "white",
              color: c.sub,
            }}
          >
            {m}
          </span>
        ))}
      </div>

      <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5, marginBottom: 12, color: c.text }}>
        {clean(h.short_name)}
      </p>

      {/* Mini contribution bar - the Signals teaser */}
      <div
        style={{
          background: "white",
          border: `1px solid ${c.border}`,
          borderRadius: 10,
          padding: "10px 12px",
          marginTop: "auto",
        }}
      >
        <p style={{ fontSize: 10, color: c.muted, marginBottom: 6 }}>
          FinServ EBITDA gap to breakeven
        </p>
        <div
          style={{
            position: "relative",
            height: 8,
            background: c.alt,
            borderRadius: 99,
            overflow: "hidden",
            marginBottom: 6,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${h.primary_contribution.percent_of_gap}%`,
              background: c.grab,
              borderRadius: 99,
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 11, color: c.text, fontWeight: 500 }}>
            {h.primary_contribution.value}
          </span>
          <span style={{ fontSize: 10, color: c.grabDark, fontWeight: 500 }}>
            {h.primary_contribution.percent_of_gap}% closed · see Impact →
          </span>
        </div>
      </div>
    </div>
  );
}

function InactiveHypothesisCard({
  h,
  onActivate,
}: {
  h: (typeof MOCK_TOP_THREE)[1] & object;
  onActivate: (id: string) => void;
}) {
  if (!h) return null;
  return (
    <div
      style={{
        flex: 1,
        background: c.card,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <button
          onClick={() => onActivate(h.id)}
          style={{
            fontSize: 9,
            fontWeight: 500,
            color: c.sub,
            background: c.alt,
            padding: "2px 8px",
            borderRadius: 99,
            border: "none",
            cursor: "pointer",
          }}
        >
          Make active
        </button>
        <span
          style={{
            fontSize: 10,
            padding: "2px 8px",
            borderRadius: 6,
            fontWeight: 500,
            background: c.grabLight,
            color: c.grabDark,
          }}
        >
          {h.sector}
        </span>
        {h.markets.map((m) => (
          <span
            key={m}
            style={{
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 6,
              fontWeight: 500,
              background: c.alt,
              color: c.sub,
            }}
          >
            {m}
          </span>
        ))}
      </div>
      <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5, marginBottom: 8, color: c.text }}>
        {clean(h.short_name)}
      </p>
      <button
        style={{
          alignSelf: "flex-end",
          fontSize: 11,
          color: c.grabDark,
          background: "none",
          border: "none",
          cursor: "pointer",
          marginTop: "auto",
        }}
      >
        Expand ▾
      </button>
    </div>
  );
}

function EmptySlot({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        background: c.alt,
        border: `2px dashed ${c.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 22, color: c.muted }}>+</span>
      <p style={{ fontSize: 11, color: c.muted, marginTop: 6 }}>Generate new</p>
    </button>
  );
}

function GenerateModePicker({ activeMode }: { activeMode: string }) {
  const modes = [
    {
      id: "weekly",
      icon: "📡",
      label: "Weekly scan",
      desc: "This week's automated signals across 31 competitors and 8 markets",
    },
    {
      id: "targeted",
      icon: "🎯",
      label: "Targeted search",
      desc: "Live web search by market, sector, competitor, and time range",
    },
    {
      id: "saved",
      icon: "🔖",
      label: "Saved",
      desc: "Hypotheses you generated earlier. Reactivate any of them.",
    },
  ];

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
      {modes.map((m) => {
        const isActive = m.id === activeMode;
        return (
          <div
            key={m.id}
            style={{
              flex: 1,
              padding: "14px 16px",
              borderRadius: 12,
              border: `${isActive ? 2 : 1}px solid ${isActive ? c.grab : c.border}`,
              background: isActive ? c.grabXLight : c.card,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: isActive ? c.grab : c.alt,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  color: isActive ? "white" : c.muted,
                }}
              >
                {m.icon}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: c.text }}>{m.label}</span>
            </div>
            <p style={{ fontSize: 11, color: c.sub, lineHeight: 1.4 }}>{m.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

function SignalFilterBar() {
  const selectStyle: React.CSSProperties = {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 8,
    border: `1px solid ${c.border}`,
    background: c.card,
    fontWeight: 500,
    color: c.text,
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        marginBottom: 16,
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: 14, color: c.muted }}>⚙</span>
      <select style={selectStyle}>
        <option>Market: All</option>
      </select>
      <select style={selectStyle}>
        <option>Sector: All</option>
      </select>
      <select style={selectStyle}>
        <option>Company: All</option>
      </select>
      <button
        style={{
          fontSize: 12,
          padding: "6px 10px",
          borderRadius: 8,
          border: `1px solid ${c.border}`,
          background: c.card,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontWeight: 500,
          color: c.text,
        }}
      >
        ⇅ Newest first
      </button>
    </div>
  );
}

function SignalCard({
  s,
  selected,
  onToggle,
}: {
  s: (typeof MOCK_SIGNALS)[0];
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const edgeColor =
    s.type === "THREAT" ? c.red : s.type === "OPPORTUNITY" ? c.teal : c.amber;
  const pillBg =
    s.type === "THREAT" ? c.redBg : s.type === "OPPORTUNITY" ? c.tealBg : c.amberBg;
  const pillText =
    s.type === "THREAT"
      ? c.redText
      : s.type === "OPPORTUNITY"
      ? c.tealText
      : c.amberText;

  return (
    <div
      style={{
        borderRadius: 14,
        overflow: "hidden",
        border: `${selected ? 2 : 1}px solid ${selected ? c.grab : c.border}`,
        background: selected ? c.grabXLight : c.card,
      }}
    >
      <div style={{ display: "flex" }}>
        <div style={{ width: 4, background: edgeColor }} />
        <div style={{ flex: 1, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 6,
                fontWeight: 500,
                background: c.alt,
                color: c.text,
              }}
            >
              🏢 {s.company}
            </span>
            <span
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 6,
                fontWeight: 500,
                background: c.grabLight,
                color: c.grabDark,
              }}
            >
              {s.sector}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: c.muted }}>📅 {s.date}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  padding: "3px 9px",
                  borderRadius: 99,
                  background: pillBg,
                  color: pillText,
                }}
              >
                {s.type}
              </span>
            </div>
            <button
              onClick={() => onToggle(s.id)}
              style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                background: selected ? c.grab : "transparent",
                border: selected ? "none" : `2px solid ${c.border}`,
                cursor: "pointer",
                color: "white",
                fontSize: 12,
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selected ? "✓" : ""}
            </button>
          </div>
          <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.45, marginBottom: 8, color: c.text }}>
            {clean(s.title)}
          </p>
          <p style={{ fontSize: 12, color: c.sub, lineHeight: 1.55, marginBottom: 10 }}>
            {clean(s.impact)}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, color: c.muted }}>Markets impacted</span>
            {s.markets.map((m) => (
              <span
                key={m}
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 6,
                  fontWeight: 500,
                  background: c.alt,
                  color: c.sub,
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoutSuggests({ onSelect }: { onSelect: (ids: string[]) => void }) {
  return (
    <div style={{ width: 240, flexShrink: 0 }}>
      <p
        style={{
          fontSize: 10,
          fontWeight: 500,
          color: c.muted,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span style={{ color: c.scout }}>✨</span> Scout suggests
      </p>
      <p style={{ fontSize: 11, color: c.sub, lineHeight: 1.45, marginBottom: 10 }}>
        Two combinations that cluster into a testable hypothesis:
      </p>

      {MOCK_SUGGESTED_COMBINATIONS.map((combo, i) => (
        <div
          key={i}
          style={{
            background: c.amberBg,
            border: `1px solid ${c.amber}`,
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 10,
          }}
        >
          <p style={{ fontSize: 11, color: c.sub, lineHeight: 1.45, marginBottom: 8 }}>
            Signals {combo.signal_ids.map((id) => id.slice(-1)).join(" + ")} form a{" "}
            <span style={{ fontWeight: 500, color: c.text }}>{combo.label}</span> in{" "}
            {combo.markets}.
          </p>
          <button
            onClick={() => onSelect(combo.signal_ids)}
            style={{
              width: "100%",
              fontSize: 11,
              fontWeight: 500,
              color: c.amberText,
              background: "white",
              border: `1px solid ${c.amber}`,
              padding: "6px 10px",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            ✓ Select these
          </button>
        </div>
      ))}

      <div
        style={{
          background: c.alt,
          border: `1px dashed ${c.border}`,
          borderRadius: 12,
          padding: "20px 14px",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: 20, color: c.muted }}>✨</span>
        <p style={{ fontSize: 11, color: c.muted, marginTop: 6, lineHeight: 1.4 }}>
          Your generated hypothesis will appear here after you select signals and click
          Generate.
        </p>
      </div>
    </div>
  );
}

function SelectionBar({ count, onClear }: { count: number; onClear: () => void }) {
  if (count === 0) return null;
  return (
    <div
      style={{
        position: "sticky",
        bottom: 12,
        marginTop: 20,
        borderRadius: 14,
        background: c.text,
        color: "white",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            background: c.grab,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
          }}
        >
          ✓
        </div>
        <span style={{ fontSize: 13, fontWeight: 500 }}>
          {count} signal{count > 1 ? "s" : ""} selected
        </span>
        <button
          onClick={onClear}
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.6)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>
      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 18px",
          borderRadius: 10,
          background: "white",
          color: c.text,
          fontSize: 13,
          fontWeight: 500,
          border: "none",
          cursor: "pointer",
        }}
      >
        <span style={{ color: c.scout }}>✨</span> Generate hypothesis
      </button>
    </div>
  );
}

function SignalsTab({ onNext }: { onNext: () => void }) {
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const [top] = useState<(TopThreeItem | null)[]>(MOCK_TOP_THREE);

  const toggleSignal = (id: string) => {
    setSelectedSignals((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
      <TopThreeBoard
        top={top}
        onActivate={() => {}}
        onGenerateClick={() => {}}
      />

      <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            borderRadius: 12,
            border: `1px solid ${c.border}`,
            background: c.card,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
            color: c.text,
          }}
        >
          <span style={{ color: c.scout }}>✨</span> Generate new hypothesis
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            borderRadius: 12,
            border: `1px solid ${c.border}`,
            background: c.card,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
            color: c.text,
          }}
        >
          🔖 Saved hypotheses
        </button>
                <button
          onClick={onNext}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            borderRadius: 12,
            border: "none",
            background: c.grab,
            color: "white",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
            marginLeft: "auto",
          }}
        >
          Next: Impact →
        </button>
      </div>

      <div style={{ height: 1, background: c.border, marginBottom: 24 }} />

      <div style={{ marginBottom: 6 }}>
        <p
          style={{
            fontSize: 12,
            color: c.muted,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontWeight: 500,
            marginBottom: 4,
          }}
        >
          Generate a new hypothesis
        </p>
        <p style={{ fontSize: 12, color: c.sub, marginBottom: 14 }}>
          Pick where the signals should come from. Scout combines the signals you select
          into one testable hypothesis.
        </p>
      </div>

      <GenerateModePicker activeMode="weekly" />

      <div
        style={{
          background: c.alt,
          border: `1px solid ${c.border}`,
          borderRadius: 10,
          padding: "10px 14px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 14, color: c.sub }}>ⓘ</span>
        <p style={{ fontSize: 12, color: c.sub, lineHeight: 1.5 }}>
          Select 2-5 signals below. Look for a pattern - signals that share a competitor,
          market, or theme make stronger hypotheses.
        </p>
      </div>

      <SignalFilterBar />

      <div style={{ display: "flex", gap: 18 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 11, color: c.muted, marginBottom: 10 }}>
            {MOCK_SIGNALS.length} signals · sorted newest first
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MOCK_SIGNALS.map((s) => (
              <SignalCard
                key={s.id}
                s={s}
                selected={selectedSignals.includes(s.id)}
                onToggle={toggleSignal}
              />
            ))}
          </div>
        </div>
        <ScoutSuggests onSelect={setSelectedSignals} />
      </div>

      <SelectionBar
        count={selectedSignals.length}
        onClear={() => setSelectedSignals([])}
      />
    </>
  );
}

/* ============================================================
   IMPACT TAB
   ============================================================ */

function ImpactAnchorNav() {
  const chips = [
    { id: "primary", label: "Primary goal", num: 1, active: true },
    { id: "secondary", label: "Secondary goals", num: 2, active: false },
    { id: "rollup", label: "Roll-up to Group", num: 3, active: false },
    { id: "bridge", label: "Bets to test", num: 4, active: false, coral: true },
  ];

  return (
    <div
      style={{
        background: c.card,
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        padding: "14px 18px",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 10,
              color: c.muted,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: 500,
              marginBottom: 2,
            }}
          >
            Impact tab
          </p>
          <p style={{ fontSize: 14, fontWeight: 500, color: c.text }}>
            What this hypothesis moves against Grab's stated 2026 goals
          </p>
        </div>
        <p style={{ fontSize: 11, color: c.muted }}>Jump to section:</p>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {chips.map((chip) => (
          <a
                      
            key={chip.id}
            href={`#${chip.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(chip.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            style={{
              textDecoration: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 99,
              background: chip.coral
                ? c.scoutLight
                : chip.active
                ? c.grabLight
                : c.alt,
              color: chip.coral
                ? c.scoutDark
                : chip.active
                ? c.grabDark
                : c.text,
              fontSize: 12,
              fontWeight: 500,
              border: `1px solid ${
                chip.coral ? c.scout : chip.active ? c.grab : c.border
              }`,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: chip.coral
                  ? c.scout
                  : chip.active
                  ? c.grab
                  : c.muted,
                color: "white",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
              }}
            >
              {chip.num}
            </span>
            {chip.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function PrimaryGoalCard({ hyp }: { hyp: typeof MOCK_HYPOTHESIS }) {
  const [expanded, setExpanded] = useState(false);
   const goal = MOCK_GRAB_GOALS.find((g) => g.id === hyp.primary_goal_id) || MOCK_GRAB_GOALS[0];
     const subtitleByGoal: Record<string, string> = {
    finserv_ebitda: "Grab's commitment: reach FinServ breakeven in H2 2026",
    deliveries_margin: "Grab's commitment: expand Deliveries EBITDA margin through FY26 via Priority mix and GrabAds",
    group_revenue: "Grab's FY26 guidance: $4.10–4.15B revenue (22–23% growth)",
    group_ebitda: "Grab's FY26 guidance: $720–740M Adj EBITDA (44–48% growth)",
    ondemand_gmv: "Grab's commitment: sequential On-Demand GMV growth each quarter through 2026",
    ecosystem_mtu: "Grab's commitment: sustained MTU growth YoY and QoQ",
    ai_margin_lever: "Grab's trajectory: continued reduction in cost per interaction",
  };  
  
  return (
    <div
      id="primary"
      style={{
        background: c.card,
        border: `1px solid ${c.border}`,
        borderRadius: 16,
        padding: "24px 28px",
        marginBottom: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: c.grab,
            color: "white",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          1
        </span>
        <span
          style={{
            fontSize: 10,
            color: c.grabDark,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 500,
          }}
        >
          PRIMARY GOAL MOVED
        </span>
        <span style={{ width: 4, height: 4, background: c.muted, borderRadius: "50%" }} />
        <span
          style={{
            fontSize: 10,
            color: c.muted,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Source: {goal.source}
        </span>
      </div>

      <h2
        style={{
          fontSize: 24,
          fontWeight: 500,
          color: c.text,
          marginBottom: 4,
          lineHeight: 1.2,
        }}
      >
                         {clean(goal.name)}
      </h2>

      <p style={{ fontSize: 13, color: c.sub, marginBottom: 24 }}>
        {subtitleByGoal[goal.id] || `Source: ${goal.source || "Grab disclosure"}`}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <MetricCard
          label={goal.baseline_label}
          value={hyp.primary_contribution.baseline_display}
          note={goal.baseline_note}
          valueColor={c.redText}
        />
        <MetricCard
          label={goal.target_label}
          value={hyp.primary_contribution.target_display}
          note={goal.target_note}
          valueColor={c.text}
        />
        <MetricCard
          label="This hypothesis contributes"
          value={hyp.primary_contribution.value}
          note={(hyp.primary_contribution as any).contribution_note || `${hyp.primary_contribution.percent_of_gap}% of the gap`}
          valueColor={c.grabDark}
          highlight
        />
      </div>

                  {hyp.primary_contribution.percent_of_gap > 0 ? (
        // ============================================================
        // GAP-BAR MODE: goal has a numeric dollar gap (H2, H3 → FinServ)
        // ============================================================
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: c.muted,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 500,
              }}
            >
              Gap-to-target contribution
            </span>
            <span style={{ fontSize: 12, color: c.sub }}>
              {hyp.primary_contribution.gap_value} gap ·{" "}
              {hyp.primary_contribution.value} closed ·{" "}
              {hyp.primary_contribution.remaining_value} remaining
            </span>
          </div>
          <div
            style={{
              position: "relative",
              height: 40,
              background: c.alt,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${hyp.primary_contribution.percent_of_gap}%`,
                background: c.grab,
                borderRadius: "10px 0 0 10px",
                display: "flex",
                alignItems: "center",
                paddingLeft: 14,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 500, color: "white" }}>
                {hyp.primary_contribution.value}
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                right: 14,
                top: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 12, color: c.sub, fontWeight: 500 }}>
                {hyp.primary_contribution.remaining_value} remaining
              </span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: c.muted }}>
              {hyp.primary_contribution.baseline_display} baseline
            </span>
            <span style={{ fontSize: 11, color: c.text, fontWeight: 500 }}>
              {hyp.primary_contribution.percent_of_gap}% closed
            </span>
            <span style={{ fontSize: 11, color: c.muted }}>
              {hyp.primary_contribution.target_display} target
            </span>
          </div>
        </div>
      ) : (
        // ============================================================
        // INSIGHT CALLOUT: goal has no dollar gap (H1 → Deliveries margin)
        // ============================================================
        <div
          style={{
            marginBottom: 20,
            padding: "16px 20px",
            background: c.grabXLight,
            border: `1px solid ${c.grabLight}`,
            borderRadius: 12,
          }}
        >
          <p
            style={{
              fontSize: 10,
              color: c.grabDark,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            What this means
          </p>
          <p style={{ fontSize: 13, color: c.text, lineHeight: 1.6 }}>
            <span style={{ fontWeight: 500 }}>{hyp.primary_contribution.value}/yr</span>
            {' = '}
            <span style={{ fontWeight: 500 }}>
              {(hyp.primary_contribution as any).contribution_note || 'direct contribution'}
            </span>
            {' expansion. For context, Grab delivered ~30bps of Deliveries margin expansion in the last four quarters — this hypothesis alone contributes roughly 2x that pace.'}
          </p>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 10,
          border: `1px dashed ${c.grab}`,
          background: c.grabXLight,
          color: c.grabDark,
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        🧮 How Scout arrived at {hyp.primary_contribution.value} {expanded ? "▴" : "▾"}
      </button>

            {expanded && <ArithmeticExpansion hyp={hyp} />}
    </div>
  );
  }

function MetricCard({
  label,
  value,
  note,
  valueColor,
  highlight,
}: {
  label: string;
  value: string;
  note: string;
  valueColor: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: highlight ? c.grabLight : c.alt,
        border: highlight ? `1px solid ${c.grab}` : "none",
        borderRadius: 12,
        padding: "14px 16px",
      }}
    >
      <p
        style={{
          fontSize: 10,
          color: highlight ? c.grabDark : c.muted,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontWeight: 500,
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: 24, fontWeight: 500, color: valueColor, marginBottom: 2 }}>
        {value}
      </p>
      <p
        style={{
          fontSize: 11,
          color: highlight ? c.grabDark : c.sub,
          fontWeight: highlight ? 500 : 400,
        }}
      >
        {note}
      </p>
    </div>
  );
}

function ArithmeticExpansion({ hyp }: { hyp: typeof MOCK_HYPOTHESIS }) {
  return (
    <div
      style={{
        marginTop: 14,
        background: c.alt,
        borderRadius: 12,
        padding: "20px 22px",
      }}
    >
      <p
        style={{
          fontSize: 11,
          color: c.muted,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: 500,
          marginBottom: 12,
        }}
      >
        THE ARITHMETIC
      </p>
      <table
        style={{
          width: "100%",
          fontSize: 13,
          borderCollapse: "collapse",
          marginBottom: 18,
        }}
      >
        <tbody>
          {hyp.arithmetic.map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${c.border}` }}>
              <td style={{ padding: "10px 0", color: c.sub }}>
                {clean(row.label)}
                {row.bet_id && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 4,
                      padding: "2px 8px",
                      background: c.scoutLight,
                      borderRadius: 6,
                    }}
                  >
                    <span style={{ fontSize: 10, color: c.scout }}>⚑</span>
                    <span
                      style={{
                        fontSize: 10,
                        color: c.scoutDark,
                        fontWeight: 500,
                      }}
                    >
                      Bet #{row.bet_id} · tested in Bets tab
                    </span>
                  </div>
                )}
                {!row.bet_id && (
                  <div style={{ fontSize: 10, color: c.muted, marginTop: 2 }}>{row.source}</div>
                )}
              </td>
              <td
                style={{
                  padding: "10px 0",
                  textAlign: "right",
                  fontWeight: 500,
                  color: c.text,
                }}
              >
                {row.value}
              </td>
            </tr>
          ))}
          <tr>
            <td
              style={{
                padding: "12px 0 4px",
                color: c.grabDark,
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              {clean(hyp.arithmetic_result.label)}
            </td>
            <td
              style={{
                padding: "12px 0 4px",
                textAlign: "right",
                fontWeight: 500,
                color: c.grabDark,
                fontSize: 16,
              }}
            >
              {hyp.arithmetic_result.value}
            </td>
          </tr>
        </tbody>
      </table>
      <div
        style={{
          padding: "10px 14px",
          background: "white",
          border: `1px solid ${c.border}`,
          borderRadius: 8,
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: 14, color: c.muted }}>ⓘ</span>
        <p style={{ fontSize: 11, color: c.sub, lineHeight: 1.5 }}>
          Two of the three inputs are Scout estimates. Both are pressure-tested with
          baseline, threshold, precedent, and risk in the Bets tab. Your team's internal
          figures may sharpen these ranges.
        </p>
      </div>
    </div>
  );
}

function SecondaryGoalsGrid({ hyp }: { hyp: typeof MOCK_HYPOTHESIS }) {
  return (
    <>
      <div id="secondary" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: c.muted,
              color: "white",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            2
          </span>
          <p
            style={{
              fontSize: 12,
              color: c.muted,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 500,
            }}
          >
            SECONDARY GOALS TOUCHED
          </p>
        </div>
        <p style={{ fontSize: 12, color: c.sub, marginLeft: 30 }}>
          Where this hypothesis also moves the needle, at smaller scale.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 32,
        }}
      >
        {hyp.secondary_goals.map((sg, i) => (
          <SecondaryGoalCard key={i} sg={sg} />
        ))}
      </div>
    </>
  );
}

function SecondaryGoalCard({ sg }: { sg: (typeof MOCK_HYPOTHESIS)["secondary_goals"][0] }) {
  const [expanded, setExpanded] = useState(false);
  const fullText = sg.bar_note || '';
  const isLong = fullText.length > 140;
  const preview = isLong ? fullText.substring(0, 140).trim() + '…' : fullText;

  return (
    <div
      style={{
        background: c.card,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        padding: "18px 20px",
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <span
          style={{
            fontSize: 11,
            color: c.grabDark,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 600,
          }}
        >
          {sg.label}
        </span>
      </div>

      <div
        style={{
          position: "relative",
          height: 6,
          background: c.alt,
          borderRadius: 99,
          overflow: "hidden",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${sg.bar_percent}%`,
            background: c.grab,
            borderRadius: 99,
          }}
        />
      </div>

      <p
        style={{
          fontSize: 13,
          lineHeight: 1.55,
          color: c.text,
          marginBottom: isLong ? 10 : 0,
        }}
      >
        {expanded || !isLong ? fullText : preview}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            color: c.grabDark,
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {expanded ? "Show less ▴" : "Show full ▾"}
        </button>
      )}
    </div>
  );
}

function RollupChain({ hyp }: { hyp: Hypothesis }) {
  return (
    <>
      <div id="rollup" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: c.muted,
              color: "white",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            3
          </span>
          <p
            style={{
              fontSize: 12,
              color: c.muted,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 500,
            }}
          >
            HOW THIS ROLLS UP TO GROUP GOALS
          </p>
        </div>
        <p style={{ fontSize: 12, color: c.sub, marginLeft: 30 }}>
          From segment contribution to FY 2026 guidance range.
        </p>
      </div>

      <div
        style={{
          background: c.card,
          border: `1px solid ${c.border}`,
          borderRadius: 14,
          padding: "22px 26px",
          marginBottom: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "stretch", gap: 6 }}>
          {hyp.rollup.map((box, i) => (
                      <div key={box.label} style={{ display: "contents" }}>
              <div
                style={{
                  flex: 1,
                  background: box.is_source ? c.grabLight : c.alt,
                  border: box.is_source ? `1px solid ${c.grab}` : "none",
                  borderRadius: 12,
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <p
                  style={{
                    fontSize: 9,
                    color: box.is_source ? c.grabDark : c.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: 500,
                  }}
                >
                  {box.label}
                </p>
                {box.before && (
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: c.sub,
                      lineHeight: 1.1,
                    }}
                  >
                    {box.before} <span style={{ color: c.muted }}>→</span>
                  </p>
                )}
                <p
                  style={{
                    fontSize: box.is_source ? 20 : 18,
                    fontWeight: 500,
                    color: box.is_source ? c.grabDark : c.text,
                    lineHeight: 1,
                  }}
                >
                  {box.after}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: c.grabDark,
                    fontWeight: 500,
                  }}
                >
                  {box.note}
                </p>
              </div>
              {i < hyp.rollup.length - 1 && (
                <div style={{ display: "flex", alignItems: "center", padding: "0 2px" }}>
                  <span style={{ fontSize: 18, color: c.muted }}>→</span>
                </div>
              )}
          </div>
          ))}
        </div>
        <p
          style={{
            fontSize: 11,
            color: c.muted,
            textAlign: "center",
            marginTop: 14,
            lineHeight: 1.5,
          }}
        >
          {hyp.primary_contribution.value} FinServ contribution rolls through segment
          breakeven, into Group Adj EBITDA (top of guidance range), and lifts revenue
          above the midpoint of FY 2026 guidance.
        </p>
      </div>
    </>
  );
}

function BetsBridge({ hyp, onOpenBets }: { hyp: Hypothesis; onOpenBets: () => void }) {
  const financial = hyp.bets.filter((b) => b.type === "financial");
  const execution = hyp.bets.filter((b) => b.type === "execution");

  return (
    <div
      id="bridge"
      style={{
        background: c.scoutXLight,
        border: `2px solid ${c.scout}`,
        borderRadius: 16,
        padding: "24px 26px",
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: c.scout,
            color: "white",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          4
        </span>
        <p
          style={{
            fontSize: 11,
            color: c.scoutDark,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 500,
          }}
        >
          Bets to test in the next stage
        </p>
      </div>

      <div
        style={{
          background: "white",
          border: `1px solid ${c.scout}`,
          borderRadius: 14,
          padding: "18px 22px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 12,
            background: c.scoutLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: 26,
            color: c.scout,
          }}
        >
          ⚑
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: c.text,
              lineHeight: 1.35,
              marginBottom: 4,
            }}
          >
            Scout identified {hyp.bets.length} bets that must hold for this hypothesis to
            work.
          </p>
          <p style={{ fontSize: 12, color: c.sub, lineHeight: 1.5 }}>
            Each gets a baseline, threshold, precedent, and risk in the Bets tab. One
            will be flagged as load-bearing.
          </p>
        </div>
                <button
          onClick={onOpenBets}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "11px 18px",
            borderRadius: 10,
            border: "none",
            background: c.scout,
            color: "white",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          Open Bets tab →
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <BetsColumn
          title="Financial bets"
          desc="Assumptions inside the Impact arithmetic above."
          bets={financial}
          coral
        />
        <BetsColumn
          title="Execution bets"
          desc="Feasibility and timing to actually ship this."
          bets={execution}
        />
      </div>
    </div>
  );
}

function BetsColumn({
  title,
  desc,
  bets,
  coral,
}: {
  title: string;
  desc: string;
  bets: (typeof MOCK_HYPOTHESIS)["bets"];
  coral?: boolean;
}) {
  return (
    <div
      style={{
        background: "white",
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        padding: "16px 18px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: coral ? c.scoutLight : c.alt,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            color: coral ? c.scout : c.sub,
          }}
        >
          {coral ? "🧮" : "⚙"}
        </div>
        <p style={{ fontSize: 12, fontWeight: 500, color: c.text }}>{title}</p>
        <span
          style={{
            marginLeft: "auto",
            padding: "2px 8px",
            background: coral ? c.scoutLight : c.alt,
            color: coral ? c.scoutDark : c.sub,
            fontSize: 10,
            fontWeight: 500,
            borderRadius: 99,
          }}
        >
          {bets.length} bets
        </span>
      </div>
      <p style={{ fontSize: 11, color: c.muted, marginBottom: 14, lineHeight: 1.45 }}>
        {desc}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {bets.map((b) => (
          <div
            key={b.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              background: c.alt,
              borderRadius: 8,
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: coral ? c.scout : c.sub,
                color: "white",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {b.id}
            </span>
            <p
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: c.text,
                lineHeight: 1.35,
                flex: 1,
                minWidth: 0,
              }}
            >
              {clean(b.statement || b.name)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImpactTab({ hyp, onBack, onNext }: { hyp: Hypothesis; onBack: () => void; onNext: () => void }) {
  return (
    <>
      <ActiveHypothesisBanner hyp={hyp} />
      <ImpactAnchorNav />
      <div style={{ marginBottom: 8 }}>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: c.text,
            marginBottom: 4,
          }}
        >
          Size of the prize
        </h1>
        <p style={{ fontSize: 13, color: c.sub, marginBottom: 20 }}>
          What this hypothesis moves, and by how much, against Grab's stated 2026 goals.
        </p>
      </div>
      <PrimaryGoalCard hyp={hyp} />
      <SecondaryGoalsGrid hyp={hyp} />
      <RollupChain hyp={hyp} />
            <BetsBridge hyp={hyp} onOpenBets={onNext} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 16,
          borderTop: `1px solid ${c.border}`,
        }}
      >
       
      </div>
    </>
  );
}

/* ============================================================
   BETS TAB
   ============================================================ */

function BetsTab({ bets, hyp }: { bets: any[]; hyp: any }) {
  if (!bets || bets.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: c.muted }}>
        No bets available yet. Run Scout on a hypothesis first.
      </div>
    );
  }

  return (
    <>
      <ActiveHypothesisBanner hyp={hyp} />
      
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ color: c.scout, fontSize: 18 }}>⚑</span>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: c.text }}>
            Bets to test
          </h1>
        </div>
        <p style={{ fontSize: 13, color: c.sub, marginBottom: 20 }}>
          {bets.length} bets, each anchored to a Grab financial driver and stress-tested by Critic before ranking. Ranked by portfolio construction: near-term feasibility, driver moved, and risk reduction.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {bets.map((bet, i) => (
          <BetCard key={bet.id} bet={bet} index={i + 1} />
        ))}
      </div>

      <div
        style={{
          marginTop: 28,
          padding: "20px 24px",
          background: c.scoutXLight,
          border: `2px solid ${c.scout}`,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: c.scout,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 22,
          }}
        >
          📋
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: c.text, marginBottom: 3 }}>
            The top-ranked bet becomes a pilot
          </p>
          <p style={{ fontSize: 12, color: c.sub }}>
            Pilot tab shows the testable design for Bet #1 — hypothesis, success metric, decision rule, risks.
          </p>
        </div>
      </div>
    </>
  );
}

function BetCard({ bet, index }: { bet: any; index: number }) {
  const tierColor =
    bet.cost_tier?.includes("S") ? c.teal :
    bet.cost_tier?.includes("XL") ? c.red :
    bet.cost_tier?.includes("L") ? c.amber : c.grabDark;
  
  const tierBg =
    bet.cost_tier?.includes("S") ? c.tealBg :
    bet.cost_tier?.includes("XL") ? c.redBg :
    bet.cost_tier?.includes("L") ? c.amberBg : c.grabLight;

  return (
    <div
      style={{
        background: c.card,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        padding: "20px 24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        {/* Rank badge */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: index === 1 ? c.scout : c.alt,
            color: index === 1 ? "white" : c.sub,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          #{bet.rank}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header row: name + pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: c.text, lineHeight: 1.3, flex: 1, minWidth: 200 }}>
                          {clean(bet.name)}
            </h3>
            <span
              style={{
                fontSize: 10,
                padding: "3px 9px",
                borderRadius: 6,
                fontWeight: 500,
                background: tierBg,
                color: tierColor,
              }}
            >
              {bet.cost_tier}
            </span>
            <span
              style={{
                fontSize: 10,
                padding: "3px 9px",
                borderRadius: 6,
                fontWeight: 500,
                background: c.alt,
                color: c.sub,
              }}
            >
              {bet.horizon}
            </span>
            <span
              style={{
                fontSize: 10,
                padding: "3px 9px",
                borderRadius: 6,
                fontWeight: 500,
                background: c.grabLight,
                color: c.grabDark,
              }}
            >
              Feasibility {bet.feasibility_score}/10
            </span>
          </div>

          {/* Description */}
          <p style={{ fontSize: 12, color: c.sub, lineHeight: 1.5, marginBottom: 12 }}>
                        {clean(bet.description)}
          </p>

          {/* Rationale block */}
          <div
            style={{
              padding: "10px 14px",
              background: c.scoutXLight,
              borderRadius: 8,
              border: `1px solid ${c.scoutLight}`,
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: c.scoutDark,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 500,
                marginBottom: 4,
              }}
            >
              Why this bet
            </p>
            <p style={{ fontSize: 11, color: c.sub, lineHeight: 1.5 }}>
                {clean(bet.rationale)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PILOT TAB
   ============================================================ */

function PilotTab({ pilot, hyp, topBet }: { pilot: any; hyp: any; topBet: any }) {
  if (!pilot || !pilot.test_hypothesis) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: c.muted }}>
        No pilot designed yet. Run Scout on a hypothesis first.
      </div>
    );
  }

  const metric = pilot.success_metric || {};
  const risks = pilot.risks || [];

  return (
    <>
      <ActiveHypothesisBanner hyp={hyp} />

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ color: c.scout, fontSize: 18 }}>📋</span>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: c.text }}>
            Pilot design
          </h1>
        </div>
        <p style={{ fontSize: 13, color: c.sub, marginBottom: 20 }}>
          The testable version of the top-ranked bet: how to know it works, when to kill it, and what could go wrong.
        </p>
      </div>

      {/* Test hypothesis card */}
      <div
        style={{
          background: c.card,
          border: `2px solid ${c.scout}`,
          borderRadius: 14,
          padding: "22px 26px",
          marginBottom: 20,
        }}
      >
        <p
          style={{
            fontSize: 10,
            color: c.scoutDark,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 500,
            marginBottom: 8,
          }}
        >
          Test hypothesis
        </p>
        <p style={{ fontSize: 15, color: c.text, lineHeight: 1.5, fontWeight: 500 }}>
          {pilot.test_hypothesis}
        </p>
        {topBet && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${c.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Tests Bet #{topBet.rank}:
            </span>
                        <span style={{ fontSize: 12, color: c.sub }}>{clean(topBet.name)}</span>
          </div>
        )}
      </div>

      {/* Timeline + cost */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div
          style={{
            background: c.card,
            border: `1px solid ${c.border}`,
            borderRadius: 12,
            padding: "16px 20px",
          }}
        >
          <p style={{ fontSize: 10, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
            Timeline
          </p>
          <p style={{ fontSize: 22, fontWeight: 500, color: c.text }}>
            {pilot.timeline_weeks} weeks
          </p>
        </div>
        <div
          style={{
            background: c.card,
            border: `1px solid ${c.border}`,
            borderRadius: 12,
            padding: "16px 20px",
          }}
        >
          <p style={{ fontSize: 10, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
            Pilot cost estimate
          </p>
          <p style={{ fontSize: 22, fontWeight: 500, color: c.text }}>
            ${pilot.cost_usd?.toLocaleString() || "—"}
          </p>
        </div>
      </div>

      {/* Success metric */}
      {metric.metric_name && (
        <div
          style={{
            background: c.card,
            border: `1px solid ${c.border}`,
            borderRadius: 14,
            padding: "22px 26px",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: c.muted,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            SUCCESS METRIC
          </p>
          <h3 style={{ fontSize: 15, fontWeight: 500, color: c.text, marginBottom: 16 }}>
            {metric.metric_name}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {metric.baseline && (
              <ThresholdRow label="Baseline" value={metric.baseline} color={c.sub} bg={c.alt} />
            )}
            {metric.success_threshold && (
              <ThresholdRow label="✓ Success" value={metric.success_threshold} color={c.tealText} bg={c.tealBg} />
            )}
            {metric.ambiguous_zone && (
              <ThresholdRow label="? Ambiguous" value={metric.ambiguous_zone} color={c.amberText} bg={c.amberBg} />
            )}
            {metric.kill_threshold && (
              <ThresholdRow label="✗ Kill" value={metric.kill_threshold} color={c.redText} bg={c.redBg} />
            )}
          </div>
        </div>
      )}

      {/* Decision rule */}
      {pilot.decision_rule && (
        <div
          style={{
            background: c.grabXLight,
            border: `1px solid ${c.grab}`,
            borderRadius: 14,
            padding: "22px 26px",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: c.grabDark,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            DECISION RULE
          </p>
          <p style={{ fontSize: 13, color: c.text, lineHeight: 1.6 }}>
            {pilot.decision_rule}
          </p>
        </div>
      )}

      {/* Risks */}
      {risks.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: c.red }}>⚠</span>
            <p style={{ fontSize: 13, fontWeight: 500, color: c.text }}>
              Risks & mitigations
            </p>
            <span
              style={{
                marginLeft: "auto",
                padding: "2px 8px",
                background: c.alt,
                fontSize: 10,
                color: c.sub,
                borderRadius: 99,
              }}
            >
              {risks.length} risks
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {risks.map((r: any, i: number) => (
              <RiskCard key={i} risk={r} index={i + 1} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function ThresholdRow({ label, value, color, bg }: { label: string; value: string; color: string; bg: string }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        padding: "12px 16px",
        background: bg,
        borderRadius: 10,
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: color,
          minWidth: 90,
          flexShrink: 0,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 12, color: c.text, lineHeight: 1.55, flex: 1 }}>
        {value}
      </span>
    </div>
  );
}

function RiskCard({ risk, index }: { risk: any; index: number }) {
  return (
    <div
      style={{
        background: c.card,
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        padding: "16px 20px",
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: c.redBg,
            color: c.redText,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          {index}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12, color: c.text, lineHeight: 1.5, marginBottom: 10 }}>
            {risk.risk}
          </p>
          <div
            style={{
              padding: "10px 14px",
              background: c.tealBg,
              borderRadius: 8,
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 11, color: c.tealText, fontWeight: 500, flexShrink: 0 }}>
              → Mitigation
            </span>
            <p style={{ fontSize: 11, color: c.sub, lineHeight: 1.5 }}>
              {risk.mitigation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SIGNALS TAB WRAPPER (Scouted / Generate / Saved sub-tabs)
   ============================================================ */

function SignalsWrapper({
  subTab,
  onSubTabChange,
  scoutData,
  onAddToTop3,
  onOpenDetail,
  generateState,
  setGenerateState,
  onPersistGenerated,
  onGoToImpact,
  onSaveScouted,
  onRemoveFromTop3,
  onSetActive,
  onDuplicateSavedToTop3,
  onUnsaveHypothesis,
}: {
  subTab: SignalsSubTab;
  onSubTabChange: (t: SignalsSubTab) => void;
  scoutData: any;
  onPersistGenerated: (hyp: any, action: "top3" | "saved") => Promise<void>;
  onGoToImpact: () => void;
  onSaveScouted: (hypId: string) => Promise<void>;
  onAddToTop3: (hypId: string) => void;
  onOpenDetail: (hyp: any) => void;
  onSetActive: (hypId: string) => Promise<void>;
  onRemoveFromTop3: (hypId: string) => Promise<void>;
  onDuplicateSavedToTop3: (hyp: any) => Promise<void>;
  onUnsaveHypothesis: (hypId: string) => Promise<void>;
  generateState: GenerateState;
  setGenerateState: React.Dispatch<React.SetStateAction<GenerateState>>;
}) {
  const subTabs: { id: SignalsSubTab; label: string; icon: string; count?: number }[] = [
    { id: "scouted", label: "Scouted", icon: "🔭", count: scoutData.scoutedHypotheses.length },
    { id: "generate", label: "Generate new", icon: "✨" },
    { id: "saved", label: "Saved", icon: "🔖", count: scoutData.savedHypotheses.length },
  ];

  return (
    <>
      {/* Top 3 workset — persistent across sub-tabs */}
                <Top3Workset
        top3={scoutData.top3}
        onGoToGenerate={() => onSubTabChange("generate")}
        onOpenSlot={onOpenDetail}
        onRemove={onRemoveFromTop3}
        onSetActive={onSetActive}
      />

      {/* Sub-tab bar */}
      <div
        style={{
          marginTop: 24,
          marginBottom: 20,
          display: "flex",
          gap: 4,
          borderBottom: `1px solid ${c.border}`,
        }}
      >
        {subTabs.map((st) => {
          const isActive = st.id === subTab;
          return (
            <button
              key={st.id}
              onClick={() => onSubTabChange(st.id)}
              style={{
                padding: "10px 18px",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${isActive ? c.scout : "transparent"}`,
                color: isActive ? c.scoutDark : c.sub,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: -1,
              }}
            >
              <span>{st.icon}</span>
              <span>{st.label}</span>
              {typeof st.count === "number" && (
                <span
                  style={{
                    padding: "1px 7px",
                    borderRadius: 99,
                    background: isActive ? c.scoutLight : c.alt,
                    color: isActive ? c.scoutDark : c.muted,
                    fontSize: 10,
                    fontWeight: 500,
                  }}
                >
                  {st.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-tab content */}
      {subTab === "scouted" && (
  <ScoutedSubTab
    scoutedHypotheses={scoutData.scoutedHypotheses}
    onOpenDetail={onOpenDetail}
    onAddToTop3={onAddToTop3}
    onSave={onSaveScouted}
  />
)}
{subTab === "saved" && (
  <SavedSubTab
    savedHypotheses={scoutData.savedHypotheses}
    onOpenDetail={onOpenDetail}
    onDuplicateToTop3={onDuplicateSavedToTop3}
    onUnsave={onUnsaveHypothesis}
  />
)}
     {subTab === "generate" && (
  <GenerateSubTab
    signals={scoutData.signals || []}
    goals={scoutData.goals || []}
    drivers={scoutData.drivers || []}
    generateState={generateState}
    setGenerateState={setGenerateState}
    onPersist={onPersistGenerated}
    onGoToImpact={onGoToImpact}
  />
)}
    </>
  );
}

/* ============================================================
   GENERATE SUB-TAB — stepped Framer, strategist workflow
   ============================================================ */

export type GenerateState = {
  selectedIds: string[];
  steps: Array<{ step: number; output: string; wasNudged: boolean; parsed?: any }>;
  currentStepOutput: string;
  activeStep: number;
  streaming: boolean;
  error: string | null;
  selectedFraming: any | null;
};

export const initialGenerateState: GenerateState = {
  selectedIds: [],
  steps: [],
  currentStepOutput: "",
  activeStep: 0,
  streaming: false,
  error: null,
  selectedFraming: null,
};

function parseHypothesisFromStep4(text: string) {
  const shortMatch = text.match(/SHORT_NAME:\s*(.+?)(?:\n|$)/);
  const thesisMatch = text.match(/THESIS:\s*([\s\S]+?)(?=\n(?:PRIMARY_GOAL|LOAD_BEARING_DRIVERS|LOAD_BEARING_PRODUCTS):|$)/);
  const goalMatch = text.match(/PRIMARY_GOAL:\s*(.+?)(?:\n|$)/);
  const driversMatch = text.match(/LOAD_BEARING_DRIVERS:\s*(.+?)(?:\n|$)/);
  const productsMatch = text.match(/LOAD_BEARING_PRODUCTS:\s*(.+?)(?:\n|$)/);

  return {
    short_name: shortMatch?.[1]?.trim() || '',
    thesis: thesisMatch?.[1]?.trim() || '',
    primary_goal_id: goalMatch?.[1]?.trim() || '',
    load_bearing_driver_ids: (driversMatch?.[1]?.trim() || '').split(',').map((s: string) => s.trim()).filter(Boolean),
    load_bearing_product_ids: (productsMatch?.[1]?.trim() || '').split(',').map((s: string) => s.trim()).filter(Boolean),
  };
}

function parseFramingsFromStep3(text: string) {
  try {
    const cleaned = text.replace(/```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed.framings || [];
  } catch {
    return [];
  }
}

async function callFramerStep(
  stepNum: number,
  signalTitles: string[],
  priorSteps: Array<{ step: number; output: string }>,
  nudge: string | null,
  selectedFraming: any | null,
  onToken: (chunk: string) => void
): Promise<string> {
  const res = await fetch("/api/framer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      step: stepNum,
      signal_titles: signalTitles,
      prior_steps: priorSteps,
      nudge,
      selected_framing: selectedFraming,
    }),
  });
  if (!res.ok || !res.body) throw new Error(`Framer failed (${res.status})`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (!data) continue;
      try {
        const p = JSON.parse(data);
        if (p.type === "content_block_delta" && p.delta?.text) {
          full += p.delta.text;
          onToken(p.delta.text);
        }
      } catch {}
    }
  }
  return full;
}

function GenerateSubTab({
  signals,
  goals,
  drivers,
  generateState,
  setGenerateState,
  onPersist,
  onGoToImpact,
}: {
  signals: any[];
  goals: any[];
  drivers: any[];
  generateState: GenerateState;
  setGenerateState: React.Dispatch<React.SetStateAction<GenerateState>>;
  onPersist: (hyp: any, action: "top3" | "saved") => Promise<void>;
  onGoToImpact: () => void;
}) {
  type Filters = {
    sector: string;
    market: string;
    competitor: string;
    timeframe: string;
  };
  const defaultFilters: Filters = {
    sector: "all",
    market: "all",
    competitor: "all",
    timeframe: "all",
  };

  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const stepLabels = ["Reading signals", "Sizing the stakes", "Considering framings", "Drafting hypothesis"];

  const uniqueSectors = useMemo(() => {
    const set = new Set<string>();
    signals.forEach((s) => {
      const v = (s.sector || '').trim();
      if (v) set.add(v);
    });
    return Array.from(set).sort();
  }, [signals]);

  const uniqueMarkets = useMemo(() => {
    const set = new Set<string>();
    signals.forEach((s) => {
      if (!s.markets) return;
      String(s.markets).split(",").forEach((m: string) => {
        const trimmed = m.trim();
        if (trimmed) set.add(trimmed);
      });
    });
    return Array.from(set).sort();
  }, [signals]);

  const uniqueCompetitors = useMemo(() => {
    const set = new Set<string>();
    signals.forEach((s) => {
      const v = (s.company || '').trim();
      if (v) set.add(v);
    });
    return Array.from(set).sort();
  }, [signals]);

const filteredSignals = useMemo(() => {
    let out = [...signals];
    if (signals.length > 0) console.log('SIGNAL[0]:', signals[0]);
    if (filters.sector !== "all") {
      out = out.filter((s) => (s.sector || '').trim() === filters.sector);
    }
    if (filters.market !== "all") {
      out = out.filter((s) => {
        if (!s.markets) return false;
        return String(s.markets)
          .split(",")
          .map((m: string) => m.trim())
          .includes(filters.market);
      });
    }
    if (filters.competitor !== "all") {
      out = out.filter((s) => (s.company || '').trim() === filters.competitor);
    }
    if (filters.timeframe !== "all") {
      const days =
        filters.timeframe === "30d" ? 30 :
        filters.timeframe === "90d" ? 90 :
        filters.timeframe === "180d" ? 180 : 365;
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      out = out.filter((s) => {
        if (!s.date) return false;
        const d = new Date(s.date).getTime();
        if (isNaN(d)) return false;
        return d >= cutoff;
      });
    }

    out.sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });
    return out;
  }, [signals, filters]);

  const toggleSelect = (id: string) => {
    setGenerateState((s) => ({
      ...s,
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((x) => x !== id)
        : s.selectedIds.length >= 5
        ? s.selectedIds
        : [...s.selectedIds, id],
    }));
  };

  const runStep = async (stepNum: number, opts: { nudge?: string | null; framing?: any } = {}) => {
    const signalTitles = signals
      .filter((s) => generateState.selectedIds.includes(s.id))
      .map((s) => s.title);

    setGenerateState((s) => ({
      ...s,
      activeStep: stepNum,
      streaming: true,
      currentStepOutput: "",
      error: null,
      steps: opts.nudge
        ? s.steps.filter((st) => st.step !== stepNum)
        : s.steps.filter((st) => st.step < stepNum),
    }));

    try {
      const priorSteps = generateState.steps.filter((st) => st.step < stepNum);

      const output = await callFramerStep(
        stepNum,
        signalTitles,
        priorSteps,
        opts.nudge || null,
        opts.framing || null,
        (chunk) => {
          setGenerateState((s) => ({ ...s, currentStepOutput: s.currentStepOutput + chunk }));
        }
      );

      let parsed: any = null;
      if (stepNum === 3) parsed = parseFramingsFromStep3(output);
      if (stepNum === 4) parsed = parseHypothesisFromStep4(output);

      setGenerateState((s) => ({
        ...s,
        streaming: false,
        currentStepOutput: "",
        steps: [
          ...s.steps.filter((st) => st.step !== stepNum),
          { step: stepNum, output, wasNudged: !!opts.nudge, parsed },
        ].sort((a, b) => a.step - b.step),
      }));
    } catch (err: any) {
      setGenerateState((s) => ({ ...s, streaming: false, error: err.message }));
    }
  };

  const reset = () => setGenerateState(initialGenerateState);
  const clearSelection = () => setGenerateState((s) => ({ ...s, selectedIds: [] }));

  const canGenerate = generateState.selectedIds.length >= 2;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(360px, 0.85fr) 1.5fr", gap: 20 }}>
      {/* LEFT PANEL */}
      <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500, marginBottom: 4 }}>
            Step 1 · Pick signals
          </p>
          <p style={{ fontSize: 12, color: c.sub }}>Select 2-5 signals with a shared thread.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
          <select
            value={filters.sector}
            onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
            style={{ padding: "6px 8px", border: `1px solid ${c.border}`, borderRadius: 6, fontSize: 11, background: "white" }}
          >
            <option value="all">All sectors</option>
            {uniqueSectors.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={filters.market}
            onChange={(e) => setFilters({ ...filters, market: e.target.value })}
            style={{ padding: "6px 8px", border: `1px solid ${c.border}`, borderRadius: 6, fontSize: 11, background: "white" }}
          >
            <option value="all">All markets</option>
            {uniqueMarkets.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={filters.competitor}
            onChange={(e) => setFilters({ ...filters, competitor: e.target.value })}
            style={{ padding: "6px 8px", border: `1px solid ${c.border}`, borderRadius: 6, fontSize: 11, background: "white" }}
          >
            <option value="all">All competitors</option>
            {uniqueCompetitors.map((comp) => (
              <option key={comp} value={comp}>{comp}</option>
            ))}
          </select>
          <select
            value={filters.timeframe}
            onChange={(e) => setFilters({ ...filters, timeframe: e.target.value })}
            style={{ padding: "6px 8px", border: `1px solid ${c.border}`, borderRadius: 6, fontSize: 11, background: "white" }}
          >
            <option value="all">All time</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="180d">Last 6 months</option>
            <option value="365d">Last 12 months</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, padding: "6px 10px", background: generateState.selectedIds.length > 0 ? c.grabXLight : c.alt, borderRadius: 6, fontSize: 11 }}>
          <span style={{ color: generateState.selectedIds.length > 0 ? c.grabDark : c.muted, fontWeight: 500 }}>
            {generateState.selectedIds.length}/5 selected
          </span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ color: c.muted }}>
              {filteredSignals.length} of {signals.length}
            </span>
            {(filters.sector !== "all" || filters.market !== "all" || filters.competitor !== "all" || filters.timeframe !== "all") && (
              <button
                onClick={() => setFilters(defaultFilters)}
                style={{ background: "none", border: "none", color: c.scout, fontSize: 10, cursor: "pointer", fontWeight: 500 }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 620, overflowY: "auto", paddingRight: 4 }}>
          {filteredSignals.length === 0 && (
            <div style={{ padding: 20, textAlign: "center", color: c.muted, fontSize: 11 }}>
              No signals match filters
            </div>
          )}
          {filteredSignals.slice(0, 100).map((s) => (
            <SignalPickerCard
              key={s.id}
              signal={s}
              selected={generateState.selectedIds.includes(s.id)}
              onToggle={() => toggleSelect(s.id)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div>
        <FramerWorkspace
          generateState={generateState}
          stepLabels={stepLabels}
          canGenerate={canGenerate}
          goals={goals}
          drivers={drivers}
          allSignals={signals}
          onStart={() => runStep(1)}
          onApproveStep1={() => runStep(2)}
          onNudgeStep2={(nudge) => runStep(2, { nudge })}
          onApproveStep2={() => runStep(3)}
          onNudgeStep3={(nudge) => runStep(3, { nudge })}
          onSelectFraming={(framing) => {
            setGenerateState((s) => ({ ...s, selectedFraming: framing }));
            runStep(4, { framing });
          }}
          onReset={reset}
          onClearSelection={clearSelection}
          onPersist={onPersist}
          onGoToImpact={onGoToImpact}
        />
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function FramerWorkspace({
  generateState,
  stepLabels,
  canGenerate,
  goals,
  drivers,
  allSignals,
  onStart,
  onApproveStep1,
  onNudgeStep2,
  onApproveStep2,
  onNudgeStep3,
  onSelectFraming,
  onReset,
  onClearSelection,
  onPersist,
  onGoToImpact,
}: any) {
  const { steps, currentStepOutput, activeStep, streaming, error, selectedFraming, selectedIds } = generateState;
  const notStarted = activeStep === 0;

  const step1 = steps.find((s: any) => s.step === 1);
  const step2 = steps.find((s: any) => s.step === 2);
  const step3 = steps.find((s: any) => s.step === 3);
  const step4 = steps.find((s: any) => s.step === 4);

  const awaitingStep1Approval = step1 && !streaming && activeStep === 1;
  const awaitingStep2Approval = step2 && !streaming && activeStep === 2;
  const awaitingStep3FramingChoice = step3 && !streaming && activeStep === 3 && step3.parsed?.length > 0;

  const isStreamingStep3 = streaming && activeStep === 3;

  return (
    <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 20, minHeight: 500 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${c.border}` }}>
        <div>
          <p style={{ fontSize: 11, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500, marginBottom: 2 }}>
            Step 2 · Scout's reasoning
          </p>
          <p style={{ fontSize: 13, color: c.sub }}>
            Four steps. Approve, nudge, or pick a framing.
          </p>
        </div>
        {(activeStep > 0 || steps.length > 0) && (
          <button
            onClick={onReset}
            style={{ padding: "6px 12px", background: "transparent", border: `1px solid ${c.border}`, borderRadius: 6, fontSize: 11, color: c.muted, cursor: "pointer" }}
          >
            Reset
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {stepLabels.map((label: string, i: number) => {
          const stepNum = i + 1;
          const isDone = steps.some((s: any) => s.step === stepNum);
          const isActive = activeStep === stepNum && streaming;
          return (
            <div key={stepNum} style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  height: 4,
                  background: isDone ? c.grab : isActive ? c.scout : c.alt,
                  borderRadius: 99,
                  marginBottom: 4,
                }}
              />
              <p style={{ fontSize: 9, color: isDone || isActive ? c.text : c.muted, fontWeight: isActive ? 500 : 400 }}>
                {stepNum}. {label}
              </p>
            </div>
          );
        })}
      </div>

      {notStarted && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
          <p style={{ fontSize: 14, color: c.text, fontWeight: 500, marginBottom: 4 }}>
            Ready when you are
          </p>
          <p style={{ fontSize: 12, color: c.sub, marginBottom: 20 }}>
            Pick your signals, then start Scout's reasoning.
          </p>
          <button
            onClick={onStart}
            disabled={!canGenerate}
            style={{
              padding: "12px 24px",
              background: canGenerate ? c.scout : c.alt,
              color: canGenerate ? "white" : c.muted,
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              cursor: canGenerate ? "pointer" : "not-allowed",
            }}
          >
            {canGenerate ? "Start reasoning →" : "Select at least 2 signals"}
          </button>
        </div>
      )}

      {!notStarted && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {step1 && (
            <StepBlock
              stepNum={1}
              stepLabel={stepLabels[0]}
              output={step1.output}
              streaming={false}
              wasNudged={step1.wasNudged}
            />
          )}

          {awaitingStep1Approval && (
            <div style={{ display: "flex", gap: 8, animation: "slideIn 0.3s ease-out" }}>
              <button
                onClick={onClearSelection}
                style={{ flex: 1, padding: "10px", background: "transparent", border: `1px solid ${c.border}`, borderRadius: 8, color: c.sub, fontSize: 12, fontWeight: 500, cursor: "pointer" }}
              >
                Clear selection
              </button>
              <button
                onClick={onApproveStep1}
                style={{ flex: 2, padding: "10px", background: c.grab, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}
              >
                ✓ Approve → Step 2: Sizing the stakes
              </button>
            </div>
          )}

          {step2 && (
            <StepBlock
              stepNum={2}
              stepLabel={stepLabels[1]}
              output={step2.output}
              streaming={false}
              wasNudged={step2.wasNudged}
            />
          )}

          {awaitingStep2Approval && (
            <NudgeAndApprove
              onNudge={onNudgeStep2}
              onApprove={onApproveStep2}
              approveLabel="Approve → Step 3: Considering framings"
            />
          )}

          {isStreamingStep3 && (
            <div style={{ padding: "18px 20px", background: c.scoutXLight, border: `1px solid ${c.scout}`, borderRadius: 10, animation: "slideIn 0.3s ease-out" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: c.scout, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, animation: "pulse 1.4s ease-in-out infinite" }}>•</div>
                <span style={{ fontSize: 12, fontWeight: 500, color: c.text }}>
                  Step 3 · Considering framings
                </span>
              </div>
              <p style={{ fontSize: 12, color: c.sub, paddingLeft: 30, marginTop: 6 }}>
                Framer is weighing defensive, offensive, and convergence angles...
              </p>
            </div>
          )}

          {awaitingStep3FramingChoice && (
            <FramingChoice
              framings={step3.parsed}
              onSelect={onSelectFraming}
              onNudge={onNudgeStep3}
            />
          )}

          {selectedFraming && step4 && (
            <div style={{ padding: "10px 14px", background: c.scoutXLight, border: `1px solid ${c.scout}`, borderRadius: 8, fontSize: 12, color: c.scoutDark, fontWeight: 500 }}>
                           ✓ Framing: {clean(selectedFraming.name)} ({selectedFraming.type})
            </div>
          )}

          {streaming && activeStep !== 3 && (
            <StepBlock
              stepNum={activeStep}
              stepLabel={stepLabels[activeStep - 1]}
              output={currentStepOutput}
              streaming={true}
            />
          )}

          {error && (
            <div style={{ padding: 12, background: c.redBg, color: c.redText, borderRadius: 8, fontSize: 12 }}>
              {error}
            </div>
          )}

                    {step4 && step4.parsed && !streaming && (
            <HypothesisDraftCard
              hypothesis={step4.parsed}
              selectedFraming={selectedFraming}
              goals={goals}
              drivers={drivers}
              allSteps={steps}
              allSignals={allSignals}
              selectedIds={selectedIds}
              onPersist={onPersist}
              onGoToImpact={onGoToImpact}
            />
          )}
        </div>
      )}
    </div>
  );
}

function NudgeAndApprove({
  onNudge,
  onApprove,
  approveLabel,
}: {
  onNudge: (nudge: string) => void;
  onApprove: () => void;
  approveLabel: string;
}) {
  const [nudgeText, setNudgeText] = useState("");
  return (
    <div style={{ padding: 14, background: c.grabXLight, border: `1px solid ${c.grab}`, borderRadius: 12, animation: "slideIn 0.3s ease-out" }}>
      <p style={{ fontSize: 11, color: c.grabDark, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500, marginBottom: 10 }}>
        Approve to continue, or nudge Scout
      </p>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <input
          type="text"
          value={nudgeText}
          onChange={(e) => setNudgeText(e.target.value)}
          placeholder="Nudge Scout with your own angle..."
          style={{
            flex: 1,
            padding: "8px 12px",
            border: `1px solid ${c.border}`,
            borderRadius: 8,
            fontSize: 12,
            background: "white",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={() => {
            if (nudgeText.trim()) {
              onNudge(nudgeText);
              setNudgeText("");
            }
          }}
          disabled={!nudgeText.trim()}
          style={{
            padding: "8px 12px",
            background: c.scout,
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 500,
            cursor: nudgeText.trim() ? "pointer" : "not-allowed",
            opacity: nudgeText.trim() ? 1 : 0.5,
          }}
        >
          Nudge
        </button>
      </div>
      <button
        onClick={onApprove}
        style={{
          width: "100%",
          padding: "10px",
          background: c.grab,
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        ✓ {approveLabel}
      </button>
    </div>
  );
}

function FramingChoice({
  framings,
  onSelect,
  onNudge,
}: {
  framings: any[];
  onSelect: (f: any) => void;
  onNudge: (nudge: string) => void;
}) {
  const [nudgeText, setNudgeText] = useState("");
  const typeColor = (t: string) =>
    t === "defensive" ? c.red : t === "offensive" ? c.teal : c.amber;
  const typeBg = (t: string) =>
    t === "defensive" ? c.redBg : t === "offensive" ? c.tealBg : c.amberBg;
  const typeText = (t: string) =>
    t === "defensive" ? c.redText : t === "offensive" ? c.tealText : c.amberText;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "slideIn 0.3s ease-out" }}>
      <p style={{ fontSize: 11, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>
        Pick a framing to develop into a hypothesis
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {framings.map((f, i) => (
          <button
            key={i}
            onClick={() => onSelect(f)}
            style={{
              textAlign: "left",
              padding: "14px 16px",
              background: c.card,
              borderTop: `1px solid ${c.border}`,
              borderRight: `1px solid ${c.border}`,
              borderBottom: `1px solid ${c.border}`,
              borderLeft: `4px solid ${typeColor(f.type)}`,
              borderRadius: 10,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: typeBg(f.type), color: typeText(f.type), fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", alignSelf: "flex-start" }}>
              {f.type}
            </span>
            <p style={{ fontSize: 13, fontWeight: 500, color: c.text, lineHeight: 1.3 }}>
                            {clean(f.name)}
            </p>
            <p style={{ fontSize: 11, color: c.sub, lineHeight: 1.5 }}>
              {f.summary}
            </p>
            <p style={{ fontSize: 10, color: c.muted, lineHeight: 1.5, marginTop: 4, paddingTop: 8, borderTop: `1px solid ${c.border}` }}>
                         {clean(f.rationale)}
            </p>
          </button>
        ))}
      </div>
      <div style={{ padding: 12, background: c.alt, borderRadius: 10, marginTop: 4 }}>
        <p style={{ fontSize: 10, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500, marginBottom: 8 }}>
          Or nudge Scout to reconsider the framings
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          <input
            type="text"
            value={nudgeText}
            onChange={(e) => setNudgeText(e.target.value)}
            placeholder="e.g. Focus on regulatory angle..."
            style={{ flex: 1, padding: "8px 12px", border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 12, background: "white", boxSizing: "border-box" }}
          />
          <button
            onClick={() => {
              if (nudgeText.trim()) {
                onNudge(nudgeText);
                setNudgeText("");
              }
            }}
            disabled={!nudgeText.trim()}
            style={{ padding: "8px 12px", background: c.scout, color: "white", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 500, cursor: nudgeText.trim() ? "pointer" : "not-allowed", opacity: nudgeText.trim() ? 1 : 0.5 }}
          >
            Nudge
          </button>
        </div>
      </div>
    </div>
  );
}

function StepBlock({
  stepNum,
  stepLabel,
  output,
  streaming,
  wasNudged,
}: {
  stepNum: number;
  stepLabel: string;
  output: string;
  streaming?: boolean;
  wasNudged?: boolean;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      style={{
        background: streaming ? c.scoutXLight : c.alt,
        border: `1px solid ${streaming ? c.scout : c.border}`,
        borderRadius: 10,
        padding: "12px 14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: expanded ? 8 : 0 }}>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: streaming ? c.scout : c.grab,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 500,
            animation: streaming ? "pulse 1.4s ease-in-out infinite" : "none",
          }}
        >
          {streaming ? "•" : "✓"}
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, color: c.text }}>
          Step {stepNum} · {stepLabel}
        </span>
        {wasNudged && (
          <span style={{ fontSize: 9, padding: "2px 6px", background: c.scoutLight, color: c.scoutDark, borderRadius: 4, fontWeight: 500 }}>
            NUDGED
          </span>
        )}
        {!streaming && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ marginLeft: "auto", background: "none", border: "none", color: c.muted, fontSize: 10, cursor: "pointer" }}
          >
            {expanded ? "collapse" : "expand"}
          </button>
        )}
      </div>
      {expanded && (
        <p
          style={{
            fontSize: 13,
            color: c.text,
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            paddingLeft: 30,
          }}
        >
          {output}
          {streaming && <span style={{ opacity: 0.4 }}>▊</span>}
        </p>
      )}
    </div>
  );
}

function HypothesisDraftCard({
  hypothesis,
  selectedFraming,
  goals,
  drivers,
  allSteps,
  allSignals,
  selectedIds,
  onPersist,
  onGoToImpact,
}: {
  hypothesis: any;
  selectedFraming: any;
  goals: any[];
  drivers: any[];
  allSteps: any[];
  allSignals: any[];
  selectedIds: string[];
  onPersist: (hyp: any, action: "top3" | "saved") => Promise<void>;
  onGoToImpact: () => void;
}) {
  const [driversExpanded, setDriversExpanded] = useState(false);
  const [productsExpanded, setProductsExpanded] = useState(false);
  const [busy, setBusy] = useState<null | "top3" | "saved">(null);
  const [savedDone, setSavedDone] = useState(false);
  const [top3Done, setTop3Done] = useState(false);

  // Case-insensitive + trimmed goal lookup with substring fallback
  const goalIdRaw = (hypothesis.primary_goal_id || '').trim();
  const goalIdLower = goalIdRaw.toLowerCase();
  const goal =
  goals.find((g) => (g.goal_id || '').trim().toLowerCase() === goalIdLower) ||
  goals.find((g) => (g.goal_id || '').trim().toLowerCase().includes(goalIdLower)) ||
  goals.find((g) => goalIdLower.includes((g.goal_id || '').trim().toLowerCase()));

// Humanize the raw goal_id as fallback if lookup fails
const humanizeGoalId = (id: string) => {
  if (!id) return "—";
  const map: Record<string, string> = {
    FS_EBITDA_H2_26: "FinServ H2 2026 EBITDA breakeven",
    FS_GLP_EOY_26: "FinServ GLP by end of 2026",
    OD_GMV_H2_26: "On-Demand GMV growth H2 2026",
    GRP_REV_FY26: "FY26 Group Revenue",
    GRP_EBITDA_FY26: "FY26 Group Adj EBITDA",
    DEL_MARGIN_FY26: "Deliveries margin FY26",
    MTU_MOMENTUM: "Ecosystem MTU momentum",
  };
  return map[id.toUpperCase()] || clean(id);
};

const goalName = goal?.goal_name || goal?.name || humanizeGoalId(goalIdRaw);

// Debug — remove after verifying
if (typeof window !== 'undefined') {
  console.log('[Goal lookup]', { goalIdRaw, goalsCount: goals.length, sampleGoal: goals[0], resolvedGoal: goal });
}

  const driverDetails = (hypothesis.load_bearing_driver_ids || [])
    .map((did: string) => {
      const norm = did.trim().toLowerCase();
      return drivers.find((d) => (d.driver_id || '').trim().toLowerCase() === norm);
    })
    .filter(Boolean);

    const handlePersist = async (action: "top3" | "saved") => {
    setBusy(action);
    try {
      // Pull all 4 stages from the parent state
      const stage1 = allSteps?.find((s: any) => s.step === 1)?.output || '';
      const stage2 = allSteps?.find((s: any) => s.step === 2)?.output || '';
      const stage3 = allSteps?.find((s: any) => s.step === 3)?.output || '';
      const stage4 = selectedFraming?.rationale || '';

      // Pull competitor + markets + sector from selected signals
      const selSignals = allSignals?.filter((s: any) => selectedIds?.includes(s.id)) || [];
      const competitors = Array.from(new Set(selSignals.map((s: any) => s.company).filter(Boolean))).join(', ');
      const markets = Array.from(new Set(selSignals.flatMap((s: any) => (s.markets || '').split(',').map((m: string) => m.trim())).filter(Boolean))).join(', ');
      const sectors = Array.from(new Set(selSignals.map((s: any) => s.sector).filter(Boolean))).join(', ');
      const signalsUsed = selSignals.map((s: any) => s.title).join(' | ');

      const hypToSave = {
  ...hypothesis,
  framer_stage_1: stage1,
  framer_stage_2: stage2,
  framer_stage_3: stage3,
  framer_stage_4_rationale: stage4,
  framing_type: selectedFraming?.type,
  framing_rationale: selectedFraming?.rationale,
  signals_used: signalsUsed,
  competitor: competitors,
  markets: markets,
  sector: sectors,
  // NEW — persist goal + drivers
  primary_goal_id: hypothesis.primary_goal_id,
  load_bearing_drivers: (hypothesis.load_bearing_driver_ids || []).join(', '),
  load_bearing_products: (hypothesis.load_bearing_product_ids || []).join(', '),
};
      await onPersist(hypToSave, action);
      if (action === "top3") setTop3Done(true);
      if (action === "saved") setSavedDone(true);
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div
      style={{
        background: c.card,
        border: `2px solid ${c.grab}`,
        borderRadius: 14,
        padding: "18px 20px",
        animation: "slideIn 0.4s ease-out",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 16 }}>🎯</span>
        <span style={{ fontSize: 10, color: c.grabDark, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>
          Hypothesis drafted
        </span>
        {selectedFraming && (
          <span style={{ fontSize: 9, padding: "2px 7px", background: c.scoutLight, color: c.scoutDark, borderRadius: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {selectedFraming.type}
          </span>
        )}
      </div>

      <h3 style={{ fontSize: 17, fontWeight: 500, color: c.text, lineHeight: 1.3, marginBottom: 10 }}>
        {hypothesis.short_name || "(no name)"}
      </h3>

      <p style={{ fontSize: 13, color: c.sub, lineHeight: 1.6, marginBottom: 14 }}>
                {clean(hypothesis.thesis)}
      </p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        <span style={{ fontSize: 11, padding: "4px 10px", background: c.grabLight, color: c.grabDark, borderRadius: 6, fontWeight: 500 }}>
          Goal: {goalName}
        </span>
        <button
          onClick={() => setDriversExpanded(!driversExpanded)}
          style={{ fontSize: 11, padding: "4px 10px", background: c.alt, color: c.sub, borderRadius: 6, fontWeight: 500, border: "none", cursor: "pointer" }}
        >
          {driverDetails.length} load-bearing driver{driverDetails.length !== 1 ? 's' : ''} {driversExpanded ? '▴' : '▾'}
        </button>
        {(hypothesis.load_bearing_product_ids?.length > 0) && (
  <button
    onClick={() => setProductsExpanded(!productsExpanded)}
    style={{ fontSize: 11, padding: "4px 10px", background: c.scoutLight, color: c.scoutDark, borderRadius: 6, fontWeight: 500, border: "none", cursor: "pointer" }}
  >
    {hypothesis.load_bearing_product_ids.length} Grab product{hypothesis.load_bearing_product_ids.length !== 1 ? 's' : ''} {productsExpanded ? '▴' : '▾'}
  </button>
)}
      </div>

      {driversExpanded && driverDetails.length > 0 && (
        <div style={{ marginBottom: 14, padding: "12px 14px", background: c.alt, borderRadius: 8 }}>
          <p style={{ fontSize: 10, color: c.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>
            Load-bearing drivers
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {driverDetails.map((d: any) => (
              <div key={d.driver_id} style={{ padding: "8px 10px", background: "white", borderRadius: 6, border: `1px solid ${c.border}` }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: c.text, marginBottom: 3 }}>
                  {d.driver_name}
                </p>
                <p style={{ fontSize: 11, color: c.sub, lineHeight: 1.5 }}>
                  {d.sensitivity_note || "No sensitivity note"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {productsExpanded && hypothesis.load_bearing_product_ids?.length > 0 && (
  <div style={{ marginBottom: 14, padding: "12px 14px", background: c.scoutXLight, borderRadius: 8, border: `1px solid ${c.scoutLight}` }}>
    <p style={{ fontSize: 10, color: c.scoutDark, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>
      Grab products doing the work
    </p>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {hypothesis.load_bearing_product_ids.map((pid: string) => (
        <div key={pid} style={{ padding: "8px 10px", background: "white", borderRadius: 6, border: `1px solid ${c.border}` }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: c.text }}>
            {pid}
          </p>
        </div>
      ))}
    </div>
    <p style={{ fontSize: 10, color: c.muted, marginTop: 8, fontStyle: "italic" }}>
      Full product names + roles surface in the Impact tab when you promote to Active.
    </p>
  </div>
)}


      {(top3Done || savedDone) && (
        <div style={{ marginBottom: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          {top3Done && (
            <div style={{ padding: 10, background: c.grabLight, color: c.grabDark, borderRadius: 8, fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 10 }}>
              <span>✓ Added to Top 3. Impact tab now runs the deep pipeline.</span>
              <button
                onClick={onGoToImpact}
                style={{ marginLeft: "auto", padding: "4px 10px", background: c.grab, color: "white", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: "pointer" }}
              >
                Go to Impact →
              </button>
            </div>
          )}
          {savedDone && (
            <div style={{ padding: 10, background: c.scoutXLight, color: c.scoutDark, borderRadius: 8, fontSize: 12, fontWeight: 500 }}>
              ✓ Saved to your library.
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => handlePersist("saved")}
          disabled={busy !== null || savedDone}
          style={{
            flex: 1,
            padding: "10px",
            background: savedDone ? c.scoutLight : "transparent",
            border: `1px solid ${savedDone ? c.scout : c.border}`,
            borderRadius: 8,
            color: savedDone ? c.scoutDark : c.sub,
            fontSize: 12,
            fontWeight: 500,
            cursor: busy || savedDone ? "not-allowed" : "pointer",
            opacity: busy === "saved" ? 0.6 : 1,
          }}
        >
          {busy === "saved" ? "Saving..." : savedDone ? "✓ Saved" : "🔖 Add to Saved"}
        </button>
        <button
          onClick={() => handlePersist("top3")}
          disabled={busy !== null || top3Done}
          style={{
            flex: 2,
            padding: "10px",
            background: top3Done ? c.grabDark : c.grab,
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 500,
            cursor: busy || top3Done ? "default" : "pointer",
            opacity: busy === "top3" ? 0.6 : 1,
          }}
        >
          {busy === "top3" ? "Adding..." : top3Done ? "✓ In Top 3" : "Add to Top 3 →"}
        </button>
      </div>
    </div>
  );
}

function SignalPickerCard({
  signal,
  selected,
  onToggle,
}: {
  signal: any;
  selected: boolean;
  onToggle: () => void;
}) {
  const typeColor =
    signal.type === "THREAT" || signal.type === "threat" ? c.red :
    signal.type === "OPPORTUNITY" || signal.type === "opportunity" ? c.teal :
    signal.type === "SHIFT" || signal.type === "shift" ? c.amber : c.muted;

  const formattedDate = signal.date
    ? new Date(signal.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <button
      onClick={onToggle}
      style={{
        textAlign: "left",
        padding: "10px 12px",
        background: selected ? c.grabXLight : c.card,
        borderTop: `${selected ? 2 : 1}px solid ${selected ? c.grab : c.border}`,
        borderRight: `${selected ? 2 : 1}px solid ${selected ? c.grab : c.border}`,
        borderBottom: `${selected ? 2 : 1}px solid ${selected ? c.grab : c.border}`,
        borderLeft: `3px solid ${typeColor}`,
        borderRadius: 8,
        cursor: "pointer",
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: 3,
          background: selected ? c.grab : "white",
          border: selected ? "none" : `1.5px solid ${c.border}`,
          color: "white",
          fontSize: 9,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 3,
        }}
      >
        {selected ? "✓" : ""}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, color: c.text, lineHeight: 1.4, fontWeight: 500, marginBottom: 6 }}>
          {signal.title}
        </p>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
          {signal.sector && (
            <span style={{ fontSize: 9, padding: "1px 6px", background: c.grabLight, borderRadius: 3, color: c.grabDark, fontWeight: 500 }}>
              {signal.sector}
            </span>
          )}
          {signal.company && (
            <span style={{ fontSize: 9, padding: "1px 6px", background: c.alt, borderRadius: 3, color: c.sub, fontWeight: 500 }}>
              {signal.company}
            </span>
          )}
          {signal.markets && (
            <span style={{ fontSize: 9, padding: "1px 6px", background: c.alt, borderRadius: 3, color: c.sub, fontWeight: 500 }}>
              {signal.markets}
            </span>
          )}
          {signal.type && (
            <span style={{ fontSize: 9, padding: "1px 6px", background: typeColor === c.red ? c.redBg : typeColor === c.teal ? c.tealBg : c.amberBg, borderRadius: 3, color: typeColor === c.red ? c.redText : typeColor === c.teal ? c.tealText : c.amberText, fontWeight: 500 }}>
              {signal.type}
            </span>
          )}
          {formattedDate && (
            <span style={{ fontSize: 9, color: c.muted, marginLeft: "auto" }}>
              {formattedDate}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ============================================================
   SAVED SUB-TAB — user's saved hypothesis library
   ============================================================ */

function SavedSubTab({
  savedHypotheses,
  onOpenDetail,
  onDuplicateToTop3,
  onUnsave,
}: {
  savedHypotheses: any[];
  onOpenDetail: (hyp: any) => void;
  onDuplicateToTop3: (hyp: any) => Promise<void>;
  onUnsave: (hypId: string) => Promise<void>;
}) {
  if (!savedHypotheses || savedHypotheses.length === 0) {
    return (
      <div style={{ padding: 60, textAlign: "center", background: c.card, border: `1px solid ${c.border}`, borderRadius: 14 }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🔖</div>
        <p style={{ fontSize: 14, fontWeight: 500, color: c.text, marginBottom: 6 }}>
          Your Saved library is empty
        </p>
        <p style={{ fontSize: 12, color: c.sub, maxWidth: 400, margin: "0 auto" }}>
          Save hypotheses from Scouted or Generate to keep them handy without adding to your Top 3 workset. They'll appear here for future reference.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 11, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500, marginBottom: 4 }}>
          Your Saved library ({savedHypotheses.length})
        </p>
        <p style={{ fontSize: 12, color: c.sub }}>
          Hypotheses you've bookmarked. Move any to your Top 3 workset to run Impact, Bets, and Pilot analysis.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 12 }}>
        {savedHypotheses.map((h) => (
          <SavedCard
            key={h.id}
            hyp={h}
            onInspect={() => onOpenDetail(h)}
            onDuplicateToTop3={() => onDuplicateToTop3(h)}
            onUnsave={() => onUnsave(h.id)}
          />
        ))}
      </div>
    </div>
  );
}

function SavedCard({
  hyp,
  onInspect,
  onDuplicateToTop3,
  onUnsave,
}: {
  hyp: any;
  onInspect: () => void;
  onDuplicateToTop3: () => Promise<void>;
  onUnsave: () => Promise<void>;
}) {
  const framingType = (hyp.framing_type || '').toLowerCase();
  const framingColor =
    framingType === "defensive" ? c.red :
    framingType === "offensive" ? c.teal :
    framingType === "convergence" ? c.amber : c.muted;
  const framingBg =
    framingType === "defensive" ? c.redBg :
    framingType === "offensive" ? c.tealBg :
    framingType === "convergence" ? c.amberBg : c.alt;
  const framingText =
    framingType === "defensive" ? c.redText :
    framingType === "offensive" ? c.tealText :
    framingType === "convergence" ? c.amberText : c.sub;

  const thesisSnippet = (hyp.thesis || '').trim() || '[Thesis pending]';
  const displayThesis = thesisSnippet.length > 180 ? thesisSnippet.slice(0, 177) + '…' : thesisSnippet;

  const [busy, setBusy] = useState<null | "top3" | "unsave">(null);
  const [top3Done, setTop3Done] = useState(false);

  const handleTop3 = async () => {
    setBusy("top3");
    try {
      await onDuplicateToTop3();
      setTop3Done(true);
    } catch (e: any) {
      alert("Failed: " + e.message);
    } finally {
      setBusy(null);
    }
  };

  const handleUnsave = async () => {
    if (!confirm(`Remove "${hyp.short_name}" from your Saved library?`)) return;
    setBusy("unsave");
    try {
      await onUnsave();
    } catch (e: any) {
      alert("Failed: " + e.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div
      style={{
        background: c.card,
        borderTop: `1px solid ${c.border}`,
        borderRight: `1px solid ${c.border}`,
        borderBottom: `1px solid ${c.border}`,
        borderLeft: `4px solid ${framingColor}`,
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minHeight: 200,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {hyp.framing_type ? (
          <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: framingBg, color: framingText, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {hyp.framing_type}
          </span>
        ) : (
          <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: c.alt, color: c.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Pending
          </span>
        )}
        {hyp.is_in_top3 && (
          <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: c.grabLight, color: c.grabDark, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginLeft: "auto" }}>
            In Top 3
          </span>
        )}
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 500, color: c.text, lineHeight: 1.3 }}>
        {hyp.short_name}
      </h3>

      <p
        style={{
          fontSize: 12,
          color: c.sub,
          lineHeight: 1.55,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          fontStyle: hyp.thesis ? "normal" : "italic",
        }}
      >
                {displayThesis}
      </p>

      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: "auto", paddingTop: 8 }}>
        {hyp.sector && (
          <span style={{ fontSize: 9, padding: "2px 6px", background: c.grabLight, color: c.grabDark, borderRadius: 3, fontWeight: 500 }}>
            {hyp.sector}
          </span>
        )}
        {hyp.competitor && (
          <span style={{ fontSize: 9, padding: "2px 6px", background: c.alt, color: c.sub, borderRadius: 3, fontWeight: 500 }}>
            vs {hyp.competitor}
          </span>
        )}
        {hyp.markets && (
          <span style={{ fontSize: 9, padding: "2px 6px", background: c.alt, color: c.sub, borderRadius: 3, fontWeight: 500 }}>
            {hyp.markets}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
        <button
          onClick={onInspect}
          style={{
            flex: 1,
            padding: "8px",
            background: "transparent",
            border: `1px solid ${c.border}`,
            borderRadius: 6,
            color: c.sub,
            fontSize: 11,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Explore
        </button>
        <button
          onClick={handleUnsave}
          disabled={busy !== null}
          style={{
            flex: 1,
            padding: "8px",
            background: "transparent",
            border: `1px solid ${c.border}`,
            borderRadius: 6,
            color: c.sub,
            fontSize: 11,
            fontWeight: 500,
            cursor: busy ? "not-allowed" : "pointer",
          }}
        >
          {busy === "unsave" ? "..." : "🗑 Remove"}
        </button>
        <button
          onClick={handleTop3}
          disabled={top3Done || busy !== null || hyp.is_in_top3}
          title={hyp.is_in_top3 || top3Done ? "Already in Top 3" : "Duplicate this hypothesis into your Top 3 workset"}
          style={{
            flex: 1.4,
            padding: "8px",
            background: top3Done || hyp.is_in_top3 ? c.grabDark : c.grab,
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 500,
            cursor: top3Done || busy || hyp.is_in_top3 ? "default" : "pointer",
          }}
        >
          {busy === "top3" ? "..." : top3Done || hyp.is_in_top3 ? "✓ In Top 3" : "Move to Top 3 →"}
        </button>
      </div>
    </div>
  );
}



function Top3Workset({
  top3,
  onGoToGenerate,
  onOpenSlot,
  onRemove,
  onSetActive,
}: {
  top3: (any | null)[];
  onGoToGenerate: () => void;
  onOpenSlot: (hyp: any) => void;
  onRemove: (hypId: string) => void;
  onSetActive: (hypId: string) => void;
}) {
  return (
    <div
      style={{
        background: c.card,
        borderRadius: 16,
        padding: "22px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(0,0,0,0.08)",
        border: `1px solid ${c.border}`,
      }}
    >
      {/* Header with clear hierarchy */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: `linear-gradient(135deg, ${c.grab}, ${c.grabDark})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                boxShadow: `0 2px 8px ${c.grab}40`,
              }}
            >
              🏆
            </div>
            <h2
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: c.text,
                letterSpacing: "-0.01em",
              }}
            >
              Your Top 3 workset
            </h2>
          </div>
          <p style={{ fontSize: 12.5, color: c.sub, lineHeight: 1.5, marginLeft: 42 }}>
            The hypotheses you're actively investigating. Impact, Bets, and Pilot tabs run on your Active hypothesis.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {top3.map((h, i) => (
          <Top3Slot
            key={i}
            slot={i + 1}
            hyp={h}
            onGoToGenerate={onGoToGenerate}
            onOpenSlot={onOpenSlot}
            onRemove={onRemove}
            onSetActive={onSetActive}
          />
        ))}
      </div>
    </div>
  );
}

function Top3Slot({
  slot,
  hyp,
  onGoToGenerate,
  onOpenSlot,
  onRemove,
  onSetActive,
}: {
  slot: number;
  hyp: any | null;
  onGoToGenerate: () => void;
  onOpenSlot: (hyp: any) => void;
  onRemove: (hypId: string) => void;
  onSetActive: (hypId: string) => void;
}) {
  if (!hyp) {
    return (
      <button
        onClick={onGoToGenerate}
        style={{
          padding: "20px 14px",
          background: c.alt,
          border: `1.5px dashed ${c.border}`,
          borderRadius: 12,
          textAlign: "center",
          cursor: "pointer",
          minHeight: 220,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = c.scout;
          e.currentTarget.style.background = c.scoutXLight;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = c.border;
          e.currentTarget.style.background = c.alt;
        }}
      >
        <span style={{ fontSize: 22, color: c.muted }}>+</span>
        <span style={{ fontSize: 11, color: c.muted, fontWeight: 500 }}>
          Slot {slot} — add a hypothesis
        </span>
      </button>
    );
  }

  const isActive = hyp.is_active;
  const framingType = (hyp.framing_type || '').toLowerCase();
  const framingColor =
    framingType === "defensive" ? c.red :
    framingType === "offensive" ? c.teal :
    framingType === "convergence" ? c.amber : c.muted;
  const framingBg =
    framingType === "defensive" ? c.redBg :
    framingType === "offensive" ? c.tealBg :
    framingType === "convergence" ? c.amberBg : c.alt;
  const framingText =
    framingType === "defensive" ? c.redText :
    framingType === "offensive" ? c.tealText :
    framingType === "convergence" ? c.amberText : c.sub;

  // Thesis snippet (same pattern as Scouted cards)
  const thesisSnippet = (hyp.thesis || '').trim();
  const displayThesis = thesisSnippet.length > 160
    ? thesisSnippet.slice(0, 157) + '…'
    : thesisSnippet;

  return (
    <div
      style={{
        position: "relative",
        padding: "14px 16px",
        background: isActive ? c.grabXLight : "white",
        boxShadow: isActive
          ? `0 0 0 2px ${c.grab}, 0 6px 16px ${c.grab}25, 0 1px 3px rgba(0,0,0,0.05)`
          : `0 1px 2px rgba(0,0,0,0.04), 0 4px 12px -6px rgba(0,0,0,0.08)`,
        border: isActive ? "none" : `1px solid ${c.border}`,
        borderRadius: 12,
        minHeight: 220,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Top row: Active/Set Active pill + slot + remove */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {isActive ? (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 9px",
              background: c.grab,
              color: "white",
              borderRadius: 5,
              fontSize: 9,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              boxShadow: `0 2px 6px ${c.grab}40`,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "white",
                animation: "pulse 1.6s ease-in-out infinite",
              }}
            />
            Active
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetActive(hyp.id);
            }}
            title="Make this hypothesis Active — Impact, Bets, Pilot will use it"
            style={{
              padding: "3px 9px",
              background: "white",
              border: `1px solid ${c.grab}`,
              color: c.grabDark,
              borderRadius: 5,
              fontSize: 9,
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = c.grab;
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.color = c.grabDark;
            }}
          >
            Set Active
          </button>
        )}
        <span
          style={{
            fontSize: 10,
            color: c.muted,
            fontWeight: 500,
          }}
        >
          #{slot}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Remove "${hyp.short_name}" from Top 3?`)) {
              onRemove(hyp.id);
            }
          }}
          title="Remove from Top 3"
          style={{
            marginLeft: "auto",
            width: 20,
            height: 20,
            borderRadius: 5,
            background: "transparent",
            border: "none",
            color: c.muted,
            fontSize: 14,
            fontWeight: 400,
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = c.alt;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          ×
        </button>
      </div>

      {/* Category tags row: sector + framing */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {hyp.sector ? (
          <span
            style={{
              fontSize: 9,
              padding: "2px 7px",
              borderRadius: 4,
              background: c.grabLight,
              color: c.grabDark,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {hyp.sector}
          </span>
        ) : (
          <span
            style={{
              fontSize: 9,
              padding: "2px 7px",
              borderRadius: 4,
              background: c.alt,
              color: c.muted,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              fontStyle: "italic",
            }}
          >
            Sector TBD
          </span>
        )}
        {hyp.framing_type && (
          <span
            style={{
              fontSize: 9,
              padding: "2px 7px",
              borderRadius: 4,
              background: framingBg,
              color: framingText,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {hyp.framing_type}
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: c.text,
          lineHeight: 1.3,
          letterSpacing: "-0.005em",
        }}
      >
        {hyp.short_name}
      </h3>

      {/* Thesis snippet */}
      <p
        style={{
          fontSize: 11.5,
          color: c.sub,
          lineHeight: 1.55,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          fontStyle: displayThesis ? "normal" : "italic",
          flex: 1,
        }}
      >
        {displayThesis || 'Thesis not yet drafted.'}
      </p>

      {/* Bottom: single Explore button */}
        <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenSlot(hyp);
        }}
        title="Open full hypothesis detail"
        style={{
          padding: "9px 12px",
          background: isActive ? "white" : "transparent",
          border: `1px solid ${isActive ? c.grab : c.border}`,
          color: isActive ? c.grabDark : c.sub,
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          transition: "all 0.15s",
          marginTop: "auto",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = c.scout;
          e.currentTarget.style.color = c.scoutDark;
          e.currentTarget.style.background = c.scoutXLight;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = isActive ? c.grab : c.border;
          e.currentTarget.style.color = isActive ? c.grabDark : c.sub;
          e.currentTarget.style.background = isActive ? "white" : "transparent";
        }}
      >
        Explore →
      </button>
    </div>
  );
}

/* ============================================================
   SCOUTED SUB-TAB — pre-generated hypothesis cards
   ============================================================ */

function ScoutedSubTab({
  scoutedHypotheses,
  onOpenDetail,
  onAddToTop3,
  onSave,
}: {
  scoutedHypotheses: any[];
  onOpenDetail: (hyp: any) => void;
  onAddToTop3: (hypId: string) => void;
  onSave: (hypId: string) => void;
}) {
  if (!scoutedHypotheses || scoutedHypotheses.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center", background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, color: c.muted }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🔭</div>
        <p style={{ fontSize: 14, fontWeight: 500, color: c.text, marginBottom: 4 }}>No scouted hypotheses yet</p>
        <p style={{ fontSize: 12 }}>Scout will surface pre-generated hypotheses here as they're reviewed.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 11, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500, marginBottom: 4 }}>
          Scout's picks for the week
        </p>
        <p style={{ fontSize: 12, color: c.sub }}>
          Framer pre-generated these {scoutedHypotheses.length} hypotheses from this week's signal batch. Inspect any card to see the strategic breakdown, then save or promote to your Top 3.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 12 }}>
        {scoutedHypotheses.map((h) => (
          <ScoutedCard
            key={h.id}
            hyp={h}
            onInspect={() => onOpenDetail(h)}
            onAddToTop3={() => onAddToTop3(h.id)}
            onSave={() => onSave(h.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ScoutedCard({
  hyp,
  onInspect,
  onAddToTop3,
  onSave,
}: {
  hyp: any;
  onInspect: () => void;
  onAddToTop3: () => void;
  onSave: () => void;
}) {
  const framingType = (hyp.framing_type || '').toLowerCase();
  const framingColor =
    framingType === "defensive" ? c.red :
    framingType === "offensive" ? c.teal :
    framingType === "convergence" ? c.amber : c.muted;
  const framingBg =
    framingType === "defensive" ? c.redBg :
    framingType === "offensive" ? c.tealBg :
    framingType === "convergence" ? c.amberBg : c.alt;
  const framingText =
    framingType === "defensive" ? c.redText :
    framingType === "offensive" ? c.tealText :
    framingType === "convergence" ? c.amberText : c.sub;

  const thesisSnippet = (hyp.thesis || '').trim() || '[Thesis pending]';
  const displayThesis = thesisSnippet.length > 180 ? thesisSnippet.slice(0, 177) + '…' : thesisSnippet;

  const [savedDone, setSavedDone] = useState(false);
  const [top3Done, setTop3Done] = useState(false);
  const [busy, setBusy] = useState<null | "save" | "top3">(null);

  const handleSave = async () => {
    setBusy("save");
    try {
      await onSave();
      setSavedDone(true);
    } catch (e: any) {
      alert("Failed to save: " + e.message);
    } finally {
      setBusy(null);
    }
  };

  const handleTop3 = async () => {
    setBusy("top3");
    try {
      await onAddToTop3();
      setTop3Done(true);
    } catch (e: any) {
      alert("Failed: " + e.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div
      style={{
        background: c.card,
        borderTop: `1px solid ${c.border}`,
        borderRight: `1px solid ${c.border}`,
        borderBottom: `1px solid ${c.border}`,
        borderLeft: `4px solid ${framingColor}`,
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minHeight: 200,
      }}
    >
      {/* Framing badge row */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {hyp.framing_type ? (
          <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: framingBg, color: framingText, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {hyp.framing_type}
          </span>
        ) : (
          <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: c.alt, color: c.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Pending
          </span>
        )}
        {hyp.rank && (
          <span style={{ fontSize: 9, color: c.muted, fontWeight: 500 }}>
            #{hyp.rank}
          </span>
        )}
        {hyp.is_in_top3 && (
          <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: c.grabLight, color: c.grabDark, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginLeft: "auto" }}>
            In Top 3
          </span>
        )}
      </div>

      {/* Name */}
      <h3 style={{ fontSize: 15, fontWeight: 500, color: c.text, lineHeight: 1.3 }}>
        {hyp.short_name}
      </h3>

      {/* Thesis snippet */}
      <p
        style={{
          fontSize: 12,
          color: c.sub,
          lineHeight: 1.55,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          fontStyle: hyp.thesis ? "normal" : "italic",
        }}
      >
        {displayThesis}
      </p>

      {/* Tag row */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: "auto", paddingTop: 8 }}>
        {hyp.sector && (
          <span style={{ fontSize: 9, padding: "2px 6px", background: c.grabLight, color: c.grabDark, borderRadius: 3, fontWeight: 500 }}>
            {hyp.sector}
          </span>
        )}
        {hyp.competitor && (
          <span style={{ fontSize: 9, padding: "2px 6px", background: c.alt, color: c.sub, borderRadius: 3, fontWeight: 500 }}>
            vs {hyp.competitor}
          </span>
        )}
        {hyp.markets && (
          <span style={{ fontSize: 9, padding: "2px 6px", background: c.alt, color: c.sub, borderRadius: 3, fontWeight: 500 }}>
            {hyp.markets}
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                {(hyp.framer_stage_1 || hyp.framer_stage_2 || hyp.framer_stage_3 || hyp.framer_stage_4_rationale) && (
          <button
            onClick={onInspect}
            style={{
              flex: 1,
              padding: "8px",
              background: "transparent",
              border: `1px solid ${c.border}`,
              borderRadius: 6,
              color: c.sub,
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Explore
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={savedDone || busy !== null || hyp.is_saved}
          title={hyp.is_saved || savedDone ? "Already saved" : "Add to Saved library"}
          style={{
            flex: 1,
            padding: "8px",
            background: savedDone || hyp.is_saved ? c.scoutLight : "transparent",
            border: `1px solid ${savedDone || hyp.is_saved ? c.scout : c.border}`,
            borderRadius: 6,
            color: savedDone || hyp.is_saved ? c.scoutDark : c.sub,
            fontSize: 11,
            fontWeight: 500,
            cursor: savedDone || busy || hyp.is_saved ? "default" : "pointer",
          }}
        >
          {busy === "save" ? "..." : savedDone || hyp.is_saved ? "✓ Saved" : "🔖 Save"}
        </button>
        <button
          onClick={handleTop3}
          disabled={top3Done || busy !== null || hyp.is_in_top3}
          title={hyp.is_in_top3 || top3Done ? "Already in Top 3" : "Add to Top 3 workset"}
          style={{
            flex: 1.4,
            padding: "8px",
            background: top3Done || hyp.is_in_top3 ? c.grabDark : c.grab,
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 500,
            cursor: top3Done || busy || hyp.is_in_top3 ? "default" : "pointer",
          }}
        >
          {busy === "top3" ? "..." : top3Done || hyp.is_in_top3 ? "✓ In Top 3" : "Add to Top 3 →"}
        </button>
      </div>
    </div>
  );
}
function ScoutedDetailDrawer({
  hyp,
  goals,
  drivers,
  signals,
  onClose,
  onAddToTop3,
  onSetActiveFromDrawer,
}: {
  hyp: any | null;
  goals: any[];
  drivers: any[];
  signals: any[];
  onClose: () => void;
  onAddToTop3: () => void;
  onSetActiveFromDrawer?: (hypId: string) => void;
}) {
  if (!hyp) return null;

  // Resolve goal name from goal_id (case-insensitive + trim)
  const goalIdRaw = (hyp.primary_goal || '').trim();
  const goalIdLower = goalIdRaw.toLowerCase();
  const goal =
    goals.find((g) => (g.goal_id || '').trim().toLowerCase() === goalIdLower) ||
    goals.find((g) => (g.goal_id || '').trim().toLowerCase().includes(goalIdLower));
  const goalName = goal?.goal_name || goalIdRaw || "—";

  // Resolve drivers from comma-separated IDs
  const driverIds = (hyp.load_bearing_drivers || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);
  const driverDetails = driverIds
    .map((did: string) => {
      const norm = did.toLowerCase();
      return drivers.find((d) => (d.driver_id || '').trim().toLowerCase() === norm);
    })
    .filter(Boolean);

  const framingType = (hyp.framing_type || '').toLowerCase();
  const framingColor =
    framingType === "defensive" ? c.red :
    framingType === "offensive" ? c.teal :
    framingType === "convergence" ? c.amber : c.muted;
  const framingBg =
    framingType === "defensive" ? c.redBg :
    framingType === "offensive" ? c.tealBg :
    framingType === "convergence" ? c.amberBg : c.alt;
  const framingText =
    framingType === "defensive" ? c.redText :
    framingType === "offensive" ? c.tealText :
    framingType === "convergence" ? c.amberText : c.sub;

  // Signals were joined with " | " when saving — split on that, not comma
const signalsUsedList = (hyp.signals_used || '')
  .split(/\s*\|\s*/)
  .map((s: string) => s.trim())
  .filter(Boolean);

// Look up each signal by title to get its URL for clickable links
const signalsUsedWithUrls = signalsUsedList.map((title: string) => {
  const match = signals?.find((s: any) => (s.title || '').trim() === title);
  return { title, url: match?.url || null, date: match?.date || null, source: match?.source || null };
});

    const placeholder = "[Not yet documented]";

  const inTop3 = hyp.is_in_top3;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 999,
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(680px, 90vw)",
          background: c.bg,
          overflowY: "auto",
          animation: "slideInRight 0.3s ease-out",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${c.border}`, background: c.card, position: "sticky", top: 0, zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>
                Hypothesis detail
              </span>
              {hyp.framing_type && (
                <span style={{ fontSize: 9, padding: "2px 8px", background: framingBg, color: framingText, borderRadius: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {hyp.framing_type}
                </span>
              )}
              {inTop3 && (
                <span style={{ fontSize: 9, padding: "2px 8px", background: c.grabLight, color: c.grabDark, borderRadius: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  In Top 3
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              style={{ background: "transparent", border: "none", fontSize: 20, color: c.muted, cursor: "pointer", padding: 0, lineHeight: 1 }}
            >
              ×
            </button>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 500, color: c.text, lineHeight: 1.25, marginBottom: 10 }}>
            {hyp.short_name || "(no name)"}
          </h2>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {hyp.sector && (
              <span style={{ fontSize: 10, padding: "3px 8px", background: c.grabLight, color: c.grabDark, borderRadius: 4, fontWeight: 500 }}>
                {hyp.sector}
              </span>
            )}
            {hyp.competitor && (
              <span style={{ fontSize: 10, padding: "3px 8px", background: c.alt, color: c.sub, borderRadius: 4, fontWeight: 500 }}>
                vs {hyp.competitor}
              </span>
            )}
            {hyp.markets && (
              <span style={{ fontSize: 10, padding: "3px 8px", background: c.alt, color: c.sub, borderRadius: 4, fontWeight: 500 }}>
                {hyp.markets}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
                            {/* NEW: Signals used - clickable cards */}
          {signalsUsedWithUrls.length > 0 && (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
      <span style={{ fontSize: 10, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>
        Signals used ({signalsUsedWithUrls.length})
      </span>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {signalsUsedWithUrls.map((s: any, i: number) => {
        const hasUrl = Boolean(s.url);
        const Tag: any = hasUrl ? "a" : "div";
        const linkProps = hasUrl
          ? { href: s.url, target: "_blank", rel: "noopener noreferrer" }
          : {};
        return (
          <Tag
            key={i}
            {...linkProps}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              padding: "10px 12px",
              background: hasUrl ? c.card : c.alt,
              border: hasUrl ? `1px solid ${c.border}` : "none",
              borderRadius: 8,
              textDecoration: "none",
              color: c.text,
            }}
          >
            <span style={{ fontSize: 12, color: hasUrl ? c.scout : c.muted, flexShrink: 0, marginTop: 2 }}>
              {hasUrl ? "↗" : "📎"}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, color: c.text, lineHeight: 1.4, fontWeight: 500, marginBottom: 3 }}>
                {s.title}
              </p>
              {hasUrl && (
                <p style={{ fontSize: 10, color: c.muted }}>
                  {s.source}
                  {s.date ? ` · ${s.date}` : ""}
                </p>
              )}
            </div>
          </Tag>
        );
      })}
    </div>
  </div>
)}
        
          {/* Thesis */}
          <div>
            <p style={{ fontSize: 10, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500, marginBottom: 6 }}>
              Thesis
            </p>
            <p style={{ fontSize: 14, color: c.text, lineHeight: 1.65 }}>
              {hyp.thesis || placeholder}
            </p>
          </div>

          {/* Goal + drivers row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
            <div style={{ padding: "10px 12px", background: c.grabXLight, border: `1px solid ${c.grab}`, borderRadius: 8 }}>
              <p style={{ fontSize: 9, color: c.grabDark, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500, marginBottom: 3 }}>
                Primary Goal
              </p>
              <p style={{ fontSize: 12, color: c.text, fontWeight: 500 }}>{goalName}</p>
            </div>
          </div>

          {/* Framer stages */}
          <div>
            <p style={{ fontSize: 10, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500, marginBottom: 10 }}>
            Strategic breakdown
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <FramerStageBlock
                num={1}
                label="The pattern"
                content={hyp.framer_stage_1}
                placeholder={placeholder}
              />
                <FramerStageBlock
                num={2}
                label="What's at stake"
                content={hyp.framer_stage_2}
                placeholder={placeholder}
              />
                <FramerStageBlock
  num={3}
  label="Strategic options"
  content={hyp.framer_stage_3}
  placeholder={placeholder}
  pickedFramingType={hyp.framing_type}
/>
                <FramerStageBlock
                num={4}
                label="Why this framing"
                content={hyp.framer_stage_4_rationale}
                placeholder={placeholder}
                highlight
              />
            </div>
          </div>

          {/* Load-bearing drivers */}
          {driverDetails.length > 0 && (
            <div>
              <p style={{ fontSize: 10, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500, marginBottom: 10 }}>
                Load-bearing drivers
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {driverDetails.map((d: any) => (
                  <div key={d.driver_id} style={{ padding: "10px 12px", background: c.alt, borderRadius: 8, border: `1px solid ${c.border}` }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: c.text, marginBottom: 3 }}>
                      {d.driver_name}
                    </p>
                    <p style={{ fontSize: 11, color: c.sub, lineHeight: 1.5 }}>
                      {d.sensitivity_note || "No sensitivity note"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
               {!inTop3 && (
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${c.border}`, background: c.card, position: "sticky", bottom: 0 }}>
            <button
              onClick={onAddToTop3}
              style={{
                width: "100%",
                padding: "12px",
                background: c.grab,
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Add to Top 3 →
            </button>
          </div>
        )}
        {inTop3 && !hyp.is_active && onSetActiveFromDrawer && (
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${c.border}`, background: c.card, position: "sticky", bottom: 0 }}>
            <button
              onClick={() => onSetActiveFromDrawer(hyp.id)}
              style={{
                width: "100%",
                padding: "12px",
                background: c.grabDark,
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              ✓ Promote to Active — flows into Impact / Bets / Pilot
            </button>
          </div>
        )}
        {inTop3 && hyp.is_active && (
          <div style={{ padding: "12px 24px", borderTop: `1px solid ${c.border}`, background: c.grabLight, position: "sticky", bottom: 0, textAlign: "center", fontSize: 12, color: c.grabDark, fontWeight: 500 }}>
            ✓ This is your Active hypothesis — Impact, Bets, Pilot run on it
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}

function FramerStageBlock({
  num,
  label,
  content,
  placeholder,
  pickedFramingType,
  highlight,
}: {
  num: number;
  label: string;
  content: string;
  placeholder: string;
  pickedFramingType?: string;
  highlight?: boolean;
}) {
  const isEmpty = !content || !content.trim();

  // Stage 3 special case: parse JSON framings and render as cards
  const isStage3 = num === 3;
  let framings: any[] | null = null;
  if (isStage3 && !isEmpty) {
    try {
      const cleaned = content.replace(/```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.framings && Array.isArray(parsed.framings)) {
        framings = parsed.framings;
      }
    } catch {
      // fall through to plain text render
    }
  }

  // Split prose into paragraphs (double newline OR single if long paragraph)
  const paragraphs = !isEmpty && !framings
    ? content.split(/\n\n+/).map(p => p.trim()).filter(Boolean)
    : [];

  return (
    <div
      style={{
        padding: "12px 14px",
        background: highlight ? c.scoutXLight : c.alt,
        border: `1px solid ${highlight ? c.scout : c.border}`,
        borderRadius: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: highlight ? c.scout : c.grab,
            color: "white",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 500,
          }}
        >
          {num}
        </span>
        <span style={{ fontSize: 11, fontWeight: 500, color: c.text }}>{label}</span>
      </div>

      {/* Empty state */}
      {isEmpty && (
        <p style={{ fontSize: 12, color: c.muted, lineHeight: 1.6, fontStyle: "italic", paddingLeft: 24 }}>
          {placeholder}
        </p>
      )}

      {/* Stage 3: render framings as 3 cards */}
      {framings && (
        <div style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
          {framings.map((f, i) => {
            const t = (f.type || '').toLowerCase();
            const isPicked = pickedFramingType && t === (pickedFramingType || '').toLowerCase();
            const borderColor = t === "defensive" ? c.red : t === "offensive" ? c.teal : c.amber;
            const bg = t === "defensive" ? c.redBg : t === "offensive" ? c.tealBg : c.amberBg;
            const txt = t === "defensive" ? c.redText : t === "offensive" ? c.tealText : c.amberText;
            return (
              <div
                key={i}
                style={{
                  padding: "10px 12px",
                  background: "white",
                  borderTop: `1px solid ${c.border}`,
                  borderRight: `1px solid ${c.border}`,
                  borderBottom: `1px solid ${c.border}`,
                  borderLeft: `4px solid ${borderColor}`,
                  borderRadius: 8,
                  position: "relative",
                  outline: isPicked ? `2px solid ${c.grab}` : "none",
                  outlineOffset: isPicked ? -2 : 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 9, padding: "2px 6px", background: bg, color: txt, borderRadius: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {f.type}
                  </span>
                  {isPicked && (
                    <span style={{ fontSize: 9, padding: "2px 6px", background: c.grab, color: "white", borderRadius: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      ✓ Picked
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, fontWeight: 500, color: c.text, lineHeight: 1.35, marginBottom: 4 }}>
                  {clean(f.name || '')}
                </p>
                <p style={{ fontSize: 11, color: c.sub, lineHeight: 1.55, marginBottom: 6 }}>
                  {f.summary}
                </p>
                <p style={{ fontSize: 11, color: c.muted, lineHeight: 1.55, paddingTop: 6, borderTop: `1px solid ${c.border}` }}>
                  {clean(f.rationale || '')}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Stages 1, 2, 4: render as paragraphs */}
      {!framings && !isEmpty && (
        <div style={{ paddingLeft: 24 }}>
          {paragraphs.length > 0 ? (
            paragraphs.map((para, i) => (
              <p
                key={i}
                style={{
                  fontSize: 12,
                  color: c.text,
                  lineHeight: 1.65,
                  marginBottom: i < paragraphs.length - 1 ? 10 : 0,
                }}
              >
                {para}
              </p>
            ))
          ) : (
            <p style={{ fontSize: 12, color: c.text, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
              {content}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   COMING SOON PLACEHOLDER
   ============================================================ */

function ComingSoon({ tab }: { tab: string }) {
  return (
    <div
      style={{
        background: c.card,
        border: `1px dashed ${c.border}`,
        borderRadius: 16,
        padding: "80px 40px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 16,
          background: c.alt,
          margin: "0 auto 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
        }}
      >
        🚧
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 500, color: c.text, marginBottom: 8 }}>
        {tab} tab is being built
      </h2>
      <p style={{ fontSize: 13, color: c.sub, maxWidth: 400, margin: "0 auto" }}>
        Check back soon. In the meantime, use Signals to explore competitive intelligence
        and Impact to see how a hypothesis maps to Grab's stated 2026 goals.
      </p>
    </div>
  );
}

/* ============================================================
   MAIN SCOUT PAGE
   ============================================================ */

export default function ScoutPage() {
  const scoutData = useScoutData();
  const [generateState, setGenerateState] = useState<GenerateState>(initialGenerateState);
  const [signalsSubTab, setSignalsSubTab] = useState<SignalsSubTab>("scouted");
  const [drawerHyp, setDrawerHyp] = useState<any | null>(null);
  const addToTop3 = async (hypId: string) => {
  const emptyIndex = scoutData.top3.findIndex((h: any) => h === null);
    if (emptyIndex === -1) {
      alert("Top 3 is full. Remove one first.");
      return;
    }
    try {
      const res = await fetch("/api/hypothesis-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addToTop3",
          hypId,
          slot: emptyIndex + 1,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      scoutData.refetch();
      setDrawerHyp(null);
    } catch (err: any) {
      alert("Failed to add to Top 3: " + err.message);
    }
  };

  const persistGeneratedHypothesis = async (hyp: any, action: "top3" | "saved") => {
    let slot = null;
       if (action === "top3") {
      const emptyIndex = scoutData.top3.findIndex((h: any) => h === null);
      if (emptyIndex === -1) {
        throw new Error("Top 3 is full. Remove one first.");
      }
      slot = emptyIndex + 1;
    }
    const res = await fetch("/api/save-generated-hypothesis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hypothesis: hyp, action, slot }),
    });
    if (!res.ok) throw new Error(await res.text());
    scoutData.refetch();
  };

  const saveScoutedHypothesis = async (hypId: string) => {
    try {
      const res = await fetch("/api/hypothesis-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", hypId }),
      });
      if (!res.ok) throw new Error(await res.text());
      scoutData.refetch();
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    }
  };

  const removeFromTop3 = async (hypId: string) => {
    try {
      const res = await fetch("/api/hypothesis-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "removeFromTop3", hypId }),
      });
      if (!res.ok) throw new Error(await res.text());
      scoutData.refetch();
      setDrawerHyp(null);
    } catch (err: any) {
      alert("Failed to remove: " + err.message);
    }
  };

  const setActiveHypothesis = async (hypId: string) => {
    try {
      const res = await fetch("/api/hypothesis-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setActive", hypId }),
      });
      if (!res.ok) throw new Error(await res.text());
      scoutData.refetch();
    } catch (err: any) {
      alert("Failed to set active: " + err.message);
    }
  };


    const unsaveHypothesis = async (hypId: string) => {
    try {
      const res = await fetch("/api/hypothesis-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unsave", hypId }),
      });
      if (!res.ok) throw new Error(await res.text());
      scoutData.refetch();
    } catch (err: any) {
      alert("Failed to remove from Saved: " + err.message);
    }
  };

  const duplicateSavedToTop3 = async (hyp: any) => {
    const emptyIndex = scoutData.top3.findIndex((h: any) => h === null);
    if (emptyIndex === -1) {
      alert("Top 3 is full. Remove one first.");
      return;
    }
    try {
      const res = await fetch("/api/save-generated-hypothesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hypothesis: {
            short_name: hyp.short_name,
            thesis: hyp.thesis,
            framer_stage_1: hyp.framer_stage_1,
            framer_stage_2: hyp.framer_stage_2,
            framer_stage_3: hyp.framer_stage_3,
            framer_stage_4_rationale: hyp.framer_stage_4_rationale,
            framing_type: hyp.framing_type,
            signals_used: hyp.signals_used,
            competitor: hyp.competitor,
            sector: hyp.sector,
            markets: hyp.markets,
          },
          action: "top3",
          slot: emptyIndex + 1,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      scoutData.refetch();
    } catch (err: any) {
      alert("Failed to duplicate to Top 3: " + err.message);
    }
  };
    
  const [activeTab, setActiveTab] = useState<TabId>("signals");
      const hyp = useMemo(() => {
    if (!scoutData.activeHypothesis) return MOCK_HYPOTHESIS;
    const a = scoutData.activeHypothesis;

    const parseJSON = <T,>(str: string | undefined, fallback: T): T => {
      if (!str || typeof str !== 'string') return fallback;
      try { return JSON.parse(str) as T; } catch { return fallback; }
    };

    const arithmeticRows = parseJSON<any[]>(a.arithmetic, []);
    const rollupSteps = parseJSON<any[]>(a.rollup, []);

    // Split newline-separated blocks
    const splitBlocks = (str: string | undefined): string[] => {
      if (!str) return [];
      return str.split(/\n\n+/).map(s => s.trim()).filter(Boolean);
    };

    // ---- Map arithmetic JSON rows into UI arithmetic shape ----
    const uiArithmetic = arithmeticRows.map((row, i) => ({
      label: row.driver || '',
      value: row.delta_usd || '',
      source: row.why || '',
      bet_id: null,
    }));

          // ---- Map rollup JSON steps into UI rollup shape ----
    const uiRollup = rollupSteps.map((step, i) => ({
      label: step.step || step.label || `Step ${i + 1}`,
      before: step.before !== undefined ? step.before : null,
      after: step.after !== undefined ? step.after : null,
      note: step.note || '',
      is_source: i === 0,
    }));

    // ---- Parse secondary goals blocks (format: "GOAL_ID: text") ----
    const secondaryGoalsRaw = splitBlocks(a.secondary_goals_impact);
       const secondaryGoalLabelMap: Record<string, string> = {
      'FS_EBITDA_H2_26': 'FinServ EBITDA breakeven',
      'FS_GLP_EOY_26': 'FinServ GLP by end 26',
      'OD_GMV_H2_26': 'On-Demand GMV growth',
      'GRP_REV_FY26': 'FY26 Group Revenue',
      'GRP_EBITDA_FY26': 'FY26 Group Adj EBITDA',
      'DEL_MARGIN_FY26': 'Deliveries margin FY26',
      'MTU_MOMENTUM': 'Ecosystem MTUs',
    };
    const uiSecondaryGoals = secondaryGoalsRaw.slice(0, 3).map((block, i) => {
      const colonIdx = block.indexOf(':');
      const rawGoalId = colonIdx > 0 ? block.substring(0, colonIdx).trim() : `SECONDARY_${i}`;
      const text = colonIdx > 0 ? block.substring(colonIdx + 1).trim() : block;
      return {
        goal_id: rawGoalId,
        label: secondaryGoalLabelMap[rawGoalId] || rawGoalId.replace(/_/g, ' '),
        metric_label: '',
        value: '',
        value_unit: '',
        bar_percent: 50 + i * 10,
        bar_note: text,
        bet_id: null,
      };
    });

    // ---- Build primary contribution shape from key_metric fields ----
    // MOCK expects: value, percent_of_gap, gap_value, remaining_value, baseline_display, target_display
    const kmValue = a.key_metric_value || '';
    const kmUnit = a.key_metric_unit || '';

        // Parse contribution range like "+$8 to +$12M" → midpoint
    const parseRange = (str: string): { mid: number; low: number; high: number } | null => {
      if (!str) return null;
      const nums = str.match(/-?\$?\d+(?:\.\d+)?/g);
      if (!nums || nums.length === 0) return null;
      const vals = nums.map(n => parseFloat(n.replace(/[\$,]/g, '')));
      if (vals.length === 1) return { mid: vals[0], low: vals[0], high: vals[0] };
      const low = Math.min(...vals);
      const high = Math.max(...vals);
      return { mid: (low + high) / 2, low, high };
    };
    
    const contribParsed = parseRange(kmValue);
        // Gap magnitude by goal — H1 Deliveries has no dollar gap (margin expansion play);
    // FinServ has stated $15M breakeven gap; others fall back to display-only mode.
    const primaryGoalId = a.primary_goal_id || 'finserv_ebitda';
    
    const goalGapConfig: Record<string, { gap: number | null; baseline: string; target: string }> = {
      'finserv_ebitda': { gap: 15, baseline: '-$15M', target: '$0' },
      'deliveries_margin': { gap: null, baseline: '2.3% of GMV', target: 'FY26 expansion' },
      'ondemand_gmv': { gap: null, baseline: '$6.5B/qtr', target: 'Sequential growth' },
      'group_revenue': { gap: null, baseline: '$997M/qtr', target: '$4.10-4.15B FY26' },
      'group_ebitda': { gap: null, baseline: '$168M/qtr', target: '$720-740M FY26' },
      'ecosystem_mtu': { gap: null, baseline: '54M MTUs', target: 'Sustained growth' },
      'ai_margin_lever': { gap: null, baseline: '-50% cost/interaction', target: 'Continued reduction' },
    };
    const goalCfg = goalGapConfig[primaryGoalId] || goalGapConfig['finserv_ebitda'];
    
    const contribMid = contribParsed ? contribParsed.mid : 0;
    const hasNumericGap = goalCfg.gap !== null && goalCfg.gap > 0;
    const percentOfGap = hasNumericGap ? Math.round((contribMid / goalCfg.gap!) * 100) : 0;
    const remainingValue = hasNumericGap ? Math.max(0, goalCfg.gap! - contribMid) : 0;
    
        // Contribution note — dollar gap for FinServ, bps expansion for Deliveries margin, "Direct contribution" fallback
    const contributionNote = (function() {
      if (primaryGoalId === 'deliveries_margin') {
        // Deliveries annualized GMV ≈ $2.6B/qtr × 4 = $10.4B/yr (from Q2 remarks, ~40% of On-Demand)
        const bpsExpansion = Math.round((contribMid / 10400) * 10000);
        return `~${bpsExpansion}bps of Deliveries margin`;
      }
      if (hasNumericGap && percentOfGap > 0) {
        return `${Math.min(percentOfGap, 100)}% of the gap`;
      }
      return 'Direct contribution';
    })();
    const uiPrimaryContribution = {
      value: kmValue || '~$XXX M',
      percent_of_gap: hasNumericGap ? Math.min(percentOfGap, 100) : 0,
      gap_value: hasNumericGap ? `$${goalCfg.gap}M` : goalCfg.target,
      remaining_value: hasNumericGap ? `~$${remainingValue.toFixed(0)}M` : '',
      baseline_display: goalCfg.baseline,
      target_display: goalCfg.target,
      contribution_note: contributionNote,
    };

        // ---- Bets & Pilot: hardcoded per hypothesis until pipeline populates ----
    const shortName = a.short_name || '';
    let uiBets: any[] = [];
    let uiPilot: any = null;

        // ============================================================
    // NEW: H1 / H2 / H3 branches — insert ABOVE the existing
    // 'AMP + Atome Convergence' block. Old branches remain as
    // fallback for any legacy scouted records still active.
    // ============================================================

    if (shortName === 'Uber-Foodpanda Two-Track: Lock or Buy') {
      uiBets = [
        {
          id: 1, rank: 1,
          name: 'Lock top-decile Deliveries into GrabUnlimited + Priority before Uber-Foodpanda ships one app',
          type: 'execution',
          cost_tier: 'M cost', horizon: '9 months', feasibility_score: 8,
          description: 'GrabUnlimited is at 35% of Deliveries GMV with 4x transaction frequency and subscribers +20% YoY. Push another 3-5ppt by locking currently-unattached top-decile users into subscription via GrabAds-funded GrabCoins acquisition loops. Adds ~USD 1M/qtr GU cohort margin uplift plus ~USD 12M/qtr Priority Deliveries premium contribution at MID case.',
          rationale: 'DEL_MARGIN_FY26. Subscription users switch less than promo-hunters during subsidy wars. Locks the highest-value cohort in the 12-18 month Uber-Foodpanda integration window before Uber ships one integrated app with global ads and Cart Builder.',
        },
        {
          id: 2, rank: 2,
          name: 'Ready the Foodpanda SEA acquisition bid at Taiwan 0.33x EV/GMV precedent',
          type: 'financial',
          cost_tier: 'XL cost', horizon: '6-12 months', feasibility_score: 5,
          description: 'Prepare M&A team and due diligence on Foodpanda SEA across 8 markets. At Taiwan\'s 0.33x EV/GMV precedent that Peter Oey already validated, the USD 2.75B midpoint Foodpanda SEA GMV implies a USD 908M acquisition price. Adds USD 77M/yr EBITDA from acquired GMV plus USD 384M/yr cross-sell revenue by 2028 if Scenario B activates.',
          rationale: 'Two-track structure. Runs alongside Bet #1, not instead of it. Contingent on regulators forcing Uber to divest Foodpanda SEA to unwind the 2018 non-compete. Optionality Anthony\'s team should preserve without depending on it.',
        },
        {
          id: 3, rank: 3,
          name: 'Push Priority Deliveries GMV share from 19% to 24% by H2 27',
          type: 'execution',
          cost_tier: 'M cost', horizon: '9 months', feasibility_score: 8,
          description: 'Priority Deliveries hit 19% of Deliveries GMV in Q2 (up from 15%). Every 1ppt lift adds ~15bps Deliveries margin at current contribution economics. Tighten priority-slot merchant match in high-density MY, PH, and ID corridors overlapping Foodpanda\'s 22-35% market share zones.',
          rationale: 'Mix-shift lever within Grab\'s control, unlike GrabUnlimited penetration which is user-adoption bounded. Compounds the top-decile lock-in play because Priority users overlap heavily with the top-decile Deliveries cohort.',
        },
        {
          id: 4, rank: 4,
          name: 'Layer GrabMore bundling and GrabAds-funded GrabCoins into the lock-in mechanic',
          type: 'execution',
          cost_tier: 'S cost', horizon: '6 months', feasibility_score: 9,
          description: 'GrabMore multi-merchant bundling raises basket size on locked-in cohort. GrabAds\' near-100% incremental margin surplus (revenue +50% YoY) funds GrabCoins subsidies for GU conversion. Adds ~SGD 0.3M/qtr GrabAds CPM lift on cohort ad inventory.',
          rationale: 'Lowest-risk highest-feasibility bet. Both products already live; this is monetization tuning not build. The GrabAds surplus is the funding source that keeps the lock-in play cost-neutral to segment margin.',
        },
      ];
      uiPilot = {
        test_hypothesis: 'If we run a top-decile Deliveries lock-in play in the top 3 Klang Valley and Manila corridors for 12 weeks, converting currently-unattached top-decile users into GrabUnlimited plus Priority via GrabAds-funded GrabCoins offers, then 12-week conversion will hit 25%+ on the eligible cohort (versus 12-15% organic baseline), validating platform-wide rollout ahead of Uber-Foodpanda integration close.',
        timeline_weeks: 12,
        cost_usd: 550000,
        decision_rule: 'Roll out platform-wide if 12-week conversion beats 25% with no Deliveries contribution margin compression beyond 20bps. Below 15% conversion, kill and rethink offer structure. Between 15% and 25%, extend by 8 weeks testing incentive stacking (GrabCoins + priority-slot access + GrabAds premium placement).',
        success_metric: {
          metric_name: 'Top-decile Deliveries user → GU + Priority conversion (12-week window, MY + PH pilot cohorts)',
          baseline: '12-15% organic conversion on currently-unattached top-decile',
          success_threshold: '>= 25% conversion (drives 3-5ppt GU GMV share expansion)',
          ambiguous_zone: '15% - 25% (extend pilot, test incentive stacking)',
          kill_threshold: '< 15% conversion or > 20bps Deliveries margin compression',
        },
        risks: [
          {
            risk: 'GrabAds surplus is smaller than modeled, GrabCoins subsidy erodes segment margin',
            mitigation: 'Cap GrabCoins cost per acquired GU sub at USD 8 during pilot. Weekly reconciliation between GrabAds contribution and GrabCoins outflow. Kill switch if cost per acquisition exceeds USD 12 for 2 consecutive weeks.',
          },
          {
            risk: 'Uber-Foodpanda deal closes faster than 18-month base case, shrinking the window',
            mitigation: 'Compress pilot to 8 weeks with 2 markets. Prioritize MY and PH where Foodpanda holds 30%+ share. Scenario planning updated weekly with regulatory news tracker.',
          },
          {
            risk: 'Foodpanda counter-subsidy war triggers early, top-decile users defect on price not features',
            mitigation: 'Lock-in mechanism is subscription plus habit formation, not discounting. If Foodpanda subsidy war escalates, shift GrabAds funding from GrabCoins acquisition to GU retention rewards for existing subs.',
          },
        ],
      };
    } else if (shortName === 'Convert 54M MTUs into a Cross-Sell Lending Funnel') {
      uiBets = [
        {
          id: 1, rank: 1,
          name: 'Launch Cash Loan in TH and MY on schedule by mid-2026',
          type: 'execution',
          cost_tier: 'L cost', horizon: '6-9 months', feasibility_score: 7,
          description: 'Cash Loan is live in PH with AI-underwritten pre-approvals off Mobility ride-history data. Launch TH and MY on schedule mid-2026. At 3% penetration of the ~30M Mobility MTU base, 6-month tenor, USD 200 avg loan, 7% net take: USD 25M/yr Cash Loan revenue. Every quarter of slippage cuts H2 26 FinServ contribution proportionally.',
          rationale: 'FS_EBITDA_H2_26. Grab holds ride-history data no standalone lender has, letting pre-approval be one-tap. This is the single largest closable component of Peter Oey\'s stated breakeven commitment.',
        },
        {
          id: 2, rank: 2,
          name: 'Close Atome Phase 1 on schedule by Q3 2027 to unlock BNPL cross-sell',
          type: 'financial',
          cost_tier: 'XL cost', horizon: '12 months', feasibility_score: 6,
          description: 'Atome USD 1.49B acquisition closes Q3 27. Standing up the joint integration team by Q4 26 is the highest-value action; slippage of one quarter compounds because BNPL launches sequentially across markets. At 5% Deliveries MTU penetration plus 30% cross-sell of existing 25M Atome users: USD 90M/yr BNPL revenue.',
          rationale: 'Not H2 26 gap-closer (revenue kicks in FY28). Load-bearing for the USD 6B combined GLP 2028 target and the FY28 investor update arc.',
        },
        {
          id: 3, rank: 3,
          name: 'Activate MSME loans for driver-partners via GXBank + Jaguh Niaga and GXS + Validus',
          type: 'financial',
          cost_tier: 'M cost', horizon: '9 months', feasibility_score: 7,
          description: 'GXS Bank has USD 1B+ SME loans disbursed via Validus. GXBank + Jaguh Niaga programme is live for MSMEs. Push MSME product to Grab\'s ~8M driver-partner base at 2% penetration, USD 800 avg loan, 2 cycles/yr, 6% take: USD 15M/yr MSME revenue. Turbo AI earnings data feeds underwriting.',
          rationale: 'FS_QUARTERLY_DISBURSALS. Uses proprietary driver-earnings data (18-24 months per driver) that no standalone SME lender has. Compounds Bet #1 because driver-partners are pre-qualified via Mobility rails.',
        },
        {
          id: 4, rank: 4,
          name: 'Sweep Cash Loan and MSME repayments into Superbank and GXS deposit accounts',
          type: 'execution',
          cost_tier: 'S cost', horizon: '6 months', feasibility_score: 8,
          description: 'Superbank has 7.4M customers and consolidates to Grab H2 26. At 25% conversion of repaying borrowers into Superbank deposits, USD 500 avg deposit per user, 3% NIM: USD 4M/yr NIM contribution. Small standalone but compounds every subsequent cross-sell.',
          rationale: 'MTU_MOMENTUM plus deposit-funding cost advantage on the lending stack. Rappi Colombia validated the sweep-into-savings shape at 300K accounts with a fraction of Grab\'s user base.',
        },
      ];
      uiPilot = {
        test_hypothesis: 'If we run Cash Loan pre-approval on the top 200K Mobility MTUs in Bangkok and Klang Valley for 12 weeks, using ride-history-based AI underwriting and one-tap approval, then 12-week take rate will hit 4%+ on the eligible cohort (versus 1.5% standalone SEA short-tenor benchmark), validating the H2 26 breakeven path via Cash Loan revenue alone.',
        timeline_weeks: 12,
        cost_usd: 480000,
        decision_rule: 'Roll out TH and MY nationally if 12-week take rate beats 4% with 30-day delinquency under 3%. Below 2% take rate, kill the ride-history model and pivot to standard SEA credit scoring. Between 2% and 4%, extend pilot by 6 weeks testing loan-size and tenor variations to find the accept-frequency sweet spot.',
        success_metric: {
          metric_name: 'Cash Loan take rate on top-200K Mobility MTU cohort (12-week window, BKK + Klang)',
          baseline: '~1.5% standalone SEA short-tenor Cash Loan benchmark',
          success_threshold: '>= 4% take rate (validates USD 25M/yr Cash Loan revenue path)',
          ambiguous_zone: '2% - 4% (extend, tune loan size and tenor)',
          kill_threshold: '< 2% take rate or > 3% 30-day delinquency',
        },
        risks: [
          {
            risk: 'BOT or BNM tightens digital lending regulation mid-pilot, caps take rates',
            mitigation: 'Pre-brief regulators in both markets by Q4 26. Legal review of Grab\'s existing PH Cash Loan structure to identify replicable licensing pathway. Gate national rollout on written no-action letters.',
          },
          {
            risk: 'AI credit model built on PH data underperforms on TH and MY borrower behavior',
            mitigation: 'Cap first-loan ticket at USD 100 for pilot cohort. Run parallel human-underwritten control group on 10% of pilot. Retrain model on TH + MY behavioral data before national rollout.',
          },
          {
            risk: 'Ride-history data proxy for creditworthiness is thinner than modeled (many drivers vs riders)',
            mitigation: 'Segment pilot cohort into rider-heavy vs driver-heavy sub-cohorts. Measure take rate and delinquency separately. If rider cohort underperforms, restrict national launch to driver-partners in Phase 1.',
          },
        ],
      };
    } else if (shortName === 'GrabPay-Native Agentic Rails Before AMP Sets the Standard') {
      uiBets = [
        {
          id: 1, rank: 1,
          name: 'Ship GrabPay-native agentic payment APIs by Q3 2027',
          type: 'execution',
          cost_tier: 'L cost', horizon: '12 months', feasibility_score: 7,
          description: 'Build GrabPay-native payment APIs that Grab Shopping Agent, Mai, Cash Loan, and Discover route through natively. In-app agentic transactions stay on GrabPay regardless of what protocol Ant sets externally. USD 20M one-time build cost. Pays back in ~1.5 years including credit model NPL preservation on FY30 USD 6-12B loan book.',
          rationale: 'FS_GRABPAY_STANDALONE_TPV. Walled garden defense is the moat Grab controls. Grab Shopping Agent (live from GrabX April 2026) is the first internal customer; Mai and Cash Loan are next. Ships before AMP has SEA merchant lock-in.',
        },
        {
          id: 2, rank: 2,
          name: 'Negotiate GrabPay entry into Alipay+ as AMP Phase II wallet partner',
          type: 'execution',
          cost_tier: 'S cost', horizon: '9-12 months', feasibility_score: 4,
          description: 'Parallel to Bet #1. Cross-app agentic commerce (external AI agent buying from a merchant that accepts multiple SEA wallets) is TPV Grab cannot force through walled garden alone. Negotiating Phase II entry preserves optionality on the ~30% of Grab-addressable agentic commerce that happens outside the app.',
          rationale: 'Ant Phase I exclusion suggests low probability of favorable terms. Pursue with Anthony\'s and Peter\'s teams as insurance policy, not primary strategy. Zero build cost; pure negotiation.',
        },
        {
          id: 3, rank: 3,
          name: 'Instrument credit-model data-density protection on FY30 GLP',
          type: 'financial',
          cost_tier: 'M cost', horizon: '6-9 months', feasibility_score: 7,
          description: 'Every high-value transaction that bypasses GrabPay reduces the transaction data feeding underwriting for Cash Loan, Atome, and Superbank. Instrument current data density per underwriting decision, model NPL sensitivity to density loss. USD 12M/yr NPL degradation avoided on USD 12B FY30 GLP at 10bps preserved.',
          rationale: 'FS_CREDIT_MODEL_DATA_RICHNESS. This is the compounding cost of AMP inaction. Not one-time revenue loss; permanent structural credit model degradation until data density returns.',
        },
        {
          id: 4, rank: 4,
          name: 'Ship agentic payment SDK for Grab-adjacent merchants (Priority Deliveries brands, Atome partners)',
          type: 'execution',
          cost_tier: 'M cost', horizon: '9 months', feasibility_score: 6,
          description: 'Give the 30K Atome brands and top 500 Priority Deliveries merchants a lightweight GrabPay agentic SDK for their own checkout flows. Even outside the Grab app, they route GrabPay first. Small addressable now, but positions Grab as the SEA agentic payment default before AMP consolidates merchants.',
          rationale: 'Compounds Bet #1 by extending walled garden into partner merchant surfaces. Learning value on merchant side of the two-sided market that AMP is targeting.',
        },
      ];
      uiPilot = {
        test_hypothesis: 'If we ship GrabPay-native agentic payment APIs and route 100% of Grab Shopping Agent transactions through them for 12 weeks in the top 5 Jakarta and Ho Chi Minh City merchant categories, then in-app agentic TPV routed via GrabPay will hit 90%+ (versus ~60% baseline where users can pick), validating walled garden feasibility ahead of platform-wide rollout.',
        timeline_weeks: 12,
        cost_usd: 380000,
        decision_rule: 'Roll out platform-wide to all in-app agentic surfaces (Mai, Discover, Cash Loan) if in-app agentic TPV routing hits 90%+ on GrabPay with no measurable degradation in Shopping Agent completion rate (baseline: 68% cart-to-checkout). Below 80% routing or completion rate drops more than 5ppt, kill the mandatory routing and revert to user-choice with GrabPay as default option.',
        success_metric: {
          metric_name: 'In-app agentic TPV routing via GrabPay (12-week window, Jakarta + HCMC merchant categories)',
          baseline: '~60% GrabPay TPV routing when users can select payment method',
          success_threshold: '>= 90% routing with completion rate held at 68%+',
          ambiguous_zone: '80% - 90% routing (extend pilot, test UX friction reduction)',
          kill_threshold: '< 80% routing or Shopping Agent completion rate falls > 5ppt',
        },
        risks: [
          {
            risk: 'Users prefer to keep payment choice, mandatory routing erodes trust in Shopping Agent',
            mitigation: 'A/B test mandatory vs default-with-override in pilot cohort. Measure NPS on Shopping Agent weekly during pilot. If NPS drops more than 3 points, shift from mandatory to prominent-default with USD 2 GrabCoins nudge.',
          },
          {
            risk: 'Ant amends AMP to be open-standard with GrabPay backend compatibility, walled garden becomes moot',
            mitigation: 'Bet #2 (Alipay+ negotiation track) hedges this exact scenario. If AMP opens, in-app GrabPay-native APIs still preserve data density; walled garden becomes redundant defensively but continues as offensive routing preference.',
          },
          {
            risk: 'GrabPay-native APIs create engineering complexity that slows Mai and Discover roadmaps',
            mitigation: 'Isolate API layer to Payment Platform team. Provide stable versioned SDK to Mai and Discover teams so their velocity is unaffected. Weekly sync between Payment Platform and consuming teams during pilot.',
          },
        ],
      };
    } else if (shortName === 'AMP + Atome Convergence') {
        uiBets = [
        {
          id: 1, rank: 1,
          name: 'Close Atome Phase 1 on schedule by Q3 27',
          type: 'financial',
          cost_tier: 'XL cost', horizon: '12 months', feasibility_score: 6,
          description: 'Every quarter of regulatory delay across MAS, BNM, BSP, OJK, BOT subtracts roughly $30M from 2028 FinServ EBITDA. Standing up the joint integration team by Oct 26 is the single highest-value action; slippage of one quarter costs the segment its H2 26 breakeven story.',
          rationale: 'FS_EBITDA_H2_26 breakeven and the $500M 2028 FinServ target both assume Atome contributes from Q3 27. This bet defends the timing that anchors the entire deal thesis.',
        },
        {
          id: 2, rank: 2,
          name: 'Cross-sell Atome BNPL into 40% of GrabUnlimited base by H2 27',
          type: 'execution',
          cost_tier: 'L cost', horizon: '6-9 months', feasibility_score: 7,
          description: 'GrabUnlimited drives 35% of Deliveries GMV and grew 20% YoY in Q2. Atome BNPL as a native GU perk should convert at 3-4x standalone Atome given trust and habit. Adds $80-100M cumulative GLP by H2 27 at 3.5% take, worth ~$3M FinServ contribution.',
          rationale: 'MTU_MOMENTUM and FS_GLP_EOY_26 both benefit. Kredit Pintar Indonesia gives us the risk model; the wrapper is UX not credit.',
        },
        {
          id: 3, rank: 3,
          name: 'Ship GrabPay agent-payment SDK, migrate 30% of TPV in 12 months',
          type: 'execution',
          cost_tier: 'L cost', horizon: '12 months', feasibility_score: 5,
          description: 'Ant AMP is the story we run alongside, not just defend against. Grab as the largest SEA wallet ships its own agent SDK and lets AMP-compliant merchants transact via GrabPay first, Ant second. Defends roughly $5M of at-risk FinServ contribution over 24 months.',
          rationale: 'If AMP becomes the SEA agent-payment standard and Grab is not on the buy-side, wallet share erodes 3-5% over 24 months. Table stakes for the wallet franchise.',
        },
        {
          id: 4, rank: 4,
          name: 'Route Priority Deliveries ads inventory through Atome merchants',
          type: 'financial',
          cost_tier: 'M cost', horizon: '6 months', feasibility_score: 8,
          description: '30K Atome brands become GrabAds inventory. Priority Deliveries advertisers grew spend 24% YoY in Q2. Layering Atome merchants on top adds ~$2-3M ads contribution to FinServ in H2 27, with execution risk mostly on merchant onboarding UX.',
          rationale: 'Two convergences at once: Atome merchants monetized via ads, and ads growth compounds the Priority Deliveries flywheel. Lowest-risk highest-feasibility bet in the set.',
        },
      ];
      uiPilot = {
        test_hypothesis: 'If we launch a native GrabUnlimited + Atome BNPL bundle in Malaysia and Philippines by Q2 27, then GU subs will convert to first-Atome-transaction at 3x the standalone Atome funnel rate, validating the cross-sell thesis and unlocking the $80-100M incremental GLP path.',
        timeline_weeks: 12,
        cost_usd: 450000,
        decision_rule: 'Ship the bundle if MY + PH combined 12-week conversion beats 18% (standalone Atome baseline runs at 6%). Below 12%, kill the bundle and revisit routing (in-app placement, incentives, credit model). Between 12% and 18%, extend the pilot by 8 weeks with an incentive stack test before deciding.',
        success_metric: {
          metric_name: 'GU sub → first Atome transaction (12-week window)',
          baseline: '~6% (standalone Atome funnel, MY + PH blended)',
          success_threshold: '>= 18% (3x standalone, validates cross-sell)',
          ambiguous_zone: '12% - 18% (extend pilot, test incentives)',
          kill_threshold: '< 12% (bundle is not the unlock)',
        },
        risks: [
          {
            risk: 'MAS or BSP flags the bundle as unlicensed BNPL distribution',
            mitigation: 'Pre-brief regulators in both markets by Nov 26, gate launch on written no-action letters. Legal review is 4-6 weeks; start now, not on pilot ship date.',
          },
          {
            risk: 'GU subs already using Atome directly show low incremental conversion',
            mitigation: 'Segment pilot cohort to exclude existing Atome accounts. Measure true net-new activations only. Rebase the 6% baseline against non-Atome GU subs to avoid overstating lift.',
          },
          {
            risk: 'BNPL default rates spike in MY given post-Covid credit environment',
            mitigation: 'Kredit Pintar credit model is the underwriting layer. Cap first-loan ticket at MYR 300 for pilot cohort. Monitor 30-day delinquency weekly, kill if it crosses 4% (double the current Atome MY book).',
          },
        ],
      };
    } else if (shortName === 'Priority Deliveries Ads Flywheel') {
            uiBets = [
        {
          id: 1, rank: 1,
          name: 'Move Priority Deliveries GMV share from 19% to 24% by H2 27',
          type: 'execution',
          cost_tier: 'M cost', horizon: '9 months', feasibility_score: 8,
          description: 'Priority Deliveries hit 19% of Deliveries GMV in Q2 with +4ppt YoY momentum. Push to 24% by tightening the priority-slot merchant match on high-density MY and TH corridors. Every 1ppt shift lifts Deliveries EBITDA margin ~15bps at current contribution economics.',
          rationale: 'DEL_MARGIN_FY26 target of 3.5-4.0% margin needs both mix shift and ads. Priority Deliveries is the mix-shift lever inside our control, unlike GrabUnlimited penetration which is user-adoption bounded.',
        },
        {
          id: 2, rank: 2,
          name: 'Expand GrabAds advertiser count 30% in Deliveries category by FY27',
          type: 'financial',
          cost_tier: 'L cost', horizon: '12 months', feasibility_score: 7,
          description: 'GrabAds advertisers grew 21% and average spend grew 24% YoY in Q2, but Deliveries as a category is under-indexed vs Mobility. Add 500 SME advertisers via self-serve tools targeting merchants outside the current top 100. Incremental $25-30M ads revenue at 80% contribution margin.',
          rationale: 'DoorDash ads business hit 4% of GMV take rate; we run below 1.5%. Closing half that gap is the single largest untapped Deliveries margin lever.',
        },
        {
          id: 3, rank: 3,
          name: 'Launch dynamic bidding for Priority Deliveries ad slots by Q1 27',
          type: 'financial',
          cost_tier: 'L cost', horizon: '9 months', feasibility_score: 6,
          description: 'Fixed-price ad slots leave money on the table during peak demand. Ship auction-based bidding with reserve pricing tied to slot conversion history. Meituan runs this playbook; expected ~15% ARPU lift on active advertisers, worth $8-10M annualized.',
          rationale: 'Compounds Bet #2 by monetizing existing advertisers harder before chasing new ones. Auction-based ads infrastructure is a fixed one-time build.',
        },
        {
          id: 4, rank: 4,
          name: 'Bundle Ads inventory with GrabUnlimited merchant offers for cross-sell',
          type: 'execution',
          cost_tier: 'S cost', horizon: '6 months', feasibility_score: 8,
          description: 'GU subs converting on merchant offers is a warm ads audience. Sell "GU-exclusive" placement to Deliveries advertisers at a 25% premium. Small addressable, but zero incremental infrastructure and high signal for the sales team on future GU commerce features.',
          rationale: 'Ties two Q2 flywheels (GU + Ads) into one product. Learning value beyond the $ contribution.',
        },
      ];
      uiPilot = {
        test_hypothesis: 'If we launch dynamic bidding on Priority Deliveries ad slots in the top 3 Jakarta and Manila zones for 10 weeks, then advertiser ARPU on those slots will rise at least 15% versus fixed-price baseline, validating platform-wide rollout in Q2 27.',
        timeline_weeks: 10,
        cost_usd: 320000,
        decision_rule: 'Roll out platform-wide if ARPU lift on pilot slots beats 15% with no advertiser churn above 5%. Below 8% lift or churn above 10%, kill and stay on fixed pricing. Between 8-15%, extend by 6 weeks with reserve-price tuning.',
        success_metric: {
          metric_name: 'ARPU on Priority Deliveries pilot slots (10-week window)',
          baseline: 'Fixed-price ARPU baseline in matched non-pilot slots',
          success_threshold: '>= +15% lift (platform-wide rollout Q2 27)',
          ambiguous_zone: '+8% to +15% (extend, tune reserve pricing)',
          kill_threshold: '< +8% lift or > 10% advertiser churn',
        },
        risks: [
          {
            risk: 'Small advertisers priced out, top-of-funnel diversity collapses',
            mitigation: 'Reserve at least 30% of pilot inventory for advertisers spending below the top-quartile threshold. Monitor advertiser-count distribution weekly, not just revenue.',
          },
          {
            risk: 'Merchants perceive dynamic pricing as opaque, sales team churn spikes',
            mitigation: 'Ship a transparency dashboard with each pilot advertiser showing bid history and clearing price. Weekly office hours with the top 20 spenders during weeks 3-8.',
          },
          {
            risk: 'Meituan or Deliveroo copy-fast in the same corridors during pilot',
            mitigation: 'Pilot in zones where we hold >60% share to insulate from competitive noise. Track competitor pricing in target zones weekly.',
          },
        ],
      };
    } else {
      // Fallback for other hypotheses (Xanh SM, Foodpanda, GXS SME, etc.)
            uiBets = arithmeticRows.slice(0, 5).map((row, i) => ({
        id: i + 1, rank: i + 1,
        name: row.driver || `Bet ${i + 1}`,
        type: i % 2 === 0 ? 'financial' : 'execution',
        cost_tier: 'M cost',
        horizon: '6 months',
        feasibility_score: 7,
        description: row.why || '',
        rationale: 'Bet Generator agent has not populated this hypothesis yet.',
      }));
    }

    return {
      ...MOCK_HYPOTHESIS,
      id: a.id,
      name: a.short_name || MOCK_HYPOTHESIS.name,
      short_name: a.short_name || MOCK_HYPOTHESIS.short_name,
      sector: a.sector || MOCK_HYPOTHESIS.sector,
      primary_goal_id: (function() {
        const raw = (a.primary_goal_id || '').trim();
        // Direct match on lowercase goal IDs
        if (['finserv_ebitda', 'ondemand_gmv', 'group_revenue', 'group_ebitda', 'ecosystem_mtu', 'deliveries_margin', 'ai_margin_lever'].includes(raw)) {
          return raw;
        }
        // Legacy uppercase mapping fallback
        const legacyMap: Record<string, string> = {
          'FS_EBITDA_H2_26': 'finserv_ebitda',
          'FS_GLP_EOY_26': 'finserv_ebitda',
          'OD_GMV_H2_26': 'ondemand_gmv',
          'GRP_REV_FY26': 'group_revenue',
          'GRP_EBITDA_FY26': 'group_ebitda',
          'DEL_MARGIN_FY26': 'deliveries_margin',
          'MTU_MOMENTUM': 'ecosystem_mtu',
        };
        return legacyMap[raw] || MOCK_HYPOTHESIS.primary_goal_id;
      })(),
      primary_contribution: uiPrimaryContribution,
      arithmetic: uiArithmetic.length > 0 ? uiArithmetic : MOCK_HYPOTHESIS.arithmetic,
      arithmetic_result: {
        label: `= Contribution to ${(function() {
          const gid = (a.primary_goal_id || 'finserv_ebitda').toLowerCase();
          const goalName = MOCK_GRAB_GOALS.find(g => g.id === gid)?.short_name || 'FinServ EBITDA';
          return goalName;
        })()} target`,
        value: kmValue || '~$XXX M',
      },
      secondary_goals: uiSecondaryGoals.length > 0 ? uiSecondaryGoals : MOCK_HYPOTHESIS.secondary_goals,
      rollup: uiRollup.length > 0 ? uiRollup : MOCK_HYPOTHESIS.rollup,
            bets: uiBets.length > 0 ? uiBets : MOCK_HYPOTHESIS.bets,
      pilot: uiPilot,
      // Extra prose fields the mock doesn't have — passed through for future use
      _thesis: a.thesis || '',
      _primary_contribution_prose: a.primary_contribution || '',
      _arithmetic_result_prose: a.arithmetic_result || '',
      _assumptions: a.assumptions || '',
    };
  }, [scoutData.activeHypothesis]);
   

  return (
    <div
      style={{
        padding: "24px 40px",
        maxWidth: "100%",
        margin: 0,
        background: c.bg,
        minHeight: "100vh",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', Roboto, sans-serif",
        color: c.text,
      }}
    >
      <ScoutHeader stats={scoutData.stats} />
      <StageBar active={activeTab} onChange={setActiveTab} />

           {activeTab === "signals" && (
  <SignalsWrapper
  subTab={signalsSubTab}
  onSubTabChange={setSignalsSubTab}
  scoutData={scoutData}
  onAddToTop3={addToTop3}
  onOpenDetail={setDrawerHyp}
  generateState={generateState}
  setGenerateState={setGenerateState}
  onPersistGenerated={persistGeneratedHypothesis}
  onGoToImpact={() => setActiveTab("impact")}
  onSaveScouted={saveScoutedHypothesis}
  onRemoveFromTop3={removeFromTop3}
  onSetActive={setActiveHypothesis}
  onDuplicateSavedToTop3={duplicateSavedToTop3}
  onUnsaveHypothesis={unsaveHypothesis}
/>
)}
            
    {activeTab === "impact" && (
  <ImpactTab
    hyp={hyp}
    onBack={() => setActiveTab("signals")}
    onNext={() => setActiveTab("bets" as TabId)}
  />
)}

{activeTab === "bets" && (
  <BetsTab bets={hyp.bets || []} hyp={hyp} />
)}

{activeTab === "pilot" && (
  <PilotTab pilot={hyp.pilot} hyp={hyp} topBet={hyp.bets?.[0]} />
)}

<ScoutedDetailDrawer
  hyp={drawerHyp}
  goals={scoutData.goals}
  drivers={scoutData.drivers}
  signals={scoutData.signals || []}
  onClose={() => setDrawerHyp(null)}
  onAddToTop3={() => drawerHyp && addToTop3(drawerHyp.id)}
  onSetActiveFromDrawer={setActiveHypothesis}
/>
    </div>
  );
}
