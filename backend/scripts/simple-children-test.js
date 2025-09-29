const fetch = require('node-fetch');

async function testChildrenRegistration() {
  console.log('🧪 Simple Children Registration Test\n');
  
  const testData = {
    partner1: {
      name: 'Simple Test Dad',
      email: `dad.${Date.now()}@test.com`,
      phone: '+27111111111',
      gender: 'Male'
    },
    partner2: {
      name: 'Simple Test Mom',
      email: `mom.${Date.now()}@test.com`,
      phone: '+27222222222',
      gender: 'Female'
    },
    church: 'Test Church',
    country: 'South Africa',
    accommodation: 'couple',
    payment: 'eft',
    children: [
      { name: 'Teen Child', age: 15, gender: 'Male' }  // Should add R1,300
    ]
  };
  
  console.log('📋 Registering family with 1 teen (age 15)');
  console.log('💰 Expected total: R2,600 (couple) + R1,300 (teen) = R3,900');
  
  try {
    const response = await fetch('http://localhost:3000/api/register/couple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    console.log('📊 Backend response:', result);
    
    if (result.success) {
      console.log(`✅ Registration successful! Total: R${result.total}`);
      
      if (result.total === 3900) {
        console.log('🎉 PRICING CALCULATION WORKING CORRECTLY!');
      } else {
        console.log('❌ Pricing calculation incorrect');
        console.log(`   Expected: R3,900, Got: R${result.total}`);
      }
    } else {
      console.log('❌ Registration failed:', result.error);
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

testChildrenRegistration();
