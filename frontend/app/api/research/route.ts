export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json();
  
  const payload: any = {
    model: "claude-sonnet-4-6",
    max_tokens: body.max_tokens || 2000,
    messages: body.messages,
  };

  if (body.tools && body.tools.length > 0) {
    payload.tools = body.tools;
  }

  console.log("SENDING TO ANTHROPIC:", JSON.stringify(payload).substring(0, 300));

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  console.log("ANTHROPIC STATUS:", response.status);
  console.log("ANTHROPIC RESPONSE:", responseText.substring(0, 500));

  try {
    const data = JSON.parse(responseText);
    return Response.json(data);
  } catch (e) {
    console.error("PARSE ERROR:", e);
    return Response.json({ error: "Failed to parse response", raw: responseText.substring(0, 200) });
  }
}