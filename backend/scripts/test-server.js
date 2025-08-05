require('dotenv').config({ path: '.env.development' });
const http = require('http');

async function testServer() {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:3000';
    const response = await new Promise((resolve, reject) => {
      http.get(`${apiUrl}/health`, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        });
      }).on('error', reject);
    });
    
    console.log('Server is running and healthy!');
    console.log('Response:', response);
  } catch (error) {
    console.error('Server is not running or unhealthy:', error.message);
  }
}

testServer();
