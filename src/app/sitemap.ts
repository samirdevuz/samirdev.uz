import type { MetadataRoute } from "next";
import { getAllPosts } from "@/data/blog-store";

const siteUrl = "https://samirdev.uz";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getAllPosts();
  const latestPostDate = blogPosts[0]?.date
    ? new Date(blogPosts[0].date)
    : new Date("2026-01-01");
  const blogRoutes = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: siteUrl,
      lastModified: latestPostDate,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: latestPostDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...blogRoutes,
  ];
}
