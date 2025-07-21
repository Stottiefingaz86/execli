// Test API keys after you update them
// Run this after updating your .env.local file

const { createClient } = require('@supabase/supabase-js');

async function testAPIKeys() {
  try {
    console.log('🧪 Testing API keys...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('URL:', supabaseUrl);
    console.log('Key length:', supabaseKey ? supabaseKey.length : 'missing');
    console.log('Key starts with:', supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'missing');
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Missing environment variables');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test a simple query
    const { data, error } = await supabase
      .from('voc_reports')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ API key test failed:', error.message);
      return;
    }
    
    console.log('✅ API keys are working!');
    console.log('✅ Database connection successful');
    console.log('✅ New reports will work properly');
    
  } catch (error) {
    console.log('❌ Error testing API keys:', error.message);
  }
}

testAPIKeys(); 