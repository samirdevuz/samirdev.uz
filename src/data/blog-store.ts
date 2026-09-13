import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import seedPosts from "./blog-posts.json";
import type { BlogPost } from "./blog";
import { fetchSupabasePosts, saveSupabasePosts } from "@/lib/supabase";

const sourcePostsFile = join(process.cwd(), "src", "data", "blog-posts.json");
const runtimePostsFile =
  process.env.BLOG_POSTS_FILE ??
  (process.env.VERCEL ? "/tmp/blog-posts.json" : sourcePostsFile);

function sortPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

async function readJsonFile(path: string) {
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw) as BlogPost[];
}

export async function getAllPosts() {
  const supabasePosts = await fetchSupabasePosts();
  if (supabasePosts && supabasePosts.length > 0) {
    return sortPosts(supabasePosts);
  }

  try {
    return sortPosts(await readJsonFile(runtimePostsFile));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }

    return sortPosts(seedPosts as BlogPost[]);
  }
}

export async function getPostBySlug(slug: string) {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug);
}

export async function saveAllPosts(posts: BlogPost[]) {
  const sortedPosts = sortPosts(posts);

  // Save to Supabase if configured
  await saveSupabasePosts(sortedPosts);

  // Also save to file storage
  try {
    await mkdir(dirname(runtimePostsFile), { recursive: true });
    await writeFile(
      runtimePostsFile,
      `${JSON.stringify(sortedPosts, null, 2)}\n`,
      "utf8",
    );
  } catch {
    // ignore if read-only filesystem
  }

  return sortedPosts;
}

export function getPostsStoragePath() {
  return runtimePostsFile;
}
