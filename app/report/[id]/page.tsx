'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import ReportPageContent from '../../../components/ReportPageContent'
import Image from 'next/image';
import ReportProgressStepper from '../../../components/ReportProgressStepper'; // Added import
import SourceCard from '../../../components/SourceCard'; // Added import
import Navigation from '@/components/Navigation';
import { RefreshCw } from 'lucide-react';
import MinimalLoadingState from '@/components/MinimalLoadingState';

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

// Define the workflow steps and commentary (top-level)
const workflowSteps = [
  { label: 'Finding review sources with AI', commentary: 'Locating the best review sites for this business using AI.' },
  { label: 'Scraping reviews from sources', commentary: 'Collecting reviews from all discovered platforms.' },
  { label: 'Analyzing customer feedback with AI', commentary: 'AI is analyzing all collected reviews for insights.' },
  { label: 'Generating insights and charts', commentary: 'Creating summaries, themes, and visualizations.' },
  { label: 'Report ready!', commentary: 'Your Voice of Customer report is complete.' }
];

export default function ReportPage() {
  const params = useParams()
  const reportId = params.id as string
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [polling, setPolling] = useState(false)
  const [pollingAttempts, setPollingAttempts] = useState(0)
  const [progressMessage, setProgressMessage] = useState<string>('Initializing your report...')
  const [minProgressTimeElapsed, setMinProgressTimeElapsed] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  // Minimum progress overlay duration (ms)
  const MIN_PROGRESS_DURATION = 5000;

  // Determine current step from progressMessage
  const lowerMsg = (progressMessage || '').toLowerCase();
  let currentStep = 0;
  if (lowerMsg.includes('scraping')) currentStep = 1;
  else if (lowerMsg.includes('analyzing')) currentStep = 2;
  else if (lowerMsg.includes('insights')) currentStep = 3;
  else if (lowerMsg.includes('ready')) currentStep = 4;

  useEffect(() => {
    async function fetchData() {
      try {
        // First try to get the report from voc_reports table
        const { data: vocReport, error: vocError } = await supabase()
          .from('voc_reports')
          .select('*')
          .eq('id', reportId)
          .maybeSingle()

        if (vocError) {
          console.error('Error fetching VOC report:', vocError)
          // If not found in voc_reports, try the old reports table
          const { data: oldReport, error: oldError } = await supabase()
            .from('reports')
            .select('report_data')
            .eq('id', reportId)
            .maybeSingle()

          if (oldError || !oldReport || !oldReport.report_data) {
            // Report not found in either table - start polling for it
            console.log('Report not found in database, starting polling...')
            setProgressMessage('Initializing your report...')
            setPolling(true)
            startPolling()
            return
          }
          setReportData(oldReport.report_data)
        } else if (vocReport) {
          console.log('VOC Report found:', vocReport);
          console.log('Report status:', vocReport.status);
          console.log('Analysis data exists:', !!vocReport.analysis);
          console.log('Analysis data keys:', vocReport.analysis ? Object.keys(vocReport.analysis) : []);
          
          // Check if report has analysis data
          if (vocReport.analysis && Object.keys(vocReport.analysis).length > 0) {
            console.log('Analysis data found, displaying report');
            console.log('Analysis data structure:', Object.keys(vocReport.analysis));
            console.log('Analysis content preview:', {
              executiveSummary: !!vocReport.analysis.executiveSummary,
              keyInsights: vocReport.analysis.keyInsights?.length || 0,
              trendingTopics: vocReport.analysis.trendingTopics?.length || 0,
              mentionsByTopic: vocReport.analysis.mentionsByTopic?.length || 0
            });
            
            // Use the analysis data from voc_reports
            const reportWithSources = {
              ...vocReport,
              detected_sources: vocReport.sources || [], // Map sources to detected_sources for compatibility
              // Ensure analysis data is properly structured
              executiveSummary: vocReport.analysis.executiveSummary,
              keyInsights: vocReport.analysis.keyInsights || [],
              trendingTopics: vocReport.analysis.trendingTopics || [],
              mentionsByTopic: vocReport.analysis.mentionsByTopic || [],
              marketGaps: vocReport.analysis.marketGaps || [],
              sentimentOverTime: vocReport.analysis.sentimentOverTime || [],
              volumeOverTime: vocReport.analysis.volumeOverTime || [],
              advancedMetrics: vocReport.analysis.advancedMetrics,
              suggestedActions: vocReport.analysis.suggestedActions || []
            }
            console.log('Processed report data structure:', Object.keys(reportWithSources));
            setReportData(reportWithSources)
          } else {
            console.log('No analysis data found, starting polling');
            setProgressMessage(vocReport.progress_message || 'Initializing your report...')
            setPolling(true)
            startPolling()
            return
          }
        } else {
          // No report found in voc_reports table - start polling for it
          console.log('No report found in voc_reports, starting polling...')
          setProgressMessage('Initializing your report...')
          setPolling(true)
          startPolling()
          return
        }
      } catch (err: any) {
        console.error('Error fetching report:', err)
        setError(err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err)) || 'Failed to load report')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [reportId])

  useEffect(() => {
    if (polling) {
      setMinProgressTimeElapsed(false);
      const timer = setTimeout(() => setMinProgressTimeElapsed(true), MIN_PROGRESS_DURATION);
      return () => clearTimeout(timer);
    }
  }, [polling]);

  const startPolling = async () => {
    const maxAttempts = 30 // 5 minutes with 10-second intervals
    let attempts = 0

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setError('Report generation timed out. Please try again.')
        setPolling(false)
        return
      }

      try {
        const response = await fetch(`/api/report-status?report_id=${reportId}`)
        const data = await response.json()

        console.log('Polling response:', data)

        // Update progress message from API
        if (data.progress_message) {
          setProgressMessage(data.progress_message)
        }

        console.log('Polling check - status:', data.status, 'analysis_ready:', data.analysis_ready, 'has_analysis:', data.has_analysis);
        
        if (data.status === 'complete' && (data.analysis_ready || data.has_analysis)) {
          console.log('Report is complete, fetching updated data...');
          // Fetch the updated report data
          const { data: updatedReport, error } = await supabase()
            .from('voc_reports')
        .select('*')
            .eq('id', reportId)
        .maybeSingle()

          if (!error && updatedReport) {
            console.log('Updated report analysis data:', Object.keys(updatedReport.analysis || {}));
            const reportWithSources = {
              ...updatedReport,
              detected_sources: updatedReport.sources || [],
              // Ensure analysis data is properly structured
              executiveSummary: updatedReport.analysis?.executiveSummary,
              keyInsights: updatedReport.analysis?.keyInsights || [],
              trendingTopics: updatedReport.analysis?.trendingTopics || [],
              mentionsByTopic: updatedReport.analysis?.mentionsByTopic || [],
              marketGaps: updatedReport.analysis?.marketGaps || [],
              sentimentOverTime: updatedReport.analysis?.sentimentOverTime || [],
              volumeOverTime: updatedReport.analysis?.volumeOverTime || [],
              advancedMetrics: updatedReport.analysis?.advancedMetrics,
              suggestedActions: updatedReport.analysis?.suggestedActions || []
            }
            console.log('Setting report data and stopping polling');
            setReportData(reportWithSources)
            setPolling(false)
            return
          } else {
            console.log('Error fetching updated report or no report found:', error);
          }
        } else if (data.status === 'error') {
          setError('Report generation failed. Please try again.')
          setPolling(false)
        return
        }

        attempts++
        setPollingAttempts(attempts)
        
        // Continue polling
        setTimeout(poll, 10000) // Poll every 10 seconds
    } catch (err) {
        console.error('Polling error:', err)
        attempts++
        setPollingAttempts(attempts)
        setTimeout(poll, 10000)
    }
    }

    poll()
  }

  const regenerateReport = async () => {
    setRegenerating(true);
    setLoading(true);
    
    try {
      // Clear the analysis data to force regeneration
      const { error } = await supabase()
        .from('voc_reports')
        .update({ 
          analysis: null,
          progress_message: 'Regenerating report with updated AI analysis...',
          status: 'processing'
        })
        .eq('id', reportId);
      
      if (error) {
        console.error('Error clearing analysis:', error);
        setError('Failed to regenerate report');
        return;
      }
      
      // Trigger the Edge Function to regenerate the report
      console.log('Calling regenerate API with reportId:', reportId);
      const response = await fetch('/api/regenerate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId })
      });
      
      console.log('Regenerate API response status:', response.status);
      const responseData = await response.json();
      console.log('Regenerate API response:', responseData);
      
      if (!response.ok) {
        console.error('Error triggering regeneration:', responseData);
        setError(`Failed to trigger report regeneration: ${responseData.error || 'Unknown error'}`);
        return;
      }
      
      // Start polling for the new analysis
      setProgressMessage('Regenerating report with updated AI analysis...');
      setPolling(true);
      startPolling();
      
    } catch (err) {
      console.error('Error regenerating report:', err);
      setError('Failed to regenerate report');
    } finally {
      setRegenerating(false);
    }
  };

  // Show loading state while fetching report data
  if (loading && !reportData) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-6">
          <MinimalLoadingState reportId={Array.isArray(params.id) ? params.id[0] : params.id} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-400">Error</h2>
          <p className="text-[#B0B0C0] mb-4 break-all whitespace-pre-wrap">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors mb-4"
          >
            Try Again
          </button>
          <br />
          <a
            href={`mailto:support@execli.com?subject=Bug Report for Report ID: ${reportId}&body=Error: ${encodeURIComponent(error)}%0AReport ID: ${reportId}%0AURL: ${encodeURIComponent(window.location.href)}`}
            className="inline-block mt-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Report Bug
          </a>
        </div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">No report found</h2>
          <p className="text-[#B0B0C0]">The requested report could not be found.</p>
        </div>
      </div>
    )
  }

  // Show the full report using ReportPageContent component
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <Navigation hideLinks={true} />
      <ReportPageContent reportData={reportData} reportId={Array.isArray(params.id) ? params.id[0] : params.id} />
    </div>
  )
} 