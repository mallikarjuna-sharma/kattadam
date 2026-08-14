-- Email auth, admin activity feed, Kattadam Experts, Home services, Real estate listings.

alter table users
  add column if not exists email text;

alter table users
  add column if not exists password_hash text;

create unique index if not exists users_email_unique on users (email) where email is not null;

create table if not exists admin_events (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists app_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users (id) on delete set null,
  email text,
  started_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  user_agent text,
  ended_at timestamptz
);

create table if not exists kattadam_experts (
  id uuid primary key default gen_random_uuid(),
  expert_type text not null check (expert_type in ('builder', 'architect', 'engineer')),
  firm_name text not null,
  owner_name text not null,
  contact_number text not null,
  serviceable_areas text not null,
  district text not null,
  created_at timestamptz not null default now()
);

create table if not exists home_service_providers (
  id uuid primary key default gen_random_uuid(),
  service_category text not null,
  firm_name text not null,
  owner_name text not null,
  contact_number text not null,
  serviceable_areas text not null,
  district text not null,
  created_at timestamptz not null default now()
);

create table if not exists property_listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  listing_type text not null check (listing_type in ('SELL', 'RENT')),
  property_subtype text not null,
  price numeric not null,
  district text not null,
  area text not null,
  description text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table admin_events enable row level security;
alter table app_sessions enable row level security;
alter table kattadam_experts enable row level security;
alter table home_service_providers enable row level security;
alter table property_listings enable row level security;

create index if not exists idx_app_sessions_started on app_sessions (started_at desc);
create index if not exists idx_admin_events_created on admin_events (created_at desc);
