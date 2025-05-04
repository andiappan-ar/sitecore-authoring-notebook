import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, AuthoringSessionData } from './src/app/lib/session';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const session = await getIronSession<AuthoringSessionData>(req, res, sessionOptions);

  const isLab = req.nextUrl.pathname.startsWith('/xp/lab');
  const hasXp = session.xpConfig?.xpAuthoringUrl && session.xpConfig?.xpItemUrl;

  // ✅ Simple console logs (works in Edge Runtime)
  if (process.env.NEXT_PUBLIC_LOG_DEBUG === 'true') {
    console.log("🌐 Middleware running...");
    console.log("📄 Pathname:", req.nextUrl.pathname);
    console.log("🔐 Has XP Config:", !!hasXp);
  }

  if (isLab && !hasXp) {
    const url = req.nextUrl.clone();
    url.pathname = '/xp/setup';
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ['/xp/lab'],
};
