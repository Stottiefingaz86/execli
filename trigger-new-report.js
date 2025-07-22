const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = 'https://efiioacrgwuewmroztth.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function triggerNewReport() {
  console.log('🚀 Triggering new report generation to test fixes...');
  
  try {
    // Create a new report
    const { data: report, error } = await supabase
      .from('voc_reports')
      .insert({
        business_name: 'Test Casino',
        business_url: 'https://testcasino.com',
        status: 'processing',
        progress_message: 'Starting new report generation...'
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating report:', error);
      return;
    }
    
    console.log(`✅ Created new report: ${report.id}`);
    
    // Trigger the Edge Function
    let functionResult;
    try {
      const { data: result, error: functionError } = await supabase.functions.invoke('process-voc-report', {
        body: {
          business_name: 'Test Casino',
          business_url: 'https://testcasino.com',
          email: 'test@example.com',
          industry: 'gambling',
          ip_address: '127.0.0.1'
        }
      });
      
      if (functionError) {
        console.error('❌ Error invoking function:', functionError);
        // Try to get the error response body
        if (functionError.context && functionError.context.body) {
          const reader = functionError.context.body.getReader();
          const { value } = await reader.read();
          const errorText = new TextDecoder().decode(value);
          console.error('📄 Error response body:', errorText);
        }
        return;
      }
      
      functionResult = result;
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
      
      if (parsedResult && typeof parsedResult === 'object' && parsedResult.report_id) {
        console.log(`📊 Report ID from function: ${parsedResult.report_id}`);
        console.log(`📊 Company ID from function: ${parsedResult.company_id}`);
        
        // Use the report ID from the function response
        const reportId = parsedResult.report_id;
        
        // Wait a bit and then check the report status
        console.log('⏳ Waiting 30 seconds for processing...');
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        // Check the updated report
        const { data: updatedReport, error: fetchError } = await supabase
          .from('voc_reports')
          .select('*')
          .eq('id', reportId)
          .single();
        
        if (fetchError) {
          console.error('❌ Error fetching updated report:', fetchError);
          return;
        }
        
        console.log(`📊 Updated report status: ${updatedReport.status}`);
        console.log(`📝 Progress message: ${updatedReport.progress_message}`);
        
        if (updatedReport.analysis) {
          console.log('✅ Analysis data found!');
          console.log('Executive Summary sections:');
          console.log('- Praised Sections:', updatedReport.analysis.executiveSummary?.praisedSections?.length || 0);
          console.log('- Pain Points:', updatedReport.analysis.executiveSummary?.painPoints?.length || 0);
          console.log('- Alerts:', updatedReport.analysis.executiveSummary?.alerts?.length || 0);
          
          // Check for casino/sports topics
          if (updatedReport.analysis.mentionsByTopic) {
            const casinoTopics = updatedReport.analysis.mentionsByTopic.filter(topic => 
              topic.topic.toLowerCase().includes('casino') || 
              topic.topic.toLowerCase().includes('sport') ||
              topic.topic.toLowerCase().includes('poker') ||
              topic.topic.toLowerCase().includes('betting')
            );
            console.log(`🎰 Casino/Sports topics found: ${casinoTopics.length}`);
          }
        } else {
          console.log('❌ No analysis data yet');
        }
      } else {
        console.log('❌ No report ID returned from function');
      }
    } catch (invokeError) {
      console.error('❌ Function invocation error:', invokeError);
      return;
    }
    
  } catch (error) {
    console.error('❌ Error during report generation:', error);
  }
}

triggerNewReport(); 