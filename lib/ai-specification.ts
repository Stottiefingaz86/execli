// AI Specification for VOC Report Generation
// This ensures the AI generates data that matches our demo report structure exactly

export interface VOCReportData {
  // Basic Info
  businessName: string
  businessUrl: string
  generatedAt: string
  totalReviews: number
  
  // Data Sources
  dataSources: {
    current: Array<{
      name: string
      status: 'active' | 'inactive' | 'error'
      reviews: number
      lastSync: string
      icon: string
    }>
    available: Array<{
      name: string
      price: number | string
      description: string
      icon: string
    }>
  }
  
  // Executive Summary
  executiveSummary: {
    sentimentChange: string // e.g., '+14%', '-5%'
    volumeChange: string // e.g., '+22%', '-8%'
    mostPraised: string // e.g., 'Shipping speed', 'Customer service'
    topComplaint: string // e.g., 'Return policy', 'Slow delivery'
    overview: string // 2-3 sentences summarizing the quarter
    alerts: Array<{
      type: 'warning' | 'info' | 'success'
      message: string
      metric: string
    }>
  }
  
  // Key Insights (4-6 insights)
  keyInsights: Array<{
    insight: string // Clear, actionable insight
    direction: 'up' | 'down' | 'neutral'
    mentions: number
    platforms: string[]
    impact: 'high' | 'medium' | 'low'
    reviews: Array<{
      text: string // Sample review text
      topic: string
      sentiment: 'positive' | 'negative' | 'neutral'
    }>
  }>
  
  // Sentiment Over Time (6 months)
  sentimentOverTime: Array<{
    month: string // 'Jan', 'Feb', etc.
    business: number // 0-100 sentiment score
    competitorA: number
    competitorB: number
    competitorC: number
  }>
  
  // Mentions by Topic (5-8 topics)
  mentionsByTopic: Array<{
    topic: string
    positive: number
    neutral: number
    negative: number
    total: number
  }>
  
  // Trending Topics (5-8 topics)
  trendingTopics: Array<{
    topic: string
    increase: string // e.g., '+15%', '-8%'
    sources: string[]
    sentiment: 'positive' | 'negative' | 'neutral'
  }>
  
  // Volume Over Time (8 weeks)
  volumeOverTime: Array<{
    week: string // 'W1', 'W2', etc.
    volume: number
    platform: string
  }>
  
  // Competitor Comparison (5-8 topics)
  competitorComparison: Array<{
    topic: string
    business: number // 1-5 rating
    competitorA: number
    competitorB: number
    competitorC: number
  }>
  
  // Market Gaps (4-6 gaps)
  marketGaps: Array<{
    gap: string // Specific unmet need
    mentions: number
    suggestion: string // Actionable suggestion
  }>
  
  // Advanced Metrics
  advancedMetrics: {
    trustScore: number // 0-100
    repeatComplaints: number // Percentage
    avgResolutionTime: string // e.g., '2.3 days', '4.5 hours'
    vocVelocity: string // e.g., '+8%', '-3%'
  }
  
  // Suggested Actions (4-6 actions)
  suggestedActions: string[]
  
  // VOC Digest
  vocDigest: {
    summary: string // 1-2 sentences
    highlights: string[] // 3-4 bullet points
  }
}

// AI Prompt Template
export const AI_PROMPT_TEMPLATE = `
You are an expert Voice of Customer (VOC) analyst. Analyze the provided reviews and generate a comprehensive VOC report in the EXACT JSON format specified below.

REVIEW DATA:
{reviews_data}

BUSINESS CONTEXT:
- Business Name: {business_name}
- Industry: {industry}
- Review Sources: {review_sources}
- Total Reviews: {total_reviews}

ANALYSIS REQUIREMENTS:

1. EXECUTIVE SUMMARY:
   - Calculate sentiment change (positive/negative percentage)
   - Calculate volume change (percentage)
   - Identify most praised aspect and top complaint
   - Write 2-3 sentence overview
   - Create 2-3 relevant alerts

2. KEY INSIGHTS (4-6 insights):
   - Each insight must be actionable and specific
   - Include direction (up/down/neutral)
   - Include mention count and platforms
   - Include impact level (high/medium/low)
   - Include 3 sample reviews per insight

3. SENTIMENT TIMELINE (6 months):
   - Generate monthly sentiment scores (0-100)
   - Include 3 competitor comparisons
   - Use realistic progression

4. TOPIC ANALYSIS (5-8 topics):
   - Extract specific topics (e.g., "Customer Service", "Product Quality")
   - Calculate positive/neutral/negative distribution
   - Ensure total adds up to 100

5. TRENDING TOPICS (5-8 topics):
   - Identify trending topics with percentage changes
   - Include sources and sentiment

6. VOLUME TIMELINE (8 weeks):
   - Generate weekly volume data
   - Show realistic fluctuations

7. COMPETITOR COMPARISON (5-8 topics):
   - Compare ratings (1-5 scale) across topics
   - Use realistic competitive positioning

8. MARKET GAPS (4-6 gaps):
   - Identify specific unmet customer needs
   - Provide actionable suggestions

9. ADVANCED METRICS:
   - Trust score (0-100)
   - Repeat complaints percentage
   - Average resolution time
   - VOC velocity percentage

10. SUGGESTED ACTIONS (4-6 actions):
    - Specific, actionable recommendations

11. VOC DIGEST:
    - Monthly summary
    - 3-4 key highlights

OUTPUT FORMAT - Return ONLY valid JSON in this exact structure:

{
  "businessName": "{business_name}",
  "businessUrl": "{business_url}",
  "generatedAt": "{current_date}",
  "totalReviews": {total_reviews},
  "dataSources": {
    "current": [
      {
        "name": "{platform_name}",
        "status": "active",
        "reviews": {review_count},
        "lastSync": "2 hours ago",
        "icon": "{platform_icon}"
      }
    ],
    "available": [
      {
        "name": "Trustpilot",
        "price": 19,
        "description": "Customer review platform",
        "icon": "⭐"
      }
    ]
  },
  "executiveSummary": {
    "sentimentChange": "{percentage}",
    "volumeChange": "{percentage}",
    "mostPraised": "{aspect}",
    "topComplaint": "{issue}",
    "overview": "{2-3_sentence_summary}",
    "alerts": [
      {
        "type": "warning",
        "message": "{alert_message}",
        "metric": "{metric_name}"
      }
    ]
  },
  "keyInsights": [
    {
      "insight": "{specific_actionable_insight}",
      "direction": "{up|down|neutral}",
      "mentions": {number},
      "platforms": ["{platform1}", "{platform2}"],
      "impact": "{high|medium|low}",
      "reviews": [
        {
          "text": "{sample_review_text}",
          "topic": "{topic}",
          "sentiment": "{positive|negative|neutral}"
        }
      ]
    }
  ],
  "sentimentOverTime": [
    {
      "month": "{month}",
      "business": {sentiment_score},
      "competitorA": {sentiment_score},
      "competitorB": {sentiment_score},
      "competitorC": {sentiment_score}
    }
  ],
  "mentionsByTopic": [
    {
      "topic": "{topic_name}",
      "positive": {number},
      "neutral": {number},
      "negative": {number},
      "total": 100
    }
  ],
  "trendingTopics": [
    {
      "topic": "{topic_name}",
      "increase": "{percentage}",
      "sources": ["{source1}"],
      "sentiment": "{positive|negative|neutral}"
    }
  ],
  "volumeOverTime": [
    {
      "week": "{week}",
      "volume": {number},
      "platform": "{platform_name}"
    }
  ],
  "competitorComparison": [
    {
      "topic": "{topic_name}",
      "business": {rating},
      "competitorA": {rating},
      "competitorB": {rating},
      "competitorC": {rating}
    }
  ],
  "marketGaps": [
    {
      "gap": "{specific_unmet_need}",
      "mentions": {number},
      "suggestion": "{actionable_suggestion}"
    }
  ],
  "advancedMetrics": {
    "trustScore": {number},
    "repeatComplaints": {number},
    "avgResolutionTime": "{time_string}",
    "vocVelocity": "{percentage}"
  },
  "suggestedActions": [
    "{specific_actionable_recommendation}"
  ],
  "vocDigest": {
    "summary": "{monthly_summary}",
    "highlights": [
      "{highlight1}",
      "{highlight2}",
      "{highlight3}"
    ]
  }
}

CRITICAL REQUIREMENTS:

1. ALL NUMBERS MUST BE REALISTIC:
   - Sentiment scores: 0-100
   - Ratings: 1-5 scale
   - Percentages: -50% to +100%
   - Mention counts: 5-500
   - Review counts: 10-2000

2. ALL TEXT MUST BE BUSINESS-RELEVANT:
   - Topics: "Customer Service", "Product Quality", "Shipping", "Pricing", etc.
   - Insights: Specific, actionable, data-driven
   - Suggestions: Concrete, implementable actions

3. ALL DATA MUST BE CONSISTENT:
   - Total mentions should match across sections
   - Sentiment trends should be logical
   - Volume changes should be realistic

4. ALL STRUCTURES MUST MATCH EXACTLY:
   - No extra fields
   - No missing fields
   - Exact field names and types

Remember: Return ONLY the JSON object, no additional text or explanations.
`

// Validation function to ensure AI output matches our structure
export function validateVOCReportData(data: any): data is VOCReportData {
  const requiredFields = [
    'businessName', 'businessUrl', 'generatedAt', 'totalReviews',
    'dataSources', 'executiveSummary', 'keyInsights', 'sentimentOverTime',
    'mentionsByTopic', 'trendingTopics', 'volumeOverTime', 'competitorComparison',
    'marketGaps', 'advancedMetrics', 'suggestedActions', 'vocDigest'
  ]
  
  return requiredFields.every(field => data.hasOwnProperty(field))
}

// Helper function to format the prompt with actual data
export function formatVOCPrompt(
  reviewsData: any[],
  businessName: string,
  businessUrl: string,
  industry: string,
  reviewSources: string[]
): string {
  return AI_PROMPT_TEMPLATE
    .replace('{reviews_data}', JSON.stringify(reviewsData))
    .replace('{business_name}', businessName)
    .replace('{business_url}', businessUrl)
    .replace('{industry}', industry)
    .replace('{review_sources}', reviewSources.join(', '))
    .replace('{total_reviews}', reviewsData.length.toString())
    .replace('{current_date}', new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }))
} 