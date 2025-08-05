require('dotenv').config({ path: '.env.development' });
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

async function testApiEndpoints() {
  const baseUrl = process.env.API_URL || 'http://localhost:3000';
  
  try {
    // Test health endpoint
    console.log('Testing health endpoint...');
    const healthResponse = await axios.get(`${baseUrl}/health`);
    console.log('Health check:', healthResponse.data);

    // Test registration endpoint
    console.log('\nTesting registration endpoint...');
    const registrationData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      church: 'Test Church',
      country: 'Test Country',
      indemnity: true,
      payment: true,
      commitment: true
    };

    const registerResponse = await axios.post(`${baseUrl}/api/register/individual`, registrationData);
    console.log('Registration response:', registerResponse.data);

    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testApiEndpoints();
