export async function GET() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = 'tblm3wZZ8kh4JqU6r';

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${tableId}?sort%5B0%5D%5Bfield%5D=rank&sort%5B0%5D%5Bdirection%5D=asc`,
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
      .filter(r => r.fields.hypothesis_title && r.fields.status === 'Active')
      .map(r => {
        const f = r.fields;
        return {
          id: r.id,
          rank: f.rank || 0,
          title: f.hypothesis_title || '',
          thesis: f.thesis || '',
          fullAnalysis: f.full_analysis || '',
          whyNow: f.why_now || '',
          posture: f.strategic_posture || 'growth',
          urgency: f.urgency_score || 5,
          growthPotential: f.growth_potential_score || 5,
          confidence: f.confidence || 'medium',
          keyMetric: f.key_metric || '',
          keyMetricValue: f.key_metric_value || 0,
          keyMetricUnit: f.key_metric_unit || '',
          levers: safeJSON(f.levers),
          scenarioGrid: safeJSON(f.scenario_grid),
          affectedMarkets: safeJSON(f.affected_markets),
          options: safeJSON(f.options),
          weekOf: f.week_of || ''
        };
      });

    return Response.json(hypotheses);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

function safeJSON(str) {
  if (!str) return [];
  if (typeof str !== 'string') return str;
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}