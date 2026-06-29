import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllPosts } from "@/data/blog-store";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog",
  description:
    "Posts, notes, and updates from Samir Abdumo'minov about web development, AI tools, EdTech, and product design.",
};

export default async function BlogPage() {
  const blogPosts = await getAllPosts();

  return (
    <main className="min-h-screen bg-background px-5 py-24 text-foreground sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="text-sm text-muted transition-colors hover:text-accent"
        >
          Back to portfolio
        </Link>
        <div className="mt-10 border-b border-line pb-10">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
            Blog
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Posts, notes, and build updates.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            A local editable writing system for ideas about MilliyPrep, clean
            interfaces, AI tools, and modern web products.
          </p>
        </div>

        <div className="mt-10 grid gap-4">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-line bg-panel p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[var(--shadow)]"
            >
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                <span className="rounded-full border border-line bg-panel-soft px-3 py-1 font-mono text-xs text-accent">
                  {post.category}
                </span>
                <span>{post.date}</span>
                <span>{post.readingTime}</span>
              </div>
              <div className="mt-5 flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {post.title}
                  </h2>
                  <p className="mt-3 max-w-2xl leading-7 text-muted">
                    {post.excerpt}
                  </p>
                </div>
                <ArrowUpRight className="mt-1 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
