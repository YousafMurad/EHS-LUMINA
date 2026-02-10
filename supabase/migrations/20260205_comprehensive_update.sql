-- =====================================================
-- EHS ERP - Comprehensive Update Migration
-- Date: 2026-02-05
-- Features:
--   1. Teacher-Class Assignments for Attendance
--   2. Full/Half Day Attendance Status
--   3. Parent Authentication System
--   4. Results/Exam Management System
--   5. Suggestions & Complaints System
--   6. Subjects Table for Results
-- =====================================================

-- =====================================================
-- 1. SUBJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert common subjects
INSERT INTO public.subjects (name, code) VALUES 
    ('English', 'ENG'),
    ('Urdu', 'URD'),
    ('Mathematics', 'MATH'),
    ('Science', 'SCI'),
    ('Social Studies', 'SST'),
    ('Islamiat', 'ISL'),
    ('Computer Science', 'CS'),
    ('Physics', 'PHY'),
    ('Chemistry', 'CHEM'),
    ('Biology', 'BIO'),
    ('Pakistan Studies', 'PST'),
    ('General Knowledge', 'GK'),
    ('Drawing/Art', 'ART')
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 2. TEACHER-CLASS ASSIGNMENTS (for attendance marking)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.teacher_class_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    is_class_teacher BOOLEAN NOT NULL DEFAULT false,
    can_mark_attendance BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(teacher_id, class_id, section_id, subject_id)
);

-- =====================================================
-- 3. UPDATE ATTENDANCE TABLE - Add full_day/half_day status
-- =====================================================
DO $$
BEGIN
    -- Add attendance_type column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'attendance' AND column_name = 'attendance_type'
    ) THEN
        ALTER TABLE public.attendance 
        ADD COLUMN attendance_type TEXT NOT NULL DEFAULT 'full_day' 
        CHECK (attendance_type IN ('full_day', 'half_day', 'absent'));
    END IF;
    
    -- Add left_early column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'attendance' AND column_name = 'left_early'
    ) THEN
        ALTER TABLE public.attendance ADD COLUMN left_early BOOLEAN DEFAULT false;
    END IF;
    
    -- Add left_at time column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'attendance' AND column_name = 'left_at'
    ) THEN
        ALTER TABLE public.attendance ADD COLUMN left_at TIME;
    END IF;
END $$;

-- =====================================================
-- 4. PARENT ACCOUNTS TABLE (linked to students)
-- =====================================================
-- Add parent role to profiles check constraint
DO $$
BEGIN
    -- Check if constraint exists and modify
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_role_check' AND table_name = 'profiles'
    ) THEN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;
    END IF;
    
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('super_admin', 'admin', 'operator', 'teacher', 'accountant', 'parent'));
END $$;

-- Parent-Student Link Table
CREATE TABLE IF NOT EXISTS public.parent_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    relationship TEXT NOT NULL DEFAULT 'parent' CHECK (relationship IN ('father', 'mother', 'guardian', 'parent')),
    is_primary BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(parent_id, student_id)
);

-- Add parent_phone and parent_email to students for creating parent accounts
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'students' AND column_name = 'parent_phone'
    ) THEN
        ALTER TABLE public.students ADD COLUMN parent_phone TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'students' AND column_name = 'parent_email'
    ) THEN
        ALTER TABLE public.students ADD COLUMN parent_email TEXT;
    END IF;
END $$;

-- =====================================================
-- 5. EXAM TYPES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.exam_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    weightage DECIMAL(5,2) DEFAULT 100.00, -- Percentage weightage
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert common exam types
INSERT INTO public.exam_types (name, code, weightage) VALUES 
    ('First Term', 'TERM1', 25.00),
    ('Mid Term', 'MID', 25.00),
    ('Second Term', 'TERM2', 25.00),
    ('Final', 'FINAL', 25.00),
    ('Class Test', 'TEST', 10.00),
    ('Assignment', 'ASSIGN', 5.00),
    ('Practical', 'PRAC', 15.00)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 6. RESULT SUBMISSION DEADLINES (Operator controlled)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.result_deadlines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    exam_type_id UUID NOT NULL REFERENCES public.exam_types(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE, -- NULL means all classes
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE, -- NULL means all subjects
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_open BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(session_id, exam_type_id, class_id, subject_id)
);

-- =====================================================
-- 7. STUDENT RESULTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.student_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    exam_type_id UUID NOT NULL REFERENCES public.exam_types(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    total_marks DECIMAL(6,2) NOT NULL,
    obtained_marks DECIMAL(6,2) NOT NULL,
    grade TEXT,
    remarks TEXT,
    is_absent BOOLEAN DEFAULT false,
    submitted_by UUID REFERENCES public.profiles(id),
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMPTZ,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT valid_marks CHECK (obtained_marks <= total_marks AND obtained_marks >= 0),
    UNIQUE(student_id, session_id, exam_type_id, subject_id)
);

-- =====================================================
-- 8. SUGGESTIONS & COMPLAINTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.suggestions_complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('suggestion', 'complaint', 'feedback', 'inquiry')),
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    response TEXT,
    responded_by UUID REFERENCES public.profiles(id),
    responded_at TIMESTAMPTZ,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 9. CLASS SUBJECTS (which subjects are taught in which class)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.class_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(class_id, subject_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_teacher_class_assignments_teacher ON public.teacher_class_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_class_assignments_class ON public.teacher_class_assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_teacher_class_assignments_section ON public.teacher_class_assignments(section_id);
CREATE INDEX IF NOT EXISTS idx_parent_students_parent ON public.parent_students(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_students_student ON public.parent_students(student_id);
CREATE INDEX IF NOT EXISTS idx_student_results_student ON public.student_results(student_id);
CREATE INDEX IF NOT EXISTS idx_student_results_session ON public.student_results(session_id);
CREATE INDEX IF NOT EXISTS idx_student_results_exam ON public.student_results(exam_type_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_parent ON public.suggestions_complaints(parent_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON public.suggestions_complaints(status);
CREATE INDEX IF NOT EXISTS idx_result_deadlines_session ON public.result_deadlines(session_id);

-- =====================================================
-- RLS POLICIES
-- =====================================================
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_class_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.result_deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_subjects ENABLE ROW LEVEL SECURITY;

-- Subjects - viewable by all authenticated
CREATE POLICY "Subjects viewable by authenticated users" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Subjects manageable by admin" ON public.subjects FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));

-- Teacher Assignments - teachers see their own, admins see all
CREATE POLICY "Teacher assignments viewable by admins" ON public.teacher_class_assignments FOR SELECT TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operator')));
CREATE POLICY "Teacher sees own assignments" ON public.teacher_class_assignments FOR SELECT TO authenticated 
    USING (teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid()));
CREATE POLICY "Admins manage teacher assignments" ON public.teacher_class_assignments FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operator')));

-- Parent Students - parents see their own children
CREATE POLICY "Parents see own children" ON public.parent_students FOR SELECT TO authenticated 
    USING (parent_id = auth.uid());
CREATE POLICY "Admins manage parent students" ON public.parent_students FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operator')));

-- Exam Types - viewable by all authenticated
CREATE POLICY "Exam types viewable by authenticated" ON public.exam_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Exam types manageable by admin" ON public.exam_types FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));

-- Result Deadlines - viewable by teachers and admins
CREATE POLICY "Result deadlines viewable" ON public.result_deadlines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Result deadlines manageable by operators" ON public.result_deadlines FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operator')));

-- Student Results - complex policies
CREATE POLICY "Results viewable by admins and operators" ON public.student_results FOR SELECT TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operator', 'accountant')));
CREATE POLICY "Teachers see results for their assigned classes" ON public.student_results FOR SELECT TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM public.teachers t
        JOIN public.teacher_class_assignments tca ON t.id = tca.teacher_id
        WHERE t.user_id = auth.uid() 
        AND tca.class_id = student_results.class_id
        AND (tca.section_id IS NULL OR tca.section_id = student_results.section_id)
    ));
CREATE POLICY "Parents see own children results" ON public.student_results FOR SELECT TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.parent_students WHERE parent_id = auth.uid() AND student_id = student_results.student_id));
CREATE POLICY "Teachers can insert/update results for assigned classes" ON public.student_results FOR INSERT TO authenticated 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.teachers t
        JOIN public.teacher_class_assignments tca ON t.id = tca.teacher_id
        WHERE t.user_id = auth.uid() 
        AND tca.class_id = student_results.class_id
        AND (tca.section_id IS NULL OR tca.section_id = student_results.section_id)
        AND NOT student_results.is_locked
    ));
CREATE POLICY "Admins manage all results" ON public.student_results FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operator')));

-- Suggestions & Complaints - parents see their own
CREATE POLICY "Parents see own suggestions" ON public.suggestions_complaints FOR SELECT TO authenticated 
    USING (parent_id = auth.uid());
CREATE POLICY "Parents create suggestions" ON public.suggestions_complaints FOR INSERT TO authenticated 
    WITH CHECK (parent_id = auth.uid());
CREATE POLICY "Admins manage suggestions" ON public.suggestions_complaints FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operator')));

-- Class Subjects - viewable by all authenticated
CREATE POLICY "Class subjects viewable" ON public.class_subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Class subjects manageable by admin" ON public.class_subjects FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));

-- =====================================================
-- UPDATE TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_teacher_class_assignments_updated_at ON public.teacher_class_assignments;
CREATE TRIGGER update_teacher_class_assignments_updated_at
    BEFORE UPDATE ON public.teacher_class_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_result_deadlines_updated_at ON public.result_deadlines;
CREATE TRIGGER update_result_deadlines_updated_at
    BEFORE UPDATE ON public.result_deadlines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_student_results_updated_at ON public.student_results;
CREATE TRIGGER update_student_results_updated_at
    BEFORE UPDATE ON public.student_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_suggestions_complaints_updated_at ON public.suggestions_complaints;
CREATE TRIGGER update_suggestions_complaints_updated_at
    BEFORE UPDATE ON public.suggestions_complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
