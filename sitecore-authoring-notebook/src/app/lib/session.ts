// lib/session.ts
import { SessionOptions } from "iron-session";

export type AuthoringSessionData = {
  xpConfig?: {
    xpAuthoringUrl: string;
    xpAccessToken: string;
    xpItemUrl: string;
    xpApiKey: string;
    xpGraphqlType: string;
  };
  xmcConfig?: {
    xmcAuthoringUrl: string;
    xmcAccessToken: string;
    xmcEdgeUrl: string;
    xmcApiKey: string;
  };
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "sitecore_authoring_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
