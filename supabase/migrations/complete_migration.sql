-- Comprehensive SQL Migration for EHS ERP Attendance System
-- Run this in your Supabase SQL Editor

-- ============================================
-- PART 1: Teacher Class Assignments Table
-- ============================================

-- Create subjects table if not exists
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create teacher_class_assignments table if not exists
CREATE TABLE IF NOT EXISTS teacher_class_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    is_class_teacher BOOLEAN DEFAULT false,
    can_mark_attendance BOOLEAN DEFAULT true,
    schedule_days TEXT[], -- e.g., ['Monday', 'Wednesday', 'Friday']
    schedule_time_start TIME,
    schedule_time_end TIME,
    is_active BOOLEAN DEFAULT true,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint: one teacher per class-section-subject combo
    UNIQUE(teacher_id, class_id, section_id, subject_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tca_teacher ON teacher_class_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_tca_class ON teacher_class_assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_tca_section ON teacher_class_assignments(section_id);
CREATE INDEX IF NOT EXISTS idx_tca_active ON teacher_class_assignments(is_active);

-- ============================================
-- PART 2: Attendance Table Updates
-- ============================================

-- Add remarks column to attendance table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'attendance' AND column_name = 'remarks'
    ) THEN
        ALTER TABLE attendance ADD COLUMN remarks TEXT;
    END IF;
END $$;

-- Update status column to allow half_day
-- First check if it's an enum or text
DO $$
DECLARE
    col_type TEXT;
BEGIN
    SELECT data_type INTO col_type
    FROM information_schema.columns 
    WHERE table_name = 'attendance' AND column_name = 'status';
    
    IF col_type = 'USER-DEFINED' THEN
        -- It's an enum, try to add the value
        BEGIN
            ALTER TYPE attendance_status ADD VALUE IF NOT EXISTS 'half_day';
        EXCEPTION WHEN others THEN
            -- Enum might not exist or value already exists
            NULL;
        END;
    ELSIF col_type = 'text' OR col_type = 'character varying' THEN
        -- It's text, update any check constraint
        ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_status_check;
        ALTER TABLE attendance ADD CONSTRAINT attendance_status_check 
            CHECK (status IN ('present', 'absent', 'late', 'excused', 'half_day'));
    END IF;
END $$;

-- ============================================
-- PART 3: RLS Policies for teacher_class_assignments
-- ============================================

-- Enable RLS
ALTER TABLE teacher_class_assignments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin and operators can manage assignments" ON teacher_class_assignments;
DROP POLICY IF EXISTS "Teachers can view their own assignments" ON teacher_class_assignments;

-- Policy: Admin/Super Admin/Operator can manage all assignments
CREATE POLICY "Admin and operators can manage assignments"
ON teacher_class_assignments
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('super_admin', 'admin', 'operator')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('super_admin', 'admin', 'operator')
    )
);

-- Policy: Teachers can view their own assignments
CREATE POLICY "Teachers can view their own assignments"
ON teacher_class_assignments
FOR SELECT
TO authenticated
USING (
    teacher_id IN (
        SELECT t.id FROM teachers t
        WHERE t.user_id = auth.uid() OR t.email = (
            SELECT email FROM profiles WHERE id = auth.uid()
        )
    )
);

-- ============================================
-- PART 4: RLS Policies for subjects table
-- ============================================

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view subjects" ON subjects;
DROP POLICY IF EXISTS "Admin can manage subjects" ON subjects;

CREATE POLICY "Anyone can view subjects"
ON subjects FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin can manage subjects"
ON subjects FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('super_admin', 'admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('super_admin', 'admin')
    )
);

-- ============================================
-- PART 5: Create parent_students table if not exists
-- ============================================

CREATE TABLE IF NOT EXISTS parent_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    relationship VARCHAR(50) DEFAULT 'parent',
    is_primary BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(parent_id, student_id)
);

-- Enable RLS
ALTER TABLE parent_students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents can view their own links" ON parent_students;
DROP POLICY IF EXISTS "Admin can manage parent links" ON parent_students;

CREATE POLICY "Parents can view their own links"
ON parent_students FOR SELECT
TO authenticated
USING (parent_id = auth.uid());

CREATE POLICY "Admin can manage parent links"
ON parent_students FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('super_admin', 'admin', 'operator')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('super_admin', 'admin', 'operator')
    )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_parent_students_parent ON parent_students(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_students_student ON parent_students(student_id);

-- ============================================
-- PART 6: Verify Setup
-- ============================================

-- Show created tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('teacher_class_assignments', 'subjects', 'parent_students', 'attendance');

-- Show attendance columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'attendance';

SELECT 'Migration completed successfully!' as status;
