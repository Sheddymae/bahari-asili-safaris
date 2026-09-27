create table if not exists public.api_rate_limits (
  rate_key text primary key,
  window_started timestamptz not null default now(),
  hits integer not null default 0
);

alter table public.api_rate_limits enable row level security;
revoke all on public.api_rate_limits from anon, authenticated;

create or replace function public.check_api_rate_limit(
  p_rate_key text,
  p_window_seconds integer,
  p_max_hits integer
)
returns table(allowed boolean, retry_after integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_started timestamptz;
  v_hits integer;
  v_now timestamptz := now();
  v_remaining integer;
begin
  insert into public.api_rate_limits(rate_key, window_started, hits)
  values (p_rate_key, v_now, 1)
  on conflict (rate_key) do update
    set window_started = case
      when public.api_rate_limits.window_started + make_interval(secs => p_window_seconds) <= v_now
        then v_now
      else public.api_rate_limits.window_started
    end,
    hits = case
      when public.api_rate_limits.window_started + make_interval(secs => p_window_seconds) <= v_now
        then 1
      else public.api_rate_limits.hits + 1
    end;

  select window_started, hits into v_started, v_hits
  from public.api_rate_limits
  where rate_key = p_rate_key;

  v_remaining := greatest(0, ceil(extract(epoch from (v_started + make_interval(secs => p_window_seconds) - v_now)))::integer);
  return query select v_hits <= p_max_hits, v_remaining;
end;
$$;

revoke all on function public.check_api_rate_limit(text, integer, integer) from public, anon, authenticated;
