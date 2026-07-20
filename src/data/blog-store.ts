import "server-only";

import { cache } from "react";
import seedPosts from "./blog-posts.json";
import type { BlogPost } from "./blog";
import {
  getSupabaseAdminClient,
  getSupabaseReadClient,
  getSupabaseStatus,
} from "@/lib/supabase";

type PortfolioPostRow = {
  slug: string;
  title: string;
  published_on: string;
  category: string;
  excerpt: string;
  reading_time: string;
  content: string[];
};

const postColumns =
  "slug,title,published_on,category,excerpt,reading_time,content";

function sortPosts(posts: BlogPost[]) {
  return [...posts].sort(
    (left, right) =>
      right.date.localeCompare(left.date) || left.slug.localeCompare(right.slug),
  );
}

function fromRow(row: PortfolioPostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    date: row.published_on,
    category: row.category,
    excerpt: row.excerpt,
    readingTime: row.reading_time,
    content: row.content,
  };
}

function toRow(post: BlogPost): PortfolioPostRow & { updated_at: string } {
  return {
    slug: post.slug,
    title: post.title,
    published_on: post.date,
    category: post.category,
    excerpt: post.excerpt,
    reading_time: post.readingTime,
    content: post.content,
    updated_at: new Date().toISOString(),
  };
}

function getRequiredAdminClient() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error(
      "Supabase admin access is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY.",
    );
  }

  return supabase;
}

export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  const supabase = getSupabaseReadClient();

  if (!supabase) {
    return sortPosts(seedPosts as BlogPost[]);
  }

  const { data, error } = await supabase
    .from("portfolio_posts")
    .select(postColumns)
    .order("published_on", { ascending: false })
    .order("slug", { ascending: true });

  if (error) {
    throw new Error("Could not load blog posts from Supabase.", {
      cause: error,
    });
  }

  return (data as PortfolioPostRow[]).map(fromRow);
});

export const getPostBySlug = cache(async (slug: string) => {
  const supabase = getSupabaseReadClient();

  if (!supabase) {
    return (seedPosts as BlogPost[]).find((post) => post.slug === slug);
  }

  const { data, error } = await supabase
    .from("portfolio_posts")
    .select(postColumns)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load the blog post from Supabase.", {
      cause: error,
    });
  }

  return data ? fromRow(data as PortfolioPostRow) : undefined;
});

export async function upsertPost(post: BlogPost, originalSlug?: string) {
  const supabase = getRequiredAdminClient();
  const row = toRow(post);
  const normalizedOriginalSlug = originalSlug?.trim();

  const query = normalizedOriginalSlug
    ? supabase
        .from("portfolio_posts")
        .update(row)
        .eq("slug", normalizedOriginalSlug)
        .select("slug")
        .single()
    : supabase.from("portfolio_posts").insert(row).select("slug").single();
  const { error } = await query;

  if (error) {
    throw new Error("Could not save the blog post in Supabase.", {
      cause: error,
    });
  }

  return getFreshPosts();
}

export async function deletePost(slug: string) {
  const supabase = getRequiredAdminClient();
  const { data, error } = await supabase
    .from("portfolio_posts")
    .delete()
    .eq("slug", slug)
    .select("slug")
    .maybeSingle();

  if (error) {
    throw new Error("Could not delete the blog post from Supabase.", {
      cause: error,
    });
  }

  if (!data) {
    throw new Error("Blog post not found.");
  }

  return getFreshPosts();
}

async function getFreshPosts() {
  const supabase = getRequiredAdminClient();
  const { data, error } = await supabase
    .from("portfolio_posts")
    .select(postColumns)
    .order("published_on", { ascending: false })
    .order("slug", { ascending: true });

  if (error) {
    throw new Error("Could not refresh blog posts from Supabase.", {
      cause: error,
    });
  }

  return (data as PortfolioPostRow[]).map(fromRow);
}

export function getPostsStorageInfo() {
  const status = getSupabaseStatus();

  return {
    provider: status.readConfigured ? "Supabase Postgres" : "bundled seed JSON",
    readConfigured: status.readConfigured,
    adminConfigured: status.adminConfigured,
  };
}
