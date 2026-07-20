"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type { AnalyticsEventName } from "@/data/analytics";

type EventPayload = {
  eventName: AnalyticsEventName;
  path: string;
  target?: string;
  locale?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
};

function sendEvent(payload: EventPayload) {
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "same-origin",
    cache: "no-store",
    keepalive: true,
  }).catch(() => {
    // Analytics must never interrupt the visitor experience.
  });
}

export function trackPortfolioEvent(
  eventName: AnalyticsEventName,
  target?: string,
) {
  if (typeof window === "undefined" || window.location.pathname.startsWith("/admin")) {
    return;
  }

  sendEvent({
    eventName,
    path: window.location.pathname,
    target,
    locale: document.documentElement.lang,
  });
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef("");

  useEffect(() => {
    if (pathname.startsWith("/admin") || lastPathRef.current === pathname) {
      return;
    }

    lastPathRef.current = pathname;
    const params = new URLSearchParams(window.location.search);
    sendEvent({
      eventName: "page_view",
      path: pathname,
      locale: document.documentElement.lang,
      utmSource: params.get("utm_source") ?? params.get("source") ?? undefined,
      utmMedium: params.get("utm_medium") ?? params.get("medium") ?? undefined,
      utmCampaign:
        params.get("utm_campaign") ?? params.get("campaign") ?? undefined,
      utmContent: params.get("utm_content") ?? params.get("content") ?? undefined,
    });
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const tracked = target?.closest<HTMLElement>("[data-analytics-event]");
      const eventName = tracked?.dataset.analyticsEvent as
        | AnalyticsEventName
        | undefined;

      if (!tracked || !eventName) return;
      trackPortfolioEvent(
        eventName,
        tracked.dataset.analyticsTarget ?? tracked.getAttribute("href") ?? undefined,
      );
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const reached = new Set<number>();
    const handleScroll = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      if (available <= 0) return;
      const percentage = Math.round((window.scrollY / available) * 100);

      ([25, 50, 75, 100] as const).forEach((threshold) => {
        if (percentage >= threshold && !reached.has(threshold)) {
          reached.add(threshold);
          trackPortfolioEvent(`scroll_${threshold}` as AnalyticsEventName);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return null;
}
