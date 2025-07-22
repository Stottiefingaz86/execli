const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = 'https://efiioacrgwuewmroztth.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFixes() {
  console.log('🔍 Testing fixes for VOC report system...');
  
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
    console.log(`📊 Testing report: ${latestReport.id}`);
    console.log(`📅 Created: ${latestReport.created_at}`);
    console.log(`📈 Status: ${latestReport.status}`);
    
    if (latestReport.analysis) {
      const analysis = latestReport.analysis;
      console.log('\n🔍 Executive Summary Analysis:');
      
      // Check praised sections
      if (analysis.executiveSummary?.praisedSections) {
        console.log(`✅ Praised Sections: ${analysis.executiveSummary.praisedSections.length} items`);
        analysis.executiveSummary.praisedSections.forEach((section, i) => {
          console.log(`   ${i + 1}. ${section.topic} (${section.percentage})`);
        });
      } else {
        console.log('❌ No praised sections found');
      }
      
      // Check pain points
      if (analysis.executiveSummary?.painPoints) {
        console.log(`✅ Pain Points: ${analysis.executiveSummary.painPoints.length} items`);
        analysis.executiveSummary.painPoints.forEach((point, i) => {
          console.log(`   ${i + 1}. ${point.topic} (${point.percentage})`);
        });
      } else {
        console.log('❌ No pain points found');
      }
      
      // Check alerts
      if (analysis.executiveSummary?.alerts) {
        console.log(`✅ Alerts: ${analysis.executiveSummary.alerts.length} items`);
        analysis.executiveSummary.alerts.forEach((alert, i) => {
          console.log(`   ${i + 1}. ${alert.type}: ${alert.message} (${alert.metric})`);
        });
      } else {
        console.log('❌ No alerts found');
      }
      
      // Check mentions by topic for Casino/Sports
      if (analysis.mentionsByTopic) {
        console.log('\n🎰 Casino/Sports Topics Check:');
        const casinoTopics = analysis.mentionsByTopic.filter(topic => 
          topic.topic.toLowerCase().includes('casino') || 
          topic.topic.toLowerCase().includes('sport') ||
          topic.topic.toLowerCase().includes('poker') ||
          topic.topic.toLowerCase().includes('betting')
        );
        
        if (casinoTopics.length > 0) {
          console.log(`✅ Found ${casinoTopics.length} casino/sports topics:`);
          casinoTopics.forEach(topic => {
            console.log(`   - ${topic.topic}: ${topic.positive}% positive, ${topic.negative}% negative, ${topic.total} total`);
          });
        } else {
          console.log('❌ No casino/sports topics found');
        }
      }
      
      // Check sentiment over time
      if (analysis.sentimentOverTime) {
        console.log('\n📈 Sentiment Over Time Check:');
        const recentSentiment = analysis.sentimentOverTime.slice(-5);
        console.log('Last 5 days sentiment values:');
        recentSentiment.forEach(day => {
          console.log(`   ${day.date}: ${day.sentiment} (${day.reviewCount} reviews)`);
        });
      }
      
      // Check volume over time
      if (analysis.volumeOverTime) {
        console.log('\n📊 Volume Over Time Check:');
        const recentVolume = analysis.volumeOverTime.slice(-5);
        console.log('Last 5 days volume:');
        recentVolume.forEach(day => {
          console.log(`   ${day.date}: ${day.volume} reviews${day.context ? ` - ${day.context}` : ''}`);
        });
      }
      
    } else {
      console.log('❌ No analysis data found');
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

testFixes(); 