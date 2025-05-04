import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, AuthoringSessionData } from "../../../../lib/session";

export async function GET(req: NextRequest) {
  const res = new NextResponse();
  const session = await getIronSession<AuthoringSessionData>(req, res, sessionOptions);

  if (session.xpConfig) {
    return NextResponse.json(session.xpConfig, res);
  } else {
    return NextResponse.json({ error: "XP config not found in session" }, { status: 404 });
  }
}