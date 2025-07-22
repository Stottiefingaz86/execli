const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testExecutiveSummary() {
  console.log('🔍 Testing executive summary data...');
  
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

    if (report.analysis && report.analysis.executiveSummary) {
      const es = report.analysis.executiveSummary;
      console.log('\n🎯 EXECUTIVE SUMMARY DATA:');
      console.log('='.repeat(50));
      
      console.log(`📊 Overview: ${es.overview?.substring(0, 100)}...`);
      console.log(`📈 Sentiment Change: ${es.sentimentChange}`);
      console.log(`📊 Volume Change: ${es.volumeChange}`);
      console.log(`🏆 Most Praised: ${es.mostPraised}`);
      console.log(`⚠️ Top Complaint: ${es.topComplaint}`);
      console.log(`📝 Context: ${es.context}`);
      console.log(`📊 Data Source: ${es.dataSource}`);
      
      console.log(`\n✅ Praised Sections: ${es.praisedSections?.length || 0}`);
      if (es.praisedSections && es.praisedSections.length > 0) {
        es.praisedSections.forEach((section, index) => {
          console.log(`   ${index + 1}. ${section.topic} (${section.percentage})`);
          console.log(`      Examples: ${section.examples?.length || 0}`);
        });
      }
      
      console.log(`\n❌ Pain Points: ${es.painPoints?.length || 0}`);
      if (es.painPoints && es.painPoints.length > 0) {
        es.painPoints.forEach((point, index) => {
          console.log(`   ${index + 1}. ${point.topic} (${point.percentage})`);
          console.log(`      Examples: ${point.examples?.length || 0}`);
        });
      }
      
      console.log(`\n🚨 Alerts: ${es.alerts?.length || 0}`);
      if (es.alerts && es.alerts.length > 0) {
        es.alerts.forEach((alert, index) => {
          console.log(`   ${index + 1}. ${alert.type}: ${alert.message} (${alert.metric})`);
        });
      }
      
      console.log(`\n💡 Top Highlights: ${es.topHighlights?.length || 0}`);
      if (es.topHighlights && es.topHighlights.length > 0) {
        es.topHighlights.forEach((highlight, index) => {
          console.log(`   ${index + 1}. ${highlight.title}`);
          console.log(`      ${highlight.description}`);
        });
      }
      
    } else {
      console.log('❌ No executive summary data found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testExecutiveSummary(); 