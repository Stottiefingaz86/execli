# Pipedream Workflow Guide for Execli VOC Analysis

## Overview
This guide shows how to set up a Pipedream workflow that scrapes reviews, analyzes them with AI, and stores the results in Supabase.

## Workflow Steps

### 1. Trigger: HTTP Webhook
- **Event**: HTTP Request
- **Method**: POST
- **Body**: JSON with form data
```json
{
  "business_name": "Brewed Awakenings",
  "business_url": "https://brewedawakenings.com",
  "industry": "Coffee Shop",
  "email": "owner@brewedawakenings.com",
  "review_source": "Google Reviews",
  "review_url": "https://maps.google.com/..."
}
```

### 2. Create Company in Supabase
Use the `createCompanyFromForm` function to create the company record.

### 3. Scrape Reviews
Use a scraping step (e.g., Puppeteer, HTTP Request) to extract reviews from the provided URL.

### 4. AI Analysis with LLM
Use the `VOC_ANALYSIS_PROMPT` to analyze the scraped reviews.

#### Prompt Template:
```javascript
// Use the formatPrompt function with your data
const prompt = formatPrompt(VOC_ANALYSIS_PROMPT, {
  reviews_data: JSON.stringify(scrapedReviews),
  business_name: "Brewed Awakenings",
  industry: "Coffee Shop",
  review_sources: "Google Reviews",
  company_id: companyId,
  business_url: "https://brewedawakenings.com"
});
```

### 5. Store Data in Supabase
Use the `processPipedreamData` function to store the analysis results.

### 6. Send Email Notification
Send an email to the user when the report is ready.

## Example LLM Output

The LLM should return JSON in this exact format:

```json
{
  "company_id": "550e8400-e29b-41d4-a716-446655440000",
  "business_name": "Brewed Awakenings",
  "business_url": "https://brewedawakenings.com",
  "industry": "Coffee Shop",
  "reviews": [
    {
      "source": "Google Reviews",
      "external_review_id": "google_review_123",
      "reviewer_name": "John D.",
      "rating": 5,
      "review_text": "Amazing coffee and friendly staff! The atmosphere is perfect for working.",
      "sentiment_score": 0.9,
      "sentiment_label": "positive",
      "topics": ["Coffee Quality", "Service", "Atmosphere"],
      "review_date": "2024-01-15"
    }
  ],
  "analysis": {
    "sentiment_timeline": [
      {
        "date": "2024-01-15",
        "avg_sentiment": 0.75,
        "total_reviews": 50,
        "positive_count": 35,
        "neutral_count": 10,
        "negative_count": 5
      }
    ],
    "topic_analysis": [
      {
        "topic": "Coffee Quality",
        "positive_count": 25,
        "neutral_count": 3,
        "negative_count": 2,
        "total_mentions": 30,
        "sentiment_score": 0.8
      },
      {
        "topic": "Service",
        "positive_count": 20,
        "neutral_count": 5,
        "negative_count": 1,
        "total_mentions": 26,
        "sentiment_score": 0.85
      }
    ],
    "key_insights": [
      {
        "insight_text": "Coffee quality is the strongest driver of positive sentiment, with 83% positive mentions",
        "direction": "up",
        "mention_count": 30,
        "platforms": ["Google Reviews"],
        "impact": "high",
        "sample_reviews": [
          {
            "text": "Best coffee in town!",
            "rating": 5,
            "source": "Google Reviews"
          }
        ]
      }
    ],
    "market_gaps": [
      {
        "gap_description": "Limited seating during peak hours",
        "mention_count": 8,
        "suggestion": "Add more seating or implement reservation system",
        "priority": "medium"
      }
    ],
    "advanced_metrics": {
      "trust_score": 82,
      "repeat_complaints": 3,
      "avg_resolution_time_hours": 24.5,
      "voc_velocity_percentage": 5.2
    }
  }
}
```

## Pipedream Workflow Code Example

```javascript
// Step 1: Extract form data
const { business_name, business_url, industry, email, review_source, review_url } = event.body;

// Step 2: Create company in Supabase (with processing status)
const companyResult = await createCompanyFromForm({
  business_name,
  business_url,
  industry,
  email
});

if (!companyResult.success) {
  throw new Error('Failed to create company');
}

const companyId = companyResult.company_id;

// Step 3: Return company ID immediately for status page
// This allows the user to see the processing page right away
return {
  success: true,
  company_id: companyId,
  status: 'processing',
  status_url: `https://yourdomain.com/report/${companyId}`
};

// Step 4: Add review source
await addReviewSourceToCompany(companyId, review_source, review_url);

// Step 5: Scrape reviews (implement your scraping logic)
const scrapedReviews = await scrapeReviews(review_url);

// Step 6: Analyze with LLM
const prompt = formatPrompt(VOC_ANALYSIS_PROMPT, {
  reviews_data: JSON.stringify(scrapedReviews),
  business_name,
  industry,
  review_sources: review_source,
  company_id: companyId,
  business_url
});

const llmResponse = await analyzeWithLLM(prompt); // Your LLM call
const analysisData = JSON.parse(llmResponse);

// Step 7: Store in Supabase and get report URL
const storeResult = await processPipedreamData(analysisData);

if (!storeResult.success) {
  throw new Error('Failed to store analysis data');
}

// Step 8: Generate email with shareable link
const keyInsights = analysisData.analysis.key_insights.map(insight => insight.insight_text);
const emailContent = generateReportEmail(
  business_name,
  storeResult.report_url,
  analysisData.reviews.length,
  keyInsights
);

// Step 9: Send email notification with unique report link
await sendEmail({
  to: email,
  subject: emailContent.subject,
  html: emailContent.htmlBody,
  text: emailContent.textBody
});

// Step 10: Final response (optional - for logging)
return {
  success: true,
  company_id: companyId,
  report_url: storeResult.report_url,
  status: 'complete'
};
```

## Key Points for LLM Prompts

1. **Exact JSON Format**: The LLM must return only valid JSON in the specified structure
2. **Sentiment Scoring**: Use -1.0 to 1.0 scale consistently
3. **Topic Extraction**: Focus on specific, actionable topics
4. **Actionable Insights**: Every insight should be business-actionable
5. **Market Gaps**: Identify specific opportunities for improvement
6. **Advanced Metrics**: Calculate meaningful business metrics

## Testing the Workflow

1. **Test with Sample Data**: Use the example JSON above to test your workflow
2. **Validate JSON Structure**: Ensure the LLM output matches the expected format
3. **Check Database Storage**: Verify data is stored correctly in Supabase
4. **Test Email Delivery**: Confirm email notifications are sent

## Error Handling

- Validate JSON structure before storing
- Handle scraping failures gracefully
- Retry failed LLM calls
- Log errors for debugging
- Send error notifications to users

## Next Steps

1. Set up your Pipedream workflow using this guide
2. Test with a small set of reviews first
3. Monitor the workflow performance
4. Adjust prompts based on results
5. Scale up to handle more review sources 