'use client'

import { useState } from 'react'
import ReportPageContent from '@/components/ReportPageContent'

export default function TestReportPage() {
  const [reportId, setReportId] = useState('test-report-123')
  const [showReport, setShowReport] = useState(false)

  const sampleReportData = {
    id: reportId,
    business_name: "Test Business",
    business_url: "https://test.com",
    status: "complete",
    analysis: {
      executiveSummary: {
        overview: "Analysis of 5 reviews for Test Business. Overall positive sentiment with focus on customer service and product quality. Customer service excellence drives positive reviews with 3 mentions, while product quality receives consistent praise with 2 mentions.",
        sentimentChange: "+15%",
        volumeChange: "+8%",
        mostPraised: "Customer Service",
        topComplaint: "Product Quality",
        praisedSections: [
          {
            topic: "Customer Service",
            percentage: "85%",
            examples: ["Great customer service!", "Excellent support team", "Friendly service"]
          },
          {
            topic: "Product Quality",
            percentage: "78%",
            examples: ["Fast delivery and good quality", "Product quality is amazing", "Durable materials"]
          }
        ],
        painPoints: [
          {
            topic: "Delivery",
            percentage: "12%",
            examples: ["Slow shipping", "Delayed delivery", "Long wait times"]
          }
        ],
        summary: "Overall positive customer sentiment with room for improvement in delivery services.",
        context: "Analysis based on real review data",
        dataSource: "Analyzed 5 reviews",
        topHighlights: []
      },
      keyInsights: [
        {
          insight: "Customer service excellence drives positive reviews",
          title: "Service Quality Leader",
          direction: "positive",
          mentionCount: "3",
          platforms: ["Trustpilot"],
          impact: "high",
          suggestions: ["Maintain current service standards", "Train staff on new procedures"],
          reviews: [
            { text: "Great customer service!", topic: "Customer Service", sentiment: "positive" },
            { text: "Excellent support team", topic: "Customer Service", sentiment: "positive" }
          ]
        },
        {
          insight: "Product quality receives consistent praise",
          title: "Product Quality Leader",
          direction: "positive",
          mentionCount: "2",
          platforms: ["Trustpilot"],
          impact: "medium",
          suggestions: ["Continue quality control", "Maintain product standards"],
          reviews: [
            { text: "Fast delivery and good quality", topic: "Product Quality", sentiment: "positive" },
            { text: "Product quality is amazing", topic: "Product Quality", sentiment: "positive" }
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
    },
    detected_sources: [
      { source: "Trustpilot", review_count: 40 },
      { source: "Google Reviews", review_count: 15 }
    ]
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Test Report Page</h1>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={reportId}
              onChange={(e) => setReportId(e.target.value)}
              placeholder="Enter report ID"
              className="px-4 py-2 bg-[#181a20] border border-white/20 rounded-lg text-white"
            />
            <button
              onClick={() => setShowReport(!showReport)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {showReport ? 'Hide Report' : 'Show Report'}
            </button>
          </div>
        </div>

        {showReport && (
          <div className="bg-[#181a20] rounded-3xl p-6">
            <ReportPageContent
              reportData={sampleReportData}
              reportId={reportId}
              isRegenerating={false}
            />
          </div>
        )}
      </div>
    </div>
  )
} 