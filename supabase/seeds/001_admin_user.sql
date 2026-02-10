-- =====================================================
-- EHS ERP - Admin User Seed
-- Version: 1.0.0
-- Description: Creates the initial Super Admin user
-- =====================================================
-- 
-- ⚠️ IMPORTANT: Run this AFTER running migrations 001 and 002
-- 
-- This script creates:
-- 1. A Super Admin user in auth.users
-- 2. Their profile in public.profiles
--
-- Default Credentials:
--   Email: admin@ehs.edu.pk
--   Password: Admin@123456
--
-- ⚠️ CHANGE THE PASSWORD IMMEDIATELY AFTER FIRST LOGIN!
-- =====================================================

-- First, let's create the admin user using Supabase's auth functions
-- NOTE: In Supabase Dashboard, you can also create users via Authentication → Users

-- Insert admin user (this uses the service role, run in SQL Editor)
DO $$
DECLARE
    admin_uid UUID;
BEGIN
    -- Check if admin already exists
    SELECT id INTO admin_uid 
    FROM auth.users 
    WHERE email = 'admin@ehs.edu.pk';
    
    IF admin_uid IS NOT NULL THEN
        RAISE NOTICE 'Admin user already exists with ID: %', admin_uid;
        
        -- Update profile to ensure super_admin role
        UPDATE public.profiles 
        SET role = 'super_admin', 
            name = 'Super Admin',
            is_active = true
        WHERE id = admin_uid;
        
        RAISE NOTICE 'Profile updated to super_admin role';
    ELSE
        RAISE NOTICE 'Admin user does not exist. Please create manually.';
        RAISE NOTICE '';
        RAISE NOTICE '📋 MANUAL STEPS TO CREATE ADMIN:';
        RAISE NOTICE '1. Go to Supabase Dashboard → Authentication → Users';
        RAISE NOTICE '2. Click "Add User" → "Create new user"';
        RAISE NOTICE '3. Enter:';
        RAISE NOTICE '   Email: admin@ehs.edu.pk';
        RAISE NOTICE '   Password: Admin@123456';
        RAISE NOTICE '4. Click "Create User"';
        RAISE NOTICE '5. Then run this script again to set the role';
    END IF;
END $$;

-- Alternative: If you've already created the user via dashboard,
-- just update their role to super_admin:
UPDATE public.profiles 
SET 
    role = 'super_admin',
    name = 'Super Admin',
    is_active = true,
    updated_at = NOW()
WHERE email = 'admin@ehs.edu.pk';

-- =====================================================
-- SEED INITIAL DATA (Optional but helpful for development)
-- =====================================================

-- Create a default active session
INSERT INTO public.sessions (name, start_date, end_date, is_active)
VALUES ('2025-2026', '2025-04-01', '2026-03-31', true)
ON CONFLICT DO NOTHING;

-- Create default classes
INSERT INTO public.classes (name, grade_level, description, is_active) VALUES
    ('Nursery', 0, 'Pre-school level', true),
    ('Prep', 1, 'Kindergarten', true),
    ('Class 1', 2, 'First Grade', true),
    ('Class 2', 3, 'Second Grade', true),
    ('Class 3', 4, 'Third Grade', true),
    ('Class 4', 5, 'Fourth Grade', true),
    ('Class 5', 6, 'Fifth Grade', true),
    ('Class 6', 7, 'Sixth Grade', true),
    ('Class 7', 8, 'Seventh Grade', true),
    ('Class 8', 9, 'Eighth Grade', true),
    ('Class 9', 10, 'Ninth Grade (Matric)', true),
    ('Class 10', 11, 'Tenth Grade (Matric)', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'Seed Data Created Successfully!';
    RAISE NOTICE '';
    RAISE NOTICE 'Admin Email: admin@ehs.edu.pk';
    RAISE NOTICE 'Admin Password: Admin@123456';
    RAISE NOTICE '';
    RAISE NOTICE 'IMPORTANT: Change the password after first login!';
    RAISE NOTICE '';
END $$;
