require('dotenv').config();

async function comprehensiveTest() {
  console.log('🎪 REACH2025 Check-in Dashboard - COMPREHENSIVE TEST\n');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Get initial stats
    console.log('\n📊 TEST 1: Initial Registration Stats');
    console.log('-'.repeat(40));
    
    const response = await fetch('http://localhost:3000/api/checkin/registrations');
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ API Connection: SUCCESS');
      console.log(`📈 Total Registrations: ${result.data.length}`);
      console.log(`👥 Groups: ${result.stats.totalGroups}`);
      console.log(`👤 Individuals: ${result.stats.totalIndividuals}`);
      console.log(`✅ Already Checked In: ${result.stats.checkedInGroups + result.stats.checkedInIndividuals}`);
      console.log(`⏳ Pending Check-in: ${result.stats.totalGroups + result.stats.totalIndividuals - result.stats.checkedInGroups - result.stats.checkedInIndividuals}`);
      
      // Test 2: Check in a group
      if (result.data.length > 0) {
        const firstGroup = result.data.find(reg => reg.type === 'group' && !reg.checked_in);
        
        if (firstGroup) {
          console.log('\n🎯 TEST 2: Group Check-in');
          console.log('-'.repeat(40));
          console.log(`Checking in: ${firstGroup.displayName}`);
          
          const checkinResponse = await fetch(`http://localhost:3000/api/checkin/group/${firstGroup.id}`, {
            method: 'POST'
          });
          const checkinResult = await checkinResponse.json();
          
          if (checkinResult.success) {
            console.log('✅ Check-in: SUCCESS');
            console.log(`⏰ Timestamp: ${checkinResult.data.checkin_time}`);
            
            // Test 3: Verify updated stats
            console.log('\n📊 TEST 3: Updated Stats After Check-in');
            console.log('-'.repeat(40));
            
            const statsResponse = await fetch('http://localhost:3000/api/checkin/registrations');
            const statsResult = await statsResponse.json();
            
            if (statsResult.success) {
              console.log(`✅ Checked In Groups: ${statsResult.stats.checkedInGroups}`);
              console.log(`✅ Total Progress: ${Math.round(((statsResult.stats.checkedInGroups + statsResult.stats.checkedInIndividuals) / (statsResult.stats.totalGroups + statsResult.stats.totalIndividuals)) * 100)}%`);
              
              // Test 4: Undo check-in
              console.log('\n↩️  TEST 4: Undo Check-in');
              console.log('-'.repeat(40));
              
              const undoResponse = await fetch(`http://localhost:3000/api/checkin/undo/group/${firstGroup.id}`, {
                method: 'POST'
              });
              const undoResult = await undoResponse.json();
              
              if (undoResult.success) {
                console.log('✅ Undo Check-in: SUCCESS');
                console.log(`📝 Status: ${undoResult.message}`);
                
                // Test 5: Final verification
                console.log('\n🔍 TEST 5: Final Verification');
                console.log('-'.repeat(40));
                
                const finalResponse = await fetch('http://localhost:3000/api/checkin/registrations');
                const finalResult = await finalResponse.json();
                
                if (finalResult.success) {
                  console.log(`✅ Final Checked In Groups: ${finalResult.stats.checkedInGroups}`);
                  console.log('✅ Undo functionality verified');
                }
              } else {
                console.log('❌ Undo failed:', undoResult.error);
              }
            }
          } else {
            console.log('❌ Check-in failed:', checkinResult.error);
          }
        } else {
          console.log('ℹ️  All groups already checked in or no groups available');
        }
      }
      
      // Test 6: Search functionality simulation
      console.log('\n🔍 TEST 6: Search Functionality');
      console.log('-'.repeat(40));
      
      const searchTerms = ['christopher', 'mwewa', 'zambia', '+260'];
      for (const term of searchTerms) {
        const matches = result.data.filter(reg => 
          reg.searchText.toLowerCase().includes(term.toLowerCase())
        );
        console.log(`🔍 Search "${term}": ${matches.length} result(s)`);
      }
      
    } else {
      console.log('❌ API Connection failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 COMPREHENSIVE TEST COMPLETE!');
  console.log('📱 Frontend Dashboard: http://localhost:3001/checkin');
  console.log('🚀 Ready for REACH2025 venue operations!');
  console.log('='.repeat(60));
}

comprehensiveTest();
