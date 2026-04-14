-- Dealers: explicit district + area (location kept as "Area, District" for compatibility).
-- Materials: optional link to a dealer row for Admin catalogue.

alter table dealers
  add column if not exists district text;

alter table dealers
  add column if not exists area text;

update dealers
set
  area = trim(split_part(location, ',', 1)),
  district = trim(split_part(location, ',', 2))
where
  (area is null or trim(area) = '')
  and location is not null
  and location like '%,%';

update dealers
set district = coalesce(nullif(trim(district), ''), 'Coimbatore')
where district is null or trim(district) = '';

update dealers
set area = coalesce(nullif(trim(area), ''), 'RS Puram')
where area is null or trim(area) = '';

update dealers
set location = trim(area) || ', ' || trim(district)
where location is null or trim(location) = '';

alter table materials
  add column if not exists dealer_id uuid references dealers (id) on delete set null;
