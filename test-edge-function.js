async function testEdgeFunction() {
  try {
    console.log('Testing edge function...');
    
    const response = await fetch('https://efiioacrgwuewmroztth.supabase.co/functions/v1/process-voc-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        business_name: 'Test Business',
        business_url: 'https://test.com',
        email: 'test@example.com',
        industry: 'Technology',
        ip_address: '127.0.0.1'
      })
    });
    
    const result = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', result);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testEdgeFunction(); 