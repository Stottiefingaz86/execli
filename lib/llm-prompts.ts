// LLM Prompts for Execli VOC Analysis
// These prompts ensure the LLM outputs the exact JSON structure needed

export const VOC_ANALYSIS_PROMPT = `
You are an expert Voice of Customer (VOC) analyst. Analyze the provided reviews and generate a comprehensive VOC report in the exact JSON format specified below.

REVIEW DATA:
{reviews_data}

BUSINESS CONTEXT:
- Business Name: {business_name}
- Industry: {industry}
- Review Sources: {review_sources}

ANALYSIS REQUIREMENTS:
1. Analyze sentiment trends over time
2. Extract key topics and themes
3. Identify market gaps and opportunities
4. Generate actionable insights
5. Calculate advanced business metrics
6. Create executive summary
7. Suggest specific actions

OUTPUT FORMAT - Return ONLY valid JSON in this exact structure:

{
  "company_id": "{company_id}",
  "business_name": "{business_name}",
  "business_url": "{business_url}",
  "industry": "{industry}",
  "reviews": [
    {
      "source": "{review_source_name}",
      "external_review_id": "{unique_review_id}",
      "reviewer_name": "{reviewer_name_or_anonymous}",
      "rating": {1-5},
      "review_text": "{full_review_text}",
      "sentiment_score": {-1.0_to_1.0},
      "sentiment_label": "{positive|negative|neutral}",
      "topics": ["{topic1}", "{topic2}"],
      "review_date": "{YYYY-MM-DD}"
    }
  ],
  "analysis": {
    "sentiment_timeline": [
      {
        "date": "{YYYY-MM-DD}",
        "avg_sentiment": {-1.0_to_1.0},
        "total_reviews": {number},
        "positive_count": {number},
        "neutral_count": {number},
        "negative_count": {number}
      }
    ],
    "topic_analysis": [
      {
        "topic": "{topic_name}",
        "positive_count": {number},
        "neutral_count": {number},
        "negative_count": {number},
        "total_mentions": {number},
        "sentiment_score": {-1.0_to_1.0}
      }
    ],
    "key_insights": [
      {
        "insight_text": "{clear_actionable_insight}",
        "direction": "{up|down|stable}",
        "mention_count": {number},
        "platforms": ["{source1}", "{source2}"],
        "impact": "{low|medium|high}",
        "sample_reviews": [
          {
            "text": "{sample_review_text}",
            "rating": {1-5},
            "source": "{source_name}"
          }
        ]
      }
    ],
    "market_gaps": [
      {
        "gap_description": "{specific_market_gap_or_opportunity}",
        "mention_count": {number},
        "suggestion": "{specific_action_to_address_gap}",
        "priority": "{low|medium|high}"
      }
    ],
    "advanced_metrics": {
      "trust_score": {0-100},
      "repeat_complaints": {number},
      "avg_resolution_time_hours": {decimal_hours},
      "voc_velocity_percentage": {percentage_change}
    }
  }
}

ANALYSIS GUIDELINES:

SENTIMENT ANALYSIS:
- Use -1.0 to 1.0 scale where -1.0 is very negative, 0 is neutral, 1.0 is very positive
- Consider context, sarcasm, and industry-specific language
- Label as positive/negative/neutral based on overall tone

TOPIC EXTRACTION:
- Extract specific, actionable topics (e.g., "Coffee Quality", "Service Speed", "Atmosphere")
- Avoid generic topics like "Good" or "Bad"
- Group similar concepts under consistent topic names

KEY INSIGHTS:
- Focus on actionable business insights
- Include specific metrics and trends
- Provide clear direction (up/down/stable)
- Include sample reviews as evidence

MARKET GAPS:
- Identify unmet customer needs
- Focus on opportunities for improvement
- Provide specific, actionable suggestions
- Prioritize based on mention frequency and business impact

ADVANCED METRICS:
- Trust Score: 0-100 based on sentiment consistency and review volume
- Repeat Complaints: Count of similar negative feedback patterns
- Resolution Time: Estimate based on review patterns and response indicators
- VOC Velocity: Percentage change in sentiment over time

EXECUTIVE SUMMARY:
- Focus on the most impactful insights
- Include specific numbers and trends
- Highlight immediate action items
- Keep it concise but comprehensive

Remember: Return ONLY the JSON object, no additional text or explanations.
`;

export const EXECUTIVE_SUMMARY_PROMPT = `
Based on the VOC analysis data below, create a concise executive summary in this exact JSON format:

ANALYSIS DATA:
{analysis_data}

OUTPUT FORMAT:
{
  "executive_summary": {
    "overview": "{2-3_sentence_high_level_summary}",
    "key_metrics": {
      "overall_sentiment": "{positive|negative|neutral}",
      "total_reviews": {number},
      "trust_score": {0-100},
      "top_performing_aspect": "{topic_name}",
      "biggest_concern": "{topic_name}"
    },
    "trends": {
      "sentiment_trend": "{improving|declining|stable}",
      "volume_trend": "{increasing|decreasing|stable}",
      "key_driver": "{specific_factor_driving_trends}"
    },
    "critical_insights": [
      {
        "insight": "{specific_actionable_insight}",
        "impact": "{low|medium|high}",
        "urgency": "{low|medium|high}"
      }
    ],
    "immediate_actions": [
      {
        "action": "{specific_action_item}",
        "priority": "{low|medium|high}",
        "expected_outcome": "{expected_result}"
      }
    ],
    "long_term_opportunities": [
      {
        "opportunity": "{market_gap_or_opportunity}",
        "potential_impact": "{low|medium|high}",
        "timeline": "{short|medium|long}_term"
      }
    ]
  }
}

Guidelines:
- Keep overview concise but comprehensive
- Focus on actionable insights
- Include specific metrics and trends
- Prioritize actions by impact and urgency
- Identify both immediate fixes and long-term opportunities
`;

export const VOC_DIGEST_PROMPT = `
Create a VOC digest from the analysis data below. This should be a comprehensive breakdown for detailed review:

ANALYSIS DATA:
{analysis_data}

OUTPUT FORMAT:
{
  "voc_digest": {
    "sentiment_overview": {
      "overall_sentiment": "{positive|negative|neutral}",
      "sentiment_distribution": {
        "positive_percentage": {percentage},
        "neutral_percentage": {percentage},
        "negative_percentage": {percentage}
      },
      "sentiment_trend": "{improving|declining|stable}",
      "key_sentiment_drivers": ["{driver1}", "{driver2}"]
    },
    "topic_breakdown": [
      {
        "topic": "{topic_name}",
        "sentiment_score": {-1.0_to_1.0},
        "mention_count": {number},
        "trend": "{improving|declining|stable}",
        "key_quotes": ["{quote1}", "{quote2}"],
        "action_items": ["{action1}", "{action2}"]
      }
    ],
    "platform_analysis": [
      {
        "platform": "{platform_name}",
        "review_count": {number},
        "avg_rating": {decimal},
        "sentiment_score": {-1.0_to_1.0},
        "key_insights": ["{insight1}", "{insight2}"]
      }
    ],
    "customer_segments": [
      {
        "segment": "{segment_name}",
        "characteristics": ["{char1}", "{char2}"],
        "sentiment": "{positive|negative|neutral}",
        "key_concerns": ["{concern1}", "{concern2}"],
        "opportunities": ["{opportunity1}", "{opportunity2}"]
      }
    ],
    "competitive_insights": [
      {
        "insight": "{competitive_insight}",
        "evidence": "{supporting_evidence}",
        "implication": "{business_implication}"
      }
    ],
    "risk_analysis": [
      {
        "risk": "{identified_risk}",
        "probability": "{low|medium|high}",
        "impact": "{low|medium|high}",
        "mitigation": "{mitigation_strategy}"
      }
    ],
    "opportunity_analysis": [
      {
        "opportunity": "{identified_opportunity}",
        "potential_impact": "{low|medium|high}",
        "effort_required": "{low|medium|high}",
        "timeline": "{short|medium|long}_term"
      }
    ]
  }
}

Guidelines:
- Provide detailed breakdowns for each topic
- Include specific quotes and examples
- Analyze patterns across different platforms
- Identify customer segments and their needs
- Assess competitive positioning
- Evaluate risks and opportunities
- Provide actionable recommendations for each section
`;

export const ACTION_PLAN_PROMPT = `
Based on the VOC analysis, create a detailed action plan in this exact JSON format:

ANALYSIS DATA:
{analysis_data}

OUTPUT FORMAT:
{
  "action_plan": {
    "immediate_actions": [
      {
        "action": "{specific_action}",
        "priority": "{critical|high|medium|low}",
        "owner": "{responsible_person_or_department}",
        "timeline": "{immediate|1_week|2_weeks|1_month}",
        "resources_needed": ["{resource1}", "{resource2}"],
        "success_metrics": ["{metric1}", "{metric2}"],
        "expected_outcome": "{expected_result}"
      }
    ],
    "short_term_goals": [
      {
        "goal": "{specific_goal}",
        "timeline": "{1-3_months}",
        "key_activities": ["{activity1}", "{activity2}"],
        "success_criteria": ["{criteria1}", "{criteria2}"],
        "risks": ["{risk1}", "{risk2}"],
        "mitigation": ["{mitigation1}", "{mitigation2}"]
      }
    ],
    "long_term_strategies": [
      {
        "strategy": "{strategic_initiative}",
        "timeline": "{3-12_months}",
        "objectives": ["{objective1}", "{objective2}"],
        "key_milestones": ["{milestone1}", "{milestone2}"],
        "resource_requirements": "{resource_description}",
        "roi_expectation": "{expected_return_on_investment}"
      }
    ],
    "team_assignments": [
      {
        "role": "{role_or_department}",
        "responsibilities": ["{responsibility1}", "{responsibility2}"],
        "key_deliverables": ["{deliverable1}", "{deliverable2}"],
        "timeline": "{timeline}",
        "dependencies": ["{dependency1}", "{dependency2}"]
      }
    ],
    "success_metrics": {
      "sentiment_improvement_target": {percentage},
      "response_time_target": "{time_target}",
      "customer_satisfaction_target": {score},
      "review_volume_target": {number},
      "topic_sentiment_targets": {
        "{topic1}": {target_score},
        "{topic2}": {target_score}
      }
    },
    "monitoring_plan": {
      "review_frequency": "{daily|weekly|monthly}",
      "key_indicators": ["{indicator1}", "{indicator2}"],
      "escalation_triggers": ["{trigger1}", "{trigger2}"],
      "reporting_schedule": "{schedule}"
    }
  }
}

Guidelines:
- Prioritize actions by impact and urgency
- Assign clear ownership and timelines
- Include specific success metrics
- Consider resource requirements
- Plan for monitoring and adjustment
- Focus on measurable outcomes
- Address both quick wins and long-term improvements
`;

// Helper function to format prompts with data
export function formatPrompt(template: string, data: Record<string, any>): string {
  let formatted = template;
  for (const [key, value] of Object.entries(data)) {
    formatted = formatted.replace(new RegExp(`{${key}}`, 'g'), String(value));
  }
  return formatted;
}

// Example usage for Pipedream workflow
export const PIPEDREAM_WORKFLOW_PROMPT = `
You are processing review data for a VOC analysis system. Your task is to:

1. Scrape reviews from the provided URL
2. Analyze sentiment and extract topics
3. Generate insights and recommendations
4. Output the exact JSON format required

INPUT:
- Business Name: {business_name}
- Industry: {industry}
- Review URL: {review_url}
- Review Source: {review_source}

PROCESS:
1. Extract all reviews from the URL
2. For each review, analyze:
   - Sentiment (positive/negative/neutral)
   - Sentiment score (-1.0 to 1.0)
   - Key topics mentioned
   - Rating and date

3. Generate analysis including:
   - Sentiment timeline
   - Topic analysis
   - Key insights
   - Market gaps
   - Advanced metrics

4. Output the complete JSON structure as specified in the VOC_ANALYSIS_PROMPT

Ensure all data is properly formatted and validated before output.
`; 