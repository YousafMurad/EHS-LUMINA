-- Create attendance table for tracking student attendance
-- Run this in Supabase SQL Editor

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  marked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one attendance record per student per day
  UNIQUE(student_id, date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_section_id ON attendance(section_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_section_date ON attendance(section_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);

-- Enable Row Level Security
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read attendance
CREATE POLICY "Allow authenticated users to read attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow teachers to insert/update attendance for their sections
CREATE POLICY "Allow teachers to insert attendance"
  ON attendance FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sections s
      INNER JOIN teachers t ON s.teacher_id = t.id
      WHERE s.id = attendance.section_id
        AND t.email = auth.jwt() ->> 'email'
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Allow teachers to update attendance"
  ON attendance FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sections s
      INNER JOIN teachers t ON s.teacher_id = t.id
      WHERE s.id = attendance.section_id
        AND t.email = auth.jwt() ->> 'email'
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Allow teachers to delete attendance"
  ON attendance FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sections s
      INNER JOIN teachers t ON s.teacher_id = t.id
      WHERE s.id = attendance.section_id
        AND t.email = auth.jwt() ->> 'email'
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'super_admin')
    )
  );

-- Trigger to update updated_at on row update
CREATE OR REPLACE FUNCTION update_attendance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_attendance_updated_at
  BEFORE UPDATE ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION update_attendance_updated_at();

-- Grant permissions
GRANT ALL ON attendance TO authenticated;
GRANT ALL ON attendance TO service_role;
