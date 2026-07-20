import { NextRequest, NextResponse } from "next/server";
import { isAnalyticsEventName } from "@/data/analytics";
import { recordAnalyticsEvent } from "@/data/analytics-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maxRequestBytes = 4_096;
const requestWindowMs = 60_000;
const maxRequestsPerWindow = 80;
const localRequests = new Map<string, { count: number; startedAt: number }>();

function noStore(response: NextResponse) {
  response.headers.set("cache-control", "no-store");
  return response;
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originHost = new URL(origin).host;
    const requestHost =
      request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return Boolean(requestHost) && originHost === requestHost;
  } catch {
    return false;
  }
}

function getRequestKey(request: NextRequest) {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("cf-connecting-ip")?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    "local"
  );
}

function isRateLimited(request: NextRequest) {
  const key = getRequestKey(request);
  const now = Date.now();
  const current = localRequests.get(key);

  if (!current || current.startedAt + requestWindowMs <= now) {
    localRequests.set(key, { count: 1, startedAt: now });
    return false;
  }

  current.count += 1;
  return current.count > maxRequestsPerWindow;
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return noStore(NextResponse.json({ error: "Invalid origin." }, { status: 403 }));
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  if (/bot|crawler|spider|headless|preview/i.test(userAgent)) {
    return new NextResponse(null, { status: 204 });
  }

  if (isRateLimited(request)) {
    return noStore(
      NextResponse.json({ error: "Too many analytics events." }, { status: 429 }),
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxRequestBytes) {
    return noStore(
      NextResponse.json({ error: "Request body is too large." }, { status: 413 }),
    );
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > maxRequestBytes) {
    return noStore(
      NextResponse.json({ error: "Request body is too large." }, { status: 413 }),
    );
  }

  const body = (() => {
    try {
      return JSON.parse(rawBody) as {
        eventName?: unknown;
        path?: unknown;
        target?: unknown;
        locale?: unknown;
        utmSource?: unknown;
        utmMedium?: unknown;
        utmCampaign?: unknown;
        utmContent?: unknown;
      };
    } catch {
      return null;
    }
  })();

  if (!body || !isAnalyticsEventName(body.eventName)) {
    return noStore(
      NextResponse.json({ error: "Unknown analytics event." }, { status: 400 }),
    );
  }

  try {
    const result = await recordAnalyticsEvent(request, {
      eventName: body.eventName,
      path: String(body.path ?? "/"),
      target: body.target ? String(body.target) : undefined,
      locale: body.locale ? String(body.locale) : undefined,
      utmSource: body.utmSource ? String(body.utmSource) : undefined,
      utmMedium: body.utmMedium ? String(body.utmMedium) : undefined,
      utmCampaign: body.utmCampaign ? String(body.utmCampaign) : undefined,
      utmContent: body.utmContent ? String(body.utmContent) : undefined,
    });
    const response = new NextResponse(null, { status: 204 });

    if (result.sessionId && result.sessionCookieName && result.sessionMaxAgeSeconds) {
      response.cookies.set(result.sessionCookieName, result.sessionId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: result.sessionMaxAgeSeconds,
        path: "/",
      });
    }

    return noStore(response);
  } catch (error) {
    console.error("Portfolio analytics event failed", error);
    return noStore(
      NextResponse.json({ error: "Analytics is unavailable." }, { status: 503 }),
    );
  }
}
