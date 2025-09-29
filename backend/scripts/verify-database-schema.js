const { createClient } = require('@supabase/supabase-js');

// Use the same environment variables as the main app
const SUPABASE_URL = 'https://khogffdfjjigxgucsqlg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtob2dmZmRmamppZ3hndWNzcWxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjA5Mzc0OCwiZXhwIjoyMDY3NjY5NzQ4fQ.iijBfSCvBImjGZIutk_Pa-WdBo6OiTevdh5eRNgVB-8';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyDatabaseSchema() {
  try {
    console.log('🔍 Verifying couple_registrations table schema...\n');
    
    // Get table schema
    const { data: columns, error } = await supabase
      .rpc('get_table_columns', { table_name: 'couple_registrations' })
      .single();
      
    if (error) {
      console.log('Using alternative method to check schema...');
      
      // Try to select from the table to see what columns exist
      const { data: sampleData, error: selectError } = await supabase
        .from('couple_registrations')
        .select('*')
        .limit(1);
        
      if (selectError) {
        console.error('❌ Error accessing table:', selectError);
        return false;
      }
      
      if (sampleData && sampleData.length > 0) {
        console.log('✅ Table accessible. Sample record columns:');
        console.log(Object.keys(sampleData[0]));
        
        // Check if children columns exist
        const hasChildren = 'children' in sampleData[0];
        const hasChildrenCount = 'children_count' in sampleData[0];
        
        console.log('\n📊 Children columns status:');
        console.log(`  children: ${hasChildren ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log(`  children_count: ${hasChildrenCount ? '✅ EXISTS' : '❌ MISSING'}`);
        
        if (!hasChildren || !hasChildrenCount) {
          console.log('\n⚠️  ISSUE FOUND: Children columns are missing!');
          console.log('🔧 Please run this SQL in Supabase:');
          console.log(`
ALTER TABLE couple_registrations 
ADD COLUMN IF NOT EXISTS children JSONB DEFAULT '[]'::jsonb;

ALTER TABLE couple_registrations 
ADD COLUMN IF NOT EXISTS children_count INTEGER DEFAULT 0;
          `);
          return false;
        } else {
          console.log('\n✅ All children columns exist!');
          return true;
        }
      } else {
        console.log('⚠️  No records in table to check schema');
        return false;
      }
    }
    
  } catch (err) {
    console.error('💥 Error verifying schema:', err);
    return false;
  }
}

// Test inserting a record with children
async function testChildrenInsert() {
  try {
    console.log('\n🧪 Testing children data insert...');
    
    const testData = {
      partner1_name: 'Schema Test 1',
      partner1_email: 'schema1@test.com',
      partner1_phone: '+27111111111',
      partner1_gender: 'Male',
      partner2_name: 'Schema Test 2',
      partner2_email: 'schema2@test.com',
      partner2_phone: '+27222222222',
      partner2_gender: 'Female',
      church: 'Test Church',
      country: 'Test Country',
      accommodation: 'couple',
      payment_method: 'eft',
      total: 3900,
      children: JSON.stringify([
        { name: 'Test Child', age: 15, gender: 'Male' }
      ]),
      children_count: 1,
      checked_in: false,
      checkin_time: null
    };
    
    const { data, error } = await supabase
      .from('couple_registrations')
      .insert(testData)
      .select();
      
    if (error) {
      console.error('❌ Insert failed:', error);
      return false;
    }
    
    console.log('✅ Test insert successful!');
    console.log('📊 Inserted data:', data[0]);
    
    // Clean up test data
    await supabase
      .from('couple_registrations')
      .delete()
      .eq('partner1_email', 'schema1@test.com');
      
    console.log('🧹 Test data cleaned up');
    return true;
    
  } catch (err) {
    console.error('💥 Test insert failed:', err);
    return false;
  }
}

// Run verification
verifyDatabaseSchema().then(async (schemaOk) => {
  if (schemaOk) {
    const insertOk = await testChildrenInsert();
    if (insertOk) {
      console.log('\n🎉 DATABASE SCHEMA VERIFICATION COMPLETE!');
      console.log('✅ Children columns exist and working properly');
      console.log('🚀 Backend should work correctly now');
    }
  } else {
    console.log('\n❌ Database schema issues found');
    console.log('🔧 Fix the schema issues above and try again');
  }
}).catch(err => {
  console.error('💥 Verification failed:', err);
});
