require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function addCheckinColumns() {
  try {
    console.log('Adding check-in columns to database tables...');
    
    // Add columns to individual_registrations table
    console.log('Adding columns to individual_registrations...');
    const { error: individualError } = await supabase.rpc('add_checkin_columns_individual');
    
    if (individualError) {
      console.log('Individual columns may already exist or need manual addition');
      console.log('Individual error:', individualError);
    }
    
    // Add columns to group_registrations table
    console.log('Adding columns to group_registrations...');
    const { error: groupError } = await supabase.rpc('add_checkin_columns_group');
    
    if (groupError) {
      console.log('Group columns may already exist or need manual addition');
      console.log('Group error:', groupError);
    }
    
    // Test if columns were added by trying to update a record
    console.log('Testing column addition...');
    
    const { data: testIndividual } = await supabase
      .from('individual_registrations')
      .select('id')
      .limit(1);
    
    if (testIndividual && testIndividual[0]) {
      const { error: testError } = await supabase
        .from('individual_registrations')
        .update({ checked_in: false, checkin_time: null })
        .eq('id', testIndividual[0].id);
      
      if (testError) {
        console.log('Columns need to be added manually. Error:', testError.message);
        console.log('\nPlease run these SQL commands in your Supabase SQL editor:');
        console.log('\n-- Add check-in columns to individual_registrations');
        console.log('ALTER TABLE individual_registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE;');
        console.log('ALTER TABLE individual_registrations ADD COLUMN IF NOT EXISTS checkin_time TIMESTAMPTZ;');
        console.log('\n-- Add check-in columns to group_registrations');
        console.log('ALTER TABLE group_registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE;');
        console.log('ALTER TABLE group_registrations ADD COLUMN IF NOT EXISTS checkin_time TIMESTAMPTZ;');
      } else {
        console.log('✅ Check-in columns added successfully!');
      }
    }
    
  } catch (error) {
    console.error('Error adding check-in columns:', error);
    console.log('\nPlease run these SQL commands in your Supabase SQL editor:');
    console.log('\n-- Add check-in columns to individual_registrations');
    console.log('ALTER TABLE individual_registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE;');
    console.log('ALTER TABLE individual_registrations ADD COLUMN IF NOT EXISTS checkin_time TIMESTAMPTZ;');
    console.log('\n-- Add check-in columns to group_registrations');
    console.log('ALTER TABLE group_registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE;');
    console.log('ALTER TABLE group_registrations ADD COLUMN IF NOT EXISTS checkin_time TIMESTAMPTZ;');
  }
}

addCheckinColumns();
