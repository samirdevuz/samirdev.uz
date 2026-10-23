// All site copy lives here. Edit this file to update the site.

export type Social = { label: string; href: string; handle: string }
export type Project = {
  name: string
  text: string
  tags: string[]
  href: string
}
export type Exploration = { title: string; text: string; when: string }
// `file` is an svgl.app logo; leave it out to draw the icon in Stack.tsx instead.
export type Tool = { label: string; file?: string; tile: string; fit?: string; tone?: string }

export const content = {
  name: 'Samir Abdumo‘minov',
  handle: 'samirdevuz',
  role: 'Product builder',
  location: 'Sirdaryo, Uzbekistan',
  since: '2023',
  status: 'Open to new projects',
  headline: { before: 'I build', mark: 'useful', after: 'products for the web.' },
  intro:
    "I'm Samir, a product builder from Sirdaryo. I take an idea from the first sketch to a live product people can use, and keep improving it after launch.",

  about: {
    lead: 'I have been building on the web since 2023, starting with small tools and growing into full products with real users.',
    text: 'I care less about the technology for its own sake and more about whether a product actually helps the people using it: clear scope, a fast first version, and steady improvements based on how it is used.',
  },

  projects: [
    {
      name: 'MilliyPrep',
      text: 'Milliy Sertifikat exam prep in Uzbek: a study plan built around your goal score, topic practice, timed mini-tests, progress tracking and an AI tutor.',
      tags: ['EdTech', 'AI tutor'],
      href: 'https://milliyprep.xyz',
    },
    {
      name: 'UzCord',
      text: 'A free, open-source moderation bot for Uzbek Discord communities: case history, AutoMod, logging, welcome messages and self-assign roles.',
      tags: ['Discord bot', 'Open source'],
      href: 'https://uzcord.samirdev.uz',
    },
    {
      name: '3D Models',
      text: 'A showcase of models I have built in Blockbench.',
      tags: ['3D', 'Blockbench'],
      href: 'https://models.samirdev.uz',
    },
  ] as Project[],

  // The open slot at the end of the projects list.
  openSlot: {
    name: 'Your product',
    text: 'This spot is open. Your website or product could be the next one here.',
    cta: 'Start a project',
  },

  // Things outside of products.
  explorations: [
    { title: '3D modeling', text: 'Built models in Blockbench.', when: 'Before' },
    { title: 'Cybersecurity', text: 'Studied it out of curiosity, to see how systems break.', when: 'Before' },
    {
      title: 'Competitive programming',
      text: 'Taking part in contests, writing in C++ and Python.',
      when: 'Now',
    },
  ] as Exploration[],

  // Logos come from svgl.app. `tile` is the icon's background.
  stack: [
    { label: 'Claude Code', file: 'claude-ai-icon', tile: '#d76f4d', fit: '58%', tone: 'brightness(0) invert(1)' },
    { label: 'Codex', tile: '#222' },
    { label: 'VS Code', file: 'vscode', tile: '#fff' },
    { label: 'GitHub', file: 'github_dark', tile: '#0d1117' },
    { label: 'Figma', file: 'figma', tile: '#fff', fit: '46%' },
    { label: 'Supabase', file: 'supabase', tile: '#171717' },
    { label: 'Slack', file: 'slack', tile: '#fff' },
    { label: 'Vercel', file: 'vercel_dark', tile: '#000', fit: '46%' },
    { label: 'Cursor', file: 'cursor_dark', tile: '#14120b', fit: '50%' },
    { label: 'Cloudflare', file: 'cloudflare', tile: '#fff', fit: '64%' },
  ] as Tool[],

  contact: {
    title: 'Have a project in mind?',
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
