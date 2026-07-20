"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Save } from "lucide-react";
import type { SiteContent } from "@/data/site-content";

type ContentView = "en" | "uz" | "profile";
type FlatField = { path: Array<string | number>; value: string };

function flattenStrings(
  value: unknown,
  path: Array<string | number> = [],
): FlatField[] {
  if (typeof value === "string") return [{ path, value }];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => flattenStrings(item, [...path, index]));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      flattenStrings(item, [...path, key]),
    );
  }
  return [];
}

function setStringAtPath(
  content: SiteContent,
  path: Array<string | number>,
  value: string,
) {
  const clone = structuredClone(content) as unknown as Record<string, unknown>;
  let current: unknown = clone;

  path.slice(0, -1).forEach((segment) => {
    current = (current as Record<string | number, unknown>)[segment];
  });

  (current as Record<string | number, unknown>)[path.at(-1)!] = value;
  return clone as unknown as SiteContent;
}

function labelForPath(path: Array<string | number>, prefixLength: number) {
  return path
    .slice(prefixLength)
    .map((segment) =>
      typeof segment === "number"
        ? `#${segment + 1}`
        : segment.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " "),
    )
    .join(" · ");
}

export function AdminSiteContentEditor() {
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [view, setView] = useState<ContentView>("en");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void fetch("/api/admin/content", { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as { content?: SiteContent; error?: string };
        if (!response.ok || !data.content) {
          throw new Error(data.error ?? "Could not load site content.");
        }
        if (active) setDraft(data.content);
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load site content.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const fields = useMemo(() => {
    if (!draft) return [];
    if (view === "profile") {
      return [
        ...flattenStrings(draft.profile, ["profile"]),
        ...flattenStrings(draft.socialLinks, ["socialLinks"]),
      ].filter((field) => !["id", "visual"].includes(String(field.path.at(-1))));
    }
    return flattenStrings(draft.locales[view], ["locales", view]).filter(
      (field) => !["id", "visual"].includes(String(field.path.at(-1))),
    );
  }, [draft, view]);

  const prefixLength = view === "profile" ? 1 : 2;

  const saveContent = async () => {
    if (!draft) return;
    setSaving(true);
    setError("");
    setStatus("");

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content: draft }),
      });
      const data = (await response.json()) as { content?: SiteContent; error?: string };
      if (!response.ok || !data.content) {
        throw new Error(data.error ?? "Could not save site content.");
      }
      setDraft(data.content);
      setStatus("Site content saved and published.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save site content.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-8 rounded-2xl border border-line bg-panel p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">Site content</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Edit portfolio copy and links</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Changes are stored in Supabase and published immediately. Technical icon and layout settings stay protected in code.
          </p>
        </div>
        <button type="button" onClick={saveContent} disabled={!draft || saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background disabled:opacity-50">
          <Save size={15} /> {saving ? "Publishing..." : "Save and publish"}
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-line pb-4">
        {([
          ["en", "English"],
          ["uz", "O'zbekcha"],
          ["profile", "Profile & links"],
        ] as const).map(([id, label]) => (
          <button key={id} type="button" onClick={() => setView(id)} className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${view === id ? "bg-foreground text-background" : "border border-line bg-panel-soft text-muted hover:text-foreground"}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? <p className="mt-6 text-sm text-muted">Loading site content...</p> : null}
      {error ? <p className="mt-6 text-sm text-red-500">{error}</p> : null}
      {status ? <p className="mt-6 inline-flex items-center gap-2 text-sm text-accent"><Check size={15} />{status}</p> : null}

      {draft ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {fields.map((field) => {
            const label = labelForPath(field.path, prefixLength);
            const isLong = field.value.length > 90 || /text|description|detail|problem|body/i.test(label);
            const key = field.path.join(".");
            return (
              <label key={key} className={`grid gap-2 text-sm ${isLong ? "lg:col-span-2" : ""}`}>
                <span className="capitalize text-muted">{label}</span>
                {isLong ? (
                  <textarea value={field.value} onChange={(event) => setDraft((current) => current ? setStringAtPath(current, field.path, event.target.value) : current)} rows={3} className="rounded-xl border border-line bg-background px-4 py-3 leading-6 text-foreground outline-none focus:border-accent" />
                ) : (
                  <input value={field.value} onChange={(event) => setDraft((current) => current ? setStringAtPath(current, field.path, event.target.value) : current)} className="h-11 rounded-xl border border-line bg-background px-4 text-foreground outline-none focus:border-accent" />
                )}
              </label>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
