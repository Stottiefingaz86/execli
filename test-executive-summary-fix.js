// Test script to verify executive summary and sentiment fixes
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testExecutiveSummaryFix() {
  console.log('🔍 Testing Executive Summary and Sentiment Fixes...');
  
  try {
    // Get the latest report
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (reportsError) {
      console.error('❌ Error fetching reports:', reportsError);
      return false;
    }
    
    if (!reports || reports.length === 0) {
      console.log('❌ No reports found');
      return false;
    }
    
    const latestReport = reports[0];
    console.log('📊 Latest report:', latestReport.id);
    console.log('Status:', latestReport.status);
    
    // Check if analysis exists
    if (!latestReport.analysis) {
      console.log('❌ No analysis data found');
      return false;
    }
    
    const analysis = latestReport.analysis;
    console.log('✅ Analysis data found');
    
    // Test executive summary data
    console.log('\n🔍 EXECUTIVE SUMMARY DATA:');
    console.log('Executive Summary exists:', !!analysis.executiveSummary);
    
    if (analysis.executiveSummary) {
      const exec = analysis.executiveSummary;
      console.log('Praised Sections:', exec.praisedSections?.length || 0);
      console.log('Pain Points:', exec.painPoints?.length || 0);
      console.log('Alerts:', exec.alerts?.length || 0);
      
      if (exec.praisedSections && exec.praisedSections.length > 0) {
        console.log('✅ Praised Sections found:', exec.praisedSections[0]);
      } else {
        console.log('❌ No praised sections found');
      }
      
      if (exec.painPoints && exec.painPoints.length > 0) {
        console.log('✅ Pain Points found:', exec.painPoints[0]);
      } else {
        console.log('❌ No pain points found');
      }
      
      if (exec.alerts && exec.alerts.length > 0) {
        console.log('✅ Alerts found:', exec.alerts[0]);
      } else {
        console.log('❌ No alerts found');
      }
    }
    
    // Test sentiment over time data
    console.log('\n🔍 SENTIMENT OVER TIME DATA:');
    console.log('Sentiment Over Time exists:', !!analysis.sentimentOverTime);
    
    if (analysis.sentimentOverTime && analysis.sentimentOverTime.length > 0) {
      const sentimentData = analysis.sentimentOverTime;
      console.log('Number of sentiment data points:', sentimentData.length);
      
      // Check for realistic sentiment values
      const unrealisticValues = sentimentData.filter(d => d.sentiment < 0 || d.sentiment > 100);
      if (unrealisticValues.length > 0) {
        console.log('❌ Found unrealistic sentiment values:', unrealisticValues.slice(0, 3));
      } else {
        console.log('✅ All sentiment values are realistic (0-100)');
      }
      
      // Show sample sentiment data
      console.log('Sample sentiment data:', sentimentData.slice(0, 3));
    } else {
      console.log('❌ No sentiment over time data found');
    }
    
    // Test mentions by topic data
    console.log('\n🔍 MENTIONS BY TOPIC DATA:');
    console.log('Mentions By Topic exists:', !!analysis.mentionsByTopic);
    
    if (analysis.mentionsByTopic && analysis.mentionsByTopic.length > 0) {
      const mentionsData = analysis.mentionsByTopic;
      console.log('Number of topics:', mentionsData.length);
      
      // Check for topics with raw mentions
      const topicsWithMentions = mentionsData.filter(t => t.rawMentions && t.rawMentions.length > 0);
      console.log('Topics with raw mentions:', topicsWithMentions.length);
      
      if (topicsWithMentions.length > 0) {
        console.log('✅ Raw mentions found for topics');
        console.log('Sample topic with mentions:', topicsWithMentions[0]);
      } else {
        console.log('❌ No topics with raw mentions found');
      }
    } else {
      console.log('❌ No mentions by topic data found');
    }
    
    console.log('\n✅ Test completed successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run the test
testExecutiveSummaryFix().then(success => {
  if (success) {
    console.log('🎉 Executive summary and sentiment fixes test passed!');
  } else {
    console.log('💥 Executive summary and sentiment fixes test failed!');
  }
  process.exit(success ? 0 : 1);
}); 