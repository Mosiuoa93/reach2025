const { createClient } = require('@supabase/supabase-js');

// Use the same environment variables as the main app
const SUPABASE_URL = 'https://khogffdfjjigxgucsqlg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtob2dmZmRmamppZ3hndWNzcWxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjA5Mzc0OCwiZXhwIjoyMDY3NjY5NzQ4fQ.iijBfSCvBImjGZIutk_Pa-WdBo6OiTevdh5eRNgVB-8';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function updateCouplesWithChildren() {
  try {
    console.log('👨‍👩‍👧‍👦 Adding children support to couple registrations...');
    
    // Test if we can access the table
    const { data: testData, error: testError } = await supabase
      .from('couple_registrations')
      .select('*')
      .limit(1);
      
    if (testError) {
      console.error('❌ Cannot access couple_registrations table:', testError);
      return false;
    }
    
    console.log('✅ Table accessible. Current records:', testData?.length || 0);
    
    console.log('📋 Please run this SQL in Supabase SQL Editor to add children support:');
    console.log(`
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
    `);
    
    console.log('\n🎯 After running the SQL:');
    console.log('✅ Couples can register with children information');
    console.log('✅ Dynamic pricing: Under 12 free, 12-18 half price, 18+ full price');
    console.log('✅ Children data stored as JSON for flexibility');
    console.log('✅ Statistics will include children counts');
    
    return true;
    
  } catch (err) {
    console.error('💥 Unexpected error:', err);
    return false;
  }
}

// Run the function
updateCouplesWithChildren().then(success => {
  if (success) {
    console.log('\n🎉 CHILDREN SUPPORT READY TO ADD!');
    console.log('📋 Copy the SQL above and run it in Supabase SQL Editor');
  } else {
    console.log('\n❌ Failed to access couple registrations table');
  }
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('💥 Script failed:', err);
  process.exit(1);
});
