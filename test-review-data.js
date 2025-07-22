const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://efiioacrgwuewmroztth.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmaWlvYWNyZ3d1ZXdtcm96dHRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzQ5NzI5NywiZXhwIjoyMDUzMDczMjk3fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testReviewData() {
  try {
    console.log('🔍 Checking latest report and its reviews...');
    
    // Get the latest report
    const { data: reports, error: reportsError } = await supabase
      .from('voc_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (reportsError) {
      console.error('Error fetching reports:', reportsError);
      return;
    }
    
    if (!reports || reports.length === 0) {
      console.log('No reports found');
      return;
    }
    
    const latestReport = reports[0];
    console.log(`📊 Latest report: ${latestReport.id}`);
    console.log(`🏢 Business: ${latestReport.business_name}`);
    
    // Get reviews for this report
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('company_id', latestReport.company_id)
      .order('created_at', { ascending: false });
    
    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      return;
    }
    
    console.log(`📝 Found ${reviews.length} reviews`);
    
    // Test sentiment analysis
    const positiveWords = ['good', 'great', 'love', 'excellent', 'amazing', 'perfect', 'easy', 'quick', 'fast', 'smooth', 'simple', 'helpful', 'fantastic', 'outstanding', 'wonderful', 'awesome', 'reliable', 'trustworthy', 'professional', 'responsive', 'efficient', 'convenient', 'satisfied', 'happy', 'pleased', 'impressed', 'recommend', 'best', 'top', 'superior'];
    const negativeWords = ['bad', 'terrible', 'hate', 'problem', 'issue', 'waiting', 'delay', 'locked', 'predatory', 'unfair', 'dangerous', 'warn', 'serious', 'no resolution', 'ridiculous', 'scam', 'ignoring', 'no response', 'bot', 'cheat', 'rigged', 'poor', 'awful', 'disappointed', 'worst', 'cheap', 'broken', 'slow', 'unhelpful', 'unresponsive', 'useless', 'rude', 'expensive', 'overpriced', 'costly', 'high', 'late', 'delayed', 'never arrived', 'difficult', 'confusing', 'complicated', 'reject', 'frustrated', 'annoyed', 'angry', 'upset', 'disgusted', 'horrible', 'nightmare'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;
    
    console.log('\n🔍 ANALYZING REVIEWS:');
    reviews.slice(0, 5).forEach((review, index) => {
      const text = review.text.toLowerCase();
      const positiveCount = positiveWords.filter(word => text.includes(word)).length;
      const negativeCount = negativeWords.filter(word => text.includes(word)).length;
      
      console.log(`\nReview ${index + 1}:`);
      console.log(`Text: ${review.text.substring(0, 100)}...`);
      console.log(`Rating: ${review.rating || 'N/A'}`);
      console.log(`Positive words: ${positiveCount}`);
      console.log(`Negative words: ${negativeCount}`);
      console.log(`Sentiment: ${positiveCount > negativeCount ? 'POSITIVE' : negativeCount > positiveCount ? 'NEGATIVE' : 'NEUTRAL'}`);
      
      if (positiveCount > negativeCount) positiveCount++;
      else if (negativeCount > positiveCount) negativeCount++;
      else neutralCount++;
    });
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`Positive reviews: ${positiveCount}`);
    console.log(`Negative reviews: ${negativeCount}`);
    console.log(`Neutral reviews: ${neutralCount}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testReviewData(); 