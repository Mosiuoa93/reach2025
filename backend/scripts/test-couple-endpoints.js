const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000';

async function testCoupleEndpoints() {
  try {
    console.log('🧪 Testing Couple Registration Backend Endpoints...\n');
    
    // Test 1: Check couples admin endpoint
    console.log('📋 Test 1: Admin Couples Endpoint');
    const couplesResponse = await fetch(`${API_URL}/api/admin/couples`);
    console.log('Status:', couplesResponse.status);
    
    if (couplesResponse.ok) {
      const couplesData = await couplesResponse.json();
      console.log('✅ Couples endpoint working!');
      console.log('📊 Current couples:', couplesData.length);
      if (couplesData.length > 0) {
        console.log('📋 Sample couple:', {
          id: couplesData[0].id,
          partner1: couplesData[0].partner1_name,
          partner2: couplesData[0].partner2_name,
          church: couplesData[0].church,
          accommodation: couplesData[0].accommodation,
          total: couplesData[0].total
        });
      }
    } else {
      console.log('❌ Couples endpoint failed');
      const error = await couplesResponse.text();
      console.log('Error:', error);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 2: Test couple registration endpoint with sample data
    console.log('📋 Test 2: Couple Registration Endpoint');
    const testCoupleData = {
      partner1: {
        name: 'John Test',
        email: 'john.test@example.com',
        phone: '+27123456789',
        gender: 'Male'
      },
      partner2: {
        name: 'Jane Test',
        email: 'jane.test@example.com',
        phone: '+27987654321',
        gender: 'Female'
      },
      church: 'Test Church',
      country: 'South Africa',
      accommodation: 'couple',
      payment: 'eft',
      dietaryRequirements: 'None',
      specialNeeds: 'None'
    };
    
    const registerResponse = await fetch(`${API_URL}/api/register/couple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testCoupleData)
    });
    
    console.log('Registration Status:', registerResponse.status);
    
    if (registerResponse.ok) {
      const registerResult = await registerResponse.json();
      console.log('✅ Couple registration working!');
      console.log('📊 Registration result:', registerResult);
    } else {
      console.log('❌ Couple registration failed');
      const error = await registerResponse.text();
      console.log('Error:', error);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 3: Check couples again to see if test couple was added
    console.log('📋 Test 3: Verify Test Couple Added');
    const updatedCouplesResponse = await fetch(`${API_URL}/api/admin/couples`);
    
    if (updatedCouplesResponse.ok) {
      const updatedCouplesData = await updatedCouplesResponse.json();
      console.log('✅ Updated couples count:', updatedCouplesData.length);
      
      // Find our test couple
      const testCouple = updatedCouplesData.find(c => 
        c.partner1_email === 'john.test@example.com' || 
        c.partner2_email === 'jane.test@example.com'
      );
      
      if (testCouple) {
        console.log('✅ Test couple found in database!');
        console.log('📋 Test couple details:', {
          id: testCouple.id,
          partner1: testCouple.partner1_name,
          partner2: testCouple.partner2_name,
          accommodation: testCouple.accommodation,
          total: testCouple.total,
          created: testCouple.created_at
        });
      } else {
        console.log('⚠️  Test couple not found in database');
      }
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 4: Check-in endpoints
    console.log('📋 Test 4: Check-in Registrations Endpoint');
    const checkinResponse = await fetch(`${API_URL}/api/checkin/registrations`);
    
    if (checkinResponse.ok) {
      const checkinData = await checkinResponse.json();
      console.log('✅ Check-in endpoint working!');
      console.log('📊 Check-in stats:', checkinData.stats);
      
      // Look for couples in check-in data
      const couples = checkinData.data.filter(item => item.type === 'couple');
      console.log('👥 Couples in check-in system:', couples.length);
      
      if (couples.length > 0) {
        console.log('📋 Sample couple in check-in:', {
          displayName: couples[0].displayName,
          type: couples[0].type,
          checked_in: couples[0].checked_in
        });
      }
    } else {
      console.log('❌ Check-in endpoint failed');
    }
    
    console.log('\n🎉 BACKEND TESTING COMPLETE!\n');
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// Run the tests
testCoupleEndpoints();
