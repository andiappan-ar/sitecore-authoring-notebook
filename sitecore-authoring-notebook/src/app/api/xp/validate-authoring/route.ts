import { NextRequest, NextResponse } from "next/server";

// Skip certificate validation globally (for local/dev only)
if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function POST(req: NextRequest) {
  try {
    const { url, token } = await req.json();
    const query = { query: "query { sites { name } }" };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query)
    });

    const body = await res.text();
    let json;
    try {
      json = JSON.parse(body);
    } catch {
      json = { raw: body };
    }

    const hasError = json?.errors || !json?.data?.sites || json?.data?.sites === null;
    if (hasError) {
      return NextResponse.json({
        status: res.status,
        statusText: res.statusText,
        body: json,
        validation: "failed"
      }, { status: 400 });
    }

    return NextResponse.json({
      status: res.status,
      statusText: res.statusText,
      body: json,
      validation: "passed"
    }, { status: res.status });
  } catch (err: any) {
    console.error("Authoring API Error:", err);
    return NextResponse.json({ error: `Fetch failed: ${err.message}` }, { status: 500 });
  }
}
