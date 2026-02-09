-- Add school settings columns to existing settings table
-- This migration adds the necessary columns for school information to the existing settings table

-- Add columns if they don't exist
DO $$
BEGIN
    -- School basic info
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'school_name') THEN
        ALTER TABLE settings ADD COLUMN school_name TEXT DEFAULT 'EHS School';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'tagline') THEN
        ALTER TABLE settings ADD COLUMN tagline TEXT DEFAULT 'Excellence in Education';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'logo_url') THEN
        ALTER TABLE settings ADD COLUMN logo_url TEXT;
    END IF;
    
    -- Contact info
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'email') THEN
        ALTER TABLE settings ADD COLUMN email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'phone') THEN
        ALTER TABLE settings ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'alternate_phone') THEN
        ALTER TABLE settings ADD COLUMN alternate_phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'website') THEN
        ALTER TABLE settings ADD COLUMN website TEXT;
    END IF;
    
    -- Address
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'address') THEN
        ALTER TABLE settings ADD COLUMN address TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'city') THEN
        ALTER TABLE settings ADD COLUMN city TEXT DEFAULT 'Lahore';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'state') THEN
        ALTER TABLE settings ADD COLUMN state TEXT DEFAULT 'Punjab';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'country') THEN
        ALTER TABLE settings ADD COLUMN country TEXT DEFAULT 'Pakistan';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'postal_code') THEN
        ALTER TABLE settings ADD COLUMN postal_code TEXT;
    END IF;
    
    -- Principal info
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'principal_name') THEN
        ALTER TABLE settings ADD COLUMN principal_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'principal_email') THEN
        ALTER TABLE settings ADD COLUMN principal_email TEXT;
    END IF;
    
    -- Registration info
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'registration_no') THEN
        ALTER TABLE settings ADD COLUMN registration_no TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'established_year') THEN
        ALTER TABLE settings ADD COLUMN established_year TEXT;
    END IF;
    
    -- Timestamps
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'created_at') THEN
        ALTER TABLE settings ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'updated_at') THEN
        ALTER TABLE settings ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Insert default settings if table is empty
INSERT INTO settings (school_name, tagline, city, state, country)
SELECT 'EHS School', 'Excellence in Education', 'Lahore', 'Punjab', 'Pakistan'
WHERE NOT EXISTS (SELECT 1 FROM settings LIMIT 1);

-- Comments for documentation
COMMENT ON COLUMN settings.school_name IS 'Name of the school';
COMMENT ON COLUMN settings.tagline IS 'School motto or tagline';
COMMENT ON COLUMN settings.logo_url IS 'URL to school logo in storage';
