import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Samir Abdumo'minov",
  url: "https://samirdev.uz",
  email: "mailto:samirabdumominov@gmail.com",
  jobTitle: "Developer",
  knowsAbout: [
    "Web development",
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
    "Samir Abdumo'minov is a developer building modern web products, AI-powered tools, EdTech experiences, automation ideas, and useful digital products.",
  keywords: [
    "Samir Abdumo'minov",
    "developer portfolio",
    "web developer",
    "Next.js developer",
    "TypeScript",
    "AI tools",
    "EdTech",
    "automation",
    "frontend developer",
    "Uzbekistan developer",
  ],
  authors: [{ name: "Samir Abdumo'minov" }],
  creator: "Samir Abdumo'minov",
  publisher: "Samir Abdumo'minov",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
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
      "Developer portfolio focused on web products, AI-powered tools, EdTech, automation, and useful digital products.",
    url: "/",
    siteName: "Samir Abdumo'minov",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Samir Abdumo'minov | Developer Building Modern Web Products",
    description:
      "Developer portfolio focused on web products, AI-powered tools, EdTech, automation, and useful digital products.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
