// Test script to verify JACC authentication
const fetch = require('node-fetch');

async function testJaccAuth() {
  console.log('Testing JACC authentication...');
  
  try {
    // Test 1: Try to login
    console.log('\n1. Testing login...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/simple-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: 'cburnell',
        password: 'cburnell123'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('Login successful:', loginData);
      
      // Test 2: Try to get user info
      console.log('\n2. Testing user info...');
      const cookies = loginResponse.headers.get('set-cookie');
      console.log('Cookies received:', cookies);
      
      const userResponse = await fetch('http://localhost:5000/api/user', {
        headers: {
          'Cookie': cookies || ''
        }
      });
      
      console.log('User response status:', userResponse.status);
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('User data:', userData);
        console.log('✅ Authentication test PASSED');
      } else {
        console.log('❌ User info test FAILED');
      }
    } else {
      console.log('❌ Login test FAILED');
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}

testJaccAuth(); 