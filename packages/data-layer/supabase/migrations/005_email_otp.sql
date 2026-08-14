-- Email OTP verification for signup and password reset.

alter table users
  add column if not exists email_verified_at timestamptz;

create table if not exists email_otps (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  purpose text not null check (purpose in ('signup', 'password_reset')),
  code_hash text not null,
  expires_at timestamptz not null,
  attempts int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_email_otps_lookup on email_otps (email, purpose, created_at desc);
create index if not exists idx_email_otps_expires on email_otps (expires_at);

alter table email_otps enable row level security;
