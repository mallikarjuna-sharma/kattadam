-- KATTADAM core schema (Supabase). Replace this adapter with DynamoDB/Firestore later via @kattadam/data-layer ports.

create extension if not exists "pgcrypto";

-- App users (marketplace participants + admin roles)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  role text not null check (role in ('customer', 'dealer', 'service_provider', 'super_admin', 'staff_admin')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'blocked', 'active')),
  location text,
  lat double precision,
  lng double precision,
  kyc_status text,
  created_at timestamptz not null default now()
);

create table if not exists dealers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users (id) on delete set null,
  shop_name text not null,
  owner_name text,
  phone text,
  materials text[] default '{}',
  location text,
  lat double precision,
  lng double precision,
  rating numeric not null default 0,
  verified boolean not null default false,
  enabled boolean not null default true,
  top_dealer boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  gst_doc_url text,
  license_doc_url text,
  created_at timestamptz not null default now()
);

create table if not exists materials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  subcategory text,
  unit text,
  image_url text,
  pricing_type text not null default 'dealer_quote' check (pricing_type in ('fixed', 'dealer_quote')),
  fixed_price numeric,
  created_at timestamptz not null default now()
);

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references users (id) on delete set null,
  customer_name text,
  material_id uuid references materials (id) on delete set null,
  material_label text,
  quantity numeric,
  location text,
  lat double precision,
  lng double precision,
  status text not null default 'pending' check (
    status in ('pending', 'assigned', 'accepted', 'delivered', 'cancelled')
  ),
  assigned_dealer_id uuid references dealers (id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users (id) on delete cascade,
  dealer_id uuid references dealers (id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  approved boolean not null default false,
  complaint boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists service_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists dealer_zones (
  dealer_id uuid not null references dealers (id) on delete cascade,
  zone_id uuid not null references service_zones (id) on delete cascade,
  primary key (dealer_id, zone_id)
);

create table if not exists notification_broadcasts (
  id uuid primary key default gen_random_uuid(),
  audience text not null check (audience in ('all', 'dealers', 'customers')),
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_role on users (role);
create index if not exists idx_users_status on users (status);
create index if not exists idx_dealers_status on dealers (status);
create index if not exists idx_enquiries_status on enquiries (status);
create index if not exists idx_enquiries_created on enquiries (created_at);

alter table users enable row level security;
alter table dealers enable row level security;
alter table materials enable row level security;
alter table enquiries enable row level security;
alter table reviews enable row level security;
alter table service_zones enable row level security;
alter table dealer_zones enable row level security;
alter table notification_broadcasts enable row level security;

-- Service role (used only inside data-layer on server) bypasses RLS; tighten policies when wiring auth.
