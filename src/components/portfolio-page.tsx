"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  AtSign,
  BookOpen,
  Check,
  Code2,
  Command,
  Copy,
  Hash,
  Keyboard,
  GitBranch,
  Layers3,
  Mail,
  MessageCircle,
  Moon,
  Mic,
  MicOff,
  Radio,
  Send,
  Server,
  Sparkles,
  Sun,
  TerminalSquare,
  Volume2,
  X,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { BlogPost } from "@/data/blog";
import type { Locale } from "@/lib/locale";
import { isLocale, localeCookieName } from "@/lib/locale";

const githubUrl = "https://github.com/samirdevuz";
const telegramUrl = "https://t.me/samirdevuz";
const instagramUrl = "https://www.instagram.com/abdumuminov_samir";
const xUrl = "https://x.com/samirdevuz";
const discordUrl = "https://discord.com/users/samirdevuz";
const monkeytypeUrl = "https://monkeytype.com/profile/samirdevuz";

const socialLinks = [
  { label: "GitHub", handle: "@samirdevuz", href: githubUrl, icon: GitBranch },
  { label: "Telegram", handle: "@samirdevuz", href: telegramUrl, icon: Send },
  {
    label: "Instagram",
    handle: "@abdumuminov_samir",
    href: instagramUrl,
    icon: AtSign,
  },
  { label: "X", handle: "@samirdevuz", href: xUrl, icon: AtSign },
  { label: "Discord", handle: "@samirdevuz", href: discordUrl, icon: MessageCircle },
  {
    label: "Monkeytype",
    handle: "@samirdevuz",
    href: monkeytypeUrl,
    icon: Keyboard,
  },
];

const navItems = [
  { label: { en: "welcome", uz: "xush-kelibsiz" }, href: "#home", id: "home", channel: "# welcome" },
  { label: { en: "about-samir", uz: "samir-haqida" }, href: "#about", id: "about", channel: "# general-about" },
  { label: { en: "skills-stack", uz: "kunikmalar-stack" }, href: "#skills", id: "skills", channel: "# skills-stack" },
  { label: { en: "projects", uz: "loyihalar" }, href: "#projects", id: "projects", channel: "# projects" },
  { label: { en: "blog-announcements", uz: "blog-yangiliklar" }, href: "#blog", id: "blog", channel: "# blog-announcements" },
  { label: { en: "contact-dm", uz: "aloqa-dm" }, href: "#contact", id: "contact", channel: "# contact-dm" },
];

const copy = {
  en: {
    language: "Language",
    menu: "Menu",
    commandMenu: "Discord Quick Actions",
    closeCommandMenu: "Close actions",
    pressEsc: "Press Esc or click outside to close",
    heroBadge: "Discord-powered Web, AI & EdTech Hub",
    heroTitle: "Building useful web products.",
    heroText:
      "I'm Samir Abdumo'minov — software developer focused on React, Next.js, AI workflows, EdTech platforms, and turning useful ideas into polished digital products.",
    viewProjects: "Explore Projects",
    openCommandMenu: "Quick Commands",
    heroChips: ["# web-products", "# ai-workflows", "# edtech-tools"],
    aboutEyebrow: "# general-about",
    aboutTitle: "Building with a product mindset.",
    aboutText:
      "I care about useful software, clean interfaces, and understanding the core tech behind modern digital products.",
    aboutBody:
      "I'm Samir Abdumo'minov, a developer interested in building clean, useful, and modern digital products. My focus is web development, AI-powered tools, EdTech, and product design. I enjoy turning ideas into polished interfaces and practical tools that people can actually use.",
    skillsEyebrow: "# skills-stack",
    skillsTitle: "A structured stack for building modern products.",
    skillsText:
      "The skill set is centered on frontend development, interface quality, practical tools, and product areas I want to keep exploring.",
    projectsEyebrow: "# projects",
    projectsTitle: "Project work, concepts, and experiments.",
    projectsText:
      "A balanced view of shipped work, concepts, portfolio systems, and small utility experiments.",
    projectsNote:
      "Real links are used where available. Other demo and GitHub links stay as placeholders until those projects are public.",
    featuredProject: "NITRO BOOSTED PROJECT",
    milliyPrepText:
      "An EdTech platform designed to help learners prepare for Uzbekistan's Milliy Sertifikat exams across multiple subjects with a clean, focused, and modern study experience.",
    milliyPrepTags: ["Next.js", "EdTech", "Study platform", "Uzbek learners"],
    milliyPrepPoints: [
      "Multi-subject exam preparation",
      "Clean learning experience",
      "Modern EdTech interface",
      "Built for Uzbek learners",
    ],
    problemSolved: "Problem solved",
    live: "Live Demo",
    blogEyebrow: "# blog-announcements",
    blogTitle: "Posts, notes, and build updates.",
    blogText:
      "A lightweight writing space for web development, interface thinking, AI tools, product notes, and project updates.",
    viewAllPosts: "View all posts",
    readPost: "Read post",
    contactEyebrow: "# contact-dm",
    contactTitle: "Have an idea, project, or collaboration?",
    contactText:
      "Send a message or connect directly. I am open to useful projects, learning opportunities, and building modern digital products.",
    copiedEmail: "Copied email",
    copied: "Copied",
    copy: "Copy Tag",
    openEmailApp: "Open email client",
    toggleTheme: "Toggle Discord Theme",
    footer: "Built with Next.js, Tailwind CSS & Discord UI Aesthetics.",
    backToTop: "Back to top",
    commandActions: {
      viewProjects: ["Explore Projects", "Jump to project showcase"],
      openMilliyPrep: ["Open MilliyPrep", "milliyprep.xyz"],
      copyEmail: ["Copy Email", "samirabdumominov@gmail.com"],
      emailCopied: ["Email Copied", "samirabdumominov@gmail.com"],
      toggleDarkMode: ["Toggle Theme", "Switch light/dark Discord theme"],
      viewSkills: ["View Tech Stack", "Skills and frameworks"],
      viewBlog: ["View Blog Announcements", "Posts and notes"],
      contactMe: ["Direct Message", "Email and social connections"],
      openInstagram: ["Open Instagram", "@abdumuminov_samir"],
    },
  },
  uz: {
    language: "Til",
    menu: "Menyu",
    commandMenu: "Discord Tezkor Harakatlar",
    closeCommandMenu: "Yopish",
    pressEsc: "Yopish uchun Esc bosing",
    heroBadge: "Web, AI & EdTech Discord-Style Hub",
    heroTitle: "Foydali web mahsulotlar quraman.",
    heroText:
      "Men Samir Abdumo'minovman. React, Next.js, AI workflowlar, EdTech platformalar hamda foydali g'oyalarni puxta digital mahsulotga aylantirishga fokus qilaman.",
    viewProjects: "Loyihalarni ko'rish",
    openCommandMenu: "Tezkor komandalar",
    heroChips: ["# web-mahsulotlar", "# ai-workflowlar", "# edtech-toollar"],
    aboutEyebrow: "# samir-haqida",
    aboutTitle: "Mahsulot fikrlashi bilan quraman.",
    aboutText:
      "Foydali software, toza interfeyslar va zamonaviy texnologiya ortidagi asoslarni o'rganish men uchun muhim.",
    aboutBody:
      "Men Samir Abdumo'minovman. Toza, foydali va zamonaviy digital mahsulotlar qurishga qiziqaman. Fokusim web development, AI-powered tools, EdTech va product design. G'oyalarni odamlar ishlata oladigan puxta interfeys va amaliy toollarga aylantirishni yaxshi ko'raman.",
    skillsEyebrow: "# kunikmalar-stack",
    skillsTitle: "Zamonaviy mahsulotlar uchun tartibli stack.",
    skillsText:
      "Ko'nikmalar frontend development, interface quality, amaliy toollar va product yo'nalishlariga qaratilgan.",
    projectsEyebrow: "# loyihalar",
    projectsTitle: "Loyihalar, konseptlar va tajribalar.",
    projectsText:
      "Chiqqan ishlar, konseptlar, portfolio tizimlari va kichik utility tajribalarining muvozanatli ko'rinishi.",
    projectsNote:
      "Mavjud joylarda haqiqiy linklar ishlatiladi. Boshqa demo va GitHub linklar loyiha public bo'lguncha placeholder bo'lib turadi.",
    featuredProject: "NITRO BOOSTED LOYIHA",
    milliyPrepText:
      "O'zbek o'quvchilari uchun Milliy Sertifikat imtihonlariga bir nechta fan bo'yicha toza, fokusli va zamonaviy tayyorgarlik tajribasi beradigan EdTech platforma.",
    milliyPrepTags: ["Next.js", "EdTech", "Study platform", "O'zbek o'quvchilar"],
    milliyPrepPoints: [
      "Bir nechta fan bo'yicha tayyorgarlik",
      "Toza learning experience",
      "Zamonaviy EdTech interface",
      "O'zbek o'quvchilar uchun",
    ],
    problemSolved: "Yechilayotgan muammo",
    live: "Live Demo",
    blogEyebrow: "# blog-yangiliklar",
    blogTitle: "Postlar, qaydlar va build yangiliklari.",
    blogText:
      "Web development, interface fikrlash, AI tools, product qaydlar va loyiha yangiliklari uchun yengil yozuv maydoni.",
    viewAllPosts: "Barcha postlar",
    readPost: "Postni o'qish",
    contactEyebrow: "# aloqa-dm",
    contactTitle: "G'oya, loyiha yoki hamkorlik bormi?",
    contactText:
      "Bemalol yozing. Foydali loyihalar, learning tools va zamonaviy digital mahsulotlar qurishga ochiqman.",
    copiedEmail: "Email nusxalandi",
    copied: "Nusxalandi",
    copy: "Tag nusxalash",
    openEmailApp: "Email ilovasini ochish",
    toggleTheme: "Discord rejimini almashtirish",
    footer: "Next.js, Tailwind CSS va Discord UI dizayni bilan qurilgan.",
    backToTop: "Yuqoriga",
    commandActions: {
      viewProjects: ["Loyihalarni ko'rish", "Project gridga o'tish"],
      openMilliyPrep: ["MilliyPrep'ni ochish", "milliyprep.xyz"],
      copyEmail: ["Email nusxalash", "samirabdumominov@gmail.com"],
      emailCopied: ["Email nusxalandi", "samirabdumominov@gmail.com"],
      toggleDarkMode: ["Theme almashtirish", "Sayt rejimini almashtirish"],
      viewSkills: ["Ko'nikmalarni ko'rish", "Tech stack"],
      viewBlog: ["Blogni ko'rish", "Postlar va qaydlar"],
      contactMe: ["Aloqa / Direct Message", "Email va social linklar"],
      openInstagram: ["Instagramni ochish", "@abdumuminov_samir"],
    },
  },
} satisfies Record<Locale, Record<string, unknown>>;

function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#5865F2]/40 bg-[#5865F2] p-1 shadow-md ring-2 ring-[#5865F2]/30",
        className,
      )}
      aria-hidden="true"
    >
      <Image
        src="/logo-premium.png"
        alt="Samir"
        className="size-full object-contain rounded-full"
        width={36}
        height={36}
      />
    </span>
  );
}

const highlights = [
  {
    title: "Web development",
    text: "Modern interfaces built with React, Next.js, TypeScript, and practical frontend patterns.",
    icon: Code2,
    roleColor: "#5865F2",
  },
  {
    title: "AI tools",
    text: "Study assistants, automation ideas, and workflows that make learning or building faster.",
    icon: Sparkles,
    roleColor: "#EB459E",
  },
  {
    title: "Product systems",
    text: "Focused digital products designed around clarity, structure, and real user needs.",
    icon: Layers3,
    roleColor: "#23A55A",
  },
];

const skillGroups = [
  {
    title: "Frontend Core",
    description:
      "Building fast, maintainable interfaces with component-driven architecture and modern web foundations.",
    icon: Code2,
    skills: ["React", "Next.js", "TypeScript", "JavaScript"],
    badgeColor: "border-[#5865F2]/40 bg-[#5865F2]/10 text-[#5865F2]",
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
    badgeColor: "border-[#EB459E]/40 bg-[#EB459E]/10 text-[#EB459E]",
  },
  {
    title: "AI Workflow",
    description:
      "Using AI-assisted workflows to learn faster, prototype ideas, and improve product iteration.",
    icon: TerminalSquare,
    skills: [
      "ChatGPT Plus",
      "OpenAI Codex CLI",
      "GPT-4o",
      "AI coding tools",
      "Automation",
      "Prompt engineering",
    ],
    badgeColor: "border-[#FEE75C]/40 bg-[#FEE75C]/10 text-[#FEE75C] dark:text-[#FEE75C]",
  },
  {
    title: "Product Thinking",
    description:
      "Exploring areas where software can improve learning, automation, security, and digital products.",
    icon: Sparkles,
    skills: ["EdTech", "SaaS", "Clean UX", "Practical tools"],
    badgeColor: "border-[#23A55A]/40 bg-[#23A55A]/10 text-[#23A55A]",
  },
  {
    title: "Backend & Integrations",
    description:
      "Building backend systems and local payment and SMS integrations for the Uzbekistan and CIS markets.",
    icon: Server,
    skills: [
      "Next.js (App Router)",
      "Supabase",
      "Click",
      "Payme",
      "Eskiz.uz",
    ],
    badgeColor: "border-[#5865F2]/40 bg-[#5865F2]/10 text-[#5865F2]",
  },
];

const projects = [
  {
    name: "3D Models Showcase",
    status: "Subdomain",
    description:
      "A subdomain project serving as an archive of my 3D models from Sketchfab, showcasing interactive 3D assets and experiments.",
    problem:
      "Provides an interactive space to archive and display 3D models from Sketchfab directly on a dedicated subdomain.",
    stack: ["Next.js", "3D", "Sketchfab"],
    demo: "https://models.samirdev.uz",
    github: "https://github.com/samirdevuz/models.samirdev.uz",
    visual: "3dmodels",
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
    github: "https://github.com/samirdevuz/samirdev.uz",
    visual: "portfolio",
  },
];

const localizedData = {
  en: {
    highlights,
    skillGroups,
    projects,
  },
  uz: {
    highlights: [
      {
        title: "Web development",
        text: "React, Next.js, TypeScript va amaliy frontend patternlar bilan zamonaviy interfeyslar.",
        icon: Code2,
        roleColor: "#5865F2",
      },
      {
        title: "AI tools",
        text: "O'rganish yoki qurishni tezlashtiradigan study assistantlar, automation g'oyalar va workflowlar.",
        icon: Sparkles,
        roleColor: "#EB459E",
      },
      {
        title: "Product systemlar",
        text: "Aniqlik, struktura va real user ehtiyojlariga qaratilgan fokusli digital mahsulotlar.",
        icon: Layers3,
        roleColor: "#23A55A",
      },
    ],
    skillGroups: [
      {
        title: "Frontend Core",
        description:
          "Component-driven architecture va zamonaviy web asoslari bilan tez, maintainable interfeyslar qurish.",
        icon: Code2,
        skills: ["React", "Next.js", "TypeScript", "JavaScript"],
        badgeColor: "border-[#5865F2]/40 bg-[#5865F2]/10 text-[#5865F2]",
      },
      {
        title: "UI Engineering",
        description:
          "Product g'oyalarni responsive ekranlarga aylantirish: motion, accessibility basics va polish bilan.",
        icon: Layers3,
        skills: [
          "Tailwind CSS",
          "Responsive Design",
          "Framer Motion",
          "Accessibility basics",
        ],
        badgeColor: "border-[#EB459E]/40 bg-[#EB459E]/10 text-[#EB459E]",
      },
      {
        title: "AI Workflow",
        description:
          "AI-assisted workflowlardan tezroq o'rganish, prototiplash va product iteration uchun foydalanish.",
        icon: TerminalSquare,
        skills: [
          "ChatGPT Plus",
          "OpenAI Codex CLI",
          "GPT-4o",
          "AI coding tools",
          "Automation",
          "Prompt engineering",
        ],
        badgeColor: "border-[#FEE75C]/40 bg-[#FEE75C]/10 text-[#FEE75C]",
      },
      {
        title: "Product Thinking",
        description:
          "Software ta'lim, automation, security va digital productlarni yaxshilashi mumkin bo'lgan yo'nalishlarni o'rganish.",
        icon: Sparkles,
        skills: ["EdTech", "SaaS", "Clean UX", "Practical tools"],
        badgeColor: "border-[#23A55A]/40 bg-[#23A55A]/10 text-[#23A55A]",
      },
      {
        title: "Backend & Integrations",
        description:
          "O'zbekiston va MDH bozori uchun backend tizimlar hamda mahalliy to'lov va SMS integratsiyalarini qurish.",
        icon: Server,
        skills: [
          "Next.js (App Router)",
          "Supabase",
          "Click",
          "Payme",
          "Eskiz.uz",
        ],
        badgeColor: "border-[#5865F2]/40 bg-[#5865F2]/10 text-[#5865F2]",
      },
    ],
    projects: [
      {
        name: "3D Models Showcase",
        status: "Subdomen",
        description:
          "Sketchfab profilimdagi 3D modellar arxivi bo'lgan hamda interaktiv 3D aktivlar va tajribalarni ko'rsatuvchi subdomen loyihasi.",
        problem:
          "Sketchfab'dagi 3D modellarni alohida subdomenda arxivlash va ko'rsatish uchun interaktiv maydon beradi.",
        stack: ["Next.js", "3D", "Sketchfab"],
        demo: "https://models.samirdev.uz",
        github: "https://github.com/samirdevuz/models.samirdev.uz",
        visual: "3dmodels",
      },
      {
        name: "Personal Portfolio",
        status: "Shu sayt",
        description:
          "Ishlar, yo'nalish va texnik didni aniqroq ko'rsatish uchun minimal portfolio tizimi.",
        problem:
          "Oddiy resume sahifa yoki generic templatega qaraganda kuchliroq birinchi taassurot yaratadi.",
        stack: ["Next.js", "Tailwind CSS", "Framer Motion"],
        demo: "#",
        github: "https://github.com/samirdevuz/samirdev.uz",
        visual: "portfolio",
      },
    ],
  },
};

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
      className={cn("scroll-mt-28 border-t border-[#1E1F22]/80 dark:border-white/10", className)}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
      <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-[#5865F2] bg-[#5865F2]/10 border border-[#5865F2]/20 px-2.5 py-1 rounded-md">
        <Hash size={13} className="text-[#5865F2]" />
        <span>{eyebrow.replace(/^#\s*/, "")}</span>
      </div>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-7 text-muted sm:text-lg">{text}</p>
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
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50",
        "active:scale-95 hover:shadow-lg",
        variant === "primary" &&
          "bg-[#5865F2] text-white hover:bg-[#4752C4] shadow-[0_4px_14px_rgba(88,101,242,0.4)]",
        variant === "secondary" &&
          "bg-[#2B2D31] text-white border border-white/10 hover:bg-[#383A40] hover:border-[#5865F2]/50 dark:bg-[#2B2D31] dark:text-white",
      )}
    >
      {children}
    </a>
  );
}

function CommandMenu({
  open,
  copied,
  locale,
  onClose,
  onCopyEmail,
  onToggleTheme,
}: {
  open: boolean;
  copied: boolean;
  locale: Locale;
  onClose: () => void;
  onCopyEmail: () => void;
  onToggleTheme: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstActionRef = useRef<HTMLButtonElement>(null);
  const t = copy[locale];
  const actionsCopy = t.commandActions as {
    viewProjects: string[];
    openMilliyPrep: string[];
    copyEmail: string[];
    emailCopied: string[];
    toggleDarkMode: string[];
    viewSkills: string[];
    viewBlog: string[];
    contactMe: string[];
    openInstagram: string[];
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    onClose();
  };

  const actions = [
    {
      label: actionsCopy.viewProjects[0],
      hint: actionsCopy.viewProjects[1],
      icon: Layers3,
      run: () => scrollTo("projects"),
    },
    {
      label: actionsCopy.openMilliyPrep[0],
      hint: actionsCopy.openMilliyPrep[1],
      icon: ArrowUpRight,
      run: () => {
        window.open("https://milliyprep.xyz", "_blank", "noreferrer");
        onClose();
      },
    },
    {
      label: copied ? actionsCopy.emailCopied[0] : actionsCopy.copyEmail[0],
      hint: copied ? actionsCopy.emailCopied[1] : actionsCopy.copyEmail[1],
      icon: copied ? Check : Copy,
      run: onCopyEmail,
    },
    {
      label: actionsCopy.toggleDarkMode[0],
      hint: actionsCopy.toggleDarkMode[1],
      icon: Moon,
      run: onToggleTheme,
    },
    {
      label: actionsCopy.viewSkills[0],
      hint: actionsCopy.viewSkills[1],
      icon: Code2,
      run: () => scrollTo("skills"),
    },
    {
      label: actionsCopy.viewBlog[0],
      hint: actionsCopy.viewBlog[1],
      icon: BookOpen,
      run: () => scrollTo("blog"),
    },
    {
      label: actionsCopy.contactMe[0],
      hint: actionsCopy.contactMe[1],
      icon: Mail,
      run: () => scrollTo("contact"),
    },
    {
      label: actionsCopy.openInstagram[0],
      hint: actionsCopy.openInstagram[1],
      icon: AtSign,
      run: () => {
        window.open(instagramUrl, "_blank", "noreferrer");
        onClose();
      },
    },
  ];

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousActiveElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    firstActionRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const focusable = Array.from(focusableElements ?? []).filter(
        (element) => !element.hasAttribute("disabled"),
      );
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 px-4 pt-24 backdrop-blur-md"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
      onMouseDown={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.commandMenu as string}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#5865F2]/30 bg-[#2B2D31] text-white shadow-2xl"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-[#1E1F22] px-4 py-3">
          <div className="flex items-center gap-2.5 text-sm font-semibold">
            <span className="flex size-7 items-center justify-center rounded-md bg-[#5865F2] text-white">
              <Command size={15} />
            </span>
            <span className="text-[#F2F3F5]">{t.commandMenu as string}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[#949BA4] hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-2 space-y-1">
          {actions.map((action, index) => {
            const Icon = action.icon;

            return (
              <button
                key={action.label}
                ref={index === 0 ? firstActionRef : undefined}
                type="button"
                onClick={action.run}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-[#5865F2] hover:text-white focus:bg-[#5865F2] focus:outline-none group"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#1E1F22] text-[#5865F2] group-hover:bg-white/20 group-hover:text-white">
                  <Icon size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-white">
                    {action.label}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-[#949BA4] group-hover:text-white/80">
                    {action.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="border-t border-white/10 bg-[#1E1F22] px-4 py-2.5 font-mono text-xs text-[#949BA4]">
          {t.pressEsc as string}
        </div>
      </motion.div>
    </motion.div>
  );
}

function HeroVisual() {
  const [micMuted, setMicMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);

  return (
    <motion.div
      className="relative min-h-[480px] space-y-4"
      initial={{ opacity: 0, x: 20, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      {/* Discord Profile Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#2B2D31] text-white shadow-2xl">
        {/* Banner */}
        <div className="h-24 w-full bg-gradient-to-r from-[#5865F2] via-[#EB459E] to-[#5865F2] bg-[size:200%_auto] animate-pulse" />

        {/* Profile Header */}
        <div className="px-5 pb-5 pt-0 relative">
          <div className="flex justify-between items-end -mt-10 mb-3">
            <div className="relative">
              <div className="size-20 rounded-full border-4 border-[#2B2D31] bg-[#1E1F22] overflow-hidden shadow-lg">
                <Image
                  src="/logo-premium.png"
                  alt="Samir"
                  width={80}
                  height={80}
                  className="size-full object-cover"
                />
              </div>
              <span className="absolute bottom-1 right-1 size-4 rounded-full border-2 border-[#2B2D31] bg-[#23A55A]" title="Online" />
            </div>

            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#5865F2] px-2 py-1 text-[11px] font-bold text-white shadow">
                <ShieldCheck size={12} />
                DEV
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-[#EB459E] px-2 py-1 text-[11px] font-bold text-white shadow">
                <Zap size={12} />
                NITRO
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-[#23A55A] px-2 py-1 text-[11px] font-bold text-white shadow">
                BOT
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xl font-bold text-white">Samir Abdumo&apos;minov</h3>
              <span className="text-xs text-[#949BA4]">@samirdevuz</span>
            </div>

            {/* Custom Status */}
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#1E1F22] px-3 py-1.5 text-xs text-[#DBDEE1]">
              <span className="text-base">🚀</span>
              <span className="truncate">Building MilliyPrep & AI Web Tools</span>
            </div>

            {/* About Me */}
            <div className="mt-3 border-t border-white/10 pt-3">
              <p className="text-xs uppercase font-bold text-[#949BA4] tracking-wider">ABOUT ME</p>
              <p className="mt-1 text-xs text-[#DBDEE1] leading-relaxed">
                Full-stack web developer specializing in Next.js, AI workflows & EdTech platforms. Passionate about clean code and modern digital design.
              </p>
            </div>

            {/* Active Playing Activity */}
            <div className="mt-3 rounded-xl border border-white/5 bg-[#1E1F22] p-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#949BA4]">PLAYING A GAME</p>
                <span className="size-2 rounded-full bg-[#23A55A] animate-ping" />
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#007ACC] text-white font-bold text-xs">
                  VS
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">Visual Studio Code</p>
                  <p className="text-[11px] text-[#949BA4] truncate">Developing samirdev.uz</p>
                  <p className="text-[10px] text-[#23A55A] font-mono mt-0.5">Elapsed: 04:20:15</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discord Voice Activity Card */}
      <div className="rounded-xl border border-white/10 bg-[#2B2D31] p-3 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#23A55A]/20 text-[#23A55A]">
            <Radio size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-[#23A55A]">Voice Connected</p>
              <span className="text-[10px] text-[#949BA4]">/ General Channel</span>
            </div>
            <p className="text-[11px] text-[#949BA4]">RTC Connecting • 12ms ping</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMicMuted(!micMuted)}
            className={cn(
              "p-2 rounded-lg text-xs transition-colors",
              micMuted ? "bg-[#F23F43] text-white" : "bg-[#1E1F22] text-[#949BA4] hover:text-white"
            )}
            title={micMuted ? "Unmute" : "Mute"}
          >
            {micMuted ? <MicOff size={15} /> : <Mic size={15} />}
          </button>
          <button
            type="button"
            onClick={() => setDeafened(!deafened)}
            className={cn(
              "p-2 rounded-lg text-xs transition-colors",
              deafened ? "bg-[#F23F43] text-white" : "bg-[#1E1F22] text-[#949BA4] hover:text-white"
            )}
            title={deafened ? "Undeafen" : "Deafen"}
          >
            <Volume2 size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function MilliyPrepPreview() {
  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-xl border border-[#5865F2]/30 bg-[#1E1F22] p-4 text-white shadow-2xl">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative rounded-xl border border-white/10 bg-[#2B2D31]">
        {/* Discord Window Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#1E1F22] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Hash size={16} className="text-[#5865F2]" />
            <span className="text-xs font-bold text-white">milliyprep.xyz</span>
            <span className="rounded-full bg-[#23A55A]/20 text-[#23A55A] px-2 py-0.5 text-[10px] font-mono font-semibold">
              ● LIVE PLATFORM
            </span>
          </div>
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ED4245]" />
            <span className="size-2.5 rounded-full bg-[#FEE75C]" />
            <span className="size-2.5 rounded-full bg-[#23A55A]" />
          </div>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="space-y-3">
            <div className="rounded-lg border border-white/10 bg-[#1E1F22] p-3">
              <p className="font-mono text-[11px] uppercase tracking-wider font-semibold text-[#5865F2]">
                AVAILABLE SUBJECTS
              </p>
              <div className="mt-2.5 space-y-1.5">
                {["Mathematics", "English", "History", "Biology"].map(
                  (subject, index) => (
                    <div
                      key={subject}
                      className="flex items-center justify-between rounded-md bg-[#2B2D31] px-3 py-1.5 text-xs font-medium"
                    >
                      <span className="text-white">{subject}</span>
                      <span className="font-mono text-[10px] text-[#949BA4]">
                        {index + 4} modules
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="rounded-lg bg-gradient-to-r from-[#5865F2]/20 to-[#EB459E]/20 p-3 border border-[#5865F2]/30">
              <p className="font-mono text-[10px] text-[#EB459E] uppercase font-bold">EDTECH MISSION</p>
              <p className="mt-1 text-xs font-semibold text-white">
                Preparing Uzbek students for national certification.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-lg border border-white/10 bg-[#1E1F22] p-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">
                    Milliy Sertifikat Exam Prep
                  </p>
                  <p className="text-[11px] text-[#949BA4]">Interactive testing & analysis</p>
                </div>
                <p className="font-mono text-xs font-bold text-[#23A55A]">74%</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-[#2B2D31] overflow-hidden">
                <div className="h-full w-[74%] rounded-full bg-[#23A55A]" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-md bg-[#2B2D31] p-2 text-center">
                  <p className="font-mono text-base font-bold text-white">24</p>
                  <p className="text-[10px] text-[#949BA4]">Topics</p>
                </div>
                <div className="rounded-md bg-[#2B2D31] p-2 text-center">
                  <p className="font-mono text-base font-bold text-white">8</p>
                  <p className="text-[10px] text-[#949BA4]">Subjects</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-[#1E1F22] p-3">
                <p className="font-mono text-[10px] uppercase font-semibold text-[#5865F2]">
                  PRACTICE
                </p>
                <p className="mt-1 text-xs font-semibold text-white">Test Questions</p>
                <div className="mt-2 space-y-1">
                  {["Option A", "Option B (Correct)", "Option C"].map((opt, i) => (
                    <div
                      key={opt}
                      className={cn(
                        "rounded px-2.5 py-1 text-[11px]",
                        i === 1
                          ? "bg-[#23A55A]/20 text-[#23A55A] font-bold border border-[#23A55A]/40"
                          : "bg-[#2B2D31] text-[#949BA4]"
                      )}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#1E1F22] p-3">
                <p className="font-mono text-[10px] uppercase font-semibold text-[#EB459E]">
                  ANALYTICS
                </p>
                <p className="mt-1 text-xs font-semibold text-[#F2F3F5]">Progress Tracking</p>
                <div className="mt-3 flex h-16 items-end gap-1.5">
                  {[45, 72, 60, 90, 80].map((h, idx) => (
                    <span
                      key={h}
                      className="flex-1 rounded-t bg-[#5865F2]"
                      style={{ height: `${h}%`, opacity: 0.5 + idx * 0.1 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectMockup({ type }: { type: string }) {
  if (type === "3dmodels") {
    return (
      <div className="mt-5 rounded-xl border border-white/10 bg-[#1E1F22] p-3 text-white">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#5865F2]">
            <Hash size={13} />
            <span>models.samirdev.uz</span>
          </div>
          <span className="rounded bg-[#5865F2]/20 px-2 py-0.5 text-[10px] text-[#5865F2] font-mono">
            Sketchfab 3D
          </span>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_0.8fr]">
          <div className="flex flex-col justify-between rounded-lg bg-[#2B2D31] p-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#949BA4]">3D Viewport</span>
              <span className="size-2 rounded-full bg-[#23A55A]" />
            </div>
            <div className="my-2 flex items-center justify-center py-2">
              <div className="relative flex size-14 items-center justify-center rounded-lg bg-[#5865F2]/20 text-[#5865F2]">
                <Layers3 size={24} />
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-[#949BA4] font-mono">
              <span>WebGL</span>
              <span>Interactive</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {["Model #1", "Model #2", "Model #3", "Model #4"].map((item) => (
              <div
                key={item}
                className="flex flex-col justify-between rounded-lg bg-[#2B2D31] p-2 text-center"
              >
                <div className="mx-auto flex size-5 items-center justify-center rounded bg-[#1E1F22] text-[#5865F2]">
                  <Layers3 size={11} />
                </div>
                <span className="mt-1 font-mono text-[10px] text-[#949BA4]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-xl border border-white/10 bg-[#1E1F22] p-3 text-white">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5 font-mono text-xs text-[#5865F2]">
          <Hash size={13} />
          <span>samirdev.uz</span>
        </div>
        <span className="rounded bg-[#23A55A]/20 px-2 py-0.5 text-[10px] text-[#23A55A] font-mono">
          Online
        </span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_0.8fr]">
        <div className="bg-[#2B2D31] p-3 rounded-lg">
          <div className="h-3 w-2/3 rounded bg-white/80" />
          <div className="mt-2 space-y-1.5">
            <div className="h-2 rounded bg-white/20" />
            <div className="h-2 w-4/5 rounded bg-white/20" />
            <div className="h-2 w-3/5 rounded bg-white/20" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="aspect-square rounded-lg bg-[#2B2D31]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PortfolioPage({
  blogPosts,
  initialLocale = "en",
}: {
  blogPosts: BlogPost[];
  initialLocale?: Locale;
}) {
  const [activeSection, setActiveSection] = useState("home");
  const [commandOpen, setCommandOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    rocket: 14,
    fire: 42,
    bulb: 28,
    heart: 19,
  });
  const [userReacted, setUserReacted] = useState<{ [key: string]: boolean }>({});

  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof document === "undefined") {
      return initialLocale;
    }

    const cookieLocale = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${localeCookieName}=`))
      ?.split("=")[1];

    return isLocale(cookieLocale) ? cookieLocale : initialLocale;
  });
  const { resolvedTheme, setTheme } = useTheme();
  const t = copy[locale];
  const pageData = localizedData[locale];

  const handleReaction = (key: string) => {
    setReactions((prev) => ({
      ...prev,
      [key]: userReacted[key] ? prev[key] - 1 : prev[key] + 1,
    }));
    setUserReacted((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
      // Clipboard fallback
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  useEffect(() => {
    document.cookie = `${localeCookieName}=${locale}; max-age=31536000; path=/; samesite=lax`;
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const origWriteln = document.writeln;
    const origWrite = document.write;

    const handleWrite = (html: string) => {
      const container = document.getElementById("bmc-button-container");
      if (container) {
        container.innerHTML = html;
      }
    };

    document.writeln = function (...args: string[]) {
      handleWrite(args.join(""));
    };

    document.write = function (...args: string[]) {
      handleWrite(args.join(""));
    };

    return () => {
      document.writeln = origWriteln;
      document.write = origWrite;
    };
  }, []);

  const updateLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-[#5865F2] selection:text-white">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#5865F2] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      {/* Discord Fixed Server Header Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-[#1E1F22]/80 bg-[#2B2D31]/95 backdrop-blur-md text-white shadow-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <a href="#home" className="flex items-center gap-2.5 group">
              <LogoMark />
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-sm text-white group-hover:text-[#5865F2] transition-colors">
                    Samir&apos;s Hub
                  </span>
                  <span className="size-3.5 rounded-full bg-[#5865F2] text-white flex items-center justify-center text-[8px] font-bold">
                    ✓
                  </span>
                </div>
                <span className="text-[10px] text-[#949BA4] font-mono">
                  samirdev.uz
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Channel Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 rounded-lg bg-[#1E1F22]/70 p-1 border border-white/5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
                    isActive
                      ? "bg-[#5865F2] text-white shadow"
                      : "text-[#949BA4] hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Hash size={13} className={isActive ? "text-white" : "text-[#949BA4]"} />
                  <span>{item.label[locale]}</span>
                </a>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2">
            {/* Quick Command Trigger */}
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#1E1F22] px-3 py-1.5 text-xs font-semibold text-[#DBDEE1] hover:bg-[#383A40] hover:text-white transition-all"
            >
              <Command size={14} className="text-[#5865F2]" />
              <span className="hidden sm:inline font-mono">CMD + K</span>
            </button>

            {/* Language Switcher */}
            <div className="flex rounded-lg border border-white/10 bg-[#1E1F22] p-0.5 text-xs font-bold font-mono">
              <button
                type="button"
                onClick={() => updateLocale("en")}
                className={cn(
                  "rounded-md px-2 py-1 transition-colors",
                  locale === "en" ? "bg-[#5865F2] text-white" : "text-[#949BA4] hover:text-white"
                )}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => updateLocale("uz")}
                className={cn(
                  "rounded-md px-2 py-1 transition-colors",
                  locale === "uz" ? "bg-[#5865F2] text-white" : "text-[#949BA4] hover:text-white"
                )}
              >
                UZ
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-[#1E1F22] text-[#949BA4] hover:bg-[#383A40] hover:text-white transition-colors"
              title={t.toggleTheme as string}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </header>

      <CommandMenu
        open={commandOpen}
        copied={copied}
        locale={locale}
        onClose={() => setCommandOpen(false)}
        onCopyEmail={copyEmail}
        onToggleTheme={() => setTheme(isDark ? "light" : "dark")}
      />

      {/* Hero Section */}
      <section
        id="home"
        className="relative flex min-h-screen scroll-mt-28 items-center px-4 pb-16 pt-24 sm:px-6 lg:pb-12"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(88,101,242,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(88,101,242,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute left-[10%] top-20 h-72 w-72 rounded-full bg-[#5865F2] blur-[120px] opacity-25" />
          <div className="absolute right-[15%] top-32 h-80 w-80 rounded-full bg-[#EB459E] blur-[140px] opacity-20" />
        </div>

        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Discord Server Badge Banner */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#5865F2]/40 bg-[#5865F2]/10 px-3.5 py-1.5 text-xs font-semibold text-[#5865F2] shadow-sm">
              <span className="size-2 rounded-full bg-[#23A55A] animate-pulse" />
              {t.heroBadge as string}
            </div>

            <p className="mt-6 font-mono text-xs font-extrabold uppercase tracking-widest text-[#5865F2]">
              Samir Abdumo&apos;minov — Developer
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              {t.heroTitle as string}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {t.heroText as string}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ActionLink href="#projects">
                {t.viewProjects as string}
                <ArrowUpRight size={16} />
              </ActionLink>
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                aria-label={t.openCommandMenu as string}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#2B2D31] px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#383A40] hover:border-[#5865F2]/50 focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50"
              >
                {t.openCommandMenu as string}
                <Command size={16} className="text-[#5865F2]" />
              </button>
            </div>

            <div className="mt-9 grid max-w-2xl gap-2.5 sm:grid-cols-3">
              {(t.heroChips as string[]).map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-[#1E1F22]/20 dark:border-white/10 bg-[#2B2D31]/40 px-3.5 py-2.5 text-xs font-mono font-semibold text-foreground dark:text-white"
                >
                  <Hash size={13} className="text-[#5865F2]" />
                  <span>{item.replace(/^#\s*/, "")}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="hidden lg:block">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* About Section - Channel # general-about */}
      <SectionReveal id="about" className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={t.aboutEyebrow as string}
            title={t.aboutTitle as string}
            text={t.aboutText as string}
          />

          <div className="mt-8 rounded-2xl border border-white/10 bg-[#2B2D31] p-5 sm:p-8 text-white shadow-xl">
            {/* Discord Chat Message Format */}
            <div className="flex gap-4 items-start">
              <div className="relative shrink-0">
                <div className="size-12 rounded-full border-2 border-[#5865F2] bg-[#1E1F22] overflow-hidden shadow">
                  <Image
                    src="/logo-premium.png"
                    alt="Samir"
                    width={48}
                    height={48}
                    className="size-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-[#2B2D31] bg-[#23A55A]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-base">Samir</span>
                  <span className="rounded bg-[#5865F2] px-1.5 py-0.5 text-[10px] font-bold text-white">
                    BOT
                  </span>
                  <span className="rounded bg-[#23A55A] px-1.5 py-0.5 text-[10px] font-bold text-white">
                    DEV
                  </span>
                  <span className="text-xs text-[#949BA4]">Today at 12:00 PM</span>
                </div>

                {/* Discord Embed Card */}
                <div className="mt-3 overflow-hidden rounded-xl border-l-4 border-l-[#5865F2] bg-[#1E1F22] p-5 shadow-lg">
                  <p className="text-lg leading-relaxed text-[#DBDEE1]">
                    {t.aboutBody as string}
                  </p>

                  {/* Reaction Buttons */}
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                    {[
                      { key: "rocket", emoji: "🚀", count: reactions.rocket },
                      { key: "fire", emoji: "🔥", count: reactions.fire },
                      { key: "bulb", emoji: "💡", count: reactions.bulb },
                      { key: "heart", emoji: "❤️", count: reactions.heart },
                    ].map(({ key, emoji, count }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleReaction(key)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all border",
                          userReacted[key]
                            ? "border-[#5865F2] bg-[#5865F2]/20 text-[#5865F2]"
                            : "border-white/10 bg-[#2B2D31] text-[#949BA4] hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <span>{emoji}</span>
                        <span>{count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {pageData.highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    className="rounded-xl border border-white/10 bg-[#1E1F22] p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#5865F2]/50"
                    whileHover={{ y: -4 }}
                  >
                    <span className="flex size-10 items-center justify-center rounded-lg bg-[#5865F2]/20 text-[#5865F2]">
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#949BA4]">
                      {item.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* Skills Section - Channel # skills-stack */}
      <SectionReveal id="skills" className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={t.skillsEyebrow as string}
            title={t.skillsTitle as string}
            text={t.skillsText as string}
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {pageData.skillGroups.map((group) => {
              const Icon = group.icon;

              return (
                <motion.div
                  key={group.title}
                  className="rounded-2xl border border-white/10 bg-[#2B2D31] p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#5865F2]/50"
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#5865F2]/20 text-[#5865F2]">
                      <Icon size={20} />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {group.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#949BA4]">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className={cn(
                          "rounded-md border px-2.5 py-1 text-xs font-semibold",
                          group.badgeColor || "border-white/10 bg-[#1E1F22] text-[#DBDEE1]"
                        )}
                      >
                        @{skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      {/* Projects Section - Channel # projects */}
      <SectionReveal id="projects" className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow={t.projectsEyebrow as string}
              title={t.projectsTitle as string}
              text={t.projectsText as string}
            />
            <p className="max-w-sm text-xs leading-relaxed text-muted">
              {t.projectsNote as string}
            </p>
          </div>

          {/* Featured Boosted Project (MilliyPrep) */}
          <motion.div
            className="mt-8 overflow-hidden rounded-2xl border-2 border-[#EB459E]/50 bg-[#2B2D31] text-white shadow-2xl relative"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="p-6 sm:p-8 border-b border-white/10 lg:border-b-0 lg:border-r">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-gradient-to-r from-[#5865F2] to-[#EB459E] px-3 py-1 text-xs font-extrabold text-white shadow">
                    ⚡ {t.featuredProject as string}
                  </span>
                  <span className="rounded-md border border-white/10 bg-[#1E1F22] px-2.5 py-1 font-mono text-xs text-[#949BA4]">
                    milliyprep.xyz
                  </span>
                </div>

                <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
                  MilliyPrep
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-[#DBDEE1]">
                  {t.milliyPrepText as string}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {(t.milliyPrepTags as string[]).map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-white/10 bg-[#1E1F22] px-2.5 py-1 text-xs font-semibold text-[#5865F2]"
                    >
                      #{item}
                    </span>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  {(t.milliyPrepPoints as string[]).map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <span className="size-2 rounded-full bg-[#23A55A]" />
                      <span className="text-xs font-semibold text-white">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-7">
                  <ActionLink href="https://milliyprep.xyz" external>
                    {t.live as string}
                    <ArrowUpRight size={16} />
                  </ActionLink>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-[#1E1F22]/50 flex items-center justify-center">
                <MilliyPrepPreview />
              </div>
            </div>
          </motion.div>

          {/* Other Projects Grid */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {pageData.projects.map((project) => (
              <motion.article
                key={project.name}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#2B2D31] p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#5865F2]/50"
                whileHover={{ y: -4 }}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-lg text-white">
                      {project.name}
                    </span>
                    <span className="rounded-md bg-[#5865F2]/20 px-2.5 py-1 font-mono text-xs font-semibold text-[#5865F2]">
                      {project.status}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-[#DBDEE1]">
                    {project.description}
                  </p>

                  <ProjectMockup type={project.visual} />

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/10 bg-[#1E1F22] px-2 py-0.5 font-mono text-[11px] text-[#949BA4]"
                      >
                        #{tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2.5 pt-4 border-t border-white/10">
                  {project.name === "Personal Portfolio" ? (
                    <span className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1E1F22] px-4 text-xs font-semibold text-[#23A55A]">
                      <span className="size-2 rounded-full bg-[#23A55A] animate-pulse" />
                      {locale === "uz" ? "Siz shu yerdasiz" : "You are here"}
                    </span>
                  ) : (
                    <ActionLink
                      href={project.demo}
                      external={project.demo.startsWith("http")}
                    >
                      {t.live as string}
                      <ArrowUpRight size={15} />
                    </ActionLink>
                  )}
                  <ActionLink
                    href={project.github}
                    external={project.github.startsWith("http")}
                    variant="secondary"
                  >
                    GitHub
                    <GitBranch size={15} />
                  </ActionLink>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* Blog Section - Channel # blog-announcements */}
      <SectionReveal id="blog" className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow={t.blogEyebrow as string}
              title={t.blogTitle as string}
              text={t.blogText as string}
            />
            <ActionLink href="/blog" variant="secondary">
              {t.viewAllPosts as string}
              <BookOpen size={16} />
            </ActionLink>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <motion.a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-white/10 bg-[#2B2D31] p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#5865F2]/50"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-2 text-xs text-[#949BA4]">
                  <span className="rounded-md bg-[#5865F2]/20 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#5865F2]">
                    #{post.category}
                  </span>
                  <span>• {post.date}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white group-hover:text-[#5865F2] transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#DBDEE1]">
                  {post.excerpt}
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#5865F2] group-hover:underline">
                  {t.readPost as string}
                  <ArrowUpRight size={14} />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* Contact Section - Channel # contact-dm */}
      <SectionReveal id="contact" className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-[#2B2D31] p-6 sm:p-10 text-white shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <SectionHeading
                eyebrow={t.contactEyebrow as string}
                title={t.contactTitle as string}
                text={t.contactText as string}
              />

              <div className="mt-8">
                <a
                  href="https://discord.gg/rp3wRwG7QU"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-4 rounded-xl border border-[#5865F2]/40 bg-[#5865F2]/10 p-4 text-white transition-all hover:bg-[#5865F2]/20 hover:border-[#5865F2]"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle size={22} className="text-[#5865F2]" />
                    <div>
                      <p className="text-sm font-bold text-white">UzCord Community</p>
                      <p className="text-xs text-[#949BA4]">
                        {locale === "uz"
                          ? "Discord'dagi UzCord o'zbek hamjamiyatiga qo'shiling"
                          : "Join the UzCord Uzbek developer community on Discord"}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight size={18} className="text-[#5865F2]" />
                </a>
              </div>
            </div>

            <div className="grid gap-3">
              <button
                type="button"
                onClick={copyEmail}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#1E1F22] p-4 text-left transition-all hover:border-[#5865F2]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {copied ? (
                    <Check size={18} className="text-[#23A55A] shrink-0" />
                  ) : (
                    <Copy size={18} className="text-[#5865F2] shrink-0" />
                  )}
                  <span className="truncate text-sm font-mono text-white">
                    {copied ? (t.copiedEmail as string) : "samirabdumominov@gmail.com"}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#949BA4] shrink-0">
                  {copied ? (t.copied as string) : (t.copy as string)}
                </span>
              </button>

              <a
                href="mailto:samirabdumominov@gmail.com"
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#1E1F22] p-4 text-white transition-all hover:border-[#5865F2]"
              >
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-[#5865F2]" />
                  <span className="text-sm font-semibold">{t.openEmailApp as string}</span>
                </div>
                <ArrowUpRight size={16} />
              </a>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {socialLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#1E1F22] p-3.5 text-white transition-all hover:border-[#5865F2]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon size={16} className="text-[#5865F2] shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">{link.label}</p>
                          <p className="text-[10px] font-mono text-[#949BA4] truncate">{link.handle}</p>
                        </div>
                      </div>
                      <ArrowUpRight size={14} className="shrink-0 text-[#949BA4]" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* Discord Style Footer Bar */}
      <footer className="border-t border-[#1E1F22]/80 bg-[#1E1F22] px-4 py-6 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs text-[#949BA4] sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#23A55A]" />
            <p>© 2026 Samir Abdumo&apos;minov. {t.footer as string}</p>
          </div>

          <div className="flex items-center gap-4">
            <div id="bmc-button-container" className="inline-flex items-center" />
            <Script
              src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
              strategy="lazyOnload"
              data-name="bmc-button"
              data-slug="samirdevuz"
              data-color="#ffffff"
              data-emoji=""
              data-font="Arial"
              data-text="Buy me a coffee"
              data-outline-color="#000000"
              data-font-color="#000000"
              data-coffee-color="#FFDD00"
            />
            <a
              href="#home"
              className="text-[#DBDEE1] transition-colors hover:text-[#5865F2] font-semibold"
            >
              {t.backToTop as string}
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
