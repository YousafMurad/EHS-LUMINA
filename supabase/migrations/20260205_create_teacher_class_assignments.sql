-- Create subjects table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on subjects
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Subjects can be viewed by all authenticated users
CREATE POLICY IF NOT EXISTS "Authenticated users can view subjects"
  ON public.subjects FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only admins can manage subjects
CREATE POLICY IF NOT EXISTS "Admins can manage subjects"
  ON public.subjects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

GRANT ALL ON public.subjects TO authenticated;
GRANT ALL ON public.subjects TO service_role;

-- Create teacher_class_assignments table
-- This table manages the relationship between teachers and classes/sections/subjects

CREATE TABLE IF NOT EXISTS public.teacher_class_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  is_class_teacher BOOLEAN NOT NULL DEFAULT false,
  can_mark_attendance BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_teacher_class_assignments_teacher_id 
  ON public.teacher_class_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_class_assignments_class_id 
  ON public.teacher_class_assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_teacher_class_assignments_section_id 
  ON public.teacher_class_assignments(section_id);

-- Create unique constraint to prevent duplicate assignments
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_teacher_assignment 
  ON public.teacher_class_assignments(teacher_id, class_id, COALESCE(section_id, '00000000-0000-0000-0000-000000000000'), COALESCE(subject_id, '00000000-0000-0000-0000-000000000000'));

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_teacher_class_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_teacher_class_assignments_updated_at ON public.teacher_class_assignments;
CREATE TRIGGER trigger_update_teacher_class_assignments_updated_at
  BEFORE UPDATE ON public.teacher_class_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_teacher_class_assignments_updated_at();

-- Enable RLS
ALTER TABLE public.teacher_class_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow admins and operators to manage assignments
CREATE POLICY "Admins and operators can manage teacher assignments"
  ON public.teacher_class_assignments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'operator')
    )
  );

-- Allow teachers to view their own assignments
CREATE POLICY "Teachers can view their own assignments"
  ON public.teacher_class_assignments
  FOR SELECT
  USING (
    teacher_id IN (
      SELECT t.id FROM public.teachers t
      WHERE t.user_id = auth.uid() OR t.email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

-- Grant permissions
GRANT ALL ON public.teacher_class_assignments TO authenticated;
GRANT ALL ON public.teacher_class_assignments TO service_role;

-- Comment on table
COMMENT ON TABLE public.teacher_class_assignments IS 'Manages teacher assignments to classes, sections, and subjects';
