const { createClient } = require('@supabase/supabase-js');

async function checkDatabaseData() {
  const supabaseUrl = 'https://efiioacrgwuewmroztth.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmaWlvYWNyZ3d1ZXdtcm96dHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzAsImV4cCI6MjA1MDU0ODk3MH0.Ej8TYLFFiEyiTx6Q5yGSYH7Rg8FE';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔍 Checking voc_reports table...');
    
    const { data: reports, error } = await supabase
      .from('voc_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (error) {
      console.error('Error fetching reports:', error);
      return;
    }
    
    console.log(`Found ${reports.length} reports`);
    
    reports.forEach((report, index) => {
      console.log(`\n📊 Report ${index + 1}:`);
      console.log(`ID: ${report.id}`);
      console.log(`Status: ${report.status}`);
      console.log(`Company ID: ${report.company_id}`);
      console.log(`Analysis keys: ${report.analysis ? Object.keys(report.analysis) : 'NO ANALYSIS'}`);
      
      if (report.analysis) {
        console.log('Analysis structure:');
        Object.keys(report.analysis).forEach(key => {
          const value = report.analysis[key];
          if (Array.isArray(value)) {
            console.log(`  ${key}: [${value.length} items]`);
            if (value.length > 0 && typeof value[0] === 'object') {
              console.log(`    Sample:`, JSON.stringify(value[0], null, 2).substring(0, 200));
            }
          } else if (typeof value === 'object' && value !== null) {
            console.log(`  ${key}: ${Object.keys(value).length} properties`);
            console.log(`    Keys: ${Object.keys(value).join(', ')}`);
          } else {
            console.log(`  ${key}: ${typeof value} - ${value}`);
          }
        });
      }
    });
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

checkDatabaseData(); 