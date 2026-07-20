import type { Locale } from "@/lib/locale";

export type EditableCard = {
  title: string;
  text: string;
};

export type EditableSkillGroup = {
  title: string;
  description: string;
  skills: string[];
};

export type EditableTrustSignal = {
  value: string;
  label: string;
  detail: string;
};

export type EditableProject = {
  name: string;
  status: string;
  description: string;
  problem: string;
  stack: string[];
  demo: string;
  github: string;
  visual: "ai" | "portfolio" | "tools";
};

export type EditableLocaleContent = {
  heroBadge: string;
  heroTitle: string;
  heroText: string;
  heroChips: string[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutText: string;
  aboutBody: string;
  trustEyebrow: string;
  trustTitle: string;
  trustText: string;
  buildEyebrow: string;
  buildTitle: string;
  buildText: string;
  buildNote: string;
  skillsEyebrow: string;
  skillsTitle: string;
  skillsText: string;
  projectsEyebrow: string;
  projectsTitle: string;
  projectsText: string;
  projectsNote: string;
  featuredProject: string;
  milliyPrepText: string;
  milliyPrepTags: string[];
  milliyPrepPoints: string[];
  problemSolved: string;
  blogEyebrow: string;
  blogTitle: string;
  blogText: string;
  contactEyebrow: string;
  contactTitle: string;
  contactText: string;
  footer: string;
  highlights: EditableCard[];
  buildAreas: EditableCard[];
  skillGroups: EditableSkillGroup[];
  trustSignals: EditableTrustSignal[];
  projects: EditableProject[];
};

export type EditableSocialLink = {
  id: "github" | "telegram" | "instagram" | "x" | "discord" | "monkeytype";
  label: string;
  handle: string;
  href: string;
};

export type SiteContent = {
  profile: {
    name: string;
    email: string;
    milliyPrepUrl: string;
  };
  locales: Record<Locale, EditableLocaleContent>;
  socialLinks: EditableSocialLink[];
};

const sharedEnglishProjects: EditableProject[] = [
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
    github: "https://github.com/samirdevuz",
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

export const defaultSiteContent: SiteContent = {
  profile: {
    name: "Samir Abdumo'minov",
    email: "samirabdumominov@gmail.com",
    milliyPrepUrl: "https://milliyprep.xyz",
  },
  socialLinks: [
    {
      id: "github",
      label: "GitHub",
      handle: "@samirdevuz",
      href: "https://github.com/samirdevuz",
    },
    {
      id: "telegram",
      label: "Telegram",
      handle: "@samirdevuz",
      href: "https://t.me/samirdevuz",
    },
    {
      id: "instagram",
      label: "Instagram",
      handle: "@abdumuminov_samir",
      href: "https://www.instagram.com/abdumuminov_samir",
    },
    {
      id: "x",
      label: "X",
      handle: "@samirdevuz",
      href: "https://x.com/samirdevuz",
    },
    {
      id: "discord",
      label: "Discord",
      handle: "@samirdevuz",
      href: "https://discord.com/users/samirdevuz",
    },
    {
      id: "monkeytype",
      label: "Monkeytype",
      handle: "@samirdevuz",
      href: "https://monkeytype.com/profile/samirdevuz",
    },
  ],
  locales: {
    en: {
      heroBadge: "Building across web, AI tools, and EdTech",
      heroTitle: "Building useful web products.",
      heroText:
        "I'm Samir Abdumo'minov, focused on coding, AI, web development, IT, computer science, and turning useful ideas into polished digital products.",
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
      problemSolved: "Problem solved",
      blogEyebrow: "Blog",
      blogTitle: "Posts, notes, and build updates.",
      blogText:
        "A lightweight writing space for web development, interface thinking, AI tools, product notes, and project updates.",
      contactEyebrow: "Contact",
      contactTitle: "Have an idea, project, or collaboration?",
      contactText:
        "Feel free to contact me. I am open to useful projects, learning opportunities, and building modern digital products.",
      footer: "Built with Next.js and Tailwind CSS.",
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
      buildAreas: [
        {
          title: "Clean web interfaces",
          text: "Readable layouts, strong hierarchy, responsive details, and interactions that feel direct.",
        },
        {
          title: "AI-powered tools",
          text: "Tools that explain, organize, summarize, automate, and help people move through complex work.",
        },
        {
          title: "Product dashboards",
          text: "Calm product surfaces for tracking progress, managing workflows, and making next actions obvious.",
        },
        {
          title: "Useful web utilities",
          text: "Small focused tools that solve one everyday problem quickly and reliably.",
        },
      ],
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
          skills: ["Tailwind CSS", "Responsive Design", "Framer Motion", "Accessibility basics"],
        },
        {
          title: "AI Workflow",
          description:
            "Using AI-assisted workflows to learn faster, prototype ideas, and improve product iteration.",
          skills: ["Cursor", "AI coding tools", "Automation", "Prompt engineering"],
        },
        {
          title: "Product Thinking",
          description:
            "Exploring areas where software can improve learning, automation, security, and digital products.",
          skills: ["EdTech", "SaaS", "Clean UX", "Practical tools"],
        },
      ],
      trustSignals: [
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
      ],
      projects: sharedEnglishProjects,
    },
    uz: {
      heroBadge: "Web, AI tools va EdTech yo'nalishida quraman",
      heroTitle: "Foydali web mahsulotlar quraman.",
      heroText:
        "Men Samir Abdumo'minovman. Coding, AI, web development, IT, computer science va foydali g'oyalarni puxta digital mahsulotga aylantirishga fokus qilaman.",
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
      problemSolved: "Yechilayotgan muammo",
      blogEyebrow: "Blog",
      blogTitle: "Postlar, qaydlar va build yangiliklari.",
      blogText:
        "Web development, interface fikrlash, AI tools, product qaydlar va loyiha yangiliklari uchun yengil yozuv maydoni.",
      contactEyebrow: "Aloqa",
      contactTitle: "G'oya, loyiha yoki hamkorlik bormi?",
      contactText:
        "Bemalol yozing. Foydali loyihalar, learning tools va zamonaviy digital mahsulotlar qurishga ochiqman.",
      footer: "Next.js va Tailwind CSS bilan qurilgan.",
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
      buildAreas: [
        {
          title: "Toza web interfeyslar",
          text: "O'qilishi oson layoutlar, kuchli hierarchy, responsive detallar va bevosita his qilinadigan interactionlar.",
        },
        {
          title: "AI-powered toollar",
          text: "Tushuntiradigan, tartiblaydigan, summary qiladigan va murakkab ishni yengillashtiradigan toollar.",
        },
        {
          title: "Product dashboardlar",
          text: "Progressni kuzatish, workflowlarni boshqarish va keyingi actionni aniq qilish uchun sokin product yuzalari.",
        },
        {
          title: "Foydali web utilitylar",
          text: "Kundalik bitta muammoni tez va ishonchli yechadigan kichik fokusli toollar.",
        },
      ],
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
          skills: ["Tailwind CSS", "Responsive Design", "Framer Motion", "Accessibility basics"],
        },
        {
          title: "AI Workflow",
          description:
            "AI-assisted workflowlardan tezroq o'rganish, prototiplash va product iteration uchun foydalanish.",
          skills: ["Cursor", "AI coding tools", "Automation", "Prompt engineering"],
        },
        {
          title: "Product Thinking",
          description:
            "Software ta'lim, automation, security va digital productlarni yaxshilashi mumkin bo'lgan yo'nalishlarni o'rganish.",
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
          ...sharedEnglishProjects[0],
          status: "Konsept",
          description:
            "Qaydlar va mavzularni aniqroq tushuntirish, summary va study planga aylantiradigan o'quv assistant konsepti.",
          problem:
            "O'quvchilarga tarqoq materialdan AI yordamidagi fokusli o'rganish yo'liga o'tishga yordam beradi.",
        },
        {
          ...sharedEnglishProjects[1],
          status: "Shu sayt",
          description:
            "Ishlar, yo'nalish va texnik didni aniqroq ko'rsatish uchun minimal portfolio tizimi.",
          problem:
            "Oddiy resume sahifa yoki generic templatega qaraganda kuchliroq birinchi taassurot beradi.",
        },
        {
          ...sharedEnglishProjects[2],
          status: "Tajribalar",
          description:
            "Productivity, automation va web workflowlar uchun fokusli utility va tajribalar to'plami.",
          problem:
            "Kichik kundalik muammolarni katta applarsiz yengil toollar bilan hal qiladi.",
        },
      ],
    },
  },
};
