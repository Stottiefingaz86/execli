// Test script to debug report creation
require('dotenv').config({ path: '.env.local' });

async function testReportCreation() {
  console.log('🔍 Testing Report Creation...');
  
  try {
    // Test the scrape API endpoint
    const response = await fetch('http://localhost:3000/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business_name: 'Test Company Debug',
        business_url: 'https://testcompanydebug.com',
        email: 'test@debug.com'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.text();
    console.log('Response body:', result);
    
    try {
      const jsonResult = JSON.parse(result);
      console.log('Parsed JSON:', jsonResult);
      
      if (jsonResult.report_id) {
        console.log('✅ Report created successfully with ID:', jsonResult.report_id);
        
        // Test the report status API
        console.log('🔍 Testing report status...');
        const statusResponse = await fetch(`http://localhost:3000/api/report-status?report_id=${jsonResult.report_id}`);
        const statusResult = await statusResponse.json();
        console.log('Status response:', statusResult);
      } else {
        console.log('❌ No report ID returned');
      }
    } catch (parseError) {
      console.log('❌ Failed to parse response as JSON:', parseError);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testReportCreation().then(() => {
  console.log('Test completed');
  process.exit(0);
}); 