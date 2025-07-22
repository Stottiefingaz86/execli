const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://efiioacrgwuewmroztth.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmaWlvYWNyZ3d1ZXdtcm96dHRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ1OTM1MCwiZXhwIjoyMDY3MDM1MzUwfQ.LAKbpJh_ZaQtt6drVt6nkmyMYwwD4cAIGPhZ_s8eAN4";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testReviewContent() {
  console.log('🔍 Testing review content and ratings...');
  
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
    
    // Get reviews for this report
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('company_id', report.company_id)
      .limit(10);

    if (reviewsError) {
      console.error('❌ Error fetching reviews:', reviewsError);
      return;
    }

    console.log(`\n📝 Found ${reviews.length} reviews`);
    
    // Analyze review ratings
    const ratings = reviews.map(r => r.rating || 0);
    const positiveReviews = ratings.filter(r => r >= 4).length;
    const negativeReviews = ratings.filter(r => r <= 2).length;
    const neutralReviews = ratings.length - positiveReviews - negativeReviews;
    
    console.log(`\n📊 Rating Analysis:`);
    console.log(`   Positive (4-5): ${positiveReviews}`);
    console.log(`   Neutral (3): ${neutralReviews}`);
    console.log(`   Negative (1-2): ${negativeReviews}`);
    
    // Show sample reviews
    console.log(`\n📝 Sample Reviews:`);
    reviews.slice(0, 5).forEach((review, index) => {
      console.log(`\n${index + 1}. Rating: ${review.rating || 'N/A'}`);
      console.log(`   Text: ${review.text?.substring(0, 100)}...`);
      console.log(`   Keywords: ${review.text?.toLowerCase().includes('withdrawal') ? 'withdrawal ' : ''}${review.text?.toLowerCase().includes('service') ? 'service ' : ''}${review.text?.toLowerCase().includes('deposit') ? 'deposit ' : ''}${review.text?.toLowerCase().includes('bonus') ? 'bonus ' : ''}${review.text?.toLowerCase().includes('game') ? 'game ' : ''}`);
    });
    
    // Test the functions manually
    console.log(`\n🧪 Testing Functions:`);
    
    // Test praised sections
    const positiveReviewsData = reviews.filter(r => (r.rating || 0) >= 4);
    console.log(`   Positive reviews for praised sections: ${positiveReviewsData.length}`);
    
    positiveReviewsData.forEach(review => {
      const text = review.text?.toLowerCase() || '';
      if (text.includes('service') || text.includes('support') || text.includes('help')) {
        console.log(`   ✅ Found service-related positive review`);
      }
      if (text.includes('withdrawal') || text.includes('payout')) {
        console.log(`   ✅ Found withdrawal-related positive review`);
      }
      if (text.includes('deposit') || text.includes('payment')) {
        console.log(`   ✅ Found deposit-related positive review`);
      }
    });
    
    // Test pain points
    const negativeReviewsData = reviews.filter(r => (r.rating || 0) <= 2);
    console.log(`   Negative reviews for pain points: ${negativeReviewsData.length}`);
    
    negativeReviewsData.forEach(review => {
      const text = review.text?.toLowerCase() || '';
      if (text.includes('withdrawal') || text.includes('payout')) {
        console.log(`   ❌ Found withdrawal-related negative review`);
      }
      if (text.includes('service') || text.includes('support')) {
        console.log(`   ❌ Found service-related negative review`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testReviewContent(); 