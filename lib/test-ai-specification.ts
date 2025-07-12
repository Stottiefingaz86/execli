// Test file to verify AI specification works correctly
import { validateVOCReportData, formatVOCPrompt } from './ai-specification'

// Mock review data for testing
const mockReviews = [
  {
    source: 'Google Reviews',
    external_review_id: 'google_1',
    reviewer_name: 'John Doe',
    rating: 5,
    review_text: 'Amazing customer service! The team was very helpful and responsive.',
    review_date: '2024-01-15',
    sentiment_score: 0.9,
    sentiment_label: 'positive',
    topics: ['Customer Service']
  },
  {
    source: 'Google Reviews',
    external_review_id: 'google_2',
    reviewer_name: 'Jane Smith',
    rating: 4,
    review_text: 'Great product quality, but delivery was a bit slow.',
    review_date: '2024-01-14',
    sentiment_score: 0.7,
    sentiment_label: 'positive',
    topics: ['Product Quality', 'Delivery']
  },
  {
    source: 'Google Reviews',
    external_review_id: 'google_3',
    reviewer_name: 'Bob Wilson',
    rating: 2,
    review_text: 'Terrible delivery experience. Took forever to arrive.',
    review_date: '2024-01-13',
    sentiment_score: 0.2,
    sentiment_label: 'negative',
    topics: ['Delivery']
  }
]

// Test the prompt formatting
export function testPromptFormatting() {
  console.log('Testing prompt formatting...')
  
  const prompt = formatVOCPrompt(
    mockReviews,
    'Test Business',
    'https://testbusiness.com',
    'E-commerce',
    ['Google Reviews']
  )
  
  console.log('Generated prompt length:', prompt.length)
  console.log('Prompt contains required placeholders:', 
    prompt.includes('{reviews_data}') === false && // Should be replaced
    prompt.includes('{business_name}') === false && // Should be replaced
    prompt.includes('Test Business') // Should be present
  )
  
  return prompt
}

// Test data validation
export function testDataValidation() {
  console.log('Testing data validation...')
  
  // Valid data structure
  const validData = {
    businessName: 'Test Business',
    businessUrl: 'https://testbusiness.com',
    generatedAt: 'January 15, 2024',
    totalReviews: 150,
    dataSources: {
      current: [
        {
          name: 'Google Reviews',
          status: 'active',
          reviews: 150,
          lastSync: '2 hours ago',
          icon: '🔍'
        }
      ],
      available: [
        {
          name: 'Trustpilot',
          price: 19,
          description: 'Customer review platform',
          icon: '⭐'
        }
      ]
    },
    executiveSummary: {
      sentimentChange: '+12%',
      volumeChange: '+18%',
      mostPraised: 'Customer service',
      topComplaint: 'Slow delivery',
      overview: 'Customer sentiment has improved this quarter.',
      alerts: [
        {
          type: 'warning',
          message: 'Delivery complaints increased 15% this month',
          metric: 'Delivery'
        }
      ]
    },
    keyInsights: [
      {
        insight: 'Customer service satisfaction improved 25% this quarter',
        direction: 'up',
        mentions: 45,
        platforms: ['Google Reviews'],
        impact: 'high',
        reviews: [
          {
            text: 'Amazing customer service!',
            topic: 'Customer Service',
            sentiment: 'positive'
          }
        ]
      }
    ],
    sentimentOverTime: [
      { month: 'Jan', business: 72, competitorA: 68, competitorB: 70, competitorC: 65 },
      { month: 'Feb', business: 75, competitorA: 69, competitorB: 71, competitorC: 66 }
    ],
    mentionsByTopic: [
      { topic: 'Customer Service', positive: 65, neutral: 20, negative: 15, total: 100 },
      { topic: 'Delivery', positive: 45, neutral: 25, negative: 30, total: 100 }
    ],
    trendingTopics: [
      { topic: 'Customer Service', increase: '+15%', sources: ['Google Reviews'], sentiment: 'positive' }
    ],
    volumeOverTime: [
      { week: 'W1', volume: 45, platform: 'Google' },
      { week: 'W2', volume: 52, platform: 'Google' }
    ],
    competitorComparison: [
      { topic: 'Customer Service', business: 4.2, competitorA: 3.8, competitorB: 4.0, competitorC: 3.5 }
    ],
    marketGaps: [
      { gap: 'No same-day delivery option', mentions: 18, suggestion: 'Partner with local delivery services' }
    ],
    advancedMetrics: {
      trustScore: 78,
      repeatComplaints: 12,
      avgResolutionTime: '2.3 days',
      vocVelocity: '+8%'
    },
    suggestedActions: [
      'Improve delivery speed with local partnerships',
      'Add more payment options for convenience'
    ],
    vocDigest: {
      summary: 'This month: Customer service improved 25%, delivery complaints increased 15%.',
      highlights: [
        'Customer service satisfaction up 25%',
        'Delivery speed needs improvement',
        'Overall sentiment trending positive'
      ]
    }
  }
  
  // Invalid data (missing fields)
  const invalidData = {
    businessName: 'Test Business',
    // Missing other required fields
  }
  
  console.log('Valid data validation:', validateVOCReportData(validData))
  console.log('Invalid data validation:', validateVOCReportData(invalidData))
  
  return {
    valid: validateVOCReportData(validData),
    invalid: validateVOCReportData(invalidData)
  }
}

// Run tests
if (require.main === module) {
  console.log('Running AI specification tests...')
  
  testPromptFormatting()
  testDataValidation()
  
  console.log('Tests completed!')
} 