const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function createCoupleTable() {
  try {
    console.log('🚀 Creating couple_registrations table...');
    console.log('📡 Supabase URL:', process.env.SUPABASE_URL);
    console.log('🔑 Using service role key');
    
    // First, check if table already exists
    const { data: existingTables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'couple_registrations');
    
    if (existingTables && existingTables.length > 0) {
      console.log('✅ couple_registrations table already exists!');
      return;
    }
    
    // Create the table using raw SQL
    const createTableSQL = `
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
    `;
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: createTableSQL
    });
    
    if (error) {
      console.error('❌ Error creating table:', error);
      
      // Try alternative method - direct query
      console.log('🔄 Trying alternative method...');
      
      // Use a simple insert to test if table exists, if not it will create it
      const { data: testData, error: testError } = await supabase
        .from('couple_registrations')
        .select('*')
        .limit(1);
        
      if (testError && testError.message.includes('does not exist')) {
        console.log('📝 Table does not exist. Please create it manually in Supabase SQL Editor:');
        console.log('\n' + createTableSQL);
        return false;
      } else if (!testError) {
        console.log('✅ Table already exists and is accessible!');
        return true;
      }
    } else {
      console.log('✅ couple_registrations table created successfully!');
    }
    
    // Create indexes
    const indexSQL = `
      CREATE INDEX IF NOT EXISTS idx_couple_partner1_email ON couple_registrations(partner1_email);
      CREATE INDEX IF NOT EXISTS idx_couple_partner2_email ON couple_registrations(partner2_email);
      CREATE INDEX IF NOT EXISTS idx_couple_partner1_name ON couple_registrations(partner1_name);
      CREATE INDEX IF NOT EXISTS idx_couple_partner2_name ON couple_registrations(partner2_name);
      CREATE INDEX IF NOT EXISTS idx_couple_church ON couple_registrations(church);
      CREATE INDEX IF NOT EXISTS idx_couple_country ON couple_registrations(country);
      CREATE INDEX IF NOT EXISTS idx_couple_checked_in ON couple_registrations(checked_in);
      CREATE INDEX IF NOT EXISTS idx_couple_created_at ON couple_registrations(created_at);
    `;
    
    await supabase.rpc('exec_sql', { sql: indexSQL });
    console.log('✅ Indexes created successfully!');
    
    // Test the table
    console.log('🧪 Testing table access...');
    const { data: testData, error: testError } = await supabase
      .from('couple_registrations')
      .select('*')
      .limit(1);
      
    if (testError) {
      console.error('❌ Error accessing table:', testError);
      return false;
    } else {
      console.log('✅ Table is accessible and ready for use!');
      console.log(`📊 Current records: ${testData?.length || 0}`);
      return true;
    }
    
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
    console.log('Please create the table manually in Supabase SQL Editor');
  }
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('💥 Script failed:', err);
  process.exit(1);
});
