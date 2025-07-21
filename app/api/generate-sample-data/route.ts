import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { business_name = 'Sample Business', business_url = 'https://example.com', email = 'test@example.com' } = body

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create company record
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: business_name,
        email: email,
        status: 'complete',
        industry: 'Technology',
        ip_address: '127.0.0.1'
      })
      .select()
      .single();

    if (companyError) {
      console.error('Error creating company:', companyError);
      return NextResponse.json({ error: 'Failed to create company', details: companyError }, { status: 500 });
    }

    // Create report record with sample analysis
    const sampleAnalysis = {
      executiveSummary: {
        overview: "This sample business shows strong customer satisfaction with an overall positive sentiment trend. Key areas of excellence include customer service and product quality.",
        sentimentChange: "+15%",
        volumeChange: "+8%",
        mostPraised: "Customer service quality",
        topComplaint: "Delivery times",
        praisedSections: [
          {
            topic: "Customer Service",
            percentage: "85%",
            examples: ["Staff was very helpful", "Great customer support", "Friendly service"]
          },
          {
            topic: "Product Quality",
            percentage: "78%",
            examples: ["High quality products", "Excellent craftsmanship", "Durable materials"]
          }
        ],
        painPoints: [
          {
            topic: "Delivery",
            percentage: "12%",
            examples: ["Slow shipping", "Delayed delivery", "Long wait times"]
          }
        ],
        summary: "Overall positive customer sentiment with room for improvement in delivery services."
      },
      keyInsights: [
        {
          insight: "Customer service excellence drives positive reviews",
          title: "Service Quality Leader",
          direction: "positive",
          mentionCount: "45",
          platforms: ["Trustpilot", "Google"],
          impact: "High",
          suggestions: ["Maintain current service standards", "Train staff on new procedures"],
          reviews: [
            { text: "Amazing customer service!", topic: "Service", sentiment: "positive" },
            { text: "Staff was very helpful", topic: "Service", sentiment: "positive" }
          ]
        },
        {
          insight: "Delivery times need improvement",
          title: "Delivery Optimization",
          direction: "negative",
          mentionCount: "12",
          platforms: ["Trustpilot"],
          impact: "Medium",
          suggestions: ["Optimize shipping routes", "Partner with faster carriers"],
          reviews: [
            { text: "Slow delivery", topic: "Delivery", sentiment: "negative" },
            { text: "Took too long to arrive", topic: "Delivery", sentiment: "negative" }
          ]
        }
      ],
      trendingTopics: [
        {
          topic: "Customer Service",
          growth: "+25%",
          sentiment: "positive",
          volume: "high",
          keyInsights: ["Staff training effective", "Response time improved"],
          rawMentions: ["Great service", "Helpful staff", "Excellent support"],
          context: "Recent improvements in customer service training",
          mainIssue: "None - positive trend",
          businessImpact: "Increased customer satisfaction scores",
          positiveCount: 45,
          negativeCount: 2,
          totalCount: 47
        },
        {
          topic: "Product Quality",
          growth: "+15%",
          sentiment: "positive",
          volume: "medium",
          keyInsights: ["Quality consistency", "Durability praised"],
          rawMentions: ["High quality", "Well made", "Durable"],
          context: "Consistent product quality delivery",
          mainIssue: "None - positive trend",
          businessImpact: "Strong brand reputation",
          positiveCount: 38,
          negativeCount: 1,
          totalCount: 39
        }
      ],
      mentionsByTopic: [
        {
          topic: "Customer Service",
          positive: 45,
          neutral: 3,
          negative: 2,
          rawMentions: ["Great service", "Helpful staff", "Excellent support", "Friendly team"],
          context: "Strong positive sentiment around customer service",
          mainConcern: "None - positive feedback",
          priority: "Maintain",
          trendAnalysis: "Consistently positive trend",
          specificExamples: ["Staff was very helpful", "Great customer support", "Friendly service"]
        },
        {
          topic: "Product Quality",
          positive: 38,
          neutral: 2,
          negative: 1,
          rawMentions: ["High quality", "Well made", "Durable", "Excellent craftsmanship"],
          context: "High satisfaction with product quality",
          mainConcern: "None - positive feedback",
          priority: "Maintain",
          trendAnalysis: "Stable positive trend",
          specificExamples: ["High quality products", "Excellent craftsmanship", "Durable materials"]
        },
        {
          topic: "Delivery",
          positive: 5,
          neutral: 2,
          negative: 12,
          rawMentions: ["Slow delivery", "Fast shipping", "Delayed", "Quick delivery"],
          context: "Mixed feedback on delivery times",
          mainConcern: "Slow delivery times",
          priority: "Improve",
          trendAnalysis: "Negative trend in delivery satisfaction",
          specificExamples: ["Slow shipping", "Delayed delivery", "Long wait times"]
        }
      ],
      sentimentOverTime: [
        { date: "2024-01-01", sentiment: 0.75, reviewCount: 5 },
        { date: "2024-01-02", sentiment: 0.82, reviewCount: 8 },
        { date: "2024-01-03", sentiment: 0.78, reviewCount: 12 },
        { date: "2024-01-04", sentiment: 0.85, reviewCount: 15 },
        { date: "2024-01-05", sentiment: 0.79, reviewCount: 10 }
      ],
      volumeOverTime: [
        { date: "2024-01-01", volume: 5, platform: "Trustpilot" },
        { date: "2024-01-02", volume: 8, platform: "Trustpilot" },
        { date: "2024-01-03", volume: 12, platform: "Trustpilot" },
        { date: "2024-01-04", volume: 15, platform: "Trustpilot" },
        { date: "2024-01-05", volume: 10, platform: "Trustpilot" }
      ],
      marketGaps: [
        {
          gap: "Faster delivery options",
          mentions: 12,
          suggestion: "Implement express shipping",
          kpiImpact: "Reduce delivery complaints by 60%",
          rawMentions: ["Slow delivery", "Took too long", "Delayed shipping"],
          context: "Customers want faster delivery options",
          opportunity: "Premium delivery service",
          specificExamples: ["Express shipping needed", "Faster delivery options"],
          priority: "High",
          customerImpact: "Improved customer satisfaction",
          businessCase: "Increased sales from faster delivery",
          implementation: "Partner with express carriers"
        }
      ],
      advancedMetrics: {
        trustScore: 85,
        repeatComplaints: 2,
        avgResolutionTime: "2.5 hours",
        vocVelocity: "High"
      },
      suggestedActions: [
        {
          action: "Implement express delivery",
          painPoint: "Slow delivery times",
          recommendation: "Partner with express shipping carriers",
          kpiImpact: "Reduce delivery complaints by 60%",
          rawMentions: ["Slow delivery", "Took too long"],
          context: "Customers consistently mention slow delivery",
          expectedOutcome: "Improved delivery satisfaction scores"
        },
        {
          action: "Maintain customer service excellence",
          painPoint: "None - positive feedback",
          recommendation: "Continue current service training programs",
          kpiImpact: "Maintain 85% positive service ratings",
          rawMentions: ["Great service", "Helpful staff"],
          context: "Strong positive feedback on customer service",
          expectedOutcome: "Sustained high customer satisfaction"
        }
      ]
    };

    const { data: report, error: reportError } = await supabase
      .from('voc_reports')
      .insert({
        company_id: company.id,
        business_name: business_name,
        business_url: business_url,
        processed_at: new Date().toISOString(),
        sources: [],
        status: 'complete',
        progress_message: 'Sample data generated successfully',
        analysis: sampleAnalysis,
        detected_sources: [
          { source: "Trustpilot", review_count: 40 },
          { source: "Google Reviews", review_count: 15 }
        ]
      })
      .select()
      .single();

    if (reportError) {
      console.error('Error creating report:', reportError);
      return NextResponse.json({ error: 'Failed to create report', details: reportError }, { status: 500 });
    }

    // Create sample reviews
    const sampleReviews = [
      { text: "Amazing customer service! Staff was very helpful.", rating: 5, source: "Trustpilot", company_id: company.id },
      { text: "High quality products and excellent craftsmanship.", rating: 5, source: "Trustpilot", company_id: company.id },
      { text: "Great service but delivery was a bit slow.", rating: 4, source: "Trustpilot", company_id: company.id },
      { text: "Friendly staff and good products.", rating: 5, source: "Google Reviews", company_id: company.id },
      { text: "Excellent customer support team.", rating: 5, source: "Trustpilot", company_id: company.id }
    ];

    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .insert(sampleReviews)
      .select();

    if (reviewsError) {
      console.error('Error creating reviews:', reviewsError);
      return NextResponse.json({ error: 'Failed to create reviews', details: reviewsError }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      report_id: report.id,
      company_id: company.id,
      message: 'Sample data generated successfully',
      data: {
        report: report,
        company: company,
        reviews_count: reviews?.length || 0
      }
    });

  } catch (error) {
    console.error('Generate sample data error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error && error.stack ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 