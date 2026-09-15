-- Bahari Asili Safaris: server-side pricing controls + customer currency selection.
-- All source rates are maintained in KES. USD/EUR are display/quotation conversions
-- using admin-controlled rates, so no client can change the authoritative price.

create table if not exists public.safari_pricing_settings (
  destination_slug text primary key,
  accommodation_per_night numeric not null default 0 check (accommodation_per_night >= 0),
  park_fee_adult_per_day numeric not null default 0 check (park_fee_adult_per_day >= 0),
  park_fee_child_per_day numeric not null default 0 check (park_fee_child_per_day >= 0),
  guide_vehicle_per_day numeric not null default 0 check (guide_vehicle_per_day >= 0),
  meals_adult_per_day numeric not null default 0 check (meals_adult_per_day >= 0),
  meals_child_per_day numeric not null default 0 check (meals_child_per_day >= 0),
  pricing_mode text not null default 'manual' check (pricing_mode in ('manual','benchmark')),
  competitor_reference numeric not null default 0 check (competitor_reference >= 0),
  target_markup_percent numeric not null default 0 check (target_markup_percent >= -100 and target_markup_percent <= 500),
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.safari_currency_settings (
  currency text primary key check (currency in ('KES','USD','EUR')),
  kes_per_unit numeric not null check (kes_per_unit > 0),
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.safari_pricing_settings
  (destination_slug, accommodation_per_night, park_fee_adult_per_day, park_fee_child_per_day, guide_vehicle_per_day, meals_adult_per_day, meals_child_per_day, pricing_mode)
values
  ('tsavo', 14000, 2500, 1200, 9000, 3000, 1500, 'manual'),
  ('amboseli', 15500, 2800, 1300, 9500, 3200, 1600, 'manual'),
  ('mara', 18000, 3500, 1700, 12000, 3500, 1750, 'manual'),
  ('taita', 12500, 2000, 1000, 8000, 2800, 1400, 'manual')
on conflict (destination_slug) do nothing;

insert into public.safari_currency_settings (currency, kes_per_unit)
values ('KES', 1), ('USD', 129.50), ('EUR', 151.00)
on conflict (currency) do nothing;

create index if not exists safari_pricing_settings_active_idx on public.safari_pricing_settings(active);

alter table public.safari_pricing_settings enable row level security;
alter table public.safari_currency_settings enable row level security;

-- Public customers read pricing only through the server API. The service-role
-- client used by admin routes bypasses RLS; there are intentionally no public
-- insert/update policies for prices or exchange rates.
