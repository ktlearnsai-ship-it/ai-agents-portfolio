const AIRTABLE_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE = "Hypothesis_Ranked";

async function fetchAllTop3() {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE)}?filterByFormula=${encodeURIComponent("{is_in_top3}=1")}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Airtable fetch: ${res.status}`);
  const data = await res.json();
  return data.records || [];
}

async function patchRecord(id: string, fields: any) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE}/${id}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`Airtable patch ${id}: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function POST(req: Request) {
  try {
    const { action, hypId, slot } = await req.json();

    if (action === "setActive") {
      // Unset all other actives in Top 3, then set this one
      const top3Records = await fetchAllTop3();
      const others = top3Records.filter((r: any) => r.id !== hypId && r.fields.is_active);
      await Promise.all(others.map((r: any) => patchRecord(r.id, { is_active: false })));
      await patchRecord(hypId, { is_active: true });
      return Response.json({ success: true });
    }

    let fields: any = {};
    if (action === "addToTop3") {
      fields = { is_in_top3: true, top3_slot: slot };
    } else if (action === "removeFromTop3") {
      fields = { is_in_top3: false, top3_slot: null, is_active: false };
    } else if (action === "save") {
      fields = { is_saved: true };
    } else if (action === "unsave") {
      fields = { is_saved: false };
    }

    const data = await patchRecord(hypId, fields);
    return Response.json({ success: true, record: data });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}