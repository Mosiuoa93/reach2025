-- Update couple_registrations table to include 'couple' accommodation option
-- Run this in Supabase SQL Editor

-- Drop the existing constraint
ALTER TABLE couple_registrations DROP CONSTRAINT IF EXISTS couple_registrations_accommodation_check;

-- Add new constraint with 'couple' option
ALTER TABLE couple_registrations 
ADD CONSTRAINT couple_registrations_accommodation_check 
CHECK (accommodation IN ('couple', 'dorm', 'daypass'));

-- Update the default value to 'couple'
ALTER TABLE couple_registrations 
ALTER COLUMN accommodation SET DEFAULT 'couple';

-- Verify the changes
SELECT column_name, column_default, check_clause 
FROM information_schema.columns c
LEFT JOIN information_schema.check_constraints cc ON cc.constraint_name LIKE '%accommodation%'
WHERE c.table_name = 'couple_registrations' 
AND c.column_name = 'accommodation';
