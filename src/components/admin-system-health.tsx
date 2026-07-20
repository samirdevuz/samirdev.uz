"use client";

import { useEffect, useState } from "react";
import { Check, RefreshCcw, Server, TriangleAlert } from "lucide-react";

type ToolResult = {
  title: string;
  ok: boolean;
  details: string[];
};

export function AdminSystemHealth() {
  const [results, setResults] = useState<ToolResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const actions = ["content-summary", "seo-check", "validate-blog"] as const;
      const nextResults = await Promise.all(
        actions.map(async (action) => {
          const response = await fetch("/api/admin/tools", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action }),
          });
          const data = (await response.json()) as { result?: ToolResult; error?: string };
          if (!response.ok || !data.result) throw new Error(data.error ?? "System check failed.");
          return data.result;
        }),
      );
      setResults(nextResults);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "System check failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    void Promise.all(
      (["content-summary", "seo-check", "validate-blog"] as const).map(async (action) => {
        const response = await fetch("/api/admin/tools", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action }),
        });
        const data = (await response.json()) as { result?: ToolResult; error?: string };
        if (!response.ok || !data.result) throw new Error(data.error ?? "System check failed.");
        return data.result;
      }),
    )
      .then((nextResults) => {
        if (active) setResults(nextResults);
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "System check failed.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mt-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">System</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Content and infrastructure health</h2>
        </div>
        <button type="button" onClick={load} className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-panel px-4 text-sm font-medium">
          <RefreshCcw size={15} /> Refresh checks
        </button>
      </div>
      {loading ? <p className="mt-6 text-sm text-muted">Running system checks...</p> : null}
      {error ? <p className="mt-6 text-sm text-red-500">{error}</p> : null}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {results.map((result) => (
          <article key={result.title} className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className={`flex size-9 items-center justify-center rounded-lg ${result.ok ? "bg-accent-soft text-accent" : "bg-red-500/10 text-red-500"}`}>
                {result.ok ? <Check size={17} /> : <TriangleAlert size={17} />}
              </span>
              <h3 className="font-medium">{result.title}</h3>
            </div>
            <ul className="mt-5 grid gap-2 text-sm leading-6 text-muted">
              {result.details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
          </article>
        ))}
        {!loading && !results.length && !error ? (
          <div className="rounded-2xl border border-line bg-panel p-5 text-sm text-muted"><Server size={18} /> No system data.</div>
        ) : null}
      </div>
    </section>
  );
}
