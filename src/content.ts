// All site copy lives here. Edit this file to update the site.

export type Stat = { label: string; value: string }
export type Principle = { title: string; text: string }
export type JourneyItem = { year: string; title: string; role: string; text: string }
export type Social = { label: string; href: string; handle: string }
export type Project = {
  name: string
  text: string
  tags: string[]
  status: string
  href?: string
}
export type Exploration = { title: string; text: string }

export const content = {
  name: 'Samir Abdumo‘minov',
  handle: 'samirdevuz',
  role: 'Product builder',
  location: 'Sirdaryo, Uzbekistan',
  status: 'Currently building LeadMap',
  headline: { before: 'I build products for', mark: 'everyday', after: 'problems.' },
  intro:
    "I'm Samir — a product builder from Sirdaryo. I pick a group of people, find the problem that costs them time every single day, and build the product that makes it go away.",

  about: {
    quote: 'Useful beats impressive.',
    paragraphs: [
      'I started building products in 2025. Not for the sake of the technology, but for people with real routines: the problems they have stopped noticing because they live with them every day.',
      'By 2026 the way I work has become sharper and more professional: clearer problem definitions, faster first versions, and a habit of measuring whether a product actually helps.',
    ],
    stats: [
      { label: 'Building since', value: '2025' },
      { label: 'Focus', value: 'Everyday problems' },
      { label: 'Based in', value: 'Sirdaryo' },
      { label: 'Languages', value: 'Python · C++' },
    ] as Stat[],
  },

  projects: [
    {
      name: 'MilliyPrep',
      text: 'Milliy Sertifikat exam prep in Uzbek: a study plan built around your goal score, topic practice, timed mini-tests, progress tracking and an AI tutor. Math first, more subjects coming.',
      tags: ['EdTech', 'AI tutor'],
      status: 'Live',
      href: 'https://milliyprep.xyz',
    },
    {
      name: 'UzCord',
      text: 'A free, open-source moderation bot for Uzbek Discord communities: moderation with case history, AutoMod, logging, welcome messages and self-assign roles — in Uzbek, Russian and English.',
      tags: ['Discord bot', 'Open source'],
      status: 'Live',
      href: 'https://uzcord.samirdev.uz',
    },
    {
      name: '3D Models',
      text: 'A showcase of models I have built in Blockbench.',
      tags: ['3D', 'Blockbench'],
      status: 'Live',
      href: 'https://models.samirdev.uz',
    },
    {
      name: 'LeadMap',
      text: 'What I am building right now. Details coming soon.',
      tags: ['In progress'],
      status: 'Building',
    },
  ] as Project[],

  // Fields explored outside of products.
  explorations: [
    { title: 'Competitive programming', text: 'Algorithms and contest problems in C++ — my current side focus.' },
    { title: '3D modeling', text: 'Models built in Blockbench — see models.samirdev.uz.' },
    { title: 'Cybersecurity', text: 'Learning how systems break, to build ones that do not.' },
    { title: 'Motion graphics', text: 'Animation and visual storytelling.' },
  ] as Exploration[],
  languages: ['Python', 'C++'],

  principles: [
    {
      title: 'Find the real problem',
      text: 'Start with people, not ideas. Talk to them, watch their day, and find the pain they repeat.',
    },
    {
      title: 'Build the smallest fix',
      text: 'Ship the simplest version that solves it, put it in front of real users, and learn quickly.',
    },
    {
      title: 'Keep what works',
      text: 'Measure whether people come back. Double down on what helps and cut what does not.',
    },
  ] as Principle[],

  journey: [
    {
      year: '2025',
      title: 'Started building',
      role: 'Builder',
      text: 'First products aimed at everyday problems of specific groups of people. Learning by shipping.',
    },
    {
      year: '2026',
      title: 'Sharper and professional',
      role: 'Builder',
      text: 'MilliyPrep, UzCord and now LeadMap — with a clearer process and a higher bar.',
    },
  ] as JourneyItem[],

  now: {
    project: 'LeadMap',
    title: 'Right now I’m building LeadMap.',
    text: "It's my main focus at the moment. If you know a group of people struggling with something every day, I'd still like to hear about it — that's where the next product comes from.",
    cta: 'Tell me about a problem',
  },

  contact: {
    title: 'Got a problem worth solving?',
    email: 'contact@samirdev.uz',
    socials: [
      { label: 'Telegram', href: 'https://t.me/abdumuminov_samir', handle: '@abdumuminov_samir' },
      { label: 'Instagram', href: 'https://instagram.com/abdumuminov_samir', handle: '@abdumuminov_samir' },
      { label: 'GitHub', href: 'https://github.com/samirdevuz', handle: '@samirdevuz' },
      { label: 'X', href: 'https://x.com/samirdevuz', handle: '@samirdevuz' },
    ] as Social[],
  },

  footerNote: 'Built in Sirdaryo',
}
