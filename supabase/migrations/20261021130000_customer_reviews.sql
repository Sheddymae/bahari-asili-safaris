create table if not exists public.customer_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  booking_id bigint not null,
  booking_ref text not null,
  safari_name text not null,
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  review_text text not null check (char_length(review_text) between 10 and 2000),
  status text not null default 'published' check (status in ('published','hidden')),
  created_at timestamptz not null default now(),
  unique (user_id, booking_id)
);

alter table public.customer_reviews enable row level security;

create policy "Guests can read their own reviews"
  on public.customer_reviews for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Guests can submit reviews for their own bookings"
  on public.customer_reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Public can read published guest reviews"
  on public.customer_reviews for select
  to anon, authenticated
  using (status = 'published');

create index if not exists customer_reviews_published_created_idx
  on public.customer_reviews (status, created_at desc);
