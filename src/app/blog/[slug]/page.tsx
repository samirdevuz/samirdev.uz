import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/data/blog-store";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background px-5 py-24 text-foreground sm:px-8">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="text-sm text-muted transition-colors hover:text-accent"
        >
          Back to blog
        </Link>
        <header className="mt-10 border-b border-line pb-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <span className="rounded-full border border-line bg-panel-soft px-3 py-1 font-mono text-xs text-accent">
              {post.category}
            </span>
            <span>{post.date}</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted">{post.excerpt}</p>
        </header>

        <div className="mt-10 space-y-7 text-lg leading-8 text-muted">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
