"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
  Keyboard,
  GitBranch,
  Layers3,
  Mail,
  MessageCircle,
  Moon,
  Send,
  Sparkles,
  Sun,
  TerminalSquare,
  X,
} from "lucide-react";
import type { BlogPost } from "@/data/blog";
import type { SiteContent } from "@/data/site-content";
import type { Locale } from "@/lib/locale";
import { isLocale, localeCookieName } from "@/lib/locale";
import { trackPortfolioEvent } from "@/components/analytics-tracker";

const githubUrl = "https://github.com/samirdevuz";

const navItems = [
  { label: { en: "Home", uz: "Bosh sahifa" }, href: "#home", id: "home" },
  { label: { en: "About", uz: "Men haqimda" }, href: "#about", id: "about" },
  { label: { en: "Trust", uz: "Ishonch" }, href: "#trust", id: "trust" },
  { label: { en: "Focus", uz: "Yo'nalish" }, href: "#build", id: "build" },
  { label: { en: "Skills", uz: "Ko'nikmalar" }, href: "#skills", id: "skills" },
  { label: { en: "Projects", uz: "Loyihalar" }, href: "#projects", id: "projects" },
  { label: { en: "Blog", uz: "Blog" }, href: "#blog", id: "blog" },
  { label: { en: "Contact", uz: "Aloqa" }, href: "#contact", id: "contact" },
];

const copy = {
  en: {
    language: "Language",
    menu: "Menu",
    commandMenu: "Command menu",
    closeCommandMenu: "Close command menu",
    pressEsc: "Press Esc to close",
    heroBadge: "Building across web, AI tools, and EdTech",
    heroTitle: "Building useful web products.",
    heroText:
      "I'm Samir Abdumo'minov, focused on coding, AI, web development, IT, computer science, and turning useful ideas into polished digital products.",
    viewProjects: "View Projects",
    openCommandMenu: "Open Command Menu",
    heroChips: ["Web products", "AI workflows", "Learning tools"],
    aboutEyebrow: "About",
    aboutTitle: "Building with a product mindset.",
    aboutText:
      "I care about useful software, clean interfaces, and learning the foundations behind good technology.",
    aboutBody:
      "I'm Samir Abdumo'minov, a developer interested in building clean, useful, and modern digital products. My focus is web development, AI-powered tools, EdTech, and product design. I enjoy turning ideas into polished interfaces and practical tools that people can actually use.",
    trustEyebrow: "Trust signals",
    trustTitle: "Clear signals for useful, reliable collaboration.",
    trustText:
      "A quick snapshot of what I am building, how I work, and the strengths I bring to modern product work.",
    buildEyebrow: "What I Build",
    buildTitle: "Focused digital products, from interfaces to useful tools.",
    buildText:
      "The common thread is usefulness: interfaces and tools that help people move faster, learn better, or work with less friction.",
    buildNote:
      "I prefer small, focused product systems over pages that only look good in a screenshot.",
    skillsEyebrow: "Skills",
    skillsTitle: "A structured stack for building modern products.",
    skillsText:
      "The skill set is centered on frontend development, interface quality, practical tools, and product areas I want to keep exploring.",
    projectsEyebrow: "Projects",
    projectsTitle: "Project work, concepts, and experiments.",
    projectsText:
      "A balanced view of shipped work, concepts, portfolio systems, and small utility experiments.",
    projectsNote:
      "Real links are used where available. Other demo and GitHub links stay as placeholders until those projects are public.",
    featuredProject: "Featured project",
    milliyPrepText:
      "An EdTech platform designed to help learners prepare for Uzbekistan's Milliy Sertifikat exams across multiple subjects with a clean, focused, and modern study experience.",
    milliyPrepTags: ["Next.js", "EdTech", "Study platform", "Uzbek learners"],
    milliyPrepPoints: [
      "Multi-subject exam preparation",
      "Clean learning experience",
      "Modern EdTech interface",
      "Built for Uzbek learners",
    ],
    viewLive: "View Live",
    viewProject: "View Project",
    problemSolved: "Problem solved",
    live: "Live",
    blogEyebrow: "Blog",
    blogTitle: "Posts, notes, and build updates.",
    blogText:
      "A lightweight writing space for web development, interface thinking, AI tools, product notes, and project updates.",
    viewAllPosts: "View all posts",
    readPost: "Read post",
    contactEyebrow: "Contact",
    contactTitle: "Have an idea, project, or collaboration?",
    contactText:
      "Feel free to contact me. I am open to useful projects, learning opportunities, and building modern digital products.",
    copiedEmail: "Copied email",
    copied: "Copied",
    copy: "Copy",
    openEmailApp: "Open email app",
    toggleTheme: "Toggle color theme",
    footer: "Built with Next.js and Tailwind CSS.",
    backToTop: "Back to top",
    commandActions: {
      viewProjects: ["View Projects", "Jump to project grid"],
      openMilliyPrep: ["Open MilliyPrep", "milliyprep.xyz"],
      copyEmail: ["Copy Email", "samirabdumominov@gmail.com"],
      emailCopied: ["Email Copied", "samirabdumominov@gmail.com"],
      toggleDarkMode: ["Toggle Dark Mode", "Switch site theme"],
      viewSkills: ["View Skills", "Tech stack system"],
      viewBlog: ["View Blog", "Posts and notes"],
      contactMe: ["Contact Me", "Email and social links"],
      openInstagram: ["Open Instagram", "@abdumuminov_samir"],
    },
  },
  uz: {
    language: "Til",
    menu: "Menyu",
    commandMenu: "Command menu",
    closeCommandMenu: "Command menuni yopish",
    pressEsc: "Yopish uchun Esc bosing",
    heroBadge: "Web, AI tools va EdTech yo'nalishida quraman",
    heroTitle: "Foydali web mahsulotlar quraman.",
    heroText:
      "Men Samir Abdumo'minovman. Coding, AI, web development, IT, computer science va foydali g'oyalarni puxta digital mahsulotga aylantirishga fokus qilaman.",
    viewProjects: "Loyihalarni ko'rish",
    openCommandMenu: "Command menuni ochish",
    heroChips: ["Web mahsulotlar", "AI workflowlar", "Learning tools"],
    aboutEyebrow: "Men haqimda",
    aboutTitle: "Mahsulot fikrlashi bilan quraman.",
    aboutText:
      "Foydali software, toza interfeyslar va yaxshi texnologiya ortidagi asoslarni o'rganish men uchun muhim.",
    aboutBody:
      "Men Samir Abdumo'minovman. Toza, foydali va zamonaviy digital mahsulotlar qurishga qiziqaman. Fokusim web development, AI-powered tools, EdTech va product design. G'oyalarni odamlar ishlata oladigan puxta interfeys va amaliy toollarga aylantirishni yaxshi ko'raman.",
    trustEyebrow: "Ishonch signallari",
    trustTitle: "Foydali va ishonchli hamkorlik uchun aniq signallar.",
    trustText:
      "Nima qurayotganim, qanday ishlashim va zamonaviy product ishlariga olib kiradigan kuchli tomonlarimning qisqa ko'rinishi.",
    buildEyebrow: "Nimalar quraman",
    buildTitle: "Interfeyslardan foydali toollargacha fokusli digital mahsulotlar.",
    buildText:
      "Umumiy yo'nalish foydalilik: odamlar tezroq harakat qilishi, yaxshiroq o'rganishi yoki kamroq chalg'ish bilan ishlashi uchun interfeys va toollar.",
    buildNote:
      "Faqat screenshotda chiroyli ko'rinadigan sahifalardan ko'ra kichik, fokusli product systemlarni afzal ko'raman.",
    skillsEyebrow: "Ko'nikmalar",
    skillsTitle: "Zamonaviy mahsulotlar uchun tartibli stack.",
    skillsText:
      "Ko'nikmalar frontend development, interface quality, amaliy toollar va product yo'nalishlariga qaratilgan.",
    projectsEyebrow: "Loyihalar",
    projectsTitle: "Loyihalar, konseptlar va tajribalar.",
    projectsText:
      "Chiqqan ishlar, konseptlar, portfolio tizimlari va kichik utility tajribalarining muvozanatli ko'rinishi.",
    projectsNote:
      "Mavjud joylarda haqiqiy linklar ishlatiladi. Boshqa demo va GitHub linklar loyiha public bo'lguncha placeholder bo'lib turadi.",
    featuredProject: "Asosiy loyiha",
    milliyPrepText:
      "O'zbek o'quvchilari uchun Milliy Sertifikat imtihonlariga bir nechta fan bo'yicha toza, fokusli va zamonaviy tayyorgarlik tajribasi beradigan EdTech platforma.",
    milliyPrepTags: ["Next.js", "EdTech", "Study platform", "O'zbek o'quvchilar"],
    milliyPrepPoints: [
      "Bir nechta fan bo'yicha tayyorgarlik",
      "Toza learning experience",
      "Zamonaviy EdTech interface",
      "O'zbek o'quvchilar uchun",
    ],
    viewLive: "Live ko'rish",
    viewProject: "Loyihani ko'rish",
    problemSolved: "Yechilayotgan muammo",
    live: "Live",
    blogEyebrow: "Blog",
    blogTitle: "Postlar, qaydlar va build yangiliklari.",
    blogText:
      "Web development, interface fikrlash, AI tools, product qaydlar va loyiha yangiliklari uchun yengil yozuv maydoni.",
    viewAllPosts: "Barcha postlar",
    readPost: "Postni o'qish",
    contactEyebrow: "Aloqa",
    contactTitle: "G'oya, loyiha yoki hamkorlik bormi?",
    contactText:
      "Bemalol yozing. Foydali loyihalar, learning tools va zamonaviy digital mahsulotlar qurishga ochiqman.",
    copiedEmail: "Email nusxalandi",
    copied: "Nusxalandi",
    copy: "Nusxa olish",
    openEmailApp: "Email ilovasini ochish",
    toggleTheme: "Rang rejimini almashtirish",
    footer: "Next.js va Tailwind CSS bilan qurilgan.",
    backToTop: "Yuqoriga",
    commandActions: {
      viewProjects: ["Loyihalarni ko'rish", "Project gridga o'tish"],
      openMilliyPrep: ["MilliyPrep'ni ochish", "milliyprep.xyz"],
      copyEmail: ["Email nusxalash", "samirabdumominov@gmail.com"],
      emailCopied: ["Email nusxalandi", "samirabdumominov@gmail.com"],
      toggleDarkMode: ["Dark mode almashtirish", "Sayt theme'ni almashtirish"],
      viewSkills: ["Ko'nikmalarni ko'rish", "Tech stack"],
      viewBlog: ["Blogni ko'rish", "Postlar va qaydlar"],
      contactMe: ["Aloqa", "Email va social linklar"],
      openInstagram: ["Instagramni ochish", "@abdumuminov_samir"],
    },
  },
} satisfies Record<Locale, Record<string, unknown>>;

function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-white p-1.5 shadow-[0_10px_28px_rgba(20,20,20,0.13)] ring-1 ring-black/5 dark:border-white/12 dark:bg-white",
        className,
      )}
      aria-hidden="true"
    >
      <Image
        src="/logo-premium.png"
        alt=""
        className="size-full object-contain"
        width={56}
        height={40}
      />
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

const trustSignals = [
  {
    value: "EdTech",
    label: "Active product focus",
    detail: "Building MilliyPrep around focused exam preparation for Uzbek learners.",
  },
  {
    value: "Next.js",
    label: "Modern web stack",
    detail: "Working with React, TypeScript, Tailwind CSS, and product-minded UI patterns.",
  },
  {
    value: "Open",
    label: "Available for collaboration",
    detail: "Interested in useful learning tools, clean interfaces, and practical web products.",
  },
];

const projects = [
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
    visual: "ai",
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
    github: githubUrl,
    visual: "portfolio",
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
    visual: "tools",
  },
];

const localizedData = {
  en: {
    highlights,
    buildAreas,
    skillGroups,
    trustSignals,
    projects,
  },
  uz: {
    highlights: [
      {
        title: "Web development",
        text: "React, Next.js, TypeScript va amaliy frontend patternlar bilan zamonaviy interfeyslar.",
        icon: Code2,
      },
      {
        title: "AI tools",
        text: "O'rganish yoki qurishni tezlashtiradigan study assistantlar, automation g'oyalar va workflowlar.",
        icon: Sparkles,
      },
      {
        title: "Product systemlar",
        text: "Aniqlik, struktura va real user ehtiyojlariga qaratilgan fokusli digital mahsulotlar.",
        icon: Layers3,
      },
    ],
    buildAreas: [
      {
        title: "Toza web interfeyslar",
        text: "O'qilishi oson layoutlar, kuchli hierarchy, responsive detallar va bevosita his qilinadigan interactionlar.",
        icon: Code2,
      },
      {
        title: "AI-powered toollar",
        text: "Tushuntiradigan, tartiblaydigan, summary qiladigan va murakkab ishni yengillashtiradigan toollar.",
        icon: Sparkles,
      },
      {
        title: "Product dashboardlar",
        text: "Progressni kuzatish, workflowlarni boshqarish va keyingi actionni aniq qilish uchun sokin product yuzalari.",
        icon: Layers3,
      },
      {
        title: "Foydali web utilitylar",
        text: "Kundalik bitta muammoni tez va ishonchli yechadigan kichik fokusli toollar.",
        icon: TerminalSquare,
      },
    ],
    skillGroups: [
      {
        title: "Frontend Core",
        description:
          "Component-driven architecture va zamonaviy web asoslari bilan tez, maintainable interfeyslar qurish.",
        icon: Code2,
        skills: ["React", "Next.js", "TypeScript", "JavaScript"],
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
      },
      {
        title: "AI Workflow",
        description:
          "AI-assisted workflowlardan tezroq o'rganish, prototiplash va product iteration uchun foydalanish.",
        icon: TerminalSquare,
        skills: ["Cursor", "AI coding tools", "Automation", "Prompt engineering"],
      },
      {
        title: "Product Thinking",
        description:
          "Software ta'lim, automation, security va digital productlarni yaxshilashi mumkin bo'lgan yo'nalishlarni o'rganish.",
        icon: Sparkles,
        skills: ["EdTech", "SaaS", "Clean UX", "Practical tools"],
      },
    ],
    trustSignals: [
      {
        value: "EdTech",
        label: "Faol product fokusi",
        detail: "MilliyPrep orqali o'zbek o'quvchilari uchun fokusli imtihon tayyorgarligi qurilmoqda.",
      },
      {
        value: "Next.js",
        label: "Zamonaviy web stack",
        detail: "React, TypeScript, Tailwind CSS va product-minded UI patternlar bilan ishlash.",
      },
      {
        value: "Open",
        label: "Hamkorlikka ochiq",
        detail: "Foydali learning toollar, toza interfeyslar va amaliy web mahsulotlarga qiziqish.",
      },
    ],
    projects: [
      {
        name: "AI Study Assistant",
        status: "Konsept",
        description:
          "Qaydlar va mavzularni aniqroq tushuntirish, summary va study planga aylantiradigan o'quv assistant konsepti.",
        problem:
          "O'quvchilarga tarqoq materialdan AI yordamidagi fokusli o'rganish yo'liga o'tishga yordam beradi.",
        stack: ["AI", "React", "Learning tools"],
        demo: "#",
        github: "#",
        visual: "ai",
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
        github: githubUrl,
        visual: "portfolio",
      },
      {
        name: "Web Tools Collection",
        status: "Tajribalar",
        description:
          "Productivity, automation va web workflowlar uchun fokusli utilitylar va tajribalar to'plami.",
        problem:
          "Kichik kundalik muammolarni katta app o'rniga yengil toollar bilan yechadi.",
        stack: ["TypeScript", "Utilities", "Automation"],
        demo: "#",
        github: "#",
        visual: "tools",
      },
    ],
  },
};

void localizedData;

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
  analyticsEvent,
  analyticsTarget,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
  analyticsEvent?: "project_view" | "milliyprep_click" | "blog_open";
  analyticsTarget?: string;
}) {
  const isPlaceholder = href === "#";

  return (
    <a
      href={href}
      target={external && !isPlaceholder ? "_blank" : undefined}
      rel={external && !isPlaceholder ? "noreferrer" : undefined}
      data-analytics-event={analyticsEvent}
      data-analytics-target={analyticsTarget}
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
  locale,
  onClose,
  onCopyEmail,
  onToggleTheme,
  milliyPrepUrl,
  instagramUrl,
}: {
  open: boolean;
  copied: boolean;
  locale: Locale;
  onClose: () => void;
  onCopyEmail: () => void;
  onToggleTheme: () => void;
  milliyPrepUrl: string;
  instagramUrl: string;
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
        trackPortfolioEvent("milliyprep_click", milliyPrepUrl);
        window.open(milliyPrepUrl, "_blank", "noreferrer");
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
      run: () => {
        trackPortfolioEvent("theme_change", "command_menu");
        onToggleTheme();
      },
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
        trackPortfolioEvent("social_click", "instagram");
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
      className="fixed inset-0 z-[80] flex items-start justify-center bg-foreground/18 p-4 backdrop-blur-sm dark:bg-black/45 sm:px-6 sm:pb-6 sm:pt-24"
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
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-[var(--shadow)] sm:max-h-[calc(100dvh-7.5rem)]"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-3">
          <div className="flex items-center gap-3 text-sm text-muted">
            <span className="flex size-8 items-center justify-center rounded-md bg-accent-soft text-accent">
              <Command size={16} />
            </span>
            <span>{t.commandMenu as string}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-panel-soft hover:text-foreground"
            aria-label={t.closeCommandMenu as string}
          >
            <X size={16} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.label}
                ref={action === actions[0] ? firstActionRef : undefined}
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

        <div className="shrink-0 border-t border-line px-4 py-3 font-mono text-xs text-muted">
          {t.pressEsc as string}
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
    <div className="relative min-h-[430px] overflow-hidden rounded-xl border border-line bg-background/70 p-4">
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
        <div className="grid gap-4 p-4 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="space-y-3">
            <div className="rounded-lg border border-line bg-background/80 p-3">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                Subjects
              </p>
              <div className="mt-3 space-y-2">
                {["Mathematics", "English", "History", "Biology"].map(
                  (subject, index) => (
                    <div
                      key={subject}
                      className="flex items-center justify-between rounded-md border border-line bg-panel-soft px-3 py-2 text-sm"
                    >
                      <span>{subject}</span>
                      <span className="font-mono text-xs text-muted">
                        {index + 4} modules
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="rounded-lg border border-line bg-foreground p-4 text-background">
              <p className="font-mono text-xs opacity-70">learner focus</p>
              <p className="mt-2 text-sm font-medium">
                Clear paths for Uzbek exam preparation.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-line bg-background/80 p-4">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                  Practice
                </p>
                <p className="mt-3 text-sm font-medium">Question set</p>
                <div className="mt-4 space-y-2">
                  {["A", "B", "C"].map((option, index) => (
                    <div
                      key={option}
                      className={cn(
                        "rounded-md border px-3 py-2 text-xs",
                        index === 1
                          ? "border-accent bg-accent-soft text-accent"
                          : "border-line bg-panel-soft text-muted",
                      )}
                    >
                      Option {option}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-line bg-background/80 p-4">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                  Review
                </p>
                <p className="mt-3 text-sm font-medium">Study analytics</p>
                <div className="mt-4 flex h-24 items-end gap-2">
                  {[42, 68, 54, 82, 76].map((height, index) => (
                    <span
                      key={height}
                      className="flex-1 rounded-t bg-accent/70"
                      style={{ height: `${height}%`, opacity: 0.45 + index * 0.1 }}
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
  if (type === "milliyprep") {
    return (
      <div className="mt-6 rounded-xl border border-line bg-panel-soft p-3">
        <div className="rounded-lg border border-line bg-background p-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-accent">MilliyPrep preview</p>
            <span className="size-2 rounded-full bg-accent" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-[0.72fr_1.28fr]">
            <div className="space-y-2">
              {["Math", "English", "Biology"].map((subject) => (
                <div
                  key={subject}
                  className="rounded-md border border-line bg-panel px-3 py-2 text-xs text-muted"
                >
                  {subject}
                </div>
              ))}
            </div>
            <div className="rounded-md border border-line bg-panel p-3">
              <div className="flex justify-between text-xs">
                <span>Exam progress</span>
                <span className="font-mono text-accent">74%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-line">
                <div className="h-full w-[74%] rounded-full bg-accent" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[12, 18, 24].map((value) => (
                  <div key={value} className="rounded bg-panel-soft p-2">
                    <p className="font-mono text-sm">{value}</p>
                    <p className="text-[10px] text-muted">sets</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "portfolio") {
    return (
      <div className="mt-6 rounded-xl border border-line bg-panel-soft p-3">
        <div className="rounded-lg border border-line bg-background p-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span className="font-mono text-xs text-accent">samir.dev</span>
            <div className="flex gap-1">
              <span className="h-1.5 w-8 rounded-full bg-accent" />
              <span className="h-1.5 w-8 rounded-full bg-line" />
              <span className="h-1.5 w-8 rounded-full bg-line" />
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_0.8fr]">
            <div>
              <div className="h-3 w-2/3 rounded bg-foreground/80" />
              <div className="mt-3 space-y-2">
                <div className="h-2 rounded bg-line" />
                <div className="h-2 w-4/5 rounded bg-line" />
                <div className="h-2 w-3/5 rounded bg-line" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="aspect-square rounded-md border border-line bg-panel" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-line bg-panel-soft p-3">
      <div className="rounded-lg border border-line bg-background p-4">
        <div className="flex items-center gap-2 font-mono text-xs text-accent">
          <TerminalSquare size={14} />
          <span>{type === "ai" ? "study-assistant.ts" : "tools-lab.ts"}</span>
        </div>
        <div className="mt-4 space-y-2 font-mono text-xs text-muted">
          {(type === "ai"
            ? ["summarize(notes)", "buildStudyPlan(topic)", "explainClearly()"]
            : ["formatText()", "generateSlug()", "cleanWorkflow()"]
          ).map((line) => (
            <div key={line} className="rounded-md border border-line bg-panel px-3 py-2">
              <span className="text-accent">const</span> {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export function PortfolioPage({
  blogPosts,
  initialLocale = "en",
  siteContent,
}: {
  blogPosts: BlogPost[];
  initialLocale?: Locale;
  siteContent: SiteContent;
}) {
  const [activeSection, setActiveSection] = useState("home");
  const [commandOpen, setCommandOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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
  const editableContent = siteContent.locales[locale];
  const t = { ...copy[locale], ...editableContent };
  const pageData = {
    highlights: editableContent.highlights.map((item, index) => ({
      ...item,
      icon: [Code2, Sparkles, Layers3][index] ?? Code2,
    })),
    buildAreas: editableContent.buildAreas.map((item, index) => ({
      ...item,
      icon: [Code2, Sparkles, Layers3, TerminalSquare][index] ?? Code2,
    })),
    skillGroups: editableContent.skillGroups.map((item, index) => ({
      ...item,
      icon: [Code2, Layers3, TerminalSquare, Sparkles][index] ?? Code2,
    })),
    trustSignals: editableContent.trustSignals,
    projects: editableContent.projects,
  };
  const socialIconMap = {
    github: GitBranch,
    telegram: Send,
    instagram: AtSign,
    x: AtSign,
    discord: MessageCircle,
    monkeytype: Keyboard,
  } as const;
  const editableSocialLinks = siteContent.socialLinks.map((link) => ({
    ...link,
    icon: socialIconMap[link.id],
  }));
  const githubUrl =
    siteContent.socialLinks.find((link) => link.id === "github")?.href ?? "#";
  const instagramUrl =
    siteContent.socialLinks.find((link) => link.id === "instagram")?.href ?? "#";
  const email = siteContent.profile.email;
  const milliyPrepUrl = siteContent.profile.milliyPrepUrl;

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
        await navigator.clipboard.writeText(email);
      }
    } catch {
      // Clipboard permissions vary by browser; still show feedback after a user-triggered copy attempt.
    }
    setCopied(true);
    trackPortfolioEvent("email_copy", email);
    window.setTimeout(() => setCopied(false), 1800);
  };

  useEffect(() => {
    document.cookie = `${localeCookieName}=${locale}; max-age=31536000; path=/; samesite=lax`;
    document.documentElement.lang = locale;
  }, [locale]);

  const updateLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
      >
        Skip to main content
      </a>
      <CommandMenu
        open={commandOpen}
        copied={copied}
        locale={locale}
        onClose={() => setCommandOpen(false)}
        onCopyEmail={copyEmail}
        onToggleTheme={() => setTheme(isDark ? "light" : "dark")}
        milliyPrepUrl={milliyPrepUrl}
        instagramUrl={instagramUrl}
      />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-background/86 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a
            href="#home"
            className="group flex min-w-0 items-center gap-3 text-sm font-semibold tracking-tight text-foreground"
            aria-label={`${siteContent.profile.name} home`}
          >
            <LogoMark className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_34px_rgba(20,20,20,0.16)]" />
            <span className="hidden sm:inline">{siteContent.profile.name}</span>
          </a>

          <div className="hidden items-center gap-1 rounded-full border border-line/90 bg-panel/88 p-1 shadow-[0_14px_44px_rgba(20,20,20,0.08)] ring-1 ring-foreground/[0.03] backdrop-blur-xl dark:bg-panel/78 dark:shadow-[0_14px_44px_rgba(0,0,0,0.32)] lg:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium text-muted transition-all duration-300 hover:bg-panel-soft hover:text-foreground",
                  activeSection === item.id &&
                    "bg-[linear-gradient(135deg,var(--foreground),var(--accent))] text-background shadow-[0_8px_22px_rgba(20,20,20,0.16)] hover:text-background dark:bg-[linear-gradient(135deg,var(--foreground),var(--accent))] dark:text-background",
                )}
              >
                {item.label[locale]}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div
              className="grid h-10 grid-cols-2 rounded-full border border-line bg-panel/90 p-1 text-xs font-semibold shadow-sm ring-1 ring-foreground/[0.03] backdrop-blur-xl"
              role="group"
              aria-label={t.language as string}
            >
              {(["en", "uz"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => updateLocale(item)}
                  data-analytics-event="language_change"
                  data-analytics-target={item}
                  className={cn(
                    "min-w-9 rounded-full px-2.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/35",
                    locale === item
                      ? "bg-foreground text-background shadow-[0_8px_20px_rgba(20,20,20,0.14)]"
                      : "text-muted hover:bg-panel-soft hover:text-foreground",
                  )}
                  aria-pressed={locale === item}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              data-analytics-event="command_menu_open"
              aria-label={t.openCommandMenu as string}
              className="hidden h-10 items-center justify-center gap-2 rounded-full border border-line bg-panel/90 px-4 text-sm font-medium text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-panel-soft focus:outline-none focus:ring-2 focus:ring-accent/35 md:inline-flex"
            >
              <Command size={14} />
              <span>{t.menu as string}</span>
              <span className="font-mono text-xs text-muted">⌘K</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              data-analytics-event="theme_change"
              data-analytics-target={isDark ? "light" : "dark"}
              className="flex size-10 items-center justify-center rounded-full border border-line bg-panel/90 text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-panel-soft focus:outline-none focus:ring-2 focus:ring-accent/35"
              aria-label={t.toggleTheme as string}
            >
              <Sun size={16} className="hidden dark:block" />
              <Moon size={16} className="dark:hidden" />
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
              {t.heroBadge as string}
            </div>
            <p className="mt-7 font-mono text-sm font-medium uppercase tracking-[0.18em] text-accent">
              {siteContent.profile.name}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              {t.heroTitle as string}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              {t.heroText as string}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ActionLink href="#projects">
                {t.viewProjects as string}
                <ArrowUpRight size={16} />
              </ActionLink>
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                data-analytics-event="command_menu_open"
                aria-label={t.openCommandMenu as string}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line bg-panel px-5 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                {t.openCommandMenu as string}
                <Command size={16} />
              </button>
            </div>

            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {(t.heroChips as string[]).map((item) => (
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

      <SectionReveal id="about" className="px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <SectionHeading
            eyebrow={t.aboutEyebrow as string}
            title={t.aboutTitle as string}
            text={t.aboutText as string}
          />
          <div>
            <div className="rounded-2xl border border-line bg-panel p-6 shadow-sm sm:p-8">
              <p className="text-xl leading-9 tracking-tight text-foreground">
                {t.aboutBody as string}
              </p>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {pageData.highlights.map((item) => {
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

      <SectionReveal id="trust" className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={t.trustEyebrow as string}
            title={t.trustTitle as string}
            text={t.trustText as string}
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {pageData.trustSignals.map((signal) => (
              <motion.article
                key={signal.label}
                className="rounded-2xl border border-line bg-panel p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[var(--shadow)]"
                whileHover={{ y: -4 }}
              >
                <p className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  {signal.value}
                </p>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
                  {signal.label}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {signal.detail}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal id="build" className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              eyebrow={t.buildEyebrow as string}
              title={t.buildTitle as string}
              text={t.buildText as string}
            />
            <div className="max-w-sm rounded-xl border border-line bg-panel p-4 text-sm leading-6 text-muted">
              {t.buildNote as string}
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {pageData.buildAreas.map((item) => {
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
            eyebrow={t.skillsEyebrow as string}
            title={t.skillsTitle as string}
            text={t.skillsText as string}
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {pageData.skillGroups.map((group) => {
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
              eyebrow={t.projectsEyebrow as string}
              title={t.projectsTitle as string}
              text={t.projectsText as string}
            />
            <p className="max-w-sm text-sm leading-6 text-muted">
              {t.projectsNote as string}
            </p>
          </div>

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
                    {t.featuredProject as string}
                  </span>
                  <span className="rounded-full border border-line bg-panel-soft px-3 py-1 font-mono text-xs text-muted">
                    {milliyPrepUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </span>
                </div>
                <h2 className="mt-7 text-4xl font-semibold tracking-tight sm:text-5xl">
                  MilliyPrep
                </h2>
                <p className="mt-5 text-lg leading-8 text-muted">
                  {t.milliyPrepText as string}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {(t.milliyPrepTags as string[]).map(
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
                    ...(t.milliyPrepPoints as string[]),
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="size-1.5 rounded-full bg-accent" />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-9 flex flex-wrap gap-3">
                  <ActionLink
                    href={milliyPrepUrl}
                    external
                    analyticsEvent="milliyprep_click"
                    analyticsTarget={milliyPrepUrl}
                  >
                    {t.viewLive as string}
                    <ArrowUpRight size={16} />
                  </ActionLink>
                  <ActionLink
                    href={milliyPrepUrl}
                    external
                    variant="secondary"
                    analyticsEvent="milliyprep_click"
                    analyticsTarget={milliyPrepUrl}
                  >
                    {t.viewProject as string}
                    <ArrowUpRight size={16} />
                  </ActionLink>
                  <ActionLink
                    href={githubUrl}
                    external
                    variant="secondary"
                    analyticsEvent="project_view"
                    analyticsTarget="github"
                  >
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

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {pageData.projects.map((project) => (
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
                    {t.problemSolved as string}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {project.problem}
                  </p>
                </div>
                <ProjectMockup type={project.visual} />
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
                    analyticsEvent="project_view"
                    analyticsTarget={`${project.name}:demo`}
                  >
                    {t.live as string}
                    <ArrowUpRight size={15} />
                  </ActionLink>
                  <ActionLink
                    href={project.github}
                    external={project.github.startsWith("http")}
                    variant="secondary"
                    analyticsEvent="project_view"
                    analyticsTarget={`${project.name}:github`}
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

      <SectionReveal id="blog" className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
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

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <motion.a
                key={post.slug}
                href={`/blog/${post.slug}`}
                data-analytics-event="blog_open"
                data-analytics-target={post.slug}
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
                  {t.readPost as string}
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

      <SectionReveal id="contact" className="px-4 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl rounded-2xl border border-line bg-panel p-5 shadow-[var(--shadow)] sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
                {t.contactEyebrow as string}
              </p>
              <h2 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight sm:text-4xl">
                {t.contactTitle as string}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
                {t.contactText as string}
              </p>
            </div>
            <div className="grid gap-3">
              <button
                type="button"
                onClick={copyEmail}
                className="flex min-w-0 flex-col gap-3 rounded-xl border border-line bg-panel-soft p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="flex min-w-0 items-center gap-3">
                  {copied ? (
                    <Check size={18} className="shrink-0 text-accent" />
                  ) : (
                    <Copy size={18} className="shrink-0 text-accent" />
                  )}
                  <span className="min-w-0 break-all text-sm sm:truncate">
                    {copied
                      ? (t.copiedEmail as string)
                      : email}
                  </span>
                </span>
                <span className="shrink-0 self-start text-sm text-muted sm:self-auto">
                  {copied ? (t.copied as string) : (t.copy as string)}
                </span>
              </button>
              <a
                href={`mailto:${email}`}
                data-analytics-event="email_open"
                data-analytics-target={email}
                className="flex min-w-0 items-center justify-between gap-4 rounded-xl border border-line bg-panel-soft p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Mail size={18} className="shrink-0 text-accent" />
                  <span className="truncate">{t.openEmailApp as string}</span>
                </span>
                <ArrowUpRight size={16} className="shrink-0" />
              </a>
              <div className="grid gap-3 sm:grid-cols-2">
                {editableSocialLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      data-analytics-event="social_click"
                      data-analytics-target={link.id}
                      className="flex min-w-0 items-center justify-between gap-4 rounded-xl border border-line bg-panel-soft p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon size={18} className="shrink-0 text-accent" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-foreground">
                            {link.label}
                          </span>
                          <span className="block truncate font-mono text-xs text-muted">
                            {link.handle}
                          </span>
                        </span>
                      </span>
                      <ArrowUpRight size={16} className="shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      <footer className="border-t border-line px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-muted sm:flex-row">
          <p>
            © 2026 {siteContent.profile.name}. {t.footer as string}
          </p>
          <a
            href="#home"
            className="text-foreground transition-colors hover:text-accent"
          >
            {t.backToTop as string}
          </a>
        </div>
      </footer>
    </main>
  );
}
