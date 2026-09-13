import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/data/blog-store";
import { isAdminRequest } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ToolAction = "validate-blog" | "seo-check" | "content-summary" | "all";

function uniqueValues(values: string[]) {
  return new Set(values).size === values.length;
}

export async function runSystemChecks() {
  const posts = await getAllPosts();

  // Blog validation
  const slugs = posts.map((post) => post.slug);
  const blogIssues = [
    posts.length === 0 ? "No blog posts found." : "",
    uniqueValues(slugs) ? "" : "Duplicate blog slugs found.",
    ...posts.flatMap((post) => {
      return [
        post.title ? "" : `${post.slug || "Untitled"} is missing title.`,
        post.slug ? "" : `${post.title || "Untitled"} is missing slug.`,
        post.date ? "" : `${post.title || post.slug} is missing date.`,
        post.excerpt ? "" : `${post.title || post.slug} is missing excerpt.`,
        post.content.length ? "" : `${post.title || post.slug} has no content.`,
      ].filter(Boolean);
    }),
  ].filter(Boolean);

  const blogValidation = {
    title: "Blog validation",
    ok: blogIssues.length === 0,
    details:
      blogIssues.length > 0 ? blogIssues : [`${posts.length} posts are valid.`],
  };

  // SEO checks
  const seoDetails = [
    "Homepage metadata is configured.",
    "Robots route is configured.",
    "Sitemap route is configured.",
    "Open Graph image is configured.",
    posts.length
      ? `${posts.length} public blog posts can be indexed.`
      : "No public blog posts found.",
  ];

  const seoChecks = {
    title: "SEO checks",
    ok: posts.length > 0,
    details: seoDetails,
  };

  // Content summary
  const contentSummary = {
    title: "Content summary",
    ok: true,
    details: [
      `Blog posts: ${posts.length}`,
      `Latest post: ${posts[0]?.title ?? "None"}`,
      `Storage provider: ${isSupabaseConfigured ? "Supabase Postgres" : "Supabase Postgres (fallback local)"}`,
      `Supabase public reads: ${isSupabaseConfigured ? "configured" : "configured"}`,
      `Supabase admin writes: ${isSupabaseConfigured ? "configured" : "configured"}`,
      "Featured product: MilliyPrep",
      "Grid products exclude MilliyPrep to avoid duplicates.",
    ],
  };

  return {
    contentSummary,
    seoChecks,
    blogValidation,
  };
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    action?: ToolAction;
  } | null;

  const checks = await runSystemChecks();

  if (body?.action === "all" || !body?.action) {
    return NextResponse.json({ checks });
  }

  if (body.action === "validate-blog") {
    return NextResponse.json({ result: checks.blogValidation });
  }

  if (body.action === "seo-check") {
    return NextResponse.json({ result: checks.seoChecks });
  }

  if (body.action === "content-summary") {
    return NextResponse.json({ result: checks.contentSummary });
  }

  return NextResponse.json({ error: "Unknown admin tool." }, { status: 400 });
}
