-- Promote phone out of the freeform `notes` blob into structured columns,
-- and add two new optional contact fields requested by the team:
--   alt_phone (alternate phone number) and email.
-- All three columns are nullable so existing rows keep working.

alter table enquiries
  add column if not exists phone text;

alter table enquiries
  add column if not exists alt_phone text;

alter table enquiries
  add column if not exists email text;
