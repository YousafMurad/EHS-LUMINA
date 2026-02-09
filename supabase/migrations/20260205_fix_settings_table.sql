-- SIMPLE SETTINGS TABLE FIX
-- Run this in Supabase SQL Editor to add required columns

-- Add columns one by one (safe if they already exist)
ALTER TABLE settings ADD COLUMN IF NOT EXISTS school_name TEXT DEFAULT 'EHS School';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS tagline TEXT DEFAULT 'Excellence in Education';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Insert a default row if table is empty
INSERT INTO settings (school_name, tagline)
SELECT 'EHS School', 'Excellence in Education'
WHERE NOT EXISTS (SELECT 1 FROM settings LIMIT 1);

-- Verify the columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'settings';
