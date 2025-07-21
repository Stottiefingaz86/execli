// Using built-in fetch

async function testEdgeFunction() {
  const edgeFunctionUrl = 'https://efiioacrgwuewmroztth.supabase.co/functions/v1/process-voc-report';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('Testing Edge Function with different authentication methods...');
  
  // Test 1: No authentication
  console.log('\n1. Testing with no authentication...');
  try {
    const response1 = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        business_name: 'Test Business',
        business_url: 'https://test.com',
        email: 'test@example.com'
      })
    });
    console.log('Status:', response1.status);
    const text1 = await response1.text();
    console.log('Response:', text1);
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Test 2: Authorization Bearer
  console.log('\n2. Testing with Authorization Bearer...');
  try {
    const response2 = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`
      },
      body: JSON.stringify({
        business_name: 'Test Business',
        business_url: 'https://test.com',
        email: 'test@example.com'
      })
    });
    console.log('Status:', response2.status);
    const text2 = await response2.text();
    console.log('Response:', text2);
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Test 3: apikey header
  console.log('\n3. Testing with apikey header...');
  try {
    const response3 = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey
      },
      body: JSON.stringify({
        business_name: 'Test Business',
        business_url: 'https://test.com',
        email: 'test@example.com'
      })
    });
    console.log('Status:', response3.status);
    const text3 = await response3.text();
    console.log('Response:', text3);
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Test 4: Both headers
  console.log('\n4. Testing with both Authorization and apikey...');
  try {
    const response4 = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      },
      body: JSON.stringify({
        business_name: 'Test Business',
        business_url: 'https://test.com',
        email: 'test@example.com'
      })
    });
    console.log('Status:', response4.status);
    const text4 = await response4.text();
    console.log('Response:', text4);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testEdgeFunction(); 