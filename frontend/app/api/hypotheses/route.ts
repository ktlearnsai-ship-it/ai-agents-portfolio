export const dynamic = 'force-dynamic';

function safeJSON(str: any) {
  if (!str) return [];
  if (typeof str !== 'string') return str;
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

export async function GET() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = 'tblm3wZZ8kh4JqU6r';

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${tableId}?sort%5B0%5D%5Bfield%5D=week_of&sort%5B0%5D%5Bdirection%5D=desc&filterByFormula={status}='Active'`,
      {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        next: { revalidate: 60 }
      }
    );

    const data = await response.json();

    if (data.error) {
      return Response.json({ error: data.error.message }, { status: 500 });
    }

    const hypotheses = data.records
      .filter((r: any) => r.fields.hypothesis_title)
      .map((r: any) => {
        const f = r.fields;
        return {
          id: r.id,
          hypothesis_statement: f.thesis || f.hypothesis_title || '',
          posture: f.strategic_posture || 'growth',
          urgency: f.urgency_score || 5,
          confidence: f.confidence || 'medium',
          test_window: f.test_window || '90 days',
          suggested_owner: f.suggested_owner || '',
          generated_date: f.week_of || '',
signals_processed: safeJSON(f.signals).length || 0,
markets_analyzed: safeJSON(f.affected_markets).length || 0,
competitors_tracked: [...new Set(safeJSON(f.signals).map((s: any) => s.competitor).filter(Boolean))].length || 0,
          key_metric: f.key_metric || '',
          key_metric_value: f.key_metric_value || 0,
          key_metric_unit: f.key_metric_unit || '',
          full_analysis: f.full_analysis || '',
          framework_applied: f.framework_applied || '',
          signals: safeJSON(f.signals),
          adjacencies: safeJSON(f.adjacencies),
          trends: safeJSON(f.trends),
          framework_analysis: safeJSON(f.framework_analysis),
          assumptions: safeJSON(f.assumptions),
          kill_criteria: safeJSON(f.kill_criteria),
          levers: safeJSON(f.levers),
          test_plan: safeJSON(f.test_plan),
          scenario_grid: safeJSON(f.scenario_grid),
          affected_markets: safeJSON(f.affected_markets),
          options: safeJSON(f.options),
        };
      });

    return Response.json(hypotheses);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}