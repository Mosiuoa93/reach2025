const { createClient } = require('@supabase/supabase-js');

// Use the same environment variables as the main app
const SUPABASE_URL = 'https://khogffdfjjigxgucsqlg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtob2dmZmRmamppZ3hndWNzcWxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjA5Mzc0OCwiZXhwIjoyMDY3NjY5NzQ4fQ.iijBfSCvBImjGZIutk_Pa-WdBo6OiTevdh5eRNgVB-8';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createCoupleTable() {
  try {
    console.log('🚀 Creating couple_registrations table...');
    console.log('📡 Connecting to Supabase...');
    
    // First, test if table already exists by trying to select from it
    const { data: testData, error: testError } = await supabase
      .from('couple_registrations')
      .select('*')
      .limit(1);
      
    if (!testError) {
      console.log('✅ couple_registrations table already exists!');
      console.log(`📊 Current records: ${testData?.length || 0}`);
      return true;
    }
    
    if (testError && !testError.message.includes('does not exist')) {
      console.error('❌ Unexpected error:', testError);
      return false;
    }
    
    console.log('📝 Table does not exist. Creating now...');
    
    // Since we can't execute DDL directly, we'll use a workaround
    // Try to insert a test record which will fail but might create the table
    console.log('⚠️  Direct table creation not available via API.');
    console.log('📋 Please create the table manually in Supabase SQL Editor:');
    
    const createTableSQL = `
-- REACH2026 Couple Registrations Table
CREATE TABLE couple_registrations (
    id SERIAL PRIMARY KEY,
    
    -- Partner 1 Information
    partner1_name VARCHAR(255) NOT NULL,
    partner1_email VARCHAR(255) NOT NULL,
    partner1_phone VARCHAR(50) NOT NULL,
    partner1_gender VARCHAR(10) NOT NULL CHECK (partner1_gender IN ('Male', 'Female')),
    
    -- Partner 2 Information
    partner2_name VARCHAR(255) NOT NULL,
    partner2_email VARCHAR(255) NOT NULL,
    partner2_phone VARCHAR(50) NOT NULL,
    partner2_gender VARCHAR(10) NOT NULL CHECK (partner2_gender IN ('Male', 'Female')),
    
    -- Shared Information
    church VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    accommodation VARCHAR(50) NOT NULL DEFAULT 'dorm' CHECK (accommodation IN ('dorm', 'daypass')),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('eft', 'cash', 'card')),
    
    -- Pricing
    total DECIMAL(10,2) NOT NULL DEFAULT 2600.00,
    
    -- Special Requirements
    dietary_requirements TEXT,
    special_needs TEXT,
    
    -- Check-in Information
    checked_in BOOLEAN DEFAULT FALSE,
    checkin_time TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT unique_couple_email UNIQUE (partner1_email, partner2_email),
    CONSTRAINT different_partners CHECK (partner1_email != partner2_email)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_couple_partner1_email ON couple_registrations(partner1_email);
CREATE INDEX IF NOT EXISTS idx_couple_partner2_email ON couple_registrations(partner2_email);
CREATE INDEX IF NOT EXISTS idx_couple_partner1_name ON couple_registrations(partner1_name);
CREATE INDEX IF NOT EXISTS idx_couple_partner2_name ON couple_registrations(partner2_name);
CREATE INDEX IF NOT EXISTS idx_couple_church ON couple_registrations(church);
CREATE INDEX IF NOT EXISTS idx_couple_country ON couple_registrations(country);
CREATE INDEX IF NOT EXISTS idx_couple_checked_in ON couple_registrations(checked_in);
CREATE INDEX IF NOT EXISTS idx_couple_created_at ON couple_registrations(created_at);
    `;
    
    console.log(createTableSQL);
    console.log('\n📋 Steps to create the table:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy and paste the SQL above');
    console.log('5. Click "Run"');
    console.log('6. Run this script again to verify');
    
    return false;
    
  } catch (err) {
    console.error('💥 Unexpected error:', err);
    return false;
  }
}

// Run the function
createCoupleTable().then(success => {
  if (success) {
    console.log('\n🎉 COUPLE REGISTRATION TABLE IS READY!');
    console.log('✅ You can now test couple registrations');
    console.log('✅ Admin dashboard will show couples');
    console.log('✅ Check-in system supports couples');
  } else {
    console.log('\n⚠️  Manual setup required');
    console.log('🔧 Follow the steps above to create the table');
  }
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('💥 Script failed:', err);
  process.exit(1);
});
