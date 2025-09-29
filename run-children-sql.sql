-- Add children support to couple_registrations table
-- Run this in Supabase SQL Editor

-- Add children column to store children data as JSON
ALTER TABLE couple_registrations 
ADD COLUMN IF NOT EXISTS children JSONB DEFAULT '[]'::jsonb;

-- Add children count for quick statistics
ALTER TABLE couple_registrations 
ADD COLUMN IF NOT EXISTS children_count INTEGER DEFAULT 0;

-- Add indexes for children data
CREATE INDEX IF NOT EXISTS idx_couple_children_count ON couple_registrations(children_count);
CREATE INDEX IF NOT EXISTS idx_couple_children ON couple_registrations USING GIN (children);

-- Add comments
COMMENT ON COLUMN couple_registrations.children IS 'Array of children objects with name, age, gender';
COMMENT ON COLUMN couple_registrations.children_count IS 'Number of children for quick statistics';

-- Example children data structure:
-- [
--   {"name": "John Jr", "age": 8, "gender": "Male"},
--   {"name": "Sarah", "age": 12, "gender": "Female"}
-- ]
