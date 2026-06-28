# Samir Abdumo'minov Portfolio

Premium minimal portfolio for Samir Abdumo'minov, built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and Lucide icons.

## Features

- One-page developer portfolio with polished sections, projects, blog previews, and contact links.
- Editable blog system backed by local JSON content.
- Hidden admin route at `/admin` for managing posts.
- Signed HttpOnly admin session cookie.
- SEO metadata, sitemap, robots file, and custom minimalist logo.
- Light/dark theme support.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Admin Setup

Create `.env` or `.env.local`:

```bash
ADMIN_PASSWORD="replace-with-a-long-random-password"
ADMIN_SESSION_SECRET="replace-with-a-different-long-random-secret"
```

The admin link is intentionally not shown in the public command menu or navigation. Visit `/admin` directly.

For production on Vercel, add the same variables in Project Settings -> Environment Variables. Without `ADMIN_PASSWORD`, admin login is disabled.

## Editing Blog Posts

Blog content lives in:

```text
src/data/blog-posts.json
```

The admin UI writes to that file in local development. On serverless hosting, persistent edits should move to a database or CMS such as Supabase, Neon, Sanity, or Vercel Blob because production file systems are not durable.

## Scripts

```bash
npm run lint
npm run build
```

## Deployment

This project is optimized for Vercel. Before deploying production admin features, set:

- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Never commit real environment values.
