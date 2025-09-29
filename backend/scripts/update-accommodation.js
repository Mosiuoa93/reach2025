const { createClient } = require('@supabase/supabase-js');

// Use the same environment variables as the main app
const SUPABASE_URL = 'https://khogffdfjjigxgucsqlg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtob2dmZmRmamppZ3hndWNzcWxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjA5Mzc0OCwiZXhwIjoyMDY3NjY5NzQ4fQ.iijBfSCvBImjGZIutk_Pa-WdBo6OiTevdh5eRNgVB-8';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function updateAccommodationOptions() {
  try {
    console.log('🏨 Updating couple accommodation options...');
    
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
    
    console.log('📋 Please run this SQL in Supabase SQL Editor to update accommodation options:');
    console.log(`
-- Update couple_registrations table accommodation options
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
    `);
    
    console.log('\n🎯 After running the SQL:');
    console.log('✅ Couples will have "Couple Accommodation" as default option');
    console.log('✅ Form will show: Couple Accommodation, Dormitory (Shared), Day Pass Only');
    console.log('✅ Database will accept all three accommodation types');
    
    return true;
    
  } catch (err) {
    console.error('💥 Unexpected error:', err);
    return false;
  }
}

// Run the function
updateAccommodationOptions().then(success => {
  if (success) {
    console.log('\n🎉 ACCOMMODATION OPTIONS READY TO UPDATE!');
    console.log('📋 Copy the SQL above and run it in Supabase SQL Editor');
  } else {
    console.log('\n❌ Failed to access couple registrations table');
  }
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('💥 Script failed:', err);
  process.exit(1);
});
