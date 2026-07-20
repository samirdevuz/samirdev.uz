import "server-only";

import { createHmac, randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type {
  AnalyticsBreakdown,
  AnalyticsEventName,
  AnalyticsSummary,
} from "@/data/analytics";

type AnalyticsInput = {
  eventName: AnalyticsEventName;
  path: string;
  target?: string;
  locale?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
};

type SessionRow = {
  id: string;
  visitor_hash: string;
  started_at: string;
  last_seen_at: string;
  landing_path: string;
  referrer_domain: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  country: string | null;
  device_type: string;
  browser: string;
  locale: string | null;
};

type EventRow = {
  visitor_hash: string;
  event_name: string;
  path: string;
  target: string | null;
  created_at: string;
};

const sessionCookieName = "samir_analytics_session";
const sessionMaxAgeSeconds = 30 * 60;

function cleanText(value: unknown, maximumLength: number) {
  const text = String(value ?? "").trim();
  return text ? text.slice(0, maximumLength) : undefined;
}

function cleanPath(value: unknown) {
  const path = cleanText(value, 500) ?? "/";
  return path.startsWith("/") ? path : "/";
}

function getClientAddress(request: NextRequest) {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("cf-connecting-ip")?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local"
  );
}

function getVisitorHash(request: NextRequest) {
  const day = new Date().toISOString().slice(0, 10);
  const address = getClientAddress(request);
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const salt =
    process.env.ANALYTICS_HASH_SECRET ??
    process.env.ADMIN_SESSION_SECRET ??
    process.env.ADMIN_PASSWORD ??
    "local-development-only";

  return createHmac("sha256", salt)
    .update(`${day}\0${address}\0${userAgent}`)
    .digest("hex");
}

function getReferrerDomain(request: NextRequest) {
  const referrer = request.headers.get("referer");

  if (!referrer) {
    return undefined;
  }

  try {
    const referrerUrl = new URL(referrer);
    const requestHost = request.headers.get("host");
    return referrerUrl.host === requestHost ? undefined : referrerUrl.hostname;
  } catch {
    return undefined;
  }
}

function parseDevice(userAgent: string) {
  if (/ipad|tablet|playbook|silk/i.test(userAgent)) {
    return "tablet";
  }
  if (/mobile|iphone|ipod|android/i.test(userAgent)) {
    return "mobile";
  }
  return userAgent === "unknown" ? "unknown" : "desktop";
}

function parseBrowser(userAgent: string) {
  if (/edg\//i.test(userAgent)) return "Edge";
  if (/opr\//i.test(userAgent)) return "Opera";
  if (/chrome\//i.test(userAgent)) return "Chrome";
  if (/firefox\//i.test(userAgent)) return "Firefox";
  if (/safari\//i.test(userAgent) && !/chrome\//i.test(userAgent)) return "Safari";
  return "Other";
}

export async function recordAnalyticsEvent(
  request: NextRequest,
  input: AnalyticsInput,
) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return { sessionId: undefined };
  }

  const now = new Date().toISOString();
  const visitorHash = getVisitorHash(request);
  const requestedSessionId = request.cookies.get(sessionCookieName)?.value;
  let sessionId = requestedSessionId;
  let existingSession: Pick<SessionRow, "id"> | null = null;

  if (requestedSessionId && /^[0-9a-f-]{36}$/i.test(requestedSessionId)) {
    const { data, error } = await supabase
      .from("portfolio_analytics_sessions")
      .select("id")
      .eq("id", requestedSessionId)
      .maybeSingle();

    if (error) {
      throw new Error("Could not restore analytics session.", { cause: error });
    }

    existingSession = data;
  }

  if (existingSession) {
    const { error } = await supabase
      .from("portfolio_analytics_sessions")
      .update({
        last_seen_at: now,
        locale: input.locale === "uz" ? "uz" : "en",
      })
      .eq("id", existingSession.id);

    if (error) {
      throw new Error("Could not update analytics session.", { cause: error });
    }
  } else {
    sessionId = randomUUID();
    const userAgent = request.headers.get("user-agent") ?? "unknown";
    const country = cleanText(
      request.headers.get("x-vercel-ip-country") ??
        request.headers.get("cf-ipcountry") ??
        request.headers.get("x-country-code"),
      2,
    )?.toUpperCase();
    const { error } = await supabase.from("portfolio_analytics_sessions").insert({
      id: sessionId,
      visitor_hash: visitorHash,
      started_at: now,
      last_seen_at: now,
      landing_path: cleanPath(input.path),
      referrer_domain: getReferrerDomain(request),
      utm_source: cleanText(input.utmSource, 100)?.toLowerCase(),
      utm_medium: cleanText(input.utmMedium, 100)?.toLowerCase(),
      utm_campaign: cleanText(input.utmCampaign, 150)?.toLowerCase(),
      utm_content: cleanText(input.utmContent, 150)?.toLowerCase(),
      country: country && /^[A-Z]{2}$/.test(country) ? country : undefined,
      device_type: parseDevice(userAgent),
      browser: parseBrowser(userAgent),
      locale: input.locale === "uz" ? "uz" : "en",
    });

    if (error) {
      throw new Error("Could not create analytics session.", { cause: error });
    }
  }

  if (!sessionId) {
    throw new Error("Analytics session could not be created.");
  }

  const { error: eventError } = await supabase
    .from("portfolio_analytics_events")
    .insert({
      session_id: sessionId,
      visitor_hash: visitorHash,
      event_name: input.eventName,
      path: cleanPath(input.path),
      target: cleanText(input.target, 500),
      created_at: now,
    });

  if (eventError) {
    throw new Error("Could not record analytics event.", { cause: eventError });
  }

  return { sessionId, sessionMaxAgeSeconds, sessionCookieName };
}

function toBreakdown(counts: Map<string, number>, limit = 8): AnalyticsBreakdown[] {
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => right.value - left.value || left.label.localeCompare(right.label))
    .slice(0, limit);
}

function increment(counts: Map<string, number>, label: string) {
  counts.set(label, (counts.get(label) ?? 0) + 1);
}

export async function getAnalyticsSummary(days: number): Promise<AnalyticsSummary> {
  const supabase = getSupabaseAdminClient();
  const safeDays = Math.min(90, Math.max(1, Math.floor(days)));
  const since = new Date(Date.now() - (safeDays - 1) * 86_400_000);
  since.setUTCHours(0, 0, 0, 0);
  const sinceIso = since.toISOString();

  if (!supabase) {
    return {
      days: safeDays,
      generatedAt: new Date().toISOString(),
      visitors: 0,
      pageViews: 0,
      contactClicks: 0,
      projectClicks: 0,
      liveVisitors: 0,
      trend: [],
      sources: [],
      campaigns: [],
      pages: [],
      countries: [],
      devices: [],
      events: [],
    };
  }

  const [sessionsResult, eventsResult] = await Promise.all([
    supabase
      .from("portfolio_analytics_sessions")
      .select(
        "id,visitor_hash,started_at,last_seen_at,landing_path,referrer_domain,utm_source,utm_medium,utm_campaign,utm_content,country,device_type,browser,locale",
      )
      .gte("started_at", sinceIso)
      .order("started_at", { ascending: false })
      .limit(10_000),
    supabase
      .from("portfolio_analytics_events")
      .select("visitor_hash,event_name,path,target,created_at")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .limit(20_000),
  ]);

  if (sessionsResult.error) {
    throw new Error("Could not load analytics sessions.", {
      cause: sessionsResult.error,
    });
  }
  if (eventsResult.error) {
    throw new Error("Could not load analytics events.", {
      cause: eventsResult.error,
    });
  }

  const sessions = sessionsResult.data as SessionRow[];
  const events = eventsResult.data as EventRow[];
  const visitorHashes = new Set(sessions.map((session) => session.visitor_hash));
  const liveCutoff = Date.now() - 30 * 60 * 1000;
  const liveVisitors = new Set(
    sessions
      .filter((session) => new Date(session.last_seen_at).getTime() >= liveCutoff)
      .map((session) => session.visitor_hash),
  ).size;
  const sourceCounts = new Map<string, number>();
  const campaignCounts = new Map<string, number>();
  const countryCounts = new Map<string, number>();
  const deviceCounts = new Map<string, number>();
  const pageCounts = new Map<string, number>();
  const eventCounts = new Map<string, number>();
  const trendMap = new Map<string, { visitors: Set<string>; pageViews: number }>();

  for (let offset = 0; offset < safeDays; offset += 1) {
    const date = new Date(since.getTime() + offset * 86_400_000)
      .toISOString()
      .slice(0, 10);
    trendMap.set(date, { visitors: new Set(), pageViews: 0 });
  }

  sessions.forEach((session) => {
    const source = session.utm_source || session.referrer_domain || "Direct";
    increment(sourceCounts, source);
    increment(campaignCounts, session.utm_campaign || "No campaign");
    increment(countryCounts, session.country || "Unknown");
    increment(deviceCounts, session.device_type || "unknown");
    trendMap
      .get(session.started_at.slice(0, 10))
      ?.visitors.add(session.visitor_hash);
  });

  events.forEach((event) => {
    increment(eventCounts, event.event_name);
    if (event.event_name === "page_view") {
      increment(pageCounts, event.path);
      const point = trendMap.get(event.created_at.slice(0, 10));
      if (point) point.pageViews += 1;
    }
  });

  return {
    days: safeDays,
    generatedAt: new Date().toISOString(),
    visitors: visitorHashes.size,
    pageViews: eventCounts.get("page_view") ?? 0,
    contactClicks:
      (eventCounts.get("email_copy") ?? 0) +
      (eventCounts.get("email_open") ?? 0),
    projectClicks:
      (eventCounts.get("project_view") ?? 0) +
      (eventCounts.get("milliyprep_click") ?? 0),
    liveVisitors,
    trend: [...trendMap.entries()].map(([date, point]) => ({
      date,
      visitors: point.visitors.size,
      pageViews: point.pageViews,
    })),
    sources: toBreakdown(sourceCounts),
    campaigns: toBreakdown(campaignCounts),
    pages: toBreakdown(pageCounts),
    countries: toBreakdown(countryCounts),
    devices: toBreakdown(deviceCounts),
    events: toBreakdown(eventCounts, 12),
  };
}
