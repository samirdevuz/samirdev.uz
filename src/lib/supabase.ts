import { createClient } from "@supabase/supabase-js";
import type { BlogPost } from "@/data/blog";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

export async function fetchSupabaseSiteContent() {
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data.content;
  } catch {
    return null;
  }
}

export async function saveSupabaseSiteContent(content: unknown) {
  if (!supabase) {
    return false;
  }

  try {
    const { error } = await supabase.from("site_content").upsert({
      id: "default",
      content,
      updated_at: new Date().toISOString(),
    });

    return !error;
  } catch {
    return false;
  }
}

export async function fetchSupabasePosts(): Promise<BlogPost[] | null> {
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("date", { ascending: false });

    if (error || !data || data.length === 0) {
      return null;
    }

    return data.map((item) => ({
      title: item.title,
      slug: item.slug,
      date: item.date,
      category: item.category,
      excerpt: item.excerpt,
      readingTime: item.reading_time ?? item.readingTime ?? "2 min read",
      content: Array.isArray(item.content) ? item.content : [item.content],
    }));
  } catch {
    return null;
  }
}

export async function saveSupabasePosts(posts: BlogPost[]): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  try {
    const formatted = posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      category: post.category,
      excerpt: post.excerpt,
      reading_time: post.readingTime,
      content: post.content,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("blog_posts").upsert(formatted, {
      onConflict: "slug",
    });

    return !error;
  } catch {
    return false;
  }
}

export async function deleteSupabasePost(slug: string): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("slug", slug);

    return !error;
  } catch {
    return false;
  }
}
