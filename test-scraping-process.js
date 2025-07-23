// Test the scraping process
require('dotenv').config({ path: '.env.local' });

async function testScrapingProcess() {
  console.log('🔍 Testing Scraping Process...');
  
  // Check environment variables
  console.log('Environment check:');
  console.log('- APIFY_TOKEN:', process.env.APIFY_TOKEN ? 'SET' : 'NOT SET');
  console.log('- SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
  
  // Test Apify API directly
  if (process.env.APIFY_TOKEN) {
    console.log('\n🔍 Testing Apify API...');
    try {
      const response = await fetch(`https://api.apify.com/v2/users/me?token=${process.env.APIFY_TOKEN}`);
      const result = await response.json();
      console.log('Apify API response:', result);
      
      if (result.data) {
        console.log('✅ Apify token is valid');
      } else {
        console.log('❌ Apify token is invalid');
      }
    } catch (error) {
      console.error('❌ Apify API test failed:', error);
    }
  }
  
  // Test Edge Function directly
  console.log('\n🔍 Testing Edge Function directly...');
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/process-voc-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        business_name: 'Test Scraping Debug',
        business_url: 'https://testscrapingdebug.com',
        email: 'test@scrapingdebug.com'
      })
    });
    
    console.log('Edge Function response status:', response.status);
    const result = await response.text();
    console.log('Edge Function response:', result);
    
  } catch (error) {
    console.error('❌ Edge Function test failed:', error);
  }
}

testScrapingProcess().then(() => {
  console.log('Test completed');
  process.exit(0);
}); 