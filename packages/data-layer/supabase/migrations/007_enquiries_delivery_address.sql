-- Delivery address for customer enquiries (current address uses existing `location` column).
ALTER TABLE enquiries
  ADD COLUMN IF NOT EXISTS delivery_address text;

COMMENT ON COLUMN enquiries.location IS 'Customer current / site address';
COMMENT ON COLUMN enquiries.delivery_address IS 'Preferred delivery address when different from current address';
