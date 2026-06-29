import { PortfolioPage } from "@/components/portfolio-page";
import { getAllPosts } from "@/data/blog-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const blogPosts = await getAllPosts();

  return <PortfolioPage blogPosts={blogPosts} />;
}
