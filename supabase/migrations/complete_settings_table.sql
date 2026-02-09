-- Complete Settings Table Migration for EHS ERP
-- Run this script in Supabase SQL Editor to set up the settings table properly

-- =====================================================
-- OPTION 1: If you want to DROP and RECREATE the table
-- (Use this if the existing table has incompatible structure)
-- =====================================================

-- First, drop the existing settings table if it exists
DROP TABLE IF EXISTS settings;

-- Create the settings table with all required columns
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- School Information
    school_name TEXT NOT NULL DEFAULT 'EHS School',
    tagline TEXT DEFAULT 'Excellence in Education',
    registration_no TEXT DEFAULT NULL,
    established_year TEXT DEFAULT NULL,
    logo_url TEXT DEFAULT NULL,
    
    -- Contact Information
    email TEXT DEFAULT NULL,
    phone TEXT DEFAULT NULL,
    alternate_phone TEXT DEFAULT NULL,
    website TEXT DEFAULT NULL,
    
    -- Address Information
    address TEXT DEFAULT NULL,
    city TEXT DEFAULT NULL,
    state TEXT DEFAULT NULL,
    country TEXT DEFAULT 'Pakistan',
    postal_code TEXT DEFAULT NULL,
    
    -- Principal Information
    principal_name TEXT DEFAULT NULL,
    principal_email TEXT DEFAULT NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings row
INSERT INTO settings (
    school_name,
    tagline,
    email,
    phone,
    alternate_phone,
    website,
    address,
    city,
    state,
    country,
    postal_code,
    principal_name,
    principal_email,
    registration_no,
    established_year
) VALUES (
    'EHS School',
    'Excellence in Education',
    'info@ehsschool.edu.pk',
    '042-35761234',
    '0300-1234567',
    'www.ehsschool.edu.pk',
    '123 Main Boulevard, Gulberg III',
    'Lahore',
    'Punjab',
    'Pakistan',
    '54000',
    'Dr. Ahmed Khan',
    'principal@ehsschool.edu.pk',
    'REG-2020-12345',
    '1995'
);

-- Enable Row Level Security (RLS) for settings table
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read settings
CREATE POLICY "Allow authenticated users to read settings" ON settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update settings
CREATE POLICY "Allow authenticated users to update settings" ON settings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert settings
CREATE POLICY "Allow authenticated users to insert settings" ON settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- STORAGE BUCKET for logos
-- =====================================================

-- Create storage bucket for settings (logos, etc.) if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('settings', 'settings', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read files in settings bucket
CREATE POLICY "Public Access for settings bucket" ON storage.objects
    FOR SELECT USING (bucket_id = 'settings');

-- Allow authenticated users to upload to settings bucket
CREATE POLICY "Authenticated users can upload to settings bucket" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'settings' 
        AND auth.role() = 'authenticated'
    );

-- Allow authenticated users to update files in settings bucket
CREATE POLICY "Authenticated users can update settings bucket" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'settings' 
        AND auth.role() = 'authenticated'
    );

-- Allow authenticated users to delete files from settings bucket
CREATE POLICY "Authenticated users can delete from settings bucket" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'settings' 
        AND auth.role() = 'authenticated'
    );

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant permissions on settings table
GRANT ALL ON settings TO authenticated;
GRANT SELECT ON settings TO anon;

-- =====================================================
-- DONE!
-- =====================================================
-- After running this script:
-- 1. Refresh your browser
-- 2. Go to Settings > General Settings
-- 3. The settings form should now work correctly
-- 4. You should be able to upload logos

SELECT 'Settings table created successfully!' as message;
