import posts from "./blog-posts.json";

export type BlogPost = {
  title: string;
  slug: string;
  date: string;
  category: string;
  excerpt: string;
  readingTime: string;
  content: string[];
};

// Add or edit posts in src/data/blog-posts.json. Each slug becomes /blog/your-slug.
export const blogPosts: BlogPost[] = posts;

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
