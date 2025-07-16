import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Apify actors for different platforms
const APIFY_ACTORS: { [platform: string]: string } = {
  'Trustpilot': 'apify/trustpilot-scraper',
  'Google': 'apify/google-reviews-scraper',
  'Yelp': 'apify/yelp-scraper'
};

interface Review {
  text: string;
  rating?: number;
  date?: string;
  source: string;
  url?: string;
  author?: string;
}

interface ScrapingResult {
  platform: string;
  success: boolean;
  reviews: Review[];
  reviewCount: number;
  error?: string;
}

// Run Apify actor
async function runApifyActor(actorId: string, input: any, token: string): Promise<any[]> {
  console.log(`Running Apify actor ${actorId} with input:`, JSON.stringify(input, null, 2));
  
  const response = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Apify API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const runData = await response.json();
  const runId = runData.data.id;
  console.log(`Apify run started with ID: ${runId}`);

  // Wait for completion
  let finished = false;
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max wait

  while (!finished && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    attempts++;

    const statusResponse = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs/${runId}?token=${token}`);
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      if (statusData.data.status === 'SUCCEEDED') {
        finished = true;
      } else if (statusData.data.status === 'FAILED') {
        throw new Error(`Apify run failed: ${statusData.data.meta?.errorMessage || 'Unknown error'}`);
      }
    }
  }

  if (!finished) {
    throw new Error('Apify run timed out');
  }

  // Get results
  const resultsResponse = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs/${runId}/dataset/items?token=${token}`);
  if (!resultsResponse.ok) {
    throw new Error(`Failed to get Apify results: ${resultsResponse.status}`);
  }

  const results = await resultsResponse.json();
  console.log(`Apify run completed. Got ${results.length} items.`);
  return results;
}

// Extract JSON from OpenAI response
function extractJsonFromOpenAI(content: string): any {
  // Try to find JSON in the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('Failed to parse JSON from OpenAI response:', e);
    }
  }
  
  // Fallback: try to parse the entire content
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('Failed to parse OpenAI response as JSON:', e);
    throw new Error('Invalid JSON response from OpenAI');
  }
}

// Analyze reviews with OpenAI
async function analyzeReviewsWithOpenAI(reviews: Review[], businessName: string): Promise<any> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY is required');
  }

  if (reviews.length === 0) {
    return {
      summary: 'No reviews found to analyze.',
      sentiment: 'neutral',
      themes: [],
      recommendations: []
    };
  }

  // Prepare review data for analysis
  const reviewTexts = reviews.map(r => r.text).join('\n\n');
  const totalReviews = reviews.length;
  const avgRating = reviews.filter(r => r.rating).reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.filter(r => r.rating).length || 0;

  // Extract real topics from reviews
  const topics = extractTopicsFromReviews(reviews);
  const sentimentAnalysis = analyzeSentimentByTopic(reviews);
  const realInsights = generateRealInsights(reviews, businessName);

  const prompt = `You are a Voice of Customer (VOC) analysis expert. Analyze the following customer reviews for ${businessName} and provide a comprehensive VOC report based ONLY on the actual review data provided.

REVIEWS:
${reviewTexts}

TOTAL REVIEWS: ${totalReviews}
AVERAGE RATING: ${avgRating.toFixed(1)}/5

IMPORTANT: Only generate data based on the actual reviews provided. Do NOT make up fake data, fake competitors, or fake time series data. If there are only 40 reviews, do not generate 6 months of sentiment data. Only analyze what is actually present in the reviews.

Please provide a comprehensive analysis in the following JSON format, using ONLY real data from the reviews:

{
  "executiveSummary": {
    "sentimentChange": "Based on actual review sentiment",
    "volumeChange": "Based on actual review volume",
    "mostPraised": "Most mentioned positive topic from reviews",
    "topComplaint": "Most mentioned negative topic from reviews",
    "overview": "Summary based on actual review content",
    "alerts": [
      {
        "type": "warning",
        "message": "Based on actual negative feedback patterns",
        "metric": "Specific topic from reviews"
      }
    ]
  },
  "keyInsights": [
    {
      "insight": "Real insight from actual review content",
      "direction": "up/down based on actual sentiment",
      "mentionCount": "Actual count from reviews",
      "platforms": ["Actual platforms where reviews were found"],
      "impact": "high/medium/low based on frequency",
      "suggestions": ["Based on actual review feedback"],
      "reviews": [
        {
          "text": "Actual review text",
          "topic": "Topic extracted from review",
          "sentiment": "positive/negative/neutral"
        }
      ]
    }
  ],
  "trendingTopics": [
    {
      "topic": "Topic actually mentioned in reviews",
      "growth": "Based on actual frequency",
      "sentiment": "Based on actual sentiment",
      "volume": "Actual mention count",
      "keyInsights": ["Based on actual review content"]
    }
  ],
  "mentionsByTopic": [
    {
      "topic": "Topic actually found in reviews",
      "positive": "Actual positive percentage",
      "neutral": "Actual neutral percentage", 
      "negative": "Actual negative percentage",
      "total": "Total mentions of this topic"
    }
  ],
  "marketGaps": [
    {
      "gap": "Unmet need identified in reviews",
      "mentions": "Actual mention count",
      "suggestion": "Actionable suggestion based on reviews"
    }
  ],
  "advancedMetrics": {
    "trustScore": "Based on actual review sentiment",
    "repeatComplaints": "Based on actual complaint patterns",
    "avgResolutionTime": "Based on actual review mentions",
    "vocVelocity": "Based on actual review volume"
  },
  "suggestedActions": [
    "Action based on actual review feedback"
  ],
  "vocDigest": {
    "summary": "Summary based on actual review content",
    "highlights": [
      "Key point from actual reviews"
    ]
  }
}

Remember: Only use data that actually exists in the provided reviews. Do not generate fake competitors, fake time series, or fake metrics.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a Voice of Customer analysis expert. Always provide real data based on actual reviews. Never generate fake data, fake competitors, or fake time series.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract JSON from the response
    const analysis = extractJsonFromOpenAI(content);
    
    // Add real data analysis
    analysis.realTopics = topics;
    analysis.realSentiment = sentimentAnalysis;
    analysis.realInsights = realInsights;
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing reviews with OpenAI:', error);
    throw error;
  }
}

// Helper function to extract real topics from reviews
function extractTopicsFromReviews(reviews: Review[]): string[] {
  const topics = new Set<string>();
  const gamblingTopics = [
    'deposits', 'withdrawals', 'poker', 'bonus', 'promotions', 'sports', 'casino',
    'customer service', 'trust', 'payout', 'games', 'betting', 'odds', 'live betting',
    'mobile app', 'website', 'support', 'account', 'verification', 'limits'
  ];
  
  const reviewText = reviews.map(r => r.text.toLowerCase()).join(' ');
  
  gamblingTopics.forEach(topic => {
    if (reviewText.includes(topic)) {
      topics.add(topic);
    }
  });
  
  return Array.from(topics);
}

// Helper function to analyze sentiment by topic
function analyzeSentimentByTopic(reviews: Review[]): any {
  const sentimentByTopic: { [topic: string]: { positive: number, negative: number, neutral: number } } = {};
  
  const topics = extractTopicsFromReviews(reviews);
  
  topics.forEach(topic => {
    const topicReviews = reviews.filter(r => r.text.toLowerCase().includes(topic));
    let positive = 0, negative = 0, neutral = 0;
    
    topicReviews.forEach(review => {
      const text = review.text.toLowerCase();
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'best', 'perfect', 'awesome'];
      const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointed', 'scam'];
      
      const positiveCount = positiveWords.filter(word => text.includes(word)).length;
      const negativeCount = negativeWords.filter(word => text.includes(word)).length;
      
      if (positiveCount > negativeCount) positive++;
      else if (negativeCount > positiveCount) negative++;
      else neutral++;
    });
    
    sentimentByTopic[topic] = { positive, negative, neutral };
  });
  
  return sentimentByTopic;
}

// Helper function to generate real insights
function generateRealInsights(reviews: Review[], businessName: string): any[] {
  const insights: any[] = [];
  const topics = extractTopicsFromReviews(reviews);
  const sentimentByTopic = analyzeSentimentByTopic(reviews);
  
  topics.forEach(topic => {
    const sentiment = sentimentByTopic[topic];
    const total = sentiment.positive + sentiment.negative + sentiment.neutral;
    
    if (total > 0) {
      const percentage = Math.round((sentiment.positive / total) * 100);
      const direction = sentiment.positive > sentiment.negative ? 'up' : 'down';
      
      insights.push({
        insight: `${topic} mentioned in ${total} reviews with ${percentage}% positive sentiment`,
        direction,
        mentionCount: total,
        platforms: ['Trustpilot'], // Based on actual source
        impact: total > 5 ? 'high' : total > 2 ? 'medium' : 'low',
        topic
      });
    }
  });
  
  return insights;
}

serve(async (req) => {
  try {
    const { report_id, company_id, business_name, business_url } = await req.json();
    
    if (!report_id || !company_id || !business_name) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    async function updateProgress(message: string, status: string = 'processing') {
      await supabase.from('voc_reports').update({ progress_message: message, status }).eq('id', report_id);
    }

    await updateProgress('Starting sync...');

    // Get existing review sources for this report
    const { data: reportData } = await supabase
      .from('voc_reports')
      .select('sources, detected_sources')
      .eq('id', report_id)
      .single();

    if (!reportData) {
      return new Response(JSON.stringify({ error: 'Report not found' }), { status: 404 });
    }

    const sources = reportData.sources || reportData.detected_sources || [];
    const allReviews: Review[] = [];
    const scrapingResults: ScrapingResult[] = [];

    // Get Apify token
    const APIFY_TOKEN = Deno.env.get('APIFY_TOKEN');
    if (!APIFY_TOKEN) {
      await updateProgress('Missing Apify API token', 'error');
      return new Response(JSON.stringify({ error: 'Missing Apify API token' }), { status: 500 });
    }

    // Sync each source
    for (const source of sources) {
      if (!source.url || !source.platform) continue;

      await updateProgress(`Syncing ${source.platform}...`);

      try {
        if (source.platform === 'Trustpilot' && APIFY_ACTORS[source.platform]) {
          // Send only companyDomain as input, matching UI behavior
          let companyDomain = source.url;
          const domainMatch = source.url.match(/trustpilot\.com\/review\/([^/?#]+)/i);
          if (domainMatch) {
            companyDomain = domainMatch[1];
          }
          if (!companyDomain && business_url) {
            try {
              const businessDomain = new URL(business_url).hostname.replace('www.', '');
              if (businessDomain) {
                companyDomain = businessDomain;
              }
            } catch (e) {}
          }
          if (!companyDomain && business_name) {
            companyDomain = business_name.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/^www\./, '');
          }
          if (!companyDomain || companyDomain.length < 2) {
            throw new Error(`No valid company domain found for Trustpilot scraping. URL: ${source.url}, Business: ${business_name}`);
          }

          const apifyInput = {
            companyUrl: source.url,
            startPage: 1,
            count: 300, // Increased from 100 to get more reviews
            maxPages: 3, // Fetch up to 3 pages
            mode: "reviews"
          };

          console.log(`Sending Apify input for Trustpilot sync:`, JSON.stringify(apifyInput, null, 2));
          const reviews = await runApifyActor(APIFY_ACTORS[source.platform], apifyInput, APIFY_TOKEN);
          
          const mappedReviews = reviews.map((r: any) => ({
            text: r.text || r.reviewText || r.review || r.title || r.body || r.content || '',
            rating: r.rating || r.score || r.stars || undefined,
            date: r.date || r.reviewDate || r.createdAt || undefined,
            source: source.platform,
            url: r.url || r.reviewUrl || source.url,
            author: r.author || r.reviewer || r.user || r.companyName || undefined
          })).filter((r: Review) => r.text && r.text.length > 0);

          // Check for duplicates before inserting
          const existingReviews = await supabase
            .from('reviews')
            .select('review_text, reviewer_name, review_date')
            .eq('company_id', company_id)
            .eq('source_id', source.platform);

          const newReviews = mappedReviews.filter(newReview => {
            return !existingReviews.data?.some(existing => 
              existing.review_text === newReview.text &&
              existing.reviewer_name === newReview.author &&
              existing.review_date === newReview.date
            );
          });

          if (newReviews.length > 0) {
            await supabase.from('reviews').insert(
              newReviews.map(r => ({
                company_id,
                review_text: r.text,
                rating: r.rating,
                reviewer_name: r.author,
                review_date: r.date,
                source_id: r.source,
                url: r.url
              }))
            );
          }

          allReviews.push(...newReviews);
          scrapingResults.push({
            platform: source.platform,
            success: true,
            reviews: newReviews,
            reviewCount: newReviews.length
          });

          await updateProgress(`Synced ${source.platform} (${newReviews.length} new reviews)`);
        }
      } catch (err) {
        console.error(`Error syncing ${source.platform}:`, err);
        scrapingResults.push({
          platform: source.platform,
          success: false,
          reviews: [],
          reviewCount: 0,
          error: err instanceof Error ? err.message : String(err)
        });
        await updateProgress(`Error syncing ${source.platform}: ${err.message || err}`, 'error');
      }
    }

    // Get all reviews for this company (including existing ones)
    const { data: allCompanyReviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('company_id', company_id);

    const totalReviews = allCompanyReviews || [];

    // Re-analyze with all reviews
    await updateProgress('Re-analyzing with updated data...');
    let analysis: any = {};
    
    try {
      if (totalReviews.length > 0) {
        const reviewObjects = totalReviews.map(r => ({
          text: r.review_text,
          rating: r.rating,
          date: r.review_date,
          source: r.source_id,
          url: r.url,
          author: r.reviewer_name
        }));
        
        analysis = await analyzeReviewsWithOpenAI(reviewObjects, business_name);
      } else {
        analysis = { summary: 'No reviews found to analyze.' };
      }
    } catch (err) {
      console.error('Error during AI analysis:', err);
      await updateProgress('Error during analysis: ' + (err.message || err), 'error');
      return new Response(JSON.stringify({ error: 'Error during analysis' }), { status: 500 });
    }

    // Update report with new analysis
    await updateProgress('Updating report...');
    
    const sourcesWithMeta = scrapingResults.map(result => {
      const source = sources.find(s => s.platform === result.platform);
      return {
        platform: result.platform,
        url: source?.url || null,
        reviewCount: (source?.reviewCount || 0) + result.reviewCount,
        success: result.success,
        error: result.error || null,
        reviews: result.reviews || [],
        hasRealData: result.success && result.reviewCount > 0,
        lastSync: new Date().toISOString()
      };
    });

    // Update the report with new analysis and sources
    await supabase.from('voc_reports').update({
      analysis: analysis,
      sources: sourcesWithMeta,
      detected_sources: sourcesWithMeta,
      processed_at: new Date().toISOString(),
      status: 'completed',
      progress_message: `Sync completed. Total reviews: ${totalReviews.length}`
    }).eq('id', report_id);

    console.log('Sync completed successfully');
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Sync completed successfully',
      newReviews: allReviews.length,
      totalReviews: totalReviews.length
    }));

  } catch (error) {
    console.error('Error in sync function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), { status: 500 });
  }
}); 