-- Add photo_url column to teachers table
-- This allows storing teacher profile photos

-- Add photo_url column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'teachers' AND column_name = 'photo_url'
    ) THEN
        ALTER TABLE teachers ADD COLUMN photo_url TEXT;
    END IF;
END $$;

-- Comment for documentation
COMMENT ON COLUMN teachers.photo_url IS 'URL to teacher profile photo in storage';
