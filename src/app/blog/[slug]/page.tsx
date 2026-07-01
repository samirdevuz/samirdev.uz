import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/data/blog-store";

const siteUrl = "https://samirdev.uz";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const url = `${siteUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date,
      authors: ["Samir Abdumo'minov"],
      tags: [post.category],
      images: [
        {
          url: "/logo-premium.png",
          width: 512,
          height: 512,
          alt: `${post.title} by Samir Abdumo'minov`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ["/logo-premium.png"],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Samir Abdumo'minov",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Samir Abdumo'minov",
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    articleSection: post.category,
  };

  return (
    <main className="min-h-screen bg-background px-5 py-24 text-foreground sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
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
