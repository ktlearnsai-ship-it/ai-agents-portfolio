const AIRTABLE_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const TABLES = {
  hypothesis: "Hypothesis_Ranked",
  bets: "Bets",
  pilots: "Pilots",
  agent_runs: "Agent_Runs",
  signals: "Signals_Raw",
  goals: "Grab_Strategic_Goals",
  drivers: "Grab_Financial_Drivers",
competitors: "Competitor_Registry",
};

async function fetchTable(tableName: string) {
  let allRecords: any[] = [];
  let offset: string | undefined = undefined;

  do {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`);
    if (offset) url.searchParams.set("offset", offset);
    url.searchParams.set("pageSize", "100");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Airtable ${tableName}: ${res.status}`);
    const data = await res.json();
    allRecords = allRecords.concat(data.records);
    offset = data.offset;
  } while (offset);

  return allRecords;
}

export async function GET() {
  try {
        const [hypRecords, betRecords, pilotRecords, runRecords, signalRecords, goalRecords, driverRecords, compRecords] = await Promise.all([
      fetchTable(TABLES.hypothesis),
      fetchTable(TABLES.bets),
      fetchTable(TABLES.pilots),
      fetchTable(TABLES.agent_runs),
      fetchTable(TABLES.signals),
      fetchTable(TABLES.goals),
      fetchTable(TABLES.drivers),
      fetchTable(TABLES.competitors),
    ]);

        const hypotheses = hypRecords.map((r: any) => ({
  id: r.id,
  short_name: r.fields.short_name || '',
  thesis: r.fields.thesis || '',
  primary_goal: r.fields.primary_goal || '',
  load_bearing_drivers: r.fields.load_bearing_drivers || '',
  pushback_paragraph: r.fields.pushback_paragraph || '',
  is_saved: r.fields.is_saved || false,
  is_in_top3: r.fields.is_in_top3 || false,
  top3_slot: r.fields.top3_slot || null,
  rank: r.fields.rank || null,
  is_pre_generated: r.fields.is_pre_generated || false,
  sector: r.fields.sector || '',
  markets: r.fields.markets || '',
  framer_stage_1: r.fields.framer_stage_1 || '',
  framer_stage_2: r.fields.framer_stage_2 || '',
  framer_stage_3: r.fields.framer_stage_3 || '',
  framer_stage_4_rationale: r.fields.framer_stage_4_rationale || '',
  framing_type: r.fields.framing_type || '',
  signals_used: r.fields.signals_used || '',
  competitor: r.fields.competitor || '',
  is_approved: r.fields.is_approved || false,
  is_active: r.fields.is_active || false,
  // Impact tab fields (NEW)
  primary_contribution: r.fields.primary_contribution || '',
  arithmetic: r.fields.arithmetic || '',
  arithmetic_result: r.fields.arithmetic_result || '',
  rollup: r.fields.rollup || '',
  secondary_goals_impact: r.fields.secondary_goals_impact || '',
  assumptions: r.fields.assumptions || '',
  key_metric: r.fields.key_metric || '',
  key_metric_value: r.fields.key_metric_value || '',
  key_metric_unit: r.fields.key_metric_unit || '',
  primary_goal_id: r.fields.primary_goal_id || '',
  secondary_goal_ids: r.fields.secondary_goal_ids || '',
  created: r.createdTime,
}));

    const bets = betRecords.map((r: any) => ({
      id: r.id,
      name: r.fields.name || '',
      description: r.fields.description || '',
      rationale: r.fields.rationale || '',
      cost_tier: r.fields.cost_tier || '',
      horizon: r.fields.horizon || '',
      feasibility: r.fields.feasibility || '',
      rank: r.fields.rank || 999,
      hypothesis_id: r.fields.hypothesis_id || '',
    }));

    const pilots = pilotRecords.map((r: any) => ({
      id: r.id,
      test_hypothesis: r.fields.test_hypothesis || '',
      timeline_weeks: r.fields.timeline_weeks || 0,
      cost_usd: r.fields.cost_usd || 0,
      success_metric: r.fields.success_metric || '',
      baseline_value: r.fields.baseline_value || '',
      success_threshold: r.fields.success_threshold || '',
      ambiguous_threshold: r.fields.ambiguous_threshold || '',
      kill_threshold: r.fields.kill_threshold || '',
      decision_rule: r.fields.decision_rule || '',
      risks: r.fields.risks || '',
    }));

    const agentRuns = runRecords.map((r: any) => ({
      id: r.id,
      agent_name: r.fields.agent_name || '',
      cost_usd: r.fields.cost_usd || 0,
      created: r.createdTime,
    }));

           const competitorNameById: Record<string, string> = {};
    compRecords.forEach((r: any) => {
      const name = r.fields.name || r.fields.Name || r.fields.competitor_name || r.fields.title || '';
      if (name) competitorNameById[r.id] = name;
    });

   const resolveIds = (val: any): string => {
      if (Array.isArray(val)) {
        return val
          .map((id: string) => competitorNameById[id] || 'Grab')
          .sort()
          .join(', ');
      }
      return typeof val === 'string' ? val : '';
    };

    const signals = signalRecords.map((r: any) => ({
      id: r.id,
      title: r.fields.title || '',
      sector: r.fields.sector || '',
      type: r.fields.signal_type || '',
      date: r.fields.date_detected || r.createdTime,
      summary: r.fields.impact_summary || '',
      source: r.fields.source || '',
      url: r.fields.url || '',
      company: resolveIds(r.fields.competitor_link),
      markets: Array.isArray(r.fields.markets_affected)
        ? r.fields.markets_affected.join(', ')
        : (r.fields.markets_affected || ''),
      drivers: Array.isArray(r.fields.drivers_affected)
        ? r.fields.drivers_affected.join(', ')
        : (r.fields.drivers_affected || ''),
    }));

    const goals = goalRecords.map((r: any) => ({
      id: r.id,
      goal_id: r.fields.goal_id || '',
      goal_name: r.fields.goal_name || '',
      baseline_value: r.fields.baseline_value || '',
      target_value: r.fields.target_value || '',
    }));

    const drivers = driverRecords.map((r: any) => ({
      id: r.id,
      driver_id: r.fields.driver_id || '',
      driver_name: r.fields.driver_name || '',
      sensitivity_note: r.fields.sensitivity_note || '',
    }));

    const totalCost = agentRuns.reduce((sum: number, r: any) => sum + (r.cost_usd || 0), 0);

    return Response.json({
      hypotheses,
      bets,
      pilots,
      agentRuns,
      signals,
      goals,
      drivers,
      stats: { totalCost, runsCount: agentRuns.length },
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}