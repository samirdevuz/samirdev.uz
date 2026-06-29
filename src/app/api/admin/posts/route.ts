import { NextRequest, NextResponse } from "next/server";
import type { BlogPost } from "@/data/blog";
import { getAllPosts, saveAllPosts } from "@/data/blog-store";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validatePost(input: unknown): BlogPost {
  if (!input || typeof input !== "object") {
    throw new Error("Post is required.");
  }

  const post = input as Partial<BlogPost>;
  const title = String(post.title ?? "").trim();
  const slug = slugify(String(post.slug || title));
  const date = String(post.date ?? "").trim();
  const category = String(post.category ?? "").trim();
  const excerpt = String(post.excerpt ?? "").trim();
  const readingTime = String(post.readingTime ?? "").trim();
  const content = Array.isArray(post.content)
    ? post.content.map((paragraph) => String(paragraph).trim()).filter(Boolean)
    : [];

  if (!title || !slug || !date || !category || !excerpt || !readingTime) {
    throw new Error("Title, slug, date, category, excerpt, and reading time are required.");
  }

  if (content.length === 0) {
    throw new Error("Add at least one content paragraph.");
  }

  return { title, slug, date, category, excerpt, readingTime, content };
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ posts: await getAllPosts() });
  response.headers.set("cache-control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      action?: "upsert" | "delete";
      post?: unknown;
      slug?: string;
    };
    const posts = await getAllPosts();

    if (body.action === "delete") {
      const slug = slugify(String(body.slug ?? ""));
      const nextPosts = posts.filter((post) => post.slug !== slug);
      const response = NextResponse.json({ posts: await saveAllPosts(nextPosts) });
      response.headers.set("cache-control", "no-store");
      return response;
    }

    const nextPost = validatePost(body.post);
    const withoutExisting = posts.filter((post) => post.slug !== nextPost.slug);

    const response = NextResponse.json({
      posts: await saveAllPosts([nextPost, ...withoutExisting]),
    });
    response.headers.set("cache-control", "no-store");
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save post." },
      { status: 400 },
    );
  }
}
