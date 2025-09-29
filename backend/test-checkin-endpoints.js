require('dotenv').config();

async function testCheckinEndpoints() {
  try {
    console.log('🧪 Testing Check-in Endpoints...\n');
    
    // Test 1: Get all registrations for check-in
    console.log('1. Testing GET /api/checkin/registrations');
    const response = await fetch('http://localhost:3000/api/checkin/registrations');
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Check-in registrations endpoint working!');
      console.log(`   - Found ${result.data.length} total registrations`);
      console.log(`   - Individuals: ${result.stats.totalIndividuals}`);
      console.log(`   - Groups: ${result.stats.totalGroups}`);
      console.log(`   - Checked in: ${result.stats.checkedInIndividuals + result.stats.checkedInGroups}`);
      
      // Test 2: Try to check in the first individual (if any)
      const firstIndividual = result.data.find(reg => reg.type === 'individual' && !reg.checked_in);
      if (firstIndividual) {
        console.log('\n2. Testing individual check-in');
        console.log(`   Attempting to check in: ${firstIndividual.displayName}`);
        
        const checkinResponse = await fetch(`http://localhost:3000/api/checkin/individual/${firstIndividual.id}`, {
          method: 'POST'
        });
        const checkinResult = await checkinResponse.json();
        
        if (checkinResult.success) {
          console.log('✅ Individual check-in working!');
          console.log(`   Message: ${checkinResult.message}`);
          
          // Test 3: Undo the check-in
          console.log('\n3. Testing check-in undo');
          const undoResponse = await fetch(`http://localhost:3000/api/checkin/undo/individual/${firstIndividual.id}`, {
            method: 'POST'
          });
          const undoResult = await undoResponse.json();
          
          if (undoResult.success) {
            console.log('✅ Check-in undo working!');
            console.log(`   Message: ${undoResult.message}`);
          } else {
            console.log('❌ Check-in undo failed:', undoResult.error);
          }
        } else {
          console.log('❌ Individual check-in failed:', checkinResult.error);
        }
      } else {
        console.log('\n2. No unchecked individuals found for testing check-in');
      }
      
    } else {
      console.log('❌ Check-in registrations endpoint failed:', result.error);
    }
    
  } catch (error) {
    if (error.message.includes('column "checked_in" does not exist')) {
      console.log('❌ Database columns not added yet!');
      console.log('\n🔧 Please run these SQL commands in Supabase:');
      console.log('ALTER TABLE individual_registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE;');
      console.log('ALTER TABLE individual_registrations ADD COLUMN IF NOT EXISTS checkin_time TIMESTAMPTZ;');
      console.log('ALTER TABLE group_registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE;');
      console.log('ALTER TABLE group_registrations ADD COLUMN IF NOT EXISTS checkin_time TIMESTAMPTZ;');
    } else {
      console.error('❌ Test failed:', error.message);
    }
  }
}

testCheckinEndpoints();
