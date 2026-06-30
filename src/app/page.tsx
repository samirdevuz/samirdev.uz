import { PortfolioPage } from "@/components/portfolio-page";
import { getAllPosts } from "@/data/blog-store";
import { cookies, headers } from "next/headers";
import { defaultLocale, isLocale, localeCookieName } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function Home() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const headerLocale = headerStore.get("x-samir-locale");
  const cookieLocale = cookieStore.get(localeCookieName)?.value;
  const blogPosts = await getAllPosts();
  const locale = isLocale(headerLocale)
    ? headerLocale
    : isLocale(cookieLocale)
      ? cookieLocale
      : defaultLocale;

  return <PortfolioPage blogPosts={blogPosts} initialLocale={locale} />;
}
