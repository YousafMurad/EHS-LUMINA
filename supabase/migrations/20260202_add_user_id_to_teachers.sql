-- Add user_id column to teachers table for auth link
-- This allows teachers to have login credentials

-- Add user_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'teachers' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE teachers ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
        
        -- Create index for faster lookups
        CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id);
    END IF;
END $$;

-- Comment for documentation
COMMENT ON COLUMN teachers.user_id IS 'Link to auth.users for teacher login credentials';
