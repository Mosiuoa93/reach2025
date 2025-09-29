require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function addCheckinColumns() {
  try {
    console.log('Testing if check-in columns exist...');
    
    // Test if we can update with check-in columns
    const { data: testData } = await supabase
      .from('individual_registrations')
      .select('id')
      .limit(1);
    
    if (testData && testData[0]) {
      const { error } = await supabase
        .from('individual_registrations')
        .update({ checked_in: false })
        .eq('id', testData[0].id);
      
      if (error && error.message.includes('column "checked_in" does not exist')) {
        console.log('❌ Check-in columns do not exist.');
        console.log('\n🔧 Please add these columns manually in your Supabase SQL editor:');
        console.log('\n-- Add check-in columns to individual_registrations');
        console.log('ALTER TABLE individual_registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE;');
        console.log('ALTER TABLE individual_registrations ADD COLUMN IF NOT EXISTS checkin_time TIMESTAMPTZ;');
        console.log('\n-- Add check-in columns to group_registrations');
        console.log('ALTER TABLE group_registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE;');
        console.log('ALTER TABLE group_registrations ADD COLUMN IF NOT EXISTS checkin_time TIMESTAMPTZ;');
        console.log('\n🚀 After running these commands, restart the backend server!');
      } else if (error) {
        console.log('Other error:', error);
      } else {
        console.log('✅ Check-in columns already exist!');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

addCheckinColumns();
