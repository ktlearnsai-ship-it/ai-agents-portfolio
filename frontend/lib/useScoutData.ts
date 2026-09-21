"use client";

import { useEffect, useState, useCallback } from "react";

export type ScoutData = {
  activeHypothesis: any | null;
  scoutedHypotheses: any[];
  savedHypotheses: any[];
  top3: (any | null)[];
  signals: any[];
  goals: any[];
  drivers: any[];
  bets: any[];
  pilot: any | null;
  agentRuns: any[];
  stats: { totalCost: number; runsCount: number };
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useScoutData(): ScoutData {
  const [data, setData] = useState<ScoutData>({
    activeHypothesis: null,
    scoutedHypotheses: [],
    savedHypotheses: [],
    top3: [null, null, null],
    signals: [],
    goals: [],
    drivers: [],
    bets: [],
    pilot: null,
    agentRuns: [],
    stats: { totalCost: 0, runsCount: 0 },
    loading: true,
    error: null,
    refetch: () => {},
  });

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/scout");
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      const allHyps = json.hypotheses.filter((h: any) => h.short_name && h.short_name.trim());

      const scoutedHypotheses = allHyps
        .filter((h: any) => h.is_pre_generated)
        .sort((a: any, b: any) => (a.rank || 999) - (b.rank || 999));

      const savedHypotheses = allHyps
        .filter((h: any) => h.is_saved)
        .sort((a: any, b: any) => new Date(b.created).getTime() - new Date(a.created).getTime());

      const top3Hyps = allHyps.filter((h: any) => h.is_in_top3);
      const top3: (any | null)[] = [null, null, null];
      top3Hyps.forEach((h: any) => {
        const slot = (h.top3_slot || 1) - 1;
        if (slot >= 0 && slot < 3) top3[slot] = h;
      });

            const explicitActive = allHyps.find((h: any) => h.is_in_top3 && h.is_active);
      const activeHypothesis =
        explicitActive ||
        top3[0] ||
        allHyps.sort((a: any, b: any) => new Date(b.created).getTime() - new Date(a.created).getTime())[0] ||
        null;

      const seenBetNames = new Set<string>();
      const bets = json.bets
        .filter((b: any) => b.name && b.rank !== 999)
        .filter((b: any) => {
          if (seenBetNames.has(b.name)) return false;
          seenBetNames.add(b.name);
          return true;
        })
        .slice(0, 5);

      const pilot =
        json.pilots.find((p: any) => p.test_hypothesis && p.test_hypothesis.length > 0) || null;

      setData({
        activeHypothesis,
        scoutedHypotheses,
        savedHypotheses,
        top3,
        signals: json.signals || [],
        goals: json.goals || [],
        drivers: json.drivers || [],
        bets,
        pilot,
        agentRuns: json.agentRuns,
        stats: json.stats,
        loading: false,
        error: null,
        refetch: fetchData,
      });
    } catch (err: any) {
      setData((d) => ({ ...d, loading: false, error: err.message, refetch: fetchData }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return data;
}