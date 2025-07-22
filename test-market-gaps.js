const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testMarketGaps() {
  console.log('🔍 Testing enhanced market gaps...');
  
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

    if (report.analysis && report.analysis.marketGaps) {
      console.log('\n🎯 ENHANCED MARKET GAPS:');
      console.log('='.repeat(50));
      
      report.analysis.marketGaps.forEach((gap, index) => {
        console.log(`\n${index + 1}. ${gap.gap.toUpperCase()}:`);
        console.log(`   📊 Mentions: ${gap.mentions}`);
        console.log(`   💡 Suggestion: ${gap.suggestion}`);
        console.log(`   📈 KPI Impact: ${gap.kpiImpact}`);
        console.log(`   🎯 Opportunity: ${gap.opportunity}`);
        console.log(`   ⚠️ Priority: ${gap.priority}`);
        console.log(`   👥 Customer Impact: ${gap.customerImpact}`);
        console.log(`   💼 Business Case: ${gap.businessCase}`);
        console.log(`   🛠️ Implementation: ${gap.implementation}`);
        if (gap.specificExamples && gap.specificExamples.length > 0) {
          console.log(`   🔍 Specific Examples: ${gap.specificExamples.join(', ')}`);
        }
        console.log('   ' + '-'.repeat(40));
      });
    } else {
      console.log('❌ No market gaps data found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testMarketGaps(); 