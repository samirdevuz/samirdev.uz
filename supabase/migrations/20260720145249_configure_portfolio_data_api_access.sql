grant select on table public.portfolio_posts to anon, authenticated;

create policy "portfolio posts are publicly readable"
on public.portfolio_posts
for select
to anon, authenticated
using (true);

create policy "portfolio rate limits deny client access"
on public.portfolio_admin_rate_limits
for all
to anon, authenticated
using (false)
with check (false);
