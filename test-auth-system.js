// Test the authentication system
require('dotenv').config({ path: '.env.local' });

async function testAuthSystem() {
  console.log('🧪 Testing Authentication System...');
  
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Test 1: Create a free report (should create partial account)
    console.log('\n📝 Test 1: Creating free report...');
    const reportResponse = await fetch(`${baseUrl}/api/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business_name: 'Test Auth Company',
        business_url: 'https://testauthcompany.com',
        email: 'test@auth.com'
      })
    });
    
    const reportResult = await reportResponse.json();
    console.log('Report creation result:', reportResult);
    
    if (reportResult.success) {
      console.log('✅ Free report created successfully');
    } else {
      console.log('❌ Free report creation failed');
    }
    
    // Test 2: Sign up with the same email (should upgrade to full account)
    console.log('\n📝 Test 2: Signing up with same email...');
    const signupResponse = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@auth.com',
        password: 'testpassword123',
        fullName: 'Test User'
      })
    });
    
    const signupResult = await signupResponse.json();
    console.log('Signup result:', signupResult);
    
    if (signupResult.success) {
      console.log('✅ Account upgrade successful');
    } else {
      console.log('❌ Account upgrade failed');
    }
    
    // Test 3: Login
    console.log('\n📝 Test 3: Logging in...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@auth.com',
        password: 'testpassword123'
      })
    });
    
    const loginResult = await loginResponse.json();
    console.log('Login result:', loginResult);
    
    if (loginResult.success) {
      console.log('✅ Login successful');
      
      // Test 4: Get current user
      console.log('\n📝 Test 4: Getting current user...');
      const meResponse = await fetch(`${baseUrl}/api/auth/me`, {
        headers: {
          'Cookie': loginResponse.headers.get('set-cookie') || ''
        }
      });
      
      const meResult = await meResponse.json();
      console.log('Current user result:', meResult);
      
      if (meResult.success) {
        console.log('✅ User session working');
        console.log('User info:', meResult.user);
      } else {
        console.log('❌ User session failed');
      }
      
      // Test 5: Get user reports
      console.log('\n📝 Test 5: Getting user reports...');
      const reportsResponse = await fetch(`${baseUrl}/api/user/reports`, {
        headers: {
          'Cookie': loginResponse.headers.get('set-cookie') || ''
        }
      });
      
      const reportsResult = await reportsResponse.json();
      console.log('User reports result:', reportsResult);
      
      if (reportsResult.success) {
        console.log('✅ User reports retrieved');
        console.log('Reports count:', reportsResult.reports.length);
      } else {
        console.log('❌ User reports failed');
      }
      
    } else {
      console.log('❌ Login failed');
    }
    
    console.log('\n🎉 Authentication system test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testAuthSystem();
} 