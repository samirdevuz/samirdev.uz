"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BarChart2,
  Check,
  Copy,
  Download,
  Eye,
  FileText,
  LayoutGrid,
  Link2,
  Lock,
  LogOut,
  MousePointerClick,
  Plus,
  RefreshCcw,
  Save,
  Server,
  Trash2,
  Users,
} from "lucide-react";
import type { BlogPost } from "@/data/blog";
import { defaultSiteContent } from "@/data/site-content";
import type { SiteContent } from "@/data/site-content";

type TabKey =
  | "overview"
  | "analytics"
  | "site-content"
  | "blog"
  | "campaigns"
  | "system";

type SiteContentSubTab = "en" | "uz" | "links";

const emptyPost: BlogPost = {
  title: "",
  slug: "",
  date: new Date().toISOString().slice(0, 10),
  category: "Notes",
  excerpt: "",
  readingTime: "2 min read",
  content: [""],
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type OverviewData = {
  visitors: number;
  pageViews: number;
  contactClicks: number;
  projectClicks: number;
  liveNow: number;
  trafficTrend: Array<{ date: string; views: number }>;
  trafficSources: Array<{ name: string; count: number }>;
  campaigns: Array<{ name: string; count: number }>;
  topPages: Array<{ page: string; count: number }>;
};

type AnalyticsData = {
  countries: Array<{ code: string; count: number }>;
  devices: Array<{ name: string; count: number }>;
  events: Array<{ name: string; count: number }>;
};

type SystemCheckSection = {
  title: string;
  ok: boolean;
  details: string[];
};

type SystemChecksData = {
  contentSummary: SystemCheckSection;
  seoChecks: SystemCheckSection;
  blogValidation: SystemCheckSection;
};

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  // Blog State
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [draft, setDraft] = useState<BlogPost>(emptyPost);

  // Overview & Analytics State
  const [dateRange, setDateRange] = useState("30 days");
  const [overview, setOverview] = useState<OverviewData>({
    visitors: 32,
    pageViews: 46,
    contactClicks: 1,
    projectClicks: 3,
    liveNow: 1,
    trafficTrend: [
      { date: "May 15", views: 2 },
      { date: "May 18", views: 4 },
      { date: "May 21", views: 3 },
      { date: "May 24", views: 8 },
      { date: "May 27", views: 5 },
      { date: "May 30", views: 12 },
      { date: "Jun 2", views: 6 },
      { date: "Jun 5", views: 15 },
      { date: "Jun 8", views: 9 },
      { date: "Jun 11", views: 14 },
    ],
    trafficSources: [
      { name: "Direct", count: 44 },
      { name: "ig", count: 3 },
    ],
    campaigns: [{ name: "No campaign", count: 47 }],
    topPages: [
      { page: "/", count: 45 },
      { page: "/blog/why-i-like-minimal-interfaces", count: 1 },
    ],
  });
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    countries: [
      { code: "UZ", count: 28 },
      { code: "US", count: 12 },
      { code: "CA", count: 2 },
      { code: "DE", count: 2 },
      { code: "FR", count: 1 },
      { code: "IL", count: 1 },
      { code: "IN", count: 1 },
    ],
    devices: [
      { name: "desktop", count: 35 },
      { name: "mobile", count: 12 },
    ],
    events: [
      { name: "page_view", count: 46 },
      { name: "scroll_25", count: 18 },
      { name: "scroll_50", count: 17 },
      { name: "scroll_75", count: 14 },
      { name: "scroll_100", count: 12 },
      { name: "language_change", count: 7 },
      { name: "social_click", count: 5 },
      { name: "command_menu_open", count: 4 },
      { name: "project_view", count: 2 },
      { name: "theme_change", count: 2 },
      { name: "blog_open", count: 1 },
      { name: "email_copy", count: 1 },
    ],
  });
  const [updatedTime, setUpdatedTime] = useState("3:16:21 PM");

  // Site Content State
  const [siteContentSubTab, setSiteContentSubTab] =
    useState<SiteContentSubTab>("en");
  const [siteContent, setSiteContent] =
    useState<SiteContent>(defaultSiteContent);

  // Campaigns State
  const [utmForm, setUtmForm] = useState({
    destination: "/",
    source: "instagram",
    medium: "social",
    campaign: "instagram_bio",
    content: "profile_link",
  });
  const [copiedUtm, setCopiedUtm] = useState(false);

  // System State
  const [systemChecks, setSystemChecks] = useState<SystemChecksData>({
    contentSummary: {
      title: "Content summary",
      ok: true,
      details: [
        "Blog posts: 3",
        "Latest post: Building MilliyPrep",
        "Storage provider: Supabase Postgres",
        "Supabase public reads: configured",
        "Supabase admin writes: configured",
        "Featured product: MilliyPrep",
        "Grid products exclude MilliyPrep to avoid duplicates.",
      ],
    },
    seoChecks: {
      title: "SEO checks",
      ok: true,
      details: [
        "Homepage metadata is configured.",
        "Robots route is configured.",
        "Sitemap route is configured.",
        "Open Graph image is configured.",
        "3 public blog posts can be indexed.",
      ],
    },
    blogValidation: {
      title: "Blog validation",
      ok: true,
      details: ["3 posts are valid."],
    },
  });

  // UI status
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedPost = useMemo(
    () => posts.find((post) => post.slug === selectedSlug),
    [posts, selectedSlug],
  );

  async function loadPosts() {
    try {
      const response = await fetch("/api/admin/posts", { cache: "no-store" });
      if (response.ok) {
        const data = (await response.json()) as { posts: BlogPost[] };
        setPosts(data.posts);
        if (data.posts.length > 0 && !selectedSlug) {
          setSelectedSlug(data.posts[0].slug);
          setDraft(data.posts[0]);
        }
      }
    } catch {
      // ignore
    }
  }

  async function loadSystemChecks() {
    try {
      const response = await fetch("/api/admin/tools", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "all" }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.checks) setSystemChecks(data.checks);
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let isMounted = true;

    async function init() {
      const [pRes, aRes, scRes, sysRes] = await Promise.all([
        fetch("/api/admin/posts", { cache: "no-store" }).catch(() => null),
        fetch(`/api/admin/analytics?range=${encodeURIComponent(dateRange)}`, {
          cache: "no-store",
        }).catch(() => null),
        fetch("/api/admin/site-content", { cache: "no-store" }).catch(
          () => null,
        ),
        fetch("/api/admin/tools", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "all" }),
        }).catch(() => null),
      ]);

      if (!isMounted) return;

      if (pRes?.ok) {
        const data = await pRes.json();
        if (data.posts) {
          setPosts(data.posts);
          if (data.posts.length > 0 && !selectedSlug) {
            setSelectedSlug(data.posts[0].slug);
            setDraft(data.posts[0]);
          }
        }
      }
      if (aRes?.ok) {
        const data = await aRes.json();
        if (data.overview) setOverview(data.overview);
        if (data.analytics) setAnalytics(data.analytics);
        if (data.updatedAt) setUpdatedTime(data.updatedAt);
      }
      if (scRes?.ok) {
        const data = await scRes.json();
        if (data.content) setSiteContent(data.content);
      }
      if (sysRes?.ok) {
        const data = await sysRes.json();
        if (data.checks) setSystemChecks(data.checks);
      }

      setUpdatedTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, selectedSlug, dateRange]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");

    const response = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setError("Wrong admin password.");
      return;
    }

    setPassword("");
    setIsAuthenticated(true);
    setStatus("Admin access enabled.");
  }

  async function logout() {
    await fetch("/api/admin/verify", { method: "DELETE" });
    setIsAuthenticated(false);
    setPosts([]);
    setSelectedSlug("");
    setDraft(emptyPost);
    setStatus("");
    setError("");
  }

  function startNewPost() {
    setActiveTab("blog");
    setSelectedSlug("");
    setDraft(emptyPost);
    setStatus("");
    setError("");
  }

  function selectPost(post: BlogPost) {
    setSelectedSlug(post.slug);
    setDraft(post);
    setStatus("");
    setError("");
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");

    const post = {
      ...draft,
      slug: draft.slug ? slugify(draft.slug) : slugify(draft.title),
      content: draft.content
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
    };

    const response = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "upsert",
        post,
        originalSlug: selectedSlug,
      }),
    });

    const data = (await response.json()) as {
      posts?: BlogPost[];
      error?: string;
    };

    if (!response.ok || !data.posts) {
      setError(data.error ?? "Could not save post.");
      return;
    }

    setPosts(data.posts);
    setSelectedSlug(post.slug);
    setDraft(post);
    setStatus("Post saved. Refresh the public blog to see the update.");
  }

  async function deletePost() {
    if (!draft.slug) {
      return;
    }

    const response = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "delete", slug: draft.slug }),
    });

    const data = (await response.json()) as {
      posts?: BlogPost[];
      error?: string;
    };

    if (!response.ok || !data.posts) {
      setError(data.error ?? "Could not delete post.");
      return;
    }

    setPosts(data.posts);
    setSelectedSlug(data.posts[0]?.slug ?? "");
    setDraft(data.posts[0] ?? emptyPost);
    setStatus("Post deleted.");
  }

  async function saveSiteContent() {
    setLoading(true);
    setError("");
    setStatus("");

    try {
      const response = await fetch("/api/admin/site-content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content: siteContent }),
      });

      if (!response.ok) {
        throw new Error("Could not save site content.");
      }

      const data = await response.json();
      if (data.content) {
        setSiteContent(data.content);
      }
      setStatus("Site content saved and published to Supabase.");
    } catch (saveErr) {
      setError(
        saveErr instanceof Error
          ? saveErr.message
          : "Failed to save site content.",
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadPosts() {
    const blob = new Blob([`${JSON.stringify(posts, null, 2)}\n`], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "blog-posts.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Posts JSON downloaded.");
  }

  const generatedUtmUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (utmForm.source) params.set("utm_source", utmForm.source);
    if (utmForm.medium) params.set("utm_medium", utmForm.medium);
    if (utmForm.campaign) params.set("utm_campaign", utmForm.campaign);
    if (utmForm.content) params.set("utm_content", utmForm.content);
    const queryString = params.toString();
    const dest = utmForm.destination.startsWith("/")
      ? utmForm.destination
      : `/${utmForm.destination}`;
    return `https://samirdev.uz${dest}${queryString ? `?${queryString}` : ""}`;
  }, [utmForm]);

  const copyCampaignLink = () => {
    navigator.clipboard.writeText(generatedUtmUrl);
    setCopiedUtm(true);
    setTimeout(() => setCopiedUtm(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background px-5 py-24 text-foreground sm:px-8">
        <div className="mx-auto max-w-md rounded-2xl border border-line bg-panel p-6 shadow-[var(--shadow)]">
          <div className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Lock size={18} />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">
            Admin access
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Sign in to manage blog posts and portfolio content. Set
            <code className="mx-1 rounded bg-panel-soft px-1.5 py-0.5 font-mono">
              ADMIN_PASSWORD
            </code>
            before using admin.
          </p>

          <form onSubmit={handleLogin} className="mt-6 grid gap-3">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin password"
              className="h-11 rounded-xl border border-line bg-background px-4 text-sm outline-none transition-colors focus:border-accent"
            />
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-all duration-300 hover:-translate-y-0.5"
            >
              Enter admin
            </button>
          </form>

          {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
          <Link
            href="/"
            className="mt-6 inline-block text-sm text-muted transition-colors hover:text-accent"
          >
            Back to site
          </Link>
        </div>
      </main>
    );
  }

  // Calculate max count helper for progress bars
  const maxCountryCount = Math.max(
    ...analytics.countries.map((c) => c.count),
    1,
  );
  const maxDeviceCount = Math.max(
    ...analytics.devices.map((d) => d.count),
    1,
  );
  const maxEventCount = Math.max(...analytics.events.map((e) => e.count), 1);
  const maxTrafficSourceCount = Math.max(
    ...overview.trafficSources.map((s) => s.count),
    1,
  );
  const maxCampaignCount = Math.max(
    ...overview.campaigns.map((c) => c.count),
    1,
  );
  const maxPageCount = Math.max(
    ...overview.topPages.map((p) => p.count),
    1,
  );

  return (
    <main className="min-h-screen bg-background px-5 py-12 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Bar */}
        <div className="flex flex-col justify-between gap-6 border-b border-line pb-6 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
              ADMIN
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Portfolio control center
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Monitor traffic, manage campaigns, edit site copy, publish blog
              posts, and check system health from one place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={startNewPost}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-all duration-300 hover:-translate-y-0.5"
            >
              <Plus size={15} />
              New post
            </button>
            <Link
              href="/blog"
              className="inline-flex h-10 items-center rounded-full border border-line bg-panel px-4 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
            >
              View blog
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-panel px-4 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        </div>

        {/* Tab Bar Navigation */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { id: "overview", label: "Overview", icon: LayoutGrid },
            { id: "analytics", label: "Analytics", icon: BarChart2 },
            { id: "site-content", label: "Site content", icon: FileText },
            { id: "blog", label: "Blog", icon: FileText },
            { id: "campaigns", label: "Campaigns", icon: Link2 },
            { id: "system", label: "System", icon: Server },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabKey)}
                className={`inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-foreground text-background shadow-sm"
                    : "border border-line bg-panel text-foreground hover:bg-panel-soft hover:border-accent"
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" ? (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
                  OVERVIEW
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                  Portfolio performance at a glance
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">Range</span>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="h-9 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                >
                  <option value="7 days">7 days</option>
                  <option value="14 days">14 days</option>
                  <option value="30 days">30 days</option>
                  <option value="90 days">90 days</option>
                </select>
              </div>
            </div>

            {/* 5 Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted">
                  <span className="text-sm font-medium text-foreground">
                    Visitors
                  </span>
                  <Users size={16} />
                </div>
                <p className="mt-4 text-3xl font-semibold tracking-tight">
                  {overview.visitors}
                </p>
                <p className="mt-2 text-xs text-muted">
                  Unique daily visitors - {dateRange}
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted">
                  <span className="text-sm font-medium text-foreground">
                    Page views
                  </span>
                  <Eye size={16} />
                </div>
                <p className="mt-4 text-3xl font-semibold tracking-tight">
                  {overview.pageViews}
                </p>
                <p className="mt-2 text-xs text-muted">Public page loads</p>
              </div>

              <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted">
                  <span className="text-sm font-medium text-foreground">
                    Contact clicks
                  </span>
                  <MousePointerClick size={16} />
                </div>
                <p className="mt-4 text-3xl font-semibold tracking-tight">
                  {overview.contactClicks}
                </p>
                <p className="mt-2 text-xs text-muted">Email copy and open</p>
              </div>

              <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted">
                  <span className="text-sm font-medium text-foreground">
                    Project clicks
                  </span>
                  <ArrowUpRight size={16} />
                </div>
                <p className="mt-4 text-3xl font-semibold tracking-tight">
                  {overview.projectClicks}
                </p>
                <p className="mt-2 text-xs text-muted">Projects and MilliyPrep</p>
              </div>

              <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted">
                  <span className="text-sm font-medium text-foreground">
                    Live now
                  </span>
                  <Activity size={16} />
                </div>
                <p className="mt-4 text-3xl font-semibold tracking-tight">
                  {overview.liveNow}
                </p>
                <p className="mt-2 text-xs text-muted">
                  Active in the last 30 minutes
                </p>
              </div>
            </div>

            {/* Traffic trend Chart Panel */}
            <div className="rounded-2xl border border-line bg-panel p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">Traffic trend</h3>
                  <p className="text-xs text-muted">Page views per day</p>
                </div>
                <span className="font-mono text-xs text-muted">
                  Updated {updatedTime}
                </span>
              </div>

              <div className="mt-8 flex h-44 items-end gap-3 px-2 pt-4">
                {overview.trafficTrend.map((item) => {
                  const maxViews = Math.max(
                    ...overview.trafficTrend.map((t) => t.views),
                    1,
                  );
                  const heightPercent = Math.max(
                    (item.views / maxViews) * 100,
                    8,
                  );
                  return (
                    <div
                      key={item.date}
                      className="group relative flex flex-1 flex-col items-center gap-2"
                    >
                      <div
                        className="w-full rounded-t bg-[#1c3e2e] transition-all duration-300 group-hover:bg-accent"
                        style={{ height: `${heightPercent}%` }}
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-foreground px-1.5 py-0.5 font-mono text-[10px] text-background opacity-0 transition-opacity group-hover:opacity-100">
                          {item.views}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-muted">
                        {item.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom 3 Panels */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Traffic sources */}
              <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
                <h3 className="text-sm font-semibold">Traffic sources</h3>
                <div className="mt-4 space-y-4">
                  {overview.trafficSources.map((source) => (
                    <div key={source.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span>{source.name}</span>
                        <span className="font-mono">{source.count}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-line">
                        <div
                          className="h-full rounded-full bg-[#1c3e2e]"
                          style={{
                            width: `${(source.count / maxTrafficSourceCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campaigns */}
              <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
                <h3 className="text-sm font-semibold">Campaigns</h3>
                <div className="mt-4 space-y-4">
                  {overview.campaigns.map((camp) => (
                    <div key={camp.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span>{camp.name}</span>
                        <span className="font-mono">{camp.count}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-line">
                        <div
                          className="h-full rounded-full bg-[#1c3e2e]"
                          style={{
                            width: `${(camp.count / maxCampaignCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top pages */}
              <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
                <h3 className="text-sm font-semibold">Top pages</h3>
                <div className="mt-4 space-y-4">
                  {overview.topPages.map((page) => (
                    <div key={page.page} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="truncate pr-2 font-mono">
                          {page.page}
                        </span>
                        <span className="font-mono">{page.count}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-line">
                        <div
                          className="h-full rounded-full bg-[#1c3e2e]"
                          style={{
                            width: `${(page.count / maxPageCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* TAB 2: ANALYTICS */}
        {activeTab === "analytics" ? (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {/* Countries Panel */}
            <div className="rounded-2xl border border-line bg-panel p-6 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight">Countries</h2>
              <div className="mt-6 space-y-4">
                {analytics.countries.map((c) => (
                  <div key={c.code} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span className="font-mono">{c.code}</span>
                      <span className="font-mono">{c.count}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-[#1c3e2e]"
                        style={{
                          width: `${(c.count / maxCountryCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Devices Panel */}
            <div className="rounded-2xl border border-line bg-panel p-6 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight">Devices</h2>
              <div className="mt-6 space-y-4">
                {analytics.devices.map((d) => (
                  <div key={d.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>{d.name}</span>
                      <span className="font-mono">{d.count}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-[#1c3e2e]"
                        style={{
                          width: `${(d.count / maxDeviceCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events Panel */}
            <div className="rounded-2xl border border-line bg-panel p-6 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight">Events</h2>
              <div className="mt-6 space-y-4">
                {analytics.events.map((e) => (
                  <div key={e.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span className="font-mono text-xs">{e.name}</span>
                      <span className="font-mono">{e.count}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-[#1c3e2e]"
                        style={{
                          width: `${(e.count / maxEventCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* TAB 3: SITE CONTENT */}
        {activeTab === "site-content" ? (
          <div className="mt-8 rounded-2xl border border-line bg-panel p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
                  SITE CONTENT
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                  Edit portfolio copy and links
                </h2>
                <p className="mt-2 max-w-2xl text-xs text-muted">
                  Changes are stored in Supabase and published immediately.
                  Technical icon and layout settings stay protected in code.
                </p>
              </div>
              <button
                type="button"
                onClick={saveSiteContent}
                disabled={loading}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-all duration-300 hover:-translate-y-0.5"
              >
                <Save size={15} />
                {loading ? "Saving..." : "Save and publish"}
              </button>
            </div>

            {/* Sub Tabs */}
            <div className="mt-6 flex gap-2 border-b border-line pb-4">
              {[
                { id: "en", label: "English" },
                { id: "uz", label: "O'zbekcha" },
                { id: "links", label: "Profile & links" },
              ].map((subTab) => (
                <button
                  key={subTab.id}
                  type="button"
                  onClick={() =>
                    setSiteContentSubTab(subTab.id as SiteContentSubTab)
                  }
                  className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                    siteContentSubTab === subTab.id
                      ? "bg-foreground text-background"
                      : "border border-line bg-panel hover:bg-panel-soft text-foreground"
                  }`}
                >
                  {subTab.label}
                </button>
              ))}
            </div>

            {/* SubTab Content */}
            {siteContentSubTab === "en" || siteContentSubTab === "uz" ? (
              <div className="mt-6 grid gap-6">
                {/* Hero Section Fields */}
                <div className="rounded-xl border border-line bg-background p-5">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    Hero Section ({siteContentSubTab.toUpperCase()})
                  </h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="grid gap-1.5 text-xs font-medium">
                      Hero Badge
                      <input
                        value={siteContent[siteContentSubTab].heroBadge}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              heroBadge: e.target.value,
                            },
                          }))
                        }
                        className="h-10 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium">
                      Hero Title
                      <input
                        value={siteContent[siteContentSubTab].heroTitle}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              heroTitle: e.target.value,
                            },
                          }))
                        }
                        className="h-10 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium md:col-span-2">
                      Hero Text / Bio
                      <textarea
                        value={siteContent[siteContentSubTab].heroText}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              heroText: e.target.value,
                            },
                          }))
                        }
                        rows={3}
                        className="rounded-xl border border-line bg-panel p-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium">
                      View Projects Button Label
                      <input
                        value={siteContent[siteContentSubTab].viewProjects}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              viewProjects: e.target.value,
                            },
                          }))
                        }
                        className="h-10 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium">
                      Open Command Menu Button Label
                      <input
                        value={siteContent[siteContentSubTab].openCommandMenu}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              openCommandMenu: e.target.value,
                            },
                          }))
                        }
                        className="h-10 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium md:col-span-2">
                      Hero Chips (comma separated)
                      <input
                        value={siteContent[siteContentSubTab].heroChips.join(
                          ", ",
                        )}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              heroChips: e.target.value
                                .split(",")
                                .map((s) => s.trim()),
                            },
                          }))
                        }
                        className="h-10 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                  </div>
                </div>

                {/* About Section Fields */}
                <div className="rounded-xl border border-line bg-background p-5">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    About Section ({siteContentSubTab.toUpperCase()})
                  </h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="grid gap-1.5 text-xs font-medium">
                      About Eyebrow
                      <input
                        value={siteContent[siteContentSubTab].aboutEyebrow}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              aboutEyebrow: e.target.value,
                            },
                          }))
                        }
                        className="h-10 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium">
                      About Title
                      <input
                        value={siteContent[siteContentSubTab].aboutTitle}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              aboutTitle: e.target.value,
                            },
                          }))
                        }
                        className="h-10 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium md:col-span-2">
                      About Text
                      <textarea
                        value={siteContent[siteContentSubTab].aboutText}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              aboutText: e.target.value,
                            },
                          }))
                        }
                        rows={2}
                        className="rounded-xl border border-line bg-panel p-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium md:col-span-2">
                      About Body Paragraph
                      <textarea
                        value={siteContent[siteContentSubTab].aboutBody}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              aboutBody: e.target.value,
                            },
                          }))
                        }
                        rows={4}
                        className="rounded-xl border border-line bg-panel p-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                  </div>
                </div>

                {/* Highlights */}
                <div className="rounded-xl border border-line bg-background p-5">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    Highlights ({siteContentSubTab.toUpperCase()})
                  </h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {siteContent[siteContentSubTab].highlights.map(
                      (hl, idx) => (
                        <div
                          key={idx}
                          className="space-y-2 rounded-lg border border-line bg-panel p-3"
                        >
                          <label className="grid gap-1 text-xs font-medium">
                            Title
                            <input
                              value={hl.title}
                              onChange={(e) => {
                                const newHl = [
                                  ...siteContent[siteContentSubTab].highlights,
                                ];
                                newHl[idx] = {
                                  ...newHl[idx],
                                  title: e.target.value,
                                };
                                setSiteContent((cur) => ({
                                  ...cur,
                                  [siteContentSubTab]: {
                                    ...cur[siteContentSubTab],
                                    highlights: newHl,
                                  },
                                }));
                              }}
                              className="h-9 rounded-lg border border-line bg-background px-2.5 text-xs outline-none focus:border-accent"
                            />
                          </label>
                          <label className="grid gap-1 text-xs font-medium">
                            Text
                            <textarea
                              value={hl.text}
                              onChange={(e) => {
                                const newHl = [
                                  ...siteContent[siteContentSubTab].highlights,
                                ];
                                newHl[idx] = {
                                  ...newHl[idx],
                                  text: e.target.value,
                                };
                                setSiteContent((cur) => ({
                                  ...cur,
                                  [siteContentSubTab]: {
                                    ...cur[siteContentSubTab],
                                    highlights: newHl,
                                  },
                                }));
                              }}
                              rows={3}
                              className="rounded-lg border border-line bg-background p-2.5 text-xs outline-none focus:border-accent"
                            />
                          </label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Skills Section Fields */}
                <div className="rounded-xl border border-line bg-background p-5">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    Skills Section ({siteContentSubTab.toUpperCase()})
                  </h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="grid gap-1.5 text-xs font-medium">
                      Skills Eyebrow
                      <input
                        value={siteContent[siteContentSubTab].skillsEyebrow}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              skillsEyebrow: e.target.value,
                            },
                          }))
                        }
                        className="h-10 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium">
                      Skills Title
                      <input
                        value={siteContent[siteContentSubTab].skillsTitle}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              skillsTitle: e.target.value,
                            },
                          }))
                        }
                        className="h-10 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium md:col-span-2">
                      Skills Text
                      <textarea
                        value={siteContent[siteContentSubTab].skillsText}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              skillsText: e.target.value,
                            },
                          }))
                        }
                        rows={2}
                        className="rounded-xl border border-line bg-panel p-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                  </div>

                  {/* Skill Groups */}
                  <div className="mt-6 space-y-4">
                    <p className="font-mono text-xs uppercase text-muted">
                      Skill Stack Groups
                    </p>
                    {siteContent[siteContentSubTab].skillGroups.map(
                      (sg, idx) => (
                        <div
                          key={sg.title}
                          className="grid gap-3 rounded-lg border border-line bg-panel p-4 md:grid-cols-2"
                        >
                          <label className="grid gap-1 text-xs font-medium">
                            Group Title
                            <input
                              value={sg.title}
                              onChange={(e) => {
                                const newSg = [
                                  ...siteContent[siteContentSubTab].skillGroups,
                                ];
                                newSg[idx] = {
                                  ...newSg[idx],
                                  title: e.target.value,
                                };
                                setSiteContent((cur) => ({
                                  ...cur,
                                  [siteContentSubTab]: {
                                    ...cur[siteContentSubTab],
                                    skillGroups: newSg,
                                  },
                                }));
                              }}
                              className="h-9 rounded-lg border border-line bg-background px-2.5 text-xs outline-none focus:border-accent"
                            />
                          </label>
                          <label className="grid gap-1 text-xs font-medium">
                            Skills (comma separated)
                            <input
                              value={sg.skills.join(", ")}
                              onChange={(e) => {
                                const newSg = [
                                  ...siteContent[siteContentSubTab].skillGroups,
                                ];
                                newSg[idx] = {
                                  ...newSg[idx],
                                  skills: e.target.value
                                    .split(",")
                                    .map((s) => s.trim()),
                                };
                                setSiteContent((cur) => ({
                                  ...cur,
                                  [siteContentSubTab]: {
                                    ...cur[siteContentSubTab],
                                    skillGroups: newSg,
                                  },
                                }));
                              }}
                              className="h-9 rounded-lg border border-line bg-background px-2.5 text-xs outline-none focus:border-accent"
                            />
                          </label>
                          <label className="grid gap-1 text-xs font-medium md:col-span-2">
                            Description
                            <textarea
                              value={sg.description}
                              onChange={(e) => {
                                const newSg = [
                                  ...siteContent[siteContentSubTab].skillGroups,
                                ];
                                newSg[idx] = {
                                  ...newSg[idx],
                                  description: e.target.value,
                                };
                                setSiteContent((cur) => ({
                                  ...cur,
                                  [siteContentSubTab]: {
                                    ...cur[siteContentSubTab],
                                    skillGroups: newSg,
                                  },
                                }));
                              }}
                              rows={2}
                              className="rounded-lg border border-line bg-background p-2.5 text-xs outline-none focus:border-accent"
                            />
                          </label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Projects Section Fields */}
                <div className="rounded-xl border border-line bg-background p-5">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    Projects & Cards ({siteContentSubTab.toUpperCase()})
                  </h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="grid gap-1.5 text-xs font-medium">
                      Projects Eyebrow
                      <input
                        value={siteContent[siteContentSubTab].projectsEyebrow}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              projectsEyebrow: e.target.value,
                            },
                          }))
                        }
                        className="h-10 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium">
                      Projects Title
                      <input
                        value={siteContent[siteContentSubTab].projectsTitle}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              projectsTitle: e.target.value,
                            },
                          }))
                        }
                        className="h-10 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium md:col-span-2">
                      Projects Text
                      <textarea
                        value={siteContent[siteContentSubTab].projectsText}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              projectsText: e.target.value,
                            },
                          }))
                        }
                        rows={2}
                        className="rounded-xl border border-line bg-panel p-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium md:col-span-2">
                      Projects Note
                      <input
                        value={siteContent[siteContentSubTab].projectsNote}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              projectsNote: e.target.value,
                            },
                          }))
                        }
                        className="h-10 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium">
                      MilliyPrep Live Label
                      <input
                        value={siteContent[siteContentSubTab].live}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              live: e.target.value,
                            },
                          }))
                        }
                        className="h-10 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium">
                      Problem Solved Label
                      <input
                        value={siteContent[siteContentSubTab].problemSolved}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              problemSolved: e.target.value,
                            },
                          }))
                        }
                        className="h-10 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium md:col-span-2">
                      MilliyPrep Description Text
                      <textarea
                        value={siteContent[siteContentSubTab].milliyPrepText}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              milliyPrepText: e.target.value,
                            },
                          }))
                        }
                        rows={3}
                        className="rounded-xl border border-line bg-panel p-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                  </div>

                  {/* Project Cards List */}
                  <div className="mt-6 space-y-4">
                    <p className="font-mono text-xs uppercase text-muted">
                      Grid Projects
                    </p>
                    {siteContent[siteContentSubTab].projectsList.map(
                      (proj, idx) => (
                        <div
                          key={proj.name}
                          className="grid gap-3 rounded-lg border border-line bg-panel p-4 md:grid-cols-2"
                        >
                          <label className="grid gap-1 text-xs font-medium">
                            Project Name
                            <input
                              value={proj.name}
                              onChange={(e) => {
                                const newP = [
                                  ...siteContent[siteContentSubTab]
                                    .projectsList,
                                ];
                                newP[idx] = {
                                  ...newP[idx],
                                  name: e.target.value,
                                };
                                setSiteContent((cur) => ({
                                  ...cur,
                                  [siteContentSubTab]: {
                                    ...cur[siteContentSubTab],
                                    projectsList: newP,
                                  },
                                }));
                              }}
                              className="h-9 rounded-lg border border-line bg-background px-2.5 text-xs outline-none focus:border-accent"
                            />
                          </label>
                          <label className="grid gap-1 text-xs font-medium">
                            Status Badge
                            <input
                              value={proj.status}
                              onChange={(e) => {
                                const newP = [
                                  ...siteContent[siteContentSubTab]
                                    .projectsList,
                                ];
                                newP[idx] = {
                                  ...newP[idx],
                                  status: e.target.value,
                                };
                                setSiteContent((cur) => ({
                                  ...cur,
                                  [siteContentSubTab]: {
                                    ...cur[siteContentSubTab],
                                    projectsList: newP,
                                  },
                                }));
                              }}
                              className="h-9 rounded-lg border border-line bg-background px-2.5 text-xs outline-none focus:border-accent"
                            />
                          </label>
                          <label className="grid gap-1 text-xs font-medium md:col-span-2">
                            Description
                            <textarea
                              value={proj.description}
                              onChange={(e) => {
                                const newP = [
                                  ...siteContent[siteContentSubTab]
                                    .projectsList,
                                ];
                                newP[idx] = {
                                  ...newP[idx],
                                  description: e.target.value,
                                };
                                setSiteContent((cur) => ({
                                  ...cur,
                                  [siteContentSubTab]: {
                                    ...cur[siteContentSubTab],
                                    projectsList: newP,
                                  },
                                }));
                              }}
                              rows={2}
                              className="rounded-lg border border-line bg-background p-2.5 text-xs outline-none focus:border-accent"
                            />
                          </label>
                          <label className="grid gap-1 text-xs font-medium md:col-span-2">
                            Problem Solved
                            <textarea
                              value={proj.problem}
                              onChange={(e) => {
                                const newP = [
                                  ...siteContent[siteContentSubTab]
                                    .projectsList,
                                ];
                                newP[idx] = {
                                  ...newP[idx],
                                  problem: e.target.value,
                                };
                                setSiteContent((cur) => ({
                                  ...cur,
                                  [siteContentSubTab]: {
                                    ...cur[siteContentSubTab],
                                    projectsList: newP,
                                  },
                                }));
                              }}
                              rows={2}
                              className="rounded-lg border border-line bg-background p-2.5 text-xs outline-none focus:border-accent"
                            />
                          </label>
                          {proj.youAreHereLabel !== undefined ? (
                            <label className="grid gap-1 text-xs font-medium md:col-span-2">
                              &quot;You are here&quot; Label (for Personal
                              Portfolio)
                              <input
                                value={proj.youAreHereLabel}
                                onChange={(e) => {
                                  const newP = [
                                    ...siteContent[siteContentSubTab]
                                      .projectsList,
                                  ];
                                  newP[idx] = {
                                    ...newP[idx],
                                    youAreHereLabel: e.target.value,
                                  };
                                  setSiteContent((cur) => ({
                                    ...cur,
                                    [siteContentSubTab]: {
                                      ...cur[siteContentSubTab],
                                      projectsList: newP,
                                    },
                                  }));
                                }}
                                className="h-9 rounded-lg border border-line bg-background px-2.5 text-xs outline-none focus:border-accent"
                              />
                            </label>
                          ) : null}
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Contact Section Fields */}
                <div className="rounded-xl border border-line bg-background p-5">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    Contact Section ({siteContentSubTab.toUpperCase()})
                  </h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="grid gap-1.5 text-xs font-medium">
                      Contact Eyebrow
                      <input
                        value={siteContent[siteContentSubTab].contactEyebrow}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              contactEyebrow: e.target.value,
                            },
                          }))
                        }
                        className="h-10 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium">
                      Contact Title
                      <input
                        value={siteContent[siteContentSubTab].contactTitle}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              contactTitle: e.target.value,
                            },
                          }))
                        }
                        className="h-10 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium md:col-span-2">
                      Contact Text
                      <textarea
                        value={siteContent[siteContentSubTab].contactText}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              contactText: e.target.value,
                            },
                          }))
                        }
                        rows={2}
                        className="rounded-xl border border-line bg-panel p-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium md:col-span-2">
                      UzCord Discord Card Text
                      <input
                        value={siteContent[siteContentSubTab].uzCordText}
                        onChange={(e) =>
                          setSiteContent((cur) => ({
                            ...cur,
                            [siteContentSubTab]: {
                              ...cur[siteContentSubTab],
                              uzCordText: e.target.value,
                            },
                          }))
                        }
                        className="h-10 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ) : null}

            {/* SubTab Profile & Links */}
            {siteContentSubTab === "links" ? (
              <div className="mt-6 grid gap-4 rounded-xl border border-line bg-background p-5 md:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-medium">
                  Contact Email
                  <input
                    value={siteContent.links.email}
                    onChange={(e) =>
                      setSiteContent((cur) => ({
                        ...cur,
                        links: { ...cur.links, email: e.target.value },
                      }))
                    }
                    className="h-10 rounded-xl border border-line bg-panel px-3 font-mono text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="grid gap-1.5 text-xs font-medium">
                  GitHub Profile URL
                  <input
                    value={siteContent.links.githubUrl}
                    onChange={(e) =>
                      setSiteContent((cur) => ({
                        ...cur,
                        links: { ...cur.links, githubUrl: e.target.value },
                      }))
                    }
                    className="h-10 rounded-xl border border-line bg-panel px-3 font-mono text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="grid gap-1.5 text-xs font-medium">
                  Telegram URL
                  <input
                    value={siteContent.links.telegramUrl}
                    onChange={(e) =>
                      setSiteContent((cur) => ({
                        ...cur,
                        links: { ...cur.links, telegramUrl: e.target.value },
                      }))
                    }
                    className="h-10 rounded-xl border border-line bg-panel px-3 font-mono text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="grid gap-1.5 text-xs font-medium">
                  Instagram URL
                  <input
                    value={siteContent.links.instagramUrl}
                    onChange={(e) =>
                      setSiteContent((cur) => ({
                        ...cur,
                        links: { ...cur.links, instagramUrl: e.target.value },
                      }))
                    }
                    className="h-10 rounded-xl border border-line bg-panel px-3 font-mono text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="grid gap-1.5 text-xs font-medium">
                  X Profile URL
                  <input
                    value={siteContent.links.xUrl}
                    onChange={(e) =>
                      setSiteContent((cur) => ({
                        ...cur,
                        links: { ...cur.links, xUrl: e.target.value },
                      }))
                    }
                    className="h-10 rounded-xl border border-line bg-panel px-3 font-mono text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="grid gap-1.5 text-xs font-medium">
                  Discord URL
                  <input
                    value={siteContent.links.discordUrl}
                    onChange={(e) =>
                      setSiteContent((cur) => ({
                        ...cur,
                        links: { ...cur.links, discordUrl: e.target.value },
                      }))
                    }
                    className="h-10 rounded-xl border border-line bg-panel px-3 font-mono text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="grid gap-1.5 text-xs font-medium">
                  Monkeytype Profile URL
                  <input
                    value={siteContent.links.monkeytypeUrl}
                    onChange={(e) =>
                      setSiteContent((cur) => ({
                        ...cur,
                        links: { ...cur.links, monkeytypeUrl: e.target.value },
                      }))
                    }
                    className="h-10 rounded-xl border border-line bg-panel px-3 font-mono text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="grid gap-1.5 text-xs font-medium">
                  MilliyPrep Live URL
                  <input
                    value={siteContent.links.milliyPrepUrl}
                    onChange={(e) =>
                      setSiteContent((cur) => ({
                        ...cur,
                        links: { ...cur.links, milliyPrepUrl: e.target.value },
                      }))
                    }
                    className="h-10 rounded-xl border border-line bg-panel px-3 font-mono text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="grid gap-1.5 text-xs font-medium">
                  3D Models Showcase URL
                  <input
                    value={siteContent.links.modelsUrl}
                    onChange={(e) =>
                      setSiteContent((cur) => ({
                        ...cur,
                        links: { ...cur.links, modelsUrl: e.target.value },
                      }))
                    }
                    className="h-10 rounded-xl border border-line bg-panel px-3 font-mono text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="grid gap-1.5 text-xs font-medium">
                  UzCord Invite URL
                  <input
                    value={siteContent.links.uzCordInviteUrl}
                    onChange={(e) =>
                      setSiteContent((cur) => ({
                        ...cur,
                        links: {
                          ...cur.links,
                          uzCordInviteUrl: e.target.value,
                        },
                      }))
                    }
                    className="h-10 rounded-xl border border-line bg-panel px-3 font-mono text-sm outline-none focus:border-accent"
                  />
                </label>
              </div>
            ) : null}

            {status ? (
              <p className="mt-4 flex items-center gap-2 text-sm text-accent">
                <Check size={16} /> {status}
              </p>
            ) : null}
            {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
          </div>
        ) : null}

        {/* TAB 4: BLOG */}
        {activeTab === "blog" ? (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadPosts}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-panel px-4 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
              >
                <RefreshCcw size={15} />
                Refresh posts
              </button>
              <button
                type="button"
                onClick={downloadPosts}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-panel px-4 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
              >
                <Download size={15} />
                Download JSON
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
              <aside className="rounded-2xl border border-line bg-panel p-3 shadow-sm">
                <div className="px-3 py-2 text-sm font-medium text-muted">
                  Posts
                </div>
                <div className="grid gap-2">
                  {posts.map((post) => (
                    <button
                      key={post.slug}
                      type="button"
                      onClick={() => selectPost(post)}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        selectedPost?.slug === post.slug
                          ? "border-accent bg-accent-soft"
                          : "border-line bg-background hover:border-accent/60"
                      }`}
                    >
                      <p className="font-medium">{post.title}</p>
                      <p className="mt-1 text-xs text-muted">
                        {post.category} · {post.date}
                      </p>
                    </button>
                  ))}
                </div>
              </aside>

              <form
                onSubmit={savePost}
                className="rounded-2xl border border-line bg-panel p-5 shadow-sm"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm">
                    Title
                    <input
                      value={draft.title}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          title: event.target.value,
                          slug: current.slug || slugify(event.target.value),
                        }))
                      }
                      className="h-11 rounded-xl border border-line bg-background px-4 outline-none focus:border-accent"
                    />
                  </label>
                  <label className="grid gap-2 text-sm">
                    Slug
                    <input
                      value={draft.slug}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          slug: slugify(event.target.value),
                        }))
                      }
                      className="h-11 rounded-xl border border-line bg-background px-4 font-mono outline-none focus:border-accent"
                    />
                  </label>
                  <label className="grid gap-2 text-sm">
                    Date
                    <input
                      type="date"
                      value={draft.date}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          date: event.target.value,
                        }))
                      }
                      className="h-11 rounded-xl border border-line bg-background px-4 outline-none focus:border-accent"
                    />
                  </label>
                  <label className="grid gap-2 text-sm">
                    Category
                    <input
                      value={draft.category}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          category: event.target.value,
                        }))
                      }
                      className="h-11 rounded-xl border border-line bg-background px-4 outline-none focus:border-accent"
                    />
                  </label>
                  <label className="grid gap-2 text-sm md:col-span-2">
                    Reading time
                    <input
                      value={draft.readingTime}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          readingTime: event.target.value,
                        }))
                      }
                      className="h-11 rounded-xl border border-line bg-background px-4 outline-none focus:border-accent"
                    />
                  </label>
                  <label className="grid gap-2 text-sm md:col-span-2">
                    Excerpt
                    <textarea
                      value={draft.excerpt}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          excerpt: event.target.value,
                        }))
                      }
                      rows={3}
                      className="rounded-xl border border-line bg-background px-4 py-3 outline-none focus:border-accent"
                    />
                  </label>
                  <label className="grid gap-2 text-sm md:col-span-2">
                    Content paragraphs
                    <textarea
                      value={draft.content.join("\n\n")}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          content: event.target.value.split(/\n\s*\n/),
                        }))
                      }
                      rows={12}
                      className="rounded-xl border border-line bg-background px-4 py-3 leading-7 outline-none focus:border-accent"
                    />
                  </label>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Save size={15} />
                    Save post
                  </button>
                  {draft.slug ? (
                    <button
                      type="button"
                      onClick={deletePost}
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-panel px-5 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-red-400"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  ) : null}
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                    <Check size={14} className="text-accent" />
                    Admin access enabled.
                  </span>
                </div>
                {status ? (
                  <p className="mt-3 flex items-center gap-1.5 text-sm text-accent">
                    <Check size={15} />
                    {status}
                  </p>
                ) : null}
                {error ? (
                  <p className="mt-3 text-sm text-red-500">{error}</p>
                ) : null}
              </form>
            </div>
          </div>
        ) : null}

        {/* TAB 5: CAMPAIGNS */}
        {activeTab === "campaigns" ? (
          <div className="mt-8 rounded-2xl border border-line bg-panel p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Link2 size={18} />
              </span>
              <div>
                <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
                  CAMPAIGNS
                </p>
                <h2 className="text-2xl font-semibold tracking-tight">
                  UTM link builder
                </h2>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted">
              Create consistent links for Instagram, Telegram, GitHub, or any
              campaign. Visits will appear in Analytics automatically.
            </p>

            {/* Presets */}
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setUtmForm({
                    destination: "/",
                    source: "instagram",
                    medium: "social",
                    campaign: "instagram_bio",
                    content: "profile_link",
                  })
                }
                className="rounded-full border border-line bg-panel px-4 py-2 text-xs font-medium hover:border-accent hover:bg-panel-soft"
              >
                Instagram bio
              </button>
              <button
                type="button"
                onClick={() =>
                  setUtmForm({
                    destination: "/",
                    source: "telegram",
                    medium: "channel",
                    campaign: "telegram_channel",
                    content: "post_link",
                  })
                }
                className="rounded-full border border-line bg-panel px-4 py-2 text-xs font-medium hover:border-accent hover:bg-panel-soft"
              >
                Telegram channel
              </button>
              <button
                type="button"
                onClick={() =>
                  setUtmForm({
                    destination: "/",
                    source: "github",
                    medium: "profile",
                    campaign: "github_profile",
                    content: "readme",
                  })
                }
                className="rounded-full border border-line bg-panel px-4 py-2 text-xs font-medium hover:border-accent hover:bg-panel-soft"
              >
                GitHub profile
              </button>
            </div>

            {/* UTM Form Fields */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-medium">
                Destination
                <input
                  value={utmForm.destination}
                  onChange={(e) =>
                    setUtmForm((cur) => ({
                      ...cur,
                      destination: e.target.value,
                    }))
                  }
                  className="h-10 rounded-xl border border-line bg-background px-3 font-mono text-sm outline-none focus:border-accent"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-medium">
                Source
                <input
                  value={utmForm.source}
                  onChange={(e) =>
                    setUtmForm((cur) => ({ ...cur, source: e.target.value }))
                  }
                  className="h-10 rounded-xl border border-line bg-background px-3 font-mono text-sm outline-none focus:border-accent"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-medium">
                Medium
                <input
                  value={utmForm.medium}
                  onChange={(e) =>
                    setUtmForm((cur) => ({ ...cur, medium: e.target.value }))
                  }
                  className="h-10 rounded-xl border border-line bg-background px-3 font-mono text-sm outline-none focus:border-accent"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-medium">
                Campaign
                <input
                  value={utmForm.campaign}
                  onChange={(e) =>
                    setUtmForm((cur) => ({ ...cur, campaign: e.target.value }))
                  }
                  className="h-10 rounded-xl border border-line bg-background px-3 font-mono text-sm outline-none focus:border-accent"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-medium md:col-span-2">
                Content
                <input
                  value={utmForm.content}
                  onChange={(e) =>
                    setUtmForm((cur) => ({ ...cur, content: e.target.value }))
                  }
                  className="h-10 rounded-xl border border-line bg-background px-3 font-mono text-sm outline-none focus:border-accent"
                />
              </label>
            </div>

            {/* UTM Output Box */}
            <div className="mt-6 space-y-4 rounded-xl border border-line bg-panel-soft p-4">
              <p className="break-all font-mono text-xs text-muted">
                {generatedUtmUrl}
              </p>
              <button
                type="button"
                onClick={copyCampaignLink}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-all duration-300 hover:-translate-y-0.5"
              >
                {copiedUtm ? <Check size={15} /> : <Copy size={15} />}
                {copiedUtm ? "Copied campaign link" : "Copy campaign link"}
              </button>
            </div>
          </div>
        ) : null}

        {/* TAB 6: SYSTEM */}
        {activeTab === "system" ? (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
                  SYSTEM
                </p>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Content and infrastructure health
                </h2>
              </div>
              <button
                type="button"
                onClick={loadSystemChecks}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-panel px-4 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
              >
                <RefreshCcw size={15} />
                Refresh checks
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Content Summary */}
              <div className="rounded-2xl border border-line bg-panel p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Check size={16} />
                  </span>
                  <h3 className="text-base font-semibold">
                    {systemChecks.contentSummary.title}
                  </h3>
                </div>
                <ul className="mt-6 space-y-3 text-xs leading-6 text-muted">
                  {systemChecks.contentSummary.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>

              {/* SEO Checks */}
              <div className="rounded-2xl border border-line bg-panel p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Check size={16} />
                  </span>
                  <h3 className="text-base font-semibold">
                    {systemChecks.seoChecks.title}
                  </h3>
                </div>
                <ul className="mt-6 space-y-3 text-xs leading-6 text-muted">
                  {systemChecks.seoChecks.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>

              {/* Blog Validation */}
              <div className="rounded-2xl border border-line bg-panel p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Check size={16} />
                  </span>
                  <h3 className="text-base font-semibold">
                    {systemChecks.blogValidation.title}
                  </h3>
                </div>
                <ul className="mt-6 space-y-3 text-xs leading-6 text-muted">
                  {systemChecks.blogValidation.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
