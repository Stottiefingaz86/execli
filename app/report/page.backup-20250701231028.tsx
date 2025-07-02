'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Share2, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Info,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Lightbulb,
  Bell,
  Plus,
  ExternalLink,
  Zap,
  AlertTriangle,
  Wand2,
  Activity
} from 'lucide-react'
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

export default function VOCReport() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [selectedMentions, setSelectedMentions] = useState<string | null>(null)
  const [showAddSource, setShowAddSource] = useState(false)
  const [showShareDropdown, setShowShareDropdown] = useState(false)

  const reportData = {
    businessName: 'Acme Corp',
    businessUrl: 'https://acme.com',
    generatedAt: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    totalReviews: 1247,
    
    // Data Sources
    dataSources: {
      current: [
        { name: 'Google Reviews', status: 'active', reviews: 847, lastSync: '2 hours ago', icon: '🔍' }
      ],
      available: [
        { name: 'Trustpilot', price: 19, description: 'Customer review platform', icon: '⭐' },
        { name: 'App Store', price: 24, description: 'Mobile app reviews', icon: '📱' },
        { name: 'Yelp', price: 29, description: 'Restaurant and local business reviews', icon: '🍽️' },
        { name: 'Reddit', price: 19, description: 'Community discussions and mentions', icon: '🤖' },
        { name: 'Intercom', price: 39, description: 'Customer support conversations', icon: '💬' },
        { name: 'Twitter', price: 24, description: 'Social media mentions and sentiment', icon: '🐦' },
        { name: 'Facebook', price: 19, description: 'Social media reviews and comments', icon: '📘' },
        { name: 'Amazon', price: 34, description: 'Product reviews and ratings', icon: '📦' }
      ]
    },
    
    // Executive Summary
    executiveSummary: {
      sentimentChange: '+14%',
      volumeChange: '+22%',
      mostPraised: 'Shipping speed',
      topComplaint: 'Return policy',
      overview: 'Customer sentiment has improved significantly this quarter, with shipping speed being the most praised aspect. However, return policy complaints remain a concern that needs immediate attention.',
      alerts: [
        { type: 'warning', message: 'Return complaints increased 25% this month', metric: 'Returns' },
        { type: 'info', message: 'Support response time improved 40%', metric: 'Support' }
      ]
    },

    // Key Insights
    keyInsights: [
      {
        insight: 'Returns complaints rose 25% this quarter',
        direction: 'down',
        mentions: 89,
        platforms: ['Google'],
        impact: 'high',
        reviews: [
          { text: 'The return process is too complicated and takes forever', topic: 'Returns', sentiment: 'negative' },
          { text: 'Had to wait 3 weeks for my refund, unacceptable', topic: 'Returns', sentiment: 'negative' },
          { text: 'Return policy needs to be simplified', topic: 'Returns', sentiment: 'negative' }
        ]
      },
      {
        insight: 'Support response time praised after April improvements',
        direction: 'up',
        mentions: 67,
        platforms: ['Reddit'],
        impact: 'medium',
        reviews: [
          { text: 'Customer service team responded within 2 hours, amazing!', topic: 'Support', sentiment: 'positive' },
          { text: 'Support was very helpful and quick to resolve my issue', topic: 'Support', sentiment: 'positive' },
          { text: 'Great improvement in response times', topic: 'Support', sentiment: 'positive' }
        ]
      },
      {
        insight: 'Pricing frequently compared to Competitor A',
        direction: 'neutral',
        mentions: 45,
        platforms: ['Reddit'],
        impact: 'medium',
        reviews: [
          { text: 'Prices are reasonable compared to Competitor A', topic: 'Pricing', sentiment: 'neutral' },
          { text: 'Good value for money, better than alternatives', topic: 'Pricing', sentiment: 'positive' },
          { text: 'Pricing is competitive in the market', topic: 'Pricing', sentiment: 'neutral' }
        ]
      },
      {
        insight: 'Mobile app features highly requested',
        direction: 'up',
        mentions: 123,
        platforms: ['Google Play'],
        impact: 'high',
        reviews: [
          { text: 'Love the new mobile app features, much better now!', topic: 'Mobile App', sentiment: 'positive' },
          { text: 'The mobile app is fantastic and easy to use', topic: 'Mobile App', sentiment: 'positive' },
          { text: 'Mobile app improvements are exactly what I needed', topic: 'Mobile App', sentiment: 'positive' }
        ]
      }
    ],

    // Sentiment Over Time
    sentimentOverTime: [
      { month: 'Jan', business: 72, competitorA: 68, competitorB: 70, competitorC: 65 },
      { month: 'Feb', business: 75, competitorA: 69, competitorB: 71, competitorC: 66 },
      { month: 'Mar', business: 78, competitorA: 70, competitorB: 72, competitorC: 67 },
      { month: 'Apr', business: 76, competitorA: 71, competitorB: 73, competitorC: 68 },
      { month: 'May', business: 79, competitorA: 72, competitorB: 74, competitorC: 69 },
      { month: 'Jun', business: 81, competitorA: 73, competitorB: 75, competitorC: 70 }
    ],

    // Mentions by Topic
    mentionsByTopic: [
      { topic: 'Support', positive: 65, neutral: 20, negative: 15, total: 100 },
      { topic: 'UX', positive: 78, neutral: 15, negative: 7, total: 100 },
      { topic: 'Returns', positive: 45, neutral: 25, negative: 30, total: 100 },
      { topic: 'Pricing', positive: 55, neutral: 30, negative: 15, total: 100 },
      { topic: 'Shipping', positive: 85, neutral: 10, negative: 5, total: 100 }
    ],

    // Trending Topics
    trendingTopics: [
      { topic: 'Mobile App', increase: '+15%', sources: ['Google Play'], sentiment: 'positive' },
      { topic: 'Customer Service', increase: '+8%', sources: ['Reddit'], sentiment: 'positive' },
      { topic: 'Return Process', increase: '+25%', sources: ['Google'], sentiment: 'negative' },
      { topic: 'Pricing', increase: '+5%', sources: ['Reddit'], sentiment: 'neutral' },
      { topic: 'Shipping Speed', increase: '+12%', sources: ['Google'], sentiment: 'positive' }
    ],

    // Volume Over Time
    volumeOverTime: [
      { week: 'W1', volume: 45, platform: 'Google' },
      { week: 'W2', volume: 52, platform: 'Google' },
      { week: 'W3', volume: 48, platform: 'Google' },
      { week: 'W4', volume: 67, platform: 'Google' },
      { week: 'W5', volume: 58, platform: 'Google' },
      { week: 'W6', volume: 73, platform: 'Google' },
      { week: 'W7', volume: 62, platform: 'Google' },
      { week: 'W8', volume: 89, platform: 'Google' }
    ],

    // Competitor Comparison
    competitorComparison: [
      { topic: 'Shipping', business: 4.2, competitorA: 3.8, competitorB: 4.0, competitorC: 3.5 },
      { topic: 'UX', business: 4.1, competitorA: 3.9, competitorB: 4.2, competitorC: 3.7 },
      { topic: 'Pricing', business: 3.8, competitorA: 4.0, competitorB: 3.9, competitorC: 4.1 },
      { topic: 'Support', business: 4.3, competitorA: 3.7, competitorB: 4.1, competitorC: 3.6 },
      { topic: 'Returns', business: 3.5, competitorA: 3.9, competitorB: 3.8, competitorC: 4.0 }
    ],

    // Market Gaps
    marketGaps: [
      { gap: 'No loyalty program', mentions: 23, suggestion: 'Implement tiered rewards system' },
      { gap: 'Lack of same-day shipping', mentions: 18, suggestion: 'Partner with local delivery services' },
      { gap: 'No HubSpot integration', mentions: 15, suggestion: 'Add CRM integration options' },
      { gap: 'Limited payment options', mentions: 10, suggestion: 'Add Apple Pay, PayPal' }
    ],

    // Advanced Metrics
    advancedMetrics: {
      trustScore: 78,
      repeatComplaints: 12,
      avgResolutionTime: '2.3 days',
      vocVelocity: '+8%'
    },

    // Suggested Actions
    suggestedActions: [
      'Improve return policy UX with clearer instructions',
      'Add live chat support to pricing page',
      'Implement mobile app feature requests',
      'Create loyalty program to reduce churn'
    ],

    // VOC Digest
    vocDigest: {
      summary: 'This month: Support improved 12%, Shipping flagged for delays, Competitor A gained 8% sentiment.',
      highlights: ['Support team response time down 40%', 'Mobile app requests up 25%', 'Return complaints stable']
    }
  }

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />
      default: return <Minus className="w-4 h-4 text-yellow-400" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400'
      case 'negative': return 'text-red-400'
      default: return 'text-yellow-400'
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
            />
          ))}
        </div>
        <span className="text-sm text-gray-300 ml-1">{rating}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f1117]/80 text-[#f3f4f6] font-sans relative overflow-x-hidden">
      {/* Enhanced Background - Matching Landing Page */}
      <div className="fixed inset-0 -z-10">
        {/* Radial gradient/vignette for depth */}
        <div className="absolute inset-0 bg-[#0f1117]" />
        <div className="absolute inset-0 bg-gradient-radial" />
        {/* More visible animated flowing gradient */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1200px] h-[900px] animate-gradient-shift blur-3xl" />
        {/* One major glow per quadrant, harmonized indigo-aqua */}
        <div className="absolute left-0 bottom-0 w-[500px] h-[400px] bg-gradient-to-tr from-[#232b4d]/40 to-[#86EFF5]/20 blur-2xl opacity-40" />
        <div className="absolute right-0 top-1/3 w-[400px] h-[300px] bg-gradient-to-bl from-[#3b82f6]/20 to-transparent blur-2xl opacity-30" />
        {/* Top Fade Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent" />
      </div>
      {/* Header - Matching Landing Page Navigation */}
      <header className="sticky top-0 z-50 w-full bg-[#1c1e26]/50 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        <div className="max-w-7xl mx-auto px-6 flex items-center h-16 justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="Execli" className="h-7 w-auto py-1" />
            </Link>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <h1 className="text-lg font-semibold text-white">VOC Report</h1>
              <p className="text-sm text-[#B0B0C0]">{reportData.businessName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 relative">
            {/* Share Button with Dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-white/20 transition-all duration-200 shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] text-[#B0B0C0] hover:text-white"
                onClick={() => setShowShareDropdown((v) => !v)}
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              {showShareDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1c1e26]/80 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl z-50">
                  <button className="w-full flex items-center px-4 py-3 hover:bg-white/10 transition-colors text-left text-[#B0B0C0] hover:text-white" onClick={() => {/* handle copy link */}}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><rect x="3" y="3" width="13" height="13" rx="2" /></svg>
                    Copy Link
                  </button>
                  <button className="w-full flex items-center px-4 py-3 hover:bg-white/10 transition-colors text-left text-[#B0B0C0] hover:text-white" onClick={() => {/* handle PDF */}}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                    Download PDF
                  </button>
                  <button className="w-full flex items-center px-4 py-3 hover:bg-white/10 transition-colors text-left text-[#B0B0C0] hover:text-white" onClick={() => {/* handle Slack */}}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                    Connect with Slack
                  </button>
                </div>
              )}
            </div>
            {/* Present Button */}
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/80 text-black rounded-full transition-all duration-200 shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] hover:bg-white/90 font-medium">
              <Wand2 className="w-4 h-4" />
              <span>Present</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Report Info */}
        <div className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white">Voice of Customer Report</h2>
                <p className="text-[#B0B0C0] mt-2">Generated on {reportData.generatedAt}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <p className="font-semibold text-white text-lg">{reportData.businessName}</p>
                  <p className="text-sm text-[#B0B0C0]">{reportData.businessUrl}</p>
                </div>
              </div>
            </div>
            
            {/* Active Sources */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Active Sources</h3>
                <button 
                  onClick={() => setShowAddSource(!showAddSource)}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#0f1117]/60 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-200 text-[#B0B0C0] hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Source</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reportData.dataSources.current.map((source, index) => (
                  <div key={index} className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{source.icon}</span>
                        <div>
                          <h5 className="font-semibold text-white">{source.name}</h5>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-[#B0B0C0]">{source.status}</span>
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-[#B0B0C0]" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#B0B0C0]">{source.reviews} reviews</span>
                      <span className="text-[#B0B0C0]">Last sync: {source.lastSync}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Live Monitor CTA */}
              <div className="mt-6 p-6 bg-[#1c1e26]/60 backdrop-blur-md rounded-xl border border-[#3b82f6]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] rounded-lg flex items-center justify-center shadow-lg">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Live Monitor</h4>
                      <p className="text-[#B0B0C0]">Get real-time insights and alerts every 24 hours</p>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg font-medium">
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Sources Modal */}
        {showAddSource && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1c1e26]/95 backdrop-blur-xl rounded-xl border border-white/10 p-6 shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">Add New Sources</h3>
                  <p className="text-sm text-[#B0B0C0]">Expand your VOC insights with additional integrations</p>
                </div>
                <button 
                  onClick={() => setShowAddSource(false)}
                  className="w-8 h-8 bg-[#0f1117]/60 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center text-[#B0B0C0] hover:text-white"
                >
                  <span className="text-lg">×</span>
                </button>
              </div>
              
              <div className="flex items-center justify-between mb-4 p-3 bg-[#0f1117]/60 backdrop-blur-md rounded-lg border border-white/5">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Zap className="w-4 h-4" />
                  <span>1 source included free • Additional sources $19-39/month</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportData.dataSources.available.map((source, index) => (
                  <div key={index} className="bg-[#0f1117]/60 backdrop-blur-md rounded-lg p-4 border border-white/5 hover:border-[#a855f7]/50 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{source.icon}</span>
                        <div>
                          <h5 className="font-medium">{source.name}</h5>
                          <p className="text-xs text-gray-400">{source.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold bg-gradient-to-r from-[#a855f7] to-pink-500 bg-clip-text text-transparent">${source.price}</div>
                        <div className="text-xs text-gray-400">/month</div>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 btn-primary rounded-lg transition-all duration-200 shadow-lg">
                      Add Integration
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-[#0f1117]/60 backdrop-blur-md rounded-lg border border-white/5">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Info className="w-4 h-4" />
                  <span>Need a custom integration? Contact our team for enterprise solutions.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Executive Summary */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Executive Summary</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: This section summarizes the quarter's customer sentiment and volume shifts across all review platforms.</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{reportData.executiveSummary.sentimentChange}</div>
                <div className="text-sm text-[#B0B0C0]">Sentiment Change</div>
              </div>
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                <div className="text-3xl font-bold text-[#3b82f6] mb-2">{reportData.executiveSummary.volumeChange}</div>
                <div className="text-sm text-[#B0B0C0]">Volume Change</div>
              </div>
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                <div className="text-xl font-semibold text-green-400 mb-2">{reportData.executiveSummary.mostPraised}</div>
                <div className="text-sm text-[#B0B0C0]">Most Praised</div>
              </div>
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                <div className="text-xl font-semibold text-red-400 mb-2">{reportData.executiveSummary.topComplaint}</div>
                <div className="text-sm text-[#B0B0C0]">Top Complaint</div>
              </div>
            </div>
            
            <p className="text-[#B0B0C0] leading-relaxed mb-6 text-lg">{reportData.executiveSummary.overview}</p>
            
            {/* Alerts */}
            {reportData.executiveSummary.alerts.length > 0 && (
              <div className="space-y-4">
                {reportData.executiveSummary.alerts.map((alert, index) => (
                  <div key={index} className={`flex items-center space-x-4 p-4 rounded-xl border ${
                    alert.type === 'warning' 
                      ? 'bg-red-500/10 border-red-500/20 text-red-300' 
                      : 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                  }`}>
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    ) : (
                      <Info className="w-6 h-6 text-blue-400" />
                    )}
                    <div>
                      <span className="font-semibold text-lg">{alert.message}</span>
                      <span className="text-sm opacity-75 ml-2">({alert.metric})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Key Insights */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Key Insights</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Key trends surfaced by clustering user feedback across time and source.</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportData.keyInsights.map((insight, index) => (
                <div key={index} className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6">
                  <div className="flex items-start space-x-4">
                    {getDirectionIcon(insight.direction)}
                    <div className="flex-1">
                      <p className="font-semibold mb-3 text-white text-lg">{insight.insight}</p>
                      <div className="flex items-center space-x-4 text-sm text-[#B0B0C0]">
                        <button 
                          onClick={() => setSelectedMentions(selectedMentions === insight.insight ? null : insight.insight)}
                          className="text-[#3b82f6] hover:text-[#3b82f6]/80 transition-colors font-medium"
                        >
                          {insight.mentions} mentions
                        </button>
                        <div className="flex space-x-2">
                          {insight.platforms.map((platform, pIndex) => (
                            <span key={pIndex} className="px-3 py-1 bg-[#1c1e26]/60 backdrop-blur-md rounded-lg text-xs border border-white/10 text-[#B0B0C0]">
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedMentions === insight.insight && (
                    <div className="mt-6 p-4 bg-[#1c1e26]/60 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
                      <h4 className="font-semibold mb-4 text-white">Sample Reviews:</h4>
                      <div className="space-y-3">
                        {insight.reviews.map((review, rIndex) => (
                          <div key={rIndex} className="text-sm">
                            <span className="text-gray-400">"{review.text}"</span>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`px-3 py-1 rounded-lg text-xs ${getSentimentColor(review.sentiment)} bg-[#0f1117]/60 backdrop-blur-md border border-white/10`}>
                                {review.topic}
                              </span>
                              <span className={`text-xs ${getSentimentColor(review.sentiment)}`}>
                                {review.sentiment}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sentiment Over Time */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Sentiment Over Time</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Track overall tone of reviews per brand over time. Spikes may indicate launches, incidents, or viral feedback.</span>
              </div>
            </div>
            
            <div className="h-96 bg-[#0f1117]/20 backdrop-blur-md rounded-xl border border-white/10 p-6 relative overflow-hidden">
              {/* Blue glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/5 to-[#8b5cf6]/5 rounded-xl"></div>
              <div className="relative z-10 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={reportData.sentimentOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(24,26,32,0.92)',
                        border: '1.5px solid #a855f7',
                        borderRadius: '18px',
                        color: '#fff',
                        boxShadow: '0 0 32px 0 #a855f7, 0 2px 24px 0 #232b4d',
                        backdropFilter: 'blur(12px)',
                        padding: '18px',
                        fontWeight: 500
                      }}
                    />
                    <Line type="monotone" dataKey="business" stroke="url(#blueGradient)" strokeWidth={3} />
                    <Line type="monotone" dataKey="competitorA" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="competitorB" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="competitorC" stroke="#f59e0b" strokeWidth={2} />
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Mentions by Topic */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Mentions by Topic</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Shows emotional distribution by category. Helpful to spot polarizing experiences.</span>
              </div>
            </div>
            
            <div className="h-96 bg-[#0f1117]/20 backdrop-blur-md rounded-xl border border-white/10 p-6 relative overflow-hidden">
              {/* Blue glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/5 to-[#8b5cf6]/5 rounded-xl"></div>
              <div className="relative z-10 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.mentionsByTopic}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="topic" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(24,26,32,0.92)',
                        border: '1.5px solid #a855f7',
                        borderRadius: '18px',
                        color: '#fff',
                        boxShadow: '0 0 32px 0 #a855f7, 0 2px 24px 0 #232b4d',
                        backdropFilter: 'blur(12px)',
                        padding: '18px',
                        fontWeight: 500
                      }}
                    />
                    <Bar dataKey="positive" stackId="a" fill="url(#positiveGradient)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="neutral" stackId="a" fill="url(#neutralGradient)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="negative" stackId="a" fill="url(#negativeGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="neutralGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                      <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Topics */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Trending Topics</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Trending keywords based on sudden spikes in mentions or sentiment shifts.</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {reportData.trendingTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTopic(selectedTopic === topic.topic ? null : topic.topic)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 backdrop-blur-md border ${
                    selectedTopic === topic.topic
                      ? 'bg-gradient-to-r from-[#a855f7] via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                      : `bg-[#0f1117]/60 ${getSentimentColor(topic.sentiment)} border-white/10 hover:bg-white/5 hover:shadow-lg hover:shadow-purple-500/10`
                  }`}
                >
                  {topic.topic} {topic.increase}
                </button>
              ))}
            </div>
            
            {selectedTopic && (
              <div className="mt-6 p-6 bg-[#0f1117]/60 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
                <h4 className="font-semibold mb-4 text-white">Sample Reviews for "{selectedTopic}"</h4>
                <div className="text-sm text-gray-400 space-y-3">
                  <p>"The {selectedTopic.toLowerCase()} is fantastic! Really improved my experience."</p>
                  <p>"Love the new {selectedTopic.toLowerCase()} features, much better now."</p>
                  <p>"{selectedTopic} could use some improvements, but getting there."</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Volume Over Time */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Volume Over Time</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Peaks can reflect social media virality, PR campaigns, or seasonal events.</span>
              </div>
            </div>
            
            <div className="h-96 bg-[#0f1117]/20 backdrop-blur-md rounded-xl border border-white/10 p-6 relative overflow-hidden">
              {/* Purple glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/5 to-pink-500/5 rounded-xl"></div>
              <div className="relative z-10 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={reportData.volumeOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="week" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(24,26,32,0.92)',
                        border: '1.5px solid #a855f7',
                        borderRadius: '18px',
                        color: '#fff',
                        boxShadow: '0 0 32px 0 #a855f7, 0 2px 24px 0 #232b4d',
                        backdropFilter: 'blur(12px)',
                        padding: '18px',
                        fontWeight: 500
                      }}
                    />
                    <Line type="monotone" dataKey="volume" stroke="url(#volumeGradient)" strokeWidth={3} />
                    <defs>
                      <linearGradient id="volumeGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Competitor Comparison */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Competitor Comparison</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: See how you stack up across review themes against selected competitors.</span>
              </div>
            </div>
            <div className="overflow-x-auto bg-[#0f1117]/20 backdrop-blur-md rounded-xl border border-white/10 p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 text-gray-300 font-semibold">Topic</th>
                    <th className="text-center py-4 text-gray-300 font-semibold">Your Brand</th>
                    <th className="text-center py-4 text-gray-300 font-semibold">Competitor A</th>
                    <th className="text-center py-4 text-gray-300 font-semibold">Competitor B</th>
                    <th className="text-center py-4 text-gray-300 font-semibold">Competitor C</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.competitorComparison.map((row, index) => (
                    <tr key={index} className="border-b border-white/5">
                      <td className="py-4 text-white font-semibold">{row.topic}</td>
                      <td className="py-4 text-center">{renderStars(row.business)}</td>
                      <td className="py-4 text-center">{renderStars(row.competitorA)}</td>
                      <td className="py-4 text-center">{renderStars(row.competitorB)}</td>
                      <td className="py-4 text-center">{renderStars(row.competitorC)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Market Gaps */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Market Gaps</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Recurring unmet needs found in customer feedback. Signals innovation or retention opportunities.</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportData.marketGaps.map((gap, index) => (
                <div key={index} className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <Lightbulb className="w-6 h-6 text-[#a855f7] mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-3 text-white text-lg">{gap.gap}</h4>
                      <p className="text-sm text-gray-400 mb-3">{gap.mentions} mentions</p>
                      <p className="text-sm text-[#a855f7] font-medium">{gap.suggestion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Metrics */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Advanced Metrics</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Quantitative signals to benchmark service performance and reliability.</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Target className="w-8 h-8 text-[#a855f7]" />
                </div>
                <div className="text-3xl font-bold text-[#a855f7] mb-2">{reportData.advancedMetrics.trustScore}</div>
                <div className="text-sm text-gray-400">Trust Score</div>
              </div>
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-red-400 mb-2">{reportData.advancedMetrics.repeatComplaints}%</div>
                <div className="text-sm text-gray-400">Repeat Complaints</div>
              </div>
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">{reportData.advancedMetrics.avgResolutionTime}</div>
                <div className="text-sm text-gray-400">Avg Resolution Time</div>
              </div>
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-green-400 mb-2">{reportData.advancedMetrics.vocVelocity}</div>
                <div className="text-sm text-gray-400">VOC Velocity</div>
              </div>
            </div>
          </div>
        </section>

        {/* Suggested Actions */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Suggested Actions</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: AI-suggested actions based on dominant complaints, gaps, or sentiment declines.</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportData.suggestedActions.map((action, index) => (
                <div key={index} className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
                    <p className="font-semibold text-white text-lg">{action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VOC Digest */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          {/* Liquid effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">VOC Digest</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: An internal digest for quick sharing with product, marketing, or CX teams.</span>
              </div>
            </div>
            
            <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#a855f7] via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-3 text-white text-lg">Monthly Summary</h4>
                  <p className="text-gray-300 mb-4 text-lg">{reportData.vocDigest.summary}</p>
                  <div className="space-y-2">
                    {reportData.vocDigest.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center space-x-3 text-sm text-gray-400">
                        <div className="w-2 h-2 bg-[#a855f7] rounded-full"></div>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-6 py-3 bg-white text-black rounded-lg transition-all duration-200 shadow-lg hover:bg-gray-100 font-medium">
                  <Share2 className="w-4 h-4" />
                  <span>Share with Team</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-3 bg-[#1c1e26]/60 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-200 shadow-lg text-[#B0B0C0] hover:text-white">
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}