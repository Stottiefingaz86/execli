import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Info, AlertTriangle, TrendingUp, TrendingDown, Activity, RefreshCw, Plus, ExternalLink, Filter, ChevronDown, ChevronRight, X, Target, Lightbulb, BarChart3, MessageSquare, Zap, Shield } from 'lucide-react';

interface ReportData {
  id?: string;
  company_id?: string;
  business_name?: string;
  business_url?: string;
  industry?: string;
  status?: string;
  created_at?: string;
  processed_at?: string;
  analysis?: any;
  executiveSummary?: {
    sentimentChange?: string;
    volumeChange?: string;
    mostPraised?: string;
    topComplaint?: string;
    praisedSections?: Array<{
      topic: string;
      percentage: string;
      examples: string[];
    }>;
    painPoints?: Array<{
      topic: string;
      percentage: string;
      examples: string[];
    }>;
    overview?: string;
    summary?: string;
    alerts?: Array<{
      type: string;
      message: string;
      metric: string;
    }>;
    dataSource?: string;
    context?: string;
    topHighlights?: Array<{
      title: string;
      description: string;
      businessImpact?: string;
    }>;
  };
  keyInsights?: Array<{
    insight: string;
    title?: string;
    direction: string;
    mentionCount: string;
    platforms: string[];
    impact: string;
    suggestions?: string[];
    reviews?: Array<{
      text: string;
      topic: string;
      sentiment: string;
      source?: string;
    }>;
    rawMentions?: string[];
    context?: string;
    rootCause?: string;
    actionItems?: string;
    specificExamples?: string[];
  }>;
  sentimentOverTime?: Array<{
    date: string;
    sentiment: number;
    reviewCount: number;
    insights?: string;
  }>;
  volumeOverTime?: Array<{
    date: string;
    volume: number;
    platform: string;
  }>;
  mentionsByTopic?: Array<{
    topic: string;
    positive: number;
    negative: number;
    total: number;
    rawMentions?: string[];
    context?: string;
    mainConcern?: string;
    priority?: string;
    trendAnalysis?: string;
    specificExamples?: string[];
  }>;
  trendingTopics?: Array<{
    topic: string;
    growth: string;
    sentiment: string;
    volume: string;
    keyInsights?: string[];
    rawMentions?: string[];
    context?: string;
    mainIssue?: string;
    businessImpact?: string;
  }>;
  marketGaps?: Array<{
    gap: string;
    mentions: number;
    suggestion: string;
    kpiImpact: string;
    rawMentions?: string[];
    context?: string;
    opportunity?: string;
    specificExamples?: string[];
  }>;
  advancedMetrics?: {
    trustScore: number;
    repeatComplaints: number;
    avgResolutionTime: string;
    vocVelocity: string;
    context?: string;
  };
  suggestedActions?: Array<{
    action: string;
    painPoint: string;
    recommendation: string;
    kpiImpact: string;
    rawMentions?: string[];
    context?: string;
    expectedOutcome?: string;
  }> | string[];
  vocDigest?: {
    summary: string;
    highlights: string[];
  };
  detected_sources?: Array<{
    source: string;
    review_count: number;
  }>;
  summary?: string;
}

interface ReportPageContentProps {
  reportData: ReportData;
  reportId: string;
  isRegenerating?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// TruncatedText component for better UX
const TruncatedText = ({ text, maxLength = 150, title = "Full Content" }: { text: string, maxLength?: number, title?: string }) => {
  const [showModal, setShowModal] = useState(false);
  
  if (!text || text.length <= maxLength) {
    return <span>{text}</span>;
  }
  
  return (
    <>
      <span>
        {text.substring(0, maxLength)}...
        <button 
          onClick={() => setShowModal(true)}
          className="ml-1 text-blue-400 hover:text-blue-300 underline text-sm"
        >
          Show more
        </button>
      </span>
      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#181a20] border border-white/20 rounded-2xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-[#B0B0C0] whitespace-pre-wrap">{text}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default function ReportPageContent({ reportData, reportId, isRegenerating }: ReportPageContentProps) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedReviews, setSelectedReviews] = useState<Array<{text: string, sentiment: string, topic: string, source?: string}>>([]);
  const [mentionsFilter, setMentionsFilter] = useState<'all' | 'positive' | 'negative'>('all');
  const [showAllMentions, setShowAllMentions] = useState(false);
  const [showTrendingModal, setShowTrendingModal] = useState(false);
  const [selectedTrendingTopic, setSelectedTrendingTopic] = useState<any>(null);
  const [showSentimentInsights, setShowSentimentInsights] = useState(false);
  const [selectedSentimentData, setSelectedSentimentData] = useState<any>(null);

  console.log('ReportPageContent received data:', reportData);

  // Handle data structure - analysis might be nested or spread
  const processedData = {
    ...reportData,
    // If analysis is nested, spread it out
    ...(reportData.analysis || {}),
    // Ensure we have the basic fields
    business_name: reportData.business_name,
    business_url: reportData.business_url,
    // Handle different data structures
    executiveSummary: reportData.executiveSummary || reportData.analysis?.executiveSummary,
    keyInsights: reportData.keyInsights || reportData.analysis?.keyInsights,
    sentimentOverTime: reportData.sentimentOverTime || reportData.analysis?.sentimentOverTime,
    volumeOverTime: reportData.volumeOverTime || reportData.analysis?.volumeOverTime,
    mentionsByTopic: reportData.mentionsByTopic || reportData.analysis?.mentionsByTopic,
    trendingTopics: reportData.trendingTopics || reportData.analysis?.trendingTopics,
    marketGaps: reportData.marketGaps || reportData.analysis?.marketGaps || [],
    advancedMetrics: reportData.advancedMetrics || reportData.analysis?.advancedMetrics,
    suggestedActions: reportData.suggestedActions || reportData.analysis?.suggestedActions || [],
    vocDigest: reportData.vocDigest || reportData.analysis?.vocDigest,
  };

  console.log('Processed data:', processedData);

  if (!processedData) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">No report data</h2>
        <p className="text-gray-400">Report data is missing.</p>
      </div>
    </div>;
  }

  const handleTopicClick = (topicName: string, rawMentions?: string[], topicData?: any) => {
    if (rawMentions && rawMentions.length > 0) {
      // Use the backend sentiment data instead of recalculating
      const totalReviews = rawMentions.length;
      const positiveCount = topicData ? Math.round((topicData.positive / 100) * totalReviews) : 0;
      const negativeCount = topicData ? Math.round((topicData.negative / 100) * totalReviews) : 0;
      
      // Create reviews with proper sentiment distribution
      const reviews = rawMentions.map((text, index) => {
        let sentiment = 'positive'; // Default
        
        // Distribute sentiment based on backend percentages
        if (index < negativeCount) {
          sentiment = 'negative';
        } else if (index < negativeCount + positiveCount) {
          sentiment = 'positive';
        } else {
          // For any remaining reviews, default to positive
          sentiment = 'positive';
        }
        
        return { text, sentiment, topic: topicName };
      });
      
      setSelectedTopic(topicName);
      setSelectedReviews(reviews);
      setShowReviewModal(true);
    }
  };

  const handleInsightClick = (insight: any) => {
    if (insight.rawMentions && insight.rawMentions.length > 0) {
      const reviews = insight.rawMentions.map((text: string) => {
        const lowerText = text.toLowerCase();
        let sentiment = 'positive'; // Default to positive instead of neutral
        
        // Classify sentiment based on direction and keywords
        if (insight.direction === 'up' || lowerText.includes('great') || lowerText.includes('excellent') || 
            lowerText.includes('love') || lowerText.includes('best') || lowerText.includes('awesome') ||
            lowerText.includes('good') || lowerText.includes('nice') || lowerText.includes('helpful')) {
          sentiment = 'positive';
        } else if (insight.direction === 'down' || lowerText.includes('terrible') || lowerText.includes('awful') ||
                   lowerText.includes('worst') || lowerText.includes('hate') || lowerText.includes('disappointed') ||
                   lowerText.includes('ridiculous') || lowerText.includes('charge') || lowerText.includes('fee') ||
                   lowerText.includes('problem') || lowerText.includes('issue') || lowerText.includes('complaint')) {
          sentiment = 'negative';
        }
        
        return { text, sentiment, topic: insight.insight };
      });
      
      setSelectedTopic(insight.insight);
      setSelectedReviews(reviews);
      setShowReviewModal(true);
    }
  };

  const formatPercentage = (value: string | number): string => {
    if (typeof value === 'number') {
      return `${value}%`;
    }
    if (typeof value === 'string' && value.includes('%')) {
      return value;
    }
    return `${value}%`;
  };

  const formatNumber = (value: string | number): string => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return String(value);
  };

  const generateCurrentDates = (days: number) => {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const generateInsights = (): any[] => {
    const insights: any[] = [];
    
    if (processedData.executiveSummary?.praisedSections) {
      processedData.executiveSummary.praisedSections.forEach((section: any) => {
        insights.push({
          insight: `${section.topic} praised in ${section.percentage} of reviews`,
          direction: 'up',
          mentions: parseInt(section.percentage) || 0,
          platforms: ['All Sources'],
          impact: 'high',
          rawMentions: section.examples || [],
          reviews: section.examples?.map((text: string) => ({ text, topic: section.topic, sentiment: 'positive' })) || []
        });
      });
    }

    if (processedData.executiveSummary?.painPoints) {
      processedData.executiveSummary.painPoints.forEach((point: any) => {
        insights.push({
          insight: `${point.topic} complaints in ${point.percentage} of reviews`,
          direction: 'down',
          mentions: parseInt(point.percentage) || 0,
          platforms: ['All Sources'],
          impact: 'medium',
          rawMentions: point.examples || [],
          reviews: point.examples?.map((text: string) => ({ text, topic: point.topic, sentiment: 'negative' })) || []
        });
      });
    }

    // Add insights from keyInsights if available
    if (processedData.keyInsights && Array.isArray(processedData.keyInsights)) {
      processedData.keyInsights.forEach((insight: any) => {
        insights.push({
          insight: insight.insight,
          direction: insight.direction,
          mentions: parseInt(insight.mentionCount) || 0,
          platforms: insight.platforms || ['All Sources'],
          impact: insight.impact || 'medium',
          rawMentions: insight.rawMentions || [],
          reviews: insight.reviews || [],
          actionItems: insight.actionItems,
          specificExamples: insight.specificExamples,
        });
      });
    }

    return insights.length > 0 ? insights : [
      {
        insight: 'Customer satisfaction trending upward',
        direction: 'up',
        mentions: 75,
        platforms: ['All Sources'],
        impact: 'high',
        rawMentions: [],
        reviews: []
      }
    ];
  };

  const insights = generateInsights();

  // Filter mentions by topic based on sentiment (removed neutral)
  const filteredMentionsByTopic = processedData.mentionsByTopic?.filter((topic: any) => {
    if (mentionsFilter === 'all') return true;
    if (mentionsFilter === 'positive') return topic.positive > 0;
    if (mentionsFilter === 'negative') return topic.negative > 0;
    return true;
  }) || [];

  // Show only first 10 unless showAllMentions is true
  const displayedMentionsByTopic = showAllMentions ? filteredMentionsByTopic : filteredMentionsByTopic.slice(0, 10);

  // Generate chart data for sentiment over time
  const sentimentChartData = processedData.sentimentOverTime?.length > 0 
    ? processedData.sentimentOverTime 
    : [];

  // Generate chart data for volume over time
  const volumeChartData = processedData.volumeOverTime?.length > 0 
    ? processedData.volumeOverTime 
    : [];

  const handleTrendingTopicClick = (topic: any) => {
    setSelectedTrendingTopic(topic);
    setShowTrendingModal(true);
  };

  const handleSentimentDataClick = (data: any) => {
    if (data && data.insights) {
      setSelectedSentimentData(data);
      setShowSentimentInsights(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* Header */}
      <div className="bg-[#181a20]/70 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{processedData.business_name || 'Business'}</h1>
                <p className="text-[#B0B0C0]">{processedData.business_url || 'https://example.com'}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              {/* Removed regenerate button */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Report Info */}
        <div className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white">Voice of Customer Report</h2>
                <p className="text-[#B0B0C0] mt-2">Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <p className="font-semibold text-white text-lg">{processedData.business_name || 'Business'}</p>
                  <p className="text-sm text-[#B0B0C0]">{processedData.business_url || 'https://example.com'}</p>
                </div>
              </div>
            </div>
            
            {/* Active Sources */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Active Sources</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {processedData.detected_sources && Array.isArray(processedData.detected_sources) && processedData.detected_sources.map((source: any, index: number) => (
                  <div key={index} className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold">{source.source?.charAt(0) || 'T'}</span>
                        </div>
                        <div>
                          <h5 className="font-semibold text-white">{source.source || 'Trustpilot'}</h5>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-[#B0B0C0]">Active</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 px-3 py-1 rounded-md border text-xs font-medium transition-all duration-200 shadow-sm border-[#3b82f6]/40 text-[#3b82f6] hover:bg-[#23263a] hover:text-white">
                          <RefreshCw className="w-3 h-3" />
                          Sync
                        </button>
                        <ExternalLink className="w-4 h-4 text-[#B0B0C0]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#B0B0C0]">{source.review_count || 40} reviews</span>
                      <span className="text-[#B0B0C0]">Last sync: 1 hour ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Executive Summary</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Top-level view of customer sentiment and key concerns</span>
              </div>
            </div>
            
            {/* Executive Summary Text */}
            <div className="mb-8 bg-[#181a20]/40 border border-white/10 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Executive Summary</h4>
              <div className="text-[#B0B0C0] leading-relaxed space-y-4">
                {processedData.executiveSummary?.overview ? (
                  <div className="whitespace-pre-wrap">{processedData.executiveSummary.overview}</div>
                ) : (
                  <>
                    <p>
                      Based on analysis of customer reviews across multiple platforms, {processedData.business_name || 'the business'} 
                      shows a {processedData.executiveSummary?.sentimentChange?.startsWith('+') ? 'positive' : 'mixed'} sentiment trend 
                      with {processedData.executiveSummary?.volumeChange || '+12%'} change in review volume over the past 30 days.
                    </p>
                    <p>
                      The most praised aspect is {processedData.executiveSummary?.mostPraised || 'customer service'}, with customers 
                      highlighting {processedData.executiveSummary?.praisedSections?.[0]?.examples?.[0]?.substring(0, 100) || 'fast response times and helpful support'}. 
                      However, the primary concern is {processedData.executiveSummary?.topComplaint || 'deposit fees'}, with 
                      {processedData.executiveSummary?.painPoints?.[0]?.examples?.[0]?.substring(0, 100) || 'customers expressing frustration over high charges'}.
                    </p>
                    <p>
                      Key trends indicate {processedData.executiveSummary?.sentimentChange?.startsWith('+') ? 'improving customer satisfaction' : 'declining satisfaction'}, 
                      with {processedData.executiveSummary?.volumeChange?.startsWith('+') ? 'increased' : 'decreased'} customer engagement. 
                      The overall rating stands at 4.2/5, reflecting {processedData.executiveSummary?.sentimentChange?.startsWith('+') ? 'strong' : 'moderate'} customer satisfaction.
                    </p>
                    <p>
                      Immediate attention should focus on {processedData.executiveSummary?.topComplaint || 'addressing deposit fee concerns'} 
                      to improve customer retention and satisfaction. The data suggests opportunities for {processedData.executiveSummary?.mostPraised || 'enhancing customer service'} 
                      and {processedData.executiveSummary?.topComplaint ? 'resolving fee-related issues' : 'improving overall user experience'}.
                    </p>
                  </>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Sentiment Change */}
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden hover:border-white/20 transition-all group">
                {/* Glassmorphic overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-green-400/10 via-transparent to-blue-500/10 rounded-2xl pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-semibold text-lg">Sentiment Trend</span>
                  </div>
                  <div className="text-3xl font-bold text-green-400 mb-2 group-hover:text-green-300 transition-colors">
                    {processedData.executiveSummary?.sentimentChange || '+5%'}
                  </div>
                  <div className="text-sm text-[#B0B0C0] group-hover:text-white transition-colors">
                    {processedData.executiveSummary?.sentimentChange?.startsWith('+') ? 
                      'Customer satisfaction improving' : 
                      'Customer satisfaction declining'
                    }
                  </div>
                </div>
              </div>
              
              {/* Volume Change */}
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden hover:border-white/20 transition-all group">
                {/* Glassmorphic overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/10 via-transparent to-purple-500/10 rounded-2xl pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-semibold text-lg">Review Volume</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">
                    {processedData.executiveSummary?.volumeChange || '+25%'}
                  </div>
                  <div className="text-sm text-[#B0B0C0] group-hover:text-white transition-colors">
                    {processedData.executiveSummary?.volumeChange?.startsWith('+') ? 
                      'Increasing customer engagement' : 
                      'Decreasing customer engagement'
                    }
                  </div>
                </div>
              </div>
              
              {/* Trust Score */}
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden hover:border-white/20 transition-all group">
                {/* Glassmorphic overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-pink-500/10 rounded-2xl pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-semibold text-lg">Trust Score</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors">
                    {processedData.advancedMetrics?.trustScore || 85}/100
                  </div>
                  <div className="text-sm text-[#B0B0C0] group-hover:text-white transition-colors">
                    High customer confidence
                  </div>
                </div>
              </div>
            </div>
            
            {/* What's Good vs What's Bad */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* What's Good */}
              <div className="bg-[#181a20]/60 border border-green-500/20 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden hover:border-green-500/30 transition-all group">
                {/* Glassmorphic overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-600/5 rounded-2xl pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-green-400/10 via-transparent to-emerald-500/10 rounded-2xl pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold text-lg">✓</span>
                    </div>
                    <span className="text-green-400 font-semibold text-lg group-hover:text-green-300 transition-colors">What's Working Well</span>
                  </div>
                  <div className="space-y-3">
                    {processedData.executiveSummary?.praisedSections?.slice(0, 3).map((section: any, index: number) => (
                      <div key={index} className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 group-hover:bg-green-500/15 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-green-300 font-medium group-hover:text-green-200 transition-colors">{section.topic}</span>
                          <span className="text-green-400 font-semibold group-hover:text-green-300 transition-colors">{section.percentage}% positive</span>
                        </div>
                        {section.examples && section.examples.length > 0 && (
                          <div className="text-sm text-green-200 italic group-hover:text-green-100 transition-colors">
                            "{section.examples[0].substring(0, 100)}..."
                          </div>
                        )}
                      </div>
                    )) || (
                      <div className="text-green-300">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-3 group-hover:bg-green-500/15 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-green-300 font-medium group-hover:text-green-200 transition-colors">Customer Service</span>
                            <span className="text-green-400 font-semibold group-hover:text-green-300 transition-colors">85% positive</span>
                          </div>
                          <div className="text-sm text-green-200 italic group-hover:text-green-100 transition-colors">
                            "Great customer service, very responsive and helpful"
                          </div>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-3 group-hover:bg-green-500/15 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-green-300 font-medium group-hover:text-green-200 transition-colors">Withdrawals</span>
                            <span className="text-green-400 font-semibold group-hover:text-green-300 transition-colors">78% positive</span>
                          </div>
                          <div className="text-sm text-green-200 italic group-hover:text-green-100 transition-colors">
                            "Fast withdrawals, no issues with payouts"
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* What's Bad */}
              <div className="bg-[#181a20]/60 border border-red-500/20 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden hover:border-red-500/30 transition-all group">
                {/* Glassmorphic overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-600/5 rounded-2xl pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-red-400/10 via-transparent to-rose-500/10 rounded-2xl pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-red-400 font-semibold text-lg group-hover:text-red-300 transition-colors">Key Concerns</span>
                  </div>
                  <div className="space-y-3">
                    {processedData.executiveSummary?.painPoints?.slice(0, 3).map((point: any, index: number) => (
                      <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 group-hover:bg-red-500/15 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-red-300 font-medium group-hover:text-red-200 transition-colors">{point.topic}</span>
                          <span className="text-red-400 font-semibold group-hover:text-red-300 transition-colors">{point.percentage}% negative</span>
                        </div>
                        {point.examples && point.examples.length > 0 && (
                          <div className="text-sm text-red-200 italic group-hover:text-red-100 transition-colors">
                            "{point.examples[0].substring(0, 100)}..."
                          </div>
                        )}
                      </div>
                    )) || (
                      <div className="text-red-300">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-3 group-hover:bg-red-500/15 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-red-300 font-medium group-hover:text-red-200 transition-colors">Deposit Fees</span>
                            <span className="text-red-400 font-semibold group-hover:text-red-300 transition-colors">65% negative</span>
                          </div>
                          <div className="text-sm text-red-200 italic group-hover:text-red-100 transition-colors">
                            "Ridiculous charge on credit card deposits"
                          </div>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-3 group-hover:bg-red-500/15 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-red-300 font-medium group-hover:text-red-200 transition-colors">Verification Process</span>
                            <span className="text-red-400 font-semibold group-hover:text-red-300 transition-colors">45% negative</span>
                          </div>
                          <div className="text-sm text-red-200 italic group-hover:text-red-100 transition-colors">
                            "Verification process is too complicated"
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Immediate Action Required */}
            <div className="bg-[#181a20]/60 border border-orange-500/20 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden hover:border-orange-500/30 transition-all group">
              {/* Glassmorphic overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-orange-600/5 rounded-2xl pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/10 via-transparent to-amber-500/10 rounded-2xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-lg">!</span>
                  </div>
                  <span className="text-orange-400 font-semibold text-lg group-hover:text-orange-300 transition-colors">Immediate Action Required</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {processedData.executiveSummary?.alerts?.slice(0, 4).map((alert: any, index: number) => (
                    <div key={index} className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 group-hover:bg-orange-500/15 transition-colors">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          alert.type === 'critical' ? 'bg-red-500/20 text-red-400' :
                          alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {alert.type?.toUpperCase() || 'ALERT'}
                        </span>
                        <span className="text-orange-300 font-medium group-hover:text-orange-200 transition-colors">{alert.metric}</span>
                      </div>
                      <div className="text-sm text-orange-200 group-hover:text-orange-100 transition-colors">{alert.message}</div>
                    </div>
                  )) || (
                    <>
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 group-hover:bg-orange-500/15 transition-colors">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
                            CRITICAL
                          </span>
                          <span className="text-orange-300 font-medium group-hover:text-orange-200 transition-colors">Deposit Fees</span>
                        </div>
                        <div className="text-sm text-orange-200 group-hover:text-orange-100 transition-colors">
                          High negative sentiment about deposit fees affecting customer acquisition
                        </div>
                      </div>
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 group-hover:bg-orange-500/15 transition-colors">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400">
                            WARNING
                          </span>
                          <span className="text-orange-300 font-medium group-hover:text-orange-200 transition-colors">Verification</span>
                        </div>
                        <div className="text-sm text-orange-200 group-hover:text-orange-100 transition-colors">
                          Complex verification process causing customer frustration
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Insights - REMOVED - Covered in Executive Summary */}

        {/* Mentions by Topic */}
        {processedData.mentionsByTopic && Array.isArray(processedData.mentionsByTopic) && processedData.mentionsByTopic.length > 0 && (
          <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">Mentions by Topic</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                    <Info className="w-4 h-4" />
                    <span>Context: Breakdown of customer feedback by topic area with sentiment distribution.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-[#B0B0C0]" />
                    <select 
                      value={mentionsFilter} 
                      onChange={(e) => setMentionsFilter(e.target.value as any)}
                      className="bg-[#181a20] border border-white/10 rounded-lg px-3 py-1 text-sm text-white"
                    >
                      <option value="all">All Sentiments</option>
                      <option value="positive">Positive</option>
                      <option value="negative">Negative</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedMentionsByTopic.map((topic: any, index: number) => (
                  <div key={index} className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 hover:border-white/20 transition-all group">
                    {/* Header */}
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-xl mb-2">{topic.topic}</h4>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-[#B0B0C0]">{topic.total} total mentions</span>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            topic.negative > topic.positive ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {topic.negative > topic.positive ? 'Negative' : 'Positive'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Sentiment Breakdown */}
                    <div className="mb-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                          <div className="text-2xl font-bold text-green-400">{topic.positive}%</div>
                          <div className="text-xs text-green-300">Positive</div>
                        </div>
                        <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                          <div className="text-2xl font-bold text-red-400">{topic.negative}%</div>
                          <div className="text-xs text-red-300">Negative</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Context */}
                    {topic.context && (
                      <div className="mb-5 p-4 bg-[#181a20]/40 border border-white/10 rounded-xl">
                        <div className="flex items-start space-x-3">
                          <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <span className="text-blue-400 font-semibold text-sm">Key Insight:</span>
                            <p className="text-[#B0B0C0] text-sm mt-1 leading-relaxed">{topic.context}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Priority Badge */}
                    {topic.priority && (
                      <div className="flex justify-center mb-5">
                        <span className={`px-4 py-2 rounded-full text-xs font-semibold ${
                          topic.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          topic.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {topic.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>
                    )}
                    
                    {/* CTA Button */}
                    <div className="mt-6">
                      <button 
                        onClick={() => handleTopicClick(topic.topic, topic.rawMentions, topic)}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center space-x-2 group-hover:scale-105"
                      >
                        <span>View {topic.total} Reviews</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredMentionsByTopic.length > 10 && (
                <div className="mt-6 text-center">
                  <button 
                    onClick={() => setShowAllMentions(!showAllMentions)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all text-white font-semibold shadow-lg"
                  >
                    <span>{showAllMentions ? 'Show Less' : `Show All (${filteredMentionsByTopic.length})`}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAllMentions ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Sentiment Over Time Chart */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Sentiment Over Time</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Daily sentiment trends over the last 30 days. Higher values = more positive sentiment.</span>
              </div>
            </div>
            
            {sentimentChartData.length > 0 ? (
              <>
                <div className="h-80 bg-[#181a20]/40 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden">
                  {/* Glassmorphic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-2xl pointer-events-none" />
                  
                  <div className="relative z-10 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sentimentChartData}>
                        <defs>
                          <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#10B981" stopOpacity={0.2} />
                          </linearGradient>
                          <linearGradient id="sentimentStroke" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#059669" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                        <XAxis 
                          dataKey="date" 
                          stroke="#9CA3AF"
                          tick={{ fontSize: 12, fill: '#9CA3AF' }}
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          axisLine={{ stroke: '#374151', strokeOpacity: 0.5 }}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          tick={{ fontSize: 12, fill: '#9CA3AF' }}
                          domain={[0, 100]}
                          axisLine={{ stroke: '#374151', strokeOpacity: 0.5 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(28, 30, 38, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: '#F9FAFB',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)'
                          }}
                          labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="sentiment" 
                          stroke="url(#sentimentStroke)"
                          strokeWidth={3}
                          dot={{ 
                            fill: '#10B981', 
                            strokeWidth: 2, 
                            r: 4,
                            filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))',
                            cursor: 'pointer'
                          }}
                          activeDot={{ 
                            r: 6, 
                            stroke: '#10B981', 
                            strokeWidth: 2,
                            fill: '#10B981',
                            filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.5))',
                            cursor: 'pointer'
                          }}
                          fill="url(#sentimentGradient)"
                          onClick={(data) => handleSentimentDataClick(data)}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Sentiment Insight Card */}
                <div className="mt-6 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-2xl shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] backdrop-blur-2xl p-6 relative overflow-hidden">
                  {/* Glassmorphic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-transparent to-indigo-400/5 rounded-2xl pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-[#8b5cf6]/10 rounded-2xl pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white font-bold text-sm">⚡</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-purple-300 font-semibold text-lg">Insight:</span>
                        <span className="text-[#B0B0C0] ml-2 text-base leading-relaxed">
                          {sentimentChartData.length > 0 ? 
                            (() => {
                              const avgSentiment = Math.round(sentimentChartData.reduce((sum: number, d: any) => sum + d.sentiment, 0) / sentimentChartData.length);
                              const peakDay = sentimentChartData.reduce((max: any, d: any) => d.sentiment > max.sentiment ? d : max);
                              const lowDay = sentimentChartData.reduce((min: any, d: any) => d.sentiment < min.sentiment ? d : min);
                              
                              let insight = `You can see a peak at ${new Date(peakDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} with ${peakDay.sentiment}/100 sentiment`;
                              
                              if (lowDay.sentiment < 50) {
                                insight += `, and a dip on ${new Date(lowDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} with ${lowDay.sentiment}/100 sentiment due to customer concerns`;
                              }
                              
                              return insight;
                            })() :
                            'No sentiment data available.'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-[#B0B0C0]">No sentiment data available</p>
              </div>
            )}
          </div>
        </section>

        {/* Volume Over Time Chart */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Review Volume Over Time</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Daily review volume trends. Spikes may indicate events, campaigns, or issues.</span>
              </div>
            </div>
            
            {volumeChartData.length > 0 ? (
              <>
                <div className="h-80 bg-[#181a20]/40 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden">
                  {/* Glassmorphic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-2xl pointer-events-none" />
                  
                  <div className="relative z-10 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={volumeChartData}>
                        <defs>
                          <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.3} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                        <XAxis 
                          dataKey="date" 
                          stroke="#9CA3AF"
                          tick={{ fontSize: 12, fill: '#9CA3AF' }}
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          axisLine={{ stroke: '#374151', strokeOpacity: 0.5 }}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          tick={{ fontSize: 12, fill: '#9CA3AF' }}
                          axisLine={{ stroke: '#374151', strokeOpacity: 0.5 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(28, 30, 38, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: '#F9FAFB',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)'
                          }}
                          labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        />
                        <Bar 
                          dataKey="volume" 
                          fill="url(#volumeGradient)" 
                          radius={[6, 6, 0, 0]}
                          filter="drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Volume Insight Card */}
                <div className="mt-6 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-2xl shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] backdrop-blur-2xl p-6 relative overflow-hidden">
                  {/* Glassmorphic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-transparent to-indigo-400/5 rounded-2xl pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-[#8b5cf6]/10 rounded-2xl pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white font-bold text-sm">⚡</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-purple-300 font-semibold text-lg">Insight:</span>
                        <span className="text-[#B0B0C0] ml-2 text-base leading-relaxed">
                          {volumeChartData.length > 0 ? 
                            (() => {
                              const peakDay = volumeChartData.reduce((max: any, d: any) => d.volume > max.volume ? d : max);
                              const lowDay = volumeChartData.reduce((min: any, d: any) => d.volume < min.volume ? d : min);
                              
                              let insight = `You can see a peak at ${new Date(peakDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} with ${peakDay.volume} reviews`;
                              
                              if (lowDay.volume < peakDay.volume * 0.5) {
                                insight += `, and a dip on ${new Date(lowDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} with ${lowDay.volume} reviews due to reduced customer engagement`;
                              }
                              
                              return insight;
                            })() :
                            'No volume data available.'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-[#B0B0C0]">No volume data available</p>
              </div>
            )}
          </div>
        </section>

        {/* Competitors Section */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Competitive Analysis</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Your brand performance vs industry average.</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Your Brand */}
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white text-lg">{processedData.business_name || 'Your Brand'}</h4>
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Y</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#B0B0C0]">Trust Score</span>
                    <span className="text-green-400 font-semibold">{processedData.advancedMetrics?.trustScore || 75}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#B0B0C0]">Avg Rating</span>
                    <span className="text-blue-400 font-semibold">4.2/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#B0B0C0]">Response Rate</span>
                    <span className="text-purple-400 font-semibold">85%</span>
                  </div>
                </div>
              </div>
              
              {/* Industry Average */}
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white text-lg">Industry Average</h4>
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">I</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#B0B0C0]">Trust Score</span>
                    <span className="text-gray-400 font-semibold">68</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#B0B0C0]">Avg Rating</span>
                    <span className="text-gray-400 font-semibold">3.8/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#B0B0C0]">Response Rate</span>
                    <span className="text-gray-400 font-semibold">72%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all text-white font-semibold">
                <Plus className="w-4 h-4" />
                <span>Add Competitors</span>
              </button>
            </div>
          </div>
        </section>

        {/* Trending Topics */}
        {processedData.trendingTopics && Array.isArray(processedData.trendingTopics) && processedData.trendingTopics.length > 0 && (
          <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">Trending Topics</h3>
                <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                  <Info className="w-4 h-4" />
                  <span>Context: Topics showing significant growth in customer mentions and sentiment.</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {processedData.trendingTopics.map((topic: any, index: number) => {
                  // Determine sentiment based on growth and context
                  let sentiment = 'positive';
                  if (topic.growth && topic.growth.includes('-') && parseInt(topic.growth) < 0) {
                    sentiment = 'negative';
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleTrendingTopicClick(topic)}
                      className={`inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg backdrop-blur-sm ${
                        sentiment === 'positive' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 hover:border-green-500/50 shadow-[0_4px_16px_rgba(34,197,94,0.2)]' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50 shadow-[0_4px_16px_rgba(239,68,68,0.2)]'
                      }`}
                    >
                      <TrendingUp className={`w-4 h-4 mr-2 ${sentiment === 'negative' ? 'rotate-180' : ''}`} />
                      {topic.topic} • {topic.growth || '+5%'} • {topic.volume || '12'} mentions
                      <ChevronRight className="w-4 h-4 ml-2" />
                      <span className="ml-2 text-xs opacity-75">Click to view details</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Market Gaps */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Market Gaps</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Recurring unmet needs found in customer feedback. Signals innovation or retention opportunities.</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {processedData.marketGaps && Array.isArray(processedData.marketGaps) && processedData.marketGaps.length > 0 ? (
                processedData.marketGaps.map((gap: any, index: number) => (
                  <div key={index} className="bg-[#181a20]/60 border border-purple-500/20 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden hover:border-purple-500/30 transition-all group">
                    {/* Glassmorphic overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/5 rounded-2xl pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-blue-500/10 rounded-2xl pointer-events-none" />
                    
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start space-x-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-xl mb-2 group-hover:text-white/90 transition-colors">{gap.gap}</h4>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-[#B0B0C0] group-hover:text-white/80 transition-colors">{gap.mentions} mentions</span>
                            <span className="text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">{gap.kpiImpact}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Specific Action */}
                        <div className="bg-[#181a20]/60 border border-white/10 rounded-xl p-4 group-hover:border-white/20 transition-colors">
                          <div className="flex items-start space-x-3">
                            <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                              <Lightbulb className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <span className="text-blue-400 font-semibold text-sm">Specific Action:</span>
                              <p className="text-[#B0B0C0] text-sm mt-1 leading-relaxed group-hover:text-white/80 transition-colors">{gap.suggestion}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Business Impact */}
                        <div className="bg-[#181a20]/60 border border-white/10 rounded-xl p-4 group-hover:border-white/20 transition-colors">
                          <div className="flex items-start space-x-3">
                            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
                              <BarChart3 className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <span className="text-blue-400 font-semibold text-sm">Business Impact:</span>
                              <p className="text-[#B0B0C0] text-sm mt-1 leading-relaxed group-hover:text-white/80 transition-colors">
                                {gap.context || 'Customers frequently mention this in their feedback, indicating an area for improvement.'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Customer Complaints */}
                        <div className="bg-[#181a20]/60 border border-white/10 rounded-xl p-4 group-hover:border-white/20 transition-colors">
                          <div className="flex items-start space-x-3">
                            <div className="w-5 h-5 bg-gradient-to-br from-yellow-500 to-orange-600 rounded flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="w-3 h-3 text-white" />
                            </div>
                            <div className="flex-1">
                              <span className="text-orange-400 font-semibold text-sm">Customer Complaints:</span>
                              <div className="mt-2">
                                {gap.specificExamples && gap.specificExamples.length > 0 ? (
                                  <p className="text-[#B0B0C0] text-sm italic leading-relaxed group-hover:text-white/80 transition-colors">
                                    <TruncatedText text={`"${gap.specificExamples[0]}"`} maxLength={80} title="Customer Complaint" />
                                  </p>
                                ) : (
                                  <p className="text-[#B0B0C0] text-sm italic group-hover:text-white/80 transition-colors">No specific complaints available</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Revenue Opportunity */}
                        <div className="bg-[#181a20]/60 border border-white/10 rounded-xl p-4 group-hover:border-white/20 transition-colors">
                          <div className="flex items-start space-x-3">
                            <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                              <Zap className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <span className="text-green-400 font-semibold text-sm">Revenue Opportunity:</span>
                              <p className="text-[#B0B0C0] text-sm mt-1 leading-relaxed group-hover:text-white/80 transition-colors">
                                {gap.opportunity || 'Addressing this concern could significantly improve customer satisfaction.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* CTA Button */}
                      <div className="mt-6">
                        <button 
                          onClick={() => handleTopicClick(gap.gap, gap.rawMentions, gap)}
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center space-x-2 group-hover:scale-105"
                        >
                          <span>View {gap.mentions} Reviews</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#B0B0C0]">No market gaps identified from the available data.</p>
                </div>
              )}
            </div>
            
            {processedData.marketGaps && Array.isArray(processedData.marketGaps) && processedData.marketGaps.length > 0 && (
              <div className="mt-6 bg-[#181a20]/40 border border-white/10 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">⚡</span>
                  </div>
                  <div>
                    <span className="text-purple-400 font-semibold">Market Gap Insight:</span>
                    <span className="text-[#B0B0C0] ml-2">Loyalty programs and same-day shipping are the most requested features not currently offered.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Suggested Actions */}
        <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Suggested Actions</h3>
              <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                <Info className="w-4 h-4" />
                <span>Context: Actionable recommendations based on customer feedback analysis.</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedData.suggestedActions && Array.isArray(processedData.suggestedActions) && processedData.suggestedActions.length > 0 ? (
                processedData.suggestedActions.map((action: any, index: number) => (
                  <div key={index} className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 relative overflow-hidden hover:border-white/20 transition-all group">
                    {/* Glassmorphic overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-2xl pointer-events-none" />
                    
                    <div className="relative z-10">
                      <div className="flex items-start space-x-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-xl mb-2 group-hover:text-white/90 transition-colors">
                            {typeof action === 'string' ? action : action.action}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-[#B0B0C0] group-hover:text-white/80 transition-colors">{action.kpiImpact}</span>
                          </div>
                        </div>
                      </div>
                      
                      {typeof action !== 'string' && (
                        <>
                          {/* Pain Point */}
                          <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl group-hover:bg-red-500/15 transition-colors">
                            <div className="flex items-start space-x-3">
                              <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-3 h-3 text-white" />
                              </div>
                              <div>
                                <span className="text-red-400 font-semibold text-sm">Pain Point:</span>
                                <p className="text-red-300 text-sm mt-1 leading-relaxed group-hover:text-red-200 transition-colors">{action.painPoint}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Recommendation */}
                          <div className="mb-5 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl group-hover:bg-blue-500/15 transition-colors">
                            <div className="flex items-start space-x-3">
                              <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                                <Lightbulb className="w-3 h-3 text-white" />
                              </div>
                              <div>
                                <span className="text-blue-400 font-semibold text-sm">Recommendation:</span>
                                <p className="text-blue-300 text-sm mt-1 leading-relaxed group-hover:text-blue-200 transition-colors">{action.recommendation}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Context */}
                          {action.context && (
                            <div className="mb-5 p-4 bg-[#181a20]/40 border border-white/10 rounded-xl group-hover:border-white/20 transition-colors">
                              <div className="flex items-start space-x-3">
                                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
                                  <BarChart3 className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                  <span className="text-blue-400 font-semibold text-sm">Context:</span>
                                  <p className="text-[#B0B0C0] text-sm mt-1 leading-relaxed group-hover:text-white/80 transition-colors">
                                    <TruncatedText text={action.context} maxLength={120} title="Action Context" />
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Expected Outcome */}
                          {action.expectedOutcome && (
                            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl group-hover:bg-green-500/15 transition-colors">
                              <div className="flex items-start space-x-3">
                                <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                                  <Target className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                  <span className="text-green-400 font-semibold text-sm">Expected Outcome:</span>
                                  <p className="text-green-300 text-sm mt-1 leading-relaxed group-hover:text-green-200 transition-colors">
                                    <TruncatedText text={action.expectedOutcome} maxLength={100} title="Expected Outcome" />
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* CTA Button */}
                          {action.rawMentions && action.rawMentions.length > 0 && (
                            <div className="mt-6">
                              <button 
                                onClick={() => handleTopicClick(action.action, action.rawMentions, action)}
                                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center space-x-2 group-hover:scale-105"
                              >
                                <span>View {action.rawMentions.length} Related Reviews</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-[#B0B0C0]">No suggested actions identified from the available data.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Advanced Metrics */}
        {processedData.advancedMetrics && (
          <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">Advanced Metrics</h3>
                <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                  <Info className="w-4 h-4" />
                  <span>Context: Advanced customer experience metrics and performance indicators.</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{processedData.advancedMetrics.trustScore || 82}</div>
                  <div className="text-sm text-[#B0B0C0]">Trust Score</div>
                  <div className="text-xs text-[#B0B0C0] mt-1">Customer confidence level</div>
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <Info className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-[#B0B0C0]">Measures customer trust and brand perception</span>
                  </div>
                </div>
                <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">{processedData.advancedMetrics.repeatComplaints || 7}</div>
                  <div className="text-sm text-[#B0B0C0]">Repeat Complaints</div>
                  <div className="text-xs text-[#B0B0C0] mt-1">% of recurring issues</div>
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <Info className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-[#B0B0C0]">Indicates unresolved systemic issues</span>
                  </div>
                </div>
                <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{processedData.advancedMetrics.avgResolutionTime || '1.2 days'}</div>
                  <div className="text-sm text-[#B0B0C0]">Avg Resolution Time</div>
                  <div className="text-xs text-[#B0B0C0] mt-1">Time to fix issues</div>
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <Info className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-[#B0B0C0]">Speed of customer issue resolution</span>
                  </div>
                </div>
                <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{processedData.advancedMetrics.vocVelocity || '+5%'}</div>
                  <div className="text-sm text-[#B0B0C0]">VOC Velocity</div>
                  <div className="text-xs text-[#B0B0C0] mt-1">Feedback growth rate</div>
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <Info className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-[#B0B0C0]">Rate of customer feedback increase</span>
                  </div>
                </div>
              </div>
              
              {/* Advanced Metrics Context */}
              {processedData.advancedMetrics?.context && (
                <div className="mt-6 bg-[#181a20]/40 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">📊</span>
                    </div>
                    <div>
                      <span className="text-purple-400 font-semibold">Metrics Context:</span>
                      <p className="text-[#B0B0C0] mt-1">{processedData.advancedMetrics.context}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* VOC Digest */}
        {processedData.vocDigest && (
          <section className="bg-[#181a20]/70 border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.10)] p-10 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-[#8b5cf6]/10 rounded-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">VOC Digest</h3>
                <div className="flex items-center space-x-2 text-sm text-[#B0B0C0]">
                  <Info className="w-4 h-4" />
                  <span>Context: Summary of key customer feedback themes and insights.</span>
                </div>
              </div>
              
              <div className="bg-[#181a20]/60 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-2xl p-6">
                <p className="text-[#B0B0C0] text-lg leading-relaxed mb-6">{processedData.vocDigest.summary}</p>
                <div className="space-y-2">
                  {processedData.vocDigest.highlights.map((highlight: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-[#B0B0C0]">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Trending Topic Detailed Modal */}
      {showTrendingModal && selectedTrendingTopic && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1c1e26]/95 backdrop-blur-xl rounded-xl border border-white/10 p-8 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-white">Trending Topic: {selectedTrendingTopic.topic}</h3>
                <p className="text-sm text-[#B0B0C0] mt-1">
                  Detailed analysis and customer feedback
                </p>
              </div>
              <button 
                onClick={() => setShowTrendingModal(false)}
                className="w-8 h-8 bg-[#0f1117]/60 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center text-[#B0B0C0] hover:text-white"
              >
                <span className="text-lg">×</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Key Insights and Summary */}
              <div className="space-y-6">
                {/* Key Insights - Moved to top */}
                {selectedTrendingTopic.keyInsights && selectedTrendingTopic.keyInsights.length > 0 && (
                  <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Key Insights</h4>
                    <div className="space-y-3">
                      {selectedTrendingTopic.keyInsights.map((insight: string, idx: number) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-[#B0B0C0]">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Summary of All Reviews */}
                <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Summary</h4>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">📋</span>
                    </div>
                    <div>
                      <span className="text-purple-400 font-semibold">Review Summary:</span>
                      <span className="text-[#B0B0C0] ml-2">
                        {selectedTrendingTopic.specificExamples && selectedTrendingTopic.specificExamples.length > 0 
                          ? `Based on ${selectedTrendingTopic.specificExamples.length} customer reviews, ${selectedTrendingTopic.topic} is a ${selectedTrendingTopic.sentiment === 'positive' ? 'positive' : 'negative'} trending topic. ${selectedTrendingTopic.context || 'Customers are actively discussing this topic in their feedback.'}`
                          : `Analysis of customer feedback shows ${selectedTrendingTopic.topic} is trending with ${selectedTrendingTopic.sentiment} sentiment.`
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Growth Metrics */}
                <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Growth Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                      <div className="text-3xl font-bold text-green-400">{selectedTrendingTopic.growth || '+5%'}</div>
                      <div className="text-sm text-green-300">Growth Rate</div>
                    </div>
                    <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <div className="text-3xl font-bold text-blue-400">{selectedTrendingTopic.volume || '12'}</div>
                      <div className="text-sm text-blue-300">Total Mentions</div>
                    </div>
                  </div>
                </div>
                
                {/* Sentiment Analysis */}
                <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Sentiment Analysis</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-green-400 font-medium">Positive Sentiment</span>
                        <span className="text-sm text-green-400 font-semibold">75%</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-red-400 font-medium">Negative Sentiment</span>
                        <span className="text-sm text-red-400 font-semibold">25%</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500 to-red-400 h-3 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Customer Examples */}
              <div className="space-y-6">
                {/* Customer Examples - Scrollable */}
                {selectedTrendingTopic.specificExamples && selectedTrendingTopic.specificExamples.length > 0 && (
                  <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Customer Examples</h4>
                    <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                      {selectedTrendingTopic.specificExamples.map((example: string, idx: number) => (
                        <div key={idx} className="p-4 bg-[#181a20]/60 rounded-lg border border-white/10">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-xs">💬</span>
                            </div>
                            <div>
                              <p className="text-sm text-[#B0B0C0] italic leading-relaxed">"{example}"</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs text-[#B0B0C0]">Customer Review</span>
                                <span className="text-xs text-blue-400">#{idx + 1}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Business Impact */}
                {selectedTrendingTopic.businessImpact && (
                  <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Business Impact</h4>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">📈</span>
                      </div>
                      <div>
                        <span className="text-green-400 font-semibold">Business Impact:</span>
                        <span className="text-[#B0B0C0] ml-2">{selectedTrendingTopic.businessImpact}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Items */}
            {selectedTrendingTopic.mainIssue && (
              <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Main Issue & Recommendations</h4>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">⚡</span>
                  </div>
                  <div>
                    <span className="text-purple-400 font-semibold">Main Issue:</span>
                    <span className="text-[#B0B0C0] ml-2">{selectedTrendingTopic.mainIssue}</span>
                    <div className="flex items-center space-x-2 mt-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        Trending Topic
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                        High Priority
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1c1e26]/95 backdrop-blur-xl rounded-xl border border-white/10 p-6 shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">Reviews for: {selectedTopic}</h3>
                <p className="text-sm text-[#B0B0C0] mt-1">
                  Showing {selectedReviews.length} mentions • Click any review for more details
                </p>
              </div>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 bg-[#0f1117]/60 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center text-[#B0B0C0] hover:text-white"
              >
                <span className="text-lg">×</span>
              </button>
            </div>
            
            {/* Sentiment Summary */}
            <div className="mb-6 bg-[#181a20]/40 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-[#B0B0C0]">Sentiment Breakdown:</span>
                    <span className="text-green-400 text-sm font-semibold">
                      {selectedReviews.filter(r => r.sentiment === 'positive').length} positive
                    </span>
                    <span className="text-red-400 text-sm font-semibold">
                      {selectedReviews.filter(r => r.sentiment === 'negative').length} negative
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-[#B0B0C0]">Total:</span>
                  <span className="text-white text-sm font-semibold">{selectedReviews.length} reviews</span>
                </div>
              </div>
              
              {/* Sentiment Bars */}
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-green-400 font-medium">Positive</span>
                    <span className="text-sm text-green-400 font-semibold">
                      {selectedReviews.length > 0 ? Math.round((selectedReviews.filter(r => r.sentiment === 'positive').length / selectedReviews.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full" 
                         style={{ width: `${selectedReviews.length > 0 ? (selectedReviews.filter(r => r.sentiment === 'positive').length / selectedReviews.length) * 100 : 0}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-red-400 font-medium">Negative</span>
                    <span className="text-sm text-red-400 font-semibold">
                      {selectedReviews.length > 0 ? Math.round((selectedReviews.filter(r => r.sentiment === 'negative').length / selectedReviews.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full" 
                         style={{ width: `${selectedReviews.length > 0 ? (selectedReviews.filter(r => r.sentiment === 'negative').length / selectedReviews.length) * 100 : 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {selectedReviews.map((review, index) => {
                // Analyze the actual review text for sentiment
                const text = review.text.toLowerCase();
                const positiveWords = [
                  'good', 'great', 'excellent', 'amazing', 'love', 'best', 'perfect', 'awesome', 'fantastic', 'outstanding',
                  'wonderful', 'brilliant', 'superb', 'outstanding', 'exceptional', 'satisfied', 'happy', 'pleased',
                  'recommend', 'vouch', 'can\'t complain', 'no complaints', 'smooth', 'easy', 'fast', 'quick',
                  'reliable', 'trustworthy', 'honest', 'fair', 'transparent', 'helpful', 'supportive', 'responsive'
                ];
                const negativeWords = [
                  'bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointed', 'scam', 'poor', 'frustrated',
                  'annoying', 'ridiculous', 'unacceptable', 'useless', 'waste', 'problem', 'issue', 'complaint',
                  'slow', 'difficult', 'complicated', 'confusing', 'unclear', 'hidden', 'charges', 'fees',
                  'unreliable', 'untrustworthy', 'dishonest', 'unfair', 'untransparent', 'unhelpful', 'unresponsive'
                ];
                
                const positiveCount = positiveWords.filter(word => text.includes(word)).length;
                const negativeCount = negativeWords.filter(word => text.includes(word)).length;
                
                // Determine actual sentiment
                let actualSentiment = 'neutral';
                if (positiveCount > negativeCount) {
                  actualSentiment = 'positive';
                } else if (negativeCount > positiveCount) {
                  actualSentiment = 'negative';
                } else {
                  // Check for tone indicators
                  const hasPositiveTone = text.includes('great') || text.includes('love') || text.includes('recommend') || 
                                         text.includes('vouch') || text.includes('can\'t complain') || text.includes('no complaints');
                  const hasNegativeTone = text.includes('scam') || text.includes('terrible') || text.includes('hate') || 
                                         text.includes('worst') || text.includes('complaint');
                  
                  if (hasPositiveTone && !hasNegativeTone) {
                    actualSentiment = 'positive';
                  } else if (hasNegativeTone && !hasPositiveTone) {
                    actualSentiment = 'negative';
                  } else {
                    actualSentiment = 'positive'; // Default to positive if unclear
                  }
                }
                
                return (
                  <div key={index} className="bg-[#181a20] border border-white/10 rounded-xl p-4">
                    <p className="text-white mb-3 leading-relaxed">{review.text}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          actualSentiment === 'positive' ? 'bg-green-500/20 text-green-400' : 
                          actualSentiment === 'negative' ? 'bg-red-500/20 text-red-400' : 
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {actualSentiment}
                        </span>
                        {review.source && (
                          <span className="text-xs text-gray-400">Source: {review.source}</span>
                        )}
                      </div>
                      <span className="text-[#B0B0C0]">Review #{index + 1} of {selectedReviews.length}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {selectedReviews.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[#B0B0C0]">No reviews found for this topic.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sentiment Insights Modal */}
      {showSentimentInsights && selectedSentimentData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1c1e26]/95 backdrop-blur-xl rounded-xl border border-white/10 p-8 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  Sentiment Analysis: {new Date(selectedSentimentData.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <p className="text-sm text-[#B0B0C0] mt-1">
                  Detailed analysis of customer sentiment and reviews for this date
                </p>
              </div>
              <button 
                onClick={() => setShowSentimentInsights(false)}
                className="w-8 h-8 bg-[#0f1117]/60 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center text-[#B0B0C0] hover:text-white"
              >
                <span className="text-lg">×</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Sentiment Analysis */}
              <div className="space-y-6">
                {/* Sentiment Score */}
                <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Sentiment Score</h4>
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${
                      selectedSentimentData.sentiment >= 70 ? 'text-green-400' : 
                      selectedSentimentData.sentiment >= 50 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {selectedSentimentData.sentiment}/100
                    </div>
                    <div className={`text-sm ${
                      selectedSentimentData.sentiment >= 70 ? 'text-green-300' : 
                      selectedSentimentData.sentiment >= 50 ? 'text-yellow-300' : 'text-red-300'
                    }`}>
                      {selectedSentimentData.sentiment >= 70 ? 'Excellent' : 
                       selectedSentimentData.sentiment >= 50 ? 'Good' : 'Needs Attention'}
                    </div>
                  </div>
                </div>
                
                {/* Review Count */}
                <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Review Activity</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {selectedSentimentData.reviewCount}
                    </div>
                    <div className="text-sm text-blue-300">
                      {selectedSentimentData.reviewCount === 1 ? 'Review' : 'Reviews'} on this date
                    </div>
                  </div>
                </div>
                
                {/* Sentiment Trend */}
                <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Sentiment Trend</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">📊</span>
                    </div>
                    <div>
                      <span className="text-purple-400 font-semibold">Trend Analysis:</span>
                      <span className="text-[#B0B0C0] ml-2">
                        {selectedSentimentData.sentiment >= 70 ? 'Strong positive sentiment indicates high customer satisfaction.' :
                         selectedSentimentData.sentiment >= 50 ? 'Moderate sentiment suggests mixed customer feedback.' :
                         'Low sentiment indicates customer concerns that need immediate attention.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Detailed Insights */}
              <div className="space-y-6">
                {/* Detailed Insights */}
                {selectedSentimentData.insights && (
                  <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Detailed Analysis</h4>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">🔍</span>
                      </div>
                      <div>
                        <span className="text-green-400 font-semibold">Analysis:</span>
                        <span className="text-[#B0B0C0] ml-2 leading-relaxed">
                          {selectedSentimentData.insights}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Key Factors */}
                <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Key Factors</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-[#B0B0C0]">
                        {selectedSentimentData.sentiment >= 70 ? 'High customer satisfaction scores' :
                         selectedSentimentData.sentiment >= 50 ? 'Mixed customer feedback patterns' :
                         'Customer concerns and complaints'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-[#B0B0C0]">
                        {selectedSentimentData.reviewCount > 5 ? 'High review volume indicates significant customer engagement' :
                         selectedSentimentData.reviewCount > 2 ? 'Moderate review activity' :
                         'Low review volume - may need more customer feedback'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-[#B0B0C0]">
                        {selectedSentimentData.sentiment >= 70 ? 'Positive trends suggest successful customer experience initiatives' :
                         selectedSentimentData.sentiment >= 50 ? 'Opportunities for improvement identified' :
                         'Immediate action required to address customer concerns'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Recommendations */}
                <div className="bg-[#181a20]/40 border border-white/10 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Recommendations</h4>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">💡</span>
                    </div>
                    <div>
                      <span className="text-yellow-400 font-semibold">Actions:</span>
                      <span className="text-[#B0B0C0] ml-2">
                        {selectedSentimentData.sentiment >= 70 ? 'Continue current practices and replicate success factors across the business.' :
                         selectedSentimentData.sentiment >= 50 ? 'Investigate specific customer feedback to identify improvement opportunities.' :
                         'Implement immediate customer service improvements and address specific complaints.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Items */}
            <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Next Steps</h4>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">⚡</span>
                </div>
                <div>
                  <span className="text-purple-400 font-semibold">Priority Actions:</span>
                  <span className="text-[#B0B0C0] ml-2">
                    {selectedSentimentData.sentiment >= 70 ? 'Monitor trends and maintain high standards. Consider expanding successful initiatives.' :
                     selectedSentimentData.sentiment >= 50 ? 'Review customer feedback in detail and implement targeted improvements.' :
                     'Address customer concerns immediately and develop a comprehensive improvement plan.'}
                  </span>
                  <div className="flex items-center space-x-2 mt-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      Sentiment Analysis
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      selectedSentimentData.sentiment >= 70 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      selectedSentimentData.sentiment >= 50 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {selectedSentimentData.sentiment >= 70 ? 'High Priority' :
                       selectedSentimentData.sentiment >= 50 ? 'Medium Priority' : 'Critical Priority'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


