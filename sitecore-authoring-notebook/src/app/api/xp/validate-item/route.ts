import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url, apiKey } = await req.json();
    const query = { query: "query { sites { name } }" };

    const res = await fetch(`${url}?sc_apikey=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    });

    const body = await res.text();
    let json;
    try {
      json = JSON.parse(body);
    } catch {
      json = { raw: body };
    }

    return NextResponse.json({
      status: res.status,
      statusText: res.statusText,
      body: json
    }, { status: res.status });
  } catch (err: any) {
    console.error("Item API Error:", err);
    return NextResponse.json({ error: `Fetch failed: ${err.message}` }, { status: 500 });
  }
}
