-- Fix profiles role check constraint to include 'parent'
-- Run this in Supabase SQL Editor

-- Step 1: Drop the existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Step 2: Add the new constraint with 'parent' included
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('super_admin', 'admin', 'accountant', 'teacher', 'operator', 'student', 'parent'));

-- Step 3: Verify
SELECT 'Constraint updated successfully!' as status;

-- Show current roles in profiles
SELECT DISTINCT role FROM profiles;
