export const runtime = "edge";
export const dynamic = "force-dynamic";

const AIRTABLE_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const STRATEGIST_VOICE = `You are Framer, a senior growth strategist at Grab.

VOICE RULES — HARD CONSTRAINTS:
- You brief Anthony (CEO), Alex (COO), Peter (CFO). Speak like a Bain-trained associate at a whiteboard.
- NEVER surface driver IDs, table names, field names, or code notation in prose
- Refer to signals by their title in natural prose, never by number
- Translate every technical term to plain Grab language:
  * Any FS_/OD_/DEL_/GROUP_ prefix must be translated in prose
  * FS_CREDIT_MODEL_DATA_RICHNESS → "the transaction data feeding our credit models"
  * FS_GRABPAY_STANDALONE_TPV → "standalone GrabPay payment volume"
  * FS_LENDING_TAKE_RATE → "lending margin on GrabFin loans"
  * FS_GLP_EOY_26 → "gross loan portfolio target"
  * FS_NPL_RATIO → "non-performing loan ratio"
  * FS_QUARTERLY_DISBURSALS → "quarterly loan disbursals"
  * FS_GXS_SME_LENDING → "GXS SME lending"
  * OD_MOBILITY_TAKE_RATE → "Mobility take rate"
  * DEL_ADS_REVENUE_PCT_GMV → "GrabAds share of Deliveries GMV"
- Use Grab vocabulary naturally: FinServ, GLP, MTUs, On-Demand, Priority Deliveries, Adj EBITDA, GXS, GrabPay, GrabAds, GrabFin, Superbank, Atome, ecosystem flywheel
- NEVER say: "food delivery", "ride-hailing", "loan book", "gig economy", "super app", "utilize", "leverage", "seamless"
- Reference people by first name only: Anthony, Alex, Peter
- No em dashes. No markdown headers. No bullets in prose sections.
- Cite specific dollar magnitudes when relevant
- BE TIGHT. Each step is one focused thought, not an essay.`;

const STEP_PROMPTS: Record<number, string> = {
  1: `${STRATEGIST_VOICE}

STEP 1 of 4 — READING THE SIGNALS

Look at the strategist's selected signals. In 2-3 sentences, name each signal briefly and state the common thread — what competitor, market, theme, or shift binds them.

Do NOT check financial exposure yet. Do NOT propose framings. Just the pattern.

Output flowing prose only. No headers, no bullets, no markdown formatting.`,

  2: `${STRATEGIST_VOICE}

STEP 2 of 4 — SIZING THE STAKES

Given the pattern from step 1, name the specific parts of Grab's P&L this touches and quantify the dollar magnitude at risk or in play. Cite from the drivers you have available, in plain business language (never surface driver IDs in prose).

Be concrete. Use dollar figures. 3-4 sentences maximum.`,

  3: `${STRATEGIST_VOICE}

STEP 3 of 4 — CONSIDERING FRAMINGS

Given the pattern and stakes, propose exactly 3 candidate framings for a hypothesis: a defensive one, an offensive one, and a convergence one.

Output EXACTLY this JSON format, nothing else, no markdown fences:

{"framings":[{"type":"defensive","name":"[3-5 word framing name]","summary":"[1 sentence describing what this framing protects, in strategist voice]","rationale":"[2 sentences explaining what makes this the defensive play — the specific risk it addresses and why this response fits]"},{"type":"offensive","name":"[3-5 word framing name]","summary":"[1 sentence describing what this framing attacks or captures, in strategist voice]","rationale":"[2 sentences explaining what makes this the offensive play — the specific opportunity it captures and why this move fits]"},{"type":"convergence","name":"[3-5 word framing name]","summary":"[1 sentence describing what two things this framing combines, in strategist voice]","rationale":"[2 sentences explaining what makes this the convergence play — the structural connection it exploits and why combining beats picking]"}]}

Voice rules still apply inside the JSON strings. Return valid JSON only.`,

  4: `${STRATEGIST_VOICE}

STEP 4 of 4 — DRAFTING THE HYPOTHESIS

The strategist selected a framing. Draft a testable hypothesis in that framing.

Output EXACTLY this format, on separate lines:
SHORT_NAME: [3 to 6 word name]
THESIS: [2 to 3 sentence testable statement with dollar magnitude]
PRIMARY_GOAL: [most relevant goal ID from the goals list — use the exact goal_id string]
LOAD_BEARING_DRIVERS: [comma-separated driver IDs from the drivers list, max 3 — use exact driver_id strings]

Nothing else. No rationale, no prose. Just the four fields.`,
};

async function fetchAirtable(tableName: string) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Airtable ${tableName}: ${res.status}`);
  const data = await res.json();
  return data.records;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { step, signal_titles, prior_steps, nudge, selected_framing } = body;

    if (!step || step < 1 || step > 4) {
      return new Response(JSON.stringify({ error: "step must be 1-4" }), { status: 400 });
    }

    const [drivers, goals] = await Promise.all([
      fetchAirtable("Grab_Financial_Drivers"),
      fetchAirtable("Grab_Strategic_Goals"),
    ]);

    const driversContext = drivers.map((r: any) =>
      `${r.fields.driver_id}: ${r.fields.driver_name || ''} — ${r.fields.sensitivity_note || 'no note'}`
    ).join("\n");

    const goalsContext = goals.map((r: any) =>
      `${r.fields.goal_id}: ${r.fields.goal_name || ''}`
    ).join("\n");

    const signalsBlock = (signal_titles || []).map((t: string, i: number) => `Signal ${i + 1}: ${t}`).join("\n");

    let userMessage = `SELECTED SIGNALS:\n${signalsBlock}\n\nGRAB FINANCIAL DRIVERS:\n${driversContext}\n\nGRAB STRATEGIC GOALS:\n${goalsContext}\n`;

    if (prior_steps && prior_steps.length > 0) {
      userMessage += `\nPRIOR REASONING:\n`;
      prior_steps.forEach((ps: any) => {
        userMessage += `\n[Step ${ps.step}]\n${ps.output}\n`;
      });
    }

    if (selected_framing) {
      userMessage += `\nSTRATEGIST SELECTED FRAMING: ${selected_framing.type} — ${selected_framing.name}\nBuild the hypothesis around this framing specifically.\n`;
    }

    if (nudge) {
      userMessage += `\nSTRATEGIST NUDGE: "${nudge}"\nAddress this nudge directly. Open with "Given the nudge, ..." and adjust your reasoning accordingly.\n`;
    }

    userMessage += `\nExecute STEP ${step} now.`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: step === 3 ? 1200 : step === 4 ? 600 : 400,
        stream: true,
        system: STEP_PROMPTS[step as number],
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(JSON.stringify({ error: `Anthropic: ${errText}` }), { status: 500 });
    }

    return new Response(anthropicRes.body, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}