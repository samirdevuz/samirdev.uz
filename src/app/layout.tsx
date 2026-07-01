import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { defaultLocale, isLocale, localeCookieName } from "@/lib/locale";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Samir Abdumo'minov",
  alternateName: "samirdevuz",
  url: "https://samirdev.uz",
  image: "https://samirdev.uz/logo-premium.png",
  email: "mailto:samirabdumominov@gmail.com",
  jobTitle: "Developer",
  sameAs: [
    "https://github.com/samirdevuz",
    "https://t.me/samirdevuz",
    "https://www.instagram.com/abdumuminov_samir",
    "https://x.com/samirdevuz",
    "https://discord.com/users/samirdevuz",
    "https://monkeytype.com/profile/samirdevuz",
  ],
  knowsAbout: [
    "Web development",
    "Next.js",
    "TypeScript",
    "React",
    "AI-powered tools",
    "EdTech",
    "Automation",
    "Computer science",
    "Frontend engineering",
  ],
  mainEntityOfPage: {
    "@type": "WebSite",
    name: "Samir Abdumo'minov Portfolio",
    url: "https://samirdev.uz",
    inLanguage: "en",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL("https://samirdev.uz"),
  applicationName: "Samir Abdumo'minov Portfolio",
  title: {
    default: "Samir Abdumo'minov | Developer Building Modern Web Products",
    template: "%s | Samir Abdumo'minov",
  },
  description:
    "Portfolio of Samir Abdumo'minov (@samirdevuz), a developer building Next.js web products, AI-powered tools, EdTech experiences, automation ideas, and useful digital products.",
  keywords: [
    "Samir Abdumo'minov",
    "developer portfolio",
    "web developer",
    "Next.js developer",
    "TypeScript",
    "React developer",
    "AI tools",
    "EdTech",
    "MilliyPrep",
    "Milliy Sertifikat",
    "automation",
    "frontend developer",
    "Uzbekistan developer",
    "samirdevuz",
  ],
  authors: [{ name: "Samir Abdumo'minov" }],
  creator: "Samir Abdumo'minov",
  publisher: "Samir Abdumo'minov",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/logo-premium.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Samir Abdumo'minov | Developer Building Modern Web Products",
    description:
      "Developer portfolio for @samirdevuz, focused on Next.js web products, AI-powered tools, EdTech, automation, and useful digital products.",
    url: "/",
    siteName: "Samir Abdumo'minov",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo-premium.png",
        width: 512,
        height: 512,
        alt: "Samir Abdumo'minov portfolio logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@samirdevuz",
    title: "Samir Abdumo'minov | Developer Building Modern Web Products",
    description:
      "Developer portfolio for @samirdevuz, focused on web products, AI tools, EdTech, automation, and useful digital products.",
    images: ["/logo-premium.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const headerLocale = headerStore.get("x-samir-locale");
  const cookieLocale = cookieStore.get(localeCookieName)?.value;
  const locale = isLocale(headerLocale)
    ? headerLocale
    : isLocale(cookieLocale)
      ? cookieLocale
      : defaultLocale;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
