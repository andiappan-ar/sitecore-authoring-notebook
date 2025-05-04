// app/api/xp/session/save-xp-config/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, AuthoringSessionData } from "../../../../lib/session";

export async function POST(req: NextRequest) {
  const res = new NextResponse();
  const session = await getIronSession<AuthoringSessionData>(req, res, sessionOptions);

  try {
    const body = await req.json();

    session.xpConfig = {
      xpAuthoringUrl: body.xpAuthoringUrl,
      xpAccessToken: body.xpAccessToken,
      xpItemUrl: body.xpItemUrl,
      xpApiKey: body.xpApiKey,
      xpGraphqlType: body.xpGraphqlType,
    };

    await session.save();
    return NextResponse.json({ saved: true }, res);
  } catch (err: any) {
    console.error("Failed to save XP session:", err);
    return NextResponse.json({ error: "Failed to save XP config" }, { status: 500 });
  }
}
