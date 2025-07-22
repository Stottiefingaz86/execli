const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testFrontendData() {
  console.log('🔍 Testing frontend data processing...');
  
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
      console.log('❌ No reports found');
      return;
    }

    const report = reports[0];
    console.log(`📊 Testing report: ${report.id}`);
    console.log(`🏢 Business: ${report.business_name}`);
    console.log(`📅 Created: ${report.created_at}`);

    // Check if analysis data exists
    if (!report.analysis) {
      console.log('❌ No analysis data found');
      return;
    }

    console.log('✅ Analysis data found!');
    console.log('Analysis keys:', Object.keys(report.analysis));

    // Check executive summary sections
    const executiveSummary = report.analysis.executiveSummary;
    if (executiveSummary) {
      console.log('\n📊 EXECUTIVE SUMMARY SECTIONS:');
      
      if (executiveSummary.praisedSections) {
        console.log(`🎉 Praised Sections: ${executiveSummary.praisedSections.length}`);
        executiveSummary.praisedSections.forEach((section, index) => {
          console.log(`  ${index + 1}. ${section.topic} (${section.percentage})`);
          if (section.examples && section.examples.length > 0) {
            console.log(`     Examples: ${section.examples[0].substring(0, 100)}...`);
          }
        });
      }

      if (executiveSummary.painPoints) {
        console.log(`⚠️ Pain Points: ${executiveSummary.painPoints.length}`);
        executiveSummary.painPoints.forEach((point, index) => {
          console.log(`  ${index + 1}. ${point.topic} (${point.percentage})`);
          if (point.examples && point.examples.length > 0) {
            console.log(`     Examples: ${point.examples[0].substring(0, 100)}...`);
          }
        });
      }

      if (executiveSummary.alerts) {
        console.log(`🚨 Alerts: ${executiveSummary.alerts.length}`);
        executiveSummary.alerts.forEach((alert, index) => {
          console.log(`  ${index + 1}. ${alert.type}: ${alert.message}`);
        });
      }
    }

    // Check mentions by topic
    const mentionsByTopic = report.analysis.mentionsByTopic;
    if (mentionsByTopic) {
      console.log('\n📊 MENTIONS BY TOPIC:');
      console.log(`Total topics: ${mentionsByTopic.length}`);
      
      // Find topics with negative sentiment
      const negativeTopics = mentionsByTopic.filter(topic => 
        topic.negative > topic.positive && topic.negative > 0
      );
      
      console.log(`Topics with negative sentiment: ${negativeTopics.length}`);
      negativeTopics.slice(0, 5).forEach((topic, index) => {
        const percentage = Math.round((topic.negative / (topic.positive + topic.negative)) * 100);
        console.log(`  ${index + 1}. ${topic.topic}: ${percentage}% negative (${topic.negative} mentions)`);
      });
    }

    // Test the analyzeTopicInsights function logic
    console.log('\n🧪 TESTING INSIGHT GENERATION:');
    if (mentionsByTopic && mentionsByTopic.length > 0) {
      const testTopic = mentionsByTopic[0];
      console.log(`Testing topic: ${testTopic.topic}`);
      console.log(`Raw mentions: ${testTopic.rawMentions?.length || 0}`);
      
      if (testTopic.rawMentions && testTopic.rawMentions.length > 0) {
        console.log(`Sample mention: ${testTopic.rawMentions[0].substring(0, 100)}...`);
      }
    }

    console.log('\n✅ Frontend data test completed!');

  } catch (error) {
    console.error('❌ Error testing frontend data:', error);
  }
}

testFrontendData(); 