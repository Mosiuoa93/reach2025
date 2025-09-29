require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkIndividuals() {
  console.log('🔍 Checking Individual Registrations...\n');
  
  try {
    // Check if table exists and has data
    const { data, error, count } = await supabase
      .from('individual_registrations')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (error) {
      console.error('❌ Error accessing individual_registrations:', error);
      return;
    }
    
    console.log(`📊 Total Individual Registrations: ${count}`);
    
    if (data && data.length > 0) {
      console.log('\n📋 Sample Individual Registration:');
      console.log(JSON.stringify(data[0], null, 2));
      
      // Check if checked_in column exists
      const hasCheckedIn = data[0].hasOwnProperty('checked_in');
      const hasCheckinTime = data[0].hasOwnProperty('checkin_time');
      
      console.log(`\n✅ Has checked_in column: ${hasCheckedIn}`);
      console.log(`✅ Has checkin_time column: ${hasCheckinTime}`);
    } else {
      console.log('\n📝 No individual registrations found in database');
      
      // Let's also check the table structure
      console.log('\n🔍 Checking table structure...');
      const { data: tableInfo, error: tableError } = await supabase
        .from('individual_registrations')
        .select('*')
        .limit(0);
        
      if (tableError) {
        console.error('❌ Table structure error:', tableError);
      } else {
        console.log('✅ Table exists but is empty');
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkIndividuals();
