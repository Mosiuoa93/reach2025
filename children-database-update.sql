-- REACH2026 Children Support Database Update
-- Copy and paste this entire script into Supabase SQL Editor and click "Run"

-- Add children column to store children data as JSON
ALTER TABLE couple_registrations 
ADD COLUMN IF NOT EXISTS children JSONB DEFAULT '[]'::jsonb;

-- Add children count for quick statistics
ALTER TABLE couple_registrations 
ADD COLUMN IF NOT EXISTS children_count INTEGER DEFAULT 0;

-- Add indexes for children data (improves query performance)
CREATE INDEX IF NOT EXISTS idx_couple_children_count ON couple_registrations(children_count);
CREATE INDEX IF NOT EXISTS idx_couple_children ON couple_registrations USING GIN (children);

-- Add helpful comments
COMMENT ON COLUMN couple_registrations.children IS 'Array of children objects with name, age, gender';
COMMENT ON COLUMN couple_registrations.children_count IS 'Number of children for quick statistics';

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'couple_registrations' 
AND column_name IN ('children', 'children_count')
ORDER BY column_name;

-- Show example of children data structure
SELECT 'Example children data structure:' as info;
SELECT '[
  {"name": "John Jr", "age": 8, "gender": "Male"},
  {"name": "Sarah", "age": 12, "gender": "Female"},
  {"name": "Michael", "age": 20, "gender": "Male"}
]'::jsonb as example_children_data;
