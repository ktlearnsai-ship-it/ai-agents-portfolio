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
      .filter((r: Record<string, unknown>) => {
        const fields = r.fields as Record<string, unknown>;
        return fields.hypothesis_title && fields.status === 'Active';
      })
      .map((r: Record<string, unknown>) => {
        const f = r.fields as Record<string, unknown>;
        return {
          id: r.id as string,
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
          levers: safeJSON(f.levers as string),
          scenarioGrid: safeJSON(f.scenario_grid as string),
          affectedMarkets: safeJSON(f.affected_markets as string),
          options: safeJSON(f.options as string),
          weekOf: f.week_of || ''
        };
      });

    return Response.json(hypotheses);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}

function safeJSON(str: string) {
  if (!str) return [];
  if (typeof str !== 'string') return str;
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}