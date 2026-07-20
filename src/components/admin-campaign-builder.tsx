"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";

const presets = [
  { label: "Instagram bio", source: "instagram", medium: "social", campaign: "instagram_bio", content: "profile_link" },
  { label: "Telegram channel", source: "telegram", medium: "social", campaign: "telegram_channel", content: "post_link" },
  { label: "GitHub profile", source: "github", medium: "referral", campaign: "github_profile", content: "profile_link" },
];

export function AdminCampaignBuilder() {
  const [destination, setDestination] = useState("/");
  const [source, setSource] = useState("instagram");
  const [medium, setMedium] = useState("social");
  const [campaign, setCampaign] = useState("instagram_bio");
  const [content, setContent] = useState("profile_link");
  const [copied, setCopied] = useState(false);

  const url = useMemo(() => {
    const result = new URL(destination || "/", "https://samirdev.uz");
    result.searchParams.set("utm_source", source.trim().toLowerCase());
    result.searchParams.set("utm_medium", medium.trim().toLowerCase());
    result.searchParams.set("utm_campaign", campaign.trim().toLowerCase());
    if (content.trim()) result.searchParams.set("utm_content", content.trim().toLowerCase());
    return result.toString();
  }, [campaign, content, destination, medium, source]);

  const applyPreset = (preset: (typeof presets)[number]) => {
    setSource(preset.source);
    setMedium(preset.medium);
    setCampaign(preset.campaign);
    setContent(preset.content);
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="mt-8 rounded-2xl border border-line bg-panel p-5 shadow-sm sm:p-6">
      <div className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
        <Link2 size={18} />
      </div>
      <p className="mt-6 font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">Campaigns</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">UTM link builder</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        Create consistent links for Instagram, Telegram, GitHub, or any campaign. Visits will appear in Analytics automatically.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button key={preset.label} type="button" onClick={() => applyPreset(preset)} className="rounded-full border border-line bg-panel-soft px-4 py-2 text-sm transition-colors hover:border-accent">
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          ["Destination", destination, setDestination],
          ["Source", source, setSource],
          ["Medium", medium, setMedium],
          ["Campaign", campaign, setCampaign],
          ["Content", content, setContent],
        ].map(([label, value, setter]) => (
          <label key={label as string} className="grid gap-2 text-sm">
            {label as string}
            <input value={value as string} onChange={(event) => (setter as (value: string) => void)(event.target.value)} className="h-11 rounded-xl border border-line bg-background px-4 font-mono text-sm outline-none focus:border-accent" />
          </label>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-line bg-background p-4">
        <p className="break-all font-mono text-xs leading-6 text-muted">{url}</p>
        <button type="button" onClick={copyUrl} className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background">
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied" : "Copy campaign link"}
        </button>
      </div>
    </section>
  );
}
