import { fetchSupabaseSiteContent, saveSupabaseSiteContent } from "@/lib/supabase";

export type ProjectContentItem = {
  name: string;
  status: string;
  description: string;
  problem: string;
  stack: string[];
  youAreHereLabel?: string;
};

export type HighlightContentItem = {
  title: string;
  text: string;
};

export type SkillGroupContentItem = {
  title: string;
  description: string;
  skills: string[];
};

export type LocaleSiteContent = {
  heroBadge: string;
  heroTitle: string;
  heroText: string;
  viewProjects: string;
  openCommandMenu: string;
  heroChips: string[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutText: string;
  aboutBody: string;
  highlights: HighlightContentItem[];
  skillsEyebrow: string;
  skillsTitle: string;
  skillsText: string;
  skillGroups: SkillGroupContentItem[];
  projectsEyebrow: string;
  projectsTitle: string;
  projectsText: string;
  projectsNote: string;
  featuredProject: string;
  milliyPrepTitle: string;
  milliyPrepText: string;
  milliyPrepTags: string[];
  milliyPrepPoints: string[];
  live: string;
  problemSolved: string;
  projectsList: ProjectContentItem[];
  blogEyebrow: string;
  blogTitle: string;
  blogText: string;
  viewAllPosts: string;
  readPost: string;
  contactEyebrow: string;
  contactTitle: string;
  contactText: string;
  uzCordText: string;
  copiedEmail: string;
  copied: string;
  copy: string;
  openEmailApp: string;
  footer: string;
  backToTop: string;
};

export type LinksContent = {
  email: string;
  githubUrl: string;
  telegramUrl: string;
  instagramUrl: string;
  xUrl: string;
  discordUrl: string;
  monkeytypeUrl: string;
  milliyPrepUrl: string;
  modelsUrl: string;
  uzCordInviteUrl: string;
};

export type SiteContent = {
  en: LocaleSiteContent;
  uz: LocaleSiteContent;
  links: LinksContent;
};

export const defaultSiteContent: SiteContent = {
  en: {
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
    highlights: [
      {
        title: "Web development",
        text: "Modern interfaces built with React, Next.js, TypeScript, and practical frontend patterns.",
      },
      {
        title: "AI tools",
        text: "Study assistants, automation ideas, and workflows that make learning or building faster.",
      },
      {
        title: "Product systems",
        text: "Focused digital products designed around clarity, structure, and real user needs.",
      },
    ],
    skillsEyebrow: "Skills",
    skillsTitle: "A structured stack for building modern products.",
    skillsText:
      "The skill set is centered on frontend development, interface quality, practical tools, and product areas I want to keep exploring.",
    skillGroups: [
      {
        title: "Frontend Core",
        description:
          "Building fast, maintainable interfaces with component-driven architecture and modern web foundations.",
        skills: ["React", "Next.js", "TypeScript", "JavaScript"],
      },
      {
        title: "UI Engineering",
        description:
          "Turning product ideas into clean responsive screens with motion, accessibility basics, and polish.",
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
        skills: [
          "ChatGPT Plus",
          "OpenAI Codex CLI",
          "GPT-4o",
          "AI coding tools",
          "Automation",
          "Prompt engineering",
        ],
      },
      {
        title: "Product Thinking",
        description:
          "Exploring areas where software can improve learning, automation, security, and digital products.",
        skills: ["EdTech", "SaaS", "Clean UX", "Practical tools"],
      },
      {
        title: "Backend & Integrations",
        description:
          "Building backend systems and local payment and SMS integrations for the Uzbekistan and CIS markets.",
        skills: ["Next.js (App Router)", "Supabase", "Click", "Payme", "Eskiz.uz"],
      },
    ],
    projectsEyebrow: "Projects",
    projectsTitle: "Project work, concepts, and experiments.",
    projectsText:
      "A balanced view of shipped work, concepts, portfolio systems, and small utility experiments.",
    projectsNote:
      "Real links are used where available. Other demo and GitHub links stay as placeholders until those projects are public.",
    featuredProject: "Featured project",
    milliyPrepTitle: "MilliyPrep",
    milliyPrepText:
      "An EdTech platform designed to help learners prepare for Uzbekistan's Milliy Sertifikat exams across multiple subjects with a clean, focused, and modern study experience.",
    milliyPrepTags: ["Next.js", "EdTech", "Study platform", "Uzbek learners"],
    milliyPrepPoints: [
      "Multi-subject exam preparation",
      "Clean learning experience",
      "Modern EdTech interface",
      "Built for Uzbek learners",
    ],
    live: "Live",
    problemSolved: "Problem solved",
    projectsList: [
      {
        name: "3D Models Showcase",
        status: "Subdomain",
        description:
          "A subdomain project serving as an archive of my 3D models from Sketchfab, showcasing interactive 3D assets and experiments.",
        problem:
          "Provides an interactive space to archive and display 3D models from Sketchfab directly on a dedicated subdomain.",
        stack: ["Next.js", "3D", "Sketchfab"],
      },
      {
        name: "Personal Portfolio",
        status: "This site",
        description:
          "A minimal portfolio system designed to present work, direction, and technical taste with more clarity.",
        problem:
          "Creates a stronger first impression than a plain resume-style page or generic template.",
        stack: ["Next.js", "Tailwind CSS", "Framer Motion"],
        youAreHereLabel: "You are here",
      },
    ],
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
    uzCordText: "Join the UzCord uzbek community on Discord",
    copiedEmail: "Copied email",
    copied: "Copied",
    copy: "Copy",
    openEmailApp: "Open email app",
    footer: "Built with Next.js and Tailwind CSS.",
    backToTop: "Back to top",
  },
  uz: {
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
    highlights: [
      {
        title: "Web development",
        text: "React, Next.js, TypeScript va amaliy frontend patternlar bilan zamonaviy interfeyslar.",
      },
      {
        title: "AI tools",
        text: "O'rganish yoki qurishni tezlashtiradigan study assistantlar, automation g'oyalar va workflowlar.",
      },
      {
        title: "Product systemlar",
        text: "Aniqlik, struktura va real user ehtiyojlariga qaratilgan fokusli digital mahsulotlar.",
      },
    ],
    skillsEyebrow: "Ko'nikmalar",
    skillsTitle: "Zamonaviy mahsulotlar uchun tartibli stack.",
    skillsText:
      "Ko'nikmalar frontend development, interface quality, amaliy toollar va product yo'nalishlariga qaratilgan.",
    skillGroups: [
      {
        title: "Frontend Core",
        description:
          "Component-driven architecture va zamonaviy web asoslari bilan tez, maintainable interfeyslar qurish.",
        skills: ["React", "Next.js", "TypeScript", "JavaScript"],
      },
      {
        title: "UI Engineering",
        description:
          "Product g'oyalarni responsive ekranlarga aylantirish: motion, accessibility basics va polish bilan.",
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
        skills: [
          "ChatGPT Plus",
          "OpenAI Codex CLI",
          "GPT-4o",
          "AI coding tools",
          "Automation",
          "Prompt engineering",
        ],
      },
      {
        title: "Product Thinking",
        description:
          "Software ta'lim, automation, security va digital productlarni yaxshilashi mumkin bo'lgan yo'nalishlarni o'rganish.",
        skills: ["EdTech", "SaaS", "Clean UX", "Practical tools"],
      },
      {
        title: "Backend & Integrations",
        description:
          "O'zbekiston va MDH bozori uchun backend tizimlar hamda mahalliy to'lov va SMS integratsiyalarini qurish.",
        skills: ["Next.js (App Router)", "Supabase", "Click", "Payme", "Eskiz.uz"],
      },
    ],
    projectsEyebrow: "Loyihalar",
    projectsTitle: "Loyihalar, konseptlar va tajribalar.",
    projectsText:
      "Chiqqan ishlar, konseptlar, portfolio tizimlari va kichik utility tajribalarining muvozanatli ko'rinishi.",
    projectsNote:
      "Mavjud joylarda haqiqiy linklar ishlatiladi. Boshqa demo va GitHub linklar loyiha public bo'lguncha placeholder bo'lib turadi.",
    featuredProject: "Asosiy loyiha",
    milliyPrepTitle: "MilliyPrep",
    milliyPrepText:
      "O'zbek o'quvchilari uchun Milliy Sertifikat imtihonlariga bir nechta fan bo'yicha toza, fokusli va zamonaviy tayyorgarlik tajribasi beradigan EdTech platforma.",
    milliyPrepTags: ["Next.js", "EdTech", "Study platform", "O'zbek o'quvchilar"],
    milliyPrepPoints: [
      "Bir nechta fan bo'yicha tayyorgarlik",
      "Toza learning experience",
      "Zamonaviy EdTech interface",
      "O'zbek o'quvchilar uchun",
    ],
    live: "Live",
    problemSolved: "Yechilayotgan muammo",
    projectsList: [
      {
        name: "3D Models Showcase",
        status: "Subdomen",
        description:
          "Sketchfab profilimdagi 3D modellar arxivi bo'lgan hamda interaktiv 3D aktivlar va tajribalarni ko'rsatuvchi subdomen loyihasi.",
        problem:
          "Sketchfab'dagi 3D modellarni alohida subdomenda arxivlash va ko'rsatish uchun interaktiv maydon beradi.",
        stack: ["Next.js", "3D", "Sketchfab"],
      },
      {
        name: "Personal Portfolio",
        status: "Shu sayt",
        description:
          "Ishlar, yo'nalish va texnik didni aniqroq ko'rsatish uchun minimal portfolio tizimi.",
        problem:
          "Oddiy resume sahifa yoki generic templatega qaraganda kuchliroq birinchi taassurot yaratadi.",
        stack: ["Next.js", "Tailwind CSS", "Framer Motion"],
        youAreHereLabel: "Siz shu yerdasiz",
      },
    ],
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
    uzCordText: "Discord'dagi UzCord o'zbek hamjamiyatiga qo'shiling",
    copiedEmail: "Email nusxalandi",
    copied: "Nusxalandi",
    copy: "Nusxa olish",
    openEmailApp: "Email ilovasini ochish",
    footer: "Next.js va Tailwind CSS bilan qurilgan.",
    backToTop: "Yuqoriga",
  },
  links: {
    email: "samirabdumominov@gmail.com",
    githubUrl: "https://github.com/samirdevuz",
    telegramUrl: "https://t.me/samirdevuz",
    instagramUrl: "https://www.instagram.com/abdumuminov_samir",
    xUrl: "https://x.com/samirdevuz",
    discordUrl: "https://discord.com/users/samirdevuz",
    monkeytypeUrl: "https://monkeytype.com/profile/samirdevuz",
    milliyPrepUrl: "https://milliyprep.xyz",
    modelsUrl: "https://models.samirdev.uz",
    uzCordInviteUrl: "https://discord.gg/rp3wRwG7QU",
  },
};

let inMemorySiteContent: SiteContent = defaultSiteContent;

export async function getSiteContent(): Promise<SiteContent> {
  const supabaseContent = await fetchSupabaseSiteContent();
  if (supabaseContent && typeof supabaseContent === "object") {
    return {
      en: { ...defaultSiteContent.en, ...(supabaseContent.en || {}) },
      uz: { ...defaultSiteContent.uz, ...(supabaseContent.uz || {}) },
      links: { ...defaultSiteContent.links, ...(supabaseContent.links || {}) },
    };
  }
  return inMemorySiteContent;
}

export async function updateSiteContent(content: SiteContent): Promise<SiteContent> {
  inMemorySiteContent = content;
  await saveSupabaseSiteContent(content);
  return inMemorySiteContent;
}
