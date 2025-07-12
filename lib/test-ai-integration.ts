// Test AI integration with OpenAI
import { formatVOCPrompt, validateVOCReportData } from './ai-specification'

// Mock review data
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

// Test OpenAI integration
async function testOpenAIIntegration() {
  console.log('Testing OpenAI integration...')
  
  if (!process.env.OPENAI_API_KEY) {
    console.log('❌ OPENAI_API_KEY not found in environment')
    return false
  }
  
  try {
    // Format the prompt
    const prompt = formatVOCPrompt(
      mockReviews,
      'Test Business',
      'https://testbusiness.com',
      'E-commerce',
      ['Google Reviews']
    )
    
    console.log('✅ Prompt formatted successfully')
    console.log('📝 Prompt length:', prompt.length, 'characters')
    
    // Test OpenAI API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 6000
      })
    })
    
    const data = await response.json()
    
    if (data.error) {
      console.log('❌ OpenAI API error:', data.error.message)
      return false
    }
    
    console.log('✅ OpenAI API call successful')
    
    // Parse and validate the response
    const result = JSON.parse(data.choices[0].message.content)
    
    if (validateVOCReportData(result)) {
      console.log('✅ AI response matches expected structure')
      console.log('📊 Generated report for:', result.businessName)
      console.log('📈 Total reviews:', result.totalReviews)
      console.log('💡 Key insights:', result.keyInsights.length)
      return true
    } else {
      console.log('❌ AI response does not match expected structure')
      return false
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error)
    return false
  }
}

// Run test if called directly
if (require.main === module) {
  testOpenAIIntegration().then(success => {
    if (success) {
      console.log('🎉 AI integration test passed!')
    } else {
      console.log('💥 AI integration test failed!')
    }
  })
}

export { testOpenAIIntegration } 