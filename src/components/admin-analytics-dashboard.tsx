"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpRight, Eye, MousePointerClick, Users } from "lucide-react";
import type { AnalyticsBreakdown, AnalyticsSummary } from "@/data/analytics";

function MetricCard({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;
  value: number;
  note: string;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
      <div className="flex items-center justify-between text-muted">
        <p className="text-sm">{label}</p>
        <Icon size={17} />
      </div>
      <p className="mt-5 font-mono text-3xl font-semibold tracking-tight text-foreground">
        {value.toLocaleString()}
      </p>
      <p className="mt-2 text-xs text-muted">{note}</p>
    </div>
  );
}

function Breakdown({
  title,
  rows,
  empty = "No data yet.",
}: {
  title: string;
  rows: AnalyticsBreakdown[];
  empty?: string;
}) {
  const maximum = Math.max(1, ...rows.map((row) => row.value));

  return (
    <section className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
      <h3 className="font-medium text-foreground">{title}</h3>
      {rows.length ? (
        <div className="mt-5 grid gap-4">
          {rows.map((row) => (
            <div key={row.label}>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="truncate text-muted">{row.label}</span>
                <span className="font-mono text-foreground">{row.value}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${Math.max(4, (row.value / maximum) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm text-muted">{empty}</p>
      )}
    </section>
  );
}

export function AdminAnalyticsDashboard({ compact = false }: { compact?: boolean }) {
  const [days, setDays] = useState(30);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    void fetch(`/api/admin/analytics?days=${days}`, { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as {
          summary?: AnalyticsSummary;
          error?: string;
        };
        if (!response.ok || !data.summary) {
          throw new Error(data.error ?? "Could not load analytics.");
        }
        if (active) setSummary(data.summary);
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Could not load analytics.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [days]);

  const chartMaximum = useMemo(
    () => Math.max(1, ...(summary?.trend.map((point) => point.pageViews) ?? [1])),
    [summary],
  );

  return (
    <div className="mt-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
            {compact ? "Overview" : "Traffic analytics"}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            {compact ? "Portfolio performance at a glance" : "Understand where visitors come from"}
          </h2>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          Range
          <select
            value={days}
            onChange={(event) => {
              setLoading(true);
              setError("");
              setDays(Number(event.target.value));
            }}
            className="h-10 rounded-xl border border-line bg-panel px-3 text-foreground outline-none focus:border-accent"
          >
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
          </select>
        </label>
      </div>

      {loading ? <p className="mt-8 text-sm text-muted">Loading analytics...</p> : null}
      {error ? <p className="mt-8 text-sm text-red-500">{error}</p> : null}

      {summary ? (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Visitors" value={summary.visitors} note={`Unique daily visitors · ${summary.days} days`} icon={Users} />
            <MetricCard label="Page views" value={summary.pageViews} note="Public page loads" icon={Eye} />
            <MetricCard label="Contact clicks" value={summary.contactClicks} note="Email copy and open" icon={MousePointerClick} />
            <MetricCard label="Project clicks" value={summary.projectClicks} note="Projects and MilliyPrep" icon={ArrowUpRight} />
            <MetricCard label="Live now" value={summary.liveVisitors} note="Active in the last 30 minutes" icon={Activity} />
          </div>

          <section className="mt-4 rounded-2xl border border-line bg-panel p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-medium">Traffic trend</h3>
                <p className="mt-1 text-xs text-muted">Page views per day</p>
              </div>
              <span className="font-mono text-xs text-muted">
                Updated {new Date(summary.generatedAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="mt-6 flex h-48 items-end gap-1.5 overflow-hidden">
              {summary.trend.map((point) => (
                <div key={point.date} className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
                  <span className="hidden font-mono text-[10px] text-muted group-hover:block">
                    {point.pageViews}
                  </span>
                  <div
                    className="w-full min-w-1 rounded-t bg-accent/75 transition-colors group-hover:bg-accent"
                    style={{ height: `${Math.max(3, (point.pageViews / chartMaximum) * 100)}%` }}
                    title={`${point.date}: ${point.pageViews} page views, ${point.visitors} visitors`}
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <Breakdown title="Traffic sources" rows={summary.sources} />
            <Breakdown title="Campaigns" rows={summary.campaigns} />
            <Breakdown title="Top pages" rows={summary.pages} />
            {!compact ? <Breakdown title="Countries" rows={summary.countries} /> : null}
            {!compact ? <Breakdown title="Devices" rows={summary.devices} /> : null}
            {!compact ? <Breakdown title="Events" rows={summary.events} /> : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
