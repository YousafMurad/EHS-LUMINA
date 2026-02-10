-- Minimal SQL Migration for EHS ERP
-- Run this in your Supabase SQL Editor

-- ============================================
-- PART 1: Fix profiles role constraint
-- ============================================

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('super_admin', 'admin', 'accountant', 'teacher', 'operator', 'student', 'parent'));

-- ============================================
-- PART 2: Create subjects table
-- ============================================

CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PART 3: Create teacher_class_assignments table
-- ============================================

CREATE TABLE IF NOT EXISTS teacher_class_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    is_class_teacher BOOLEAN DEFAULT false,
    can_mark_attendance BOOLEAN DEFAULT true,
    schedule_days TEXT[],
    schedule_time_start TIME,
    schedule_time_end TIME,
    is_active BOOLEAN DEFAULT true,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(teacher_id, class_id, section_id, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_tca_teacher ON teacher_class_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_tca_section ON teacher_class_assignments(section_id);

-- ============================================
-- PART 4: Create parent_students table
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

CREATE INDEX IF NOT EXISTS idx_parent_students_parent ON parent_students(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_students_student ON parent_students(student_id);

-- ============================================
-- PART 5: Create attendance table
-- ============================================

CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused', 'half_day')),
    remarks TEXT,
    marked_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, section_id, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

-- ============================================
-- PART 6: Simple RLS Policies (no user_id references)
-- ============================================

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_class_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Subjects - everyone can view, admin can manage
CREATE POLICY "subjects_select" ON subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "subjects_all" ON subjects FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));

-- Teacher assignments - admin/operator manage, teachers view own
CREATE POLICY "tca_admin" ON teacher_class_assignments FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operator')));

CREATE POLICY "tca_teacher_view" ON teacher_class_assignments FOR SELECT TO authenticated
USING (teacher_id IN (SELECT id FROM teachers WHERE email = (SELECT email FROM profiles WHERE id = auth.uid())));

-- Parent students - admin manage, parents view own
CREATE POLICY "ps_admin" ON parent_students FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operator')));

CREATE POLICY "ps_parent_view" ON parent_students FOR SELECT TO authenticated
USING (parent_id = auth.uid());

-- Attendance - staff can manage, parents can view their children
CREATE POLICY "att_staff" ON attendance FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'teacher', 'operator')));

CREATE POLICY "att_parent_view" ON attendance FOR SELECT TO authenticated
USING (student_id IN (SELECT student_id FROM parent_students WHERE parent_id = auth.uid()));

-- ============================================
-- DONE!
-- ============================================

SELECT 'Migration completed successfully!' as status;
