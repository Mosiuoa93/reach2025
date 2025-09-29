require('dotenv').config();

async function testGroupCheckin() {
  try {
    console.log('🧪 Testing Group Check-in...\n');
    
    // Get all registrations
    const response = await fetch('http://localhost:3000/api/checkin/registrations');
    const result = await response.json();
    
    if (result.success && result.data.length > 0) {
      // Find first unchecked group
      const firstGroup = result.data.find(reg => reg.type === 'group' && !reg.checked_in);
      
      if (firstGroup) {
        console.log(`Testing check-in for group: ${firstGroup.displayName}`);
        
        // Check in the group
        const checkinResponse = await fetch(`http://localhost:3000/api/checkin/group/${firstGroup.id}`, {
          method: 'POST'
        });
        const checkinResult = await checkinResponse.json();
        
        if (checkinResult.success) {
          console.log('✅ Group check-in successful!');
          console.log(`   Message: ${checkinResult.message}`);
          console.log(`   Checked in at: ${checkinResult.data.checkin_time}`);
          
          // Test undo
          console.log('\n🔄 Testing undo check-in...');
          const undoResponse = await fetch(`http://localhost:3000/api/checkin/undo/group/${firstGroup.id}`, {
            method: 'POST'
          });
          const undoResult = await undoResponse.json();
          
          if (undoResult.success) {
            console.log('✅ Undo check-in successful!');
            console.log(`   Message: ${undoResult.message}`);
          } else {
            console.log('❌ Undo failed:', undoResult.error);
          }
        } else {
          console.log('❌ Group check-in failed:', checkinResult.error);
        }
      } else {
        console.log('No unchecked groups found for testing');
      }
    } else {
      console.log('No registrations found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testGroupCheckin();
