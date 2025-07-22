const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testFrontendDataProcessing() {
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

    // Simulate the frontend data processing
    const reportData = report;
    
    // Simulate the frontend data processing logic
    const data = {
      ...reportData,
      // If analysis is nested, spread it out
      ...(reportData.analysis || {}),
      // Ensure we have the basic fields
      business_name: reportData.business_name,
      business_url: reportData.business_url,
      // Handle different data structures - USE BACKEND DATA AS-IS
      executiveSummary:
        reportData.analysis?.executiveSummary || reportData.executiveSummary,
      keyInsights: reportData.keyInsights || reportData.analysis?.keyInsights,
      sentimentOverTime:
        reportData.sentimentOverTime || reportData.analysis?.sentimentOverTime,
      volumeOverTime:
        reportData.volumeOverTime || reportData.analysis?.volumeOverTime,
      mentionsByTopic:
        reportData.mentionsByTopic || reportData.analysis?.mentionsByTopic,
      trendingTopics:
        reportData.trendingTopics || reportData.analysis?.trendingTopics,
      marketGaps: reportData.marketGaps || reportData.analysis?.marketGaps || [],
      advancedMetrics:
        reportData.advancedMetrics || reportData.analysis?.advancedMetrics,
      suggestedActions:
        reportData.suggestedActions ||
        reportData.analysis?.suggestedActions ||
        [],
      vocDigest: reportData.vocDigest || reportData.analysis?.vocDigest,
    };

    console.log('\n✅ FRONTEND DATA PROCESSING TEST:');
    console.log('executiveSummary exists:', !!data.executiveSummary);
    console.log('executiveSummary.painPoints length:', data.executiveSummary?.painPoints?.length || 0);
    console.log('executiveSummary.praisedSections length:', data.executiveSummary?.praisedSections?.length || 0);
    console.log('executiveSummary.alerts length:', data.executiveSummary?.alerts?.length || 0);

    // Test the pain points access
    if (data.executiveSummary?.painPoints) {
      console.log('\n📊 PAIN POINTS DATA:');
      data.executiveSummary.painPoints.forEach((point, index) => {
        console.log(`  ${index + 1}. ${point.topic} (${point.percentage})`);
        if (point.examples && point.examples.length > 0) {
          console.log(`     Example: ${point.examples[0].substring(0, 100)}...`);
        }
      });
    }

    // Test the praised sections access
    if (data.executiveSummary?.praisedSections) {
      console.log('\n🎉 PRAISED SECTIONS DATA:');
      data.executiveSummary.praisedSections.forEach((section, index) => {
        console.log(`  ${index + 1}. ${section.topic} (${section.percentage})`);
        if (section.examples && section.examples.length > 0) {
          console.log(`     Example: ${section.examples[0].substring(0, 100)}...`);
        }
      });
    }

    // Test the frontend rendering logic
    console.log('\n🧪 TESTING FRONTEND RENDERING LOGIC:');
    
    // Test pain points rendering
    const painPointsToRender = data.executiveSummary?.painPoints?.slice(0, 3);
    console.log('Pain points to render:', painPointsToRender?.length || 0);
    
    if (painPointsToRender && painPointsToRender.length > 0) {
      console.log('✅ Pain points will be rendered from backend data');
    } else {
      console.log('❌ Pain points will fall back to mentionsByTopic logic');
      
      // Test fallback logic
      const negativeTopics = data.mentionsByTopic?.filter(
        (topic) => topic.negative > topic.positive,
      ) || [];
      console.log('Fallback negative topics:', negativeTopics.length);
    }

    console.log('\n✅ Frontend data processing test completed!');

  } catch (error) {
    console.error('❌ Error testing frontend data processing:', error);
  }
}

testFrontendDataProcessing(); 