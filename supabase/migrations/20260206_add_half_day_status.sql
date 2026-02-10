-- Migration: Add half_day status to attendance table
-- Run this in your Supabase SQL Editor

-- Step 1: Check if the attendance_status enum exists and add half_day
DO $$
BEGIN
    -- Try to add 'half_day' to the enum if it exists
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN
        -- Check if 'half_day' already exists in the enum
        IF NOT EXISTS (
            SELECT 1 FROM pg_enum 
            WHERE enumtypid = 'attendance_status'::regtype 
            AND enumlabel = 'half_day'
        ) THEN
            ALTER TYPE attendance_status ADD VALUE IF NOT EXISTS 'half_day';
        END IF;
    END IF;
END $$;

-- Step 2: If the column is a text column (not enum), update check constraint if exists
-- First, try to drop existing constraint
DO $$
BEGIN
    -- Try to drop check constraint if it exists
    ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_status_check;
EXCEPTION
    WHEN undefined_object THEN
        NULL; -- Constraint doesn't exist, that's fine
END $$;

-- Step 3: Add new check constraint that includes half_day
-- This will only work if the column is text type, not enum
DO $$
BEGIN
    ALTER TABLE attendance 
    ADD CONSTRAINT attendance_status_check 
    CHECK (status IN ('present', 'absent', 'late', 'excused', 'half_day'));
EXCEPTION
    WHEN duplicate_object THEN
        NULL; -- Constraint already exists
    WHEN check_violation THEN
        NULL; -- Data doesn't match, enum is probably being used
END $$;

-- Step 4: Verify the change
SELECT DISTINCT status FROM attendance;

-- Note: If you're using PostgreSQL enums and the above doesn't work, 
-- you may need to recreate the type:
-- 
-- 1. Create a new type with all values
-- CREATE TYPE attendance_status_new AS ENUM ('present', 'absent', 'late', 'excused', 'half_day');
--
-- 2. Update the column to use the new type
-- ALTER TABLE attendance 
-- ALTER COLUMN status TYPE attendance_status_new 
-- USING status::text::attendance_status_new;
--
-- 3. Drop the old type
-- DROP TYPE attendance_status;
--
-- 4. Rename the new type
-- ALTER TYPE attendance_status_new RENAME TO attendance_status;
