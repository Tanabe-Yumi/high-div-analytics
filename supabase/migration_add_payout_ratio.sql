-- Add payout_ratio column
ALTER TABLE financial_history ADD COLUMN IF NOT EXISTS payout_ratio numeric;

-- Drop net_income column
ALTER TABLE financial_history DROP COLUMN IF EXISTS net_income;
