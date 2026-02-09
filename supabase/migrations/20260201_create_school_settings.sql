-- Create school_settings table for storing school information and logo
-- Run this migration in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS school_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_name TEXT NOT NULL DEFAULT 'EHS School',
    tagline TEXT DEFAULT 'Excellence in Education',
    email TEXT,
    phone TEXT,
    alternate_phone TEXT,
    website TEXT,
    address TEXT,
    city TEXT DEFAULT 'Lahore',
    state TEXT DEFAULT 'Punjab',
    country TEXT DEFAULT 'Pakistan',
    postal_code TEXT,
    principal_name TEXT,
    principal_email TEXT,
    registration_no TEXT,
    established_year TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read school settings
CREATE POLICY "Allow authenticated users to read school_settings"
    ON school_settings
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow only super_admin and admin to update school settings
CREATE POLICY "Allow admins to update school_settings"
    ON school_settings
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('super_admin', 'admin')
        )
    );

-- Allow only super_admin and admin to insert school settings
CREATE POLICY "Allow admins to insert school_settings"
    ON school_settings
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('super_admin', 'admin')
        )
    );

-- Insert default settings row (so there's always one record)
INSERT INTO school_settings (
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
) ON CONFLICT DO NOTHING;

-- Create storage bucket for settings (logo, etc.)
-- Note: Run this in a separate migration or via Supabase Dashboard
-- INSERT INTO storage.buckets (id, name, public) VALUES ('settings', 'settings', true);

-- Create storage policy for settings bucket
-- CREATE POLICY "Allow authenticated users to upload settings files"
--     ON storage.objects
--     FOR INSERT
--     TO authenticated
--     WITH CHECK (bucket_id = 'settings');

-- CREATE POLICY "Allow public read access to settings files"
--     ON storage.objects
--     FOR SELECT
--     TO public
--     USING (bucket_id = 'settings');
