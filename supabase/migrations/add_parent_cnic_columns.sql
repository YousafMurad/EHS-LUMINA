-- Add father_cnic and mother_cnic columns to students table for sibling tracking
-- Run this in Supabase SQL Editor

-- Add father_cnic column
ALTER TABLE students ADD COLUMN IF NOT EXISTS father_cnic TEXT;

-- Add mother_cnic column  
ALTER TABLE students ADD COLUMN IF NOT EXISTS mother_cnic TEXT;

-- Create index for faster CNIC lookups (used for sibling detection)
CREATE INDEX IF NOT EXISTS idx_students_father_cnic ON students(father_cnic) WHERE father_cnic IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_students_mother_cnic ON students(mother_cnic) WHERE mother_cnic IS NOT NULL;

-- Comment for documentation
COMMENT ON COLUMN students.father_cnic IS 'Father CNIC for sibling tracking and parent identification';
COMMENT ON COLUMN students.mother_cnic IS 'Mother CNIC for sibling tracking and parent identification';
