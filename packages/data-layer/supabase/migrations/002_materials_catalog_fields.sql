-- Materials catalogue: price, dealer (internal), district & area for customer filters.
-- Run in Supabase SQL editor after 001_initial.sql if upgrading an existing project.

alter table materials
  add column if not exists price numeric;

alter table materials
  add column if not exists dealer_name text;

alter table materials
  add column if not exists district text;

alter table materials
  add column if not exists area text;

update materials
set
  price = coalesce(price, fixed_price, 0)
where price is null;

update materials
set district = 'Coimbatore'
where district is null or trim(district) = '';

update materials
set area = 'RS Puram'
where area is null or trim(area) = '';

update materials
set dealer_name = coalesce(nullif(trim(dealer_name), ''), '—')
where dealer_name is null;

alter table materials
  alter column price set default 0;

alter table materials
  alter column district set default 'Coimbatore';

alter table materials
  alter column area set default '';

alter table materials
  alter column dealer_name set default '';

alter table materials
  alter column price set not null;

alter table materials
  alter column district set not null;

alter table materials
  alter column area set not null;

alter table materials
  alter column dealer_name set not null;
