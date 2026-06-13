-- Residential and delivery addresses for dealers (admin-managed).
ALTER TABLE dealers
  ADD COLUMN IF NOT EXISTS residential_address text,
  ADD COLUMN IF NOT EXISTS delivery_address text;

COMMENT ON COLUMN dealers.residential_address IS 'Dealer shop / residential address (admin-entered)';
COMMENT ON COLUMN dealers.delivery_address IS 'Delivery / dispatch address for orders';
