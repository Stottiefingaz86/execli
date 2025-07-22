const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFrontendDB() {
  console.log('🔍 Testing frontend database access...');
  
  try {
    // Test if we can access the voc_reports table
    const { data: reports, error } = await supabase
      .from('voc_reports')
      .select('id, business_name, status')
      .limit(5);

    if (error) {
      console.error('❌ Error accessing voc_reports:', error);
      return;
    }

    console.log('✅ Successfully accessed voc_reports table');
    console.log(`📊 Found ${reports.length} reports`);
    
    if (reports.length > 0) {
      console.log('📋 Sample reports:');
      reports.forEach((report, index) => {
        console.log(`  ${index + 1}. ${report.business_name} (${report.status}) - ${report.id}`);
      });
    }

    // Test specific report access
    const reportId = '2baf607d-26fb-492f-8693-53f650145cbd';
    const { data: specificReport, error: specificError } = await supabase
      .from('voc_reports')
      .select('*')
      .eq('id', reportId)
      .maybeSingle();

    if (specificError) {
      console.error('❌ Error accessing specific report:', specificError);
      return;
    }

    if (specificReport) {
      console.log(`✅ Successfully found report ${reportId}`);
      console.log(`🏢 Business: ${specificReport.business_name}`);
      console.log(`📈 Status: ${specificReport.status}`);
      console.log(`📊 Has analysis: ${!!specificReport.analysis}`);
      if (specificReport.analysis) {
        console.log(`🔍 Analysis keys: ${Object.keys(specificReport.analysis).join(', ')}`);
      }
    } else {
      console.log(`❌ Report ${reportId} not found`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testFrontendDB(); 