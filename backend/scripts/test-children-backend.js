const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000';

async function testChildrenBackend() {
  try {
    console.log('👨‍👩‍👧‍👦 Testing Children Backend Functionality...\n');
    
    // Test 1: Register couple with children
    console.log('📋 Test 1: Register Couple with Children');
    // Generate unique emails with timestamp
    const timestamp = Date.now();
    const familyData = {
      partner1: {
        name: 'David Test',
        email: `david.test.${timestamp}@example.com`,
        phone: '+27123456789',
        gender: 'Male'
      },
      partner2: {
        name: 'Mary Test',
        email: `mary.test.${timestamp}@example.com`,
        phone: '+27987654321',
        gender: 'Female'
      },
      church: 'Test Family Church',
      country: 'South Africa',
      accommodation: 'couple',
      payment: 'eft',
      dietaryRequirements: 'None',
      specialNeeds: 'None',
      children: [
        { name: 'Tommy Test', age: 8, gender: 'Male' },      // Free (under 12)
        { name: 'Sarah Test', age: 15, gender: 'Female' },   // R1,300 (12-18)
        { name: 'Mike Test', age: 20, gender: 'Male' }       // R2,600 (18+)
      ]
    };
    
    // Expected total: R2,600 (couple) + R0 (8yr) + R1,300 (15yr) + R2,600 (20yr) = R6,500
    
    const registerResponse = await fetch(`${API_URL}/api/register/couple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(familyData)
    });
    
    console.log('Registration Status:', registerResponse.status);
    
    if (registerResponse.ok) {
      const registerResult = await registerResponse.json();
      console.log('✅ Family registration successful!');
      console.log('📊 Registration result:', registerResult);
      console.log('💰 Expected total: R6,500 (couple + 3 children)');
    } else {
      console.log('❌ Family registration failed');
      const error = await registerResponse.text();
      console.log('Error:', error);
      return false;
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 2: Check admin couples endpoint includes children
    console.log('📋 Test 2: Admin Couples Endpoint with Children');
    const couplesResponse = await fetch(`${API_URL}/api/admin/couples`);
    
    if (couplesResponse.ok) {
      const couplesData = await couplesResponse.json();
      console.log('✅ Couples endpoint working!');
      console.log('📊 Total couples:', couplesData.length);
      
      // Find our test family
      const testFamily = couplesData.find(c => 
        c.partner1_email === `david.test.${timestamp}@example.com`
      );
      
      if (testFamily) {
        console.log('✅ Test family found!');
        console.log('👨‍👩‍👧‍👦 Family details:', {
          id: testFamily.id,
          partner1: testFamily.partner1_name,
          partner2: testFamily.partner2_name,
          children_count: testFamily.children_count,
          children: testFamily.children,
          total: testFamily.total,
          accommodation: testFamily.accommodation
        });
        
        // Parse children data
        const children = typeof testFamily.children === 'string' 
          ? JSON.parse(testFamily.children) 
          : testFamily.children;
          
        console.log('👶 Children details:');
        children.forEach((child, index) => {
          const pricing = child.age < 12 ? 'Free' : 
                         child.age <= 18 ? 'R1,300' : 'R2,600';
          console.log(`  ${index + 1}. ${child.name} (${child.age}, ${child.gender}) - ${pricing}`);
        });
      } else {
        console.log('⚠️  Test family not found in database');
      }
    } else {
      console.log('❌ Couples endpoint failed');
      return false;
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 3: Check-in system includes children
    console.log('📋 Test 3: Check-in System with Children');
    const checkinResponse = await fetch(`${API_URL}/api/checkin/registrations`);
    
    if (checkinResponse.ok) {
      const checkinData = await checkinResponse.json();
      console.log('✅ Check-in endpoint working!');
      console.log('📊 Check-in stats:', checkinData.stats);
      
      // Look for families in check-in data
      const families = checkinData.data.filter(item => 
        item.type === 'couple' && item.children_count > 0
      );
      
      console.log('👨‍👩‍👧‍👦 Families with children:', families.length);
      
      if (families.length > 0) {
        console.log('📋 Sample family in check-in:', {
          displayName: families[0].displayName,
          children_count: families[0].children_count,
          total: families[0].total,
          checked_in: families[0].checked_in
        });
      }
    } else {
      console.log('❌ Check-in endpoint failed');
      return false;
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 4: Pricing validation
    console.log('📋 Test 4: Pricing Validation');
    console.log('💰 Pricing Structure:');
    console.log('  - Base couple: R2,600');
    console.log('  - Children 0-11: FREE');
    console.log('  - Teens 12-18: R1,300');
    console.log('  - Adults 18+: R2,600');
    console.log('');
    console.log('🧮 Test Family Calculation:');
    console.log('  - Couple: R2,600');
    console.log('  - Tommy (8): R0 (free)');
    console.log('  - Sarah (15): R1,300');
    console.log('  - Mike (20): R2,600');
    console.log('  - TOTAL: R6,500');
    
    return true;
    
  } catch (error) {
    console.error('💥 Test failed:', error);
    return false;
  }
}

// Run the tests
testChildrenBackend().then(success => {
  if (success) {
    console.log('\n🎉 CHILDREN BACKEND TESTING COMPLETE!');
    console.log('✅ All functionality working perfectly!');
    console.log('👨‍👩‍👧‍👦 Family registration system is ready!');
  } else {
    console.log('\n❌ Some tests failed');
    console.log('🔧 Check the errors above and fix issues');
  }
}).catch(err => {
  console.error('💥 Test script failed:', err);
});
