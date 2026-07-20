create table if not exists public.portfolio_posts (
  slug text primary key,
  title text not null,
  published_on date not null,
  category text not null,
  excerpt text not null,
  reading_time text not null,
  content text[] not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint portfolio_posts_slug_format_check
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint portfolio_posts_title_length_check
    check (char_length(title) between 1 and 160),
  constraint portfolio_posts_category_length_check
    check (char_length(category) between 1 and 60),
  constraint portfolio_posts_excerpt_length_check
    check (char_length(excerpt) between 1 and 500),
  constraint portfolio_posts_reading_time_length_check
    check (char_length(reading_time) between 1 and 40),
  constraint portfolio_posts_content_count_check
    check (cardinality(content) between 1 and 50)
);

create index if not exists portfolio_posts_published_on_idx
  on public.portfolio_posts (published_on desc, slug);

alter table public.portfolio_posts enable row level security;

revoke all on table public.portfolio_posts from anon, authenticated;
grant select, insert, update, delete on table public.portfolio_posts to service_role;

create table if not exists public.portfolio_admin_rate_limits (
  client_key text primary key,
  attempt_count integer not null default 0,
  window_started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint portfolio_admin_rate_limits_client_key_length_check
    check (char_length(client_key) = 64),
  constraint portfolio_admin_rate_limits_attempt_count_check
    check (attempt_count >= 0)
);

create index if not exists portfolio_admin_rate_limits_updated_at_idx
  on public.portfolio_admin_rate_limits (updated_at);

alter table public.portfolio_admin_rate_limits enable row level security;

revoke all on table public.portfolio_admin_rate_limits from anon, authenticated;
grant select, insert, update, delete on table public.portfolio_admin_rate_limits to service_role;

create or replace function public.check_portfolio_admin_rate_limit(
  p_client_key text,
  p_window_seconds integer default 600,
  p_max_attempts integer default 5
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  limited boolean;
begin
  if char_length(p_client_key) <> 64 then
    raise exception 'Invalid client key';
  end if;

  if p_window_seconds not between 60 and 86400 then
    raise exception 'Invalid rate-limit window';
  end if;

  if p_max_attempts not between 1 and 100 then
    raise exception 'Invalid maximum attempts';
  end if;

  delete from public.portfolio_admin_rate_limits
  where updated_at < now() - interval '1 day';

  insert into public.portfolio_admin_rate_limits (
    client_key,
    attempt_count,
    window_started_at,
    updated_at
  )
  values (p_client_key, 1, now(), now())
  on conflict (client_key) do update
  set
    attempt_count = case
      when public.portfolio_admin_rate_limits.window_started_at
        <= now() - make_interval(secs => p_window_seconds)
      then 1
      else public.portfolio_admin_rate_limits.attempt_count + 1
    end,
    window_started_at = case
      when public.portfolio_admin_rate_limits.window_started_at
        <= now() - make_interval(secs => p_window_seconds)
      then now()
      else public.portfolio_admin_rate_limits.window_started_at
    end,
    updated_at = now()
  returning attempt_count > p_max_attempts into limited;

  return limited;
end;
$$;

revoke all on function public.check_portfolio_admin_rate_limit(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.check_portfolio_admin_rate_limit(text, integer, integer)
  to service_role;

insert into public.portfolio_posts (
  slug,
  title,
  published_on,
  category,
  excerpt,
  reading_time,
  content
)
values
(
  'building-milliyprep',
  'Building MilliyPrep',
  '2026-06-28',
  'EdTech',
  'Notes on building a focused exam-preparation platform for Uzbek learners.',
  '3 min read',
  array[
    'MilliyPrep is about making exam preparation feel focused, modern, and easier to navigate. The product direction is simple: help learners find the right subject, understand what to practice, and keep moving without unnecessary noise.',
    'The design goal is a clean study experience for Uzbekistan''s Milliy Sertifikat exams. That means strong structure, readable interfaces, and product decisions that support learning instead of distracting from it.',
    'As the project grows, I want MilliyPrep to become a place where frontend quality, EdTech thinking, and practical learning tools come together.'
  ]
),
(
  'why-i-like-minimal-interfaces',
  'Why I Like Minimal Interfaces',
  '2026-06-20',
  'Design',
  'Thoughts on clean UI, spacing, typography, and product feel.',
  '2 min read',
  array[
    'Minimal interfaces are not empty interfaces. They are interfaces where each detail has a reason: spacing, contrast, typography, hierarchy, and interaction all work together.',
    'I like designs that feel calm and useful. A product should be easy to understand quickly, but still feel polished when someone spends more time with it.',
    'Good minimal design is careful. It removes decoration, but it does not remove personality or quality.'
  ]
),
(
  'using-ai-tools-as-a-developer',
  'Using AI Tools as a Developer',
  '2026-06-12',
  'AI',
  'How AI coding tools can improve speed, learning, and product iteration.',
  '3 min read',
  array[
    'AI tools are useful when they help turn ideas into working software faster, but they still need direction, judgment, and review.',
    'For development, I see AI as a way to explore implementation options, understand code, improve iteration speed, and learn faster while still building real understanding.',
    'The best use of AI is not to replace thinking. It is to make the feedback loop shorter so better products can be built with more focus.'
  ]
)
on conflict (slug) do nothing;
