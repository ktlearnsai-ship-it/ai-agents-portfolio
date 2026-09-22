const AIRTABLE_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE = "Hypothesis_Ranked";

async function findExisting(shortName: string) {
  const formula = `LOWER({short_name})=LOWER("${shortName.replace(/"/g, '\\"')}")`;
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE)}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.records?.[0] || null;
}

async function patchRecord(id: string, fields: any) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE}/${id}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`Airtable patch: ${res.status} ${await res.text()}`);
  return res.json();
}

async function createRecord(fields: any) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`Airtable create: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function POST(req: Request) {
  try {
    const { hypothesis, action, slot } = await req.json();

    const fields: any = {
      short_name: hypothesis.short_name,
      thesis: hypothesis.thesis,
    };

    if (hypothesis.framer_stage_1) fields.framer_stage_1 = hypothesis.framer_stage_1;
    if (hypothesis.framer_stage_2) fields.framer_stage_2 = hypothesis.framer_stage_2;
    if (hypothesis.framer_stage_3) fields.framer_stage_3 = hypothesis.framer_stage_3;
    if (hypothesis.framer_stage_4_rationale) fields.framer_stage_4_rationale = hypothesis.framer_stage_4_rationale;
    if (hypothesis.framing_type) fields.framing_type = hypothesis.framing_type;
    if (hypothesis.signals_used) fields.signals_used = hypothesis.signals_used;
    if (hypothesis.competitor) fields.competitor = hypothesis.competitor;
    if (hypothesis.sector) fields.sector = hypothesis.sector;
    if (hypothesis.markets) fields.markets = hypothesis.markets;
    if (hypothesis.framing_rationale) fields.pushback_paragraph = hypothesis.framing_rationale;
    // NEW — persist goal + drivers so drawer shows them
    if (hypothesis.primary_goal_id) fields.primary_goal = hypothesis.primary_goal_id;
    if (hypothesis.load_bearing_drivers) fields.load_bearing_drivers = hypothesis.load_bearing_drivers;
    if (hypothesis.load_bearing_products) fields.load_bearing_products = hypothesis.load_bearing_products;

    if (action === "top3") {
      fields.is_in_top3 = true;
      fields.top3_slot = slot || 1;
    } else if (action === "saved") {
      fields.is_saved = true;
    }

    const existing = await findExisting(hypothesis.short_name);
    if (existing) {
      const merged = { ...fields };
      if (action === "top3") {
        merged.is_in_top3 = true;
        merged.top3_slot = slot || existing.fields.top3_slot || 1;
      }
      if (action === "saved") {
        merged.is_saved = true;
      }
      const data = await patchRecord(existing.id, merged);
      return Response.json({ success: true, record: data, deduped: true });
    }

    const data = await createRecord(fields);
    return Response.json({ success: true, record: data, deduped: false });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}