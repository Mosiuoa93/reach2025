const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testCoupleTable() {
  try {
    console.log('🧪 Testing couple_registrations table...');
    
    // Try to select from the table
    const { data, error } = await supabase
      .from('couple_registrations')
      .select('*')
      .limit(1);
      
    if (error) {
      console.log('❌ Table does not exist yet. Error:', error.message);
      console.log('\n📝 Please create the table manually in Supabase SQL Editor with this SQL:');
      console.log(`
CREATE TABLE couple_registrations (
  id SERIAL PRIMARY KEY,
  partner1_name VARCHAR(255) NOT NULL,
  partner1_email VARCHAR(255) NOT NULL,
  partner1_phone VARCHAR(50) NOT NULL,
  partner1_gender VARCHAR(10) NOT NULL CHECK (partner1_gender IN ('Male', 'Female')),
  partner2_name VARCHAR(255) NOT NULL,
  partner2_email VARCHAR(255) NOT NULL,
  partner2_phone VARCHAR(50) NOT NULL,
  partner2_gender VARCHAR(10) NOT NULL CHECK (partner2_gender IN ('Male', 'Female')),
  church VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  accommodation VARCHAR(50) NOT NULL DEFAULT 'dorm' CHECK (accommodation IN ('dorm', 'daypass')),
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('eft', 'cash', 'card')),
  total DECIMAL(10,2) NOT NULL DEFAULT 2600.00,
  dietary_requirements TEXT,
  special_needs TEXT,
  checked_in BOOLEAN DEFAULT FALSE,
  checkin_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
      `);
    } else {
      console.log('✅ couple_registrations table exists and is accessible!');
      console.log(`📊 Found ${data?.length || 0} couple registrations`);
    }
    
  } catch (err) {
    console.error('💥 Error:', err);
  }
}

testCoupleTable();
