-- Run this once in Supabase → SQL Editor → New query → Run
-- Adds enquiry contact + delivery columns (migrations 005 + 007)

ALTER TABLE enquiries
  ADD COLUMN IF NOT EXISTS phone text;

ALTER TABLE enquiries
  ADD COLUMN IF NOT EXISTS alt_phone text;

ALTER TABLE enquiries
  ADD COLUMN IF NOT EXISTS email text;

ALTER TABLE enquiries
  ADD COLUMN IF NOT EXISTS delivery_address text;

COMMENT ON COLUMN enquiries.location IS 'Customer current / site address';
COMMENT ON COLUMN enquiries.delivery_address IS 'Preferred delivery address when different from current address';
