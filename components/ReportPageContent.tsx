import React from 'react';
import {
  ExternalLink, RefreshCw, Plus, AlertTriangle, TrendingUp, 
  MessageCircle, Star, Users, BarChart3, Lightbulb, ArrowUpRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ReportPageContent({ report }: { report: any }) {
  // Use sources from the report (mapped from detected_sources for compatibility)
  // Only show sources with real data (hasRealData = true)
  const allSources = report?.sources || report?.detected_sources || [];
  const detectedSources = allSources.filter((source: any) => source.hasRealData !== false);
  // No active sources on first load
  const [activeSources, setActiveSources] = React.useState<any[]>([]);
  // Track which source is being added (for loader)
  const [addingSource, setAddingSource] = React.useState<string | null>(null);
  // Mock user plan (replace with real user plan fetch later)
  const userPlan = 'free'; // or 'pro'
  const planLimits: Record<string, number> = { free: 1, pro: 2 };
  const maxSources = planLimits[userPlan] || 1;
  // For tooltip/message
  const [showLimitMsg, setShowLimitMsg] = React.useState(false);

  // Handler for Add Integration
  const handleAddIntegration = async (src: any) => {
    if (activeSources.length >= maxSources) {
      setShowLimitMsg(true);
      setTimeout(() => setShowLimitMsg(false), 2000);
      return;
    }
    
    setAddingSource(src.platform);
    
    try {
      const response = await fetch('/api/add-source', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          report_id: report.id,
          platform: src.platform,
          user_plan: userPlan
        })
      });

      const result = await response.json();
      
      if (result.error) {
        console.error('Error adding source:', result.error);
        setAddingSource(null);
        // Show error message
        alert(result.error);
        return;
      }

      // Add to active sources immediately
      setActiveSources(prev => [...prev, { ...src, status: 'active' }]);
      
      // Start polling for updated analysis
      pollForUpdatedAnalysis();
      
    } catch (error) {
      console.error('Error adding source:', error);
      setAddingSource(null);
      alert('Failed to add source. Please try again.');
    }
  };

  // Poll for updated analysis when sources are added
  const pollForUpdatedAnalysis = async () => {
    let attempts = 0;
    const maxAttempts = 20; // 2 minutes with 6-second intervals
    
    const poll = async () => {
      if (attempts >= maxAttempts) {
        setAddingSource(null);
        return;
      }

      try {
        const response = await fetch(`/api/report-status?report_id=${report.id}`);
        const data = await response.json();

        if (data.status === 'complete' && data.has_analysis) {
          // Fetch the updated report data
          const { data: updatedReport, error } = await supabase()
            .from('voc_reports')
            .select('*')
            .eq('id', report.id)
            .single();

          if (!error && updatedReport) {
            const reportWithSources = {
              ...updatedReport,
              detected_sources: updatedReport.sources || [],
              analysis: updatedReport.analysis || {}
            };
            // Report data will be updated by parent component
            // For now, just stop the polling
            setAddingSource(null);
            return;
          }
        } else if (data.status === 'error') {
          setAddingSource(null);
          return;
        }

        attempts++;
        setTimeout(poll, 6000); // Poll every 6 seconds
      } catch (err) {
        console.error('Polling error:', err);
        attempts++;
        setTimeout(poll, 6000);
      }
    };

    poll();
  };

  // Get analysis data
  const analysis = report?.analysis || {};
  const executiveSummary = analysis?.executive_summary || {};
  const keyInsights = analysis?.key_insights || [];
  const trendingTopics = analysis?.trending_topics || [];

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Voice of Customer Report</h1>
          <p className="text-xl text-[#B0B0C0] mb-2">{report?.business_name || <span className="animate-pulse bg-[#23263a] rounded w-32 h-6 inline-block" />}</p>
          <p className="text-[#B0B0C0]">
            Generated on {report?.processed_at ? new Date(report.processed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : <span className="animate-pulse bg-[#23263a] rounded w-24 h-4 inline-block" />}
          </p>
        </div>

        {/* Voice of Customer Section - Top Card */}
        {executiveSummary && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <MessageCircle className="w-6 h-6 text-[#3b82f6]" />
              Voice of Customer Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Reviews Card */}
              <div className="bg-[#1c1e26]/60 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#3b82f6]/20 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-[#3b82f6]" />
                  </div>
                  <span className="text-sm text-[#B0B0C0]">Total Reviews</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {executiveSummary.total_reviews || detectedSources.reduce((sum: number, source: any) => sum + (source.estimatedReviews || 0), 0)}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">+12% from last month</span>
                </div>
              </div>

              {/* Overall Sentiment Card */}
              <div className="bg-[#1c1e26]/60 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#8b5cf6]/20 rounded-lg">
                    <Star className="w-6 h-6 text-[#8b5cf6]" />
                  </div>
                  <span className="text-sm text-[#B0B0C0]">Overall Sentiment</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {executiveSummary.overall_sentiment === 'positive' ? 'Positive' : 
                   executiveSummary.overall_sentiment === 'negative' ? 'Negative' : 'Neutral'}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
                    ))}
                  </div>
                  <span className="text-[#B0B0C0]">4.2/5 average</span>
                </div>
              </div>

              {/* Active Sources Card */}
              <div className="bg-[#1c1e26]/60 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#10b981]/20 rounded-lg">
                    <ExternalLink className="w-6 h-6 text-[#10b981]" />
                  </div>
                  <span className="text-sm text-[#B0B0C0]">Active Sources</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {activeSources.length}
                </div>
                <div className="text-sm text-[#B0B0C0]">
                  {activeSources.length === 0 ? 'No sources connected' : 
                   `${activeSources.length} of ${detectedSources.length} detected`}
                </div>
              </div>
            </div>

            {/* Key Findings */}
            {executiveSummary.key_findings && (
              <div className="bg-[#1c1e26]/60 border border-white/10 rounded-xl p-6 backdrop-blur-xl mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-[#f59e0b]" />
                  Key Findings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {executiveSummary.key_findings.map((finding: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#3b82f6] mt-2 flex-shrink-0"></div>
                      <p className="text-[#B0B0C0]">{finding}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Sources Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ExternalLink className="w-6 h-6" />
              Review Sources
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-sm text-[#B0B0C0]">
                {userPlan === 'free' ? 'Free plan: 1 source' : 'Pro plan: Unlimited sources'}
              </div>
              {userPlan !== 'free' && (
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/weekly-sync', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          report_id: report.id,
                          user_plan: userPlan
                        })
                      });

                      const result = await response.json();
                      
                      if (result.error) {
                        alert(result.error);
                      } else {
                        alert('Weekly sync started! You will be notified when complete.');
                      }
                    } catch (error) {
                      console.error('Error starting weekly sync:', error);
                      alert('Failed to start weekly sync. Please try again.');
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Weekly Sync
                </button>
              )}
            </div>
          </div>

          {/* Show active sources if any */}
          {activeSources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {activeSources.map((src: any, i: number) => (
                <div key={i} className="glassmorphic rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">{src.platform}</span>
                    <span className="text-sm text-[#B0B0C0]">{src.estimatedReviews || 0} reviews</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-green-400">Active</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="px-2 py-1 rounded bg-[#23263a] text-white text-xs font-medium flex items-center gap-1 border border-white/10 shadow hover:bg-[#2d3748] transition-colors"
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/add-source', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              report_id: report.id,
                              platform: src.platform,
                              user_plan: userPlan
                            })
                          });

                          const result = await response.json();
                          
                          if (result.error) {
                            alert(result.error);
                          } else {
                            alert('Sync started! Analysis will update shortly.');
                          }
                        } catch (error) {
                          console.error('Error syncing source:', error);
                          alert('Failed to sync source. Please try again.');
                        }
                      }}
                    >
                      <RefreshCw size={14} /> Sync
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-[#181a20]/60 border border-white/10 p-8 text-center text-[#B0B0C0] mb-6">
              {detectedSources.length > 0 ? (
                <>
                  <h3 className="text-xl font-semibold text-white mb-2">No sources connected yet</h3>
                  <p className="mb-4">Activate your first review source to get started. You can add more sources as you upgrade your plan.</p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {detectedSources.map((src: any, i: number) => {
                      const limitReached = activeSources.length >= maxSources;
                      return (
                        <button
                          key={src.platform}
                          className={`px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2 ${addingSource === src.platform || limitReached ? 'opacity-60 cursor-not-allowed' : ''}`}
                          onClick={() => handleAddIntegration(src)}
                          disabled={!!addingSource || limitReached}
                        >
                          {addingSource === src.platform ? <RefreshCw className="animate-spin" size={18} /> : <Plus size={18} />} Add {src.platform}
                        </button>
                      );
                    })}
                  </div>
                  {showLimitMsg && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-yellow-400 text-sm">
                      <AlertTriangle className="w-5 h-5" />
                      You've reached your plan's source limit ({maxSources}). Upgrade to add more.
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-white mb-2">No review sources found</h3>
                  <p className="mb-4">We couldn't find any active review sources for this business. This could be because:</p>
                  <ul className="text-left max-w-md mx-auto mb-4 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#B0B0C0] mt-2 flex-shrink-0"></div>
                      <span>The business doesn't have reviews on major platforms yet</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#B0B0C0] mt-2 flex-shrink-0"></div>
                      <span>Review pages are not publicly accessible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#B0B0C0] mt-2 flex-shrink-0"></div>
                      <span>The business name or URL needs to be more specific</span>
                    </li>
                  </ul>
                  <p className="text-sm">Try updating the business information or check back later when more reviews are available.</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Key Insights Section */}
        {keyInsights.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <Lightbulb className="w-6 h-6 text-[#f59e0b]" />
              Key Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keyInsights.map((insight: any, index: number) => (
                <div key={index} className="bg-[#1c1e26]/60 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      insight.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                      insight.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {insight.sentiment}
                    </div>
                    <span className="text-sm text-[#B0B0C0]">{insight.mentions} mentions</span>
                  </div>
                  <p className="text-white mb-3">{insight.insight}</p>
                  <div className="flex items-center gap-2 text-sm text-[#B0B0C0]">
                    <Users className="w-4 h-4" />
                    <span>Based on customer feedback</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Topics Section */}
        {trendingTopics.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-[#10b981]" />
              Trending Topics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trendingTopics.map((topic: any, index: number) => (
                <div key={index} className="bg-[#1c1e26]/60 border border-white/10 rounded-xl p-4 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{topic.topic}</span>
                    <div className={`flex items-center gap-1 text-sm ${
                      topic.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <ArrowUpRight className={`w-4 h-4 ${topic.trend === 'down' ? 'rotate-90' : ''}`} />
                      <span>{topic.trend === 'up' ? 'Rising' : 'Declining'}</span>
                    </div>
                  </div>
                  <div className="text-sm text-[#B0B0C0]">{topic.mentions} mentions</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Did You Know Section */}
        <div className="bg-gradient-to-r from-[#1c1e26] to-[#23263a] border border-white/10 rounded-xl p-6 backdrop-blur-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#f59e0b]" />
            Did You Know?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6] mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-medium mb-1">Response Time Matters</p>
                <p className="text-sm text-[#B0B0C0]">Customers expect responses within 24 hours. Quick responses can improve your rating by up to 0.5 stars.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#8b5cf6] mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-medium mb-1">Negative Reviews Are Opportunities</p>
                <p className="text-sm text-[#B0B0C0]">Responding to negative reviews can turn dissatisfied customers into loyal advocates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 