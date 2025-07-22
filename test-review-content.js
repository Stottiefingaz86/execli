const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testReviewContent() {
  console.log('🔍 Testing review content analysis...');
  
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

    // Get reviews from the database
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('company_id', report.company_id)
      .limit(10);

    if (reviewsError) {
      console.error('❌ Error fetching reviews:', reviewsError);
      return;
    }

    console.log('\n📝 REVIEW CONTENT ANALYSIS:');
    console.log('='.repeat(50));
    
    // Analyze what topics are actually mentioned
    const allText = reviews.map(r => r.text.toLowerCase()).join(' ');
    
    console.log('\n🔍 TOPICS MENTIONED IN REVIEWS:');
    
    // Check for arcade/casino game terms
    const arcadeTerms = ['arcade', 'bingo', 'picture bingo', 'temple', 'parade', 'phoenix', 'jackpot', 'jackpots'];
    arcadeTerms.forEach(term => {
      const count = (allText.match(new RegExp(term, 'g')) || []).length;
      if (count > 0) {
        console.log(`   ✅ "${term}": ${count} mentions`);
      }
    });
    
    // Check for sports betting terms
    const sportsTerms = ['sport', 'betting', 'football', 'basketball', 'odds'];
    sportsTerms.forEach(term => {
      const count = (allText.match(new RegExp(term, 'g')) || []).length;
      if (count > 0) {
        console.log(`   ✅ "${term}": ${count} mentions`);
      }
    });
    
    // Check for chat/community terms
    const chatTerms = ['chat', 'chat master', 'chat host', 'regulars', 'chat room'];
    chatTerms.forEach(term => {
      const count = (allText.match(new RegExp(term, 'g')) || []).length;
      if (count > 0) {
        console.log(`   ✅ "${term}": ${count} mentions`);
      }
    });
    
    // Check for winner/lucky terms
    const winnerTerms = ['winner', 'winners', 'win', 'wins', 'lucky', 'lucky people'];
    winnerTerms.forEach(term => {
      const count = (allText.match(new RegExp(term, 'g')) || []).length;
      if (count > 0) {
        console.log(`   ✅ "${term}": ${count} mentions`);
      }
    });
    
    console.log('\n📝 SAMPLE REVIEWS:');
    reviews.slice(0, 3).forEach((review, index) => {
      console.log(`\n${index + 1}. ${review.text.substring(0, 200)}...`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testReviewContent(); 