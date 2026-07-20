# Samir Abdumo'minov Portfolio

Premium minimal portfolio for Samir Abdumo'minov, built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and Lucide icons.

## Features

- One-page developer portfolio with polished sections, projects, blog previews, and contact links.
- Editable blog system backed by Supabase Postgres with bundled seed content.
- Hidden admin control center at `/admin` for analytics, site copy, campaigns, blog posts, and health checks.
- Privacy-minded first-party analytics with UTM/source, campaign, page, country, device, and interaction breakdowns.
- Editable English and Uzbek portfolio copy stored in Supabase.
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
ANALYTICS_HASH_SECRET="replace-with-an-analytics-only-random-secret"
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_PUBLISHABLE_KEY="sb_publishable_replace_me"
SUPABASE_SECRET_KEY="sb_secret_replace_me"
```

The admin link is intentionally not shown in the public command menu or navigation. Visit `/admin` directly.

For production on Vercel, add the same variables in Project Settings -> Environment Variables. Use at least 16 characters for `ADMIN_PASSWORD` and 32 characters for both secrets. `ANALYTICS_HASH_SECRET` is optional but recommended; without it, analytics hashing falls back to the admin secret. Secret values must never use a `NEXT_PUBLIC_` prefix. Without the complete admin configuration, admin login fails closed.

## Analytics and campaign links

Use Admin -> Campaigns to generate links such as:

```text
https://samirdev.uz/?utm_source=instagram&utm_medium=social&utm_campaign=instagram_bio&utm_content=profile_link
```

The site records anonymous first-party sessions and interaction events. Raw IP addresses are not stored; they are converted to a rotating daily hash. Admin -> Analytics shows visitors, page views, traffic sources, campaigns, countries, devices, pages, and conversion-style clicks.
Legacy short parameters such as `?source=instagram` are also accepted, although UTM links are recommended for consistent reports.

## Editing site content

Admin -> Site content edits the profile, social links, and English/Uzbek public copy. Saving writes one versioned content document to `portfolio_site_content` and immediately revalidates the home page. The bundled defaults in `src/data/site-content.ts` remain the safe fallback.

## Editing Blog Posts

Bundled seed content lives in:

```text
src/data/blog-posts.json
```

The live blog reads from the Supabase `portfolio_posts` table. The JSON file is only a development/build fallback when Supabase read variables are absent. Admin writes always require Supabase and are durable across Vercel/serverless instances.

Database migrations are committed under:

```text
supabase/migrations
```

The schema enables RLS, grants public read-only access to portfolio posts, denies client access to rate-limit records, and reserves mutations for the backend secret key.

## Scripts

```bash
npm run lint
npm run build
```

## Deployment

This project is optimized for Vercel. Before deploying production admin features, set:

- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `ANALYTICS_HASH_SECRET` (recommended)
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`

Never commit real environment values.
