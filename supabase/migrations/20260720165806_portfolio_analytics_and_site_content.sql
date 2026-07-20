create table if not exists public.portfolio_site_content (
  id text primary key,
  content jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint portfolio_site_content_id_check
    check (id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint portfolio_site_content_object_check
    check (jsonb_typeof(content) = 'object')
);

alter table public.portfolio_site_content enable row level security;

revoke all on table public.portfolio_site_content from anon, authenticated;
grant select, insert, update, delete on table public.portfolio_site_content to service_role;

create policy "portfolio site content denies client access"
on public.portfolio_site_content
for all
to anon, authenticated
using (false)
with check (false);

create table if not exists public.portfolio_analytics_sessions (
  id uuid primary key,
  visitor_hash text not null,
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  landing_path text not null,
  referrer_domain text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  country text,
  device_type text not null default 'unknown',
  browser text not null default 'unknown',
  locale text,
  constraint portfolio_analytics_sessions_visitor_hash_check
    check (char_length(visitor_hash) = 64),
  constraint portfolio_analytics_sessions_landing_path_check
    check (char_length(landing_path) between 1 and 500),
  constraint portfolio_analytics_sessions_referrer_check
    check (referrer_domain is null or char_length(referrer_domain) <= 255),
  constraint portfolio_analytics_sessions_utm_source_check
    check (utm_source is null or char_length(utm_source) <= 100),
  constraint portfolio_analytics_sessions_utm_medium_check
    check (utm_medium is null or char_length(utm_medium) <= 100),
  constraint portfolio_analytics_sessions_utm_campaign_check
    check (utm_campaign is null or char_length(utm_campaign) <= 150),
  constraint portfolio_analytics_sessions_utm_content_check
    check (utm_content is null or char_length(utm_content) <= 150),
  constraint portfolio_analytics_sessions_country_check
    check (country is null or country ~ '^[A-Z]{2}$'),
  constraint portfolio_analytics_sessions_device_check
    check (device_type in ('mobile', 'tablet', 'desktop', 'unknown')),
  constraint portfolio_analytics_sessions_locale_check
    check (locale is null or locale in ('en', 'uz'))
);

create index if not exists portfolio_analytics_sessions_started_at_idx
  on public.portfolio_analytics_sessions (started_at desc);
create index if not exists portfolio_analytics_sessions_last_seen_at_idx
  on public.portfolio_analytics_sessions (last_seen_at desc);
create index if not exists portfolio_analytics_sessions_visitor_hash_idx
  on public.portfolio_analytics_sessions (visitor_hash, started_at desc);
create index if not exists portfolio_analytics_sessions_source_idx
  on public.portfolio_analytics_sessions (utm_source, started_at desc);
create index if not exists portfolio_analytics_sessions_campaign_idx
  on public.portfolio_analytics_sessions (utm_campaign, started_at desc);

alter table public.portfolio_analytics_sessions enable row level security;

revoke all on table public.portfolio_analytics_sessions from anon, authenticated;
grant select, insert, update, delete on table public.portfolio_analytics_sessions to service_role;

create policy "portfolio analytics sessions deny client access"
on public.portfolio_analytics_sessions
for all
to anon, authenticated
using (false)
with check (false);

create table if not exists public.portfolio_analytics_events (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.portfolio_analytics_sessions(id) on delete cascade,
  visitor_hash text not null,
  event_name text not null,
  path text not null,
  target text,
  created_at timestamptz not null default now(),
  constraint portfolio_analytics_events_visitor_hash_check
    check (char_length(visitor_hash) = 64),
  constraint portfolio_analytics_events_name_check
    check (event_name ~ '^[a-z0-9_]{1,64}$'),
  constraint portfolio_analytics_events_path_check
    check (char_length(path) between 1 and 500),
  constraint portfolio_analytics_events_target_check
    check (target is null or char_length(target) <= 500)
);

create index if not exists portfolio_analytics_events_created_at_idx
  on public.portfolio_analytics_events (created_at desc);
create index if not exists portfolio_analytics_events_session_idx
  on public.portfolio_analytics_events (session_id, created_at desc);
create index if not exists portfolio_analytics_events_name_idx
  on public.portfolio_analytics_events (event_name, created_at desc);
create index if not exists portfolio_analytics_events_path_idx
  on public.portfolio_analytics_events (path, created_at desc);

alter table public.portfolio_analytics_events enable row level security;

revoke all on table public.portfolio_analytics_events from anon, authenticated;
grant select, insert, update, delete on table public.portfolio_analytics_events to service_role;
grant usage, select on sequence public.portfolio_analytics_events_id_seq to service_role;

create policy "portfolio analytics events deny client access"
on public.portfolio_analytics_events
for all
to anon, authenticated
using (false)
with check (false);
