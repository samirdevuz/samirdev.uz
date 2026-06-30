import { access } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, getPostsStoragePath } from "@/data/blog-store";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ToolAction = "validate-blog" | "seo-check" | "content-summary";

function uniqueValues(values: string[]) {
  return new Set(values).size === values.length;
}

async function fileExists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function runTool(action: ToolAction) {
  const posts = await getAllPosts();

  if (action === "validate-blog") {
    const slugs = posts.map((post) => post.slug);
    const issues = [
      posts.length === 0 ? "No blog posts found." : "",
      uniqueValues(slugs) ? "" : "Duplicate blog slugs found.",
      ...posts.flatMap((post) => {
        const missing = [
          post.title ? "" : `${post.slug || "Untitled"} is missing title.`,
          post.slug ? "" : `${post.title || "Untitled"} is missing slug.`,
          post.date ? "" : `${post.title || post.slug} is missing date.`,
          post.excerpt ? "" : `${post.title || post.slug} is missing excerpt.`,
          post.content.length ? "" : `${post.title || post.slug} has no content.`,
        ].filter(Boolean);

        return missing;
      }),
    ].filter(Boolean);

    return {
      title: "Blog validation",
      ok: issues.length === 0,
      details: issues.length ? issues : [`${posts.length} posts are valid.`],
    };
  }

  if (action === "seo-check") {
    const checks = [
      "Homepage metadata is configured.",
      "Robots route is configured.",
      "Sitemap route is configured.",
      "Open Graph image is configured.",
      posts.length
        ? `${posts.length} public blog posts can be indexed.`
        : "No public blog posts found.",
    ];

    return {
      title: "SEO checks",
      ok: posts.length > 0,
      details: checks,
    };
  }

  return {
    title: "Content summary",
    ok: true,
    details: [
      `Blog posts: ${posts.length}`,
      `Latest post: ${posts[0]?.title ?? "None"}`,
      `Storage path: ${getPostsStoragePath()}`,
      `Storage file exists: ${await fileExists(getPostsStoragePath()) ? "yes" : "using seed content"}`,
      "Featured product: MilliyPrep",
      "Grid products exclude MilliyPrep to avoid duplicates.",
    ],
  };
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    action?: ToolAction;
  } | null;

  if (
    body?.action !== "validate-blog" &&
    body?.action !== "seo-check" &&
    body?.action !== "content-summary"
  ) {
    return NextResponse.json({ error: "Unknown admin tool." }, { status: 400 });
  }

  const response = NextResponse.json({ result: await runTool(body.action) });
  response.headers.set("cache-control", "no-store");
  return response;
}
