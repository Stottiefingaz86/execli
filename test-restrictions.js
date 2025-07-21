const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testRestrictions() {
  try {
    console.log('Testing restriction logic...');
    
    // Test 1: Check if admin email is recognized
    const adminEmail = 'christopher.hunt86@gmail.com';
    const regularEmail = 'test@example.com';
    
    console.log(`\n1. Testing admin email: ${adminEmail}`);
    const { data: adminCompanies, error: adminError } = await supabase
      .from('companies')
      .select('id, email, ip_address')
      .eq('email', adminEmail);
    
    if (adminError) {
      console.error('Error checking admin:', adminError);
    } else {
      console.log(`Admin has ${adminCompanies?.length || 0} existing reports`);
    }
    
    // Test 2: Check regular email restrictions
    console.log(`\n2. Testing regular email: ${regularEmail}`);
    const { data: regularCompanies, error: regularError } = await supabase
      .from('companies')
      .select('id, email, ip_address')
      .eq('email', regularEmail);
    
    if (regularError) {
      console.error('Error checking regular email:', regularError);
    } else {
      console.log(`Regular email has ${regularCompanies?.length || 0} existing reports`);
    }
    
    // Test 3: Check IP-based restrictions
    const testIP = '192.168.1.1';
    console.log(`\n3. Testing IP restrictions for: ${testIP}`);
    const { data: ipCompanies, error: ipError } = await supabase
      .from('companies')
      .select('id, email, ip_address')
      .eq('ip_address', testIP);
    
    if (ipError) {
      console.error('Error checking IP:', ipError);
    } else {
      console.log(`IP ${testIP} has ${ipCompanies?.length || 0} existing reports`);
    }
    
    console.log('\n✅ Restriction logic test completed!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testRestrictions(); 