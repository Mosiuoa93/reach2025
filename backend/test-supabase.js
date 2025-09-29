require('dotenv').config();
const supabase = require('./src/config/supabase');

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
  console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'Set' : 'Not set');
  
  try {
    // Test connection by fetching data from individual_registrations table
    const { data, error, count } = await supabase
      .from('individual_registrations')
      .select('*', { count: 'exact' })
      .limit(5);

    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return;
    }

    console.log('✅ Supabase connection successful!');
    console.log(`📊 Found ${count} individual registrations`);
    console.log('Sample data:', data);

    // Test groups table
    const { data: groupData, error: groupError, count: groupCount } = await supabase
      .from('group_registrations')
      .select('*', { count: 'exact' })
      .limit(5);

    if (groupError) {
      console.error('❌ Groups table error:', groupError.message);
    } else {
      console.log(`📊 Found ${groupCount} group registrations`);
      console.log('Sample group data:', groupData);
    }

  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
  }
}

testSupabaseConnection();
