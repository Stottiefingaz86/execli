const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = 'https://efiioacrgwuewmroztth.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRealBusiness() {
  console.log('🚀 Testing with a real business that should have reviews...');
  
  try {
    // Trigger the Edge Function with a real business
    const { data: functionResult, error: functionError } = await supabase.functions.invoke('process-voc-report', {
      body: {
        business_name: 'Bet365',
        business_url: 'https://www.bet365.com',
        email: 'test@example.com',
        industry: 'gambling',
        ip_address: '127.0.0.1'
      }
    });
    
    if (functionError) {
      console.error('❌ Error invoking function:', functionError);
      return;
    }
    
    console.log('✅ Function invoked successfully');
    console.log('📊 Function result:', functionResult);
    
    // Parse the result if it's a string
    let parsedResult = functionResult;
    if (typeof functionResult === 'string') {
      try {
        parsedResult = JSON.parse(functionResult);
      } catch (e) {
        console.error('❌ Error parsing function result:', e);
        return;
      }
    }
    
    if (parsedResult && parsedResult.report_id) {
      console.log(`📊 Report ID: ${parsedResult.report_id}`);
      console.log(`📊 Company ID: ${parsedResult.company_id}`);
      
      // Wait for processing
      console.log('⏳ Waiting 60 seconds for processing...');
      await new Promise(resolve => setTimeout(resolve, 60000));
      
      // Check the report
      const { data: report, error: fetchError } = await supabase
        .from('voc_reports')
        .select('*')
        .eq('id', parsedResult.report_id)
        .single();
      
      if (fetchError) {
        console.error('❌ Error fetching report:', fetchError);
        return;
      }
      
      console.log(`📊 Report status: ${report.status}`);
      console.log(`📝 Progress: ${report.progress_message}`);
      
      if (report.analysis) {
        console.log('✅ Analysis data found!');
        console.log('Analysis keys:', Object.keys(report.analysis));
        
        if (report.analysis.executiveSummary) {
          console.log('Executive Summary sections:');
          console.log('- Praised Sections:', report.analysis.executiveSummary.praisedSections?.length || 0);
          console.log('- Pain Points:', report.analysis.executiveSummary.painPoints?.length || 0);
          console.log('- Alerts:', report.analysis.executiveSummary.alerts?.length || 0);
        }
        
        if (report.analysis.mentionsByTopic) {
          console.log('Mentions by Topic:', report.analysis.mentionsByTopic.length);
          const casinoTopics = report.analysis.mentionsByTopic.filter(topic => 
            topic.topic.toLowerCase().includes('casino') || 
            topic.topic.toLowerCase().includes('sport') ||
            topic.topic.toLowerCase().includes('poker') ||
            topic.topic.toLowerCase().includes('betting')
          );
          console.log('Casino/Sports topics:', casinoTopics.length);
        }
      } else {
        console.log('❌ No analysis data');
      }
      
      if (report.detected_sources) {
        console.log('Detected Sources:', report.detected_sources);
      }
    } else {
      console.log('❌ No report ID returned');
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

testRealBusiness(); 