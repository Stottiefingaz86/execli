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
You are a senior Voice of Customer (VoC) strategist and business analyst. Your job is to deliver sharp, actionable, and business-relevant insights that drive real change. You must synthesize patterns across ALL reviews, not just quote or count them.

Your task: Analyze the following review dataset and return a comprehensive VoC JSON report in the EXACT format below. Every section must be based on real review content and provide value to a business leader.

📦 REVIEW DATA:
{reviews_data}

🏢 BUSINESS CONTEXT:
- Business Name: {business_name}
- Business URL: {business_url}
- Industry: {industry}
- Review Sources: {review_sources}
- Total Reviews: {total_reviews}

📊 ANALYSIS OBJECTIVES:
- Diagnose root causes, not just symptoms.
- Prioritize issues by business impact, urgency, and frequency.
- Highlight trust, fairness, and retention barriers.
- Use strong, confident business language—never vague or generic.

🔍 DELIVERABLE STRUCTURE:

1. EXECUTIVE SUMMARY:
   - Sentiment % change (up/down, based on polarity across review set)
   - Review volume change (30-day trend)
   - Most praised aspect (clear topic, e.g. "Support responsiveness")
   - Most criticized aspect (e.g. "Poker fairness")
   - 3-sentence business summary: what’s going well, what’s broken, what’s urgent
   - 2–3 alerts (warnings, critical spikes)

2. KEY INSIGHTS (5–7 max):
   - Each insight MUST:
     - Be **actionable, specific, and business-relevant**
     - Synthesize patterns from ALL reviews, not just quote or count
     - Start with a headline claim (e.g., “Poker tournaments widely viewed as rigged”)
     - Include direction (up/down/neutral), impact level (high/medium/low)
     - Include exact mention count + source platforms
     - Show 2–3 distinct review snippets (never just copy-paste, always summarize the pattern)
   - **If you cannot find a real insight, say so clearly. Do NOT hallucinate.**

3. SENTIMENT TIMELINE (6 months):
   - Generate monthly sentiment scores (0–100)
   - Include 3 realistic competitor scores per month for comparison

4. MENTIONS BY TOPIC (5–8 topics):
   - For each topic (e.g., "Withdrawals", "Customer Support"), show:
     - Pos/Neutral/Neg breakdown (total = 100%)
     - Detect emotional volatility
     - **Generate a 1-sentence, actionable, business-relevant insight for this topic, using the same clear, confident, and specific language as the rest of the report. Do NOT just state counts or generic phrases—summarize the main customer pain point or praise in a way that is useful for business action.**

5. TRENDING TOPICS (5–8):
   - Show topics with largest recent increase in volume
   - Include % increase and main platform
   - Note overall sentiment on that topic

6. REVIEW VOLUME (8-week timeline):
   - Weekly volume chart
   - Include spikes/dips with contextual insights

7. COMPETITOR COMPARISON (5–8 key topics):
   - Show how business scores (1–5) against 3 main competitors
   - Use realistic deltas (±0.2–0.8 differences)

8. MARKET GAPS (4–6):
   - Identify clear unmet needs (e.g., “No live betting options”)
   - For each gap:
     - Synthesize the main gap from ALL relevant reviews (do not just quote one)
     - Mentions, business case, user quote, impact zone
     - Action recommendation
   - **If you cannot find a real gap, say so clearly. Do NOT hallucinate.**

9. ADVANCED METRICS:
   - Trust score (0–100)
   - % repeat complaints
   - Avg resolution time (days)
   - VOC velocity (% change in review volume)

10. ACTION RECOMMENDATIONS:
    - 4–6 smart, realistic, **business-first** actions
    - Phrase like a CX leader, not a generic assistant

11. VOC DIGEST:
    - **A concise, business-style digest (3–4 bullet points, no fluff, no hallucination)**
    - Each bullet must summarize a real, actionable trend or issue from the reviews
    - Format like an internal Slack update for executives
    - If there is nothing meaningful, say so clearly

🧠 STYLE & LOGIC GUIDELINES:
- Use clear, confident, business-focused language.
- NEVER use generic statements like “reviews are mixed” or “some customers say…”
- Use numbers, emotional tone, trust triggers.
- If users accuse the brand of fraud, bots, or deception—escalate that directly.
- Prioritize clarity and business value over politeness.
- **For each topic, the insight must be actionable, specific, and business-relevant, not just a count or generic summary.**
- **If you cannot find a real insight, say so clearly. Do NOT hallucinate.**

📤 OUTPUT FORMAT:
Return ONLY a valid JSON object in this structure:

{
  "businessName": "{business_name}",
  "businessUrl": "{business_url}",
  "generatedAt": "{current_date}",
  "totalReviews": {total_reviews},
  "dataSources": {
    "current": [...],
    "available": [...]
  },
  "executiveSummary": {...},
  "keyInsights": [...],
  "sentimentOverTime": [...],
  "mentionsByTopic": [...],
  "trendingTopics": [...],
  "volumeOverTime": [...],
  "competitorComparison": [...],
  "marketGaps": [...],
  "advancedMetrics": {...},
  "suggestedActions": [...],
  "vocDigest": {...}
}

📏 VALIDATION RULES:
- All fields MUST be present, named exactly as shown.
- All numbers must be realistic and internally consistent.
- Mention totals must align with review volume.
- All insights must be grounded in real review patterns, not imagined or copy-pasted.
- If the output is too generic, retry or flag for review.

🛑 Return ONLY the JSON. No explanations, no surrounding text.
`;

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