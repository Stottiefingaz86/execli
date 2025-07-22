const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testTopicDetection() {
  console.log('🔍 Testing topic detection...');
  
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
    console.log(`📊 Report: ${report.id}`);
    console.log(`🏢 Business: ${report.business_name}`);
    console.log(`📈 Status: ${report.status}`);

    if (report.analysis && report.analysis.mentionsByTopic) {
      console.log('\n🎯 TOPICS DETECTED:');
      console.log('='.repeat(50));
      
      report.analysis.mentionsByTopic.forEach((topic, index) => {
        console.log(`\n${index + 1}. ${topic.topic.toUpperCase()}:`);
        console.log(`   📊 Sentiment: ${topic.positive}% positive, ${topic.negative}% negative, ${topic.neutral}% neutral`);
        console.log(`   📈 Total mentions: ${topic.total}`);
        console.log(`   💡 Context: ${topic.context}`);
        console.log(`   ⚠️ Main concern: ${topic.mainConcern}`);
        if (topic.specificIssues && topic.specificIssues.length > 0) {
          console.log(`   🔍 Specific issues: ${topic.specificIssues.join(', ')}`);
        }
        
        // Show sample reviews
        if (topic.rawMentions && topic.rawMentions.length > 0) {
          console.log(`   📝 Sample reviews:`);
          topic.rawMentions.slice(0, 2).forEach((review, i) => {
            console.log(`      ${i + 1}. ${review.substring(0, 100)}...`);
          });
        }
        console.log('   ' + '-'.repeat(40));
      });
    } else {
      console.log('❌ No mentions by topic data found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testTopicDetection(); 