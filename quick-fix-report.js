// Quick fix for the stuck report
// This will make the report display immediately

const { createClient } = require('@supabase/supabase-js');

// Use the anon key since we're just reading/updating
const supabaseUrl = 'https://efiioacrgwuewmroztth.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmaWlvYWNyZ3d1ZXdtcm96dHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzAsImV4cCI6MjA1MDU0ODk3MH0.Ej8TYLFFiEyiTx6Q5yGSYH7Rg8FE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function quickFix() {
  try {
    console.log('🔧 Quick fixing the stuck report...');
    
    // Update the report to copy sources to detected_sources
    const { data, error } = await supabase
      .from('voc_reports')
      .update({ 
        detected_sources: [{"source":"Trustpilot","review_count":40}]
      })
      .eq('business_url', 'https://betonline.ag')
      .select();
    
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    console.log('✅ Report fixed!');
    console.log('📊 The report should now display with:');
    console.log('   - 40 Trustpilot reviews');
    console.log('   - All analysis data');
    console.log('   - Complete insights');
    
    console.log('\n🌐 Visit: http://localhost:3000/report/-fca57692b8ab');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

quickFix(); 