require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function addColumns() {
  try {
    console.log('🔧 Adding check-in columns to database...\n');
    
    // Try to add columns using raw SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Add check-in columns to individual_registrations
        ALTER TABLE individual_registrations 
        ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS checkin_time TIMESTAMPTZ;
        
        -- Add check-in columns to group_registrations
        ALTER TABLE group_registrations 
        ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS checkin_time TIMESTAMPTZ;
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_individual_checked_in ON individual_registrations(checked_in);
        CREATE INDEX IF NOT EXISTS idx_group_checked_in ON group_registrations(checked_in);
      `
    });
    
    if (error) {
      console.log('❌ Direct SQL execution not available.');
      console.log('🔧 Please manually add these columns in Supabase SQL editor:\n');
      console.log('-- Add to individual_registrations table:');
      console.log('ALTER TABLE individual_registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE;');
      console.log('ALTER TABLE individual_registrations ADD COLUMN IF NOT EXISTS checkin_time TIMESTAMPTZ;\n');
      console.log('-- Add to group_registrations table:');
      console.log('ALTER TABLE group_registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE;');
      console.log('ALTER TABLE group_registrations ADD COLUMN IF NOT EXISTS checkin_time TIMESTAMPTZ;\n');
      console.log('-- Add indexes:');
      console.log('CREATE INDEX IF NOT EXISTS idx_individual_checked_in ON individual_registrations(checked_in);');
      console.log('CREATE INDEX IF NOT EXISTS idx_group_checked_in ON group_registrations(checked_in);');
    } else {
      console.log('✅ Columns added successfully!');
    }
    
  } catch (error) {
    console.log('❌ Error adding columns:', error.message);
    console.log('\n🔧 Please manually run these SQL commands in Supabase:');
    console.log('\n-- Individual registrations table:');
    console.log('ALTER TABLE individual_registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE;');
    console.log('ALTER TABLE individual_registrations ADD COLUMN IF NOT EXISTS checkin_time TIMESTAMPTZ;');
    console.log('\n-- Group registrations table:');
    console.log('ALTER TABLE group_registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE;');
    console.log('ALTER TABLE group_registrations ADD COLUMN IF NOT EXISTS checkin_time TIMESTAMPTZ;');
  }
  
  process.exit(0);
}

addColumns();
