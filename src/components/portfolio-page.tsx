"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Code2,
  Command,
  Copy,
  GitBranch,
  Layers3,
  Mail,
  Moon,
  Send,
  Sparkles,
  Sun,
  TerminalSquare,
  X,
} from "lucide-react";
import { blogPosts } from "@/data/blog";

const navItems = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Focus", href: "#build", id: "build" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Blog", href: "#blog", id: "blog" },
  { label: "Contact", href: "#contact", id: "contact" },
];

function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-panel shadow-sm",
        className,
      )}
      aria-hidden="true"
    >
      <span className="absolute inset-0 bg-[linear-gradient(135deg,var(--accent-soft),transparent_58%)]" />
      <span className="relative font-mono text-[11px] font-semibold tracking-tight text-foreground">
        S/
      </span>
    </span>
  );
}

const highlights = [
  {
    title: "Web development",
    text: "Modern interfaces built with React, Next.js, TypeScript, and practical frontend patterns.",
    icon: Code2,
  },
  {
    title: "AI tools",
    text: "Study assistants, automation ideas, and workflows that make learning or building faster.",
    icon: Sparkles,
  },
  {
    title: "Product systems",
    text: "Focused digital products designed around clarity, structure, and real user needs.",
    icon: Layers3,
  },
];

const buildAreas = [
  {
    title: "Clean web interfaces",
    text: "Readable layouts, strong hierarchy, responsive details, and interactions that feel direct.",
    icon: Code2,
  },
  {
    title: "AI-powered tools",
    text: "Tools that explain, organize, summarize, automate, and help people move through complex work.",
    icon: Sparkles,
  },
  {
    title: "Product dashboards",
    text: "Calm product surfaces for tracking progress, managing workflows, and making next actions obvious.",
    icon: Layers3,
  },
  {
    title: "Useful web utilities",
    text: "Small focused tools that solve one everyday problem quickly and reliably.",
    icon: TerminalSquare,
  },
];

const skillGroups = [
  {
    title: "Frontend Core",
    description:
      "Building fast, maintainable interfaces with component-driven architecture and modern web foundations.",
    icon: Code2,
    skills: ["React", "Next.js", "TypeScript", "JavaScript"],
  },
  {
    title: "UI Engineering",
    description:
      "Turning product ideas into clean responsive screens with motion, accessibility basics, and polish.",
    icon: Layers3,
    skills: [
      "Tailwind CSS",
      "Responsive Design",
      "Framer Motion",
      "Accessibility basics",
    ],
  },
  {
    title: "AI Workflow",
    description:
      "Using AI-assisted workflows to learn faster, prototype ideas, and improve product iteration.",
    icon: TerminalSquare,
    skills: ["Cursor", "AI coding tools", "Automation", "Prompt engineering"],
  },
  {
    title: "Product Thinking",
    description:
      "Exploring areas where software can improve learning, automation, security, and digital products.",
    icon: Sparkles,
    skills: ["EdTech", "SaaS", "Clean UX", "Practical tools"],
  },
];

const projects = [
  {
    name: "MilliyPrep",
    status: "Live",
    description:
      "An EdTech product for Milliy Sertifikat preparation, focused on structured learning and a clean study experience.",
    problem:
      "Helps Uzbek learners prepare across subjects without a cluttered or outdated learning interface.",
    stack: ["Next.js", "EdTech", "Product design"],
    demo: "https://milliyprep.xyz",
    github: "#",
  },
  {
    name: "AI Study Assistant",
    status: "Concept",
    description:
      "A concept learning assistant that turns notes and topics into clearer explanations, summaries, and study plans.",
    problem:
      "Helps learners move from scattered material to a focused learning path with AI support.",
    stack: ["AI", "React", "Learning tools"],
    demo: "#",
    github: "#",
  },
  {
    name: "Personal Portfolio",
    status: "This site",
    description:
      "A minimal portfolio system designed to present work, direction, and technical taste with more clarity.",
    problem:
      "Creates a stronger first impression than a plain resume-style page or generic template.",
    stack: ["Next.js", "Tailwind CSS", "Framer Motion"],
    demo: "#",
    github: "#",
  },
  {
    name: "Web Tools Collection",
    status: "Experiments",
    description:
      "A collection of focused utilities and experiments for productivity, automation, and web workflows.",
    problem:
      "Solves small everyday problems with lightweight tools instead of oversized apps.",
    stack: ["TypeScript", "Utilities", "Automation"],
    demo: "#",
    github: "#",
  },
];

const principles = [
  {
    title: "Simple over complicated",
    text: "Good products should feel easy to understand before they feel impressive.",
  },
  {
    title: "Useful over decorative",
    text: "Visual polish matters most when it supports clarity, speed, and real user value.",
  },
  {
    title: "Fast, responsive, and polished",
    text: "A product should work well on every screen and feel carefully built in small details.",
  },
];

const buildLog = [
  {
    year: "2026",
    status: "Building",
    text: "Building MilliyPrep, an EdTech platform for Milliy Sertifikat preparation",
  },
  {
    year: "2026",
    status: "Designing",
    text: "Designing and refining a personal developer portfolio",
  },
  {
    year: "2025",
    status: "Learning",
    text: "Exploring AI tools, web development, and automation",
  },
  {
    year: "2025",
    status: "Shipping",
    text: "Learning frontend fundamentals and product design basics",
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SectionReveal({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={cn("scroll-mt-28 border-t border-line/80", className)}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
  className,
}: {
  eyebrow: string;
  title: string;
  text: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-muted sm:text-lg">{text}</p>
    </div>
  );
}

function ActionLink({
  href,
  children,
  variant = "primary",
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
}) {
  const isPlaceholder = href === "#";

  return (
    <a
      href={href}
      target={external && !isPlaceholder ? "_blank" : undefined}
      rel={external && !isPlaceholder ? "noreferrer" : undefined}
      aria-disabled={isPlaceholder}
      onClick={(event) => {
        if (isPlaceholder) {
          event.preventDefault();
        }
      }}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/40",
        "hover:-translate-y-0.5",
        variant === "primary" &&
          "bg-foreground text-background shadow-sm hover:shadow-[var(--shadow)]",
        variant === "secondary" &&
          "border border-line bg-panel text-foreground hover:border-accent",
      )}
    >
      {children}
    </a>
  );
}

function CommandMenu({
  open,
  copied,
  onClose,
  onCopyEmail,
  onToggleTheme,
}: {
  open: boolean;
  copied: boolean;
  onClose: () => void;
  onCopyEmail: () => void;
  onToggleTheme: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    onClose();
  };

  const actions = [
    {
      label: "View Projects",
      hint: "Jump to project grid",
      icon: Layers3,
      run: () => scrollTo("projects"),
    },
    {
      label: "Open MilliyPrep",
      hint: "milliyprep.xyz",
      icon: ArrowUpRight,
      run: () => {
        window.open("https://milliyprep.xyz", "_blank", "noreferrer");
        onClose();
      },
    },
    {
      label: copied ? "Email Copied" : "Copy Email",
      hint: "samirabdumominov@gmail.com",
      icon: copied ? Check : Copy,
      run: onCopyEmail,
    },
    {
      label: "Toggle Dark Mode",
      hint: "Switch site theme",
      icon: Moon,
      run: onToggleTheme,
    },
    {
      label: "View Skills",
      hint: "Tech stack system",
      icon: Code2,
      run: () => scrollTo("skills"),
    },
    {
      label: "View Blog",
      hint: "Posts and notes",
      icon: BookOpen,
      run: () => scrollTo("blog"),
    },
    {
      label: "Contact Me",
      hint: "Email and social links",
      icon: Mail,
      run: () => scrollTo("contact"),
    },
  ];

  if (!open) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-foreground/18 px-4 pt-24 backdrop-blur-sm dark:bg-black/45"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
      onMouseDown={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-panel shadow-[var(--shadow)]"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="flex items-center gap-3 text-sm text-muted">
            <span className="flex size-8 items-center justify-center rounded-md bg-accent-soft text-accent">
              <Command size={16} />
            </span>
            <span>Command menu</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-panel-soft hover:text-foreground"
            aria-label="Close command menu"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-2">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.label}
                type="button"
                onClick={action.run}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 hover:bg-panel-soft focus:bg-panel-soft focus:outline-none"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-background text-accent">
                  <Icon size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground">
                    {action.label}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted">
                    {action.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="border-t border-line px-4 py-3 font-mono text-xs text-muted">
          Press Esc to close
        </div>
      </motion.div>
    </motion.div>
  );
}

function HeroVisual() {
  return (
    <motion.div
      className="relative min-h-[460px]"
      initial={{ opacity: 0, x: 24, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <div className="absolute inset-x-6 top-0 rounded-xl border border-line bg-panel/88 p-4 shadow-[var(--shadow)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#d8d3c4]" />
            <span className="size-2.5 rounded-full bg-[#aaa99c]" />
            <span className="size-2.5 rounded-full bg-accent" />
          </div>
          <span className="font-mono text-xs text-muted">samir-terminal</span>
        </div>

        <div className="space-y-4 pt-5 font-mono text-xs leading-6 text-muted sm:text-sm">
          <div>
            <p className="text-accent">samir@portfolio:~$ whoami</p>
            <p className="text-foreground">
              Developer building web products, AI tools, and EdTech
              experiences.
            </p>
          </div>
          <div>
            <p className="text-accent">samir@portfolio:~$ current</p>
            <p className="text-foreground">
              Building useful products → web / AI / EdTech
              <span className="ml-1 inline-block h-4 w-1 translate-y-0.5 animate-pulse bg-accent" />
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 w-[76%] rounded-xl border border-line bg-panel/92 p-5 shadow-[var(--shadow)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
            Developer Focus
          </span>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs text-accent">
            Shipping
          </span>
        </div>
        <div className="mt-5 grid gap-3 text-sm">
          {[
            ["Core", "Modern web products"],
            ["Tools", "AI workflows and automation"],
            ["Product", "EdTech and useful utilities"],
            ["Stack", "Next.js, TypeScript, Tailwind CSS"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-[72px_1fr] gap-3 border-b border-line pb-3 last:border-b-0 last:pb-0"
            >
              <span className="font-mono text-xs text-muted">{label}</span>
              <span className="text-foreground">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 right-2 w-56 rounded-xl border border-line bg-foreground p-4 text-background shadow-[var(--shadow)]">
        <p className="font-mono text-xs opacity-70">focus</p>
        <p className="mt-2 text-sm font-medium">
          Useful products, not just interfaces.
        </p>
      </div>
    </motion.div>
  );
}

function MilliyPrepPreview() {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-xl border border-line bg-background/70 p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--line)_1px,transparent_1px),linear-gradient(to_bottom,var(--line)_1px,transparent_1px)] bg-[size:42px_42px] opacity-35" />
      <div className="relative rounded-lg border border-line bg-panel shadow-[var(--shadow)]">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden gap-1.5 sm:flex">
              <span className="size-2.5 rounded-full bg-[#d8d3c4]" />
              <span className="size-2.5 rounded-full bg-[#aaa99c]" />
              <span className="size-2.5 rounded-full bg-accent" />
            </div>
            <div className="min-w-0 rounded-full border border-line bg-background px-3 py-1 font-mono text-xs text-muted">
              milliyprep.xyz
            </div>
          </div>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs text-accent">
            Live
          </span>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-2">
            {["Math", "English", "History", "Biology"].map((subject) => (
              <div
                key={subject}
                className="rounded-md border border-line bg-panel-soft px-3 py-2 text-sm"
              >
                {subject}
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-line bg-background/80 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Milliy Sertifikat Preparation
                </p>
                <p className="mt-1 text-xs text-muted">Focused study flow</p>
              </div>
              <p className="font-mono text-xs text-accent">74%</p>
            </div>
            <div className="mt-4 h-2 rounded-full bg-line">
              <div className="h-full w-[74%] rounded-full bg-accent" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-panel-soft p-3">
                <p className="font-mono text-lg font-semibold">24</p>
                <p className="text-xs text-muted">Topics</p>
              </div>
              <div className="rounded-md bg-panel-soft p-3">
                <p className="font-mono text-lg font-semibold">8</p>
                <p className="text-xs text-muted">Subjects</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PortfolioPage() {
  const [activeSection, setActiveSection] = useState("home");
  const [commandOpen, setCommandOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const updateActiveSection = () => {
      if (window.scrollY < 80) {
        setActiveSection("home");
        return;
      }

      let closest = navItems[0].id;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const item of navItems) {
        const rect = document.getElementById(item.id)?.getBoundingClientRect();

        if (rect) {
          const distance = Math.abs(rect.top - 112);

          if (distance < closestDistance) {
            closest = item.id;
            closestDistance = distance;
          }
        }
      }

      setActiveSection(closest);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setCommandOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const copyEmail = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText("samirabdumominov@gmail.com");
      }
    } catch {
      // Clipboard permissions vary by browser; still show feedback after a user-triggered copy attempt.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <CommandMenu
        open={commandOpen}
        copied={copied}
        onClose={() => setCommandOpen(false)}
        onCopyEmail={copyEmail}
        onToggleTheme={() => setTheme(isDark ? "light" : "dark")}
      />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-line/75 bg-background/82 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a
            href="#home"
            className="group flex min-w-0 items-center gap-3 text-sm font-semibold tracking-tight"
            aria-label="Samir Abdumo'minov home"
          >
            <LogoMark className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="hidden sm:inline">Samir Abdumo&apos;minov</span>
          </a>

          <div className="hidden items-center gap-1 rounded-full border border-line bg-panel/75 p-1 shadow-sm lg:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm text-muted transition-all duration-300 hover:text-foreground",
                  activeSection === item.id &&
                    "bg-foreground text-background shadow-sm hover:text-background",
                )}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="hidden h-9 items-center justify-center gap-2 rounded-full border border-line bg-panel px-4 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-accent md:inline-flex"
            >
              <Command size={14} />
              <span>Menu</span>
              <span className="font-mono text-xs text-muted">⌘K</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex size-9 items-center justify-center rounded-full border border-line bg-panel text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
              aria-label="Toggle color theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </nav>
      </header>

      <section
        id="home"
        className="relative flex min-h-screen scroll-mt-28 items-center px-5 pb-20 pt-28 sm:px-8 lg:pb-12"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--line)_1px,transparent_1px),linear-gradient(to_bottom,var(--line)_1px,transparent_1px)] bg-[size:84px_84px] opacity-30" />
          <div className="absolute left-[12%] top-24 h-48 w-48 rounded-full bg-accent-soft blur-3xl opacity-55 dark:opacity-20" />
          <div className="absolute right-[18%] top-36 h-64 w-64 rounded-full bg-panel-soft blur-3xl opacity-80 dark:opacity-20" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/80 px-3 py-1.5 text-sm text-muted shadow-sm backdrop-blur">
              <span className="size-1.5 rounded-full bg-accent" />
              Building across web, AI tools, and EdTech
            </div>
            <p className="mt-7 font-mono text-sm font-medium uppercase tracking-[0.18em] text-accent">
              Samir Abdumo&apos;minov
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Developer building modern web products, AI-powered tools, and
              EdTech experiences.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              I&apos;m Samir Abdumo&apos;minov, focused on coding, AI, web
              development, IT, computer science, and turning useful ideas into
              polished digital products.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ActionLink href="#projects">
                View Projects
                <ArrowUpRight size={16} />
              </ActionLink>
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line bg-panel px-5 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                Open Command Menu
                <Command size={16} />
              </button>
            </div>

            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {["Web products", "AI workflows", "Learning tools"].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-line bg-panel/72 px-4 py-3 text-sm text-muted backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="hidden lg:block">
            <HeroVisual />
          </div>
        </div>
      </section>

      <SectionReveal id="featured" className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Featured Work"
            title="A real product inside a broader developer portfolio."
            text="MilliyPrep is highlighted as a shipped project, while the site stays centered on my web, AI, product, and interface work."
          />

          <motion.div
            className="mt-12 overflow-hidden rounded-2xl border border-line bg-panel shadow-[var(--shadow)]"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="border-b border-line p-7 sm:p-10 lg:border-b-0 lg:border-r">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-background">
                    Live project
                  </span>
                  <span className="rounded-full border border-line bg-panel-soft px-3 py-1 font-mono text-xs text-muted">
                    milliyprep.xyz
                  </span>
                </div>
                <h2 className="mt-7 text-4xl font-semibold tracking-tight sm:text-5xl">
                  MilliyPrep
                </h2>
                <p className="mt-5 text-lg leading-8 text-muted">
                  An EdTech platform designed to help learners prepare for
                  Uzbekistan&apos;s Milliy Sertifikat exams across multiple
                  subjects with a clean, focused, and modern study experience.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {["Next.js", "EdTech", "Study platform", "Uzbek learners"].map(
                    (item) => (
                      <span
                        key={item}
                        className="rounded-full border border-line bg-panel-soft px-3 py-1.5 text-sm text-muted"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>

                <div className="mt-8 grid gap-3">
                  {[
                    "Multi-subject exam preparation",
                    "Clean learning experience",
                    "Modern EdTech interface",
                    "Built for Uzbek learners",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="size-1.5 rounded-full bg-accent" />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-9 flex flex-wrap gap-3">
                  <ActionLink href="https://milliyprep.xyz" external>
                    View Live
                    <ArrowUpRight size={16} />
                  </ActionLink>
                  <ActionLink
                    href="https://milliyprep.xyz"
                    external
                    variant="secondary"
                  >
                    View Project
                    <ArrowUpRight size={16} />
                  </ActionLink>
                  <ActionLink href="#" variant="secondary">
                    GitHub
                    <GitBranch size={16} />
                  </ActionLink>
                </div>
              </div>

              <div className="p-5 sm:p-8 lg:p-10">
                <MilliyPrepPreview />
              </div>
            </div>
          </motion.div>
        </div>
      </SectionReveal>

      <SectionReveal id="about" className="px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <SectionHeading
            eyebrow="About"
            title="Building with a product mindset."
            text="I care about useful software, clean interfaces, and learning the foundations behind good technology."
          />
          <div>
            <div className="rounded-2xl border border-line bg-panel p-6 shadow-sm sm:p-8">
              <p className="text-xl leading-9 tracking-tight text-foreground">
                I&apos;m Samir Abdumo&apos;minov, a developer interested in
                building clean, useful, and modern digital products. My focus is
                web development, AI-powered tools, EdTech, and product design. I
                enjoy turning ideas into polished interfaces and practical tools
                that people can actually use.
              </p>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    className="rounded-xl border border-line bg-panel p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[var(--shadow)]"
                    whileHover={{ y: -4 }}
                  >
                    <span className="flex size-10 items-center justify-center rounded-md bg-accent-soft text-accent">
                      <Icon size={18} />
                    </span>
                    <h3 className="mt-5 font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {item.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal id="build" className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="What I Build"
              title="Focused digital products, from interfaces to useful tools."
              text="The common thread is usefulness: interfaces and tools that help people move faster, learn better, or work with less friction."
            />
            <div className="max-w-sm rounded-xl border border-line bg-panel p-4 text-sm leading-6 text-muted">
              I prefer small, focused product systems over pages that only look
              good in a screenshot.
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {buildAreas.map((item) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  className="group min-h-56 rounded-2xl border border-line bg-panel p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[var(--shadow)]"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-105">
                      <Icon size={19} />
                    </span>
                    <ArrowUpRight
                      size={17}
                      className="text-muted opacity-50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
                    />
                  </div>
                  <h3 className="mt-8 text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {item.text}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal id="skills" className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Skills"
            title="A structured stack for building modern products."
            text="The skill set is centered on frontend development, interface quality, practical tools, and product areas I want to keep exploring."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {skillGroups.map((group) => {
              const Icon = group.icon;

              return (
                <motion.div
                  key={group.title}
                  className="rounded-2xl border border-line bg-panel p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[var(--shadow)]"
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                      <Icon size={19} />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight">
                        {group.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {group.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-line bg-panel-soft px-3 py-1.5 text-sm text-muted"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal id="projects" className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Projects"
              title="Project work, concepts, and experiments."
              text="A balanced view of shipped work, concepts, portfolio systems, and small utility experiments."
            />
            <p className="max-w-sm text-sm leading-6 text-muted">
              Real links are used where available. Other demo and GitHub links
              stay as placeholders until those projects are public.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {projects.map((project) => (
              <motion.article
                key={project.name}
                className="group rounded-2xl border border-line bg-panel p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[var(--shadow)]"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full border border-line bg-panel-soft px-3 py-1 font-mono text-xs uppercase tracking-[0.16em] text-accent">
                    {project.status}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-muted opacity-50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
                  />
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
                  {project.name}
                </h3>
                <p className="mt-4 leading-7 text-muted">
                  {project.description}
                </p>
                <div className="mt-6 rounded-xl border border-line bg-panel-soft p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                    Problem solved
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {project.problem}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-line bg-background/70 px-3 py-1.5 text-sm text-muted"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ActionLink
                    href={project.demo}
                    external={project.demo.startsWith("http")}
                  >
                    Live
                    <ArrowUpRight size={15} />
                  </ActionLink>
                  <ActionLink href={project.github} variant="secondary">
                    GitHub
                    <GitBranch size={15} />
                  </ActionLink>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal id="blog" className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Blog"
              title="Posts, notes, and build updates."
              text="A lightweight writing space for web development, interface thinking, AI tools, product notes, and project updates."
            />
            <ActionLink href="/blog" variant="secondary">
              View all posts
              <BookOpen size={16} />
            </ActionLink>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <motion.a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-line bg-panel p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[var(--shadow)]"
                whileHover={{ y: -4 }}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="rounded-full border border-line bg-panel-soft px-2.5 py-1 font-mono text-accent">
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                  <span>{post.readingTime}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {post.excerpt}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors group-hover:text-accent">
                  Read post
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal id="philosophy" className="px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <SectionHeading
            eyebrow="Development Philosophy"
            title="The principles behind the work."
            text="A good interface should feel considered, fast, and useful before it feels decorative."
          />
          <div className="grid gap-4">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                className="flex gap-5 rounded-2xl border border-line bg-panel p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[var(--shadow)]"
                whileHover={{ y: -4 }}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-xs text-accent">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-semibold tracking-tight">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {principle.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal id="build-log" className="px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading
            eyebrow="Build Log"
            title="A compact changelog of what I am building and learning."
            text="A product-style timeline for real work, direction, and progress without fake experience or inflated claims."
          />
          <div className="rounded-2xl border border-line bg-panel p-2 shadow-sm">
            {buildLog.map((item) => (
              <div
                key={`${item.year}-${item.status}`}
                className="grid gap-4 border-b border-line p-5 last:border-b-0 sm:grid-cols-[96px_120px_1fr] sm:items-center"
              >
                <span className="font-mono text-sm text-muted">
                  {item.year}
                </span>
                <span className="w-fit rounded-full border border-line bg-panel-soft px-3 py-1 font-mono text-xs text-accent">
                  {item.status}
                </span>
                <p className="leading-7 text-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal id="contact" className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-line bg-panel p-8 shadow-[var(--shadow)] sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
                Contact
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Have an idea, project, or collaboration?
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-muted">
                Feel free to contact me. I am open to useful projects, learning
                opportunities, and building modern digital products.
              </p>
            </div>
            <div className="grid gap-3">
              <button
                type="button"
                onClick={copyEmail}
                className="flex items-center justify-between rounded-xl border border-line bg-panel-soft p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <span className="flex min-w-0 items-center gap-3">
                  {copied ? (
                    <Check size={18} className="shrink-0 text-accent" />
                  ) : (
                    <Copy size={18} className="shrink-0 text-accent" />
                  )}
                  <span className="truncate">
                    {copied
                      ? "Copied email"
                      : "samirabdumominov@gmail.com"}
                  </span>
                </span>
                <span className="shrink-0 text-sm text-muted">
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>
              <a
                href="mailto:samirabdumominov@gmail.com"
                className="flex items-center justify-between rounded-xl border border-line bg-panel-soft p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Mail size={18} className="shrink-0 text-accent" />
                  <span className="truncate">Open email app</span>
                </span>
                <ArrowUpRight size={16} className="shrink-0" />
              </a>
              <ActionLink href="#" variant="secondary">
                <GitBranch size={16} />
                GitHub placeholder
              </ActionLink>
              <ActionLink href="#" variant="secondary">
                <Send size={16} />
                Telegram placeholder
              </ActionLink>
            </div>
          </div>
        </div>
      </SectionReveal>

      <footer className="border-t border-line px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-muted sm:flex-row">
          <p>
            © 2026 Samir Abdumo&apos;minov. Built with Next.js and Tailwind CSS.
          </p>
          <a
            href="#home"
            className="text-foreground transition-colors hover:text-accent"
          >
            Back to top
          </a>
        </div>
      </footer>
    </main>
  );
}
