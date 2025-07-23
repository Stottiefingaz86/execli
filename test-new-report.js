// Test script to generate a new report and test the fixes
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testNewReport() {
  console.log('🔍 Testing New Report Generation...');
  
  try {
    // Create a test company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: 'Test Company for Fixes',
        url: 'https://testcompany.com',
        industry: 'Technology'
      })
      .select()
      .single();
    
    if (companyError) {
      console.error('❌ Error creating company:', companyError);
      return false;
    }
    
    console.log('✅ Company created:', company.id);
    
    // Create a test report
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert({
        company_id: company.id,
        business_name: 'Test Company for Fixes',
        business_url: 'https://testcompany.com',
        status: 'pending'
      })
      .select()
      .single();
    
    if (reportError) {
      console.error('❌ Error creating report:', reportError);
      return false;
    }
    
    console.log('✅ Report created:', report.id);
    
    // Trigger the Edge Function
    console.log('🔄 Triggering Edge Function...');
    
    const { data: functionResult, error: functionError } = await supabase.functions.invoke('process-voc-report', {
      body: {
        report_id: report.id,
        company_id: company.id,
        business_name: 'Test Company for Fixes',
        business_url: 'https://testcompany.com'
      }
    });
    
    if (functionError) {
      console.error('❌ Edge Function error:', functionError);
      return false;
    }
    
    console.log('✅ Edge Function triggered successfully');
    console.log('Function result:', functionResult);
    
    // Wait a bit for processing
    console.log('⏳ Waiting for processing...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Check the report status
    const { data: updatedReport, error: fetchError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', report.id)
      .single();
    
    if (fetchError) {
      console.error('❌ Error fetching updated report:', fetchError);
      return false;
    }
    
    console.log('📊 Updated report status:', updatedReport.status);
    console.log('Has analysis:', !!updatedReport.analysis);
    
    if (updatedReport.analysis) {
      const analysis = updatedReport.analysis;
      
      console.log('\n🔍 ANALYSIS RESULTS:');
      console.log('Executive Summary:', !!analysis.executiveSummary);
      console.log('Praised Sections:', analysis.executiveSummary?.praisedSections?.length || 0);
      console.log('Pain Points:', analysis.executiveSummary?.painPoints?.length || 0);
      console.log('Alerts:', analysis.executiveSummary?.alerts?.length || 0);
      console.log('Sentiment Over Time:', analysis.sentimentOverTime?.length || 0);
      console.log('Mentions By Topic:', analysis.mentionsByTopic?.length || 0);
      
      // Check for realistic sentiment values
      if (analysis.sentimentOverTime && analysis.sentimentOverTime.length > 0) {
        const unrealisticValues = analysis.sentimentOverTime.filter(d => d.sentiment < 0 || d.sentiment > 100);
        if (unrealisticValues.length > 0) {
          console.log('❌ Found unrealistic sentiment values:', unrealisticValues.slice(0, 3));
        } else {
          console.log('✅ All sentiment values are realistic (0-100)');
        }
      }
    }
    
    console.log('\n✅ Test completed successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run the test
testNewReport().then(success => {
  if (success) {
    console.log('🎉 New report test passed!');
  } else {
    console.log('💥 New report test failed!');
  }
  process.exit(success ? 0 : 1);
}); 