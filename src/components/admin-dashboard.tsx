"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Lock, LogOut, Plus, Save, Trash2 } from "lucide-react";
import type { BlogPost } from "@/data/blog";

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

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [draft, setDraft] = useState<BlogPost>(emptyPost);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const selectedPost = useMemo(
    () => posts.find((post) => post.slug === selectedSlug),
    [posts, selectedSlug],
  );

  async function loadPosts() {
    const response = await fetch("/api/admin/posts", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Could not load posts.");
    }

    const data = (await response.json()) as { posts: BlogPost[] };
    setPosts(data.posts);
    setSelectedSlug(data.posts[0]?.slug ?? "");
    setDraft(data.posts[0] ?? emptyPost);
  }

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
    await loadPosts();
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
      content: draft.content.map((paragraph) => paragraph.trim()).filter(Boolean),
    };

    const response = await fetch("/api/admin/posts", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ action: "upsert", post }),
    });

    const data = (await response.json()) as { posts?: BlogPost[]; error?: string };

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
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ action: "delete", slug: draft.slug }),
    });

    const data = (await response.json()) as { posts?: BlogPost[]; error?: string };

    if (!response.ok || !data.posts) {
      setError(data.error ?? "Could not delete post.");
      return;
    }

    setPosts(data.posts);
    setSelectedSlug(data.posts[0]?.slug ?? "");
    setDraft(data.posts[0] ?? emptyPost);
    setStatus("Post deleted.");
  }

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

  return (
    <main className="min-h-screen bg-background px-5 py-20 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 border-b border-line pb-8 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
              Admin
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Content dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-muted">
              Add and edit blog posts from the local JSON content file. This is
              designed for source-controlled publishing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startNewPost}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background"
            >
              <Plus size={15} />
              New post
            </button>
            <Link
              href="/blog"
              className="inline-flex h-10 items-center rounded-full border border-line bg-panel px-4 text-sm font-medium"
            >
              View blog
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-panel px-4 text-sm font-medium"
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
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
                    setDraft((current) => ({ ...current, date: event.target.value }))
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
              <label className="grid gap-2 text-sm">
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

            <div className="mt-6 flex flex-wrap items-center gap-3">
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
              {status ? (
                <span className="inline-flex items-center gap-2 text-sm text-accent">
                  <Check size={15} />
                  {status}
                </span>
              ) : null}
              {error ? <span className="text-sm text-red-500">{error}</span> : null}
            </div>
          </form>
        </div>

        <section className="mt-6 rounded-2xl border border-line bg-panel p-5 shadow-sm">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
            Other admin tools
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["Blog publishing", "Project content", "SEO checks"].map((tool) => (
              <div
                key={tool}
                className="rounded-xl border border-line bg-panel-soft p-4 text-sm text-muted"
              >
                {tool}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
