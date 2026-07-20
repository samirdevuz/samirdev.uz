import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import type { BlogPost } from "@/data/blog";
import {
  deletePost,
  getAllPosts,
  upsertPost,
} from "@/data/blog-store";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maxRequestBytes = 100_000;

class PostValidationError extends Error {}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function requiredText(
  value: unknown,
  label: string,
  maximumLength: number,
) {
  const text = String(value ?? "").trim();

  if (!text) {
    throw new PostValidationError(`${label} is required.`);
  }

  if (text.length > maximumLength) {
    throw new PostValidationError(
      `${label} must be ${maximumLength} characters or fewer.`,
    );
  }

  return text;
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function validatePost(input: unknown): BlogPost {
  if (!input || typeof input !== "object") {
    throw new PostValidationError("Post is required.");
  }

  const post = input as Partial<BlogPost>;
  const title = requiredText(post.title, "Title", 160);
  const slug = slugify(String(post.slug || title));
  const date = requiredText(post.date, "Date", 10);
  const category = requiredText(post.category, "Category", 60);
  const excerpt = requiredText(post.excerpt, "Excerpt", 500);
  const readingTime = requiredText(post.readingTime, "Reading time", 40);
  const content = Array.isArray(post.content)
    ? post.content.map((paragraph) => String(paragraph).trim()).filter(Boolean)
    : [];

  if (!slug) {
    throw new PostValidationError("A valid slug is required.");
  }

  if (!isValidDate(date)) {
    throw new PostValidationError("Date must use the YYYY-MM-DD format.");
  }

  if (content.length === 0 || content.length > 50) {
    throw new PostValidationError("Add between 1 and 50 content paragraphs.");
  }

  if (content.some((paragraph) => paragraph.length > 5_000)) {
    throw new PostValidationError(
      "Each content paragraph must be 5,000 characters or fewer.",
    );
  }

  return { title, slug, date, category, excerpt, readingTime, content };
}

function unauthorized() {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401, headers: { "cache-control": "no-store" } },
  );
}

function noStore(response: NextResponse) {
  response.headers.set("cache-control", "no-store");
  return response;
}

function revalidateBlog(slug?: string, originalSlug?: string) {
  revalidatePath("/", "page");
  revalidatePath("/blog", "page");

  if (slug) {
    revalidatePath(`/blog/${slug}`, "page");
  }

  if (originalSlug && originalSlug !== slug) {
    revalidatePath(`/blog/${originalSlug}`, "page");
  }

  revalidatePath("/sitemap.xml");
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  try {
    return noStore(NextResponse.json({ posts: await getAllPosts() }));
  } catch (error) {
    console.error("Admin posts could not be loaded", error);
    return NextResponse.json(
      { error: "Could not load posts." },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > maxRequestBytes) {
    return NextResponse.json(
      { error: "Request body is too large." },
      { status: 413 },
    );
  }

  try {
    const rawBody = await request.text();

    if (new TextEncoder().encode(rawBody).byteLength > maxRequestBytes) {
      return NextResponse.json(
        { error: "Request body is too large." },
        { status: 413 },
      );
    }

    let body: {
      action?: "upsert" | "delete";
      post?: unknown;
      slug?: string;
      originalSlug?: string;
    };

    try {
      body = JSON.parse(rawBody) as typeof body;
    } catch {
      throw new PostValidationError("Request body must be valid JSON.");
    }

    if (body.action === "delete") {
      const slug = slugify(String(body.slug ?? ""));

      if (!slug) {
        throw new PostValidationError("A valid slug is required.");
      }

      const posts = await deletePost(slug);
      revalidateBlog(slug);
      return noStore(NextResponse.json({ posts }));
    }

    if (body.action !== "upsert") {
      throw new PostValidationError("Unknown post action.");
    }

    const nextPost = validatePost(body.post);
    const originalSlug = slugify(String(body.originalSlug ?? ""));
    const posts = await upsertPost(nextPost, originalSlug || undefined);
    revalidateBlog(nextPost.slug, originalSlug);
    return noStore(NextResponse.json({ posts }));
  } catch (error) {
    if (!(error instanceof PostValidationError)) {
      console.error("Admin post mutation failed", error);
    }

    return NextResponse.json(
      {
        error:
          error instanceof PostValidationError
            ? error.message
            : "Could not update the blog post.",
      },
      { status: error instanceof PostValidationError ? 400 : 500 },
    );
  }
}
