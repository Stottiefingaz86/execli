const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = 'https://efiioacrgwuewmroztth.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLatestReport() {
  console.log('🔍 Checking latest report in database...');
  
  try {
    // Get the latest report
    const { data: reports, error } = await supabase
      .from('voc_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('❌ Error fetching reports:', error);
      return;
    }
    
    if (!reports || reports.length === 0) {
      console.log('⚠️ No reports found');
      return;
    }
    
    const latestReport = reports[0];
    console.log(`📊 Latest report: ${latestReport.id}`);
    console.log(`📅 Created: ${latestReport.created_at}`);
    console.log(`📈 Status: ${latestReport.status}`);
    console.log(`📝 Progress: ${latestReport.progress_message}`);
    console.log(`🏢 Business: ${latestReport.business_name}`);
    console.log(`🔗 URL: ${latestReport.business_url}`);
    
    // Check if analysis exists
    if (latestReport.analysis) {
      console.log('✅ Analysis data found!');
      console.log('Analysis keys:', Object.keys(latestReport.analysis));
      
      if (latestReport.analysis.executiveSummary) {
        console.log('Executive Summary keys:', Object.keys(latestReport.analysis.executiveSummary));
        console.log('Praised Sections:', latestReport.analysis.executiveSummary.praisedSections?.length || 0);
        console.log('Pain Points:', latestReport.analysis.executiveSummary.painPoints?.length || 0);
        console.log('Alerts:', latestReport.analysis.executiveSummary.alerts?.length || 0);
      }
      
      if (latestReport.analysis.mentionsByTopic) {
        console.log('Mentions by Topic:', latestReport.analysis.mentionsByTopic.length);
        const casinoTopics = latestReport.analysis.mentionsByTopic.filter(topic => 
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
    
    // Check sources
    if (latestReport.sources) {
      console.log('Sources:', latestReport.sources);
    }
    
    if (latestReport.detected_sources) {
      console.log('Detected Sources:', latestReport.detected_sources);
    }
    
  } catch (error) {
    console.error('❌ Error during check:', error);
  }
}

checkLatestReport(); 